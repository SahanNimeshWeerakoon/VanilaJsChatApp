const users = [];

// Join user to the chat
function userJoin(id, username, room) {
	const user = { id, username, room };

	users.push(user);

	return user;
}

function getUsers() {
	return users;
}

// Find the user from id
function getCurrentUser(id) {
	return users.find(user => user.id === id);
}

// User leaves
function userLeaves(id) {
	const index = users.findIndex(user => user.id === id);

	if(index !== -1) {
		return users.splice(index, 1)[0];
	}
}

// Get room users
function getRoomUsers(room) {
	return users.filter(user => user.room === room);
}

module.exports = { userJoin, getCurrentUser, userLeaves, getRoomUsers, getUsers };