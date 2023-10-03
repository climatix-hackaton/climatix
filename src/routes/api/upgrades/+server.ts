import type { RequestHandler } from '@sveltejs/kit';
import UpgradeService from '@services/upgrade.service';
import { responseCreator } from '$lib/server/response';
import { verifyToken } from '$lib/helpers/auth.helper';

export const GET: RequestHandler = async ({ request }) => {
	const cookie = request.headers.get('authorization');
	const tokenVerifier = verifyToken(cookie ?? '');
	if (!tokenVerifier.isValid) return responseCreator.createResponse('Unauthorized', 401);

	const upgrades = await UpgradeService.getUpgrades(tokenVerifier.payload.id);
	return responseCreator.createResponse('', 200, upgrades);
};