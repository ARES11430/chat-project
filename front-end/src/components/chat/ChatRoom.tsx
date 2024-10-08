import { useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { io, Socket } from 'socket.io-client';
import useAuth from '../../hooks/useAuth';
import greenPulse from './../../assets/gifs/green-pulse.gif';
import userPic from './../../assets/user.svg';

interface Message {
	id: string;
	userName: string;
	message: string;
	timestamp: Date;
}

interface OnlineUser {
	id: string;
	userName: string;
}

interface FormValues {
	message: string;
}

const ChatRoom = () => {
	const { userName } = useAuth();

	const [socket, setSocket] = useState<Socket | null>(null);
	const [messages, setMessages] = useState<Message[]>([]);
	const [onlineUsers, setOnlineUsers] = useState<OnlineUser[]>([]);

	const messagesEndRef = useRef<HTMLDivElement | null>(null);

	const { register, handleSubmit, reset } = useForm<FormValues>();

	useEffect(() => {
		// * Connect to the Socket.IO server
		const newSocket = io(import.meta.env.VITE_BACK_END_SOCKET);

		newSocket.on('connect', () => {
			console.log('Connected to socket:', newSocket.id);

			// * Request previous messages from the server on connection
			newSocket.emit('getPreviousMessages');
		});

		// * Join the chat room with the username
		if (userName) {
			newSocket.emit('joinChat', userName);
		}

		newSocket.on('connect_error', (error) => {
			console.log('Connection error:', error);
		});

		setSocket(newSocket);

		// * Listen for previous messages on initial connection
		newSocket.on('previousMessages', (msgs: Message[]) => {
			// * Keep only the last 10 messages
			setMessages(msgs.slice(-10));
		});

		// * Listen for new chat messages
		newSocket.on('chatMessage', (msg: Message) => {
			setMessages((prevMessages) => [...prevMessages, msg].slice(-10));

			// * Scroll to the bottom whenever a new message arrives
			messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
		});

		// * Listen for online users update
		newSocket.on('onlineUsers', (users: OnlineUser[]) => {
			setOnlineUsers(users);
		});

		// * Disconnect when component unmounts
		return () => {
			newSocket.disconnect();
		};
	}, [userName]);

	const sendMessage = (data: FormValues) => {
		if (socket && data.message.trim() !== '') {
			// * Emit message to the server
			socket.emit('chatMessage', {
				userName,
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
		<div className='h-screen p-4 bg-base-300 rounded-lg flex flex-col'>
			<div className='border mb-4 p-2 bg-base-100 rounded-lg shadow-md'>
				<h3 className='font-bold mb-2'>کاربران آنلاین</h3>
				<ul className='space-y-1'>
					{onlineUsers.map((user) => (
						<li key={user.id} className='flex items-center gap-2'>
							<img alt='User Avatar' src={greenPulse} className='w-5 h-5 rounded-full' />
							<span>{user.userName}</span>
						</li>
					))}
				</ul>
			</div>
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
					<div ref={messagesEndRef}></div>
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

export default ChatRoom;
