export class Tablero {
    constructor(size) {
        this.size = size;
        this.filas = size;
        this.columnas = size;
    }    

    createBoard(size) {
        console.log("✅ Tablero inicializado.");
        const boardP1 = [];
        const boardP2 = [];
        let cellId = 1;

        for (let row = 0; row < size; row++) {
            const filaP1 = [];
            const filaP2 = [];
            for (let col = 0; col < size; col++) {
                const cellP1 = {
                    id: cellId,
                    row,
                    col,
                    status: "~",
                    visible: true,
                    ship: null,
                    player: "p1",
                };
                const cellP2 = {
                    ...JSON.parse(JSON.stringify(cellP1)),
                    visible: false,
                    player: "p2",
                };
                filaP1.push(cellP1);
                filaP2.push(cellP2);
                cellId++;
            }
            boardP1.push(filaP1);
            boardP2.push(filaP2);
        }
        return { boardP1, boardP2 };
    }

    colocarBarco(tablero, fila, columna, longitud, horizontal = true) {
        if (horizontal && columna + longitud > this.columnas) return false;
        if (!horizontal && fila + longitud > this.filas) return false;
    
        for (let i = 0; i < longitud; i++) {
            const f = fila + (horizontal ? 0 : i);
            const c = columna + (horizontal ? i : 0);
    
            if (tablero[f][c].status !== "~") return false;  // Ya ocupado
        }
    
        for (let i = 0; i < longitud; i++) {
            const f = fila + (horizontal ? 0 : i);
            const c = columna + (horizontal ? i : 0);
    
            tablero[f][c].status = "ship";
            tablero[f][c].ship = longitud;
        }
    
        return true;
    }    

    atacar(fila, columna) {
        const celda = this.matriz[fila][columna];

        if (celda.status === "hit" || celda.status === "miss") {
            return "Ya atacado";
        }

        if (celda.status === "ship") {
            celda.status = "hit";
            return "💥 Impacto!";
        } else {
            this.matriz[fila][columna] = {
                status: "miss",
                ship: null
            };
            return "❌ Agua";
        }
    }    
    
    renderBoard(board, containerId, playerOption) {
        const container = document.getElementById(containerId);
        if (!container) {
            console.error(`No se encontró el contenedor con id ${containerId}`);
            return;
        }

        container.innerHTML = "";
        container.style.display = "grid";
        container.style.gridTemplateColumns = `repeat(${this.columnas}, 30px)`;
        container.style.gridTemplateRows = `repeat(${this.filas}, 30px)`;

        for (let i = 0; i < this.filas; i++) {
            for (let j = 0; j < this.columnas; j++) {
                const cell = board[i][j];
                const div = document.createElement("div");
                div.classList.add("cell");
                div.dataset.fila = i;
                div.dataset.columna = j;

                let path = "./assets/shot/";
                let image = "water.png";

                if (cell.status === "ship") {
                    path = "./assets/ship/";
                    image = cell.visible ? `ship${cell.ship || 1}.png` : "water.png";
                } else if (cell.status === "hit") {
                    image = "explosion.png";
                } else if (cell.status === "miss") {
                    image = "missedShot.png";
                }

                div.style.backgroundImage = `url('${path}${image}')`;
                div.style.backgroundSize = "cover";

                container.appendChild(div);
            }
        }
    }
}