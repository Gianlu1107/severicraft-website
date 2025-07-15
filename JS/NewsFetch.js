document.addEventListener('DOMContentLoaded', async () => {
    const container = document.querySelector('.news-containers');
    if (!container) return;

    // Helper for cycling classes
    const newsClasses = ['news-primary', 'news-alert', 'news-secondary'];

    try {
        const response = await fetch('https://api.severicraft.it/news');
        const newsList = await response.json();

        newsList.forEach((news, idx) => {
            // Format date dd/mm/yyyy
            let dateStr = '';
            if (news.date) {
                const d = new Date(news.date);
                dateStr = `${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth()+1).padStart(2, '0')}/${d.getFullYear()}`;
            }

            // Cycle classes
            const newsClass = newsClasses[idx % newsClasses.length];

            // Create markup
            const newsContainer = document.createElement('div');
            newsContainer.className = `news-container ${newsClass}`;
            newsContainer.style.background = '#f4f4f4';
            newsContainer.style.color = '#222';

            newsContainer.innerHTML = `
                <div class="news-item">
                    <div class="news-item-title flex">
                        <img src="" alt="">
                        <div class="news-title-text">
                            <h1>${news.title || ''}</h1>
                            <span>• ${dateStr}</span>
                        </div>
                    </div>
                    <div class="news-item-content">
                        <p class="news-item-content-description">${news.text || ''}</p>
                    </div>
                </div>
            `;

            container.appendChild(newsContainer);
        });

        // Re-apply accordion logic if needed
        if (window.newsAccordionInit) window.newsAccordionInit();
    } catch (e) {
        // Optionally show error or fallback
        container.innerHTML = '<div style="padding:30px;text-align:center;color:#c00;">Impossibile caricare le news.</div>';
    }
});
