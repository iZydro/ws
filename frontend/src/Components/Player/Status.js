import React from 'react';
import axios from 'axios';

import { SERVER } from '../../Settings'
import PlayButton from './PlayButton';
import Login from './Login';
import Logout from './Logout';

class Status extends React.Component {

	state = {
		// logged: false,
		result: {
			result: "not logged"
		},
		socket: null,
		server: []
	};

	connectionUrl = {
		value: "ws" + "://" + "localhost:" + "5000" + "/ws"
	};

	componentDidMount() {

	}

	onMessage(event) {
		console.log(event.data);
		var copy = this.state.server;
		copy.push(event.data);
		this.setState({
			server: copy
		});
	}

	onPlay(name, value) {
		console.log("Play");
		const socket = this.state.socket;
		socket.send(this.props.name + ": " + value);
	}

	onDisconnect() {
		const socket = this.state.socket;
		if (!socket || socket.readyState !== WebSocket.OPEN) {
			alert("socket not connected");
		}
		socket.close(1000, "Closing from client");
		this.setState({
			socket: null,
			server: []
		});
	}

	onConnect(name) {
		const socket = new WebSocket(this.connectionUrl.value + "/" + name);
		this.setState({
			socket: socket
		});

		socket.onopen = function (event) {
			console.log("open");
		};

		socket.onclose = function (event) {
			console.log("close");
		};

		//socket.onerror = updateState;

		socket.onmessage = this.onMessage.bind(this);

	}

	render() {

		const { socket } = this.state;
		const HEIGHT_MESSAGES = 10;

		const end = this.state.server.length;
		const start = end - HEIGHT_MESSAGES >= 0 ? end - HEIGHT_MESSAGES : 0;

		return(
			<div>
				{"Player: " + this.props.name}
				{!socket && <Login name={this.props.name} onClick={this.onConnect.bind(this)} />}
				{socket && <Logout onClick={this.onDisconnect.bind(this)} />}
				{socket && <PlayButton name={this.props.name} onClick={this.onPlay.bind(this)} />}
				<pre>
					{
						this.state.server.slice(start, end).map( s => s + "\n")
					}
				</pre>
			</div>
		);
	}

}

export default Status;
