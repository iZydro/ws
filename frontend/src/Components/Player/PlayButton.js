import React from 'react';

class PlayButton extends React.Component {

	render() {
		const { onClick, name } = this.props;

		return(
			<div>
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
