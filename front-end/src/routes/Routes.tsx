import { createBrowserRouter } from 'react-router-dom';
import RootLayout from '../layouts/RootLayout';
import App from '../pages/App';
import PublicChatPage from '../pages/PublicChatPage';
import LoginPage from '../pages/LoginPage';
import RegisterPage from '../pages/RegisterPage';
import PrivateRoutes from './PrivateRoutes';
import ProtectedRoutes from './ProtectedRoutes';

const router = createBrowserRouter([
	{
		path: '/',
		element: <RootLayout />,
		errorElement: (
			<div className='flex justify-center text-center font-bold text-4xl mt-10'>
				Not found error sould be handled here
			</div>
		),
		children: [
			{ index: true, element: <App /> },
			{ path: 'login', element: <LoginPage /> },
			{ path: 'register', element: <ProtectedRoutes element={<RegisterPage />} /> }
		]
	},
	{
		path: '/public-chat',
		element: <PrivateRoutes />,
		children: [{ index: true, element: <PublicChatPage /> }]
	}
]);

export default router;
