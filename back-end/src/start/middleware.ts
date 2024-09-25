import helmet from 'helmet';
import compression from 'compression';
import express, { Express } from 'express';
import cors from 'cors';
import path from 'path';

const frontURL = process.env.FRONT_URL;

export default (app: Express) => {
	app.use(
		cors({
			origin: frontURL!,
			credentials: true
		})
	);
	app.options('*', cors());
	app.use(express.static(path.join(__dirname, '..', 'public')));
	app.use(helmet());
	app.use(compression());
};
