// import { Database, startDB } from "../src/persistence";
import { handleMessage } from "../src/message-handler";
import { Message, Channel, TextChannel, DMChannel, User, Guild, Role } from "../src/discord-mock";
// import { Message, Channel, TextChannel, DMChannel, User, Guild, Role } from "discord.js";

class MockUser implements User {
	bot: false;
	id: string;
	dmChannel: MockDMChannel;

	constructor(name: string) {
		this.id = name;
		this.dmChannel = new MockDMChannel(this);
	}

	async createDM() {
		return this.dmChannel;
	}
}

class MockTextChannel implements TextChannel {
	id: string;
	name: string;
	type: "text";
	responses: string[];

	constructor(id: string, name: string) {
		this.id = id;
		this.name = name;
		this.type = "text";
	}

	async send(content: string) {
		this.responses.push(content);
	}

	reset() {
		this.responses = [];
	}
}

class MockDMChannel implements DMChannel {
	id: string;
	type: "dm";
	responses: string[];

	constructor(user: User) {
		this.id = user.id + "_dm";
		this.type = "dm";
	}

	async send(content: string) {
		this.responses.push(content);
	}

	reset() {
		this.responses = [];
	}
}

export const teahouse = new MockTextChannel("public1", "Teahouse");
export const battlefield = new MockTextChannel("public2", "Battlefield");

export const admin = new MockUser("admin");
export const storyteller = new MockUser("storyteller");
export const player = new MockUser("player");

export function reset() {
	teahouse.reset();
	battlefield.reset();
	admin.dmChannel.reset();
	storyteller.dmChannel.reset();
	player.dmChannel.reset();
}