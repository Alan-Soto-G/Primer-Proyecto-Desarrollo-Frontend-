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

        // Barcos definidos y orientación inicial
        this.barcos = [5, 4, 3, 3, 2, 2];
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
        // Si ya se está procesando un disparo, ignoramos el nuevo click
        if (this.isProcessingShot) return;
        this.isProcessingShot = true;
        
        // Inmediatamente deshabilitar el tablero de la máquina al disparar el usuario
        if (this.turnoUsuario) {
            this.toggleInteraccionTableroMaquina(false);
        }
    
        // Selecciona el tablero objetivo en base al turno
        const resultado = this.turnoUsuario
            ? this.tableroMaquina.atacar(this.boardMaquina, fila, columna)
            : this.tableroUsuario.atacar(this.boardUsuario, fila, columna);
    
        // Si la celda ya fue atacada, notificamos y salimos sin cambiar turno
        if (resultado === "Ya atacado") {
            alert("¡Ya has disparado en esa casilla!");
            // Reactivar solo si es turno del usuario
            if (this.turnoUsuario) {
                this.toggleInteraccionTableroMaquina(true);
            }
            this.isProcessingShot = false;
            return;
        }
    
        console.log(`🔹 ${this.turnoUsuario ? "Usuario" : "Máquina"} disparó a (${fila}, ${columna}): ${resultado}`);
    
        // Actualizamos la visualización de ambos tableros
        this.tableroUsuario.renderBoard(this.boardUsuario, "board-p1", 0);
        this.tableroMaquina.renderBoard(this.boardMaquina, "board-p2", 1);
    
        // Si el disparo falla, se cambia de turno
        if (resultado === "❌ Agua") {
            this.turnoUsuario = !this.turnoUsuario;
        }
    
        // Al finalizar el proceso, habilitar o deshabilitar según el turno
        if (this.turnoUsuario) {
            this.toggleInteraccionTableroMaquina(true);
        } else {
            this.toggleInteraccionTableroMaquina(false);
        }
        this.isProcessingShot = false;
    
        // Si es turno de la máquina, la máquina dispara automáticamente
        if (!this.turnoUsuario) {
            setTimeout(() => this.turnoMaquina(), 1000);
        }
    }
    
    turnoMaquina() {
        let fila, columna, cell;
        do {
            fila = Math.floor(Math.random() * this.tableroUsuario.size);
            columna = Math.floor(Math.random() * this.tableroUsuario.size);
            cell = this.boardUsuario.find(cel => cel.row === fila && cel.col === columna);
        } while (cell && (cell.status === "h" || cell.status === "mi")); // Asegura que no se dispare a celdas ya atacadas
    
        this.realizarDisparo(fila, columna);
    }
}
    
const size = localStorage.getItem("boardSize") || 10; // Tamaño por defecto
const juego = new Juego(size);
juego.iniciar();
