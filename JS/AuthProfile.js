(function() {
    function getJwtPayload(token) {
        try {
            const payload = token.split('.')[1];
            // Base64 decode (handle padding)
            const base64 = payload.replace(/-/g, '+').replace(/_/g, '/');
            const json = decodeURIComponent(atob(base64).split('').map(function(c) {
                return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
            }).join(''));
            return JSON.parse(json);
        } catch (e) {
            console.error('Errore nella decodifica JWT:', e);
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
        popup.style.borderRadius = '10px';
        popup.style.boxShadow = '0 8px 32px rgba(0,0,0,0.18)';
        popup.style.padding = '24px 28px';
        popup.style.zIndex = '9999';
        popup.style.display = 'none';
        popup.style.minWidth = '240px';
        popup.style.color = '#222';
        popup.innerHTML = `
            <div style="margin-bottom:16px;">
                <strong style="color:#222;">Email:</strong><br>
                <span style="color:#222;">${email}</span>
            </div>
            <div style="margin-bottom:16px;">
                <strong style="color:#222;">Minecraft Nick:</strong><br>
                <span style="color:#222;">${minecraft_nick}</span>
            </div>
            <div style="position: relative; min-height: 48px;">
                <button id="profile-stats-btn"
                    style="position: absolute; left: 0; bottom: 0; background:#44521e;color:#fff;border:none;padding:10px 22px;border-radius:6px;cursor:pointer;font-size:16px;">
                    Stats
                </button>
                <button id="profile-logout-btn"
                    style="position: absolute; right: 0; bottom: 0; background:#d32f2f;color:#fff;border:none;padding:10px 22px;border-radius:6px;cursor:pointer;font-size:16px;">
                    Logout
                </button>
            </div>
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

        popup.querySelector('#profile-logout-btn').onclick = function() {
            localStorage.removeItem('jwt_token');
            popup.style.display = 'none';
            setupProfileUI();
        };

        return btnProfile;
    }

    function setupProfileUI() {
        const token = localStorage.getItem('jwt_token');
        const loginBtn = document.querySelector('.btn-login');
        const mobileLoginBtn = document.getElementById('mobile-login-btn');
        const mobileProfileBtn = document.getElementById('mobile-profile-btn');

        if (!loginBtn) return;

        if (token) {
            // Nascondi il pulsante di login
            loginBtn.style.display = 'none';
            if (mobileLoginBtn) mobileLoginBtn.style.display = 'none';
            if (mobileProfileBtn) mobileProfileBtn.style.display = 'inline-block';

            const payload = getJwtPayload(token);
            const email = payload.email || '';
            const minecraft_nick = payload.minecraft_nick || '';

            // Controlla se il pulsante Profilo esiste già
            if (!document.querySelector('.btn-profile')) {
                const parent = loginBtn.parentNode;
                const profileBtn = createProfileButton(email, minecraft_nick);
                parent.appendChild(profileBtn);
            }

            if (mobileProfileBtn) {
                mobileProfileBtn.onclick = function(e) {
                    e.preventDefault();
                    const popup = document.getElementById('profile-popup');
                    if (popup) {
                        popup.style.display = popup.style.display === 'block' ? 'none' : 'block';
                    }
                };
            }

        } else {
            loginBtn.style.display = '';
            if (mobileLoginBtn) mobileLoginBtn.style.display = 'inline-block';
            if (mobileProfileBtn) mobileProfileBtn.style.display = 'none';
            // Rimuovi il pulsante Profilo se esiste
            const profileBtn = document.querySelector('.btn-profile');
            if (profileBtn) profileBtn.remove();
            const popup = document.getElementById('profile-popup');
            if (popup) popup.remove();
        }
    }

    window.addEventListener('DOMContentLoaded', setupProfileUI);
    window.addEventListener('storage', setupProfileUI); // update on token change
})();
