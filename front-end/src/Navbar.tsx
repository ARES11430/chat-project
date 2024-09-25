import { Link, NavLink } from 'react-router-dom';
import LogOut from './components/auth/LogOut';

import useAuth from './hooks/useAuth';

const NavBar = () => {
	const { isLoggedIn, name, lastName } = useAuth();

	return (
		<nav className='navbar bg-base-300'>
			<div className='container mx-auto w-full xl:w-[80%] flex justify-between items-center'>
				<div className='flex flex-col lg:flex-row gap-2 items-center'></div>
				<div className='flex flex-1 justify-end px-2'>
					{isLoggedIn ? (
						<div className='flex flex-row items-center justify-start gap-5'>
							<p className='hidden sm:block font-bold '>
								سلام {name} {lastName}
							</p>
							<div className='flex-none'>
								<div className='dropdown dropdown-end'>
									<div tabIndex={0} role='button' className='btn btn-ghost btn-circle avatar'>
										<div className='w-10 rounded-full'>
											<img
												alt='User Avatar'
												src='https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp'
											/>
										</div>
									</div>
									<ul
										tabIndex={0}
										className='menu bg-base-300 mt-3 dropdown-content rounded-box z-[1] w-auto p-3 shadow'
									>
										<li>
											<Link to={'/chat-room'} className='btn btn-ghost text-nowrap'>
												چت روم
											</Link>
										</li>
										<li>
											<LogOut />
										</li>
									</ul>
								</div>
							</div>
						</div>
					) : (
						<div className='flex flex-row gap-7 items-center justify-center'>
							<NavLink to='/register'>ثبت نام</NavLink>
							<NavLink to='/login'>ورود</NavLink>
						</div>
					)}
				</div>
			</div>
		</nav>
	);
};

export default NavBar;
