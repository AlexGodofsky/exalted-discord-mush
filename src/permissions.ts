import { Role, User } from "./discord-mock";

export const roleNames = {
	admin: "Admin"
};

export function canST(user: User): boolean {
	return true;
}

export function canApproveCharacters(user: User): boolean {
	return true;
}

export function canApproveXP(user: User): boolean {
	return true;
}