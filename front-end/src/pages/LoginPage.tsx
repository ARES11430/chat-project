import { Link } from 'react-router-dom';
import LoginForm from '../components/auth/LoginForm';

const LoginPage = () => {
	return (
		<div className='hero bg-base-100 min-h-screen'>
			<div className='hero-content flex-col lg:flex-row-reverse lg:gap-20 gap-10 w-[90%] lg:w-[80%]'>
				<div className='lg:w-[50%] w-full flex flex-col justify-center items-center text-center'>
					<h1 className='text-3xl lg:text-5xl font-bold'>همین حالا وارد شوید!</h1>
					<p className='py-4 lg:py-6'>لطفا به حساب کاربری خود وارد شوید</p>
					<Link to='/register' className='hover:underline'>
						حساب کاربری ندارید؟ برای ساخت حساب کاربری کلیک کنید!
					</Link>
				</div>
				<LoginForm />
			</div>
		</div>
	);
};

export default LoginPage;
