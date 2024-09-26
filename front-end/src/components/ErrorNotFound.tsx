import { Link } from 'react-router-dom';

const ErrorNotFound = () => {
	return (
		<div className='flex items-center justify-center mt-[10%]'>
			<div className='text-center space-y-6'>
				<h1 className='text-9xl font-bold'>404</h1>
				<p className='text-2xl'>ای بابا! صفحه ای که دنبالش بودی رو پیدا نکردیم.</p>
				<p>
					به نظر می رسه مسیر اشتباهی رو انتخاب کرده باشید. نگران نباش، این ممکنه برای همه ما اتفاق
					بیوفته.
				</p>
				<div className='mt-5 flex flex-row justify-center gap-5 font-bold'>
					<Link to='/' className='mr-5'>
						برو به خونه
					</Link>
					<p>با پشتیبانی تماس بگیر</p>
				</div>
			</div>
		</div>
	);
};

export default ErrorNotFound;
