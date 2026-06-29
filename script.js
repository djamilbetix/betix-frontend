// ============================================================
// ===== CHARGEMENT RAPIDE - AFFICHAGE IMMÉDIAT =====
// ============================================================

document.addEventListener('DOMContentLoaded', function() {
    console.log("🚀 Betix chargé !");
    var loader = document.getElementById('loader');
    var main = document.getElementById('main-content');
    if (loader) { loader.style.display = 'none'; }
    if (main) { main.style.display = 'block'; }
});

// ============================================================
// ===== SUPABASE CONFIGURATION =====
// ============================================================

const SUPABASE_URL = "https://tycebwzgsujiazgopkri.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_UtFqjm07EZwJ9k5quAFYuA_n5vsEeGY";

const supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
console.log("✅ Supabase initialized");

// ============================================================
// ===== CONNEXION PI + MODE DEMO =====
// ============================================================

// Fonction principale de connexion (Pi + Mode démo)
async function connectToPi() {
    console.log("🔵 Connexion...");
    
    // Vérifier le SDK Pi
    var piAvailable = (typeof Pi !== 'undefined');
    console.log("📡 Pi SDK disponible:", piAvailable);
    
    // Si Pi n'est pas disponible, passer directement en mode démo
    if (!piAvailable) {
        console.log("⚠️ Pi SDK non disponible → Mode démo");
        return activateDemoMode();
    }

    try {
        // Initialiser Pi
        Pi.init({ version: "2.0", sandbox: true });
        console.log("✅ Pi initialisé");
        
        // Authentifier
        const auth = await Pi.authenticate(['username', 'payments'], function(payment) {
            console.log("💰 Paiement:", payment);
        });
        
        if (auth && auth.user) {
            console.log("✅ Pi connecté:", auth.user.username);
            
            // Sauvegarder l'utilisateur Pi
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
        
        // Si l'authentification échoue → Mode démo
        console.log("⚠️ Authentification Pi échouée → Mode démo");
        return activateDemoMode();
        
    } catch (error) {
        console.error("❌ Erreur Pi:", error);
        // En cas d'erreur → Mode démo
        return activateDemoMode();
    }
}

// Mode démo (utilisé en secours)
function activateDemoMode() {
    console.log("🔄 Activation du mode démo");
    
    // Vérifier si un utilisateur existe déjà en localStorage
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
    
    // Créer un utilisateur démo
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
    
    // Nom
    var nameEl = document.getElementById('sidebarName');
    if (nameEl) nameEl.textContent = user.username;
    
    // Wallet
    var walletEl = document.getElementById('sidebarWallet');
    if (walletEl) walletEl.textContent = user.wallet ? user.wallet.substring(0, 15) + '...' : 'Not connected';
    
    // Avatar
    if (user.avatar_url) {
        var img = document.getElementById('sidebarAvatarImage');
        if (img) {
            img.src = user.avatar_url;
            img.style.display = 'block';
        }
        var text = document.getElementById('sidebarAvatarText');
        if (text) text.style.display = 'none';
    }
    
    // Bouton Connect/Disconnect
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
    
    // Profil
    var profileName = document.getElementById('profileNameDisplay');
    if (profileName) profileName.textContent = user.username;
    
    var profileWallet = document.getElementById('profileWalletDisplay');
    if (profileWallet) profileWallet.textContent = user.wallet || 'Not connected';
}

// ============================================================
// ===== DÉCONNEXION =====
// ============================================================

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
// ===== INITIALISATION =====
// ============================================================

document.addEventListener('DOMContentLoaded', function() {
    console.log("🚀 Betix prêt !");
    
    // Restaurer la session
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
    
    // Si pas d'utilisateur, tenter la connexion Pi ou mode démo
    if (!window.currentUser) {
        // Attendre un peu que le SDK Pi se charge
        setTimeout(function() {
            connectToPi();
        }, 1000);
    }
    
    // Bouton Connect Pi
    var btn = document.getElementById('sidebarWalletBtn');
    if (btn) {
        btn.onclick = function() {
            if (window.currentUser) {
                disconnectPi();
            } else {
                connectToPi();
            }
        };
    }
    
    // Initialiser les composants
    if (typeof loadEventsFromSupabase === 'function') loadEventsFromSupabase();
    if (typeof renderEventsByCategory === 'function') renderEventsByCategory();
    if (typeof initHeroSlider === 'function') initHeroSlider();
    if (typeof initChat === 'function') initChat();
    if (typeof initFilters === 'function') initFilters();
    if (typeof initCountrySelectors === 'function') initCountrySelectors();
    
    console.log("✅ Betix prêt !");
});

// ============================================================
// ===== FONCTIONS DE SAUVEGARDE (NÉCESSAIRES) =====
// ============================================================

function saveEvents() { 
    localStorage.setItem('betix_events', JSON.stringify(events || []));
    syncEventsToSupabase();
}

function saveTickets() { 
    localStorage.setItem('betix_tickets', JSON.stringify(tickets || []));
    syncTicketsToSupabase();
}

function saveUser() { 
    localStorage.setItem('betix_user', JSON.stringify(currentUser || {}));
    saveUserToSupabase();
}

function saveNotifications() { 
    localStorage.setItem('betix_notifications', JSON.stringify(notifications || []));
    syncNotificationsToSupabase();
}

function saveChatMessages() {
    localStorage.setItem('betix_chat_messages', JSON.stringify(chatMessages || []));
    syncChatToSupabase();
}

function saveRatings() {
    localStorage.setItem('betix_ratings', JSON.stringify(ratings || []));
    syncRatingsToSupabase();
}

// ============================================================
// ===== SYNC AVEC SUPABASE =====
// ============================================================

async function saveUserToSupabase() {
    if (!window.currentUser && !currentUser?.wallet) return;
    try {
        var userData = {
            wallet: currentUser?.wallet || window.currentUser?.wallet,
            name: currentUser?.name || window.currentUser?.username || 'Guest',
            ticketCount: tickets?.length || 0,
            lastSeen: new Date().toLocaleString(),
            profilePhoto: currentUser?.profilePhoto || window.currentUser?.avatar_url || null,
            loyaltyPoints: currentUser?.loyaltyPoints || 0,
            memberSince: currentUser?.memberSince || '2026'
        };
        await supabaseClient
            .from('users')
            .upsert(userData, { onConflict: 'wallet' });
        console.log('✅ User saved to Supabase');
    } catch (error) { console.error('Error saving user:', error); }
}

async function syncEventsToSupabase() {
    try {
        if (!events || events.length === 0) return;
        await supabaseClient.from('events').delete().neq('id', '');
        await supabaseClient.from('events').insert(events);
        console.log('✅ Events synced');
    } catch (error) { console.error('Error syncing events:', error); }
}

async function syncTicketsToSupabase() {
    try {
        if (!tickets || tickets.length === 0) return;
        for (const ticket of tickets) {
            await supabaseClient.from('tickets').upsert(ticket, { onConflict: 'id' });
        }
        console.log('✅ Tickets synced');
    } catch (error) { console.error('Error syncing tickets:', error); }
}

async function syncNotificationsToSupabase() {
    try {
        if (!notifications || notifications.length === 0) return;
        for (const notif of notifications) {
            await supabaseClient.from('notifications').upsert(notif, { onConflict: 'id' });
        }
        console.log('✅ Notifications synced');
    } catch (error) { console.error('Error syncing notifications:', error); }
}

async function syncChatToSupabase() {
    try {
        if (!chatMessages || chatMessages.length === 0) return;
        for (const msg of chatMessages) {
            await supabaseClient.from('chat_messages').upsert(msg, { onConflict: 'id' });
        }
        console.log('✅ Chat synced');
    } catch (error) { console.error('Error syncing chat:', error); }
}

async function syncRatingsToSupabase() {
    try {
        if (!ratings || ratings.length === 0) return;
        for (const rating of ratings) {
            await supabaseClient.from('ratings').upsert(rating, { onConflict: 'id' });
        }
        console.log('✅ Ratings synced');
    } catch (error) { console.error('Error syncing ratings:', error); }
}

// ============================================================
// ===== FONCTIONS SUPABASE =====
// ============================================================

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

async function loadTicketsFromSupabase() {
    try {
        const { data } = await supabaseClient.from('tickets').select('*').order('purchaseDate', { ascending: false });
        if (data && data.length > 0) {
            window.tickets = data;
            localStorage.setItem('betix_tickets', JSON.stringify(data));
            renderTickets();
            renderHistory();
            console.log('🎫 Tickets loaded:', data.length);
        }
    } catch (error) { console.error('Error loading tickets:', error); }
}

// ============================================================
// ===== FONCTIONS DE RENDU (MINIMALES) =====
// ============================================================

function renderEventsByCategory() {
    var container = document.getElementById('eventsByCategory');
    if (!container) return;
    var eventsData = window.events || [];
    if (eventsData.length === 0) {
        container.innerHTML = '<p style="text-align:center;padding:2rem;color:var(--gray);">Aucun événement trouvé</p>';
        return;
    }
    container.innerHTML = eventsData.map(function(e) {
        return '<div class="event-card">' +
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
                    '<button class="buy-btn" onclick="alert(\'Acheter: ' + e.title + '\')">Acheter</button>' +
                '</div>' +
            '</div>' +
        '</div>';
    }).join('');
}

function renderTickets() {
    var container = document.getElementById('ticketsList');
    if (!container) return;
    container.innerHTML = '<p style="text-align:center;padding:2rem;">Aucun billet actif</p>';
}

function renderHistory() {
    var container = document.getElementById('historyList');
    if (!container) return;
    container.innerHTML = '<p style="text-align:center;padding:2rem;">Aucun historique</p>';
}

function initHeroSlider() { console.log('🎠 Hero slider initialisé'); }
function initChat() { console.log('💬 Chat initialisé'); }
function initFilters() { console.log('🔍 Filtres initialisés'); }
function initCountrySelectors() { console.log('🌍 Pays initialisés'); }

// ============================================================
// ===== FONCTIONS DE NAVIGATION =====
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
}

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

function closeSidebar() {
    var s = document.getElementById('sidebar');
    if (s) s.classList.remove('open');
    var o = document.getElementById('overlay');
    if (o) o.classList.remove('active');
}

function openSidebar() {
    var s = document.getElementById('sidebar');
    if (s) s.classList.add('open');
    var o = document.getElementById('overlay');
    if (o) o.classList.add('active');
}

// ============================================================
// ===== GLOBAL VARIABLES =====
// ============================================================

var events = [];
var tickets = [];
var currentUser = null;
var notifications = [];
var chatMessages = [];
var ratings = [];
var uploadedImages = {};
var pageHistory = ['home'];
var adminPassword = 'Betix@2026#';

console.log('✅ Betix chargé !');
console.log('📡 Mode: Connexion Pi ou Mode démo automatique');