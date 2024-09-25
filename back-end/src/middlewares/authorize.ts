import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const JWT_SECRET = process.env.ACCESS_TOKEN_SECRET;

declare global {
	namespace Express {
		interface Request {
			user?: any;
		}
	}
}

// * middleware, checks for authentication before calling a route!
export const authorized = async (req: Request, res: Response, next: NextFunction) => {
	const token: string = req.cookies.accessToken;

	if (!token) return res.status(403).send({ error: 'unAuthorized access' });

	try {
		const decoded = jwt.verify(token, JWT_SECRET!);
		req.user = decoded;
		next();
	} catch (error) {
		return res.status(401).send({ error: 'expired or invalid access token' });
	}
	return;
};
