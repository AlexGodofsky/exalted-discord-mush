import * as yargs from "yargs";

import { respond, respondDM } from "../../message-handler";
import { Message } from "../../discord-mock"
import { Database } from "../../persistence";

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
	throw Error("unimplemented");
}

export default join;