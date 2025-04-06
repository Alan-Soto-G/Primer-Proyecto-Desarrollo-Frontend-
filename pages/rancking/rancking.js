async function getRanking() {
    try {
        const response = await fetch("http://127.0.0.1:5000/ranking");
        if (!response.ok) {
            throw new Error(`HTTP error: ${response.status}`);
        }
        const rankingData = await response.json();
        console.log("Ranking Data:", rankingData);
        return rankingData;
    } catch (error) {
        console.error("Error fetching ranking:", error);
    }
}

const table = document.getElementById("ranking-body");

// Usando .then() para esperar la promesa
getRanking().then((ranking) => {
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
});