document.addEventListener('DOMContentLoaded', async () => {
    const container = document.querySelector('.news-containers');
    if (!container) return;

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

            // Create markup
            const newsContainer = document.createElement('div');
            newsContainer.className = 'news-container';
            newsContainer.style.background = '#44521e';
            newsContainer.style.color = '#fff';
            newsContainer.style.cursor = 'pointer';
            newsContainer.style.transition = 'background 0.25s';

            newsContainer.innerHTML = `
                <div class="news-item">
                    <div class="news-item-title flex">
                        <img src="" alt="">
                        <div class="news-title-text">
                            <h1 style="color:#fff;">${news.title || ''}</h1>
                            <span style="color:#fff;">• ${dateStr}</span>
                        </div>
                    </div>
                    <div class="news-item-content" style="display:none;">
                        <p class="news-item-content-description" style="color:#fff;">${news.text || ''}</p>
                    </div>
                </div>
            `;

            const content = newsContainer.querySelector('.news-item-content');
            content.style.display = 'none';

            newsContainer.addEventListener('click', function() {
                if (content.style.display === 'block') {
                    content.style.display = 'none';
                } else {
                    content.style.display = 'block';
                }
            });

            container.appendChild(newsContainer);
        });
    } catch (e) {
        container.innerHTML = '<div style="padding:30px;text-align:center;color:#c00;">Impossibile caricare le news.</div>';
    }
});
