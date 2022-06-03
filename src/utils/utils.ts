import {Board, BoardSettings, CellContent} from "../types/types";

function getRandomInt(max: number) {
    return Math.floor(Math.random() * max);
}

const getMines = ({rows, cols, mines}: BoardSettings): Record<number, number[]> => {
    const minesIndex: Record<number, number[]> = {};
    let added = 0

    while (added < mines) {
        const row = getRandomInt(rows);
        const col = getRandomInt(cols);
        if (!minesIndex[row] && !minesIndex[row]?.includes(col)) {
            added++;
            if (minesIndex[row]) {
                minesIndex[row].push(col);
            } else {
                minesIndex[row] = [col]
            }
        }
    }
    return minesIndex;
}

export const createBoard = (boardSettings: BoardSettings): Board => {
    const board: Board = [];
    const minesIndex = getMines(boardSettings);
    for (let row = 0; row < boardSettings.rows; row++) {
        board[row] = [];
        for (let col = 0; col < boardSettings.cols; col++) {
            const isMine = minesIndex[row]?.includes(col) ?? false;
            let neighborMines = 0;
            if (!isMine) {
                if (minesIndex[row]?.includes(col - 1)) neighborMines++;
                if (minesIndex[row]?.includes(col + 1)) neighborMines++;
                if (minesIndex[row - 1]?.includes(col)) neighborMines++;
                if (minesIndex[row - 1]?.includes(col - 1)) neighborMines++;
                if (minesIndex[row - 1]?.includes(col + 1)) neighborMines++;
                if (minesIndex[row + 1]?.includes(col)) neighborMines++;
                if (minesIndex[row + 1]?.includes(col - 1)) neighborMines++;
                if (minesIndex[row + 1]?.includes(col + 1)) neighborMines++;
            }
            board[row][col] = {isMine, isFlagged: false, neighborMines, isRevealed: false}
        }
    }
    return board;
}

export const getUpdatedBoard = (board: Board, row: number, col: number, updates: Partial<CellContent>) => {
    const newBoard = [...board]
    const newRow = [...newBoard[row]]
    const newCell = {...newRow[col], ...updates}
    newRow.splice(col, 1, newCell);
    newBoard.splice(row, 1, newRow);
    return newBoard;
}

const getNeighbourCells = (row: number, col: number, rowsCount: number, cellsCount: number) => {
    const cells = [];
    // same row;
    if (col - 1 >= 0) cells.push([row, col - 1])
    if (col + 1 < cellsCount) cells.push([row, col + 1])
    // row above
    if (row - 1 >= 0) cells.push([row - 1, col])
    if (row - 1 >= 0 && col - 1 >= 0) cells.push([row - 1, col - 1])
    if (row - 1 >= 0 && col + 1 < cellsCount) cells.push([row - 1, col + 1])
    // row below
    if (row + 1 < rowsCount) cells.push([row + 1, col])
    if (row + 1 < rowsCount && col - 1 >= 0) cells.push([row + 1, col - 1])
    if (row + 1 < rowsCount && col + 1 < cellsCount) cells.push([row + 1, col + 1])

    return cells;
};

const constructKey = (row: number, col: number) => `${row},${col}`;

// when clicking a cell with 0 mines next to it, we need to reveal all cells next to until all 'edges' have neighbors
export const getBoardWithRevealedCells = (row: number, col: number, board: Board): Board => {
    const rowsCount = board.length;
    const colsCount = board[0].length;
    // hold cells to visit
    const q: number[][] = [[row, col]];
    // hold cells to be revealed
    const seen = new Map<string, number[]>();
    while (q.length > 0) {
        const [row, col] = q.shift()!;
        const cell = board[row][col];
        // check if already visited, or if not flagged (fist cell will never be flagged - see "handleClick" in Minesweeper.tsx)
        if (!seen.has(constructKey(row, col)) && !cell.isFlagged) {
            // add to visited cells + get all neighbors
            seen.set(constructKey(row, col), [row, col])
            if (!cell.neighborMines) q.push(...getNeighbourCells(row, col, rowsCount, colsCount))
        }
    }

    // reveal all cells in set
    let newBoard = board;
    for (let value of seen.values()) {
        const [row, col] = value;
        newBoard = getUpdatedBoard(newBoard, row, col, {isRevealed: true})
    }

    return newBoard;
}