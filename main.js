import Scoreboard from './scoreboard.js';
import {Shape, Shapes} from './shape.js';

'use strict';
var canvas = document.querySelector('canvas');
canvas.width = 640;
canvas.height = 640;

var g = canvas.getContext('2d');

var right = { x: 1, y: 0 };
var down = { x: 0, y: 1 };
var left = { x: -1, y: 0 };

var EMPTY = -1;
var BORDER = -2;

var fallingShape;
var nextShape;
var dim = 640;
var nRows = 18;
var nCols = 12;
var blockSize = 30;
var topMargin = 50;
var leftMargin = 20;
var scoreX = 400;
var scoreY = 330;
var titleX = 130;
var titleY = 160;
var clickX = 120;
var clickY = 400;
var previewCenterX = 467;
var previewCenterY = 97;
var mainFont = 'bold 48px monospace';
var smallFont = 'bold 18px monospace';
var colors = ['green', 'red', 'blue', 'purple', 'orange', 'blueviolet', 'magenta'];
var gridRect = { x: 46, y: 47, w: 308, h: 517 };
var previewRect = { x: 387, y: 47, w: 200, h: 200 };
var titleRect = { x: 100, y: 95, w: 252, h: 100 };
var clickRect = { x: 50, y: 375, w: 252, h: 40 };
var outerRect = { x: 5, y: 5, w: 630, h: 630 };
var squareBorder = 'white';
var titlebgColor = 'white';
var textColor = 'black';
var bgColor = '#DDEEFF';
var gridColor = '#BECFEA';
var gridBorderColor = '#7788AA';
var largeStroke = 5;
var smallStroke = 2;

// position of falling shape
var fallingShapeRow;
var fallingShapeCol;

var keyDown = false;
var fastDown = false;
//var lastFrameTime = -1;

var grid = [];
var scoreboard = new Scoreboard();

addEventListener('keydown', function (event) {
    if (!keyDown) {
        keyDown = true;

        if (scoreboard.isGameOver())
            return;

        switch (event.key) {

            case 'w':
            case 'ArrowUp':
                if (canRotate(fallingShape))
                    rotate(fallingShape);
                break;

            case 'a':
            case 'ArrowLeft':
                if (canMove(fallingShape, left))
                    move(left);
                break;

            case 'd':
            case 'ArrowRight':
                if (canMove(fallingShape, right))
                    move(right);
                break;

            case 's':
            case 'ArrowDown':
                if (!fastDown) {
                    fastDown = true;
                    while (canMove(fallingShape, down)) {
                        move(down);
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

function canRotate(s) {
    if (s === Shapes.Square)
        return false;

    var pos = new Array(4);
    for (var i = 0; i < pos.length; i++) {
        pos[i] = s.pos[i].slice();
    }

    pos.forEach(function (row) {
        var tmp = row[0];
        row[0] = row[1];
        row[1] = -tmp;
    });

    return pos.every(function (p) {
        var newCol = fallingShapeCol + p[0];
        var newRow = fallingShapeRow + p[1];
        return grid[newRow][newCol] === EMPTY;
    });
}

function rotate(s) {
    if (s === Shapes.Square)
        return;

    s.pos.forEach(function (row) {
        var tmp = row[0];
        row[0] = row[1];
        row[1] = -tmp;
    });
}

function move(dir) {
    fallingShapeRow += dir.y;
    fallingShapeCol += dir.x;
}

function canMove(s, dir) {
    return s.pos.every(function (p) {
        var newCol = fallingShapeCol + dir.x + p[0];
        var newRow = fallingShapeRow + dir.y + p[1];
        return grid[newRow][newCol] === EMPTY;
    });
}

function shapeHasLanded() {
    addShape(fallingShape);
    if (fallingShapeRow < 2) {
        scoreboard.setGameOver();
        scoreboard.setTopscore();
    } else {
        scoreboard.addLines(removeLines());
    }
    selectShape();
}

function removeLines() {
    var count = 0;
    for (var r = 0; r < nRows - 1; r++) {
        for (var c = 1; c < nCols - 1; c++) {
            if (grid[r][c] === EMPTY)
                break;
            if (c === nCols - 2) {
                count++;
                removeLine(r);
            }
        }
    }
    return count;
}

function removeLine(line) {
    for (var c = 0; c < nCols; c++)
        grid[line][c] = EMPTY;

    for (var c = 0; c < nCols; c++) {
        for (var r = line; r > 0; r--)
            grid[r][c] = grid[r - 1][c];
    }
}

function addShape(s) {
    s.pos.forEach(function (p) {
        grid[fallingShapeRow + p[1]][fallingShapeCol + p[0]] = s.ordinal;
    });
}

function selectShape() {
    fallingShapeRow = 1;
    fallingShapeCol = 5;
    fallingShape = nextShape;
    nextShape = Shape.getRandomShape();
    if (fallingShape != null) {
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
    var bs = blockSize;
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
    for (var r = 0; r < nRows; r++) {
        for (var c = 0; c < nCols; c++) {
            var idx = grid[r][c];
            if (idx > EMPTY)
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
    var minX = 5, minY = 5, maxX = 0, maxY = 0;
    nextShape.pos.forEach(function (p) {
        minX = Math.min(minX, p[0]);
        minY = Math.min(minY, p[1]);
        maxX = Math.max(maxX, p[0]);
        maxY = Math.max(maxY, p[1]);
    });
    var cx = previewCenterX - ((minX + maxX + 1) / 2.0 * blockSize);
    var cy = previewCenterY - ((minY + maxY + 1) / 2.0 * blockSize);

    g.translate(cx, cy);
    nextShape.shape.forEach(function (p) {
        drawSquare(nextShape.ordinal, p[1], p[0]);
    });
    g.translate(-cx, -cy);
}

function drawFallingShape() {
    var idx = fallingShape.ordinal;
    fallingShape.pos.forEach(function (p) {
        drawSquare(idx, fallingShapeRow + p[1], fallingShapeCol + p[0]);
    });
}

function animate(lastFrameTime) {
    var requestId = requestAnimationFrame(function () {
        animate(lastFrameTime);
    });

    var time = new Date().getTime();
    var delay = scoreboard.getSpeed();

    if (lastFrameTime + delay < time) {

        if (!scoreboard.isGameOver()) {

            if (canMove(fallingShape, down)) {
                move(down);
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
    initGrid();
    selectShape();
    scoreboard.reset();
    animate(-1);
}

function initGrid() {
    function fill(arr, value) {
        for (var i = 0; i < arr.length; i++) {
            arr[i] = value;
        }
    }
    for (var r = 0; r < nRows; r++) {
        grid[r] = new Array(nCols);
        fill(grid[r], EMPTY);
        for (var c = 0; c < nCols; c++) {
            if (c === 0 || c === nCols - 1 || r === nRows - 1)
                grid[r][c] = BORDER;
        }
    }
}

function init() {
    initGrid();
    selectShape();
    draw();
}

init();