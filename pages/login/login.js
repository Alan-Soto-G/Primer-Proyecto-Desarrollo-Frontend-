import Helper from "../../utils/helper.js";

export async function init() {
    console.log("🔐 Login view inicializada");

    await LoadCountrySelector();

    const startBtn = document.querySelector(".start-button");
    if (!startBtn) {
        console.warn("❗ No se encontró el botón de iniciar");
        return;
    }

    startBtn.addEventListener("click", function () {
        const nicknameInput = document.getElementById("nickname");
        const countrySelectBox = document.getElementById("country-select-box");

        if (!nicknameInput || !countrySelectBox) {
            alert("Faltan campos en el formulario.");
            return;
        }

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

        Helper.loadView("configBoard");
    });
}

async function LoadCountrySelector() {
    try {
        const response = await fetch('http://127.0.0.1:5000/countries');
        const data = await response.json();
        console.log("🌍 Países cargados:", data);

        const countrySelectBox = document.getElementById("country-select-box");
        const countryDropdown = document.getElementById("country-dropdown");

        if (!countrySelectBox || !countryDropdown) {
            console.warn("⚠️ No se encontraron los elementos del selector de países.");
            return;
        }

        data.forEach(country => {
            const code = Object.keys(country)[0];
            const name = country[code];
            const flagUrl = `https://flagsapi.com/${code.toUpperCase()}/shiny/64.png`;

            const option = document.createElement("div");
            option.classList.add("dropdown-option");
            option.innerHTML = `<img src="${flagUrl}" alt="${name}"> ${name}`;
            option.dataset.value = code;

            option.addEventListener("click", function () {
                countrySelectBox.textContent = name;
                countryDropdown.style.display = "none";
                countrySelectBox.dataset.code = code;
            });

            countryDropdown.appendChild(option);
        });

        countrySelectBox.addEventListener("click", function () {
            countryDropdown.style.display = countryDropdown.style.display === "block" ? "none" : "block";
        });

        document.addEventListener("click", function (e) {
            if (!countrySelectBox.contains(e.target) && !countryDropdown.contains(e.target)) {
                countryDropdown.style.display = "none";
            }
        });

    } catch (error) {
        console.error("Error al cargar los datos de los países:", error);
    }
}