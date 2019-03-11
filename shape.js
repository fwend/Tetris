export {Shape, Shapes}

class Shape {

    constructor(shape, o) {
        this.shape = shape;
        this.pos = this.reset();
        this.ordinal = o;
    }

    reset() {
        this.pos = new Array(4);
        for (let i = 0; i < this.pos.length; i++) {
            this.pos[i] = this.shape[i].slice();
        }
        return this.pos;  
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

