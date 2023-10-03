import { json } from '@sveltejs/kit';

export class ClimatixResponse {
	createResponse<T>(message: string, code: number, data: T | null = null) {
		return json({
			message,
			code,
			data
		}, { status: code });
	}
}
export const responseCreator = new ClimatixResponse();

export type ClimatixResponseData<T = null> = {
	message: string
	code: number
	data: T
}

export type FormFailure = {
	internalError: string
}
