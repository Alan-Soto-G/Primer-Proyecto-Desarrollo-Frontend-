import { Tablero } from '../../models/tablero.js';

const boardP1 = JSON.parse(localStorage.getItem("boardP1Loaded"));
const boardP2 = JSON.parse(localStorage.getItem("boardP2Loaded"));
const player = document.getElementById("player");

player.appendChild(document.createTextNode(localStorage.getItem("nick_name")));

console.log("boardP1:", boardP1);
console.log("boardP2:", boardP2);

if (boardP1 && Array.isArray(boardP1)) {
    const size = Math.sqrt(boardP1.length);
    const tablero = new Tablero(size);
    // Se renderizan en los contenedores con id "P1" y "P2"
    tablero.renderBoard(boardP1, "P1", 1);
    tablero.renderBoard(boardP2, "P2", 1);
} else {
    console.error("No se encontró boardP1Loaded o el formato no es correcto.");
}
