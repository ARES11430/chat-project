import { UserResponse } from '../models/users';
import APIClient from './api-client';

export const getUsersService = new APIClient<null, UserResponse>('users/all-users');
