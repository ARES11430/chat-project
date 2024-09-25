import express, { Request, Response } from 'express';
import { Server } from 'socket.io';
import http from 'http';
import fs from 'fs';
import path from 'path';

const app = express();
const server = http.createServer(app);
const io = new Server(server);

// Define the message type
interface Message {
	id: string;
	username: string;
	message: string;
	timestamp: string;
}

// Load the message data from a JSON file (you may want to refactor this later to a database)
const messagesFilePath = path.join(__dirname, 'messages.json');
let messages: Message[] = [];

// Load existing messages from the file
if (fs.existsSync(messagesFilePath)) {
	const fileData = fs.readFileSync(messagesFilePath, 'utf-8');
	messages = JSON.parse(fileData);
}

// Serve static files from the public directory
app.use(express.static(path.join(__dirname, '../public')));

// Handle Socket.io connections
io.on('connection', (socket) => {
	console.log('A user connected');

	// Send existing messages to the client
	socket.emit('messageHistory', messages);

	// Handle incoming messages
	socket.on('chatMessage', (msg: Message) => {
		// Add the new message to the array
		messages.push(msg);

		// Limit the messages to the last 10
		if (messages.length > 10) {
			messages.shift(); // Remove the oldest message
		}

		// Save the messages to the file
		fs.writeFileSync(messagesFilePath, JSON.stringify(messages));

		// Broadcast the new message to all connected clients
		io.emit('chatMessage', msg);
	});

	// Handle user disconnection
	socket.on('disconnect', () => {
		console.log('A user disconnected');
	});
});

// Start the server
const PORT = process.env.PORT || 9000;
server.listen(PORT, () => {
	console.log(`Server running on http://localhost:${PORT}`);
});
