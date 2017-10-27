import * as yargs from "yargs";

import { respond, respondDM } from "../../message-handler";
import { Message } from "../../discord-mock"
import { Database } from "../../persistence";

export const command = "rename <scene_id> <title>";
export const aliases: string[] = [];
export const describe = "Change a scene's title";
export const builder = (yargs: yargs.Argv) => {
	(<any>yargs).positional("scene_id", {
		describe: "the scene id",
		type: "number"
	}).positional("title", {
		describe: "the new title",
		type: "string"
	});
};
export async function handler(argv: yargs.Arguments) {
	try {
		await rename(argv.db, argv.message, argv.scene_id, argv.new_title);
		argv.resolve();
	} catch (error) {
		await respond(argv.message, error);
		argv.resolve();
	}
};

export async function rename(db: Database, message: Message, scene_id: number, new_title: string) {
	throw Error("unimplemented");
}

export default rename;