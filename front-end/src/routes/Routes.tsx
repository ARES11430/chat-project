import { createBrowserRouter } from 'react-router-dom';
import RootLayout from '../layouts/RootLayout';
import App from '../pages/App';
import LoginPage from '../pages/LoginPage';
import RegisterPage from '../pages/RegisterPage';

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
			{ path: 'register', element: <RegisterPage /> }
		]
	}
]);

export default router;
