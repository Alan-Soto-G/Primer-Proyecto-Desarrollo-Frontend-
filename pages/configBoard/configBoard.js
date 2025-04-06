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
    downloadJSON(boardP1, "boardP1.json");
    downloadJSON(boardP2, "boardP2.json");
});

selectElement.addEventListener("change", function() {
    selectedValue = parseInt(this.value, 10);
    console.log("✅ Valor seleccionado:", selectedValue);

    const board = new Tablero(selectedValue);
    ({ boardP1: currentBoardP1, boardP2: currentBoardP2 } = board.createBoard());
    board.renderBoard(currentBoardP1, "board-p1", 0);
});

