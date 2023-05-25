const express = require('express')
const socketio = require('socket.io')
const http = require('http')
const cors = require('cors')
const { Configuration, OpenAIApi } = require('openai')


const { addUser, removeUser, getUser, getUsersInRoom } = require('./users.js');
const { addMessage, getMessage } = require('./messages.js')
const PORT = process.env.PORT || 5000
const router = require('./router')


const app = express()
const server = http.createServer(app)
const io = socketio(server)
const apiKey = process.env.OPENAPI_KEY || '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'

app.use(cors())
app.use(router)

const config = new Configuration({
	apiKey: apiKey
})

const openai = new OpenAIApi(config)

const generateResponse = async (prompt) => {
	console.log(prompt.content)
	// return 'ok'
	try {
		const completions = await openai.createChatCompletion({
			model: "gpt-3.5-turbo",
			messages: prompt.content
		});
		return completions.data.choices[0].message.content;
	} catch (error) {
		console.log(error);
	}

}

io.on('connection', (socket) => {
	console.log('A user is connected');

	socket.on('join', ({ name, room }, callback) => {
		const { error, user } = addUser({ id: socket.id, name, room });
		console.log(`${name} has joined this room  ${room}`);

		if (error) return callback(error);

		socket.join(user.room);

		socket.emit('message', { user: 'admin', text: `${user.name}, welcome to the room ${user.room}` });
		socket.broadcast.to(user.room).emit('message', { user: 'admin', text: `${user.name}, has joined` });

		io.to(user.room).emit('roomData', { room: user.room, users: getUsersInRoom(user.room) });

		callback();
	});

	socket.on('sendMessage', async (message, callback) => {
		const user = getUser(socket.id);
		addMessage(user.room, { role: "user", content: message })
		io.to(user.room).emit('message', { user: user.name, text: message });
		const chats = getMessage(user.room)

		// io.to(user.room).emit('message', { user: user.name, text: message });
		callback();
		console.log(chats)
		// return
		if (message.includes('gpt')) {
			const response = await generateResponse(chats);
			addMessage(socket.id, { role: "assistant", content: response })
			// add method to get chat history.
			io.to(user.room).emit('message', { user: 'gpt', text: response });
		}
	});

	socket.on('disconnect', () => {
		const user = removeUser(socket.id);
		if (user) {
			io.to(user.room).emit('message', { user: 'Admin', text: `${user.name} has left.` });
			io.to(user.room).emit('roomData', { room: user.room, users: getUsersInRoom(user.room) });
		}
	})
})



server.listen(PORT, () => console.log(`Listening on port ${PORT}`))
