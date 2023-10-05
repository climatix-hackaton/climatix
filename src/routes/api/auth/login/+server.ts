import type { RequestHandler } from '@sveltejs/kit';
import { responseCreator } from '$lib/server/response';
import AuthService from '@services/auth.service';
import { zodParse } from '$lib/server/zod.parser';
import { type LoginDto, loginDto } from '$lib/dto/auth.dto';
import bcrypt from 'bcrypt';
import { signJWTToken } from '$lib/server/jwt';

export const POST: RequestHandler = async ({ request }) => {
	const body = await request.json();
	const parsedBody = zodParse<LoginDto>(body, loginDto);

	if (!parsedBody.isValid) {
		return responseCreator.createResponse('Invalid credentials', 400, parsedBody.message.message);
	}

	const user = await AuthService.getUserByEmail(parsedBody.body.email);
	if (!user) return responseCreator.createResponse('Invalid credentials', 400);

	const isValidPassword = await bcrypt.compare(parsedBody.body.password, user.password);

	if (!isValidPassword) {
		return responseCreator.createResponse('Invalid credentials', 400);
	}

	const token = signJWTToken({ id: user.id, email: user.email, name: user.name, coins: user.coins });
	return responseCreator.createResponse('Login successful', 200, { token });
};