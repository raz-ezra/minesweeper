import React, {MouseEvent} from 'react';
import { CellContent } from '../../types/types';
import classnames from "classnames";
import './Cell.css';

type CellProps = {
    cell: CellContent,
    onClick: (e: MouseEvent<HTMLDivElement>) => void;
    superman: boolean;
}

function Cell({cell, onClick, superman}: CellProps) {

    const isRevealed = cell.isRevealed || superman;

    const getCellContent = () => {
        if (cell.isFlagged) return "🚩";
        if (!isRevealed) return null;
        if (cell.isMine) return "💣";
        if (cell.neighborMines) return cell.neighborMines;
        return null;
    }

    return (
        <div className={classnames("cell", `num${cell.neighborMines}`, {proud:!cell.isRevealed, icon: cell.isMine || cell.isFlagged})} onClick={onClick}>
            {getCellContent()}
        </div>
    );
}

export default Cell;
