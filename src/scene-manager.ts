import { Snowflake } from "discord.js";

import { Database } from "./persistence";

class SceneManager {
	constructor() {

	}

	async create(db: Database, title: string, owner: Snowflake, location: Snowflake) {
		const id = await db.newScene(title, owner, location);
		//TODO: add scene to in-memory list
		return id;
	}
}

export const sceneManager = new SceneManager();
export default sceneManager;