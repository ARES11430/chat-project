import bcrypt from 'bcrypt';
import { Request, Response } from 'express';
import 'express-async-errors';

import { User } from '../../models/user';
import { CreateUserDTO } from './dtos/User';

// * register user
export async function createUser(req: Request, res: Response) {
	// * pick properties from req.body
	const { name, lastName, userName, password } = req.body as CreateUserDTO;

	// ? check if user is already registered
	let user = await User.findOne({ userName });
	if (user) return res.status(400).send({ error: 'this user is already registered' });

	user = new User({ name, lastName, userName, password });
	const salt = await bcrypt.genSalt(10);
	user.password = await bcrypt.hash(user.password, salt);

	await user.save();

	return res.status(201).send({
		message: `user created successfully`,
		data: {
			user: { _id: user._id, name: user.name, lastName: user.lastName, userName: user.userName }
		}
	});
}

// * get users
export async function getUsers(req: Request, res: Response) {
	// ? check if user is already registered
	let users = await User.find().select('_id name lastName userName createdAt');
	if (!users || users.length === 0)
		return res.status(404).send({ error: 'there is no user is database' });

	return res.status(201).send({
		data: {
			users
		}
	});
}
