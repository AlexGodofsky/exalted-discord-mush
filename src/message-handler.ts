//import { Message } from "discord.js";
import * as yargs from "yargs";

import { Database } from "./persistence";
import { Message } from "./discord-mock";

// just the options necessary for message-handler
interface MessageConfig {
	prefix: string;
}

/** This is the main event handler for the application. */
export async function handleMessage(message: Message, db: Database, config: MessageConfig) {
	if (message.author.bot) return;
	if (config.prefix !== "" && message.content.indexOf(config.prefix) !== 0) return;

	const raw_message = message.content.slice(config.prefix.length).trim();
	const raw_command = (raw_message.match(/([\w-]+)[^\w-]/) || [null])[0];
	
	if (raw_command === null) {
		return;
	}

	// handle these outside of yargs because they will have extended, ordinary text that we don't want to force people to quote
	switch (raw_command) {
		case "ic":
		case "ooc":
			return;
	}

	//TODO: tests have indicated that if given an unrecognized command this hangs, figure out the issue
	await new Promise((resolve, reject) => {
		yargs.parse(raw_message, { db: db, message: message, resolve: resolve, reject: reject }, yargsParseFn);
	});
}

/** Response to a message in the same channel from which it was sent. */
export async function respond(message: Message, response: string | Error) {
	return message.channel.send(typeof response === "string" ? response : response.message);
}

/** Responds to a message via a DM to the author, even if the command was sent in a different channel. */
export async function respondDM(message: Message, response: string | Error) {
	return (await message.author.createDM()).send(typeof response === "string" ? response : response.message);
}

// allows us to capture output (e.g. help info) that would have gone to console
async function yargsParseFn(err: Error | undefined, argv: yargs.Arguments, output: string) {
	try {
		if (output !== "") await respond(argv.message, output);
		// the type signature from @types/yargs is wrong, err can actually be null
		// if we didn't have recommendCommands set, we would get null when no command matched
		// which is really really bad because then nothing ever knows to call resolve()
		//TODO: possibly a timeout? idk
		if (err !== undefined && err !== null) argv.resolve();
	} catch(err2) {
		argv.resolve();
	}
}