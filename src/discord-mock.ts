// this file contains the type signature of all of the features of discord.js we actually use
// so that we can build a minimal mock for our tests

export interface Message {
	author: {
		bot: boolean;
		id: string;
		createDM: () => Promise<DMChannel>;
	};
	content: string;
	channel: Channel;
}

export type Channel = TextChannel | DMChannel;

export interface TextChannel {
	id: string;
	send: (content: string) => Promise<any>
	name: string;
	type: "text";
}

export interface DMChannel {
	id: string;
	send: (content: string) => Promise<any>
	type: "dm";
}