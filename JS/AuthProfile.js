(function() {
    function getJwtPayload(token) {
        try {
            const payload = token.split('.')[1];
            return JSON.parse(atob(payload.replace(/-/g, '+').replace(/_/g, '/')));
        } catch (e) {
            return {};
        }
    }

    function createProfileButton(email, minecraft_nick) {
        // Remove existing profile popup if any
        const oldPopup = document.getElementById('profile-popup');
        if (oldPopup) oldPopup.remove();

        const btnProfile = document.createElement('a');
        btnProfile.className = 'nav-btn btn-profile flex';
        btnProfile.style.cursor = 'pointer';
        btnProfile.innerHTML = `<img src="../Images/login.webp" alt="Icona Profilo" width="20px" height="20px"><span>Profilo</span>`;

        // Popup
        const popup = document.createElement('div');
        popup.id = 'profile-popup';
        popup.style.position = 'absolute';
        popup.style.top = '70px';
        popup.style.right = '40px';
        popup.style.background = '#fff';
        popup.style.border = '2px solid #44521e';
        popup.style.borderRadius = '8px';
        popup.style.boxShadow = '0 4px 16px rgba(0,0,0,0.15)';
        popup.style.padding = '20px';
        popup.style.zIndex = '9999';
        popup.style.display = 'none';
        popup.style.minWidth = '220px';
        popup.innerHTML = `
            <div style="margin-bottom:10px;">
                <strong>Email:</strong><br>
                <span>${email}</span>
            </div>
            <div style="margin-bottom:10px;">
                <strong>Minecraft Nick:</strong><br>
                <span>${minecraft_nick}</span>
            </div>
            <button id="profile-stats-btn" style="background:#44521e;color:#fff;border:none;padding:8px 16px;border-radius:5px;cursor:pointer;">Stats</button>
        `;

        document.body.appendChild(popup);

        btnProfile.addEventListener('click', function(e) {
            e.preventDefault();
            popup.style.display = popup.style.display === 'block' ? 'none' : 'block';
        });

        document.addEventListener('click', function(e) {
            if (!btnProfile.contains(e.target) && !popup.contains(e.target)) {
                popup.style.display = 'none';
            }
        });

        popup.querySelector('#profile-stats-btn').onclick = function() {
            window.open('https://stats.severicraft.it', '_blank');
        };

        return btnProfile;
    }

    function setupProfileUI() {
        const token = localStorage.getItem('jwt_token');
        const loginBtn = document.querySelector('.btn-login');
        if (!loginBtn) return;

        if (token) {
            // Hide login button
            loginBtn.style.display = 'none';
            const payload = getJwtPayload(token);
            const email = payload.email || '';
            const minecraft_nick = payload.minecraft_nick || '';
            // Insert profile button
            const parent = loginBtn.parentNode;
            const profileBtn = createProfileButton(email, minecraft_nick);
            parent.appendChild(profileBtn);
        } else {
            loginBtn.style.display = '';
            // Remove profile button if exists
            const profileBtn = document.querySelector('.btn-profile');
            if (profileBtn) profileBtn.remove();
            const popup = document.getElementById('profile-popup');
            if (popup) popup.remove();
        }
    }

    window.addEventListener('DOMContentLoaded', setupProfileUI);
    window.addEventListener('storage', setupProfileUI); // update on token change
})();
