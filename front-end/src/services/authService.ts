import { Login, LoginResponse } from '../models/auth';
import APIClient from './api-client';

export const loginService = new APIClient<Login, LoginResponse>('/auth/login');
