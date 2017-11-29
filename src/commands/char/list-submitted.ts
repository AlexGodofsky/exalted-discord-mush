import * as yargs from "yargs";

import { Context, respond, respondDM } from "../../message-handler";
import { Message } from "../../discord-mock";

export const command = "list-submitted";
export const aliases: string[] = [];
export const describe = "list all submitted characters";

export async function handler(argv: yargs.Arguments) {
	try {
		await listSubmitted(argv.context, argv.message);
		argv.resolve();
	} catch (error) {
		await respondDM(argv.message, error);
		argv.resolve();
	}
};
 
//export async function submit(context: Context, message: Message, name: string){
//const char = await context.db.getCharacter(name);
//const version = char.version;
//await context.db.submitCharacter(name, version);
//await respondDM(message, `${name} submitted for approval!`);
//}

export async function listSubmitted(context: Context, message: Message){
    const submitted = await context.db.listSubmitted(message.author.id);
    var response = "";
    for(let i in submitted){
        if(i !== "0")
            response += ", ";
        
        response += submitted[parseInt(i)].name;
    }
    await respondDM(message, response);
}
    