const errorTranslations: { [key: string]: string } = {
	'this user is already registered': 'این نام کاربری قبلا ثبت نام کرده است',
	'there is no user is database': 'کاربری در پایگاه داده یافت نشد',
	'invalid userName or password': 'نام کاربری یا کلمه عبور اشتباه است',
	'user not found': 'کاربر یافت نشد',
	'No refresh token provided': 'توکن یافت نشد',
	'Invalid refresh token. Please login again': 'توکن اشتباه است. لطفا مجدد وارد شوید',
	'Invalid refresh token': 'توکن اشتباه است',
	default: 'خطا در دریافت اطلاعات'
};

export const translateError = (errorMessage: string): string => {
	return errorTranslations[errorMessage] || errorTranslations['default'];
};
