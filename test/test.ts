import { expect, use } from "chai";
import * as chaiAsPromised from "chai-as-promised";

import * as yargs from "yargs";

import { Database, startDB } from "../src/persistence";
import { Message, handleMessage } from "../src/message-handler";
import { Character } from "../src/character";
import newCharacter from "../src/commands/new-character";

use(chaiAsPromised);

yargs.commandDir("../src/commands", { extensions: ["ts"] })
	.recommendCommands();
//yargs.commandDir('./commands');

let db: Database;
let responses: string[];

//TODO: move to separate test config file
const config = {
	prefix: "" // later this will probably need to be something, as we may want the logger to read un-prefixed messages
};

async function mockResponse(content: string) {
	responses.push(content);
}

const mockChannel = {
	send: mockResponse
};

async function mockMessage(content: string): Promise<Message> {
	const message = {
		author: {
			bot: false,
			id: "test",
			createDM: async () => mockChannel
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
		await mockMessage("new-character Johnnie Mortal");
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
			mockMessage("new-character Jonathan Mortal"),
			mockMessage("new-character Nathaniel Solar")
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
		await mockMessage("new-character Johnnie Mortal");
	});

	it("should have an Appearance of 5", async () => {
		await mockMessage("set-trait Johnnie app 5");
		const char = await db.getCharacter("Johnnie");
		expect((<Character>JSON.parse(char.json)).attributes.appearance.value).to.equal(5);
	});
});


//yargs.parse("new-character Amalthea Solar", { db: db });
//yargs.parse("set-trait thea app 5", { db: db });
//yargs.parse("set-trait thea cha 5", { db: db });
//yargs.parse("set-trait thea man 5", { db: db });
//yargs.parse("set-trait thea ath 5", { db: db });
//yargs.parse("set-trait thea dod 5", { db: db });
//yargs.parse("sheet 1", { db: db });
//db.getCharacter("AMA").then(console.log);