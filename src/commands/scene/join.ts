import * as yargs from "yargs";

import { respond, respondDM } from "../../message-handler";
import { Message } from "../../discord-mock"
import { Database } from "../../persistence";
import sceneManager from "../../scene-manager";

export const command = "join <scene_id> <char_name>";
export const aliases: string[] = [];
export const describe = "Join a scene as a specific character";
export const builder = (yargs: yargs.Argv) => {
	(<any>yargs).positional("scene_id", {
		describe: "the scene id",
		type: "number"
	}).positional("char_name", {
		describe: "the character name or id",
		type: "string"
	});
};
export async function handler(argv: yargs.Arguments) {
	try {
		await join(argv.db, argv.message, argv.scene_id, argv.char_name);
		argv.resolve();
	} catch (error) {
		await respond(argv.message, error);
		argv.resolve();
	}
};

export async function join(db: Database, message: Message, scene_id: number, char_name: string) {
	if (message.channel.type !== "text") throw Error(`Scenes can only exist in one of the public channels.`);
	const char = await db.getCharacter(char_name);
	await sceneManager.join(scene_id, char);
	await respond(message, `${char.name} joined scene ${scene_id}.`);
}

export default join;