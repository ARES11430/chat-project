import 'express-async-errors';
import express, { Express } from 'express';
import cookieParser from 'cookie-parser';

import users from '../routes/users';

const routes = (app: Express) => {
	// * middlewares
	app.use(express.json());
	app.use(cookieParser());

	// * routes
	app.use('/api/v1/users', users);
};

export default routes;
