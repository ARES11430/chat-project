import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { io, Socket } from 'socket.io-client';
import useAuth from '../../hooks/useAuth';

interface Message {
	userName: string;
	message: string;
	timestamp: Date;
}

interface FormValues {
	message: string;
}

const ChatRoom = () => {
	const { userName } = useAuth();

	const [socket, setSocket] = useState<Socket | null>(null);
	const [messages, setMessages] = useState<Message[]>([]);

	const { register, handleSubmit, reset } = useForm<FormValues>();

	useEffect(() => {
		// * Connect to the Socket.IO server
		const newSocket = io(import.meta.env.VITE_BACK_END_SOCKET);

		newSocket.on('connect', () => {
			console.log('Connected to socket:', newSocket.id);
		});

		newSocket.on('connect_error', (error) => {
			console.log('Connection error:', error);
		});

		setSocket(newSocket);

		newSocket.on('chatMessage', (msg: Message) => {
			setMessages((prevMessages) => [...prevMessages, msg]);
		});

		// * Disconnect when component unmounts
		return () => {
			newSocket.disconnect();
		};
	}, []);

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

	return (
		<div className='p-4'>
			<div className='chat-window border p-4 rounded'>
				<div className='messages max-h-[400px] overflow-y-auto'>
					{messages.map((msg, index) => (
						<div key={index} className='message my-2'>
							<span className='font-bold'>{msg.userName}:</span> {msg.message}
						</div>
					))}
				</div>
			</div>
			<form onSubmit={handleSubmit(sendMessage)} className='mt-4 flex gap-1'>
				<button type='submit' className='btn btn-secondary ml-2 px-4 py-2'>
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
