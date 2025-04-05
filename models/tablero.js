export class Tablero {
    constructor(filas = 10, columnas = 10) {
        this.filas = filas;
        this.columnas = columnas;
        this.matriz = Array.from({ length: filas }, () =>
            Array.from({ length: columnas }, () => "🌊")
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
                const cellP1 = {
                    id: cellId,
                    status: "ship", // <--- Cambiás aquí para probar cambios
                    visible: true,
                    ship: null,
                    player: "p1",
                };

                const cellM1 = {
                    ...JSON.parse(JSON.stringify(cellP1)),
                    player: "p2",
                    visible: false,
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

    renderBoard(board, containerId, option) {
        const boardContainer = document.getElementById(containerId);
        boardContainer.innerHTML = "";
        const size = board.length;

        boardContainer.style.display = "grid";
        boardContainer.style.gridTemplateColumns = `repeat(${size}, minmax(25px, 1fr))`;

        board.forEach(row => {
            row.forEach(cell => {
                let image;
                switch(cell.status) {
                    case "w": image = "water.png"; break;
                    case "ship":
                        image = cell.visible ? "ship.png" : "water.png";
                        break;
                    case "hit": image = "hit.png"; break;
                    default: image = "missedShot.png";
                }

                if (option == 2 && cell.player === "p2") {
                    const button = document.createElement("button");
                    button.className = "cell";
                    button.innerHTML = `<img src="../assets/images/${image}" alt="${cell.status}">`;
                    boardContainer.appendChild(button);
                } else if (option == 1) {
                    const imgContainer = document.createElement("div");
                    imgContainer.className = "cell-image";
                    imgContainer.innerHTML = `<img src="../assets/images/${image}" alt="${cell.status}">`;
                    boardContainer.appendChild(imgContainer);
                } else {
                    const button = document.createElement("button");
                    button.className = "cell";
                    button.innerHTML = `<img src="../assets/images/${image}" alt="${cell.status}">`;
                    boardContainer.appendChild(button);
                }
            });
        });
    }
}
