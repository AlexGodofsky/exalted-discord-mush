import { expect, use } from "chai";
import * as chaiAsPromised from "chai-as-promised";

import * as yargs from "yargs";

import { Database, startDB } from "../src/persistence";
import { handleMessage } from "../src/message-handler";
import { Message, Channel, TextChannel, DMChannel } from "../src/discord-mock";
import { Character } from "../src/character";
import newCharacter from "../src/commands/new-character";

use(chaiAsPromised);

yargs.commandDir("../src/commands", { extensions: ["ts"] })
	.recommendCommands();

let db: Database;
let responses: string[];

//TODO: move to separate test config file
const config = {
	prefix: "" // later this will probably need to be something, as we may want the logger to read un-prefixed messages
};

async function mockResponse(content: string) {
	responses.push(content);
}

const mockChannel: TextChannel = {
	id: "public",
	send: mockResponse,
	name: "Teahouse",
	type: "text"
};

const mockDM: DMChannel = {
	id: "private",
	send: mockResponse,
	type: "dm"
}

async function mockMessage(content: string, channel: Channel): Promise<Message> {
	const message = {
		author: {
			bot: false,
			id: "test",
			createDM: async () => mockDM
		},
		content: content,
		channel: mockChannel
	};
	await handleMessage(message, db, config);
	return message;
}

beforeEach("start clean database", async () => {
	db = await startDB(true);
});

beforeEach("clear responses", () => {
	responses = [];
});

describe("new-character", () => {
	beforeEach("create the new character", async () => {
		await mockMessage("new-character Johnnie Mortal", mockDM);
	});

	it("should tell me it was successful", async () => {
		expect(responses).to.have.lengthOf(1);
		expect(responses[0]).to.equal("Successfully created Johnnie!");
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

describe("fuzzy-matching", () => {
	beforeEach("creating multiple characters", async () => {
		await [
			mockMessage("new-character Jonathan Mortal", mockDM),
			mockMessage("new-character Nathaniel Solar", mockDM)
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

describe("set-trait", () => {
	beforeEach("create the new character", async () => {
		await mockMessage("new-character Johnnie Mortal", mockDM);
	});

	it("should have an Appearance of 5", async () => {
		await mockMessage("set-trait Johnnie app 5", mockDM);
		const char = await db.getCharacter("Johnnie");
		expect((<Character>JSON.parse(char.json)).attributes.appearance.value).to.equal(5);
	});
});

describe("scene", () => {
	beforeEach("create the scene", async () => {
		await mockMessage("scene create 'Under the Sea'", mockChannel);
	});

	describe("create", () => {
		it("should tell me it was successful", async () => {
			expect(responses).to.have.lengthOf(1);
			expect(responses[0]).to.equal(`Successfully created #1, "Under the Sea", in ${mockChannel.name}`);
		});
	});
});