import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useParams } from 'react-router-dom';
import { io, Socket } from 'socket.io-client';
import useAuth from '../../hooks/useAuth';
import userPic from './../../assets/user.svg';
import usePrivateChatStore from '../../stores/privateChatStore';

interface Message {
	id: string;
	userName: string;
	message: string;
	timestamp: Date;
}

interface FormValues {
	message: string;
}

const PrivateChat = () => {
	const [socket, setSocket] = useState<Socket | null>(null);
	const [messages, setMessages] = useState<Message[]>([]);

	const { chatId } = useParams<{ chatId: string }>();
	const userId1 = usePrivateChatStore((s) => s.userId1);
	const userId2 = usePrivateChatStore((s) => s.userId2);

	const { userName } = useAuth();

	const { register, handleSubmit, reset } = useForm<FormValues>();

	useEffect(() => {
		// * Connect to the Socket.IO server
		const newSocket = io(import.meta.env.VITE_BACK_END_SOCKET);
		setSocket(newSocket);

		// * Join the private chat room
		if (userId1 && userId2) {
			newSocket.emit('createOrJoinPrivateChat', { userId1, userId2 });
		}

		newSocket.on('privateChatJoined', () => {
			console.log(`${newSocket.id} has joined the private chat ${chatId}`);
		});

		// * Listen for private messages
		newSocket.on('privateMessage', (msg: Message) => {
			setMessages((prevMessages) => [...prevMessages, msg]);
		});

		// * Disconnect socket on component unmount
		return () => {
			newSocket.disconnect();
		};
	}, [userId1, userId2]);

	const sendMessage = (data: FormValues) => {
		if (socket && data.message.trim() !== '') {
			// * Emit message to the server
			socket.emit('privateMessage', {
				roomId: chatId,
				senderId: userId1,
				message: data.message
			});

			// * Clear the input after sending
			reset();
		}
	};

	const formatHour = (date: Date) => {
		return new Date(date).toLocaleTimeString('fa-IR', {
			hour: '2-digit',
			minute: '2-digit'
		});
	};

	return (
		<div className='p-4 bg-base-300 rounded-lg flex flex-col justify-between'>
			<div className='border rounded-lg shadow-md bg-base-100 p-4 flex-1 overflow-y-auto'>
				<div>
					{messages.map((msg, index) => (
						<div
							key={index}
							className={`chat ${msg.userName === userName ? 'chat-start' : 'chat-end'} my-2`}
						>
							<div className='chat-image avatar'>
								<div className='w-10 rounded-full'>
									<img alt='User Avatar' src={userPic} />
								</div>
							</div>
							<div className='chat-header'>
								{msg.userName}
								<time className='text-xs opacity-50 ml-2'>{formatHour(msg.timestamp)}</time>
							</div>
							<div
								className={`chat-bubble ${
									msg.userName === userName ? 'chat-bubble-success' : 'chat-bubble-info'
								}`}
							>
								{msg.message}
							</div>
							<div className='chat-footer opacity-50'>Delivered</div>
						</div>
					))}
				</div>
			</div>
			<form onSubmit={handleSubmit(sendMessage)} className='mt-4 flex gap-2'>
				<button type='submit' className='btn btn-secondary px-4 py-2'>
					فرستادن
				</button>
				<input
					type='text'
					autoComplete='off'
					{...register('message', { required: true })}
					className='flex-1 border rounded p-2'
					placeholder='پیام خود را بنویسید...'
				/>
			</form>
		</div>
	);
};

export default PrivateChat;
