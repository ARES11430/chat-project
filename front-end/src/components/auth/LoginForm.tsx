import { useForm } from 'react-hook-form';
import { BsFillKeyFill } from 'react-icons/bs';
import { MdEmail } from 'react-icons/md';
import { Link, useNavigate } from 'react-router-dom';

// * components
import Loading from '../Loading';
import Spinner from '../Spinner';

// * validation
import { zodResolver } from '@hookform/resolvers/zod';
import { loginSchema } from '../../validations/authSchema';

// * hooks
import useLogin from '../../hooks/useLogin';

import { z } from 'zod';

type LoginSchema = z.infer<typeof loginSchema>;

const loginDefaultValues: LoginSchema = {
	userName: '',
	password: ''
};

const LoginForm = () => {
	const {
		register,
		handleSubmit,
		formState: { errors, isSubmitting }
	} = useForm<LoginSchema>({
		mode: 'all',
		resolver: zodResolver(loginSchema),
		defaultValues: loginDefaultValues
	});

	const navigate = useNavigate();

	const { mutate, isPending, isSuccess } = useLogin(navigate);

	const onSubmit = handleSubmit((data) => {
		mutate(data);
	});

	if (isSuccess) return <Loading />;

	return (
		<div className='card bg-base-300 lg:w-[50%] w-full shadow-2xl'>
			<form className='card-body' onSubmit={onSubmit}>
				<div className='form-control'>
					<label className='label text-xs font-bold'>
						<span className='label-text text-xs'>نام کاربری</span>
					</label>
					<div className='input input-bordered flex items-center gap-2'>
						<MdEmail className='text-lg' />
						<input
							type='text'
							className='w-full small-placeholder text-xs xl:text-base'
							placeholder='نام کاربری خود را وارد کنید'
							{...register('userName')}
						/>
					</div>
					{errors.userName && (
						<p className='text-red-500 text-xs mt-2 ps-1'>{errors.userName.message}</p>
					)}
				</div>
				<div className='form-control'>
					<label className='label text-xs font-bold'>
						<span className='label-text text-xs'>کلمه عبور</span>
					</label>
					<div className='input input-bordered flex items-center gap-2'>
						<BsFillKeyFill className='text-lg' />
						<input
							type='password'
							className='w-full small-placeholder text-xs xl:text-base'
							placeholder='کلمه عبور خود را وارد کنید'
							{...register('password')}
						/>
					</div>
					{errors.password && (
						<p className='text-red-500 text-xs mt-2 ps-1'>{errors.password.message}</p>
					)}
				</div>
				<div className='form-control'>
					<button
						type='submit'
						className='btn btn-primary mt-4'
						disabled={isSubmitting || isPending}
					>
						{isSubmitting || isPending ? <Spinner /> : 'ورود'}
					</button>
				</div>
				<div className='form-control mt-6'>
					<label className='label text-xs font-bold'>
						<Link to='/register' className='label-text-alt link link-hover'>
							حساب کاربری ندارید؟ برای ساخت اینجا را کلیک کنید.
						</Link>
					</label>
				</div>
			</form>
		</div>
	);
};

export default LoginForm;
