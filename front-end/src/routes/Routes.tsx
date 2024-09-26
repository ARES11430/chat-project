import { createBrowserRouter } from 'react-router-dom';
import ErrorBoundary from '../components/ErrorBoundary';
import RootLayout from '../layouts/RootLayout';
import App from '../pages/App';
import ChatRoomPage from '../pages/ChatRoomPage';
import ErrorPage from '../pages/ErrorPage';
import LoginPage from '../pages/LoginPage';
import RegisterPage from '../pages/RegisterPage';
import PrivateRoutes from './PrivateRoutes';
import ProtectedRoutes from './ProtectedRoutes';
import PrivateChatPage from '../pages/PrivateChatPage';

const router = createBrowserRouter([
	{
		path: '/',
		element: (
			<ErrorBoundary>
				<RootLayout />
			</ErrorBoundary>
		),
		errorElement: <ErrorPage error={null} />,
		children: [
			{ index: true, element: <App /> },
			{ path: 'login', element: <LoginPage /> },
			{ path: 'register', element: <ProtectedRoutes element={<RegisterPage />} /> }
		]
	},
	{
		path: '/chat-room',
		element: (
			<ErrorBoundary>
				<PrivateRoutes />
			</ErrorBoundary>
		),
		children: [{ index: true, element: <ChatRoomPage /> }]
	},
	{
		path: '/private-chat',
		element: (
			<ErrorBoundary>
				<PrivateRoutes />
			</ErrorBoundary>
		),
		children: [{ index: false }, { path: ':userId', element: <PrivateChatPage /> }]
	}
]);

export default router;
