import * as yargs from "yargs";

import { Message, respond, respondDM } from "../message-handler";
import { Database } from "../persistence";
import { AbilityName, AttributeName, Character } from "../character";

export const command = "sheet <name>";
export const aliases: string[] = [];
export const describe = "Look at a character's sheet";
export const builder = (yargs: yargs.Argv) => {
	(<any>yargs).positional("name", {
		describe: "character's name, or a string that matches it",
		type: "string"
	});
};
export async function handler(argv: yargs.Arguments) {
	try {
		await sheet(argv.db, argv.message, argv.name);
		argv.resolve();
	} catch (error) {
		await respondDM(argv.message, error);
		argv.resolve();
	}
};

export async function sheet(db: Database, message: Message, name: string) {
	const char = await db.getCharacter(name);
	const data: Character = JSON.parse(char.json);
	
	const str = `${data.name}, ${data.splat}
Attributes:
${attributes`${data}`}
Abilities:
${abilities`${data}`}
Crafts:
${crafts`${data}`}
Martial Arts:
${martialArts`${data}`}
`;
	await respondDM(message, str);
}

function attributes(strings: TemplateStringsArray, data: Character) {
	const lines: string[] = [];
	for (let name in data.attributes) {
		let attrib = data.attributes[<AttributeName>name];
		lines.push(proper(attrib.name) + " " + dots(attrib.value));
	}
	return lines.join("\n");
}

function abilities(strings: TemplateStringsArray, data: Character) {
	const lines: string[] = [];
	for (let name in data.abilities) {
		let abil = data.abilities[<AbilityName>name];
		if (abil.value > 0) lines.push(proper(abil.name) + " " + dots(abil.value));
	}
	return lines.join("\n");
}

function crafts(strings: TemplateStringsArray, data: Character) {
	const lines: string[] = [];
	for (let name in data.crafts) {
		let craft = data.crafts[name];
		if (craft.value > 0) lines.push(proper(craft.name) + " " + dots(craft.value));
	}
	return lines.join("\n");
}

function martialArts(strings: TemplateStringsArray, data: Character) {
	const lines: string[] = [];
	for (let name in data.martialArts) {
		let art = data.martialArts[name];
		if (art.value > 0) lines.push(proper(art.name) + " " + dots(art.value));
	}
	return lines.join("\n");
}

function proper(str: String) {
	return str[0].toUpperCase() + str.slice(1);
}

function dots(num: number) {
	return "\u2022".repeat(num);
}