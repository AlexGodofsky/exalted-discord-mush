import * as yargs from "yargs";

export const command = "scene <command>";
export const aliases: string[] = [];
export const describe = "Manage scenes";
export const builder = (yargs: yargs.Argv) => {
	// extensions option 'ts' for when it's run under test
	return yargs.commandDir("scene", { extensions: ['js', 'ts'] });
};
export async function handler(argv: yargs.Arguments) {};