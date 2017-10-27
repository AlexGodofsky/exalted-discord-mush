type FavorOption = "normal" | "favored" | "supernal";

export type SplatName = "mortal" | "solar";

const MortalSplat = {
	name: "mortal",
	attribFaveOptions: ["normal"],
	abilFaveOptions: ["normal", "favored"]
}

const SolarSplat = {
	name: "solar",
	attribFaveOptions: ["normal"],
	abilFaveOptions: ["normal", "favored", "supernal"]
}

export type Dots0to5 = 0 | 1 | 2 | 3 | 4 | 5;
export type Dots1to5 = 1 | 2 | 3 | 4 | 5;
export type Dots0to10 = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;

type TraitType = "essence" | "willpower" | "attribute" | "ability" | "craft" | "martialArt" | "merit";

interface Trait {
	readonly name: string,
	type: TraitType,
	value: Dots0to10,
	originalValue?: Dots0to10
}

type PhysicalAttributeName = "strength" | "dexterity" | "stamina";
type SocialAttributeName = "charisma" | "manipulation" | "appearance";
type MentalAttributeName = "perception" | "intelligence" | "wits";
export type AttributeName = PhysicalAttributeName | SocialAttributeName | MentalAttributeName;

interface Attribute {
	readonly name: AttributeName;
	value: Dots1to5;
	originalValue?: Dots1to5;
	tag: FavorOption;
}

export type AbilityName = "archery" | "brawl" | "melee" | "thrown" | "war"
	| "integrity" | "performance" | "presence" | "resistance" | "survival"
	| "investigation" | "lore" | "medicine" | "occult"
	| "athletics" | "awareness" | "dodge" | "larceny" | "stealth"
	| "bureaucracy" | "linguistics" | "ride" | "sail" | "socialize";

type CraftName = string;
type MartialArtsName = string;

interface Ability {
	readonly name: AbilityName;
	value: Dots0to5;
	originalValue?: Dots0to5;
	tag: FavorOption;
}

interface Craft {
	readonly name: CraftName;
	value: Dots0to5;
	originalValue?: Dots0to5;
}

interface MartialArt {
	readonly name: MartialArtsName;
	value: Dots0to5;
	originalValue?: Dots0to5;
}

export interface Character {
	name: string;
	splat: SplatName,
	attributes: {
		[P in AttributeName]: Attribute
	},
	abilities: {
		[P in AbilityName]: Ability
	},
	crafts: {
		[P in CraftName]: Craft
	},
	craftTag: FavorOption,
	martialArts: {
		[P in MartialArtsName]: MartialArt
	},
	martialArtsTag: FavorOption
}

export function newCharacter(name: string, splat: SplatName): Character {
	return {
		name: name,
		splat: splat,
		attributes: {
			strength: { name: "strength", value: 1, tag: "normal" },
			dexterity: { name: "dexterity", value: 1, tag: "normal" },
			stamina: { name: "stamina", value: 1, tag: "normal" },
			charisma: { name: "charisma", value: 1, tag: "normal" },
			manipulation: { name: "manipulation", value: 1, tag: "normal" },
			appearance: { name: "appearance", value: 1, tag: "normal" },
			perception: { name: "perception", value: 1, tag: "normal" },
			intelligence: { name: "intelligence", value: 1, tag: "normal" },
			wits: { name: "wits", value: 1, tag: "normal" }
		},
		abilities: {
			archery: { name: "archery", value: 0, tag: "normal" },
			brawl: { name: "brawl", value: 0, tag: "normal" },
			melee: { name: "melee", value: 0, tag: "normal" },
			thrown: { name: "thrown", value: 0, tag: "normal" },
			war: { name: "war", value: 0, tag: "normal" },
			integrity: { name: "integrity", value: 0, tag: "normal" },
			performance: { name: "performance", value: 0, tag: "normal" },
			presence: { name: "presence", value: 0, tag: "normal" },
			resistance: { name: "resistance", value: 0, tag: "normal" },
			survival: { name: "survival", value: 0, tag: "normal" },
			investigation: { name: "investigation", value: 0, tag: "normal" },
			lore: { name: "lore", value: 0, tag: "normal" },
			medicine: { name: "medicine", value: 0, tag: "normal" },
			occult: { name: "occult", value: 0, tag: "normal" },
			athletics: { name: "athletics", value: 0, tag: "normal" },
			awareness: { name: "awareness", value: 0, tag: "normal" },
			dodge: { name: "dodge", value: 0, tag: "normal" },
			larceny: { name: "larceny", value: 0, tag: "normal" },
			stealth: { name: "stealth", value: 0, tag: "normal" },
			bureaucracy: { name: "bureaucracy", value: 0, tag: "normal" },
			linguistics: { name: "linguistics", value: 0, tag: "normal" },
			ride: { name: "ride", value: 0, tag: "normal" },
			sail: { name: "sail", value: 0, tag: "normal" },
			socialize: { name: "socialize", value: 0, tag: "normal" }
		},
		crafts: {
		},
		craftTag: "normal",
		martialArts: {
		},
		martialArtsTag: "normal"
	};
}