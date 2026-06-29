// ============================================================
// ===== CHARGEMENT RAPIDE =====
// ============================================================

document.addEventListener('DOMContentLoaded', function() {
    console.log("🚀 Betix chargé !");
    
    // Cacher le loader
    var loader = document.getElementById('loader');
    var main = document.getElementById('main-content');
    if (loader) loader.style.display = 'none';
    if (main) main.style.display = 'block';
    
    // ============================================================
    // ===== MENU HAMBURGER (3 BARRES) =====
    // ============================================================
    var menuBtn = document.getElementById('menuBtn');
    var sidebar = document.getElementById('sidebar');
    var overlay = document.getElementById('overlay');
    var closeBtn = document.getElementById('closeSidebarBtn');
    
    if (menuBtn) {
        menuBtn.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            console.log("🖱️ Menu cliqué");
            if (sidebar) sidebar.classList.toggle('open');
            if (overlay) overlay.classList.toggle('active');
        });
    }
    
    if (closeBtn) {
        closeBtn.addEventListener('click', function() {
            if (sidebar) sidebar.classList.remove('open');
            if (overlay) overlay.classList.remove('active');
        });
    }
    
    if (overlay) {
        overlay.addEventListener('click', function() {
            if (sidebar) sidebar.classList.remove('open');
            if (overlay) overlay.classList.remove('active');
        });
    }
    
    // ============================================================
    // ===== BOUTON CONNEXION PI =====
    // ============================================================
    var connectBtn = document.getElementById('sidebarWalletBtn');
    if (connectBtn) {
        connectBtn.addEventListener('click', function(e) {
            e.preventDefault();
            console.log("🖱️ Connect Pi cliqué");
            if (window.currentUser) {
                if (confirm('Voulez-vous vous déconnecter ?')) {
                    disconnectPi();
                }
            } else {
                connectToPi();
            }
        });
    }
    
    // ============================================================
    // ===== SIDEBAR ITEMS =====
    // ============================================================
    var sidebarItems = document.querySelectorAll('.sidebar-item');
    sidebarItems.forEach(function(item) {
        item.addEventListener('click', function() {
            var page = this.dataset.page;
            if (page) showPage(page);
            if (sidebar) sidebar.classList.remove('open');
            if (overlay) overlay.classList.remove('active');
        });
    });
    
    // ============================================================
    // ===== RESTAURER LA SESSION =====
    // ============================================================
    var savedUser = localStorage.getItem('betix_user');
    if (savedUser) {
        try {
            var user = JSON.parse(savedUser);
            window.currentUser = user;
            updateUI(user);
            console.log("🔄 Session restaurée:", user.username);
        } catch(e) {
            localStorage.removeItem('betix_user');
        }
    }
    
    // Si pas d'utilisateur, tenter la connexion
    if (!window.currentUser) {
        setTimeout(function() {
            connectToPi();
        }, 1000);
    }
    
    // Charger les événements
    loadEventsFromSupabase();
    
    console.log("✅ Betix prêt !");
});

// ============================================================
// ===== FERMER LE SIDEBAR =====
// ============================================================

function closeSidebar() {
    var sidebar = document.getElementById('sidebar');
    var overlay = document.getElementById('overlay');
    if (sidebar) sidebar.classList.remove('open');
    if (overlay) overlay.classList.remove('active');
}

function openSidebar() {
    var sidebar = document.getElementById('sidebar');
    var overlay = document.getElementById('overlay');
    if (sidebar) sidebar.classList.add('open');
    if (overlay) overlay.classList.add('active');
}

// ============================================================
// ===== CONNEXION PI + MODE DEMO =====
// ============================================================

async function connectToPi() {
    console.log("🔵 Connexion...");
    
    var piAvailable = (typeof Pi !== 'undefined');
    console.log("📡 Pi SDK disponible:", piAvailable);
    
    if (!piAvailable) {
        console.log("⚠️ Pi SDK non disponible → Mode démo");
        return activateDemoMode();
    }

    try {
        Pi.init({ version: "2.0", sandbox: true });
        console.log("✅ Pi initialisé");
        
        const auth = await Pi.authenticate(['username', 'payments'], function(payment) {
            console.log("💰 Paiement:", payment);
        });
        
        if (auth && auth.user) {
            console.log("✅ Pi connecté:", auth.user.username);
            
            const user = {
                pi_uid: auth.user.uid,
                username: auth.user.username,
                wallet: auth.user.wallet_address || null
            };
            
            const { data: savedUser } = await supabaseClient
                .from('users')
                .upsert({
                    pi_uid: user.pi_uid,
                    username: user.username,
                    wallet: user.wallet,
                    last_login: new Date().toISOString()
                })
                .select()
                .single();
            
            if (savedUser) {
                window.currentUser = savedUser;
                localStorage.setItem('betix_user', JSON.stringify(savedUser));
                updateUI(savedUser);
                alert('✅ Bienvenue ' + savedUser.username + ' !');
                return savedUser;
            }
        }
        
        console.log("⚠️ Authentification Pi échouée → Mode démo");
        return activateDemoMode();
        
    } catch (error) {
        console.error("❌ Erreur Pi:", error);
        return activateDemoMode();
    }
}

function activateDemoMode() {
    console.log("🔄 Activation du mode démo");
    
    var savedUser = localStorage.getItem('betix_user');
    if (savedUser) {
        try {
            var user = JSON.parse(savedUser);
            if (user && user.pi_uid) {
                window.currentUser = user;
                updateUI(user);
                console.log("🔄 Session restaurée:", user.username);
                return user;
            }
        } catch(e) {}
    }
    
    const demoUser = {
        pi_uid: 'demo_' + Date.now(),
        username: 'Pionnier_Demo',
        wallet: 'demo_wallet',
        avatar_url: null
    };
    
    window.currentUser = demoUser;
    localStorage.setItem('betix_user', JSON.stringify(demoUser));
    updateUI(demoUser);
    console.log("✅ Mode démo activé:", demoUser.username);
    return demoUser;
}

// ============================================================
// ===== METTRE À JOUR L'INTERFACE =====
// ============================================================

function updateUI(user) {
    if (!user) return;
    
    var nameEl = document.getElementById('sidebarName');
    if (nameEl) nameEl.textContent = user.username;
    
    var walletEl = document.getElementById('sidebarWallet');
    if (walletEl) walletEl.textContent = user.wallet ? user.wallet.substring(0, 15) + '...' : 'Not connected';
    
    if (user.avatar_url) {
        var img = document.getElementById('sidebarAvatarImage');
        if (img) {
            img.src = user.avatar_url;
            img.style.display = 'block';
        }
        var text = document.getElementById('sidebarAvatarText');
        if (text) text.style.display = 'none';
    }
    
    var btn = document.getElementById('sidebarWalletBtn');
    if (btn) {
        btn.textContent = 'Disconnect';
        btn.classList.add('disconnect');
        btn.onclick = function() {
            if (confirm('Voulez-vous vous déconnecter ?')) {
                window.currentUser = null;
                localStorage.removeItem('betix_user');
                document.getElementById('sidebarName').textContent = 'Guest';
                document.getElementById('sidebarWallet').textContent = 'Not connected';
                btn.textContent = 'Connect Pi';
                btn.classList.remove('disconnect');
                btn.onclick = function() { connectToPi(); };
                alert('Déconnecté');
            }
        };
    }
    
    var profileName = document.getElementById('profileNameDisplay');
    if (profileName) profileName.textContent = user.username;
    
    var profileWallet = document.getElementById('profileWalletDisplay');
    if (profileWallet) profileWallet.textContent = user.wallet || 'Not connected';
}

function disconnectPi() {
    if (confirm('Voulez-vous vous déconnecter ?')) {
        window.currentUser = null;
        localStorage.removeItem('betix_user');
        document.getElementById('sidebarName').textContent = 'Guest';
        document.getElementById('sidebarWallet').textContent = 'Not connected';
        var btn = document.getElementById('sidebarWalletBtn');
        if (btn) {
            btn.textContent = 'Connect Pi';
            btn.classList.remove('disconnect');
            btn.onclick = function() { connectToPi(); };
        }
        alert('Déconnecté');
    }
}

// ============================================================
// ===== SUPABASE CONFIGURATION =====
// ============================================================

const SUPABASE_URL = "https://tycebwzgsujiazgopkri.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_UtFqjm07EZwJ9k5quAFYuA_n5vsEeGY";

const supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
console.log("✅ Supabase initialized");

// ============================================================
// ===== NAVIGATION =====
// ============================================================

function showPage(pageName) {
    var pages = ['homePage', 'createPage', 'ticketsPage', 'historyPage', 'profilePage', 'whitepaperPage', 'faqPage', 'settingsPage', 'ratingsPage', 'adminPage', 'myeventsPage', 'notificationsPage'];
    for (var i = 0; i < pages.length; i++) {
        var el = document.getElementById(pages[i]);
        if (el) { el.style.display = 'none'; }
    }
    if (pageName === 'home') {
        document.getElementById('homePage').style.display = 'block';
        renderEventsByCategory();
    } else {
        var target = document.getElementById(pageName + 'Page');
        if (target) { target.style.display = 'block'; }
    }
    window.scrollTo(0, 0);
    closeSidebar();
}

function goToMyEvents() { showPage('myevents'); }
function goToTickets() { showPage('tickets'); }
function goToHistory() { showPage('history'); }
function goToRatings() { showPage('ratings'); }

// ============================================================
// ===== FONCTIONS SUPABASE =====
// ============================================================

var events = [];
var tickets = [];
var currentUser = null;

async function loadEventsFromSupabase() {
    try {
        const { data } = await supabaseClient.from('events').select('*').order('date', { ascending: true });
        if (data && data.length > 0) {
            window.events = data;
            localStorage.setItem('betix_events', JSON.stringify(data));
            renderEventsByCategory();
            console.log('📅 Events loaded:', data.length);
        }
    } catch (error) { console.error('Error loading events:', error); }
}

function renderEventsByCategory() {
    var container = document.getElementById('eventsByCategory');
    if (!container) return;
    var eventsData = window.events || [];
    if (eventsData.length === 0) {
        container.innerHTML = '<p style="text-align:center;padding:2rem;color:var(--gray);">Aucun événement trouvé</p>';
        return;
    }
    container.innerHTML = eventsData.map(function(e) {
        return '<div class="event-card" onclick="openEventDetails(\'' + e.id + '\')">' +
            '<div class="event-card-banner">' +
                '<img src="' + (e.image_url || 'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?w=600&h=400&fit=crop') + '" alt="' + e.title + '">' +
                '<span class="event-card-badge">' + (e.category || 'Événement') + '</span>' +
            '</div>' +
            '<div class="event-card-body">' +
                '<div class="event-card-title">' + e.title + '</div>' +
                '<div class="event-card-details">' +
                    '<div class="detail-item">📅 ' + new Date(e.event_date || e.date).toLocaleDateString() + '</div>' +
                    '<div class="detail-item">📍 ' + (e.location || 'En ligne') + '</div>' +
                '</div>' +
                '<div class="event-card-footer">' +
                    '<div><span class="event-card-price">' + (e.price || 0) + ' Pi</span></div>' +
                    '<button class="buy-btn" onclick="event.stopPropagation(); openQuantityPopup(\'' + e.id + '\')">Acheter</button>' +
                '</div>' +
            '</div>' +
        '</div>';
    }).join('');
}

// ============================================================
// ===== FONCTIONS DE NAVIGATION GÉNÉRALES =====
// ============================================================

function handleLogoClick() {
    var clicks = parseInt(localStorage.getItem('logo_clicks') || 0) + 1;
    localStorage.setItem('logo_clicks', clicks);
    if (clicks >= 5) {
        var password = prompt('Code admin:');
        if (password === 'Betix@2026#') {
            var adminBtn = document.getElementById('adminMenuItem');
            if (adminBtn) adminBtn.style.display = 'block';
            alert('🔓 Admin activé');
        }
        localStorage.setItem('logo_clicks', '0');
    }
    setTimeout(function() { localStorage.setItem('logo_clicks', '0'); }, 3000);
}

function changeLanguage(lang) {
    localStorage.setItem('betix_language', lang);
    location.reload();
}

function showLegal(type) {
    var modal = document.getElementById('legalModal');
    var content = document.getElementById('modalContent');
    if (modal) modal.classList.add('show');
    if (content) content.innerHTML = '<h2>Informations légales</h2><p>Contenu en cours...</p>';
}

function filterByCountry(country) {
    console.log('Filtre pays:', country);
}

function openEventDetails(eventId) {
    alert('Détails de l\'événement: ' + eventId);
}

function openQuantityPopup(eventId) {
    alert('Achat de billet pour: ' + eventId);
}

// ============================================================
// ===== ADMIN =====
// ============================================================

function adminLogout() {
    localStorage.removeItem('betix_admin_password');
    var adminBtn = document.getElementById('adminMenuItem');
    if (adminBtn) adminBtn.style.display = 'none';
    alert('Admin déconnecté');
}

function adminChangePassword() {
    var newPassword = document.getElementById('adminNewPassword').value;
    var confirmPassword = document.getElementById('adminConfirmPassword').value;
    if (newPassword && newPassword === confirmPassword) {
        localStorage.setItem('betix_admin_password', newPassword);
        alert('Mot de passe changé');
    } else {
        alert('Les mots de passe ne correspondent pas');
    }
}

// ============================================================
// ===== LOGS =====
// ============================================================

console.log('✅ Betix chargé avec succès !');
console.log('📡 Mode: Connexion Pi ou Mode démo automatique');