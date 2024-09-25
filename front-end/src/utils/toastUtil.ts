import toast from 'react-hot-toast';
import { translateError } from './errorTranslations';

export const showErrorToast = (errorMessage: string): void => {
	const translatedMessage = translateError(errorMessage);
	toast.error(translatedMessage, { duration: 2000 });
};
