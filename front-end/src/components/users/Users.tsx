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
				<ul>
					{data?.data.users.map((user) => (
						<li key={user._id}>{user.userName}</li>
					))}
				</ul>
			)}
		</>
	);
};

export default Users;
