import { Outlet } from 'react-router-dom';
import NavBar from '../Navbar';

const RootLayout = () => {
	return (
		<main>
			<NavBar />
			<Outlet />
		</main>
	);
};

export default RootLayout;
