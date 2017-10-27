// this file contains the type signature of all of the features of discord.js we actually use
// so that we can build a minimal mock for our tests

export interface Message {
	author: {
		bot: boolean;
		id: string;
		createDM: () => Promise<DMChannel>;
	};
	content: string;
	channel: TextChannel | DMChannel;
}

export interface Channel {
	id: string;
	send: (content: string) => Promise<any>
}

export interface TextChannel extends Channel {
	name: string;
	type: "text";
}

export interface DMChannel extends Channel {
	type: "dm";
}