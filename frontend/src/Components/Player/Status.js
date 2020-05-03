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
		disabled: true,
		info: "",
		results: [],
		chat: [],
		server: []
	};

	connectionUrl = {
		value: "ws" + "://" + "localhost:" + "5000" + "/ws"
	};

	componentDidMount() {

	}

	onMessage(event) {
		const copy = this.state.server;
		copy.push(event.data);
		this.setState({
			server: copy
		});

		let disabled = true;
		try {

			const parsed = JSON.parse(event.data);

			if (parsed.hasOwnProperty("info")) {
				if (parsed.info.toLowerCase() === "tijeras") disabled = false;
				this.setState({
					info: parsed.info,
					disabled: disabled
				});
			}

			if (parsed.hasOwnProperty("chat")) {
				const chat = this.state.chat;
				chat.push(parsed.name + ": " + parsed.chat);
				this.setState({
					chat: chat,
				});
			}

			if (parsed.hasOwnProperty("results")) {
				this.setState({
					results: parsed.results,
				});
			}

		}
		catch(e)
		{

		}
	}

	onPlay(name, key, value) {
		console.log("Play");

		const message = {
			name: this.props.name,
			[key]: value,
		};

		const socket = this.state.socket;
		socket.send(JSON.stringify(message));

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

		const end = this.state.chat.length;
		const start = end - HEIGHT_MESSAGES >= 0 ? end - HEIGHT_MESSAGES : 0;

		// console.log(this.state.results);

		return(
			<div>
				{"Player: " + this.props.name}
				{!socket && <Login name={this.props.name} onClick={this.onConnect.bind(this)} />}
				{socket && <Logout onClick={this.onDisconnect.bind(this)} />}
				{socket && <PlayButton disabled={this.state.disabled} name={this.props.name} onClick={this.onPlay.bind(this)} />}
				<div>
					<div style={{float: "left"}}>
						<pre>{this.state.chat.slice(start, end).map( s => s + "\n")}</pre>
					</div>
					<div style={{float: "left", width: "64px"}}>
						&nbsp;
					</div>
					<div style={{float: "left"}}>
						<pre>{ this.state.info}</pre>
					</div>
					<div style={{float: "left", width: "64px"}}>
						&nbsp;
					</div>
					<div style={{float: "left"}}>
						<pre>{ this.state.results.map( r => r.username + ": " + r.play + "\n")}</pre>
					</div>
				</div>
			</div>
		);
	}

}

export default Status;
