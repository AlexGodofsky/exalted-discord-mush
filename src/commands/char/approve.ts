import * as yargs from "yargs";

import { Context, respondDM } from "../../message-handler";
import { Message } from "../../discord-mock";
import { canApproveCharacters } from "../../permissions";

export const command = "approve <name>";
export const aliases: string[] = [];
export const describe = "Approve a submitted character";
export const builder = (yargs: yargs.Argv) => {
	(<any>yargs).positional("name", {
		describe: "the character to approve",
		type: "string"
	});
};

export async function handler(argv: yargs.Arguments) {
	try {
		await approveChar(argv.context, argv.message, argv.name);
		argv.resolve();
	} catch (error) {
		await respondDM(argv.message, error);
		argv.resolve();
	}
};

export async function approveChar(context: Context, message: Message, name: string) {
    const char = await context.db.getCharacter(name);
    var valid = await canApproveCharacters(context.guild, message.author);
    valid = valid && char.status === "submitted";
    var moment = require('moment');
    if(valid){
        moment = moment().valueOf();
        await context.db.approveCharacter(char.name,message.author.id,moment);
        await respondDM(message, `Character "${name}" approved by ${message.author.id}!`);
        }
    else{
        await respondDM(message, `Error approving character "${name}"!`);
        }
}