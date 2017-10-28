import * as yargs from "yargs";

import { respond, respondDM } from "../../message-handler";
import { Message } from "../../discord-mock";
import { Database } from "../../persistence";
import { newCharacter , SplatName } from "../../character";

export const command = "new <name> <splat>";
export const aliases: string[] = [];
export const describe = "Create a new character";
export const builder = (yargs: yargs.Argv) => {
	(<any>yargs).positional("name", {
		describe: "the desired character name",
		type: "string"
	}).positional("splat", {
		describe: "the splat of your new charater",
		type: "string",
		choices: ["mortal", "solar"],
		coerce: (splat: string) => splat.toLowerCase()
	});
};
export async function handler(argv: yargs.Arguments) {
	try {
		await newChar(argv.db, argv.message, argv.name, argv.splat);
		argv.resolve();
	} catch (error) {
		await respondDM(argv.message, error);
		argv.resolve();
	}
};

export async function newChar(db: Database, message: Message, name: string, splat: SplatName) {
	const char = newCharacter(name, splat);
	await db.newCharacter(char, message.author.id);
	await respondDM(message, `Successfully created ${name}!`);
}

export default newChar;