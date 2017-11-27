CREATE TABLE IF NOT EXISTS characters (
	id INTEGER PRIMARY KEY,
	owner TEXT,
	name TEXT UNIQUE,
	splat TEXT,
	json TEXT,
	status TEXT,
	created INTEGER,
	submitted INTEGER,
	approved INTEGER,
	approver TEXT,
	routed_to TEXT,
	version INTEGER
);

CREATE TABLE IF NOT EXISTS xp_awards (
	id INTEGER PRIMARY KEY,
	character INTEGER,
	amount INTEGER,
	type TEXT,
	status TEXT,
	comment TEXT,
	created INTEGER,
	modified INTEGER,
	modifier TEXT,
	routed_to TEXT,
	FOREIGN KEY(character) REFERENCES characters(id)
);

CREATE TABLE IF NOT EXISTS xp_spends (
	id INTEGER PRIMARY KEY,
	character INTEGER,
	amount INTEGER,
	type TEXT,
	trait TEXT,
	trait_type TEXT,
	old_trait_value INTEGER,
	new_trait_value INTEGER,
	status TEXT,
	comment TEXT,
	created INTEGER,
	modified INTEGER,
	modifier TEXT,
	routed_to TEXT,
	FOREIGN KEY(character) REFERENCES characters(id)
);

CREATE TABLE IF NOT EXISTS scenes (
	id INTEGER PRIMARY KEY,
	owner TEXT,
	title TEXT,
	location TEXT,
	status TEXT,
	created INTEGER,
	completed INTEGER
);

CREATE TABLE IF NOT EXISTS scene_lines (
	id INTEGER PRIMARY KEY,
	scene INTEGER,
	character INTEGER,
	message TEXT,
	type TEXT,
	text TEXT,
	date INTEGER,
	hide INTEGER,
	FOREIGN KEY(scene) REFERENCES scenes(id),
	FOREIGN KEY(character) REFERENCES characters(id)
);