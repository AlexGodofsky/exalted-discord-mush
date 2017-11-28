import { User, Guild, Role } from "./discord-mock";

export const roleNames = {
	admin: "Admin"
};

function getRoles(guild: Guild, user: User): string[] {
	const gm = guild.members.get(user.id);
	if (gm === undefined) return [];
	return gm.roles.array().map(role => role.name);
}

export function canPlay(guild: Guild, user: User): boolean {
	return getRoles(guild, user).length > 0;
}

export function canST(guild: Guild, user: User): boolean {
	return getRoles(guild, user).length > 0;
}

export function canApproveCharacters(guild: Guild, user: User): boolean {
	return getRoles(guild, user).includes(roleNames.admin);
}

export function canApproveXP(guild: Guild, user: User): boolean {
	return getRoles(guild, user).includes(roleNames.admin);
}