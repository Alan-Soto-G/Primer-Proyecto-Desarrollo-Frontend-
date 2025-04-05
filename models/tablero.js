export class Tablero {
    constructor(filas = 10, columnas = 10) {
        this.filas = filas;
        this.columnas = columnas;
        this.matriz = Array.from({ length: filas }, () =>
            Array.from({ length: columnas }, () => "~")
        );
    }

    createBoard(size) {
        const boardP1 = [];
        const boardM1 = [];
        let cellId = 1;
    
        for (let row = 0; row < size; row++) {
            const rowP1 = [];
            const rowM1 = [];
    
            for (let col = 0; col < size; col++) {
                // Probabilidad de colocar un barco (ajusta el % según prefieras)
                const hasShip = false; // No colocar barcos aún
    
                const cellP1 = {
                    id: cellId,
                    status: hasShip ? "ship" : "~",
                    visible: true,
                    ship: null, // No asignar ningún barco
                    player: "p1",
                };
    
                const cellM1 = {
                    ...JSON.parse(JSON.stringify(cellP1)),
                    player: "p2",
                    visible: false, // Oculto para el enemigo
                };
    
                rowP1.push(cellP1);
                rowM1.push(cellM1);
                cellId++;
            }
    
            boardP1.push(rowP1);
            boardM1.push(rowM1);
        }
    
        return { boardP1, boardM1 };
    }

    colocarBarco(fila, columna, longitud, horizontal = true) {
    // Verifica si el barco cabe dentro del tablero
    if (horizontal && columna + longitud > this.columnas) return false;
    if (!horizontal && fila + longitud > this.filas) return false;

    // Verifica si las celdas están libres
    for (let i = 0; i < longitud; i++) {
        const f = fila + (horizontal ? 0 : i);
        const c = columna + (horizontal ? i : 0);

        if (this.matriz[f][c] !== "~" && this.matriz[f][c].status !== "~") return false;
    }

    // Coloca el barco
    for (let i = 0; i < longitud; i++) {
        const f = horizontal ? fila : fila + i;
        const c = horizontal ? columna + i : columna;
    
        this.matriz[f][c] = {
            status: "ship",
            ship: longitud,
        };
    }
    return true;
    }

    atacar(fila, columna) {
        const celda = this.matriz[fila][columna];
    
        // ✅ Validación: Ya fue atacada
        if (celda.status === "hit" || celda.status === "miss") {
            return "Ya atacado";
        }
    
        // 💥 Si hay un barco, se marca como impacto
        if (celda.status === "ship") {
            celda.status = "hit";
            return "💥 Impacto!";
        } else {
            // ❌ Si no hay barco, es un fallo
            this.matriz[fila][columna] = {
                status: "miss",
                ship: null
            };
            return "❌ Agua";
        }
    }    
    
    renderBoard(id, playerOption) {
        const container = document.getElementById(id);
        container.innerHTML = "";
        container.style.display = "grid";
        container.style.gridTemplateColumns = `repeat(${this.columnas}, 30px)`;
        container.style.gridTemplateRows = `repeat(${this.filas}, 30px)`;
    
        for (let i = 0; i < this.filas; i++) {
            for (let j = 0; j < this.columnas; j++) {
                const celda = document.createElement("div");
                celda.classList.add("cell");
                celda.dataset.fila = i;
                celda.dataset.columna = j;
    
                const valor = this.matriz[i][j]; // Usamos la matriz actualizada
    
                if (valor === "~" || valor.status === "~") {
                    celda.style.backgroundImage = "url('./assets/shot/water.png')";
                } else if (valor.status === "ship") {
                    celda.style.backgroundImage = `url('./assets/ship/ship${valor.ship}.png')`;
                }
                
                if (valor.status === "hit") {
                    celda.style.backgroundImage = "url('./assets/shot/explosion.png')";
                } else if (valor.status === "miss") {
                    celda.style.backgroundImage = "url('./assets/shot/missedShot.png')";
                }
                
                celda.style.backgroundSize = "cover";
                container.appendChild(celda);
            }
        }
    }
}    