const express = require('express'),
	http = require('http'),
	path = require('path'),
	socketio = require('socket.io'),
	formatMessage = require('./utils/messages'),
	{ userJoin, getCurrentUser, userLeaves, getRoomUsers } = require('./utils/users');

const app = express();

const server = http.createServer(app);
const io = socketio(server);

// Set static folder
app.use(express.static(path.join(__dirname, 'public')));

const BOTNAME = 'BOT';

// Run when client connects
io.on('connection', socket => {
	socket.on('joinRoom', ({ username, room }) => {
		// Group the user by room
		const user = userJoin(socket.id, username, room);
		socket.join(user.room);

		// Welcome user to the chat
		socket.emit('message', formatMessage(BOTNAME, 'Welcome to chat code'));

		// Broadcast when a user connects
		socket.broadcast.to(user.room).emit('message', formatMessage(BOTNAME, `${user.username} has joined the chat`));

		// Send users and room info
		io.to(user.room).emit('roomUsers', {
			room: user.room,
			users: getRoomUsers(user.room)
		});
	});

	// Listen for the chat Message
	socket.on('chatMessage', msg => {
		const user = getCurrentUser(socket.id);
		io.to(user.room).emit('message', formatMessage(user.username, msg));
	});

	// Runs when client disconnects
	socket.on('disconnect', () => {
		const user = userLeaves(socket.id);

		if(user) {
			io.to(user.room).emit('message', formatMessage(BOTNAME, `${user.username} has left the chat`));

			// Send users and room info
			socket.to(user.room).emit('roomUsers', {
				room: user.room,
				users: getRoomUsers(user.room)
			});
		}
	});
});

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => console.log(`Server connected at port ${PORT}`));