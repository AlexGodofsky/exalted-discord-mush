import * as yargs from "yargs";

import { Message, respond, respondDM } from "../message-handler";
import { Database } from "../persistence";
import { newCharacter as char_newCharacter, SplatName } from "../character";

export const command = "new-character <name> <splat>";
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
		await newCharacter(argv.db, argv.message, argv.name, argv.splat);
		argv.resolve();
	} catch (error) {
		await respondDM(argv.message, error);
		argv.resolve();
	}
};

export async function newCharacter(db: Database, message: Message, name: string, splat: SplatName) {
	const char = char_newCharacter(name, splat);
	await db.newCharacter(char, message.author.id);
	await respondDM(message, `Successfully created ${name}!`);
}

export default newCharacter;