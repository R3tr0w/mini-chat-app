import React from 'react';
import './Message.css';


const Message = ({ message: { text, user }, name }) => {

	let isSentByUser = false;

	const trimmedName = name.trim().toLowerCase();


	if (user === trimmedName) {
		isSentByUser = true;
	}



	return (
		isSentByUser ?
			<div className="messageContainer justifyEnd">
				<div className="messageBox">
					<p className="messageText">{text}</p>
				</div>
				<p className="sentText" >{trimmedName}</p>
			</div>
			:
			<div className="messageContainer justifyStart">
				<p className="sentText" >{user}</p>
				<div className="messageBox">
					<p className="messageText">{text}</p>
				</div>
			</div>
	)
}

export default Message;