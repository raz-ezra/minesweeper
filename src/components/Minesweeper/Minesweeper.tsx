import React, {useEffect, useState} from 'react';
import {Board, BoardSettings, CellContent, GameState} from '../../types/types';
import {createBoard, getBoardWithRevealedCells, getUpdatedBoard} from '../../utils/utils';
import Cell from '../Cell/Cell';
import './Minesweeper.css';

type MinesweeperProps = {
    boardSettings: BoardSettings,
    superman: boolean
}

function Minesweeper({boardSettings, superman}: MinesweeperProps) {
    const [board, setBoard] = useState<Board>([]);
    const [usedFlags, setUsedFlags] = useState<number>(0);
    const [correctFlags, setCorrectFlags] = useState<number>(0);
    const [gameState, setGameState] = useState<GameState>(GameState.inProgress);

    useEffect(() => {
        setBoard(createBoard(boardSettings))
    }, [boardSettings])

    useEffect(() => {
        if (correctFlags === boardSettings.mines) setGameState(GameState.won);
    }, [correctFlags, boardSettings.mines])

    const updateBoardAtRowCol = (row: number, col: number, updates: Partial<CellContent>) => {
        setBoard(getUpdatedBoard(board, row, col, updates));
    }

    const revealCell = (row: number, col: number, board: Board) => {
        const newBoard = getBoardWithRevealedCells(row, col, board);
        setBoard(newBoard);
    }

    const handleFlagClick = (row: number, col: number, {isMine, isFlagged}: CellContent) => {
        if (!isFlagged && usedFlags === boardSettings.mines) {
            alert("No More Flags");
            return;
        }
        setUsedFlags(isFlagged ? usedFlags - 1 : usedFlags + 1);
        if (isMine) {
            setCorrectFlags(isFlagged ? correctFlags - 1 : correctFlags + 1)
        }
        updateBoardAtRowCol(row, col, {isFlagged: !isFlagged})
    }

    const handleClick = (e: any, row: number, col: number) => {
        if (gameState !== GameState.inProgress) return;
        const cell = board[row][col];
        if (e.shiftKey && !cell.isRevealed) {
            handleFlagClick(row, col, cell);
        } else if (cell.isMine) {
            setGameState(GameState.lost)
        } else if (!cell.isRevealed && !cell.isFlagged) {
            revealCell(row, col, board)
        }
    }

    const restartGame = () => {
        setBoard(createBoard(boardSettings));
        setUsedFlags(0);
        setCorrectFlags(0);
        setGameState(GameState.inProgress);
    }

    const getHeaderContent = () => {
        switch (gameState) {
            case GameState.inProgress:
                return `🚩 : ${boardSettings.mines - usedFlags}`;
            case GameState.lost:
                return "❌"
            case GameState.won:
                return "🏁"
        }
    }

    return (
        <div className="Minesweeper proud">
            <div className="header sunk">
                <span onClick={restartGame} title="New Game" style={{cursor: "pointer"}}>
                    {getHeaderContent()}
                </span>
            </div>
            <div className="body sunk">
                {board.map((row, i) => (
                    <div className="row" key={i}>
                        {row.map((cell, j) => (
                            <Cell
                                key={j}
                                cell={cell}
                                onClick={(e) => handleClick(e, i, j)}
                                superman={superman || gameState !== GameState.inProgress}
                            />
                        ))}
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Minesweeper;
