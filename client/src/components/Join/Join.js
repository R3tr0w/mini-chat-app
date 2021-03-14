import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';

import './Join.css';

const Join = () => {
	const [name, setName] = useState('');
	const [room, setRoom] = useState('');

	return (
		<Grid container spacing={3}>
			<Grid item xs={12}>
				<Paper align="center">
					<Typography variant="h2">UYU</Typography>
					<TextField label="Username"
					  onChange={event => setName(event.target.value)} />
					<br/>
					<TextField label="Room"
					  onChange={event => setRoom(event.target.value)} />
					<br/>
					<Link onClick={event => (!name || !room) ? event.preventDefault(): null }
					  to={`/chat?name=${name}&room=${room}`}>
					<Button variant="contained" color="primary" style={{margin:20}} >
						Join
					</Button>
					</Link>
				</Paper>
			</Grid>
			
		</Grid>
	)
}

export default Join;