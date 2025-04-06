import { Tablero } from '../../models/tablero.js';
import { downloadJSON } from '../../utils/downloadUtils.js';

const selectElement = document.getElementById("selectSize");
let selectedValue = 10; // Valor predeterminado
let currentBoardP1, currentBoardP2;

// Inicializar con el valor por defecto al cargar la página
const boardDefault = new Tablero(selectedValue);
({ boardP1: currentBoardP1, boardP2: currentBoardP2 } = boardDefault.createBoard());
boardDefault.renderBoard(currentBoardP1, "board-p1", 0);

const buttonDownload = document.getElementById("downloadBtn");
buttonDownload.addEventListener("click", function() {
    downloadJSON(currentBoardP1, "boardP1.json");
    downloadJSON(currentBoardP2, "boardP2.json");
});

selectElement.addEventListener("change", function() {
    selectedValue = parseInt(this.value, 10);
    console.log("✅ Valor seleccionado:", selectedValue);

    const board = new Tablero(selectedValue);
    ({ boardP1: currentBoardP1, boardP2: currentBoardP2 } = board.createBoard());
    board.renderBoard(currentBoardP1, "board-p1", 0);
});

const locationInput = document.getElementById("Location-name");
const startGameBtn = document.getElementById("start-game");

startGameBtn.addEventListener("click", () => {
    if (!locationInput.value) {
        alert("❌ You must enter a location city.");
        return;
    }
    const locationName = locationInput.value.trim();
    locationInput.value = ""; // Limpiar el campo de entrada
    console.log("✅ Nombre de la ubicación:", locationName);

    localStorage.setItem("boardP1", JSON.stringify(currentBoardP1));
    localStorage.setItem("boardP2", JSON.stringify(currentBoardP2));
    localStorage.setItem("locationName", locationName);

    window.location.href = `../juego/juego.html?location=${encodeURIComponent(locationName)}`;
});
