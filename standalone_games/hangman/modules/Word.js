export class Word {
    constructor() {
        
        this.countries = ['countries', 'colombia', 'indonesia', 'madagascar', 'netherlands', 'portugal', 'switzerland', 'thailand', 'venezuela', 'poland', 'germany', 'italy', 'greece', 'spain', 'russia', 'australia', 'argentina', 'egypt', 'morocco'];
        this.animals = ['animals', 'lion', 'tiger', 'elephant', 'panda', 'camel', 'horse', 'spider', 'fox', 'rabbit', 'kangaroo', 'turtle', 'hamster'];
        this.fruits = ['fruits', 'apple', 'banana', 'watermelon', 'pear', 'strawberry', 'raspberry', 'orange'];
        this.colours = ['colours', 'red', 'purple', 'pink', 'brown', 'yellow', 'white', 'black', 'green', 'blue'];
        
        this.categories = [this.countries, this.animals, this.fruits, this.colours];
        this.category;
        this.chosenWord;

    }
    drawWord() {
        const i = Math.floor(Math.random() * this.categories.length);
        const category = this.categories[i];
        const j = Math.floor(Math.random() * (category.length - 1) + 1);
        this.chosenWord = category[j]
        this.category = category[0];
    }
    showEmptyFields(word) {
        for (let i =0; i < this.chosenWord.length; i++) {
            const span = document.createElement('span');
            span.textContent = '_ ';
            word.appendChild(span);
        }
    }
    showCategory() {
        const span = document.querySelector('#category span');
        span.textContent = this.category.toUpperCase();
    }

    getWord() {
        return this.chosenWord
    }

    addLetter(letter, word) {
        for (let i = 0; i < word.length; i++) {
            if (word[i] === letter) {
                const span = document.querySelector(`#word span:nth-of-type(${i + 1})`)
                span.textContent = `${letter.toUpperCase()} `;
            }
        }
    }
}
