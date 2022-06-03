import React, { useState } from 'react';
import './Controls.css';
import {BoardSettings} from "../../types/types";

type ControlsProps = {
    boardSettings: BoardSettings,
    setBoardSettings: (value: BoardSettings) => void;
    superman: boolean;
    setSuperman: (value: boolean) => void;
}

function Controls({boardSettings, setBoardSettings, superman, setSuperman}: ControlsProps) {
    const [localBoardSettings, setLocalBoardSettings] = useState<BoardSettings>(boardSettings);

    const handleBoardSettingChange = (value: string, attr: string) => {
        const number = parseInt(value);
        if (!isNaN(number)) {
            setLocalBoardSettings({
                ...localBoardSettings,
                [attr]: number
            })
        }
    }

    return (
        <div className="controls">
            <div className="control">
                <label htmlFor="rows">Rows:</label>
                <input type="number" id="rows" value={localBoardSettings.rows} onChange={(e) => handleBoardSettingChange(e.target.value, "rows")} />
            </div>
            <div className="control">
                <label htmlFor="columns">Columns:</label>
                <input type="number" id="columns" value={localBoardSettings.cols} onChange={(e) => handleBoardSettingChange(e.target.value, "cols")} />
            </div>
            <div className="control">
                <label htmlFor="mines">Mines:</label>
                <input type="number" id="mines" value={localBoardSettings.mines} onChange={(e) => handleBoardSettingChange(e.target.value, "mines")} />
            </div>
            <button onClick={() => setBoardSettings(localBoardSettings)}>New Game</button>
            <div className="control">
                <input type="checkbox" id="superman" checked={superman} onChange={(e) => setSuperman(e.target.checked)} />
                <label htmlFor="superman">Reveal Board</label>
            </div>
        </div>
    );
}

export default Controls;
