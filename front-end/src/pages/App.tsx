import chatSvg from '../assets/chat.svg';

const App = () => {
	return (
		<div className='hero bg-base-100 min-h-screen'>
			<div className='hero-content flex-col gap-5 lg:flex-row-reverse w-[80%]'>
				<div className='lg:w-[50%] w-full flex justify-center lg:justify-end'>
					<img src={chatSvg} className='rounded-lg lg:max-w-full' />
				</div>
				<div className='lg:w-[50%] w-full flex justify-center lg:justify-start'>
					<div>
						<h1 className='text-5xl font-bold'>چت روم آنلاین</h1>
						<p className='py-6'>به اپلیکیشن چت روم آنلاین خوش آمدید</p>
						<p className='py-6'>
							لطفا برای ادامه حساب کاربری بسازید و یا وارد حساب کاربری خود شوید
						</p>
					</div>
				</div>
			</div>
		</div>
	);
};

export default App;
