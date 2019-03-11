export default class Scoreboard {
    constructor() {
        this.MAXLEVEL = 9;

        this.level = 0;
        this.lines = 0;
        this.score = 0;
        this.topscore = 0;
        this.gameOver = true;
    }

    reset() {
        this.setTopscore();
        this.level = this.lines = this.score = 0;
        this.gameOver = false;
    }

    setGameOver() {
        this.gameOver = true;
    }

    isGameOver() {
        return this.gameOver;
    }

    setTopscore() {
        if (this.score > this.topscore) {
            this.topscore = this.score;
        }
    }

    getTopscore() {
        return this.topscore;
    }

    getSpeed() {

        switch (this.level) {
            case 0: return 700;
            case 1: return 600;
            case 2: return 500;
            case 3: return 400;
            case 4: return 350;
            case 5: return 300;
            case 6: return 250;
            case 7: return 200;
            case 8: return 150;
            case 9: return 100;
            default: return 100;
        }
    }

    addScore(sc) {
        this.score += sc;
    }

    addLines(line) {

        switch (line) {
            case 1:
                this.addScore(10);
                break;
            case 2:
                this.addScore(20);
                break;
            case 3:
                this.addScore(30);
                break;
            case 4:
                this.addScore(40);
                break;
            default:
                return;
        }

        this.lines += line;
        if (this.lines > 10) {
            this.addLevel();
        }
    }

    addLevel() {
        this.lines %= 10;
        if (this.level < this.MAXLEVEL) {
            this.level++;
        }
    }

    getLevel() {
        return this.level;
    }

    getLines() {
        return this.lines;
    }

    getScore() {
        return this.score;
    }
}
