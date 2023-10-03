import type { Upgrade } from '@prisma/client';

export type LoginBodyPayload = {
	email: string,
	password: string
}

export type RegisterBodyPayload = {
	email: string,
	name: string,
	password: string,
	verifyPassword: string
}

export type AuthResponseData = {
	token: string
}

export type UpgradePayload = {
	upgrades: Upgrade[]
}

export type JWTPayload = {
	id: string;
	email: string;
	name: string;
}

export type User = JWTPayload

export type CreateUserPayload = {
	email: string,
	name: string,
	password: string
}