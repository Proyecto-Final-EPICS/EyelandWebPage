import { environment } from '@environments/environment';
import { Login, LoginResponse } from '@interfaces/teacher/Auth.interface';
import axios from 'axios';

const { apiTeacherUrl } = environment;

export async function login({
	username,
	password
}: Login): Promise<LoginResponse> {
	const response = await axios.post(
		`${apiTeacherUrl}/login`,
		{
			username,
			password
		},
		{
			timeout: 10000
		}
	);

	if (response.status === 200) {
		return response.data;
	} else {
		throw new Error(response.data);
	}
}
