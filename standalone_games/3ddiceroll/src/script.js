document.addEventListener("DOMContentLoaded", function () {
    const rollButton = document.getElementById("rollButton");
    const dice = document.getElementById("dice");

    rollButton.addEventListener("click", function () {
        rollButton.classList.add("rolling");

        const result = Math.floor(Math.random() * 6) + 1;

        const randomX = Math.floor(Math.random() * 720) + 360;
        const randomY = Math.floor(Math.random() * 720) + 360;

        dice.style.transition = "transform 1.5s cubic-bezier(0.68, -0.55, 0.27, 1.55)";
        dice.style.transform = `rotateX(${randomX}deg) rotateY(${randomY}deg)`;


        setTimeout(() => {
            let finalX = 0, finalY = 0;

            switch (result) {
                case 1: finalX = 0; finalY = 0; break;
                case 2: finalX = 0; finalY = 180; break;
                case 3: finalX = 0; finalY = -90; break;
                case 4: finalX = 0; finalY = 90; break;
                case 5: finalX = 90; finalY = 0; break;
                case 6: finalX = -90; finalY = 0; break;
            }

            dice.style.transition = "transform 0.5s ease-out";
            dice.style.transform = `rotateX(${finalX}deg) rotateY(${finalY}deg)`;

            const toast = document.createElement("div");
            toast.classList.add("toast");
            toast.textContent = `You got ${result}!`;
            document.body.appendChild(toast);

            setTimeout(() => {
                rollButton.classList.remove("rolling");
            }, 700);

            setTimeout(() => {
                toast.remove();
            }, 3000);

        }, 1500);
    });

    document.addEventListener("keydown", function (event) {
        if (event.key === " " && !rollButton.classList.contains("rolling")) {
            event.preventDefault();
            rollButton.click();
        }
    });
});