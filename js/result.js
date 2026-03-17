// js/result.js

document.addEventListener("DOMContentLoaded", () => {
    const result = JSON.parse(localStorage.getItem("clawscan_result"));
    if(!result) return document.body.innerHTML="<p>No scan data found.</p>";

    document.getElementById("tokenName").innerText = result.name;
    document.getElementById("tokenSymbol").innerText = result.symbol;
    document.getElementById("tokenPrice").innerText = `$${Number(result.price).toLocaleString()}`;
    document.getElementById("tokenMarketCap").innerText = `$${Number(result.marketCap).toLocaleString()}`;
    document.getElementById("tokenLiquidity").innerText = `$${Number(result.liquidity).toLocaleString()}`;
    document.getElementById("tokenVolume").innerText = `$${Number(result.volume24h).toLocaleString()}`;
    document.getElementById("tokenRating").innerText = result.rating;
    document.getElementById("tokenScore").innerText = result.score;
    document.getElementById("tokenAdvice").innerText = result.advice;

    const checksContainer = document.getElementById("tokenChecks");
    result.checks.forEach(c=>{
        const p = document.createElement("p");
        p.innerText = c;
        checksContainer.appendChild(p);
    });
});
