import { browser } from '$app/environment';
import { env } from '$env/dynamic/public';
import type { Upgrade } from '@prisma/client';

export const getBaseURL = () => (browser ? env.PUBLIC_EXTERNAL_API_URL : env.PUBLIC_API_URL);
export const capitalize = (str: string) => str.charAt(0).toUpperCase() + str.slice(1);

export const kebabToPascalCase = (str: string) =>
	str.split('-').map((part) => capitalize(part)).join(' ');

export const getLevelsOfUpgrades = (upgrades: Upgrade[], name: string) => {
	return upgrades.find(
		(upgrade) => upgrade.name === name)!.level.toString();
};

export const simulateInfection = (population: number, contaminationPercent: number) => {
	return Math.round(
		(contaminationPercent / 100) * population
	);
}

export const hasDynamicPercentageChance = (percentage: number) => {
	const random = Math.random();
	const threshold = percentage / 100;
	return random < threshold;
}