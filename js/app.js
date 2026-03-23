document.addEventListener("DOMContentLoaded", () => {
    // Initial load
    loadTrendingCoins();
    loadTopMarketData();

    document.addEventListener("DOMContentLoaded", () => {

        document.querySelectorAll(".tab").forEach(tab => {
            tab.addEventListener("click", () => {
    
                // remove active from all buttons
                document.querySelectorAll(".tab").forEach(t => t.classList.remove("active"));
                tab.classList.add("active");
    
                // hide all content
                document.querySelectorAll(".tab-pane").forEach(p => p.classList.remove("active"));
    
                // show selected
                const target = tab.getAttribute("data-tab");
                document.getElementById(target).classList.add("active");
            });
        });
    
    });
    // Auto-refresh every 60 seconds
    setInterval(() => {
        loadTrendingCoins();
        loadTopMarketData();
    }, 60000); // 60000ms = 1 minute
});

// -------------------
// HELPER: Format Number
// -------------------
function formatNumber(num) {
    return Number(num).toLocaleString(undefined, { maximumFractionDigits: 2 });
}

// -------------------
// TRENDING COINS
// -------------------
async function loadTrendingCoins() {
    const container = document.getElementById("trendingCoins");
    if (!container) return;
    container.innerHTML = "<p>Loading trending coins...</p>";

    try {
        const res = await fetch("https://api.coingecko.com/api/v3/search/trending");
        const data = await res.json();

        container.innerHTML = "";

        data.coins.forEach(c => {
            const coin = c.item;
            container.innerHTML += `
                <div class="coin-card">
                    <img src="${coin.large}" alt="${coin.name} Logo">
                    <h4>${coin.name}</h4>
                    <p>${coin.symbol}</p>
                    <p>Rank #${coin.market_cap_rank}</p>
                </div>
            `;
        });

    } catch (e) {
        container.innerHTML = "<p>Failed to load trending coins.</p>";
        console.error("Trending coins error:", e);
    }
}

// -------------------
// TOP MARKET DATA: Gainers, Losers, Top Traded
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
            .slice(0, 5);
        renderCoins(gainers, "topGainers");

        // Top Losers
        const losers = [...coins]
            .sort((a, b) => a.price_change_percentage_24h - b.price_change_percentage_24h)
            .slice(0, 5);
        renderCoins(losers, "topLosers");

        // Top Traded (volume)
        const topTraded = [...coins]
            .sort((a, b) => b.total_volume - a.total_volume)
            .slice(0, 5);
        renderCoins(topTraded, "topCoins");

    } catch (e) {
        console.error("Market data error:", e);
    }
}

// -------------------
// RENDER COINS
// -------------------
function renderCoins(list, containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;
    container.innerHTML = ""; 

    list.forEach(coin => {
        container.innerHTML += `
            <div class="coin-card">
                <img src="${coin.image}" alt="${coin.name} Logo">
                <h4>${coin.name}</h4>
                <p>Price: $${formatNumber(coin.current_price)}</p>
                <p>Market Cap: $${formatNumber(coin.market_cap)}</p>
                <p class="${coin.price_change_percentage_24h >= 0 ? "green" : "red"}">
                    ${coin.price_change_percentage_24h.toFixed(2)}%
                </p>
            </div>
        `;
    });
}