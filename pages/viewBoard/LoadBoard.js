const containerInput = document.createElement("div"); // Crear un contenedor para el input de archivos y el botón de carga al render
containerInput.className = "container-input"; // Asignar una clase para estilos CSS
containerInput.style.display = "flex"; // Usar flexbox para alinear los elementos
containerInput.innerHTML = ` 
    <input type="file" id="inputBoards"  accept=".json" multiple/> <!-- Permitir múltiples archivos JSON -->
    <button id="load-btn">Cargar Tablero</button> <!-- Botón para cargar el tablero -->
`;  

document.body.appendChild(containerInput); // Añadir el contenedor al body del documento

const inputFile = document.getElementById("inputBoards"); // Obtener el input de archivos
const expectedNumber = 2;  // Número fijo de archivos que debe subir
let boardP1; // Variable para almacenar el primer tablero
let boardP2; // Variable para almacenar el segundo tablero

inputFile.addEventListener("change", (event) => { // Evento al cambiar el input de archivos

    const archivos = event.target.files; // Obtener los archivos seleccionados

    if (archivos.length !== expectedNumber) { // Validar que se hayan seleccionado exactamente 2 archivos
        console.log("❌ Error: se deben seleccionar exactamente 2 archivos.");
        alert(`Debes seleccionar exactamente ${expectedNumber} archivos`);
        inputFile.value = ""; // Limpiar el input

    } else {

        // Usar FileReader para leer los archivos
        let loadCount = 0; // Contador para verificar que se hayan leído ambos archivos

        for (let i = 0; i < archivos.length; i++) { // Iterar sobre los archivos seleccionados
            const archivo = archivos[i];
            console.log("✅ Archivo cargado correctamente:");
            console.log("Nombre:", archivo.name);
            console.log("Tipo:", archivo.type);
            console.log("Tamaño:", archivo.size);
            
            const reader = new FileReader(); // Crear un nuevo FileReader para leer el archivo
            reader.onload = function(e) { // Evento al cargar el archivo
                console.log("✅ Archivo leído correctamente:", archivo.name);

                try {
                    const jsonData = JSON.parse(e.target.result); // Parsear el contenido del archivo JSON
                    console.log("✅ Contenido del archivo JSON:", jsonData);

                    // Suponiendo que el JSON es un arreglo con celdas que tienen el atributo "player"
                    if (jsonData.length > 0) {
                        if (jsonData[0].player === "p1") {
                            boardP1 = jsonData; // El archivo corresponde al jugador 1
                        } else if (jsonData[0].player === "p2") {
                            boardP2 = jsonData; // El archivo corresponde al jugador 2
                        } else {
                            console.error("El atributo player no es reconocido en el archivo:", archivo.name);
                        }
                    }
                } catch (error) { // Manejar errores al parsear el JSON
                    console.error("Error parseando el archivo:", archivo.name, error);
                }
                loadCount++; // Incrementar el contador de archivos leídos
                
                if (loadCount === expectedNumber) { // Si ambos archivos han sido leídos
                    if (validateBoardJSON(boardP1) && validateBoardJSON(boardP2)) {
                        console.log("✅ Archivos JSON válidos.");
                    } else {
                        console.log("❌ Archivos JSON inválidos.");
                        inputFile.value = ""; // Limpiar el input
                        alert("Los archivos JSON no son válidos. Verifica su estructura.");
                    }
                }
            };
            reader.readAsText(archivo); // Leer el archivo como texto
        }
    }
});
document.getElementById("load-btn").addEventListener("click", () => { // Evento al hacer clic en el botón de carga
    if (boardP1 && boardP2) { // Verificar que ambos tableros hayan sido cargados
        localStorage.setItem("boardP1Loaded", JSON.stringify(boardP1)); // Guardar el primer tablero en localStorage
        localStorage.setItem("boardP2Loaded", JSON.stringify(boardP2)); // Guardar el segundo tablero en localStorage
        alert("✅ Tableros cargados correctamente");
        window.location.href = "./viewBoard.html"; // Dirigir a la visualización de tableros
    } else {
        alert("❌ Debes cargar ambos tableros para visualizarlos");
    }
});

function validateBoardJSON(data) { // Validar la estructura del JSON
    // Validar que el JSON sea un arreglo de objetos
    if (!Array.isArray(data)) {
        console.error("El JSON no es un arreglo.");
        return false;
    }
    for (const cell of data) { // Validar cada celda

        if (typeof cell.id !== "number") { // Validar id
            console.error("Propiedad 'id' incorrecta:", cell);
            return false;
        }
        if (typeof cell.row !== "number") { // Validar fila
            console.error("Propiedad 'row' incorrecta:", cell);
            return false;
        }
        if (typeof cell.col !== "number") { // Validar columna
            console.error("Propiedad 'col' incorrecta:", cell);
            return false;
        }
        if (typeof cell.status !== "string") { // Validar estado
            console.error("Propiedad 'status' incorrecta:", cell);
            return false;
        }
        if (typeof cell.visible !== "boolean") { // Validar visibilidad
            console.error("Propiedad 'visible' incorrecta:", cell);
            return false;
        }
        if (cell.ship !== null && typeof cell.ship !== "number") { // Validar barco
            console.error("Propiedad 'ship' incorrecta:", cell);
            return false;
        }
        if (cell.player !== "p1" && cell.player !== "p2") { // Validar jugador
            console.error("Propiedad 'player' incorrecta:", cell);
            return false;
        }
    }
    return true;
}
