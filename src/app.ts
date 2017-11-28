import { Client } from "discord.js";
import * as yargs from "yargs";

import { Database, startDB } from "./persistence";
import { handleMessage } from "./message-handler";

interface Config {
	token: string;
	prefix: string;
}

const config: Config = require("../config.json");
let db: Database;

async function start() {
	db = await startDB(false);
	yargs.commandDir("./commands")
		.recommendCommands(); // this is needed for non-matching commands to produce an error in message-handler
		// also it is nice
		//TODO: figure out how to get it to stop showing node or _mocha in the command help (probably by overriding yargs.$0)

	const client = new Client();
	
	client.on("ready", () => {
		console.log(`discord ready`);
		client.user.setGame(`put game status here`);
	});
	
	client.on("guildCreate", guild => {
		console.log(`discord guildCreate ${guild.name} (id: ${guild.id}).`);
	});
	
	client.on("guildDelete", guild => {
		console.log(`discord guildDelete ${guild.name} (id: ${guild.id})`);
	});
	
	client.on("message", async message => {
		handleMessage(message, db, config);
	});

	client.login(config.token);
}

start().catch(console.error);