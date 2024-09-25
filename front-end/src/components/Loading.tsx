import loadingGif from '../assets/gifs/loading.gif';
import '../assets/css/loading.css';

const Loading = () => {
	return (
		<div className='loading-overlay'>
			<img src={loadingGif} alt='Loading...' />
		</div>
	);
};

export default Loading;
