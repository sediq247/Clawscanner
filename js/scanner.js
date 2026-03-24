// ===============================
// scanner.js - ClawScanner 
// ===============================

document.addEventListener("DOMContentLoaded", () => {
    setupScanner();
    displayRecentScans();
});

// -------------------
// SCAN BUTTON CONTROL
// -------------------
function setupScanner() {
    const scanBtn = document.getElementById("scanBtn");
    if (!scanBtn) return;
    scanBtn.addEventListener("click", startScan);
}

// -------------------
// MAIN SCAN FUNCTION
// -------------------
async function startScan() {
    const input = document.getElementById("tokenAddress");
    const address = input.value.trim();

    if (!address) {
        alert("⚠️ Enter a token contract address!");
        return;
    }

    try {
        const token = await fetchToken(address);

        const ai = runRiskAnalysis(token);

        const result = {
            ...token,
            safety: ai.rating,
            score: ai.score,
            advice: ai.advice,
            checks: ai.checks
        };

        // Save to localStorage for recent scans
        saveRecentScan(result);

        // Pass result to result.html
        localStorage.setItem("clawscan_result", JSON.stringify(result));

        window.location.href = "result.html";

    } catch (error) {
        console.error(error);
        alert("❌ Token not found or API error. Check the contract address.");
    }
}

// -------------------
// FETCH TOKEN DATA
// -------------------
async function fetchToken(address) {
    const url = `https://api.dexscreener.com/latest/dex/tokens/${address}`;
    const response = await fetch(url);
    const data = await response.json();

    console.log("DEX response:", data); // debug

    if (!data.pairs || data.pairs.length === 0) {
        throw new Error("Token not found");
    }

    // Pick the first pair that has a valid priceUsd
    const pair = data.pairs.find(p => p.priceUsd) || data.pairs[0];

    return {
        name: pair.baseToken?.name || "Unknown",
        symbol: pair.baseToken?.symbol || "---",
        logo: pair.info?.imageUrl || "",
        price: pair.priceUsd || 0,
        marketCap: pair.fdv || 0,
        liquidity: pair.liquidity?.usd || 0,
        volume24h: pair.volume?.h24 || 0,
        chain: pair.chainId || "Unknown",
        dex: pair.dexId || "Unknown",
        isHoneypot: false, // placeholder, replace with actual detection logic
        ownershipRenounced: true, // placeholder
        hasMintFunction: false, // placeholder
        hasBlacklistFunction: false // placeholder
    };
}

// -------------------
// AI RISK ANALYSIS
// -------------------
function runRiskAnalysis(token) {
    let score = 50;
    let checks = [];

    // Liquidity Check
    if (token.liquidity > 1000000) {
        score += 20;
        checks.push("Strong Liquidity ✅");
    } else if (token.liquidity > 100000) {
        score += 10;
        checks.push("Moderate Liquidity ⚖️");
    } else {
        score -= 20;
        checks.push("Very Low Liquidity ⚠️");
    }

    // Market Cap Check
    if (token.marketCap > 50000000) {
        score += 20;
        checks.push("Large Market Cap ✅");
    } else if (token.marketCap > 5000000) {
        score += 10;
        checks.push("Growing Market Cap ⚖️");
    } else {
        score -= 10;
        checks.push("Small Market Cap ⚠️");
    }

    // Volume Check
    if (token.volume24h > 1000000) {
        score += 15;
        checks.push("Strong Trading Activity ✅");
    } else if (token.volume24h > 100000) {
        score += 5;
        checks.push("Moderate Trading Activity ⚖️");
    } else {
        score -= 15;
        checks.push("Low Trading Volume ⚠️");
    }

    // Honeypot / Sell Test
    if (token.isHoneypot) {
        score -= 30;
        checks.push("Honeypot Detected 🚨");
    }

    // Ownership / Rugpull Risk
    if (!token.ownershipRenounced) {
        score -= 20;
        checks.push("Owner Control Exists ⚠️ (Possible Rugpull)");
    }

    // Mint / Blacklist Functions
    if (token.hasMintFunction) {
        score -= 15;
        checks.push("Mint Function Detected ⚠️");
    }
    if (token.hasBlacklistFunction) {
        score -= 15;
        checks.push("Blacklist Function Detected ⚠️");
    }

    // Score Limits
    if (score > 100) score = 100;
    if (score < 0) score = 0;

    // Risk Rating
    let rating = "";
    let advice = "";
    if (score >= 80) {
        rating = "Low Risk ✅";
        advice = "Token appears safe. Trade normally.";
    } else if (score >= 50) {
        rating = "Medium Risk ⚖️";
        advice = "Token shows some risk. Proceed carefully.";
    } else {
        rating = "High Risk 🚨";
        advice = "High probability of scam, rugpull, or honeypot.";
    }

    return { score, rating, advice, checks };
}

// -------------------
// RECENT SCANS STORAGE
// -------------------
function saveRecentScan(result) {
    let history = JSON.parse(localStorage.getItem("clawscan_history")) || [];
    history.unshift(result);
    if (history.length > 5) history.pop(); // Keep last 5 scans
    localStorage.setItem("clawscan_history", JSON.stringify(history));
}

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