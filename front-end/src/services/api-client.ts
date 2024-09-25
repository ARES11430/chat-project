import axios, { AxiosRequestConfig } from 'axios';
import toast from 'react-hot-toast';

export const axiosInstance = axios.create({
	baseURL: import.meta.env.VITE_BACK_END_URL,
	withCredentials: true // Ensure cookies are sent with requests
});

const refreshToken = async () => {
	try {
		const response = await axiosInstance.post('/auth/refresh-access-token');
		return response.data.accessToken;
	} catch (error: any) {
		console.log(error);
		toast.error('لطفا دوباره وارد شوید', { duration: 2000 });
		// Redirect to login or other appropriate action
		window.location.href = '/login';
		return null;
	}
};

axiosInstance.interceptors.response.use(
	(response) => {
		return response;
	},
	async function (error) {
		const originalRequest = error.config;

		if (
			error.response.status === 401 &&
			error.response.data.error === 'expired or invalid access token' &&
			!originalRequest._retry
		) {
			originalRequest._retry = true;

			try {
				await refreshToken();
				return axiosInstance(originalRequest);
			} catch (refreshError) {
				console.error('Token refresh failed:', refreshError);
			}
		}
		return Promise.reject(error);
	}
);

class APIClient<RequestType, ResponseType> {
	constructor(private endpoint: string) {}

	get = async (): Promise<ResponseType> => {
		return await axiosInstance.get<ResponseType>(this.endpoint).then((res) => res.data);
	};

	getAll = async (config: AxiosRequestConfig): Promise<ResponseType> => {
		return await axiosInstance.get<ResponseType>(this.endpoint, config).then((res) => res.data);
	};

	post = async (data: RequestType): Promise<ResponseType> => {
		return await axiosInstance.post<ResponseType>(this.endpoint, data).then((res) => res.data);
	};
}

export default APIClient;
