// js/scanner.js

document.addEventListener("DOMContentLoaded", () => {
    const scanBtn = document.getElementById("scanBtn");
    if (scanBtn) scanBtn.addEventListener("click", startScan);
});

async function startScan() {
    const input = document.getElementById("tokenAddress");
    const address = input.value.trim();
    if (!address) {
        alert("Enter a token contract address");
        return;
    }

    try {
        const token = await fetchToken(address);
        const ai = runRiskAnalysis(token);
        const result = { ...token, ...ai };
        localStorage.setItem("clawscan_result", JSON.stringify(result));
        window.location.href = "result.html";
    } catch (error) {
        console.error(error);
        alert("Token not found or API error");
    }
}

async function fetchToken(address) {
    const url = `https://api.dexscreener.com/latest/dex/tokens/${address}`;
    const response = await fetch(url);
    const data = await response.json();

    if (!data.pairs || data.pairs.length === 0) throw new Error("Token not found");

    const pair = data.pairs[0];
    return {
        name: pair.baseToken.name,
        symbol: pair.baseToken.symbol,
        logo: pair.info?.imageUrl || "",
        price: pair.priceUsd,
        marketCap: pair.fdv,
        liquidity: pair.liquidity.usd,
        volume24h: pair.volume.h24,
        chain: pair.chainId,
        dex: pair.dexId,
        isHoneypot: pair.isHoneypot || false,
        ownershipRenounced: pair.owner === null,
        hasMintFunction: pair.hasMintFunction || false,
        hasBlacklistFunction: pair.hasBlacklistFunction || false
    };
}

function runRiskAnalysis(token) {
    let score = 50;
    let checks = [];

    // Liquidity
    if(token.liquidity > 1000000){ score+=20; checks.push("Strong Liquidity ✅"); }
    else if(token.liquidity > 100000){ score+=10; checks.push("Moderate Liquidity ⚖️"); }
    else{ score-=20; checks.push("Very Low Liquidity ⚠️"); }

    // Market Cap
    if(token.marketCap > 50000000){ score+=20; checks.push("Large Market Cap ✅"); }
    else if(token.marketCap > 5000000){ score+=10; checks.push("Growing Market Cap ⚖️"); }
    else{ score-=10; checks.push("Small Market Cap ⚠️"); }

    // Volume
    if(token.volume24h > 1000000){ score+=15; checks.push("Strong Trading Activity ✅"); }
    else if(token.volume24h > 100000){ score+=5; checks.push("Moderate Trading Activity ⚖️"); }
    else{ score-=15; checks.push("Low Trading Volume ⚠️"); }

    // Honeypot
    if(token.isHoneypot){ score-=30; checks.push("Honeypot Detected 🚨"); }

    // Owner control
    if(!token.ownershipRenounced){ score-=20; checks.push("Owner Control Exists ⚠️"); }

    // Mint / Blacklist
    if(token.hasMintFunction){ score-=15; checks.push("Mint Function Detected ⚠️"); }
    if(token.hasBlacklistFunction){ score-=15; checks.push("Blacklist Function Detected ⚠️"); }

    // Clamp score
    if(score>100) score=100;
    if(score<0) score=0;

    // Rating & Advice
    let rating="", advice="";
    if(score>=80){ rating="Low Risk ✅"; advice="Token appears safe. Trade normally."; }
    else if(score>=50){ rating="Medium Risk ⚖️"; advice="Token shows some risk. Proceed carefully."; }
    else{ rating="High Risk 🚨"; advice="High probability of scam, rugpull, or honeypot."; }

    return { score, rating, advice, checks };
}