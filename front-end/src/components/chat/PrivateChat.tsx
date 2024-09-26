import { useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useParams } from 'react-router-dom';
import { io, Socket } from 'socket.io-client';
import useAuth from '../../hooks/useAuth';
import userPic from './../../assets/user.svg';

interface Message {
	id: string;
	userName: string;
	message: string;
	timestamp: Date;
}

interface Participant {
	id: string;
	userName: string;
}

interface FormValues {
	message: string;
}

const PrivateChat = () => {
	const [socket, setSocket] = useState<Socket | null>(null);
	const [messages, setMessages] = useState<Message[]>([]);
	const [participants, setParticipants] = useState<Participant[]>([]);

	const { chatId } = useParams<{ chatId: string }>();
	const { userName, userId } = useAuth();

	const { register, handleSubmit, reset } = useForm<FormValues>();

	const messagesEndRef = useRef<HTMLDivElement | null>(null);

	useEffect(() => {
		// * Connect to the Socket.IO server
		const newSocket = io(import.meta.env.VITE_BACK_END_SOCKET);
		setSocket(newSocket);

		// * Join the private chat room
		if (chatId) {
			newSocket.emit('joinPrivateChat', chatId);
		}

		newSocket.on('privateChatJoined', () => {
			console.log(`${newSocket.id} has joined the private chat ${chatId}`);
		});

		// * Listen for the previous messages from the server
		newSocket.on('previousMessages', (previousMessages: Message[]) => {
			setMessages(previousMessages);
		});

		newSocket.on('participants', (participants: Participant[]) => {
			setParticipants(participants);
		});

		// * Listen for new private messages
		newSocket.on('privateMessage', (msg: Message) => {
			setMessages((prevMessages) => [...prevMessages, msg]);

			// * Scroll to the bottom whenever a new message arrives
			messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
		});

		// * Disconnect socket on component unmount
		return () => {
			newSocket.disconnect();
		};
	}, [chatId]);

	const sendMessage = (data: FormValues) => {
		if (socket && data.message.trim() !== '') {
			// * Emit message to the server
			socket.emit('privateMessage', {
				roomId: chatId,
				senderId: userId,
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

	const chatPartner = participants.find((p) => p.userName !== userName);
	const chatToYourself = participants.find((c) => c.userName === userName);

	return (
		<div className='h-screen p-4 bg-base-300 rounded-lg flex flex-col'>
			<div className='border mb-4 p-2 bg-base-100 rounded-lg shadow-md'>
				{chatToYourself && !chatPartner && <p>در حال چت کردن با خودتون هستید</p>}
				{chatPartner && <p>در حال چت کردن با : {chatPartner.userName}</p>}
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
					<div ref={messagesEndRef}></div>{' '}
					{/* This element is used to scroll to the latest message */}
				</div>
			</div>
			<form onSubmit={handleSubmit(sendMessage)} className='mt-4 flex gap-2'>
				<input
					type='text'
					autoComplete='off'
					{...register('message', { required: true })}
					className='flex-1 border rounded p-2'
					placeholder='پیام خود را بنویسید...'
				/>
				<button type='submit' className='btn btn-secondary px-4 py-2'>
					فرستادن
				</button>
			</form>
		</div>
	);
};

export default PrivateChat;
