import { useMutation } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { Login, LoginResponse } from '../models/auth';
import { loginService } from '../services/authService';
import { useAuthStore } from '../stores/authStore';
import { showErrorToast } from '../utils/toastUtil';

const useLogin = (navigate: (path: string) => void) => {
	const setIsLoggedIn = useAuthStore((s) => s.setIsLoggedIn);
	const setUserName = useAuthStore((s) => s.setUserName);
	const setName = useAuthStore((s) => s.setName);
	const setLastName = useAuthStore((s) => s.setLastName);

	return useMutation<LoginResponse, Error, Login>({
		mutationFn: (data: Login) => {
			return loginService.post(data);
		},
		onSuccess: ({ data, message }) => {
			setTimeout(() => {
				setIsLoggedIn(true);
				setUserName(data.userName);
				setName(data.name);
				setLastName(data.lastName);

				if (message) {
					navigate('/public-chat'); // * go to chat page after login
					setTimeout(() => {
						toast.success('با موفقیت وارد شدید', { duration: 2000 });
					}, 500);
				}
			}, 2000); // 2-second delay before setting user info and navigating
		},
		onError: (error: any) => {
			const errorMessage = error.response.data.error;
			showErrorToast(errorMessage);
		}
	});
};

export default useLogin;
