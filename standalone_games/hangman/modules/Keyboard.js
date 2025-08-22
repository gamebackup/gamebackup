export class Keyboard {
    constructor() {
        const _keys = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'];
        this.clicked 
        this.keysClicked = [];
        
        this.createKeyboard = (keys) => {
            for (let i = 0; i < _keys.length; i++) {
                const span = document.createElement('span');
                span.textContent = _keys[i];
                span.classList.add('letter')
                keys.appendChild(span);
            }
        }    
    }
    getKey(e) {
        if (e.target.className === "letter") {
            const clickedKey = e.target;
            clickedKey.classList.add('clicked');
            this.clicked = clickedKey.textContent;
        }
        if (e.keyCode >=65 && e.keyCode < 91) {
            const keyCodes = [65,66,67,68,69,70,71,72,73,74,75,76,77,78,79,80,81,82,83,84,85,86,87,88,89,90];
            const letters = [...document.querySelectorAll('#keyboard span')]
            const i = keyCodes.indexOf(e.keyCode);
            const clickedKey = letters[i];
            clickedKey.classList.add('clicked');
            this.clicked = clickedKey.textContent;
        }
    }

    checkIfClicked(letter) {
        if (this.keysClicked.includes(letter)) {
            return true
        }
        else {
            this.keysClicked.push(this.clicked);
            return false
        };
    }       


    returnKey() {
        return this.clicked
    }
}


