import { Collection, Snowflake } from "discord.js";

// this file contains the type signature of all of the features of discord.js we actually use
// so that we can build a minimal mock for our tests

export interface Message {
	author: User;
	content: string;
	channel: Channel;
}

export type Channel = TextChannel | DMChannel;

export interface TextChannel {
	id: Snowflake;
	send: (content: string) => Promise<any>;
	name: string;
	type: "text";
}

export interface DMChannel {
	id: Snowflake;
	send: (content: string) => Promise<any>;
	type: "dm";
}

export interface User {
	bot: boolean;
	id: Snowflake;
	createDM: () => Promise<DMChannel>;
}

export interface Guild {
	members: Collection<Snowflake, GuildMember>;
}

export interface GuildMember {
	id: Snowflake;
	roles: Collection<Snowflake, Role>;
	user: User;
}

export interface Role {
	name: string;
}