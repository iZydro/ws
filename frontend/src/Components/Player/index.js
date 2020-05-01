import React from 'react';
import axios from 'axios';

import Status from './Status';
import { SERVER } from '../../Settings'

class Player extends React.Component {

	state = {
		logged: false,
		result: null
	};

	async login(email, password) {
		const url = `${SERVER}/mm/add`;
		const result = await axios.post(url, {
			email: email,
			password: password,
			name: this.props.name
		});

		this.setState( { logged: true, result: result.data } );
		return result.data;
	}

	async play(name, candy1, candy2) {
		const url = `${SERVER}/mm/move`;
		const result = await axios.post(url, { name: name, candy1: candy1, candy2: candy2});
		return result.data;
	}

	render() {
		const { name } = this.props;

		return(
			<div>
				<Status
					logged={this.state.logged}
					onPlay={this.play.bind(this)}
					onLogin={this.login.bind(this)}
					name={name}
				/>
			 	{/*<pre>State: {JSON.stringify(this.state, null, 2)}</pre>*/}
			</div>
		);
	}
}

export default Player;
