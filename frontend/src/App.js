import React from 'react';
import './App.css';
import { getName } from "./Namer";
import { environment } from './Settings';

import Player from './Components/Player/index';
import Stats from './Components/Stats';

function App() {

  return (
    <div className="App">
      <div className="Players">
        <div className="Left-Column">
          <Player name={getName()}/>
          { environment === "local" &&
            <div>
            <hr style={{width: '99%'}}/>
            <Player name={getName()}/>
            <hr style={{width: '99%'}}/>
            <Player name={getName()}/>
            <hr style={{width: '99%'}}/>
            <Player name={getName()}/>
            </div>
          }
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
