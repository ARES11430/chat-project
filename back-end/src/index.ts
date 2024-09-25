import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import http from 'http';
import routes from './start/routes';

const app = express();
const server = http.createServer(app);

// * enhancement midlewares
import middlewares from './start/middleware';
middlewares(app);

// * routes
routes(app);

// * database
import initDatabase from './start/database';
initDatabase();

// * initialize Socket.io
import { initSocket } from './start/socket';
initSocket(server);

// Start the server
const PORT = process.env.PORT || 9000;
server.listen(PORT, () => {
	console.log(`Server running on http://localhost:${PORT}`);
});
