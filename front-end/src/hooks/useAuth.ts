import { useAuthStore } from '../stores/authStore';

interface Auth {
	isLoggedIn: boolean;
	userName: string;
	name: string;
	lastName: string;
}

const useAuth = (): Auth => {
	const isLoggedIn = useAuthStore((s) => s.isLoggedIn);
	const userName = useAuthStore((s) => s.userName);
	const name = useAuthStore((s) => s.name);
	const lastName = useAuthStore((s) => s.lastName);

	return { isLoggedIn, userName, name, lastName };
};

export default useAuth;
