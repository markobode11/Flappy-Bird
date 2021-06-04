export default function gameView() {
    var content = document.createElement('div');
    content.id = 'view-container';

    content.style.display = 'flex'
    content.style.flexDirection = 'column'
    content.style.justifyContent = 'center'
    return content;
}