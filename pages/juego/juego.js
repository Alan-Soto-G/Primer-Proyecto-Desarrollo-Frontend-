import { Tablero } from '../../models/Tablero.js';
import { Jugador } from '../../models/Jugador.js';

export class Juego {
    constructor(filas, columnas) {
        this.tableroUsuario = new Tablero(filas, columnas);
        this.tableroMaquina = new Tablero(filas, columnas);
        this.jugador = new Jugador("Usuario");
        this.maquina = new Jugador("Máquina");
        this.turnoUsuario = true;
    }

    iniciar() {
        this.barcos = [5, 4, 3, 3, 2, 2];
        this.barcoActual = 0;
        this.horizontal = true;

        // Renderizamos directamente los tableros usando su matriz
        this.tableroUsuario.renderBoard("board-p1", 0);
        this.tableroMaquina.renderBoard("board-m1", 1);

        this.agregarEventos();
    }

    agregarEventos() {
        const boardUsuario = document.getElementById("board-p1");
        const boardMaquina = document.getElementById("board-m1");

        if (!boardUsuario || !boardMaquina) {
            console.error("❌ No se encontraron los tableros en el DOM.");
            return;
        }

        boardUsuario.addEventListener("click", (event) => {
            const celda = event.target;
            if (!celda.classList.contains("cell")) return;

            const fila = parseInt(celda.dataset.fila);
            const columna = parseInt(celda.dataset.columna);

            this.colocarBarcoUsuario(fila, columna);
        });

        boardMaquina.addEventListener("click", (event) => {
            if (this.barcoActual < this.barcos.length) return;

            const celda = event.target;
            if (!celda.classList.contains("cell")) return;

            const fila = parseInt(celda.dataset.fila);
            const columna = parseInt(celda.dataset.columna);

            this.realizarDisparo(fila, columna);
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
        const colocado = this.tableroUsuario.colocarBarco(fila, columna, longitud, this.horizontal);

        if (colocado) {
            console.log(`✅ Barco de ${longitud} colocado en (${fila}, ${columna})`);
            this.tableroUsuario.renderBoard("board-p1", 0); // 🔄 Actualizamos visual
            this.barcoActual++;

            if (this.barcoActual >= this.barcos.length) {
                console.log("🎯 ¡Todos los barcos colocados! Inicia el juego.");
                this.colocarBarcosAleatoriamente(this.tableroMaquina);
                this.tableroMaquina.renderBoard("board-m1", 1);
            }
        } else {
            console.log("❌ No puedes colocar un barco aquí.");
        }
    }

    colocarBarcosAleatoriamente(tablero) {
        const barcos = [5, 4, 3, 3, 2, 2];
        barcos.forEach(longitud => {
            let colocado = false;
            while (!colocado) {
                const fila = Math.floor(Math.random() * tablero.filas);
                const columna = Math.floor(Math.random() * tablero.columnas);
                const horizontal = Math.random() < 0.5;
                colocado = tablero.colocarBarco(fila, columna, longitud, horizontal);
            }
        });
    }

    realizarDisparo(fila, columna) {
        const tableroObjetivo = this.turnoUsuario ? this.tableroMaquina : this.tableroUsuario;
        const resultado = tableroObjetivo.atacar(fila, columna);
        console.log(`🔹 ${this.turnoUsuario ? "Usuario" : "Máquina"} disparó a (${fila}, ${columna}): ${resultado}`);

        this.tableroUsuario.renderBoard("board-p1", 0);
        this.tableroMaquina.renderBoard("board-m1", 1);

        this.turnoUsuario = !this.turnoUsuario;

        if (!this.turnoUsuario) {
            setTimeout(() => this.turnoMaquina(), 1000);
        }
    }

    turnoMaquina() {
        let fila, columna;
        do {
            fila = Math.floor(Math.random() * this.tableroUsuario.filas);
            columna = Math.floor(Math.random() * this.tableroUsuario.columnas);
        } while (['💥', '❌'].includes(this.tableroUsuario.matriz[fila][columna]));

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

        const juego = new Juego(size, size);
        juego.iniciar();
    });
}
