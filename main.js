import Scoreboard from './scoreboard.js';
import Shape from './shape.js';
import Board from './board.js';

'use strict';
const canvas = document.querySelector('canvas');
canvas.width = 640;
canvas.height = 640;

const g = canvas.getContext('2d');

const right = { x: 1, y: 0 };
const down = { x: 0, y: 1 };
const left = { x: -1, y: 0 };

const nRows = 18;
const nCols = 12;
const blockSize = 30;
const topMargin = 50;
const leftMargin = 20;
const scoreX = 400;
const scoreY = 330;
const titleX = 130;
const titleY = 160;
const clickX = 120;
const clickY = 400;
const previewCenterX = 467;
const previewCenterY = 97;
const mainFont = 'bold 48px monospace';
const smallFont = 'bold 18px monospace';
const colors = ['green', 'red', 'blue', 'purple', 'orange', 'blueviolet', 'magenta'];
const gridRect = { x: 46, y: 47, w: 308, h: 517 };
const previewRect = { x: 387, y: 47, w: 200, h: 200 };
const titleRect = { x: 100, y: 95, w: 252, h: 100 };
const clickRect = { x: 50, y: 375, w: 252, h: 40 };
const outerRect = { x: 5, y: 5, w: 630, h: 630 };
const squareBorder = 'white';
const titlebgColor = 'white';
const textColor = 'black';
const bgColor = '#DDEEFF';
const gridColor = '#BECFEA';
const gridBorderColor = '#7788AA';
const largeStroke = 5;
const smallStroke = 2;

const scoreboard = new Scoreboard();
const board = new Board(nRows, nCols);

let fallingShape;
let nextShape;

let keyDown = false;
let fastDown = false;
//let lastFrameTime = -1;

addEventListener('keydown', function (event) {
    if (!keyDown) {
        keyDown = true;

        if (scoreboard.isGameOver())
            return;

        switch (event.key) {

            case 'w':
            case 'ArrowUp':
                if (fallingShape.canRotate(board.grid))
                    fallingShape.rotate();
                break;

            case 'a':
            case 'ArrowLeft':
                if (fallingShape.canMove(board.grid, left))
                    fallingShape.move(left);
                break;

            case 'd':
            case 'ArrowRight':
                if (fallingShape.canMove(board.grid, right))
                    fallingShape.move(right);
                break;

            case 's':
            case 'ArrowDown':
                if (!fastDown) {
                    fastDown = true;
                    while (fallingShape.canMove(board.grid, down)) {
                        fallingShape.move(down);
                        draw();
                    }
                    shapeHasLanded();
                }
        }
        draw();
    }
});

addEventListener('click', function () {
    if (scoreboard.isGameOver()) {
        startNewGame();
    }
});

addEventListener('keyup', function () {
    keyDown = false;
    fastDown = false;
});

function shapeHasLanded() {
    board.addShape(fallingShape);
    if (fallingShape.row < 2) {
        scoreboard.setGameOver();
        scoreboard.setTopscore();
    } else {
        scoreboard.addLines(board.removeLines());
    }
    selectShape();
}

function selectShape() {
    fallingShape = nextShape;
    nextShape = Shape.getRandomShape();
    if (fallingShape) {
        fallingShape.reset();
    }
}

function draw() {
    g.clearRect(0, 0, canvas.width, canvas.height);

    drawUI();

    if (scoreboard.isGameOver()) {
        drawStartScreen();
    } else {
        drawFallingShape();
    }
}

function drawStartScreen() {
    g.font = mainFont;

    fillRect(titleRect, titlebgColor);
    fillRect(clickRect, titlebgColor);

    g.fillStyle = textColor;
    g.fillText('Tetris', titleX, titleY);

    g.font = smallFont;
    g.fillText('click to start', clickX, clickY);
}

function fillRect(r, color) {
    g.fillStyle = color;
    g.fillRect(r.x, r.y, r.w, r.h);
}

function drawRect(r, color) {
    g.strokeStyle = color;
    g.strokeRect(r.x, r.y, r.w, r.h);
}

function drawSquare(colorIndex, r, c) {
    const bs = blockSize;
    g.fillStyle = colors[colorIndex];
    g.fillRect(leftMargin + c * bs, topMargin + r * bs, bs, bs);

    g.lineWidth = smallStroke;
    g.strokeStyle = squareBorder;
    g.strokeRect(leftMargin + c * bs, topMargin + r * bs, bs, bs);
}

function drawUI() {

    // background
    fillRect(outerRect, bgColor);
    fillRect(gridRect, gridColor);

    // the blocks dropped in the grid
    for (let r = 0; r < nRows; r++) {
        for (let c = 0; c < nCols; c++) {
            const idx = board.grid[r][c];
            if (idx > board.EMPTY)
                drawSquare(idx, r, c);
        }
    }

    // the borders of grid and preview panel
    g.lineWidth = largeStroke;
    drawRect(gridRect, gridBorderColor);
    drawRect(previewRect, gridBorderColor);
    drawRect(outerRect, gridBorderColor);

    // scoreboard
    g.fillStyle = textColor;
    g.font = smallFont;
    g.fillText('hiscore    ' + scoreboard.getTopscore(), scoreX, scoreY);
    g.fillText('level      ' + scoreboard.getLevel(), scoreX, scoreY + 30);
    g.fillText('lines      ' + scoreboard.getLines(), scoreX, scoreY + 60);
    g.fillText('score      ' + scoreboard.getScore(), scoreX, scoreY + 90);

    // preview
    let minX = 5, minY = 5, maxX = 0, maxY = 0;
    nextShape.pos.forEach(function (p) {
        minX = Math.min(minX, p[0]);
        minY = Math.min(minY, p[1]);
        maxX = Math.max(maxX, p[0]);
        maxY = Math.max(maxY, p[1]);
    });
    const cx = previewCenterX - ((minX + maxX + 1) / 2.0 * blockSize);
    const cy = previewCenterY - ((minY + maxY + 1) / 2.0 * blockSize);

    g.translate(cx, cy);
    nextShape.shape.forEach(function (p) {
        drawSquare(nextShape.ordinal, p[1], p[0]);
    });
    g.translate(-cx, -cy);
}

function drawFallingShape() {
    const idx = fallingShape.ordinal;
    fallingShape.pos.forEach(function (p) {
        drawSquare(idx, fallingShape.row + p[1], fallingShape.col + p[0]);
    });
}

function animate(lastFrameTime) {
    const requestId = requestAnimationFrame(function () {
        animate(lastFrameTime);
    });

    const time = new Date().getTime();
    const delay = scoreboard.getSpeed();

    if (lastFrameTime + delay < time) {

        if (!scoreboard.isGameOver()) {

            if (fallingShape.canMove(board.grid, down)) {
                fallingShape.move(down);
            } else {
                shapeHasLanded();
            }
            draw();
            lastFrameTime = time;

        } else {
            cancelAnimationFrame(requestId);
        }
    }
}

function startNewGame() {
    board.initGrid();
    selectShape();
    scoreboard.reset();
    animate(-1);
}

function init() {
    selectShape();
    draw();
}

init();