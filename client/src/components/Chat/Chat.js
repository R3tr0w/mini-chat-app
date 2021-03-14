import React, { useState, useEffect } from 'react';
import queryString from 'query-string';
import io from 'socket.io-client';
import InfoBar from '../InfoBar/InfoBar';
import Input from '../Input/Input';
import Messages from '../Messages/Messages';

let socket;

const Chat = ({ location }) => {
	const [name,setName] = useState('');
	const [room,setRoom] = useState('');
	const [message, setMessage] = useState('');
	const [messages, setMessages] = useState([]);
	const ENDPOINT = 'localhost:5000';

	useEffect(() => {
		const { name, room } = queryString.parse(location.search);
		
		socket = io(ENDPOINT);

		setName(name);
		setRoom(room);

		socket.emit('join', { name, room }, (error) => {
			if (error) alert(error);
		});

		return () => {
			socket.emit('disconnect');

			socket.off();
		}

	}, [ENDPOINT, location.search]);

	useEffect(() => {
		
		socket.on('message', (message) => {
			setMessages([...messages, message]);
		});	
	}, [messages]);

	const sendMessage = event => {
		event.preventDefault();

		if(message){
			socket.emit('sendMessage', message, ()=> setMessage(''));
		}
	}

	return (
		<div>
			<InfoBar room={room} name={name} />
			<Messages messages={messages} name={name} />
			<Input message={message} setMessage={setMessage} sendMessage={sendMessage} />
		</div>
	)
	
};

export default Chat;