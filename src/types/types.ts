export type CellContent = {
    isMine: boolean,
    isFlagged: boolean,
    neighborMines: number,
    isRevealed: boolean
}

export type Board = CellContent[][];

export enum GameState {
    inProgress,
    won,
    lost
}

export type BoardSettings = {
    rows: number,
    cols: number,
    mines: number
}