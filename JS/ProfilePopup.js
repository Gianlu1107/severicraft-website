(function () {
    function getJwtPayload(token) {
        try {
            const payload = token.split('.')[1];
            const base64 = payload.replace(/-/g, '+').replace(/_/g, '/');
            const padded = base64 + '='.repeat((4 - (base64.length % 4)) % 4);
            const json = atob(padded);
            return JSON.parse(json);
        } catch (e) {
            console.error('Errore nel decoding del token:', e);
            return null;
        }
    }

    function createPopup(email, minecraft_nick) {
        const existing = document.getElementById('profile-popup');
        if (existing) existing.remove();

        const popup = document.createElement('div');
        popup.id = 'profile-popup';
        Object.assign(popup.style, {
            position: 'absolute',
            top: '70px',
            right: '40px',
            background: '#fff',
            border: '1px solid #44521e',
            borderRadius: '8px',
            boxShadow: '0 4px 16px rgba(0,0,0,0.12)',
            padding: '20px 28px',
            zIndex: '9999',
            display: 'none',
            minWidth: '220px',
            color: '#222',
            pointerEvents: 'auto'
        });

        const divStyle = 'margin-bottom:14px; color:#222;';
        const strongStyle = 'color:#222;';
        const spanStyle = 'color:#222;';
        const buttonStyle = `
            background:#44521e;
            color:#fff;
            border:none;
            padding:8px 18px;
            border-radius:5px;
            cursor:pointer;
            font-size:15px;
            pointer-events: auto;
        `;

        popup.innerHTML = `
            <div style="${divStyle}">
                <strong style="${strongStyle}">Email:</strong><br>
                <span style="${spanStyle}">${email}</span>
            </div>
            <div style="${divStyle}">
                <strong style="${strongStyle}">Nick Minecraft:</strong><br>
                <span style="${spanStyle}">${minecraft_nick}</span>
            </div>
            <button id="profile-stats-btn" style="${buttonStyle}">Stats</button>
        `;
        document.body.appendChild(popup);

        popup.querySelector('#profile-stats-btn').onclick = () => {
            window.open('https://stats.severicraft.it', '_blank');
        };

        return popup;
    }

    function setupProfilePopup() {
        const token = localStorage.getItem('jwt_token');
        if (!token) return;
        const payload = getJwtPayload(token);
        if (!payload || !payload.email || !payload.minecraft_nick) return;

        const btnProfile = document.querySelector('.btn-profile');
        if (!btnProfile) return;

        const popup = createPopup(payload.email, payload.minecraft_nick);

        btnProfile.addEventListener('click', (e) => {
            e.preventDefault();
            popup.style.display = popup.style.display === 'block' ? 'none' : 'block';
        });

        document.addEventListener('click', (e) => {
            if (!btnProfile.contains(e.target) && !popup.contains(e.target)) {
                popup.style.display = 'none';
            }
        });
    }

    window.addEventListener('DOMContentLoaded', setupProfilePopup);
    window.addEventListener('storage', setupProfilePopup);
})();
