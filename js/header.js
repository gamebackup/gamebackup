// js/header.js (or header.js if in root)

document.addEventListener('DOMContentLoaded', function() {
    // Define your header HTML as a string using backticks (template literals)
    // This makes it easy to write multi-line HTML
    const headerHtml = `
        <header>
            <div style="display: flex; align-items: center;">
                <img src="./images/looks-inside-cat-meme.png" alt="Logo" style="height: 40px; margin-right: 10px;">
                <div style="margin: 0; color: white;">Unblocked Games x3e</div>
            </div>
            <div class="game-count">Live Game Count: 233</div>
            <nav>
                <a href="https://gamebackup.github.io/x3e/">Home</a>

                <div class="dropdown">
                    <a href="https://gamebackup.github.io/x3e/flash-games.html" class="dropbtn">Flash Games <span style="font-size: 0.8em;">&#9660;</span></a>
                    <div class="dropdown-content">
                        <a href="https://gamebackup.github.io/x3e/flash-emulator.html">Flash Emulator</a>
                        </div>
                </div>

                <a href="https://forms.gle/4qtsrTs18sW5equ9A">Game Request Form</a>
                <a href="https://forms.gle/TPk7ZofJveGqhbXs6">Block/Bug Report</a>
            </nav>
        </header>
    `;

    // Find the <body> element and insert the header at its beginning
    document.body.insertAdjacentHTML('afterbegin', headerHtml);
});
