import { Navigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import PrivateLayout from '../layouts/PrivateLayout';

const PrivateRoutes = () => {
	const { isLoggedIn } = useAuth();

	if (!isLoggedIn) {
		return <Navigate to='/login' replace />;
	}

	return <PrivateLayout />;
};

export default PrivateRoutes;
