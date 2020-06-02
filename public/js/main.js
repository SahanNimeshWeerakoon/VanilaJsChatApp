const chatForm = document.getElementById('chat-form');
const chatMessages = document.querySelector('.chat-messages');
const roomName = document.getElementById('room-name');
const usersList = document.getElementById('users');
const socket = io();

// Get username and room from URL
const { username, room } = Qs.parse(location.search, {
	ignoreQueryPrefix: true
});

socket.emit('joinRoom', { username, room });

// Message from server
socket.on('message', message => {
	// Out put message
	outputMessage(message);

	// Scroll to bottom
	chatMessages.scrollTop = chatMessages.scrollHeight;
});

// Get room and users
socket.on('roomUsers', ({ room, users }) => {
	outputRoomName(room);
	outputUsers(users);
});

// Message submit
chatForm.addEventListener('submit', (e) => {
	e.preventDefault();

	// Get message text
	const msg = e.target.elements.msg.value;

	// Emit message to server
	socket.emit('chatMessage', msg);

	// Clear input 
	e.target.elements.msg.value = '';
	e.target.elements.msg.focus();
});

// Output Message
function outputMessage(msg) {
	const div = document.createElement('div');

	div.classList.add('message');
	div.innerHTML = `
		<p class="meta">${msg.username} <span>${msg.time}</span></p>
		<p class="text">
			${msg.textMsg}
		</p>
	`;

	document.querySelector('.chat-messages').appendChild(div);
}

// Add room name to DOM
function outputRoomName(room) {
	roomName.innerText = room;
}

// Add users to DOM
function outputUsers(users) {
	usersList.innerHTML = `
		${users.map(user => `<li>${user.username}</li>`).join("")}
	`;
}