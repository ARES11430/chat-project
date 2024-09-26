import { Request, Response } from 'express';
import 'express-async-errors';
import { PrivateChat } from '../../models/privateChat';
import { User } from '../../models/user';
import { CreateChatDTO } from './dtos/Chat';

export async function createPrivateChat(req: Request, res: Response) {
	const { userId1, userId2 } = req.body as CreateChatDTO;

	const user1 = await User.findById(userId1);
	const user2 = await User.findById(userId2);

	if (!user1 || !user2) {
		return res.status(404).json({ message: 'One or both users not found' });
	}

	// Check if a chat already exists between these two users
	let chat = await PrivateChat.findOne({
		participants: { $all: [userId1, userId2] }
	});

	const participants = [userId1, userId2];

	if (chat) {
		return res.status(200).json({ chatId: chat._id, participants });
	}

	chat = new PrivateChat({
		participants: [userId1, userId2],
		messages: []
	});
	await chat.save();

	return res.status(200).json({ chatId: chat._id, participants });
}
