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
            newsContainer.style.color = '#222';
            newsContainer.style.cursor = 'pointer';
            newsContainer.style.transition = 'background 0.25s';

            newsContainer.innerHTML = `
                <div class="news-item">
                    <div class="news-item-title flex">
                        <img src="" alt="">
                        <div class="news-title-text">
                            <h1 style="color:#222;">${news.title || ''}</h1>
                            <span style="color:#222;">• ${dateStr}</span>
                        </div>
                    </div>
                    <div class="news-item-content" style="display:none;transition:all .25s;">
                        <p class="news-item-content-description" style="color:#222;">${news.text || ''}</p>
                    </div>
                </div>
            `;

            // Toggle logic
            newsContainer.addEventListener('click', function() {
                const content = newsContainer.querySelector('.news-item-content');
                if (content.style.display === 'none' || !content.style.display) {
                    content.style.display = 'block';
                    content.style.height = 'auto';
                } else {
                    content.style.display = 'none';
                    content.style.height = '0';
                }
            });

            container.appendChild(newsContainer);
        });
    } catch (e) {
        container.innerHTML = '<div style="padding:30px;text-align:center;color:#c00;">Impossibile caricare le news.</div>';
    }
});
