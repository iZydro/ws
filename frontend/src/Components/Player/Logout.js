import React from 'react';

class Logout extends React.Component {

	render() {
		const { onClick } = this.props;

		return(
			<div>
				<button onClick={() => onClick()}>
					Logout
				</button>
			</div>
		);
	}

}

export default Logout;
