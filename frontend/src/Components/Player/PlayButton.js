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
				<button onClick={() => onClick(name, this.state.value)}>
					Play
				</button>
			</div>
		);
	}
}

export default PlayButton;
