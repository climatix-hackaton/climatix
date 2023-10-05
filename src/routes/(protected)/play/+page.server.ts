import type { PageServerLoad } from './$types';
import UpgradeService from '@services/upgrade.service';
import type { Action, Actions } from '@sveltejs/kit';
import prisma from '$lib/server/db';
import { signJWTToken } from '$lib/server/jwt';
import { COOKEYS, defaultCookiesOptions } from '$lib/helpers/cookie.helper';
import { redirect } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ locals }) => {
	const upgrades = await UpgradeService.getUpgradesByUserId(locals.user?.id ?? '');

	return {
		upgrades,
	};
};

const earnCoins: Action = async ({ request, locals, cookies }) => {
	const form = await request.formData();
	const formData = Object.fromEntries([...form.entries()]) as { coins: string };

	await prisma.user.update({
		where: {
			id: locals.user?.id
		},
		data: {
			coins: +formData.coins + (locals.user?.coins ?? 0)
		}
	});

	const token = signJWTToken(
		{ id: locals.user?.id ?? '', coins: (locals.user?.coins ?? 0) + +formData.coins, name: locals.user?.name ?? '', email: locals.user?.email ?? '' }
	);

	cookies.set(COOKEYS.JWT_TOKEN, token, defaultCookiesOptions);

	throw redirect(303, '/')
};

export const actions: Actions = {
	earnCoins
};