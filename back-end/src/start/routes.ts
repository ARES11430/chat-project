import 'express-async-errors';
import express, { Express } from 'express';
import cookieParser from 'cookie-parser';

import users from '../routes/users';
import chats from '../routes/chats';
import auth from '../routes/auth';

const routes = (app: Express) => {
	// * middlewares
	app.use(express.json());
	app.use(cookieParser());

	// * routes
	app.use('/api/v1/auth', auth);
	app.use('/api/v1/users', users);
	app.use('/api/v1/chats', chats);
};

export default routes;
