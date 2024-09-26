import { Link } from 'react-router-dom';

const ErrorInternal = () => {
	return (
		<div className='flex items-center justify-center mt-[10%]'>
			<div className='text-center space-y-6'>
				<h1 className='text-9xl font-bold'>500</h1>
				<p className='text-2xl'>
					به نظر میرسه مشکلی توی سرور به وجود اومده. بعدا دوباره تلاش کن :)
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

export default ErrorInternal;
