import * as yargs from "yargs";

import { Message, respond, respondDM } from "../message-handler";
import { Database } from "../persistence";
import { AbilityName, AttributeName, Character, Dots0to5 } from "../character";

export const command = "set-trait <char_name> <trait_name> <value>";
export const aliases: string[] = [];
export const describe = "Change a trait with a numerical rating";
export const builder = (yargs: yargs.Argv) => {
	(<any>yargs).positional("char_name", {
		describe: "the character name or id",
		type: "string"
	}).positional("trait_name", {
		describe: "the name of the trait to modify, or a unique prefix",
		type: "string",
		coerce: (trait_name: string) => trait_name.toLowerCase()
	}).positional("value", {
		describe: "the new value of the trait",
		type: "number",
		choices: [0, 1, 2, 3, 4, 5]
	});
};
export async function handler(argv: yargs.Arguments) {
	try {
		await setTrait(argv.db, argv.message, argv.char_name, argv.trait_name, argv.value);
		argv.resolve();
	} catch (error) {
		await respondDM(argv.message, error);
		argv.resolve();
	}
};

export async function setTrait(db: Database, message: Message, char_name: string, trait_name: string, value: Dots0to5) {
	const char = await db.getCharacter(char_name);
	const data: Character = JSON.parse(char.json);

	let matched = false;
	
	for (let name in data.attributes) {
		const attrib = data.attributes[<AttributeName>name];
		if (name.startsWith(trait_name)) {
			if (matched) throw new Error(`mutliple traits match "${trait_name}"`);
			matched = true;
			if (value === 0) throw new Error(`cannot set an attribute to 0`);
			attrib.value = value;
		}
	}

	const abilities = Object.assign({}, data.abilities, data.crafts, data.martialArts);
	for (let name in abilities) {
		const abil = abilities[name];
		if (name.startsWith(trait_name)) {
			if (matched) throw new Error(`mutliple traits match "${trait_name}"`);
			matched = true;
			abil.value = value;
		}
	}

	await db.updateCharacter(char.id, data);
}