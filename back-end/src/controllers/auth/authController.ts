import bcrypt from 'bcrypt';
import { Request, Response } from 'express';
import 'express-async-errors';
import jwt from 'jsonwebtoken';

import { User } from '../../models/user';
import { LoginDTO } from './dtos/Auth';

const REFRESH_SECRET = process.env.REFRESH_TOKEN_SECRET;

// * login
export async function login(req: Request, res: Response) {
	const { userName, password } = req.body as LoginDTO;

	const user = await User.findOne({ userName });
	if (!user) return res.status(404).send({ error: 'invalid userName or password' });

	const result = await bcrypt.compare(password, user.password);
	if (!result) return res.status(404).send({ error: 'invalid userName or password' });

	const accessToken = user.generateAuthToken();
	const refreshToken = user.generateRefreshToken();

	user.refreshToken = refreshToken;

	await user.save();

	// set the max age of cookie to 10 years
	const tenYears = 1000 * 60 * 60 * 24 * 365 * 10;

	res.cookie('accessToken', accessToken, {
		httpOnly: true,
		secure: true,
		sameSite: 'strict',
		maxAge: tenYears
	});

	res.cookie('refreshToken', refreshToken, {
		httpOnly: true,
		secure: true,
		sameSite: 'strict',
		maxAge: tenYears
	});

	const { _id, name, lastName } = user;

	return res.status(200).send({
		message: 'login successfull',
		data: { userId: _id, userName, name, lastName }
	});
}

// * logout
export async function logout(req: Request, res: Response) {
	const user = await User.findById(req.user._id);
	if (!user) return res.status(404).send({ error: 'user not found' });

	user.refreshToken = undefined;

	await user.save();

	// Clear cookies from the client side
	res.clearCookie('accessToken', { path: '/' });
	res.clearCookie('refreshToken', { path: '/' });

	return res.status(200).send({ message: 'you are logged out' });
}

// * refresh the access token
export async function refreshAccessToken(req: Request, res: Response) {
	const { refreshToken } = req.cookies;

	if (!refreshToken) {
		return res.status(403).send({ error: 'No refresh token provided' });
	}

	if (!REFRESH_SECRET) {
		return res.status(500).send({ error: 'Internal server error' });
	}

	try {
		const decoded = jwt.verify(refreshToken, REFRESH_SECRET) as { _id: string };

		const user = await User.findById(decoded._id);
		if (!user || user.refreshToken !== refreshToken) {
			return res.status(403).send({ error: 'Invalid refresh token. Please login again' });
		}

		const tenYears = 1000 * 60 * 60 * 24 * 365 * 10;

		const accessToken = user.generateAuthToken();
		res.cookie('accessToken', accessToken, {
			httpOnly: true,
			secure: true,
			sameSite: 'strict',
			maxAge: tenYears
		});

		return res.status(200).send({ message: 'Access token regenerated' });
	} catch (error) {
		return res.status(403).send({ error: 'Invalid refresh token' });
	}
}
