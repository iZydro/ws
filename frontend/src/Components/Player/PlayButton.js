import React from 'react';

class PlayButton extends React.Component {

	state = {
    value: "Cenutrio",
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
					Play
				</button>

				<br />

				<button disabled={this.props.disabled} onClick={() => onClick(name, "play", "piedra")}>
					Piedra
				</button>
				<button disabled={this.props.disabled} onClick={() => onClick(name, "play", "papel")}>
					Papel
				</button>
				<button disabled={this.props.disabled} onClick={() => onClick(name, "play", "tijeras")}>
					Tijeras
				</button>

			</div>
		);
	}
}

export default PlayButton;
