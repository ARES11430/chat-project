import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const initDatabase = async () => {
	let dbString;

	// * set production database
	if (process.env.ENV === 'production') {
		dbString = process.env.DB;
	} else if (process.env.ENV === 'development') {
		dbString = process.env.DB_TEST;
	} else dbString = process.env.DB_FALLBACK;

	try {
		if (dbString) {
			await mongoose.connect(dbString);
		}
		return dbString;
	} catch (error) {
		return error;
	}
};

export default initDatabase;
