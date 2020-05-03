import React from 'react';
import axios from 'axios';

import { statusUrl} from '../Settings'

class Stats extends React.Component {

	state = {
		result: '????',
		refresh: false
  };
  
  async onClick() {
		this.setState( { refresh: true } );
  }

	componentDidMount() {
		this.readStats();
	}

	async readStats() {

		try {
			const result = await axios.get(statusUrl.value);
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
