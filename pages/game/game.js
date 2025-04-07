import { Tablero } from '../../models/tablero.js';
import { Jugador } from '../../models/jugador.js';
import Helper from '../../utils/helper.js';

class Juego {
    constructor(size) {
        this.size = size;
        // Instanciamos Tablero y creamos los arreglos planos para cada jugador
        this.tableroUsuario = new Tablero(size);
        this.tableroMaquina = new Tablero(size);
        this.boardUsuario = JSON.parse(localStorage.getItem("boardP1"));
        this.boardMaquina = JSON.parse(localStorage.getItem("boardP2"));

        this.jugador = new Jugador("Usuario");
        this.maquina = new Jugador("Máquina");
        this.turnoUsuario = true;
        this.isProcessingShot = false; // Inicializamos el flag
        this.aciertos = 0;
        this.fallos = 0;
        this.puntaje = 0;
        this.ultimaCasillaImpacto = null;

        // Barcos definidos y orientación inicial
        this.barcos = [5, 4, 3, 3, 2, 2];

        // Contadores de casillas con barcos restantes (cada tablero tiene 19 casillas)
        this.remainingUserShips = 19;
        this.remainingMachineShips = 19;
    }

    iniciar() {
        // Renderizamos los tableros iniciales usando la estructura JSON plana
        this.tableroUsuario.renderBoard(this.boardUsuario, "board-p1", 1);
        this.tableroMaquina.renderBoard(this.boardMaquina, "board-p2", 2);
        // Habilita la interacción en el tablero de la máquina si es el turno del usuario
        if (this.turnoUsuario) {
            this.toggleInteraccionTableroMaquina(true);
        } else {
            this.toggleInteraccionTableroMaquina(false);
        }
        this.agregarEventos();
    }

    agregarEventos() {
        const boardMaquinaElem = document.getElementById("board-p2");
        if (!boardMaquinaElem) {
            console.error("❌ No se encontró el tablero del enemigo en el DOM.");
            return;
        }
    
        boardMaquinaElem.addEventListener("click", (event) => {
            // Solo procesamos el click si es turno del usuario y no se está procesando un disparo
            if (!this.turnoUsuario || this.isProcessingShot) return;
            
            const elem = event.target.closest("[data-id]");
            if (!elem) return;
            const cellId = parseInt(elem.dataset.id, 10);
            const cell = this.boardMaquina.find(c => c.id === cellId);
            if (!cell) return;
            const { row, col } = cell;
            this.realizarDisparo(row, col);
        });
    }
    
    toggleInteraccionTableroMaquina(enabled) {
        const boardMaquinaElem = document.getElementById("board-p2");
        boardMaquinaElem.style.pointerEvents = enabled ? "auto" : "none";
    }
    
    realizarDisparo(fila, columna) {
        if (this.isProcessingShot) return;
        this.isProcessingShot = true;

        if (this.turnoUsuario) {
            this.toggleInteraccionTableroMaquina(false);
        }

        const resultado = this.turnoUsuario
            ? this.tableroMaquina.atacar(this.boardMaquina, fila, columna)
            : this.tableroUsuario.atacar(this.boardUsuario, fila, columna);

        if (resultado === "Ya atacado") {
            alert("¡Ya has disparado en esa casilla!");
            if (this.turnoUsuario) {
                this.toggleInteraccionTableroMaquina(true);
            }
            this.isProcessingShot = false;
            return;
        }

        console.log(`🔹 ${this.turnoUsuario ? "Usuario" : "Máquina"} disparó a (${fila}, ${columna}): ${resultado}`);

        // Actualizamos los tableros después del disparo
        this.tableroUsuario.renderBoard(this.boardUsuario, "board-p1", 0);
        this.tableroMaquina.renderBoard(this.boardMaquina, "board-p2", 1);

        let disparoFallido = false;

        // Si hay impacto, actualizamos el contador respectivo
        if (resultado === "💥 Impacto!") {
            if (this.turnoUsuario) {
                this.puntaje += 10;
                this.aciertos++;
                this.remainingMachineShips--;
                this.ultimaCasillaImpacto = { fila, columna };
            } else {
                // Disparo de la máquina: solo se disminuye el contador del usuario
                this.remainingUserShips--;
            }
        } else if (this.turnoUsuario && this.ultimaCasillaImpacto && this.esAdyacenteAImpactoAnterior(fila, columna)) {
            // Penalización por disparo adyacente
            this.puntaje -= 3;
            this.fallos++;
            this.ultimaCasillaImpacto = null;
            disparoFallido = true;
        } else if (this.turnoUsuario) {
            // Penalización por disparo fallido
            this.puntaje -= 1;
            this.fallos++;
            this.ultimaCasillaImpacto = null;
            disparoFallido = true;
        }

        // Verificamos si alguno de los jugadores se quedó sin barcos
        if (this.verificarFinDelJuego()) {
            this.finalizarPartida();
            return;
        }

        // Si el disparo fue "agua" o fallido (penalización), se cede el turno a la máquina
        if (resultado === "❌ Agua" || disparoFallido) {
            this.turnoUsuario = false;
            this.toggleInteraccionTableroMaquina(true);
            this.isProcessingShot = false;
            setTimeout(() => this.turnoMaquina(), 1000);
        } else {
            // Si hubo un impacto exitoso, el usuario no conserva el turno
            this.turnoUsuario = true;
            this.toggleInteraccionTableroMaquina(true);
            this.isProcessingShot = false;
        }

        console.log("Turno actual:", this.turnoUsuario ? "Usuario" : "Máquina");
        console.log("isProcessingShot:", this.isProcessingShot);
    }   
    
    esAdyacenteAImpactoAnterior(fila, columna) {
        if (!this.ultimaCasillaImpacto) return false;
        const deltaRow = Math.abs(fila - this.ultimaCasillaImpacto.fila);
        const deltaCol = Math.abs(columna - this.ultimaCasillaImpacto.columna);
        return deltaRow <= 1 && deltaCol <= 1;
    }

    turnoMaquina() {
        this.isProcessingShot = true;
        this.turnoUsuario = false;
        let fila, columna, cell;
        let intentos = 0;
        const maxIntentos = this.tableroUsuario.size ** 2;

        do {
            fila = Math.floor(Math.random() * this.tableroUsuario.size);
            columna = Math.floor(Math.random() * this.tableroUsuario.size);
            cell = this.boardUsuario.find(c => c.row === fila && c.col === columna);
            intentos++;
        } while (cell && (cell.status === "h" || cell.status === "mi") && intentos < maxIntentos);

        if (!cell || intentos >= maxIntentos) {
            console.warn("⚠️ La máquina no encontró una celda válida para disparar.");
            this.isProcessingShot = false;
            return;
        }

        this.realizarDisparo(fila, columna);
    }       

    verificarFinDelJuego() {
        // Fin del juego si alguno de los contadores llega a 0
        return this.remainingMachineShips === 0 || this.remainingUserShips === 0;
    }
    
    finalizarPartida() {
        let ganador = "";
        if (this.remainingMachineShips === 0) {
            ganador = "Usuario";
        } else if (this.remainingUserShips === 0) {
            ganador = "Máquina";
        }
        alert(`🎉 ¡Juego terminado!\n\nGanador: ${ganador}\n\n✅ Aciertos: ${this.aciertos}\n❌ Fallos: ${this.fallos}\n🎯 Puntaje total: ${this.puntaje}`);
    
        // Enviar al backend
        const datos = {
            nick_name: localStorage.getItem("nickname") || "anon",
            score: this.puntaje,
            country_code: localStorage.getItem("country_code") || "co",
        };
    
        fetch("http://127.0.0.1/score-recorder", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(datos)
        })
        .then(response => response.json())
        .then(data => {
            console.log("📤 Puntaje enviado al servidor:", data);
        })
        .catch(error => {
            console.error("❌ Error al enviar puntaje:", error);
        });
    }
    
}
    
const size = localStorage.getItem("boardSize") || 10; // Tamaño por defecto
const juego = new Juego(size);
juego.iniciar();