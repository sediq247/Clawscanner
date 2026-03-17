// js/app.js

document.addEventListener("DOMContentLoaded", () => {
    setupNavigation();
    loadTrendingCoins();
    loadMarketData();
    revealOnScroll();
});

/* -------------------------
   NAVIGATION CONTROL
------------------------- */
function setupNavigation() {
    const links = document.querySelectorAll("nav a");
    const currentPage = window.location.pathname.split("/").pop();
    links.forEach(link => {
        if (link.getAttribute("href") === currentPage) {
            link.classList.add("active");
        }
    });
}

/* -------------------------
   TRENDING COINS
------------------------- */
async function loadTrendingCoins() {
    const container = document.getElementById("trendingCoins");
    if (!container) return;

    try {
        const res = await fetch("https://api.coingecko.com/api/v3/search/trending");
        const data = await res.json();
        container.innerHTML = "";
        data.coins.forEach(c => {
            const coin = c.item;
            container.innerHTML += `
                <div class="coin-card">
                    <img src="${coin.large}" alt="${coin.name} logo">
                    <h4>${coin.name}</h4>
                    <p>${coin.symbol}</p>
                    <p>#${coin.market_cap_rank}</p>
                </div>
            `;
        });
    } catch (err) {
        console.error("Trending Coins Error:", err);
        container.innerHTML = "<p>Failed to load trending coins.</p>";
    }
}

/* -------------------------
   MARKET DATA
------------------------- */
async function loadMarketData() {
    const gainersContainer = document.getElementById("topGainers");
    const losersContainer = document.getElementById("topLosers");
    const volumeContainer = document.getElementById("topCoins");

    if (!gainersContainer && !losersContainer && !volumeContainer) return;

    try {
        const res = await fetch("https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=50&page=1&sparkline=false");
        const coins = await res.json();

        const gainers = [...coins].sort((a, b) => b.price_change_percentage_24h - a.price_change_percentage_24h).slice(0, 5);
        const losers = [...coins].sort((a, b) => a.price_change_percentage_24h - b.price_change_percentage_24h).slice(0, 5);
        const topVolume = [...coins].sort((a, b) => b.total_volume - a.total_volume).slice(0, 5);

        renderCoins(gainers, "topGainers");
        renderCoins(losers, "topLosers");
        renderCoins(topVolume, "topCoins");

    } catch (err) {
        console.error("Market Data Error:", err);
    }
}

/* -------------------------
   RENDER FUNCTION
------------------------- */
function renderCoins(list, containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    container.innerHTML = "";
    list.forEach(coin => {
        container.innerHTML += `
            <div class="coin-card">
                <img src="${coin.image}" alt="${coin.name} logo">
                <h4>${coin.name}</h4>
                <p>$${coin.current_price.toLocaleString()}</p>
                <p class="${coin.price_change_percentage_24h > 0 ? 'green' : 'red'}">
                    ${coin.price_change_percentage_24h.toFixed(2)}%
                </p>
            </div>
        `;
    });
}

/* -------------------------
   SCROLL REVEAL
------------------------- */
function revealOnScroll() {
    const reveals = document.querySelectorAll(".reveal");
    reveals.forEach(el => {
        const windowHeight = window.innerHeight;
        const revealTop = el.getBoundingClientRect().top;
        const revealPoint = 100;
        if (revealTop < windowHeight - revealPoint) {
            el.classList.add("active");
        }
    });
}
window.addEventListener("scroll", revealOnScroll);