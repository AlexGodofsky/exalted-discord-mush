import * as yargs from "yargs";

import { respond, respondDM } from "../../message-handler";
import { Message } from "../../discord-mock"
import { Database } from "../../persistence";

export const command = "pause <scene_id>";
export const aliases: string[] = [];
export const describe = "pause a scene";
export const builder = (yargs: yargs.Argv) => {
	(<any>yargs).positional("scene_id", {
		describe: "the scene id",
		type: "number"
	});
};
export async function handler(argv: yargs.Arguments) {
	try {
		await pause(argv.db, argv.message, argv.scene_id);
		argv.resolve();
	} catch (error) {
		await respond(argv.message, error);
		argv.resolve();
	}
};

export async function pause(db: Database, message: Message, scene_id: number) {
	throw Error("unimplemented");
}

export default pause;