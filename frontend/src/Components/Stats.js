import React from 'react';
import axios from 'axios';

import { SERVER } from '../Settings'

class Stats extends React.Component {

	state = {
		result: '????',
		refresh: false
  };
  
  async onClick() {
		const url = `${SERVER}/mm/reset`;
		const result = await axios.get(url);
		this.setState( { refresh: true } );
  }

	componentDidMount() {
		this.readStats();
	}

	async readStats() {
		const connectionUrl = {
			value: "http" + "://" + "localhost:" + "5000" + "/status"
		};

		try {
			const result = await axios.get(connectionUrl.value);
			console.log(`read: ${result.data}`);
			this.setState( { result: result.data } );
		}
		catch(e) {
			console.log("Error reading status: " + e);
		}
		setTimeout(this.readStats.bind(this), 1000);
	}

	render() {
		const result = this.state.result;

		return(
			<div>
				<pre>{result}</pre>
        <button onClick={this.onClick.bind(this)}>
  				Reset
	  		</button>
			</div>
		);
	}

}

export default Stats;
