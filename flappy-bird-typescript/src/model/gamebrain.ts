class GameScore {
    name: string;
    score: number;
    constructor(name: string, score: number) {
        this.name = name;
        this.score = score;
    }
}

const gameCellBackground = -1;
const gameCellPillar = 1;
const gameCellBird = 2;

export default class GameBrain {

    rowCount: number = 20;
    colCount: number = this.rowCount * 10;
    pillarWidth: number = Math.floor(this.colCount / 13);
    spaceBetween: number = Math.floor(this.colCount / 4);
    pathPositionRow: number = Math.floor(this.rowCount / 5);
    pathWidth: number = Math.floor(this.rowCount / 3);
    counter: number = 0; // for counting space between pillars and pillar widths.
    lastColWasPillar: boolean = false;
    birdRow: number = Math.floor(this.rowCount / 15 * 6);
    birdCol: number = Math.floor(this.colCount / 20);
    birdFallsCounter: number = this.colCount / 20;
    scoreCounter: number = this.spaceBetween;
    score: number = 0;
    justJumped: boolean = false;
    gameOver: boolean = false;
    currentPlayer: string = '';
    scoreBoard: GameScore[] = []
    board: number[][] = this.initializeBoard();

    constructor() {
        this.fillBoard();
    }

    initializeBoard(): number[][] {
        var board = [];
        for (let row = 0; row < this.rowCount; row++) {
            var rowArr = [];
            for (let col = 0; col < this.colCount; col++) {
                rowArr.push(gameCellBackground);
            }
            board.push(rowArr);
        }
        return board;
    }

    saveScore() {
        this.scoreBoard.push(new GameScore(this.currentPlayer, this.score));
        this.score = 0;
    }

    resetBoard() {
        this.counter = 0;
        this.birdRow = Math.floor(this.rowCount / 15 * 6);
        this.pathPositionRow = Math.floor(this.rowCount / 5);
        this.lastColWasPillar = false;
        this.birdFallsCounter = this.colCount / 20;
        this.justJumped = false;
        this.gameOver = false;
        this.scoreCounter = this.spaceBetween;
        this.score = 0;
        this.fillBoard();
    }

    fillBoard() {
        var pathStart = this.pathPositionRow;
        var pillarStarted = false;
        var pillarEnded = false;
        for (let col = 0; col < this.colCount; col++) {
            if (this.lastColWasPillar) pillarStarted = true;
            if (!this.lastColWasPillar && pillarStarted) {
                pillarEnded = true;
                pillarStarted = false;
            }
            this.fillCol(col, false, pathStart);
            if (pillarEnded) {
                pathStart = this.generateRandomPathStart();
                pillarEnded = false;
            }
        }
        this.placeBird();
    }

    fillCol(col: number, countScore = false, pathStart = this.pathPositionRow) {
        if (countScore) {
            if (this.scoreCounter == 0) {
                this.score++;
                this.scoreCounter = this.spaceBetween + this.pillarWidth;
            } else {
                this.scoreCounter--;
            }
        }
        for (let row = 0; row < this.rowCount; row++) {
            if (!this.lastColWasPillar) {
                this.board[row][col] = gameCellBackground;
            }
            else {
                if (row >= pathStart && row < pathStart + this.pathWidth) {
                    this.board[row][col] = gameCellBackground;
                } else {
                    this.board[row][col] = gameCellPillar;
                }
            }
        }
        this.pillarCheck();
    }

    placeBird(): boolean {
        if (this.birdFallsCounter == 0) {
            if (this.birdRow == this.rowCount - 1) return false;
            this.birdRow++;
            this.birdFallsCounter = this.colCount / 20;
        } else {
            this.birdFallsCounter--;
        }
        for (let i = 0; i < 5; i++) {
            if (this.board[this.birdRow][i + this.birdCol] == gameCellPillar) {
                return false
            }
            this.board[this.birdRow][i + this.birdCol] = gameCellBird;
        }
        return true
    }

    pillarCheck() {
        if (!this.lastColWasPillar) {
            if (this.counter != this.spaceBetween) {
                this.counter++;
            } else {
                this.lastColWasPillar = true;
                this.counter = 0;
            }
        } else {
            if (this.counter != this.pillarWidth) {
                this.counter++;
            } else {
                this.lastColWasPillar = false;
                this.generateRandomPathStart();
                this.counter = 0;
            }
        }
    }

    removePreviousBird() {
        for (let i = 0; i < 5; i++) {
            this.board.forEach(row => {
                if (row[this.birdCol + i - 1] == gameCellBird) {
                    row[this.birdCol + i - 1] = gameCellBackground;
                }
            });
        }
    }

    birdJumpOnClick() {
        if (this.birdRow == 0) return false;
        this.birdRow--;
        this.justJumped = true;
        this.birdFallsCounter = this.colCount / 20;
        return true;
    }

    generateRandomPathStart(): number {
        const changes = [2, 3, 4]
        var randomDirection = Math.round(Math.random())
        var pathChange = changes.splice(Math.floor(Math.random() * 3), 1)[0];

        if (randomDirection == 0.5 || pathChange + this.pathPositionRow + this.pathWidth >= this.rowCount - 1) {
            pathChange *= -1;
        }
        if (pathChange + this.pathPositionRow < 1) {
            pathChange *= -1;
        }

        this.pathPositionRow += pathChange;
        return this.pathPositionRow;
    }

    getGameBoard() { return this.board; }
    gameCellBackground() { return gameCellBackground; }
    gameCellPillar() { return gameCellPillar; }
    gameCellBird() { return gameCellBird; }
}