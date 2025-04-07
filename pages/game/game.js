import { Tablero } from '../../models/tablero.js';
import { Jugador } from '../../models/jugador.js';
import Helper from '../../utils/helper.js';

class Juego {
    constructor(size) {
        this.size = size;
        // Instanciamos Tablero y creamos los arreglos planos para cada jugador
        this.tableroUsuario = new Tablero(size);
        this.tableroMaquina = new Tablero(size);
        const { boardP1, boardP2 } = this.tableroUsuario.createBoard();
        this.boardUsuario = boardP1;
        this.boardMaquina = boardP2;

        this.jugador = new Jugador("Usuario");
        this.maquina = new Jugador("Máquina");
        this.turnoUsuario = true;
        // Barcos definidos y orientación inicial
        this.barcos = [5, 4, 3, 3, 2, 2];
        
        // Colocamos automáticamente los barcos en ambos tableros
        this.colocarBarcosAleatoriamente(this.boardUsuario, this.tableroUsuario);
        this.colocarBarcosAleatoriamente(this.boardMaquina, this.tableroMaquina);
    }

    iniciar() {
        // Renderizamos los tableros iniciales usando la estructura JSON plana
        this.tableroUsuario.renderBoard(this.boardUsuario, "board-p1", 1);
        this.tableroMaquina.renderBoard(this.boardMaquina, "board-p2", 2);
        this.agregarEventos();
    }

    agregarEventos() {
        const boardMaquinaElem = document.getElementById("board-p2");

        if (!boardMaquinaElem) {
            console.error("❌ No se encontró el tablero del enemigo en el DOM.");
            return;
        }

        // Listener para disparos al tablero enemigo
        boardMaquinaElem.addEventListener("click", (event) => {
            const elem = event.target.closest("[data-id]");
            if (!elem) return;
            const cellId = parseInt(elem.dataset.id, 10);
            const cell = this.boardMaquina.find(c => c.id === cellId);
            if (!cell) return;
            const { row, col } = cell;
            this.realizarDisparo(row, col);
        });
    }

    // Método para colocar barcos automáticamente en un tablero dado
    colocarBarcosAleatoriamente(board, tablero) {
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

    realizarDisparo(fila, columna) {
        const tableroObjetivo = this.turnoUsuario ? this.tableroMaquina : this.tableroUsuario;
        const resultado = tableroObjetivo.atacar(fila, columna);
    
        if (this.turnoUsuario) {
            if (resultado === "💥") {
                this.puntaje += 10;
                this.aciertos++;
            } else if (this.disparoFueAdyacente(tableroObjetivo, fila, columna)) {
                this.puntaje -= 3;
                this.fallos++;
            } else {
                this.puntaje -= 1;
                this.fallos++;
            }
        }
    
        console.log(`🔹 ${this.turnoUsuario ? "Usuario" : "Máquina"} disparó a (${fila}, ${columna}): ${resultado}`);
        this.mostrarTableros();
        this.turnoUsuario = !this.turnoUsuario;
    
        if (!this.turnoUsuario) {
            setTimeout(() => this.turnoMaquina(), 1000);
        }
    
        if (this.verificarFinDelJuego()) {
            this.finalizarPartida();
        }
    }
    
    disparoFueAdyacente(tablero, fila, columna) {
        const dirs = [-1, 0, 1];
        for (let dx of dirs) {
            for (let dy of dirs) {
                if (dx === 0 && dy === 0) continue;
                const nf = fila + dx;
                const nc = columna + dy;
    
                if (
                    nf >= 0 && nf < tablero.filas &&
                    nc >= 0 && nc < tablero.columnas
                ) {
                    const celda = tablero.matriz[nf][nc];
                    if (celda && celda.status === "ship") {
                        return true;
                    }
                }
            }
        }
        return false;
    }
    
    verificarFinDelJuego() {
        const barcosRestantes = this.tableroMaquina.matriz.flat().some(
            celda => celda.status === "ship"
        );
        return !barcosRestantes;
    }    

    turnoMaquina() {
        let fila, columna, cell;
        do {
            fila = Math.floor(Math.random() * this.tableroUsuario.size);
            columna = Math.floor(Math.random() * this.tableroUsuario.size);
            cell = this.boardUsuario.find(cel => cel.row === fila && cel.col === columna);
        } while(cell && (cell.status === "h" || cell.status === "m"));
        this.realizarDisparo(fila, columna);
    }
}


    const size = localStorage.getItem("boardSize") || 10; // Tamaño por defecto
    const juego = new Juego(size);
    juego.iniciar();
    