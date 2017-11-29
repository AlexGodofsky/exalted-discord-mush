import * as yargs from "yargs";

import { Context, respond, respondDM } from "../../message-handler";
import { Message } from "../../discord-mock";

export const command = "submit <name>";
export const aliases: string[] = [];
export const describe = "Submit an existing character";
export const builder = (yargs: yargs.Argv) => {
	(<any>yargs).positional("name", {
		describe: "name of the character to submit",
		type: "string"
	});
};
export async function handler(argv: yargs.Arguments) {
	try {
		await submit(argv.context, argv.message, argv.name);
		argv.resolve();
	} catch (error) {
		await respondDM(argv.message, error);
		argv.resolve();
	}
};
 
export async function submit(context: Context, message: Message, name: string){
const char = await context.db.getCharacter(name);
const version = char.version;
await context.db.submitCharacter(name, version);
await respondDM(message, `${name} submitted for approval!`);
}