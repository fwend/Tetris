export const BOARD_EMPTY = -1;
export const BOARD_BORDER = -2;

export default class Board {

    constructor(nRows, nCols) {
        this.nRows = nRows;
        this.nCols = nCols;
        this.grid = [];
        this.initGrid();
    }

    initGrid() {
        for (let r = 0; r < this.nRows; r++) {
            this.grid[r] = Array.from({length: this.nCols}, () => BOARD_EMPTY);
            for (let c = 0; c < this.nCols; c++) {
                if (c === 0 || c === this.nCols - 1 || r === this.nRows - 1)
                    this.grid[r][c] = BOARD_BORDER;
            }
        }
    }    

    removeLines() {
        let count = 0;
        for (let r = 0; r <  this.nRows - 1; r++) {
            for (let c = 1; c < this.nCols - 1; c++) {
                if (this.grid[r][c] === BOARD_EMPTY)
                    break;
                if (c === this.nCols - 2) {
                    count++;
                    this.removeLine(r);
                }
            }
        }
        return count;
    }
    
    removeLine(line) {
        for (let c = 0; c < this.nCols; c++)
            this.grid[line][c] = BOARD_EMPTY;
    
        for (let c = 0; c < this.nCols; c++) {
            for (let r = line; r > 0; r--)
                this.grid[r][c] = this.grid[r - 1][c];
        }
    }
    
    addShape(fallingShape) {
        fallingShape.pos.forEach(p => {
            this.grid[fallingShape.row + p[1]][fallingShape.col + p[0]] = fallingShape.ordinal;
        });
    }
    
}
