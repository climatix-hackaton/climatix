import type { PageServerLoad } from './$types';
import UpgradeService from '@services/upgrade.service';
import { COOKEYS } from '$lib/helpers/cookie.helper';
import { redirect } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ cookies }) => {
	const jwtToken = cookies.get(COOKEYS.JWT_TOKEN);

	const response = await UpgradeService.getAllUpgrades(jwtToken)
		.catch(() => {
			return undefined;
		});

	if (!response) {
		cookies.delete(COOKEYS.JWT_TOKEN);
		throw redirect(303, '/login');
	}

	return {
		upgrades: response.data.data
	}
};