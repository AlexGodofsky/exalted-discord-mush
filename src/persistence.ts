import * as sqlite3 from "sqlite";
import { Database as Driver } from "sqlite3";
import * as moment from "moment";
import { Snowflake } from "discord.js";

import { Character, SplatName } from "./character";

export type CharacterStatus = "new" | "submitted" | "approved";

export interface CharacterRecord {
	id: number,
	owner: Snowflake,
	name: string,
	splat: SplatName,
	json: string,
	status: CharacterStatus,
	created: number,
	approved: number,
	approver: string,
	routed_to: string
}

export type SceneStatus = "running" | "complete";

export class Database {
	private db: sqlite3.Database;
	private driver: Driver;

	constructor(db: sqlite3.Database) {
		this.db = db;
		this.driver = (<any>db).driver;
	}

	async getCharacter(identifier: number | string): Promise<CharacterRecord> {
		if (typeof identifier === "number" || /\d+/.test(identifier)) {
			const id = Number(identifier);
			const result = await this.db.get<CharacterRecord | undefined>(
				`SELECT * FROM characters WHERE id = $id`, {
				$id: id
			});
			
			if (result === undefined) throw new Error(`character ${identifier} not found`);
			return result;
		} else {
			const results = await this.db.all<CharacterRecord>(
				`SELECT * FROM characters WHERE name LIKE $pattern`, {
				$pattern: "%" + identifier.replace(/%_/g, "") + "%"
			});
			
			if (results.length === 0) throw new Error(`character "${identifier}" not found`);
			if (results.length === 1) return results[0];
			else throw new Error(`multiple characters match "${identifier}"`);
		}
	}

	async newCharacter(char: Character, owner: Snowflake): Promise<void> {
		//TODO: like newScene make this return the new id
		await this.db.run(
			`INSERT INTO characters (owner, name, splat, json, status, created)
			 VALUES ($owner, $name, $splat, $json, $status, $created)`, {
			$owner: owner,
			$name: char.name,
			$splat: char.splat,
			$json: JSON.stringify(char),
			$status: "new",
			$created: moment().valueOf()
		});
	}

	async updateCharacter(id: number, char: Character): Promise<void> {
		await this.db.run(
			`UPDATE characters SET name = $name, splat = $splat, json = $json WHERE id = $id`, {
			$id: id,
			$name: char.name,
			$splat: char.splat,
			$json: JSON.stringify(char)
		});
	}

	async newScene(title: string, owner: Snowflake, location: Snowflake): Promise<number> {
		//TODO: stress test this to make sure the serialization guarantee actually works
		return new Promise<number>((resolve, reject) => {
			this.driver.serialize(async () => {
				this.db.run(
					`INSERT INTO scenes (owner, title, location, status, created)
					VALUES ($owner, $title, $location, $status, $created);`, {
					$owner: owner,
					$title: title,
					$location: location,
					$status: "running",
					$created: moment().valueOf()
				});
				resolve((await this.db.get(`SELECT last_insert_rowid() as id;`)).id);
			});
		});
		//alternate code for when we do the stress test, to verify that we're capable of detecting races at all
		// await this.db.run(
		// 	`INSERT INTO scenes (owner, title, location, status, created)
		// 	VALUES ($owner, $title, $location, $status, $created);`, {
		// 	$owner: owner,
		// 	$title: title,
		// 	$location: location,
		// 	$status: "running",
		// 	$created: moment().valueOf()
		// });
		// return (await this.db.get(`SELECT last_insert_rowid() as id;`)).id;
	}
}

export async function startDB(clean: boolean): Promise<Database> {
	const sqlite = await sqlite3.open("./data.sqlite");

	//TODO: compile the JSON1 extension for sqlite and include binary
	//await loadJsonExtension(sqlite);

	await sqlite.run(`PRAGMA foreign_keys = false`);

	if (clean) await Promise.all([
		sqlite.run(`DROP TABLE IF EXISTS characters`),
		sqlite.run(`DROP TABLE IF EXISTS xp_awards`),
		sqlite.run(`DROP TABLE IF EXISTS xp_spends`),
		sqlite.run(`DROP TABLE IF EXISTS scenes`),
		sqlite.run(`DROP TABLE IF EXISTS scene_lines`)
	]);

	await Promise.all([
		sqlite.run(`CREATE TABLE IF NOT EXISTS characters
					(id INTEGER PRIMARY KEY, owner TEXT, name TEXT UNIQUE, splat TEXT, json TEXT,
						status TEXT, created INTEGER, submitted INTEGER, approved INTEGER, approver TEXT,
						routed_to TEXT)`),
		sqlite.run(`CREATE TABLE IF NOT EXISTS xp_awards
					(id INTEGER PRIMARY KEY, character INTEGER, amount INTEGER, type TEXT,
						status TEXT, comment TEXT, created INTEGER, modified INTEGER, modifier TEXT,
						routed_to TEXT,
					FOREIGN KEY(character) REFERENCES characters(id))`),
		sqlite.run(`CREATE TABLE IF NOT EXISTS xp_spends
					(id INTEGER PRIMARY KEY, character INTEGER, amount INTEGER, type TEXT,
						trait TEXT, trait_type TEXT, old_trait_value INTEGER, new_trait_value INTEGER,
						status TEXT, comment TEXT, created INTEGER, modified INTEGER, modifier TEXT,
						routed_to TEXT,
					FOREIGN KEY(character) REFERENCES characters(id))`),
		sqlite.run(`CREATE TABLE IF NOT EXISTS scenes
					(id INTEGER PRIMARY KEY, owner TEXT, title TEXT, location TEXT, status TEXT,
						created INTEGER, completed INTEGER)`),
		sqlite.run(`CREATE TABLE IF NOT EXISTS scene_lines
					(id INTEGER PRIMARY KEY, scene INTEGER, character INTEGER, message TEXT, type TEXT,
						text TEXT, date INTEGER, hide INTEGER,
					FOREIGN KEY(scene) REFERENCES scenes(id),
					FOREIGN KEY(character) REFERENCES characters(id))`)
	]);

	await sqlite.run(`PRAGMA foreign_keys = true`);

	return new Database(sqlite);
}

async function loadJsonExtension(db: sqlite3.Database) {
	return new Promise((resolve, reject) => {
		(<any>db).driver.loadExtension("json1", (err: any) => {
			if (err) reject(err);
			else resolve();
		});
	});
}