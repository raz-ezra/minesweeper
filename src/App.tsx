import React, { useState } from 'react';
import './App.css';
import Minesweeper from "./components/Minesweeper/Minesweeper";
import Controls from "./components/Controls/Controls";
import {BoardSettings} from "./types/types";

function App() {
  const [boardSettings, setBoardSettings] = useState<BoardSettings>({rows: 10, cols: 10, mines: 10});
  const [superman, setSuperman] = useState<boolean>(false);

  return (
    <div className="App">
        <div className="instructions">
            <h1>Minesweeper</h1>
            <p>
                Shift + Click to place a flag<br/>
                To start a new game, click the board's header
            </p>
            <p>
                <i>The full board might not fit the screen, scroll within the play area to access the full board</i>
            </p>
        </div>
        <Controls boardSettings={boardSettings} setBoardSettings={setBoardSettings} superman={superman} setSuperman={setSuperman} />
        <div className="game">
            <Minesweeper boardSettings={boardSettings} superman={superman} />
        </div>
    </div>
  );
}

export default App;
