import {BOARD_EMPTY} from "./board.js";

export default class Shape {

    constructor(shape, o) {
        this.shape = shape;
        this.pos = this.reset();
        this.ordinal = o;
    }

    reset() {
        this.row = 1;
        this.col = 5;        
        this.pos = new Array(4);
        for (let i = 0; i < this.pos.length; i++) {
            this.pos[i] = this.shape[i].slice();
        }
        return this.pos;  
    }  

    canRotate(grid) {
        if (this === Shapes.Square)
            return false;
    
        const pos = new Array(4);
        for (let i = 0; i < pos.length; i++) {
            pos[i] = this.pos[i].slice();
        }
    
        pos.forEach(row => {
            const tmp = row[0];
            row[0] = row[1];
            row[1] = -tmp;
        });
    
        return pos.every(p => {
            const newCol = this.col + p[0];
            const newRow = this.row + p[1];
            return grid[newRow][newCol] === BOARD_EMPTY
        });
    } 
    
    rotate() {
        if (this === Shapes.Square)
            return;
    
        this.pos.forEach(row => {
            const tmp = row[0];
            row[0] = row[1];
            row[1] = -tmp;
        });
    }   
    
    move(dir) {
        this.row += dir.y;
        this.col += dir.x;
    }
    
    canMove(grid, dir) {
        return this.pos.every(p => {
            const newCol = this.col + dir.x + p[0];
            const newRow = this.row + dir.y + p[1];
            return grid[newRow][newCol] === BOARD_EMPTY
        });
    }    

    static getRandomShape() {
        const keys = Object.keys(Shapes);
        const ord = Math.floor(Math.random() * keys.length);
        const shape = Shapes[keys[ord]];
        return new Shape(shape, ord);
    }    
}

const Shapes = {
    ZShape: [[0, -1], [0, 0], [-1, 0], [-1, 1]],
    SShape: [[0, -1], [0, 0], [1, 0], [1, 1]],
    IShape: [[0, -1], [0, 0], [0, 1], [0, 2]],
    TShape: [[-1, 0], [0, 0], [1, 0], [0, 1]],
    Square: [[0, 0], [1, 0], [0, 1], [1, 1]],
    LShape: [[-1, -1], [0, -1], [0, 0], [0, 1]],
    JShape: [[1, -1], [0, -1], [0, 0], [0, 1]]
};
