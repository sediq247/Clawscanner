// ===============================
// result.js - ClawScanner Results Page
// Compatible with your current result.html
// ===============================

document.addEventListener("DOMContentLoaded", () => {
    displayResult();
    displayRecentScans();
});

// -------------------
// DISPLAY TOKEN SCAN RESULT
// -------------------
function displayResult() {
    const result = JSON.parse(localStorage.getItem("clawscan_result"));
    if (!result) return;

    // Token Summary
    document.getElementById("tokenLogo").src = result.logo || "/images/default-token.png";
    document.getElementById("tokenLogo").alt = result.name ? `${result.name} Logo` : "Token Logo";
    document.getElementById("tokenName").textContent = result.name || "Unknown";
    document.getElementById("tokenSymbol").textContent = result.symbol || "---";
    document.getElementById("tokenChain").textContent = result.chain || "---";
    document.getElementById("tokenDEX").textContent = result.dex || "---";

    // Market Metrics
    document.getElementById("tokenPrice").textContent = formatNumber(result.price);
    document.getElementById("tokenLiquidity").textContent = formatNumber(result.liquidity);
    document.getElementById("tokenMarketCap").textContent = formatNumber(result.marketCap);
    document.getElementById("tokenVolume").textContent = formatNumber(result.volume24h);

    // Vulnerabilities / Checks
    const checksContainer = document.getElementById("tokenChecks");
    checksContainer.innerHTML = "";
    (result.checks || []).forEach(check => {
        const li = document.createElement("li");
        li.textContent = check;
        checksContainer.appendChild(li);
    });

    // Risk Analysis
    document.getElementById("riskScore").textContent = result.score || 0;
    document.getElementById("riskRating").textContent = result.safety || "Unknown";
    document.getElementById("riskAdvice").textContent = result.advice || "N/A";
}

// -------------------
// HELPER: Format Number
// -------------------
function formatNumber(num) {
    if (num === undefined || num === null) return "--";
    return Number(num).toLocaleString(undefined, { maximumFractionDigits: 2 });
}

// -------------------
// DISPLAY RECENT SCANS
// -------------------
function displayRecentScans() {
    const container = document.getElementById("scanHistory");
    if (!container) return;

    const history = JSON.parse(localStorage.getItem("clawscan_history")) || [];
    container.innerHTML = "";

    history.forEach(scan => {
        const div = document.createElement("div");
        div.className = "history-item";

        const spanName = document.createElement("span");
        spanName.textContent = `${scan.name || 'Unknown'} (${scan.symbol || '---'})`;

        const spanScore = document.createElement("span");
        spanScore.textContent = `${scan.score || 0} pts`;
        spanScore.className = scan.score >= 80 ? "green" : scan.score >= 50 ? "yellow" : "red";

        div.appendChild(spanName);
        div.appendChild(spanScore);

        container.appendChild(div);
    });
}