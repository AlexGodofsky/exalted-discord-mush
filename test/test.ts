import { expect, use } from "chai";
import * as chaiAsPromised from "chai-as-promised";

import * as yargs from "yargs";

import { Database, startDB } from "../src/persistence";
import { handleMessage } from "../src/message-handler";
import { Message, Channel, TextChannel, DMChannel, User, Guild, Role } from "../src/discord-mock";
import { Character } from "../src/character";

import { teahouse, battlefield, admin, storyteller, player, reset as resetChannels } from "./mock";

use(chaiAsPromised);

yargs.commandDir("../src/commands", { extensions: ["ts"] })
	.recommendCommands();

let db: Database;

//TODO: move to separate test config file
const config = {
	prefix: "" // later this will probably need to be something, as we may want the logger to read un-prefixed messages
};

async function send(content: string, user: User, channel: Channel): Promise<Message> {
	const message = {
		author: user,
		content: content,
		channel: channel
	};
	await handleMessage(message, { db: db, guild: <any>null }, config);
	return message;
}

beforeEach("start clean database", async () => {
	db = await startDB(true);
});

beforeEach("clear responses", resetChannels);

describe("char", () => {
	beforeEach("create the new character", async () => {
		await send("char new Johnnie Mortal", player, player.dmChannel);
	});

	describe("new", () => {
		it("should tell me it was successful", async () => {
			expect(player.dmChannel.responses).to.have.lengthOf(1);
			expect(player.dmChannel.responses[0]).to.equal("Successfully created Johnnie!");
		});

		it("should have id of 1", async () => {
			const char = await db.getCharacter("Johnnie");
			expect(char.id).to.equal(1);
		});

		it("should have a name of Johnnie", async () => {
			const char = await db.getCharacter("Johnnie");
			expect(char.name).to.equal("Johnnie");
		});
	});

	describe("set-trait", () => {
		it("should have an Appearance of 5", async () => {
			await send("char set-trait Johnnie app 5", player, player.dmChannel);
			const char = await db.getCharacter("Johnnie");
			expect((<Character>JSON.parse(char.json)).attributes.appearance.value).to.equal(5);
		});
	});
});

describe("fuzzy-matching", () => {
	beforeEach("creating multiple characters", async () => {
		await [
			send("char new Jonathan Mortal", player, player.dmChannel),
			send("char new Nathaniel Solar", player, player.dmChannel)
		];
	});

	// due to a (known) bug in chai-as-promised the rejection still bubbles up to node and shows up in the output
	it("should find no one for 'John'", async () => {
		expect(db.getCharacter("John")).to.eventually.throw('character "John" not found');
	});

	it("should find 'Jonathan' for 'jon'", async () => {
		const char = await db.getCharacter("jon");
		expect(char.name).to.equal("Jonathan");
	});

	it("should find too many people for 'Nathan'", async () => {
		expect(db.getCharacter("Nathan")).to.eventually.throw('multiple characters match "Nathan"');
	});
});

describe("scene", () => {
	beforeEach("create the scene", async () => {
		await send("scene create 'Under the Sea'", storyteller, teahouse);
	});

	describe("create", () => {
		it("should tell me it was successful", async () => {
			expect(teahouse.responses.pop()).to.equal(`Successfully created #1, "Under the Sea", in <#${teahouse.id}>`);
		});

		it("should list 1 scene as running", async () => {
			await send("scene list", player, player.dmChannel);
			expect(player.dmChannel.responses.pop()).to.equal(`Under the Sea, running in <#${teahouse.id}>`);
		});
	});

	describe("rename", () => {});
	describe("conclude", () => {});

	describe("join/leave", () => {
		beforeEach("create characters", async () => {
			await send("char new Johnnie Mortal", player, player.dmChannel);
			//await send("char approve Johnnie", admin, admin.dmChannel);
		});

		it("should tell me that I joined", async () => {
			await send("scene join 1 Johnnie", player, teahouse);
			expect(teahouse.responses.pop()).to.equal(`Johnnie joined scene 1.`);
		});

		it("should tell me that I left", async () => {
			await send("scene join 1 Johnnie", player, teahouse);
			await send("scene leave 1 Johnnie", player, teahouse);
			expect(teahouse.responses.pop()).to.equal(`Johnnie left scene 1.`);
		});

		it("should not let unapproved characters join", async () => {
			await send("char new Bobbie Solar", player, player.dmChannel);
			expect(send("scene join 1 Bobbie", player, teahouse)).to.eventually.throw("Bobbie has not yet been approved.");
		});
	});

	describe("pause/resume", () => {});
});