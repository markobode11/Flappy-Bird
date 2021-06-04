export default function mainView(eventHandler : (e: MouseEvent) => Promise<void>) {

    var control = document.createElement('div');
    control.style.display = 'flex'
    control.style.justifyContent = 'center'


    var statsButton = document.createElement('button');
    statsButton.id = "stats";
    statsButton.innerText = "View Scores";
    statsButton.style.marginBottom = '1rem'
    statsButton.style.marginRight = '1rem'
    statsButton.className = 'btn'

    var gameButton = document.createElement('button');
    gameButton.id = 'game';
    gameButton.innerText = "Start New Game";
    gameButton.style.marginBottom = '1rem'
    gameButton.className = 'btn'

    control.append(statsButton);
    control.append(gameButton);

    statsButton.addEventListener('click', eventHandler)
    gameButton.addEventListener('click', eventHandler)
    return control;
};