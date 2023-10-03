import prisma from '$lib/server/db';
import axios, { type AxiosResponse } from 'axios';
import { getBaseURL } from '$lib';
import type { ClimatixResponseData } from '$lib/server/response';
import type { UpgradePayload } from '@models/payload';
import type { Upgrade } from '@prisma/client';

const getUpgrades = (userId: string) => {
	return prisma.upgrade.findMany({
		where: { userId }
	});
};

const getAllUpgrades = (token: string | undefined): Promise<AxiosResponse<ClimatixResponseData<Upgrade[]>>> => {
	return axios.get(`${getBaseURL()}/api/upgrades`, {
		headers: { Authorization: token }
	});
};

export default {
	getUpgrades,
	getAllUpgrades
};