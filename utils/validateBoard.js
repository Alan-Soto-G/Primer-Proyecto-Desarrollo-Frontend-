export function validateBoardJSON(data) {
    // Verificar que data sea un arreglo
    if (!Array.isArray(data)) {
        console.error("El JSON no es un arreglo.");
        return false;
    }
    // Recorrer cada celda y validar la estructura
    for (const cell of data) {
        if (typeof cell.id !== "number") {
            console.error("Propiedad 'id' incorrecta:", cell);
            return false;
        }
        if (typeof cell.row !== "number") {
            console.error("Propiedad 'row' incorrecta:", cell);
            return false;
        }
        if (typeof cell.col !== "number") {
            console.error("Propiedad 'col' incorrecta:", cell);
            return false;
        }
        if (typeof cell.status !== "string") {
            console.error("Propiedad 'status' incorrecta:", cell);
            return false;
        }
        if (typeof cell.visible !== "boolean") {
            console.error("Propiedad 'visible' incorrecta:", cell);
            return false;
        }
        if (cell.ship !== null && typeof cell.ship !== "number") {
            console.error("Propiedad 'ship' incorrecta:", cell);
            return false;
        }
        if (cell.player !== "p1" && cell.player !== "p2") {
            console.error("Propiedad 'player' incorrecta:", cell);
            return false;
        }
    }
    return true;
}