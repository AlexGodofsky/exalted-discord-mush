import { Collection, Snowflake } from "discord.js";

import { handleMessage } from "../src/message-handler";
import { Message, Channel, TextChannel, DMChannel, User, Guild, GuildMember, Role } from "../src/discord-mock";
import { roleNames } from "../src/permissions";

class MockUser implements User {
	bot: false;
	id: Snowflake;
	dmChannel: MockDMChannel;

	constructor(name: string) {
		this.id = name;
		this.dmChannel = new MockDMChannel(this);
	}

	async createDM() {
		return this.dmChannel;
	}
}

class MockGuildMember implements GuildMember {
	id: Snowflake;
	roles: Collection<Snowflake, Role>;
	user: User;

	constructor(user: User, roles: Role[]) {
		this.id = user.id;
		this.roles = new Collection(roles.map<[Snowflake, Role]>(role => [role.name, role]));
		this.user = user;
	}
}

class MockTextChannel implements TextChannel {
	id: Snowflake;
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
	id: Snowflake;
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

const setRoles = (user: User, roles: Role[]): [Snowflake, GuildMember] => [user.id, new MockGuildMember(user, roles)];

const adminRole: Role = { name: roleNames.admin };

export const guild: Guild = {
	members: new Collection<Snowflake, GuildMember>([
		setRoles(admin, [adminRole]),
		setRoles(storyteller, []),
		setRoles(player, [])
	])
};

export function reset() {
	teahouse.reset();
	battlefield.reset();
	admin.dmChannel.reset();
	storyteller.dmChannel.reset();
	player.dmChannel.reset();
}