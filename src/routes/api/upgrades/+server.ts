import type { RequestHandler } from '@sveltejs/kit';
import UpgradeService from '@services/upgrade.service';
import { responseCreator } from '$lib/server/response';
import { verifyToken } from '$lib/helpers/auth.helper';
import { zodParse } from '$lib/server/zod.parser';
import type { UpgradeDto } from '$lib/dto/upgrade.dto';
import { upgradeDto } from '$lib/dto/upgrade.dto';
import prisma from '$lib/server/db';
import { signJWTToken } from '$lib/server/jwt';

export const GET: RequestHandler = async ({ request }) => {
	const cookie = request.headers.get('authorization');
	const tokenVerifier = verifyToken(cookie ?? '');
	if (!tokenVerifier.isValid) return responseCreator.createResponse('Unauthorized', 401);

	const upgrades = await UpgradeService.getUpgradesByUserId(tokenVerifier.payload.id);
	return responseCreator.createResponse('', 200, upgrades);
};

export const PUT: RequestHandler = async ({ request }) => {
	const cookie = request.headers.get('authorization');
	const tokenVerifier = verifyToken(cookie ?? '');
	if (!tokenVerifier.isValid) return responseCreator.createResponse('Unauthorized', 401);

	const body = await request.json();
	const parsedBody = zodParse<UpgradeDto>(body, upgradeDto);

	if (!parsedBody.isValid) return responseCreator.createResponse('Invalid body', 400);

	const actualUpgrade = await prisma.upgrade.findUnique({
		where: { id: parsedBody.body.upgradeId }
	});

	if (!actualUpgrade) return responseCreator.createResponse('Upgrade not found', 404);

	await prisma.user.update({
		where: {
			id: tokenVerifier.payload.id
		},
		data: {
			coins: tokenVerifier.payload.coins - actualUpgrade.cost * (parsedBody.body.type === 'up' ? 1 : 0.5)
		}
	});

	await prisma.upgrade.update({
		where: {
			id: actualUpgrade.id,
			userId: actualUpgrade.userId
		},
		data: {
			cost: actualUpgrade.cost * (parsedBody.body.type === 'up' ? 2 : 0.5),
			level: actualUpgrade.level + (parsedBody.body.type === 'up' ? 1 : -1)
		}
	});

	const token = signJWTToken({
		coins: tokenVerifier.payload.coins - actualUpgrade.cost * (parsedBody.body.type === 'up' ? 1 : 0.5),
		id: tokenVerifier.payload.id,
		email: tokenVerifier.payload.email,
		name: tokenVerifier.payload.name
	});

	return responseCreator.createResponse('Successfully updated', 200, token);
};