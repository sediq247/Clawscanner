// ===============================
// news.js - ClawScanner Crypto News Page
// Fully upgraded
// ===============================

document.addEventListener("DOMContentLoaded", () => {
    loadCryptoNews();
    loadTrendingCoins();
    loadTopTradedCoins();
});

// -------------------
// HELPER: Format Number
// -------------------
function formatNumber(num) {
    return Number(num).toLocaleString(undefined, { maximumFractionDigits: 2 });
}

// -------------------
// LOAD LATEST CRYPTO NEWS
// -------------------
async function loadCryptoNews() {
    const container = document.getElementById("newsContainer");
    if (!container) return;

    container.innerHTML = "<p>Loading crypto news...</p>";

    try {
        // Using CryptoControl Free API
        const res = await fetch(
            "https://cryptocontrol.io/api/v1/public/news/coin?coin=bitcoin&language=en",
            {
                headers: {
            
                }
            }
        );
        const news = await res.json();

        container.innerHTML = "";
        news.slice(0, 10).forEach(article => {
            container.innerHTML += `
                <div class="news-card">
                    <img src="${article.media || 'img/placeholder.png'}" alt="${article.title}">
                    <h4><a href="${article.url}" target="_blank">${article.title}</a></h4>
                    <p>${article.sourceDomain} | ${new Date(article.publishedAt).toLocaleDateString()}</p>
                </div>
            `;
        });

    } catch (e) {
        console.error("Crypto news error:", e);
        container.innerHTML = "<p>Failed to load crypto news.</p>";
    }
}

// -------------------
// LOAD TRENDING COINS
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
                    <h4>${coin.name}</h4>
                    <p>${coin.symbol}</p>
                </div>
            `;
        });

    } catch (e) {
        console.error("Trending coins error:", e);
        container.innerHTML = "<p>Failed to load trending coins.</p>";
    }
}

// -------------------
// LOAD TOP TRADED COINS
// -------------------
async function loadTopTradedCoins() {
    const container = document.getElementById("topCoins");
    if (!container) return;
    container.innerHTML = "<p>Loading top traded coins...</p>";

    try {
        const res = await fetch(
            "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=volume_desc&per_page=10&page=1&sparkline=false"
        );
        const coins = await res.json();

        container.innerHTML = "";
        coins.forEach(coin => {
            container.innerHTML += `
                <div class="coin-card">
                    <img src="${coin.image}" alt="${coin.name} Logo">
                    <h4>${coin.name}</h4>
                    <p>Price: $${formatNumber(coin.current_price)}</p>
                    <p>24h Volume: $${formatNumber(coin.total_volume)}</p>
                </div>
            `;
        });

    } catch (e) {
        console.error("Top traded coins error:", e);
        container.innerHTML = "<p>Failed to load top traded coins.</p>";
    }
}