// ===============================
// app.js - ClawScanner Home Page
// ===============================

document.addEventListener("DOMContentLoaded", () => {
    setupTabs();
    loadAllMarketData();
});

// -------------------
// Helper: Format Number
// -------------------
function formatNumber(num) {
    return Number(num).toLocaleString(undefined, { maximumFractionDigits: 2 });
}

// -------------------
// Setup Tabs Switching
// -------------------
function setupTabs() {
    const tabs = document.querySelectorAll(".tabs");
    const panes = document.querySelectorAll(".tab-pane");

    tabs.forEach(tab => {
        tab.addEventListener("click", () => {
            // Remove active class from all tabs
            tabs.forEach(t => t.classList.remove("active"));
            tab.classList.add("active");

            // Hide all panes
            panes.forEach(p => p.classList.remove("active"));

            // Show target pane
            const target = tab.getAttribute("data-tab");
            const pane = document.getElementById(target);
            if (pane) pane.classList.add("active");
        });
    });
}

// -------------------
// Load All Market Data
// -------------------
async function loadAllMarketData() {
    await loadTrendingCoins();
    await loadTopMarketData();
}

// -------------------
// TRENDING COINS
// -------------------
async function loadTrendingCoins() {
    const container = document.getElementById("trendingCoins");
    container.innerHTML = "<p>Loading trending coins...</p>";

    try {
        const res = await fetch("https://api.coingecko.com/api/v3/search/trending");
        const data = await res.json();

        container.innerHTML = "";

        data.coins.forEach(c => {
            const coin = c.item;

            container.innerHTML += `
            <div class="coin-row">

                <!-- NAME -->
                <div class="col name">
                    <img src="${coin.large}" class="coin-logo">
                    <div>
                        <div class="symbol">${coin.symbol.toUpperCase()}</div>
                        <div class="fullname">${coin.name}</div>
                    </div>
                </div>

                <!-- PRICE -->
                <div class="col price">
                    <div class="main-price">--</div>
                    <div class="sub-price">Rank #${coin.market_cap_rank || '-'}</div>
                </div>

                <!-- CHANGE -->
                <div class="col change green">
                    🔥 Trending
                </div>

            </div>
            `;
        });

    } catch (e) {
        container.innerHTML = "<p>Failed to load trending coins.</p>";
        console.error("Trending coins error:", e);
    }
}

// -------------------
// TOP MARKET DATA (Gainers, Losers, Top Traded)
// -------------------
async function loadTopMarketData() {
    try {
        const res = await fetch(
            "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=50&page=1&sparkline=false"
        );
        const coins = await res.json();

        // Top Gainers
        const gainers = [...coins]
            .sort((a, b) => b.price_change_percentage_24h - a.price_change_percentage_24h)
            .slice(0, 10);
        renderCoins(gainers, "topGainers");

        // Top Losers
        const losers = [...coins]
            .sort((a, b) => a.price_change_percentage_24h - b.price_change_percentage_24h)
            .slice(0, 10);
        renderCoins(losers, "topLosers");

        // Top Traded (volume)
        const topTraded = [...coins]
            .sort((a, b) => b.total_volume - a.total_volume)
            .slice(0, 10);
        renderCoins(topTraded, "topCoins");

    } catch (e) {
        console.error("Market data error:", e);
    }
}

// -------------------
//   RENDER COINS 
// -------------------
function renderCoins(list, containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    container.innerHTML = "";

    list.forEach(coin => {
        const isGreen = coin.price_change_percentage_24h >= 0;

        container.innerHTML += `
            <div class="coin-row">

                <!-- NAME -->
                <div class="col name">
                    <img src="${coin.image}" class="coin-logo">
                    <div>
                        <div class="symbol">${coin.symbol.toUpperCase()}</div>
                        <div class="fullname">${coin.name}</div>
                    </div>
                </div>

                <!-- PRICE -->
                <div class="col price">
                    <div class="main-price">$${formatNumber(coin.current_price)}</div>
                    <div class="sub-price">$${formatNumber(coin.market_cap)}</div>
                </div>

                <!-- CHANGE -->
                <div class="col change ${isGreen ? "green" : "red"}">
                    ${coin.price_change_percentage_24h.toFixed(2)}%
                </div>

            </div>
        `;
    });
}