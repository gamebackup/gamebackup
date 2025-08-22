export class Hangman {
    constructor() {
        this.mistakes = 0;
        const _hangmanImgs = ['img/hangman0.png', 'img/hangman1.png', 'img/hangman2.png', 'img/hangman3.png', 'img/hangman4.png', 'img/hangman5.png', 'img/hangman6.png', 'img/hangman7.png', 'img/hangman8.png', 'img/hangman9.png', 'img/hangman10.png']
        this.maxMistakes = _hangmanImgs.length - 1;

        this.setHangman = (mistakes) => {
            const img = document.querySelector('#hangman img');
            img.src = _hangmanImgs[mistakes]
        }
    }
    getMistakes() {
        return this.mistakes;
    }
    addMistake() {
        if (this.mistakes === this.maxMistakes) return;
        this.mistakes++
    }
}

