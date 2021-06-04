import mainView from './views/mainview';
import controlView from './views/controlview';
import gameView from './views/gameview';

import GameBrain from './model/gamebrain';
import GameController from './controllers/game-controller';
import StatsController from './controllers/stats-controller';

var brain = new GameBrain();
let game_view = gameView();
var gameController = new GameController(brain, game_view);
var statsController = new StatsController(brain, game_view);

let view = mainView();
document.body.append(view);
let ctrl_view = controlView(gameControlClick);

view.append(ctrl_view);
view.append(game_view);

async function gameControlClick(e: MouseEvent) {
    let game_v = gameView();
    switch ((e.target as HTMLButtonElement).id) {
        case 'game':
            if (gameController.isRunning) break;
            statsController.stop();
            gameController.model.currentPlayer = getPlayerName();
            document.getElementById('view-container')!.remove()

            view.append(game_v);
            gameController.viewContainer = game_v;
            //gameController.model.resetBoard();
            await gameController.run();
            break;
        case 'stats':
            gameController.model.resetBoard();
            gameController.stop();
            document.getElementById('view-container')!.remove()
            view.append(game_v);
            statsController.viewContainer = game_v;
            statsController.run();
            break;
        default:
            break;
    }
}

statsController.run();

window.addEventListener('resize', () => {
    gameController.resizeUi();
    statsController.resizeUi();
});

function getPlayerName() {
    var name = (document.getElementById('name-input')! as HTMLInputElement).value;
    if (name) {
        return name
    }
    return "anonymous";
}