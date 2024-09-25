import { ReactElement } from 'react';
import { Navigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth';

interface ProtectedRouteProps {
	element: ReactElement;
}

const ProtectedRoutes = ({ element }: ProtectedRouteProps) => {
	const { isLoggedIn } = useAuth();

	if (!isLoggedIn) {
		return element;
	}

	// if user is logged in navigate to chat page
	if (isLoggedIn) {
		return <Navigate to='/chat-room' replace />;
	}
};

export default ProtectedRoutes;
