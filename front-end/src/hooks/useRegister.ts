import toast from 'react-hot-toast';
import { useMutation } from '@tanstack/react-query';
import { RegisterUser, RegisterUserResponse } from '../models/auth';
import { registerUserService } from '../services/authService';
import { showErrorToast } from '../utils/toastUtil';

const useRegister = (navigate: (path: string) => void) => {
	return useMutation<RegisterUserResponse, Error, RegisterUser>({
		mutationFn: (data: RegisterUser) => registerUserService.post(data),
		onSuccess: (data) => {
			if (data.message) {
				toast.success('ثبت نام با موفقیت انجام شد. برای ادامه دادن وارد شوید');
				setTimeout(() => {
					navigate('/login');
				}, 2000);
			}
		},
		onError: (error: any) => {
			if (error.response) {
				const errorMessage = error.response.data.error;
				showErrorToast(errorMessage);
			}
		}
	});
};

export default useRegister;
