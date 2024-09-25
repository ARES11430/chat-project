import mongoose from 'mongoose';
import { IUser } from './user';

export type IMessage = {
	user: IUser;
	message: string;
	timestamp: Date;
};

const messageSchema = new mongoose.Schema<IMessage>({
	user: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'User',
		required: true
	},
	message: {
		type: String,
		required: [true, 'Message is required'],
		trim: true,
		minlength: [1, 'Message should be at least 1 character long'],
		maxlength: [1000, 'Message should be at most 1000 characters long']
	},
	timestamp: {
		type: Date,
		default: Date.now // automatically set the timestamp
	}
});

// Create a Message model from the schema
const Message = mongoose.model<IMessage>('Message', messageSchema);

export { Message };
