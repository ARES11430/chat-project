import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { UserResponse } from '../models/users';
import { getUsersService } from '../services/userService';

const useUsers = () => {
	return useQuery<UserResponse, Error>({
		queryKey: ['users'],
		queryFn: () => {
			return getUsersService.get();
		},
		placeholderData: keepPreviousData
	});
};

export default useUsers;
