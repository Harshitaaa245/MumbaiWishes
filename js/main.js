const puzzleGrid = document.getElementById("puzzleGrid");

for (let i = 1; i <= 20; i++) {
    const thumb = document.createElement("div");
    thumb.classList.add("puzzle-thumb");
    if (i > 1) thumb.classList.add("locked");

    const img = document.createElement("img");
    img.src = `images/${String(i).padStart(2, '0')}.jpg`;
    thumb.appendChild(img);

    if (i === 1) {
        thumb.addEventListener("click", () => {
            localStorage.setItem("currentPuzzle", i);
            window.location.href = "game.html";
        });
    }

    puzzleGrid.appendChild(thumb);
}

