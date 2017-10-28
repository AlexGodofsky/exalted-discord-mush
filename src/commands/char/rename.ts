import * as yargs from "yargs";

import { respond, respondDM } from "../../message-handler";
import { Message } from "../../discord-mock";
import { Database } from "../../persistence";
import { Character } from "../../character";

export const command = "set-trait <char_name> <new_name>";
export const aliases: string[] = [];
export const describe = "Change a character's name";
export const builder = (yargs: yargs.Argv) => {
	(<any>yargs).positional("char_name", {
		describe: "the character name or id",
		type: "string"
	}).positional("new_name", {
		describe: "the desired character name",
		type: "string",
		coerce: (trait_name: string) => trait_name.toLowerCase()
	});
};
export async function handler(argv: yargs.Arguments) {
	try {
		await rename(argv.db, argv.message, argv.char_name, argv.new_name);
		argv.resolve();
	} catch (error) {
		await respondDM(argv.message, error);
		argv.resolve();
	}
};

export async function rename(db: Database, message: Message, char_name: string, new_name: string) {
	const char = await db.getCharacter(char_name);
	const data: Character = JSON.parse(char.json);
	data.name = new_name;
	await db.updateCharacter(char.id, data, char.version);
}