import Cookies from 'js-cookie';
import jwtDecode from 'jwt-decode';
import { user } from '@stores/user.store';
import type { LayoutLoad } from './$types';
import { COOKEYS } from '$lib/helpers/cookie.helper';
import type { User } from '@models/payload';

export const load: LayoutLoad = () => {
	const token = Cookies.get(COOKEYS.JWT_TOKEN);
	if (!token) return;
	const userObj = jwtDecode<User | null>(token);
	user.set(userObj);
};