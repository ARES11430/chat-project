import { createBrowserRouter } from 'react-router-dom';
import RootLayout from '../layouts/RootLayout';
import App from '../pages/App';
import ChatRoomPage from '../pages/ChatRoomPage';
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
				صفحه مورد نظر یافت نشد (404)
			</div>
		),
		children: [
			{ index: true, element: <App /> },
			{ path: 'login', element: <LoginPage /> },
			{ path: 'register', element: <ProtectedRoutes element={<RegisterPage />} /> }
		]
	},
	{
		path: '/chat-room',
		element: <PrivateRoutes />,
		children: [{ index: true, element: <ChatRoomPage /> }]
	}
]);

export default router;
