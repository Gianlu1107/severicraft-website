(function() {
    function getJwtPayload(token) {
        try {
            const payload = token.split('.')[1];
            // Base64 decode (handle padding)
            const base64 = payload.replace(/-/g, '+').replace(/_/g, '/');
            const json = atob(base64);
            return JSON.parse(json);
        } catch (e) {
            return null;
        }
    }

    function createPopup(email, minecraft_nick) {
        let popup = document.getElementById('profile-popup');
        if (popup) popup.remove();

        popup = document.createElement('div');
        popup.id = 'profile-popup';
        popup.style.position = 'absolute';
        popup.style.top = '70px';
        popup.style.right = '40px';
        popup.style.background = '#fff';
        popup.style.border = '1px solid #44521e';
        popup.style.borderRadius = '8px';
        popup.style.boxShadow = '0 4px 16px rgba(0,0,0,0.12)';
        popup.style.padding = '20px 28px';
        popup.style.zIndex = '9999';
        popup.style.display = 'none';
        popup.style.minWidth = '220px';
        popup.style.color = '#222';
        popup.innerHTML = `
            <div style="margin-bottom:14px;">
                <strong style="color:#222;">Email:</strong><br>
                <span style="color:#222;">${email}</span>
            </div>
            <div style="margin-bottom:14px;">
                <strong style="color:#222;">Nick Minecraft:</strong><br>
                <span style="color:#222;">${minecraft_nick}</span>
            </div>
            <button id="profile-stats-btn" style="background:#44521e;color:#fff;border:none;padding:8px 18px;border-radius:5px;cursor:pointer;font-size:15px;">Stats</button>
        `;
        document.body.appendChild(popup);

        popup.querySelector('#profile-stats-btn').onclick = function() {
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

        btnProfile.addEventListener('click', function(e) {
            e.preventDefault();
            popup.style.display = popup.style.display === 'block' ? 'none' : 'block';
        });

        document.addEventListener('click', function(e) {
            if (!btnProfile.contains(e.target) && !popup.contains(e.target)) {
                popup.style.display = 'none';
            }
        });
    }

    window.addEventListener('DOMContentLoaded', setupProfilePopup);
    window.addEventListener('storage', setupProfilePopup);
})();
