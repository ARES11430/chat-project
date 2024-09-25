import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';

export type IUser = {
	name: string;
	lastName: string;
	userName: string;
	password: string;
	refreshToken?: string;
	generateAuthToken(): string;
	generateRefreshToken(): string;
};

dotenv.config();

const JWT_SECRET = process.env.ACCESS_TOKEN_SECRET;
const REFRESH_SECRET = process.env.REFRESH_TOKEN_SECRET;

const userSchema = new mongoose.Schema<IUser>(
	{
		name: {
			type: String,
			trim: true,
			required: [true, 'property name is required'],
			minlenght: [3, 'property name should be at least 3 charachters'],
			maxlenght: [55, 'property name should be at most 55 charachters']
		},
		lastName: {
			type: String,
			trim: true,
			required: [true, 'property name is required'],
			minlenght: [3, 'property name should be at least 3 charachters'],
			maxlenght: [55, 'property name should be at most 55 charachters']
		},
		userName: {
			type: String,
			trim: true,
			required: [true, 'property name is required'],
			unique: true
		},
		password: {
			type: String,
			trim: true,
			required: [true, 'property name is required'],
			minlenght: [6, 'property name should be at least 6 charachters'],
			maxlenght: [1024, 'property name should be at most 1024 charachters']
		},
		refreshToken: {
			type: String
		}
	},
	{ timestamps: true }
);

userSchema.methods.generateAuthToken = function () {
	if (JWT_SECRET) {
		return jwt.sign({ _id: this._id, userName: this.userName }, JWT_SECRET, {
			expiresIn: '10m'
		});
	} else return 'invalid Token';
};

userSchema.methods.generateRefreshToken = function () {
	if (REFRESH_SECRET) {
		return jwt.sign({ _id: this._id }, REFRESH_SECRET);
	} else return 'invalid Token';
};

const User = mongoose.model('User', userSchema);

export { User };
