import * as yargs from "yargs";

import { Context, respond, respondDM } from "../../message-handler";
import { Message } from "../../discord-mock";
import { SceneStatus } from "../../persistence";
import sceneManager from "../../scene-manager";

export const command = "list [status]";
export const aliases: string[] = [];
export const describe = "List scenes";
export const builder = (yargs: yargs.Argv) => {
	(<any>yargs).positional("status", {
		describe: "scene status to list",
		type: "string",
		choices: ["running", "complete"],
		default: "running"
	});
};
export async function handler(argv: yargs.Arguments) {
	try {
		await list(argv.context, argv.message, argv.status);
		argv.resolve();
	} catch (error) {
		await respond(argv.message, error);
		argv.resolve();
	}
};

export async function list(context: Context, message: Message, status: SceneStatus) {
	if (message.channel.type !== "dm") throw Error(`Please keep reporting commands in DMs.`);
	const scenes = await context.db.listScenes(status);
	//TODO: system for resolving location [Snowflake] to channel name
	const response = scenes.map(scene =>
		`${scene.title}, ${scene.status + (sceneManager.isPaused(scene.id) ? " (paused)" : "")} in <#${scene.location}>`
	).join("\n");
	await respond(message, response);
}

export default list;