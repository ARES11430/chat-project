import { Link } from 'react-router-dom';
import RegisterForm from '../components/auth/RegisterForm';

const RegisterPage = () => {
	return (
		<div className='hero bg-base-100 min-h-screen'>
			<div className='hero-content flex-col lg:flex-row-reverse lg:gap-20 gap-10 w-[90%] lg:w-[80%]'>
				<div className='lg:w-[50%] w-full flex flex-col justify-center items-center text-center'>
					<h1 className='text-3xl lg:text-5xl font-bold'>همین حالا ثبت نام کنید!</h1>
					<Link className='py-4 lg:py-6 hover:underline' to='/login'>
						حساب کاربری دارید؟ به حساب کاربری خود وارد شوید
					</Link>
				</div>
				<RegisterForm />
			</div>
		</div>
	);
};

export default RegisterPage;
