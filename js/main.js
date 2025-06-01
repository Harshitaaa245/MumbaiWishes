const puzzleGrid = document.getElementById("puzzleGrid");

for (let i = 1; i <= 20; i++) {
    const thumb = document.createElement("div");
    thumb.classList.add("puzzle-thumb");
    if (i > 1) thumb.classList.add("locked");

    const img = document.createElement("img");
    img.src = `img/${String(i).padStart(2, '0')}.jpg`;
    thumb.appendChild(img);

    if (i === 1) {
        thumb.addEventListener("click", () => {
            localStorage.setItem("currentPuzzle", i);
            window.location.href = "game.html";
        });
    }

    puzzleGrid.appendChild(thumb);
}

const TOTAL_PUZZLES = 20;
let currentLevel = 1;
let unlockedLevel = 1;

const messages = [
    "Level 1 complete! 🎉",
    "Level 2 done! 🎁",
    "You’re amazing! 🎈",
    "Wooo! Level 4 down!",
    "Akmal would be proud 💖",
    "So smart! 🎓",
    "Mastermind!",
    "Birthday genius!",
    "Look at you go!",
    "Halfway there! 🎉",
    "Puzzle pro!",
    "Unlocking joy!",
    "Almost there!",
    "You're unstoppable!",
    "Amazing progress!",
    "Last few levels!",
    "Champion!",
    "Nearly done!",
    "Penultimate stage!",
    "YOU DID IT 🎂🎉"
];

window.onload = () => {
    const gallery = document.getElementById("puzzleGallery");

    for (let i = 1; i <= TOTAL_PUZZLES; i++) {
        const img = document.createElement("img");
        img.src = `img/${String(i).padStart(2, '0')}.jpg`;
        img.className = "puzzle-thumbnail" + (i === 1 ? " unlocked" : "");
        img.onclick = () => {
            if (i <= unlockedLevel) loadPuzzle(i);
        };
        gallery.appendChild(img);
    }
};

function loadPuzzle(level) {
    currentLevel = level;
    document.getElementById("puzzleGallery").classList.add("hidden");
    document.getElementById("puzzleContainer").classList.remove("hidden");
    document.getElementById("levelTitle").textContent = `Puzzle ${level}`;

    const imgSrc = `images/${String(level).padStart(2, '0')}.jpg`;
    generatePieces(imgSrc);
}

function generatePieces(src) {
    const grid = document.getElementById("puzzleGrid");
    const piecesContainer = document.getElementById("piecesContainer");
    grid.innerHTML = "";
    piecesContainer.innerHTML = "";

    const img = new Image();
    img.src = src;
    img.onload = () => {
        const pieceSize = 100;

        const positions = [];
        for (let row = 0; row < 4; row++) {
            for (let col = 0; col < 4; col++) {
                positions.push({ row, col });
            }
        }

        positions.sort(() => Math.random() - 0.5); // shuffle

        positions.forEach((pos, index) => {
            const canvas = document.createElement("canvas");
            canvas.width = pieceSize;
            canvas.height = pieceSize;
            canvas.className = "piece";
            const ctx = canvas.getContext("2d");
            ctx.drawImage(
                img,
                pos.col * pieceSize,
                pos.row * pieceSize,
                pieceSize,
                pieceSize,
                0,
                0,
                pieceSize,
                pieceSize
            );

            canvas.draggable = true;
            canvas.dataset.index = index;
            canvas.addEventListener("dragstart", dragStart);
            piecesContainer.appendChild(canvas);

            // Create drop targets
            const dropSpot = document.createElement("div");
            dropSpot.className = "drop-spot";
            dropSpot.dataset.index = index;
            dropSpot.addEventListener("dragover", e => e.preventDefault());
            dropSpot.addEventListener("drop", handleDrop);
            grid.appendChild(dropSpot);
        });
    };
}

function dragStart(e) {
    e.dataTransfer.setData("text/plain", e.target.dataset.index);
    e.dataTransfer.setDragImage(e.target, 50, 50);
    e.dataTransfer.setData("pieceHTML", e.target.outerHTML);
}

function handleDrop(e) {
    e.preventDefault();
    const dropIndex = e.currentTarget.dataset.index;
    const draggedIndex = e.dataTransfer.getData("text/plain");

    if (dropIndex === draggedIndex) {
        e.currentTarget.innerHTML = e.dataTransfer.getData("pieceHTML");
        e.currentTarget.querySelector(".piece").draggable = false;
        checkWin();
    }
}

function checkWin() {
    const spots = document.querySelectorAll(".drop-spot");
    for (let spot of spots) {
        if (!spot.querySelector(".piece")) return;
    }

    showMessage(messages[currentLevel - 1]);
    unlockedLevel++;
    if (unlockedLevel <= TOTAL_PUZZLES) {
        document.querySelectorAll(".puzzle-thumbnail")[unlockedLevel - 1].classList.add("unlocked");
    }
}

function showMessage(text) {
    document.getElementById("messageText").textContent = text;
    document.getElementById("messageBox").classList.remove("hidden");
}

function closeMessage() {
    document.getElementById("messageBox").classList.add("hidden");
    document.getElementById("puzzleGallery").classList.remove("hidden");
    document.getElementById("puzzleContainer").classList.add("hidden");
}


