import { Login, LoginResponse, RegisterUser, RegisterUserResponse } from '../models/auth';
import APIClient from './api-client';

export const registerUserService = new APIClient<RegisterUser, RegisterUserResponse>(
	'/auth/create-user'
);

export const loginService = new APIClient<Login, LoginResponse>('/auth/login');
