import * as yargs from "yargs";

import { Message, respond, respondDM } from "../../message-handler";
import { Database } from "../../persistence";

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
	throw Error("unimplemented");
}

export default create;