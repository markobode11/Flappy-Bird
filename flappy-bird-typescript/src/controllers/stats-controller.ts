import GameBrain from "../model/gamebrain";

export default class StatsController {

    model: GameBrain;
    viewContainer: HTMLDivElement;
    isRunning: boolean;

    constructor(model: GameBrain, viewContainer: HTMLDivElement) {
        this.model = model;
        this.viewContainer = viewContainer
        this.isRunning = false;
    }

    run() {
        this.createNameInput();
        this.drawScores();
        this.isRunning = true;
    }

    createNameInput() {
        var container = document.getElementById('view-container')
        var inputForm = document.createElement('div');
        inputForm.style.display = 'flex'
        inputForm.style.justifyContent = 'center'
        var nameLabel = document.createElement('label');
        nameLabel.htmlFor = 'name-input'
        nameLabel.textContent = 'Enter your name: '
        var nameInput = document.createElement('input');
        nameInput.id = "name-input";

        inputForm.append(nameInput)
        inputForm.prepend(nameLabel)
        container!.append(inputForm);
    }

    drawScores() {
        var container = document.getElementById('view-container')

        var div = document.createElement('div');
        div.style.display = 'flex'
        div.style.justifyContent = 'center'

        var table = document.createElement('table');
        table.className = 'styled-table';

        var thead = document.createElement('thead');
        var theadRow = document.createElement('tr');

        var th1 = document.createElement('th');
        var th2 = document.createElement('th');
        th1.innerText = 'Name'
        th2.innerText = 'Points'

        theadRow.append(th1, th2)
        thead.append(theadRow);
        table.append(thead)
        
        var tbody = document.createElement('tbody');

        this.model.scoreBoard.reverse().forEach(score => {
            var tr = document.createElement('tr');
            var tdname = document.createElement('td');
            var tdscore = document.createElement('td');

            tdname.innerText = score.name;
            tdscore.innerText = score.score.toString();
            tr.append(tdname, tdscore)
            tbody.append(tr);
        });

        table.append(tbody);

        div.append(table);

        container!.append(div)
    }

    stop() {
        this.isRunning = false;
    }

    resizeUi() {
        if (this.isRunning) {
            this.drawScores;
        }
    }
};