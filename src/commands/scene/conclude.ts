import * as yargs from "yargs";

import { Context, respond, respondDM } from "../../message-handler";
import { Message } from "../../discord-mock";

export const command = "conclude <scene_id>";
export const aliases: string[] = [];
export const describe = "conclude a scene";
export const builder = (yargs: yargs.Argv) => {
	(<any>yargs).positional("scene_id", {
		describe: "the scene id",
		type: "number"
	});
};
export async function handler(argv: yargs.Arguments) {
	try {
		await conclude(argv.context, argv.message, argv.scene_id);
		argv.resolve();
	} catch (error) {
		await respond(argv.message, error);
		argv.resolve();
	}
};

export async function conclude(context: Context, message: Message, scene_id: number) {
	throw Error("unimplemented");
}

export default conclude;