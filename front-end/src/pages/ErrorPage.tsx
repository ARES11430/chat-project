import { isRouteErrorResponse, useRouteError } from 'react-router-dom';
import NavBar from '../Navbar';
import ErrorNotFound from '../components/ErrorNotFound';
import ErrorInternal from '../components/ErrorInternal';

interface ErrorPageProps {
	error: Error | null;
}

const ErrorPage = ({ error }: ErrorPageProps) => {
	const routeError = error || useRouteError();
	const isRouteError = isRouteErrorResponse(routeError);

	return (
		<>
			<NavBar />
			<div id='main' className='min-h-screen'>
				{isRouteError ? <ErrorNotFound /> : <ErrorInternal />}
			</div>
		</>
	);
};

export default ErrorPage;
