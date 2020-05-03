import React from 'react';

import Status from './Status';

class Player extends React.Component {

	state = {
		logged: false,
		result: null
	};

	render() {
		const { name } = this.props;

		return(
			<div>
				<Status
					logged={this.state.logged}
					name={name}
				/>
			</div>
		);
	}
}

export default Player;
