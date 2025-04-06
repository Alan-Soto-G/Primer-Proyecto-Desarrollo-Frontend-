import { Tablero } from '../../models/tablero.js';
import { Jugador } from '../../models/jugador.js';

export class Juego {
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
        this.barcoActual = 0;
        this.horizontal = true;
    }

    iniciar() {
        // Renderizamos los tableros iniciales usando la estructura JSON plana
        this.tableroUsuario.renderBoard(this.boardUsuario, "board-p1", 0);
        this.tableroMaquina.renderBoard(this.boardMaquina, "board-m1", 1);
        this.agregarEventos();
    }

    agregarEventos() {
        const boardUsuarioElem = document.getElementById("board-p1");
        const boardMaquinaElem = document.getElementById("board-m1");

        if (!boardUsuarioElem || !boardMaquinaElem) {
            console.error("❌ No se encontraron los tableros en el DOM.");
            return;
        }

        boardUsuarioElem.addEventListener("click", (event) => {
            // Se usa el atributo data-id para identificar la celda
            const elem = event.target.closest("[data-id]");
            if (!elem) return;
            const cellId = parseInt(elem.dataset.id, 10);
            // Buscar la celda en el arreglo plano
            const cell = this.boardUsuario.find(c => c.id === cellId);
            if (!cell) return;
            const { row, col } = cell;
            this.colocarBarcoUsuario(row, col);
        });

        boardMaquinaElem.addEventListener("click", (event) => {
            if (this.barcoActual < this.barcos.length) return; // Aún se están colocando barcos
            const elem = event.target.closest("[data-id]");
            if (!elem) return;
            const cellId = parseInt(elem.dataset.id, 10);
            const cell = this.boardMaquina.find(c => c.id === cellId);
            if (!cell) return;
            const { row, col } = cell;
            this.realizarDisparo(row, col);
        });

        document.addEventListener("keydown", (event) => {
            if (event.key === "r") {
                this.horizontal = !this.horizontal;
                console.log(`↩️ Orientación cambiada a: ${this.horizontal ? "Horizontal" : "Vertical"}`);
            }
        });
    }

    colocarBarcoUsuario(fila, columna) {
        if (this.barcoActual >= this.barcos.length) {
            console.log("🚢 Todos los barcos han sido colocados.");
            return;
        }
        const longitud = this.barcos[this.barcoActual];
        // Se actualiza el método para enviar el arreglo plano
        const colocado = this.tableroUsuario.colocarBarco(this.boardUsuario, fila, columna, longitud, this.horizontal);
        if (colocado) {
            console.log(`✅ Barco de ${longitud} colocado en (${fila}, ${columna})`);
            this.tableroUsuario.renderBoard(this.boardUsuario, "board-p1", 0); // Actualizar visual
            this.barcoActual++;
            if (this.barcoActual >= this.barcos.length) {
                console.log("🎯 ¡Todos los barcos colocados! Inicia el juego.");
                this.colocarBarcosAleatoriamente(this.boardMaquina, this.tableroMaquina);
                this.tableroMaquina.renderBoard(this.boardMaquina, "board-m1", 1);
            }
        } else {
            console.log("❌ No puedes colocar un barco aquí.");
        }
    }

    colocarBarcosAleatoriamente(board, tablero) {
        const barcos = [5, 4, 3, 3, 2, 2];
        barcos.forEach(longitud => {
            let colocado = false;
            while (!colocado) {
                // Generamos fila y columna en base a Tablero.size
                const fila = Math.floor(Math.random() * tablero.size);
                const columna = Math.floor(Math.random() * tablero.size);
                const horizontal = Math.random() < 0.5;
                colocado = tablero.colocarBarco(board, fila, columna, longitud, horizontal);
            }
        });
    }

    realizarDisparo(fila, columna) {
        // Selecciona el tablero objetivo en base al turno (se usa el arreglo plano)
        const tableroObjetivo = this.turnoUsuario ? this.tableroMaquina : this.boardUsuario;
        const resultado = this.turnoUsuario
            ? this.tableroMaquina.atacar(this.boardMaquina, fila, columna)
            : this.tableroUsuario.atacar(this.boardUsuario, fila, columna);
        console.log(`🔹 ${this.turnoUsuario ? "Usuario" : "Máquina"} disparó a (${fila}, ${columna}): ${resultado}`);

        // Se renderizan ambos tableros
        this.tableroUsuario.renderBoard(this.boardUsuario, "board-p1", 0);
        this.tableroMaquina.renderBoard(this.boardMaquina, "board-m1", 1);
        this.turnoUsuario = !this.turnoUsuario;

        if (!this.turnoUsuario) {
            setTimeout(() => this.turnoMaquina(), 1000);
        }
    }

    turnoMaquina() {
        let fila, columna;
        let cell;
        do {
            fila = Math.floor(Math.random() * this.tableroUsuario.size);
            columna = Math.floor(Math.random() * this.tableroUsuario.size);
            cell = this.boardUsuario.find(cel => cel.row === fila && cel.col === columna);
        } while(cell && (cell.status === "hit" || cell.status === "miss"));
        this.realizarDisparo(fila, columna);
    }
}

export function init() {
    console.log("✅ init() llamado desde juego.js");
    const boton = document.getElementById("start-game");
    if (!boton) {
        console.error("❌ No se encontró el botón #start-game");
        return;
    }
    boton.addEventListener("click", () => {
        console.log("🎮 Botón presionado");
        const input = document.getElementById("size-input");
        const size = parseInt(input.value, 10);
        if (isNaN(size) || size < 10 || size > 20) {
            alert("El tamaño debe estar entre 10 y 20");
            return;
        }
        const juego = new Juego(size);
        juego.iniciar();
    });
}