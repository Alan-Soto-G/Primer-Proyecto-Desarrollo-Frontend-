export async function mostrarRanking() {
    try {
        const response = await fetch("http://127.0.0.1:5000/ranking");
        if (!response.ok) {
            throw new Error(`HTTP error: ${response.status}`);
        }
        const ranking = await response.json();
        console.log("Ranking Data:", ranking);

        const table = document.getElementById("ranking-body");
        table.innerHTML = ""; // Limpiar ranking anterior

        ranking.forEach((item) => {
            const row = document.createElement("tr");
            const countryCode = item.country_code.toUpperCase();
            const flagUrl = `https://flagsapi.com/${countryCode}/shiny/64.png`;

            row.innerHTML = `
                <td>${item.score}</td>
                <td>${item.nick_name}</td>
                <td><img src="${flagUrl}" alt="${item.country_code}" onerror="this.onerror=null; this.style.display='none';"></td>
            `;

            table.appendChild(row);
            console.log("Ranking Row:", row);
        });
    } catch (error) {
        console.error("Error fetching ranking:", error);
    }
}

// Llamada inmediata al cargar el módulo para mostrar el ranking inicial
mostrarRanking();
