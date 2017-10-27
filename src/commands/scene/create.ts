import * as yargs from "yargs";

import { respond, respondDM } from "../../message-handler";
import { Message } from "../../discord-mock"
import { Database } from "../../persistence";
import sceneManager from "../../scene-manager";

export const command = "create <title>";
export const aliases: string[] = [];
export const describe = "Create a new scene";
export const builder = (yargs: yargs.Argv) => {
	(<any>yargs).positional("title", {
		describe: "the scene title",
		type: "string"
	});
};
export async function handler(argv: yargs.Arguments) {
	try {
		await create(argv.db, argv.message, argv.title);
		argv.resolve();
	} catch (error) {
		await respond(argv.message, error);
		argv.resolve();
	}
};

export async function create(db: Database, message: Message, title: string) {
	if (message.channel.type !== "text") throw Error(`You can only create a scene in one of the public channels.`);
	const id = await sceneManager.create(db, title, message.author.id, message.channel.id);
	await respond(message, `Successfully created #${id}, "${title}", in ${message.channel.name}`);
}

export default create;