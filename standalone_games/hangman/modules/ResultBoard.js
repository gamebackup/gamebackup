export class ResultBoard {
    constructor() {
    }
    static addBoard(win, word) {
        const board = document.querySelector('#resultBoard');
        const text = document.querySelector('#resultBoard h2');
        const wait = () => {
            board.classList.add('active')
        }
        if (win) {
            text.textContent = "Congratulations! You won :)"
            setTimeout(wait, 100)
        } else {
            for (let i = 0; i < word.length; i ++) {
                const span = document.querySelector(`#word span:nth-of-type(${i + 1})`)
                if (span.textContent.includes('_')) {
                    span.textContent = `${word[i].toUpperCase()} `;
                    span.style.color = "red"
                }
                
            }
            text.textContent = "Sorry, you lost :("
            setTimeout(wait, 1500)
        }
        
        
    }
    static checkResult(thisGame){
        const img = document.querySelector('#hangman img');
        if (thisGame.hangman.mistakes === thisGame.hangman.maxMistakes) {
            return false;
        } else {
            return true;
        }
    }
}
