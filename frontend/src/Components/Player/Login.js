import React from 'react';

class Login extends React.Component {

	state = {
		email: "",
		password: "",
		server: []
	};

	changeText(event) {
		this.setState({[event.target.name]: event.target.value});
	}

	onMessage(event) {
		console.log(event.data);
		var copy = this.state.server;
		copy.push(event.data);
		this.setState({
			server: copy
		});
	}

	onConnect() {
		var socket = new WebSocket(this.connectionUrl.value);

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
		const { onClick } = this.props;

		console.log("Server");
		console.log(this.state.server);
		const end = this.state.server.length;
		const start = end - 4 >= 0 ? end - 4 : 0;

		return(
			<div>
				<input name={"email"} value={this.state.email} onChange={this.changeText.bind(this)}/>
				<input type="password" name={"password"} value={this.state.password} onChange={this.changeText.bind(this)} />
				<button onClick={() => onClick(this.props.name)}>
					Login
				</button>
				<pre>
					{
						this.state.server.slice(start, end).map( s => s + "\n")
					}
				</pre>
			</div>
		);
	}

}

export default Login;
