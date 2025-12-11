const gameContainer = document.querySelector(".game-container");
const menu = document.getElementById("level-menu");
const gameArea = document.getElementById("game");
const levelTitle = document.getElementById("level-title");
const unlockBtn = document.getElementById("unlock-sound");

// โหลดเสียง
const soundOpen = new Audio("sounds/open.mp3");
const soundMatch = new Audio("sounds/match.mp3");
const soundWrong = new Audio("sounds/wrong.mp3");

// ป้องกันเบราว์เซอร์บล็อกเสียง
let soundUnlocked = false;

unlockBtn.addEventListener("click", () => {
    soundOpen.play().then(() => {
        soundUnlocked = true;
        unlockBtn.style.display = "none";
    });
});

function requireSoundPermission() {
    if (!soundUnlocked) {
        unlockBtn.style.display = "block";
    }
}

let level = 1;
let firstCard, secondCard;
let lockBoard = false;
let matchedCount = 0;

function startGame(selectedLevel) {
    requireSoundPermission(); // ตรวจสอบสิทธิ์เสียง

    level = selectedLevel;

    menu.style.display = "none";
    gameArea.style.display = "block";
    levelTitle.textContent = `Level ${level}`;

    generateCards();
}

function generateCards() {
    gameContainer.innerHTML = "";
    [firstCard, secondCard] = [null, null];
    lockBoard = false;
    matchedCount = 0;

    const pairCount = level === 1 ? 4 : level === 2 ? 6 : 8;

    let icons = ["🐶","🐱","🐻","🐼","🐸","🦊","🐵","🐰"];
    icons = icons.slice(0, pairCount);
    icons = icons.concat(icons);
    icons = icons.sort(() => Math.random() - 0.5);

    icons.forEach(icon => {
        const card = document.createElement("div");
        card.classList.add("card");
        card.dataset.icon = icon;
        card.innerHTML = "";

        card.addEventListener("click", () => {
            if (lockBoard || card === firstCard) return;

            if (soundUnlocked) soundOpen.play(); // เล่นเสียงเปิดการ์ด

            card.classList.add("flipped");
            card.innerHTML = icon;

            if (!firstCard) {
                firstCard = card;
            } else {
                secondCard = card;
                checkMatch(pairCount);
            }
        });

        gameContainer.appendChild(card);
    });
}

function checkMatch(pairCount) {
    if (firstCard.dataset.icon === secondCard.dataset.icon) {
        if (soundUnlocked) soundMatch.play(); // เสียงจับคู่ถูกต้อง
        matchedCount++;
        resetTurn();

        if (matchedCount === pairCount) {
            setTimeout(nextLevel, 500);
        }
    } else {
        if (soundUnlocked) soundWrong.play(); // เสียงผิดคู่

        lockBoard = true;
        setTimeout(() => {
            firstCard.classList.remove("flipped");
            secondCard.classList.remove("flipped");
            firstCard.innerHTML = "";
            secondCard.innerHTML = "";
            resetTurn();
        }, 800);
    }
}

function resetTurn() {
    [firstCard, secondCard] = [null, null];
    lockBoard = false;
}

function nextLevel() {
    alert(`🎉 คุณผ่าน Level ${level}!`);

    if (level < 3) {
        startGame(level + 1);
    } else {
        alert("🏆 คุณผ่านทุกด่านแล้ว!");
        menu.style.display = "block";
        gameArea.style.display = "none";
    }
}