import toast from 'react-hot-toast';
import { useAuthStore } from '../../stores/authStore';
import { logOutService } from '../../services/authService';
import { useNavigate } from 'react-router-dom';

const Logout = () => {
	const setIsLoggedIn = useAuthStore((s) => s.setIsLoggedIn);
	const setName = useAuthStore((s) => s.setName);
	const setLastName = useAuthStore((s) => s.setLastName);
	const setUsername = useAuthStore((s) => s.setUserName);

	const navigate = useNavigate();

	const handleLogOut = async () => {
		try {
			await logOutService.post({});

			// Update isLoggedIn state globally
			setIsLoggedIn(false);
			setName('');
			setLastName('');
			setUsername('');

			// Notify user of successful logout
			setTimeout(() => {
				toast.success('با موفقیت خارج شدید', { duration: 2000 });
			}, 500);

			// * Navigate to home page
			navigate('/');
		} catch (error) {
			// Handle logout failure
			toast.error('مشکلی پیش آمد', { duration: 2000 });
		}
	};

	return (
		<button onClick={handleLogOut} className='btn btn-ghost'>
			خروج
		</button>
	);
};

export default Logout;
