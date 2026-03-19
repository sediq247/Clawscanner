// ===============================
// result.js - ClawScanner Results Page
// Fully upgraded
// ===============================

document.addEventListener("DOMContentLoaded", () => {
    displayResult();
    displayRecentScans();
});

// -------------------
// DISPLAY TOKEN SCAN RESULT
// -------------------
function displayResult() {
    const resultContainer = document.getElementById("scanResult");
    if (!resultContainer) return;

    const result = JSON.parse(localStorage.getItem("clawscan_result"));
    if (!result) {
        resultContainer.innerHTML = "<p>No scan data found. Please scan a token first.</p>";
        return;
    }

    resultContainer.innerHTML = `
        <div class="token-summary">
            <img src="${result.logo}" alt="${result.name} Logo" class="token-logo">
            <div class="token-info">
                <h3>${result.name} (${result.symbol})</h3>
                <p>Price: $${formatNumber(result.price)}</p>
                <p>Market Cap: $${formatNumber(result.marketCap)}</p>
                <p>Liquidity: $${formatNumber(result.liquidity)}</p>
                <p>24h Volume: $${formatNumber(result.volume24h)}</p>
            </div>
        </div>

        <div class="vulnerabilities">
            <h4 class="section-title">Vulnerabilities & Risk Analysis</h4>
            <ul>
                ${result.checks.map(check => `<li>${check}</li>`).join("")}
            </ul>

            <div class="risk-analysis">
                <p><strong>Score:</strong> ${result.score}</p>
                <p><strong>Rating:</strong> ${result.safety}</p>
                <p><strong>Advice:</strong> ${result.advice}</p>
            </div>
        </div>
    `;
}

// -------------------
// HELPER: Format Number
// -------------------
function formatNumber(num) {
    return Number(num).toLocaleString(undefined, { maximumFractionDigits: 2 });
}

// -------------------
// DISPLAY RECENT SCANS
// -------------------
function displayRecentScans() {
    const container = document.getElementById("recentScans");
    if (!container) return;

    const history = JSON.parse(localStorage.getItem("clawscan_history")) || [];
    container.innerHTML = "";

    history.forEach(scan => {
        container.innerHTML += `
            <div class="history-item">
                <span>${scan.name} (${scan.symbol})</span>
                <span class="${scan.score >= 80 ? "green" : scan.score >= 50 ? "yellow" : "red"}">
                    ${scan.score} pts
                </span>
            </div>
        `;
    });
}