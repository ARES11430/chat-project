import { FaHome } from 'react-icons/fa';
import { NavLink } from 'react-router-dom';
import useUsers from '../../hooks/useUsers';
import { showErrorToast } from '../../utils/toastUtil';
import Loading from '../Loading';

const Users = () => {
	const { data, isError, error, isLoading } = useUsers();

	let emptyError = '';

	if (isError && error) {
		const errorMessage = (error as any).response.data.error;

		if (errorMessage === 'there is no user in database') {
			emptyError = 'کاربری یافت نشد';
		} else {
			showErrorToast(errorMessage);
		}
	}

	if (isLoading) return <Loading />;

	return (
		<>
			{emptyError && <p className='font-bold text-center mt-5'>{emptyError}</p>}
			{data && (
				<div
					className={
						'bg-base-200 items-center block relative pt-6 w-[30%] md:w-[25%] lg:w-[20%] 2xl:w-[12%]'
					}
				>
					<NavLink to='/'>
						<div className='flex items-center pr-3'>
							<FaHome className='text-xl md:text-3xl ml-3' />
							<h1 className={'font-bold text-2xl opacity-100 w-auto'}>خانه</h1>
						</div>
					</NavLink>
					<h2 className={'font-bold text-3xl pr-3 mt-24'}>لیست کاربران</h2>
					<ul className='flex flex-col gap-3 mt-7 pr-3'>
						{data?.data.users.map((user) => (
							<li key={user._id}>{user.userName}</li>
						))}
					</ul>
				</div>
			)}
		</>
	);
};

export default Users;
