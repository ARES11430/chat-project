import { useAuthStore } from '../stores/authStore';

interface Auth {
	isLoggedIn: boolean;
	userName: string;
	userId: string;
	name: string;
	lastName: string;
}

const useAuth = (): Auth => {
	const isLoggedIn = useAuthStore((s) => s.isLoggedIn);
	const userName = useAuthStore((s) => s.userName);
	const userId = useAuthStore((s) => s.userId);
	const name = useAuthStore((s) => s.name);
	const lastName = useAuthStore((s) => s.lastName);

	return { isLoggedIn, userName, userId, name, lastName };
};

export default useAuth;
