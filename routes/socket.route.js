const socketClients = [];

io.on('connection', socket => {
	socket.emit('notification', 'New Notification')
	// socketClients.push(socket.id)
})

module.exports = socketClients;
