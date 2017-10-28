import { Snowflake } from "discord.js";

import { Database } from "./persistence";

class SceneManager {
	private list: any[];

	constructor() {
		this.list = [];
	}

	async create(db: Database, title: string, owner: Snowflake, location: Snowflake) {
		const id = await db.newScene(title, owner, location);
		//TODO: add scene to in-memory list
		return id;
	}

	pause(id: number) {

	}

	resume(id: number) {

	}

	isPaused(id: number) {
		//TODO: implement
		return false;
	}
}

export const sceneManager = new SceneManager();
export default sceneManager;