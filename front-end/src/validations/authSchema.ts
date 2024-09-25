import { z } from 'zod';

export const loginSchema = z.object({
	userName: z
		.string()
		.min(6, 'نام کاربری حداقل 6 کاراکتر باشد')
		.max(255, 'نام کاربری نمی تواند بیشتر از 255 کاراکتر باشد'),
	password: z.string().min(6, 'حداقل 6 کاراکتر باشد').max(255, 'حداکثر 255 کاراکتر باشد')
});
