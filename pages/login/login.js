import Helper from "../../utils/helper.js";

async function LoadCountrySelector() {
    try {
        // Realiza la solicitud para obtener la lista de países
        const response = await fetch('http://127.0.0.1:5000/countries');
        const data = await response.json();
        console.log(data); // Verifica los datos obtenidos

        // Referencias a los elementos del DOM
        const countrySelectBox = document.getElementById("country-select-box");
        const countryDropdown = document.getElementById("country-dropdown");

        // Itera sobre los datos y crea las opciones del selector
        data.forEach(country => {
            console.log(country); // Verifica cada país
            const code = Object.keys(country)[0];
            const name = country[code];
            const flagUrl = `https://flagsapi.com/${code.toUpperCase()}/shiny/64.png`;

            // Crea una opción para el dropdown
            const option = document.createElement("div");
            option.classList.add("dropdown-option");
            option.innerHTML = `<img src="${flagUrl}" alt="${name}"> ${name}`;
            option.dataset.value = code;

            // Agrega un evento para seleccionar el país
            option.addEventListener("click", function () {
                countrySelectBox.textContent = name; 
                countryDropdown.style.display = "none";
                countrySelectBox.dataset.code = code; // Guarda el código del país en el dataset
            });

            // Añade la opción al dropdown
            countryDropdown.appendChild(option);
        });

        // Muestra/oculta el dropdown al hacer clic en el selectBox
        countrySelectBox.addEventListener("click", function () {
            console.log("Dropdown toggled"); // Verifica si el evento se dispara
            countryDropdown.style.display = countryDropdown.style.display === "block" ? "none" : "block";
        });

        // Cierra el dropdown si se hace clic fuera de él
        document.addEventListener("click", function (e) {
            if (!countrySelectBox.contains(e.target) && !countryDropdown.contains(e.target)) {
                countryDropdown.style.display = "none";
            }
        });

    } catch (error) {
        console.error("Error al cargar los datos de los países:", error);
    }
}

// Llama a la función para cargar el selector de países
LoadCountrySelector();

document.querySelector(".start-button").addEventListener("click", function () {
    const nicknameInput = document.getElementById("nickname");
    const countrySelectBox = document.getElementById("country-select-box");

    // Verifica si el nickname está vacío o si no se seleccionó un país
    if (!nicknameInput.value.trim()) {
        alert("Por favor, ingresa un nickname.");
        return;
    }

    if (countrySelectBox.textContent === "Find your country ⌵" || !countrySelectBox.textContent.trim()) {
        alert("Por favor, selecciona un país.");
        return;
    }

    localStorage.setItem("nickname", nicknameInput.value.trim());
    localStorage.setItem("country", countrySelectBox.dataset.code);

    // Si todo está correcto, carga la vista configBoard
    Helper.loadView("configBoard");
});