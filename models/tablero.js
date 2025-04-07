export class Tablero {
    constructor(size) {
        this.size = size;
    }

    createBoard() {
        console.log("✅ Tablero inicializado.");
        const boardP1 = [];
        const boardP2 = [];
        let cellId = 1;
    
        // Crear un arreglo plano con información de la fila y columna
        for (let row = 0; row < this.size; row++) {
            for (let col = 0; col < this.size; col++) {
                const cellP1 = {
                    id: cellId,
                    row,
                    col,
                    status: "w",       // w: water, ship: barco, hit: impacto, miss: fallado
                    visible: true,     // Visible para jugador 1
                    ship: null,
                    player: "p1",
                };
                const cellP2 = {
                    ...cellP1,
                    id: cellId,        // Mismo id para la celda duplicada
                    visible: true,    // Oculto para jugador 2
                    player: "p2",
                };
                boardP1.push(cellP1);
                boardP2.push(cellP2);
                cellId++;
            }
        }

        return { boardP1, boardP2 };
    }

    colocarBarco(board, fila, columna, longitud, horizontal = true) {
        // Validar que el barco quepa en el tablero
        if (horizontal && (columna + longitud > this.size)) return false;
        if (!horizontal && (fila + longitud > this.size)) return false;

        // Verificar que las celdas estén libres (status === "w")
        for (let i = 0; i < longitud; i++) {
            const f = fila + (horizontal ? 0 : i);
            const c = columna + (horizontal ? i : 0);
            const cell = board.find(cel => cel.row === f && cel.col === c);
            if (!cell || cell.status !== "w") return false;
        }

        // Colocar el barco actualizando las celdas correspondientes
        for (let i = 0; i < longitud; i++) {
            const f = fila + (horizontal ? 0 : i);
            const c = columna + (horizontal ? i : 0);
            const cell = board.find(cel => cel.row === f && cel.col === c);
            if (cell) {
                cell.status = "s";
                cell.ship = longitud;
            }
        }
        return true;
    }

    atacar(board, fila, columna) {
        const cell = board.find(cel => cel.row === fila && cel.col === columna);
        if (!cell) return "Celda no existe";
    
        // Evitar disparar a celdas ya atacadas
        if (cell.status === "h" || cell.status === "mi") {
            return "Ya atacado";
        }
        
        // Si la celda contiene un barco, se marca como impacto ("h")
        if (cell.status === "s") {
            cell.status = "h";  // Se mostrará hit.gif en renderBoard
            return "💥 Impacto!";
        } else {
            // Si es agua, se marca como disparo fallido ("mi")
            cell.status = "mi"; // Se mostrará missedShot.png en renderBoard
            cell.ship = null;
            return "❌ Agua";
        }
    }     
    
    renderBoard(board, containerId, option) {
        const boardContainer = document.getElementById(containerId);
        if (!boardContainer) {
            console.error(`No se encontró el contenedor con id ${containerId}`);
            return;
        }
        boardContainer.innerHTML = "";
        boardContainer.style.display = "grid";
        boardContainer.style.gridTemplateColumns = `repeat(${this.size}, minmax(25px, 1fr))`;

        // Ordenar las celdas para renderizar de forma correcta (fila por fila)
        board.sort((a, b) => {
            if (a.row === b.row) return a.col - b.col;
            return a.row - b.row;
        });

        board.forEach(cell => {
            let image;
            let path;
            switch(cell.status) {
                case "w": 
                    path = "/assets/shot/";
                    image = "water.png";
                    break;
                case "s":
                    path = "/assets/ship/";
                    image = "ship1.png";
                    break;
                case "h":
                    path = "/assets/shot/";
                    image = "hit.gif";
                    break;
                default: // Aquí se asume que el único otro valor es "mi"
                    path = "/assets/shot/";
                    image = "missedShot.png";
            }            
            // Dependiendo de la opción y jugador, renderizamos un botón o un div con imagen
            if (option === 2 && cell.player === "p2") {
                const button = document.createElement("button");
                button.className = "cell";
                button.innerHTML = `<img src="${path}${image}" alt="${cell.status}" data-id="${cell.id}">`;
                boardContainer.appendChild(button);
            } else if (option === 1) {
                const div = document.createElement("div");
                div.className = "cell-image";
                div.innerHTML = `<img src="${path}${image}" alt="${cell.status}" data-id="${cell.id}">`;
                boardContainer.appendChild(div);
            } else {
                const button = document.createElement("button");
                button.className = "cell";
                button.innerHTML = `<img src="${path}${image}" alt="${cell.status}" data-id="${cell.id}">`;
                boardContainer.appendChild(button);
            }
        });
    }
}
