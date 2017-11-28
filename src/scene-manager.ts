import { Snowflake } from "discord.js";

import { Database, CharacterRecord, SceneRecord } from "./persistence";
import * as moment from "moment";

const inactiveTimeout = 1000 * 60 * 30; // milliseconds
const inactiveTestInterval = 1000 * 60; // milliseconds

interface Scene {
	record: SceneRecord,
	paused: boolean,
	joined: number[],
	lastActive: moment.Moment
}

//TODO: synchronization
class SceneManager {
	private scenes: Map<number, Scene>;
	private rooms: Map<Snowflake, Scene>;

	constructor() {
		this.scenes = new Map();
		this.rooms = new Map();

		setInterval(this.pauseInactive, inactiveTestInterval);
	}

	async create(db: Database, title: string, owner: Snowflake, location: Snowflake): Promise<number> {
		const id = await db.newScene(title, owner, location);
		const record = await db.getScene(id);

		const scene = {
			record: record,
			paused: true,
			joined: [],
			lastActive: moment()
		};

		this.scenes.set(id, scene);
		return id;
	}

	pause(id: number) {
		this.pauseScene(this.getScene(id));
	}

	resume(id: number) {
		const scene = this.getScene(id);

		const location = scene.record.location;
		if (this.rooms.get(location) !== undefined) throw new Error(`There is already a running scene in <#${location}>.`);
		this.rooms.set(location, scene);

		scene.paused = false;
		scene.lastActive = moment();
	}

	isPaused(id: number): boolean {
		return this.getScene(id).paused;
	}

	async join(scene_id: number, char: CharacterRecord) {
		const scene = this.getScene(scene_id);

		//TODO: export this logic to... somewhere... in the form of a requireApproved(char) function
		if (char.status === "approved") throw new Error(`${char.name} has not yet been approved.`);

		scene.joined.push(char.id);
		scene.lastActive = moment();
	}

	async leave(scene_id: number, char: CharacterRecord) {
		const scene = this.getScene(scene_id);

		const index = scene.joined.indexOf(char.id);
		if (index === -1) throw new Error(`${char.name} was not currently participating in "${scene.record.title}".`);

		scene.joined.splice(index, 1);
		scene.lastActive = moment();
	}

	private getScene(id: number): Scene {
		const scene = this.scenes.get(id);
		if (scene === undefined) throw new Error(`Scene ${id} does not exist or is complete.`);
		return scene;
	}

	private pauseScene(scene: Scene) {
		if (this.rooms.get(scene.record.location) === scene) this.rooms.delete(scene.record.location);
		
		scene.paused = true;
		scene.joined = [];
	}

	private pauseInactive() {
		const now = moment();
		for (let scene of this.rooms.values()) {
			if (now.diff(scene.lastActive) > inactiveTimeout) this.pauseScene(scene);
		}
	}
}

export const sceneManager = new SceneManager();
export default sceneManager;