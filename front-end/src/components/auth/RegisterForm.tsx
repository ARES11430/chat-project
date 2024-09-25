import { useForm } from 'react-hook-form';
import { BsFillKeyFill } from 'react-icons/bs';
import { IoPersonSharp } from 'react-icons/io5';
import { MdEmail, MdFamilyRestroom } from 'react-icons/md';
import { Link, useNavigate } from 'react-router-dom';

// * components
import Loading from '../Loading';
import Spinner from '../Spinner';

// * validation
import { zodResolver } from '@hookform/resolvers/zod';
import { RegisterUser } from '../../models/auth';
import { registerSchema } from '../../validations/authSchema';

// * costume hooks
import useRegister from '../../hooks/useRegister';

const RegisterForm = () => {
	const {
		register,
		handleSubmit,
		formState: { errors, isSubmitting }
	} = useForm<RegisterUser>({ resolver: zodResolver(registerSchema) });

	const navigate = useNavigate();

	const { mutate, isSuccess, isPending } = useRegister(navigate);

	const onSubmit = handleSubmit(async (data) => {
		mutate(data);
	});

	if (isSuccess) return <Loading />;

	return (
		<div className='card bg-base-300 lg:w-[50%] w-full shadow-2xl'>
			<form className='card-body' onSubmit={onSubmit}>
				<div className='form-control'>
					<label className='label text-xs font-bold'>
						<span className='label-text text-xs'>نام</span>
					</label>
					<div className='input input-bordered flex items-center gap-2'>
						<IoPersonSharp className='text-lg' />
						<input
							type='text'
							className='w-full small-placeholder text-xs xl:text-base'
							placeholder='نام خود را وارد کنید'
							{...register('name')}
						/>
					</div>
					{errors.name && <p className='text-red-500 text-xs mt-2 ps-1'>{errors.name.message}</p>}
				</div>
				<div className='form-control'>
					<label className='label text-xs font-bold'>
						<span className='label-text text-xs'>نام خانوادگی</span>
					</label>
					<div className='input input-bordered flex items-center gap-2'>
						<MdFamilyRestroom className='text-lg' />
						<input
							type='text'
							className='w-full small-placeholder text-xs xl:text-base'
							placeholder='نام خانوادگی خود را وارد کنید'
							{...register('lastName')}
						/>
					</div>
					{errors.lastName && (
						<p className='text-red-500 text-xs mt-2 ps-1'>{errors.lastName.message}</p>
					)}
				</div>
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
				<div className='form-control mt-6'>
					<button type='submit' disabled={isSubmitting || isPending} className='btn btn-primary'>
						{isSubmitting && <Spinner />} ثبت نام کنید
					</button>
				</div>
				<div className='form-control mt-6'>
					<label className='label text-xs font-bold'>
						<Link to='/login' className='label-text-alt link link-hover'>
							قبلا ثبت نام کرده اید؟ از اینجا وارد شوید
						</Link>
					</label>
				</div>
			</form>
		</div>
	);
};

export default RegisterForm;
