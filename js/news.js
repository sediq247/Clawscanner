// js/news.js

document.addEventListener("DOMContentLoaded", () => {
    loadCryptoNews();
});

async function loadCryptoNews() {
    const newsContainer = document.getElementById("newsContainer");
    if (!newsContainer) return;

    // Show loading message
    newsContainer.innerHTML = `<p class="loading">Fetching latest crypto news...</p>`;

    try {
        // Fetch latest 10 crypto news
        const res = await fetch("https://cryptocurrency.cv/api/news?limit=10");
        const articles = await res.json();

        // Check result
        if (!Array.isArray(articles) || articles.length === 0) {
            newsContainer.innerHTML = `<p>No news available at the moment.</p>`;
            return;
        }

        // Clear container
        newsContainer.innerHTML = "";

        // Render articles
        articles.forEach(article => {
            const date = new Date(article.published_at).toLocaleDateString(undefined, {
                year: "numeric",
                month: "short",
                day: "numeric"
            });

            newsContainer.innerHTML += `
                <div class="news-card">
                    <h3 class="news-title">
                        <a href="${article.url}" target="_blank" rel="noopener noreferrer">${article.title}</a>
                    </h3>
                    <p class="news-meta">Source: ${article.source_name || "Unknown"} | ${date}</p>
                    <p class="news-summary">${article.summary || ""}</p>
                    <a href="${article.url}" target="_blank" rel="noopener noreferrer" class="btn-secondary news-btn">
                        Read Full Article
                    </a>
                </div>
            `;
        });

    } catch (error) {
        console.error("Crypto news error:", error);
        newsContainer.innerHTML = `<p>Error loading news. Please try again later.</p>`;
    }
}