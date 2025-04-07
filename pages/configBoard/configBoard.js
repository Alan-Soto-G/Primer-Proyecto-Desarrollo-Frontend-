import { Tablero } from '../../models/tablero.js';
import { downloadJSON } from '../../utils/downloadUtils.js';
import Helper from "../../utils/helper.js";

export function init() {
    const selectElement = document.getElementById("selectSize");
    let selectedValue = 10; // Valor predeterminado
    let currentBoardP1, currentBoardP2;

    // Variables para la colocación de barcos
    const barcos = [5, 4, 3, 3, 2, 2];
    let barcoActual = 0;
    let horizontal = true;

    // Inicializar con el valor por defecto al cargar la página
    const boardDefault = new Tablero(selectedValue);
    ({ boardP1: currentBoardP1, boardP2: currentBoardP2 } = boardDefault.createBoard(selectedValue));
    boardDefault.renderBoard(currentBoardP1, "board-p1", 0);

    const buttonDownload = document.getElementById("downloadBtn");
    buttonDownload.addEventListener("click", function () {
        downloadJSON(currentBoardP1, "boardP1.json");
        downloadJSON(currentBoardP2, "boardP2.json");
    });

    selectElement.addEventListener("change", function () {
        if (barcoActual > 0) {
            alert("No puedes cambiar el tamaño una vez iniciada la colocación de barcos.");
            this.value = selectedValue;
            return;
        }

        selectedValue = parseInt(this.value, 10);
        console.log("✅ Valor seleccionado:", selectedValue);
        const board = new Tablero(selectedValue);
        ({ boardP1: currentBoardP1, boardP2: currentBoardP2 } = board.createBoard(selectedValue));
        boardDefault.size = selectedValue;

        // Solo renderizar tableros si existen en la vista
        boardDefault.renderBoard(currentBoardP1, "board-p1", 0);
        if (document.getElementById("user-board")) {
            boardDefault.renderBoard(currentBoardP1, "user-board", "p1");
        }
        if (document.getElementById("enemy-board")) {
            boardDefault.renderBoard(currentBoardP2, "enemy-board", "p2");
        }
    });

    function colocarBarcoUsuario(row, col) {
        if (barcoActual >= barcos.length) {
            console.log("🚢 Todos los barcos han sido colocados.");
            return;
        }
        const longitud = barcos[barcoActual];
        const colocado = boardDefault.colocarBarco(currentBoardP1, row, col, longitud, horizontal);
        if (colocado) {
            console.log(`✅ Barco de ${longitud} colocado en (${row}, ${col})`);
            boardDefault.renderBoard(currentBoardP1, "board-p1", 0);
            barcoActual++;
            if (barcoActual >= barcos.length) {
                console.log("🎯 ¡Todos los barcos colocados! Ahora puedes iniciar el juego.");
            }
        } else {
            console.log("❌ No puedes colocar un barco aquí.");
        }
    }

    const boardP1Elem = document.getElementById("board-p1");
    boardP1Elem.addEventListener("click", (event) => {
        const elem = event.target.closest("[data-fila]");
        if (!elem) return;
        const row = parseInt(elem.dataset.fila, 10);
        const col = parseInt(elem.dataset.columna, 10);
        if (isNaN(row) || isNaN(col)) return;
        colocarBarcoUsuario(row, col);
    });

    document.addEventListener("keydown", (event) => {
        if (event.key.toLowerCase() === "r") {
            horizontal = !horizontal;
            console.log(`↩️ Orientación cambiada a: ${horizontal ? "Horizontal" : "Vertical"}`);
        }
    });

    const locationInput = document.getElementById("Location-name");
    const startGameBtn = document.getElementById("start-game");

    startGameBtn.addEventListener("click", () => {
        if (!locationInput.value) {
            alert("❌ You must enter a location city.");
            return;
        }
        if (barcoActual < barcos.length) {
            alert("Por favor, coloca todos los barcos antes de iniciar el juego.");
            return;
        }

        const locationName = locationInput.value.trim();
        locationInput.value = "";
        console.log("✅ Nombre de la ubicación:", locationName);

        localStorage.setItem("boardP1", JSON.stringify(currentBoardP1));
        localStorage.setItem("boardP2", JSON.stringify(currentBoardP2));
        localStorage.setItem("locationName", locationName);
        localStorage.setItem("boardSize", selectedValue);

        Helper.loadView("game");
    });
}
