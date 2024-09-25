import { Navigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import RootLayout from '../layouts/RootLayout';

const PrivateRoutes = () => {
	const { isLoggedIn } = useAuth();

	if (!isLoggedIn) {
		return <Navigate to='/login' replace />;
	}

	return <RootLayout />;
};

export default PrivateRoutes;
