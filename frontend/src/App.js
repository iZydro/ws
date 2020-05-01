import React from 'react';
import './App.css';

import Player from './Components/Player/index';
import Stats from './Components/Stats';

function App() {
  return (
    <div className="App">
      <div className="Players">
        <div className="Left-Column">
          <Player name='Pollo'/>
					<hr style={{width: '99%'}}/>
          <Player name='Atun'/>
          <hr style={{width: '99%'}}/>
          <Player name='Avellanas'/>
          <hr style={{width: '99%'}}/>
          <Player name='Lechuga'/>
        </div>
        <div className="Right-Column">
					<div className="Stats">
						<Stats />
					</div>
				</div>
			</div>
    </div>
  );
}

export default App;
