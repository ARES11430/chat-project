import { createBrowserRouter } from 'react-router-dom';
import RootLayout from '../layouts/RootLayout';
import App from '../pages/App';
import ChatPage from '../pages/ChatPage';
import LoginPage from '../pages/LoginPage';
import RegisterPage from '../pages/RegisterPage';
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
			{ path: 'register', element: <ProtectedRoutes element={<RegisterPage />} /> },
			{ path: 'chat', element: <ProtectedRoutes element={<ChatPage />} /> }
		]
	}
]);

export default router;
