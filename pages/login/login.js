const selectBox = document.querySelector(".select-selected");
const dropdown = document.querySelector(".select-items");
async function LoadCountrySelector() {
    try {
        
        // Realiza la solicitud para obtener la lista de países
        const response = await fetch('http://127.0.0.1:5000/countries');
        const data = await response.json();

        // Referencias a los elementos del DOM
        const selectBox = document.getElementById("country-select-box");
        const dropdown = document.getElementById("country-dropdown");

        // Itera sobre los datos y crea las opciones del selector
        data.forEach(country => {
            const code = Object.keys(country)[0];
            const name = country[code];
            const flagUrl = `https://flagsapi.com/${code.toUpperCase()}/shiny/64.png`;
            const fallbackFlag = "https://images.vexels.com/media/users/3/143536/isolated/lists/417c26e535aeb963a6e0a23d1f92df1d-signo-de-interrogacion-3d-degradado-gris.png";

            // Crea una opción para el dropdown
            const option = document.createElement("div");
            option.classList.add("dropdown-option");
            option.innerHTML = `<img src="${flagUrl}" alt="${name}" onerror="this.onerror=null; this.src='${fallbackFlag}';"> ${name}`;
            option.dataset.value = code;

            // Agrega un evento para seleccionar el país
            option.addEventListener("click", function () {
                selectBox.innerHTML = `<img src="${flagUrl}" alt="${name}" onerror="this.onerror=null; this.src='${fallbackFlag}';"> ${name}`;
                dropdown.style.display = "none";
            });

            // Añade la opción al dropdown
            dropdown.appendChild(option);
        });

        // Muestra/oculta el dropdown al hacer clic en el selectBox
        selectBox.addEventListener("click", function () {
            dropdown.style.display = dropdown.style.display === "block" ? "none" : "block";
        });

        // Cierra el dropdown si se hace clic fuera de él
        document.addEventListener("click", function (e) {
            if (!selectBox.contains(e.target) && !dropdown.contains(e.target)) {
                dropdown.style.display = "none";
            }
        });

    } catch (error) {
        console.error("Error al cargar los datos de los países:", error);
    }
}

// Llama a la función para cargar el selector de países
LoadCountrySelector();