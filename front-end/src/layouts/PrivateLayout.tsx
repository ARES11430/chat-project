import { Outlet } from 'react-router-dom';
import NavBar from '../Navbar';
import Users from '../components/users/Users';

const PrivateLayout = () => {
	return (
		<div className='flex'>
			<Users />
			<main className='w-full'>
				<NavBar />
				<div className='p-14'>
					<Outlet />
				</div>
			</main>
		</div>
	);
};

export default PrivateLayout;
