import {Keyboard} from "./modules/Keyboard.js";
import {Hangman} from "./modules/Hangman.js";
import {Word} from "./modules/Word.js";
import {ResultBoard} from "./modules/ResultBoard.js";

class Game {
    constructor() {
        this.keyboardDiv = document.querySelector("#keyboard");
        this.wordDiv = document.querySelector("#word");

        this.keyboard = new Keyboard();
        this.keyboard.createKeyboard(this.keyboardDiv);

        this.word = new Word();
        this.word.drawWord();
        this.word.showEmptyFields(this.wordDiv);
        this.word.showCategory();

        this.hangman = new Hangman();  
        
        // this.keyboardDiv.addEventListener('click', this.keyboard.getKey);
        this.keyboardDiv.addEventListener('click', this.startGame.bind(this))
        document.addEventListener('keydown', this.startGame.bind(this))
    }

    startGame(e) {
        // console.log(e.target.classList)
        if (e.keyCode < 65 || e.keyCode > 90  || e.target.classList.contains('clicked') || !e.target.classList.contains('letter')  && e.keyCode === undefined) return;
        const word = this.word.getWord();
        const result = this.checkWin(word);

        if (this.hangman.mistakes >= this.hangman.maxMistakes || result) return;
        
        this.keyboard.getKey(e);
        const letter = this.keyboard.returnKey();
        
        if (this.keyboard.checkIfClicked(letter)) return;

        this.getResult(letter, word);
        if (this.checkWin(word)) {
            const win = ResultBoard.checkResult(this);
            ResultBoard.addBoard(win, word);
        }
        
        
    }

    getResult(letter, word) {
        if (word.includes(letter)) {
            this.word.addLetter(letter, word);
        } else {
            this.hangman.addMistake();
            const mistakes = this.hangman.getMistakes();
            this.hangman.setHangman(mistakes)
        }
    }

    checkWin(word) {
        const spans = document.querySelectorAll('#word span')
        const img = document.querySelector('#hangman img');
        let check = [];
        spans.forEach(span => {
            if (span.textContent !== "_ ") {
                check.push(true) 
            }
        })
        if (check.length === word.length || this.hangman.mistakes === this.hangman.maxMistakes) {
            return true;
    }
}
}

const game = new Game()

