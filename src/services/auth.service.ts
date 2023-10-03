import prisma from '$lib/server/db';
import type { User } from '@prisma/client';
import type { AxiosResponse } from 'axios';
import axios from 'axios';
import { getBaseURL } from '$lib';
import type {
	AuthResponseData,
	CreateUserPayload,
	LoginBodyPayload,
	RegisterBodyPayload
} from '@models/payload';
import type { ClimatixResponse, ClimatixResponseData } from '$lib/server/response';

const getUserByEmail = (email: string): Promise<User | null> => {
	return prisma.user.findUnique({
		where: {
			email
		}
	});
};

const createUser = async (payload: CreateUserPayload): Promise<User> => {

	return prisma.user.create({
		data: {
			email: payload.email,
			name: payload.name,
			password: payload.password
		}
	});
};

const login = (body: LoginBodyPayload): Promise<AxiosResponse<ClimatixResponseData<AuthResponseData>>> => {
	return axios.post(`${getBaseURL()}/api/auth/login`, body);
};

const register = (body: RegisterBodyPayload): Promise<AxiosResponse<ClimatixResponseData<AuthResponseData>>> => {
	return axios.post(`${getBaseURL()}/api/auth/register`, body);
};


export default { getUserByEmail, createUser, login, register };