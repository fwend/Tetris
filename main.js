import Scoreboard from './scoreboard.js';
import Shape from './shape.js';
import Board, {BOARD_EMPTY} from './board.js';
import config from './config.js';
import trans from './lang/en.js';

'use strict';
const canvas = document.querySelector('canvas');
canvas.width = config.width;
canvas.height = config.height;

const g = canvas.getContext('2d');

const right = { x: 1, y: 0 };
const down = { x: 0, y: 1 };
const left = { x: -1, y: 0 };

const nRows = 18;
const nCols = 12;

const scoreboard = new Scoreboard();
const board = new Board(nRows, nCols);

let fallingShape;
let nextShape;

let keyDown = false;
let fastDown = false;

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
    g.font = config.mainFont;

    fillRect(config.titleRect, config.titlebgColor);
    fillRect(config.clickRect, config.titlebgColor);

    g.fillStyle = config.textColor;
    g.fillText(trans.title, config.titleX, config.titleY);

    g.font = config.smallFont;
    g.fillText(trans.start, config.clickX, config.clickY);
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
    const bs = config.blockSize;
    g.fillStyle = config.colors[colorIndex];
    g.fillRect(config.leftMargin + c * bs, config.topMargin + r * bs, bs, bs);

    g.lineWidth = config.smallStroke;
    g.strokeStyle = config.squareBorder;
    g.strokeRect(config.leftMargin + c * bs, config.topMargin + r * bs, bs, bs);
}

function drawUI() {

    // background
    fillRect(config.outerRect, config.bgColor);
    fillRect(config.gridRect, config.gridColor);

    // the borders of grid
    g.lineWidth = config.largeStroke;
    drawRect(config.gridRect, config.gridBorderColor);
    drawRect(config.outerRect, config.gridBorderColor);

    drawBlocks();
    drawScoreboard();
    drawPreview();
}

function drawBlocks() {
    // the blocks already dropped in the grid
    for (let r = 0; r < nRows; r++) {
        for (let c = 0; c < nCols; c++) {
            const idx = board.grid[r][c];
            if (idx > BOARD_EMPTY)
                drawSquare(idx, r, c);
        }
    }
}

function drawScoreboard() {
    g.fillStyle = config.textColor;
    g.font = config.smallFont;
    g.fillText(trans.hiscore + scoreboard.getTopscore(), config.scoreX, config.scoreY);
    g.fillText(trans.level + scoreboard.getLevel(), config.scoreX, config.scoreY + 30);
    g.fillText(trans.lines + scoreboard.getLines(), config.scoreX, config.scoreY + 60);
    g.fillText(trans.score + scoreboard.getScore(), config.scoreX, config.scoreY + 90);
}

function drawPreview() {
    let minX = 5, minY = 5, maxX = 0, maxY = 0;
    nextShape.pos.forEach(function (p) {
        minX = Math.min(minX, p[0]);
        minY = Math.min(minY, p[1]);
        maxX = Math.max(maxX, p[0]);
        maxY = Math.max(maxY, p[1]);
    });
    const cx = config.previewCenterX - ((minX + maxX + 1) / 2.0 * config.blockSize);
    const cy = config.previewCenterY - ((minY + maxY + 1) / 2.0 * config.blockSize);
    drawRect(config.previewRect, config.gridBorderColor);

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
