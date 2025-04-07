import { Tablero } from '../../models/tablero.js';
import { downloadJSON } from '../../utils/downloadUtils.js';
import Helper from "../../utils/helper.js";

const selectElement = document.getElementById("selectSize");
let selectedValue = 10; // Valor predeterminado
let currentBoardP1, currentBoardP2;

// Variables para la colocación de barcos
const barcos = [5, 4, 3, 3, 2, 2];
let barcoActual = 0;
let horizontal = true;

// Inicializar con el valor por defecto al cargar la página
const boardDefault = new Tablero(selectedValue);
({ boardP1: currentBoardP1, boardP2: currentBoardP2 } = boardDefault.createBoard());
// Colocar barcos en el tablero enemigo automáticamente
colocarBarcosAleatoriamente(currentBoardP2, boardDefault);
boardDefault.renderBoard(currentBoardP1, "board-p1", 0);

const buttonDownload = document.getElementById("downloadBtn");
buttonDownload.addEventListener("click", function() {
    downloadJSON(currentBoardP1, "boardP1.json");
    downloadJSON(currentBoardP2, "boardP2.json");
});

selectElement.addEventListener("change", function() {

    if (barcoActual > 0) {
        alert("No puedes cambiar el tamaño una vez iniciado la colocación de barcos.");
        // Deselecciona o resetea el valor del select si lo deseas:
        this.value = selectedValue;
        return;
    }

    selectedValue = parseInt(this.value, 10);
    console.log("✅ Valor seleccionado:", selectedValue);
    const board = new Tablero(selectedValue);
    ({ boardP1: currentBoardP1, boardP2: currentBoardP2 } = board.createBoard());
    // Actualizamos boardDefault para usar el nuevo tamaño también
    boardDefault.size = selectedValue;
    boardDefault.renderBoard(currentBoardP1, "board-p1", 0);
});

// Función para colocar un barco en el tablero del usuario utilizando la lógica simplificada
function colocarBarcoUsuario(row, col) {
    if (barcoActual >= barcos.length) {
        console.log("🚢 Todos los barcos han sido colocados.");
        return;
    }
    const longitud = barcos[barcoActual];
    // Se usa el método simplificado de colocarBarco de Tablero
    const colocado = boardDefault.colocarBarco(currentBoardP1, row, col, longitud, horizontal);
    if (colocado) {
        console.log(`✅ Barco de ${longitud} colocado en (${row}, ${col})`);
        boardDefault.renderBoard(currentBoardP1, "board-p1", 0); // Actualizamos la visualización
        barcoActual++;
        if (barcoActual >= barcos.length) {
            console.log("🎯 ¡Todos los barcos colocados! Ahora puedes iniciar el juego.");
        }
    } else {
        console.log("❌ No puedes colocar un barco aquí.");
    }
}

// Método para colocar barcos automáticamente en un tablero dado
function colocarBarcosAleatoriamente(board, tablero) {
    // Utilizamos los barcos definidos para colocarlos de forma aleatoria
    const barcos = [5, 4, 3, 3, 2, 2];
    barcos.forEach(longitud => {
        let colocado = false;
        while (!colocado) {
            const fila = Math.floor(Math.random() * tablero.size);
            const columna = Math.floor(Math.random() * tablero.size);
            const horizontal = Math.random() < 0.5;
            colocado = tablero.colocarBarco(board, fila, columna, longitud, horizontal);
        }
    });
}

// Capturar clics en el tablero del usuario (colocación de barcos)
const boardP1Elem = document.getElementById("board-p1");
boardP1Elem.addEventListener("click", (event) => {
    const elem = event.target.closest("[data-id]");
    if (!elem) return;
    const cellId = parseInt(elem.dataset.id, 10);
    const cell = currentBoardP1.find(c => c.id === cellId);
    if (!cell) return;
    const { row, col } = cell;
    colocarBarcoUsuario(row, col);
});

// Listener para cambiar orientación al presionar la tecla "R"
document.addEventListener("keydown", (event) => {
    if (event.key && event.key.toLowerCase() === "r") {
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
    // Verificar que se hayan colocado todos los barcos
    if (barcoActual < barcos.length) {
        alert("Por favor, coloca todos los barcos antes de iniciar el juego.");
        return;
    }
    const locationName = locationInput.value.trim();
    locationInput.value = ""; // Limpiar el campo de entrada
    console.log("✅ Nombre de la ubicación:", locationName);

    localStorage.setItem("boardP1", JSON.stringify(currentBoardP1));
    localStorage.setItem("boardP2", JSON.stringify(currentBoardP2));
    localStorage.setItem("locationName", locationName);
    localStorage.setItem("boardSize", selectedValue); // Guardar el tamaño del tablero

    Helper.loadView("game")
});
