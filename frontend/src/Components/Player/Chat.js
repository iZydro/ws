import React from 'react';

class Chat extends React.Component {

	state = {
    value: "",
	};

	handleChange(event) {
    this.setState({[event.target.name]: event.target.value});
	}

	render() {
		const { onClick, name } = this.props;

		return(
			<div>
				<input name="value" value={this.state.value} size="32" onChange={this.handleChange.bind(this)} />
				<button onClick={() => onClick(name, "chat", this.state.value)}>
					Send
				</button>

			</div>
		);
	}
}

export default Chat;
