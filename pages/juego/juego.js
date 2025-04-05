import { Tablero } from '../../models/Tablero.js';
import { Jugador } from '../../models/Jugador.js';

let juego;

export function init() {
    console.log("✅ Página de juego cargada.");
    juego = new Juego();
    juego.iniciar();
}

class Juego {
    constructor() {
        this.tableroUsuario = new Tablero();
        this.tableroMaquina = new Tablero();
        this.jugador = new Jugador("Usuario");
        this.maquina = new Jugador("Máquina");
        this.turnoUsuario = true;
    }

    iniciar() {
        console.log("🎮 ¡El juego ha comenzado!");
        this.barcoActual = 0;
        this.barcos = [5, 4, 3, 3, 2, 2];
        this.horizontal = true;

        this.mostrarTableros();
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
            this.barcoActual++;

            if (this.barcoActual >= this.barcos.length) {
                console.log("🎯 ¡Todos los barcos colocados! Inicia el juego.");
                this.colocarBarcosAleatoriamente(this.tableroMaquina);
                this.mostrarTableros();
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
                const fila = Math.floor(Math.random() * 10);
                const columna = Math.floor(Math.random() * 10);
                const horizontal = Math.random() < 0.5;
                colocado = tablero.colocarBarco(fila, columna, longitud, horizontal);
            }
        });
    }

    realizarDisparo(fila, columna) {
        const tableroObjetivo = this.turnoUsuario ? this.tableroMaquina : this.tableroUsuario;
        const resultado = tableroObjetivo.atacar(fila, columna);
        console.log(`🔹 ${this.turnoUsuario ? "Usuario" : "Máquina"} disparó a (${fila}, ${columna}): ${resultado}`);
        this.mostrarTableros();
        this.turnoUsuario = !this.turnoUsuario;

        if (!this.turnoUsuario) {
            setTimeout(() => this.turnoMaquina(), 1000);
        }
    }

    turnoMaquina() {
        let fila, columna;
        do {
            fila = Math.floor(Math.random() * 10);
            columna = Math.floor(Math.random() * 10);
        } while (['💥', '❌'].includes(this.tableroUsuario.matriz[fila][columna]));

        this.realizarDisparo(fila, columna);
    }

    mostrarTableros() {
        console.log("🧊 Tablero del Usuario:");
        this.tableroUsuario.imprimir();
        console.log("🤖 Tablero de la Máquina:");
        this.tableroMaquina.imprimir();
    }
}
