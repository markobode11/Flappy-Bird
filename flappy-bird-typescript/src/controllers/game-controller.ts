import GameBrain from "../model/gamebrain";

export default class GameController {

    model: GameBrain;
    viewContainer: HTMLDivElement;
    isRunning: boolean;

    constructor(model: GameBrain, viewContainer: HTMLDivElement) {
        this.model = model;
        this.viewContainer = viewContainer;
        this.isRunning = false;
    }

    async run() {
        this.viewContainer.append(this.getBoardHtml(this.model));

        var scoreDiv = document.createElement('div');
        scoreDiv.id = 'score-div'
        scoreDiv.style.textAlign = 'center'

        var div = document.createElement('div');
        div.style.margin = '0.3rem';
        div.id = 'score-container'

        div.append(scoreDiv);
        this.viewContainer.append(div);

        this.isRunning = true;

        await this.countDown(scoreDiv)

        document.body.onkeypress = () => {
            var jumpLegal = this.model.birdJumpOnClick();
            if (!jumpLegal) return
        }

        var id = setInterval(() => {
            this.animate();
            if (this.model.gameOver == true) {
                clearInterval(id);
                this.model.saveScore();
                document.body.onkeypress = null;
            }
        }, 10);
    }

    stop() {
        this.isRunning = false;
    }

    resizeUi() {
        if (this.isRunning) {
            this.replaceBoard();
        }
    }

    animate() {
        if (!this.isRunning) {
            this.model.gameOver = true;
            return
        }

        this.model.board.forEach(rowData => {
            rowData.splice(0, 1);
            rowData.push(0);
        });

        this.model.fillCol(this.model.colCount - 1, true)
        this.model.removePreviousBird();

        var birdPlaced = this.model.placeBird();
        if (!birdPlaced) {
            this.model.gameOver = true;
        }

        this.replaceBoard();
        this.refreshScoreInfo();
    }

    async countDown(scoreDiv: HTMLDivElement) {
        scoreDiv.innerText = '3'

        const delay = (ms: number) => new Promise(res => setTimeout(res, ms));
        await delay(1000);

        scoreDiv.innerText = '2'

        await delay(1000);

        scoreDiv.innerText = '1'

        await delay(1000);
    }

    replaceBoard() {
        var container = document.getElementById('view-container')
        container!.firstChild!.remove()
        container!.prepend(this.getBoardHtml(this.model))
    }

    refreshScoreInfo() {
        var scoreDiv = document.getElementById('score-div')
        scoreDiv!.innerText = 'Player: ' + this.model.currentPlayer + ' | ' + 'Score: ' + this.model.score;
        scoreDiv!.style.textAlign = 'center';

        if (this.model.gameOver) {
            var scoreContainer = document.getElementById('score-container')
            var div = document.createElement('div');
            div.style.textAlign = 'center';
            div.style.color = 'red'
            div.innerText = 'GAME OVER'
            div.style.marginTop = '0.3rem'

            scoreContainer!.append(div)
        }
    }

    getBoardHtml(gameBrain: GameBrain) {
        let content = document.createElement('div');
        content.id = "gameboard";

        let rowHeight = window.innerHeight / gameBrain.rowCount - 6;
        let rowWidth = window.innerWidth;
        let colWidth = rowWidth / gameBrain.colCount;

        gameBrain.getGameBoard().forEach(rowData => {
            let rowElem = document.createElement('div');
            rowElem.style.minHeight = rowHeight + 'px';
            rowElem.style.maxHeight = rowHeight + 'px';
            rowElem.style.width = rowWidth + 'px';

            var counter = 0;
            rowData.forEach(colData => {
                let colElem = document.createElement('div');
                colElem.className = 'col-' + counter;
                if (colData === gameBrain.gameCellBackground()) {
                    colElem.style.backgroundColor = '#011f4b';
                } else if (colData === gameBrain.gameCellPillar()) {
                    colElem.style.backgroundColor = '#005b96';
                } else if (colData === gameBrain.gameCellBird()) {
                    colElem.style.backgroundColor = '#b3cde0';
                }

                if (counter == rowData.length - 1) {
                    colElem.style.minWidth = colWidth + 'px';
                } else {
                    colElem.style.minWidth = colWidth + 'px';
                }
                colElem.style.display = 'inline-block';
                colElem.style.minHeight = rowHeight + 'px';
                rowElem.append(colElem);

                counter++;
            });
            content.append(rowElem);
        });

        return content;
    }
}