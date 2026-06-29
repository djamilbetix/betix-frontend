// ============================================================
// ===== SUPABASE CONFIGURATION =====
// ============================================================

const SUPABASE_URL = "https://tycebwzgsujiazgopkri.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_UtFqjm07EZwJ9k5quAFYuA_n5vsEeGY";

const supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true
    },
    db: {
        schema: 'public'
    }
});

console.log("Supabase initialized successfully");

// ============================================================
// ===== FONCTION PAIEMENT PI (OBLIGATOIRE) =====
// ============================================================

async function onIncompletePaymentFound(payment) {
    console.log("Paiement incomplet trouve:", payment);
    return payment;
}

// ============================================================
// ===== VÉRIFICATION DU SDK PI =====
// ============================================================

function checkPiSDK() {
    if (typeof Pi !== 'undefined') {
        console.log('Pi SDK charge');
        return true;
    } else {
        console.warn('Pi SDK non charge, tentative de rechargement...');
        var script = document.createElement('script');
        script.src = 'https://sdk.minepi.com/pi-sdk.js';
        script.onload = function() {
            console.log('Pi SDK recharge avec succes');
            if (typeof Pi !== 'undefined') {
                Pi.init({ version: "2.0", sandbox: true });
            }
        };
        document.head.appendChild(script);
        return false;
    }
}

checkPiSDK();

// ============================================================
// ===== CONNEXION PI =====
// ============================================================

async function connectToPi() {
    console.log("Tentative de connexion Pi...");
    
    try {
        if (typeof Pi === 'undefined') {
            console.error("Pi SDK non disponible");
            if (confirm("Pi SDK non charge. Utiliser le mode demo ?")) {
                const demoUser = {
                    uid: 'demo_user_' + Date.now(),
                    username: 'Pionnier_Demo',
                    wallet_address: 'demo_wallet'
                };
                
                const user = await saveOrGetPiUser({
                    pi_uid: demoUser.uid,
                    username: demoUser.username,
                    wallet: demoUser.wallet_address
                });
                
                if (user) {
                    window.currentUser = user;
                    localStorage.setItem('betix_user', JSON.stringify(user));
                    updateUIAfterLogin(user);
                    addNotification('Bienvenue ' + user.username + '! (Mode demo)', 'info');
                    alert('Connexion en mode demo reussie !');
                    return user;
                }
            }
            return;
        }

        try {
            Pi.init({ version: "2.0", sandbox: true });
            console.log("Pi SDK initialise");
        } catch (e) {
            console.warn("Pi deja initialise ou erreur:", e);
        }

        console.log("Demande d'authentification Pi...");
        
        const auth = await Pi.authenticate(
            ['username', 'payments'], 
            onIncompletePaymentFound
        );
        
        console.log("Resultat authentification:", auth);
        
        if (auth && auth.user) {
            console.log("Authentification Pi reussie:", auth.user);
            
            const user = await saveOrGetPiUser({
                pi_uid: auth.user.uid,
                username: auth.user.username,
                wallet: auth.user.wallet_address || null
            });

            if (user) {
                window.currentUser = user;
                localStorage.setItem('betix_user', JSON.stringify(user));
                
                updateUIAfterLogin(user);
                addNotification('Bienvenue ' + user.username + '!', 'info');
                
                console.log("Utilisateur connecte:", user.username);
                alert('Connexion reussie ! Bienvenue ' + user.username + ' !');
                return user;
            }
        } else {
            console.warn("Authentification annulee ou echouee");
            alert("Authentification annulee. Veuillez reessayer.");
        }
        
    } catch (error) {
        console.error("Erreur connexion Pi:", error);
        alert("Erreur: " + (error.message || "Veuillez reessayer"));
    }
}

async function saveOrGetPiUser(piUser) {
    try {
        console.log("Recherche utilisateur:", piUser.pi_uid);
        
        const { data: existing, error } = await supabaseClient
            .from('users')
            .select('*')
            .eq('pi_uid', piUser.pi_uid)
            .maybeSingle();

        if (error) {
            console.error("Erreur recherche:", error);
            return null;
        }

        if (existing) {
            await supabaseClient
                .from('users')
                .update({ last_login: new Date().toISOString() })
                .eq('pi_uid', piUser.pi_uid);
            
            console.log("Utilisateur existant:", existing.username);
            return existing;
        }

        const { data: newUser, error: insertError } = await supabaseClient
            .from('users')
            .insert({
                pi_uid: piUser.pi_uid,
                username: piUser.username,
                wallet: piUser.wallet,
                created_at: new Date().toISOString(),
                last_login: new Date().toISOString()
            })
            .select()
            .single();

        if (insertError) {
            console.error("Erreur creation:", insertError);
            return null;
        }

        console.log("Nouvel utilisateur cree:", newUser.username);
        addNotification('Bienvenue ' + newUser.username + '! Votre profil a ete cree.', 'event');
        
        return newUser;

    } catch (error) {
        console.error("Erreur saveOrGetPiUser:", error);
        return null;
    }
}

function updateUIAfterLogin(user) {
    const nameEl = document.getElementById('sidebarName');
    if (nameEl) nameEl.textContent = user.username;

    const walletEl = document.getElementById('sidebarWallet');
    if (walletEl) walletEl.textContent = user.wallet ? user.wallet.substring(0, 15) + '...' : 'Not connected';

    if (user.avatar_url) {
        const img = document.getElementById('sidebarAvatarImage');
        if (img) {
            img.src = user.avatar_url;
            img.style.display = 'block';
        }
        const text = document.getElementById('sidebarAvatarText');
        if (text) text.style.display = 'none';
    }

    const btn = document.getElementById('sidebarWalletBtn');
    if (btn) {
        btn.textContent = 'Disconnect';
        btn.onclick = function() { disconnectPi(); };
        btn.classList.add('disconnect');
    }

    const profileBtn = document.getElementById('profileConnectBtnPage');
    if (profileBtn) {
        profileBtn.textContent = 'Disconnect';
        profileBtn.onclick = function() { disconnectPi(); };
    }

    updateProfilePage();
    updateAllProfileImages();
}

function disconnectPi() {
    if (confirm('Voulez-vous vous deconnecter ?')) {
        window.currentUser = null;
        localStorage.removeItem('betix_user');
        
        document.getElementById('sidebarName').textContent = 'Guest';
        document.getElementById('sidebarWallet').textContent = 'Not connected';
        
        const btn = document.getElementById('sidebarWalletBtn');
        if (btn) {
            btn.textContent = 'Connect Pi';
            btn.onclick = function() { connectToPi(); };
            btn.classList.remove('disconnect');
        }
        
        const profileBtn = document.getElementById('profileConnectBtnPage');
        if (profileBtn) {
            profileBtn.textContent = 'Connect Pi';
            profileBtn.onclick = function() { connectToPi(); };
        }
        
        updateAllProfileImages();
        alert('Deconnecte');
    }
}

// ============================================================
// ===== COMPRESSION D'IMAGES =====
// ============================================================

function compressImage(file, options) {
    return new Promise((resolve, reject) => {
        if (!file || !file.type.startsWith('image/')) {
            reject(new Error('Le fichier n\'est pas une image'));
            return;
        }

        const config = {
            maxWidth: options.maxWidth || 800,
            maxHeight: options.maxHeight || 800,
            quality: options.quality || 0.7,
            format: options.format || 'image/webp',
            maxSizeMB: options.maxSizeMB || 5
        };

        if (file.size / (1024 * 1024) < 0.2) {
            const reader = new FileReader();
            reader.onload = function(e) { resolve(e.target.result); };
            reader.onerror = function() { reject(new Error('Erreur de lecture du fichier')); };
            reader.readAsDataURL(file);
            return;
        }

        const reader = new FileReader();
        reader.onload = function(event) {
            const img = new Image();
            img.onload = function() {
                let width = img.width;
                let height = img.height;
                
                if (width > config.maxWidth || height > config.maxHeight) {
                    const ratio = Math.min(config.maxWidth / width, config.maxHeight / height);
                    width = Math.round(width * ratio);
                    height = Math.round(height * ratio);
                }
                
                const canvas = document.createElement('canvas');
                canvas.width = width;
                canvas.height = height;
                const ctx = canvas.getContext('2d');
                
                ctx.imageSmoothingEnabled = true;
                ctx.imageSmoothingQuality = 'high';
                ctx.drawImage(img, 0, 0, width, height);
                
                let format = config.format;
                if (format === 'image/webp') {
                    const testCanvas = document.createElement('canvas');
                    testCanvas.width = 1;
                    testCanvas.height = 1;
                    const testData = testCanvas.toDataURL('image/webp');
                    if (!testData || testData.indexOf('image/webp') === -1) {
                        format = 'image/jpeg';
                    }
                }
                
                let compressedDataUrl = canvas.toDataURL(format, config.quality);
                
                const compressedSize = compressedDataUrl.length * 0.75 / (1024 * 1024);
                if (compressedSize > config.maxSizeMB && config.quality > 0.3) {
                    const newQuality = Math.max(0.3, config.quality - 0.2);
                    compressedDataUrl = canvas.toDataURL(format, newQuality);
                }
                
                resolve(compressedDataUrl);
            };
            img.onerror = function() { reject(new Error('Erreur de chargement de l\'image')); };
            img.src = event.target.result;
        };
        reader.onerror = function() { reject(new Error('Erreur de lecture du fichier')); };
        reader.readAsDataURL(file);
    });
}

async function compressProfilePhoto(file) {
    return await compressImage(file, {
        maxWidth: 300,
        maxHeight: 300,
        quality: 0.6,
        format: 'image/webp',
        maxSizeMB: 0.5
    });
}

async function compressEventImage(file) {
    return await compressImage(file, {
        maxWidth: 1200,
        maxHeight: 800,
        quality: 0.7,
        format: 'image/webp',
        maxSizeMB: 1.5
    });
}

// ============================================================
// ===== COUNTRY LIST =====
// ============================================================

var countriesList = [
    'All',
    'Afghanistan', 'Algeria', 'Angola', 'Argentina', 'Australia',
    'Austria', 'Belgium', 'Benin', 'Botswana', 'Brazil',
    'Burkina Faso', 'Burundi', 'Cameroon', 'Canada', 'Cape Verde',
    'Central African Republic', 'Chad', 'China', 'Comoros',
    'Congo', 'Cote d\'Ivoire', 'Denmark', 'Djibouti', 'Egypt',
    'Equatorial Guinea', 'Eritrea', 'Eswatini', 'Ethiopia',
    'France', 'Gabon', 'Gambia', 'Germany', 'Ghana', 'Guinea',
    'Guinea-Bissau', 'India', 'Indonesia', 'Iran', 'Italy',
    'Japan', 'Kenya', 'Lesotho', 'Liberia', 'Libya',
    'Madagascar', 'Malawi', 'Mali', 'Mauritania', 'Mauritius',
    'Mexico', 'Morocco', 'Mozambique', 'Namibia', 'Niger',
    'Nigeria', 'Portugal', 'RDC', 'Russia', 'Rwanda',
    'Sao Tome', 'Senegal', 'Seychelles', 'Sierra Leone',
    'Somalia', 'South Africa', 'South Sudan', 'Spain',
    'Sudan', 'Sweden', 'Switzerland', 'Tanzania', 'Togo',
    'Tunisia', 'Turkey', 'Uganda', 'Ukraine',
    'United Kingdom', 'United States', 'Zambia', 'Zimbabwe'
];

// ============================================================
// ===== GLOBAL VARIABLES =====
// ============================================================

var events = [];
var tickets = [];
var currentUser = { 
    name: 'Guest', 
    wallet: null, 
    memberSince: '2026', 
    loyaltyPoints: 0,
    profilePhoto: null
};
var currentFilter = 'All';
var currentCountryFilter = 'All';
var searchQuery = '';
var piUser = null;
var ratings = [];
var chatMessages = [];
var connectedUsers = [];
var notifications = [];
var adminCode = 'Betix@2026#';
var selectedRating = 0;
var lastActivity = localStorage.getItem('betix_last_activity') || Date.now();
var pageHistory = ['home'];
var logoClickCount = 0;
var uploadedImages = {};
var pendingEventData = null;

var adminSessionTimer = 1800;
var adminTimerInterval = null;
var adminLogs = [];
var adminPassword = localStorage.getItem('betix_admin_password') || 'Betix@2026#';

// ============================================================
// ===== HERO SLIDES =====
// ============================================================

var heroSlides = JSON.parse(localStorage.getItem('betix_hero_slides')) || [];

if (heroSlides.length === 0) {
    heroSlides = [
        {
            image: 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=1200&h=600&fit=crop',
            badge: 'Music Festival',
            title: 'Summer Music Festival 2026',
            description: '3 days of electrifying performances by top artists'
        },
        {
            image: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=1200&h=600&fit=crop',
            badge: 'Football',
            title: 'Champions League Final',
            description: 'The biggest football event of the year live'
        },
        {
            image: 'https://images.unsplash.com/photo-1505373877841-8d25f7d46678?w=1200&h=600&fit=crop',
            badge: 'Conference',
            title: 'Web3 Summit 2026',
            description: 'The future of decentralized technology unveiled'
        },
        {
            image: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=1200&h=600&fit=crop',
            badge: 'Cinema',
            title: 'International Film Festival',
            description: 'Premieres and exclusive screenings'
        },
        {
            image: 'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=1200&h=600&fit=crop',
            badge: 'Concert',
            title: 'World Tour Concert',
            description: 'An unforgettable night with global superstars'
        }
    ];
    localStorage.setItem('betix_hero_slides', JSON.stringify(heroSlides));
}

var BACKEND_URL = "https://betix-backend.onrender.com";

// ============================================================
// ===== EVENT IMAGES =====
// ============================================================

var eventImagesList = {
    Concert: 'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?w=600&h=400&fit=crop',
    Sport: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=600&h=400&fit=crop',
    Football: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=600&h=400&fit=crop',
    Conference: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=600&h=400&fit=crop',
    Training: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=600&h=400&fit=crop',
    Cinema: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=600&h=400&fit=crop',
    Festival: 'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=600&h=400&fit=crop',
    Theatre: 'https://images.unsplash.com/photo-1507676184212-d03ab07a01bf?w=600&h=400&fit=crop',
    Dance: 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=600&h=400&fit=crop',
    Exhibition: 'https://images.unsplash.com/photo-1531058020387-3be344556be6?w=600&h=400&fit=crop',
    Gala: 'https://images.unsplash.com/photo-1530023367847-a683933f4172?w=600&h=400&fit=crop',
    Seminar: 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=600&h=400&fit=crop'
};

var demoEvents = [
    { id: '1', title: 'Jazz Concert', category: 'Concert', country: 'France', date: '2026-07-15T20:00', location: 'Paris, Olympia', description: 'An exceptional jazz evening with international artists', conditions: 'Active Pi Network wallet\nPayment in Pi (indicated amount)\nPresent ticket at entrance\nRespect event rules', price: 0.0003, seatsTotal: 100, seatsLeft: 100, images: [eventImagesList.Concert], coverImage: eventImagesList.Concert, organizer: 'Demo', organizerName: 'Demo', createdAt: new Date().toISOString(), boosts: 0 },
    { id: '2', title: 'Football Match', category: 'Sport', country: 'France', date: '2026-07-20T18:00', location: 'Marseille', description: 'Friendly match between local teams', conditions: 'Active Pi Network wallet\nPayment in Pi (indicated amount)\nPresent ticket at entrance', price: 0.0003, seatsTotal: 500, seatsLeft: 500, images: [eventImagesList.Football], coverImage: eventImagesList.Football, organizer: 'Demo', organizerName: 'Demo', createdAt: new Date().toISOString(), boosts: 0 },
    { id: '3', title: 'Blockchain Conference', category: 'Conference', country: 'France', date: '2026-07-25T14:00', location: 'Lyon', description: 'Discover the future of blockchain and Web3', conditions: 'Active Pi Network wallet\nPayment in Pi (indicated amount)\nRegistration required', price: 0.0003, seatsTotal: 200, seatsLeft: 200, images: [eventImagesList.Conference], coverImage: eventImagesList.Conference, organizer: 'Demo', organizerName: 'Demo', createdAt: new Date().toISOString(), boosts: 0 }
];

// ============================================================
// ===== UTILITY FUNCTIONS =====
// ============================================================

function escapeHtml(str) { if (!str) return ''; return str.replace(/[&<>]/g, function(m) { if (m === '&') return '&amp;'; if (m === '<') return '&lt;'; if (m === '>') return '&gt;'; return m; }); }

function formatDate(dateStr) { var date = new Date(dateStr); return !isNaN(date.getTime()) ? date.toLocaleDateString('en-US') : 'Date to be defined'; }

function formatDateTime(dateStr) { var date = new Date(dateStr); return !isNaN(date.getTime()) ? date.toLocaleString('en-US') : 'Unknown date'; }

function generateTicketId() {
    return 'TKT-' + Date.now() + '-' + Math.random().toString(36).substring(2, 8).toUpperCase();
}

function generateQRCode() {
    return 'BTX-' + Date.now() + '-' + Math.random().toString(36).substring(2, 10).toUpperCase();
}

function updateActivity() { lastActivity = Date.now(); localStorage.setItem('betix_last_activity', lastActivity); }

function isSessionExpired() { var last = parseInt(localStorage.getItem('betix_last_activity') || 0); var now = Date.now(); return (now - last) > 86400000; }

// ============================================================
// ===== FONCTIONS DE SAUVEGARDE =====
// ============================================================

function saveEvents() { 
    localStorage.setItem('betix_events', JSON.stringify(events));
    syncEventsToSupabase();
}

function saveTickets() { 
    localStorage.setItem('betix_tickets', JSON.stringify(tickets));
    syncTicketsToSupabase();
}

function saveUser() { 
    localStorage.setItem('betix_user', JSON.stringify(currentUser));
    saveUserToSupabase();
}

function saveNotifications() { 
    localStorage.setItem('betix_notifications', JSON.stringify(notifications));
    syncNotificationsToSupabase();
}

function saveChatMessages() {
    localStorage.setItem('betix_chat_messages', JSON.stringify(chatMessages));
    syncChatToSupabase();
}

function saveRatings() {
    localStorage.setItem('betix_ratings', JSON.stringify(ratings));
    syncRatingsToSupabase();
}

function saveConnectedUsers() {
    localStorage.setItem('betix_connected_users', JSON.stringify(connectedUsers));
}

// ============================================================
// ===== SAUVEGARDE UTILISATEUR =====
// ============================================================

async function saveUserToSupabase() {
    if (!window.currentUser && !currentUser.wallet) return;
    try {
        const userData = {
            wallet: currentUser.wallet || window.currentUser?.wallet,
            name: currentUser.name || window.currentUser?.username || 'Guest',
            ticketCount: tickets.filter(t => t.buyerWallet === (currentUser.wallet || window.currentUser?.wallet)).length,
            lastSeen: new Date().toLocaleString(),
            profilePhoto: currentUser.profilePhoto || window.currentUser?.avatar_url || null,
            loyaltyPoints: currentUser.loyaltyPoints || 0,
            memberSince: currentUser.memberSince || '2026'
        };
        const { error } = await supabaseClient
            .from('users')
            .upsert(userData, { onConflict: 'wallet' });
        if (error) console.error('Error saving user:', error);
        else console.log('User saved to Supabase');
    } catch (error) { console.error('Error saving user:', error); }
}

async function loadUserFromSupabase() {
    const wallet = currentUser.wallet || window.currentUser?.wallet;
    if (!wallet) return false;
    try {
        const { data, error } = await supabaseClient
            .from('users')
            .select('*')
            .eq('wallet', wallet)
            .single();
        if (error) { console.error('Error loading user:', error); return false; }
        if (data) {
            currentUser.name = data.name || currentUser.name;
            currentUser.profilePhoto = data.profilePhoto || null;
            currentUser.loyaltyPoints = data.loyaltyPoints || 0;
            currentUser.memberSince = data.memberSince || '2026';
            saveUser();
            updateAllProfileImages();
            updateUserInfo();
            updateProfilePage();
            return true;
        }
        return false;
    } catch (error) { console.error('Error loading user:', error); return false; }
}

// ============================================================
// ===== CHARGER ÉVÉNEMENTS =====
// ============================================================

async function loadEventsFromSupabase() {
    try {
        const { data, error } = await supabaseClient
            .from('events')
            .select('*')
            .order('date', { ascending: true });
        if (error) { console.error("Error loading events:", error); return false; }
        if (data && data.length > 0) {
            events = data;
            localStorage.setItem('betix_events', JSON.stringify(events));
            renderEventsByCategory();
            console.log('Events loaded from Supabase:', events.length);
            return true;
        } else {
            events = JSON.parse(JSON.stringify(demoEvents));
            localStorage.setItem('betix_events', JSON.stringify(events));
            await syncEventsToSupabase();
            renderEventsByCategory();
            console.log('Demo events loaded');
            return true;
        }
    } catch (error) { console.error('Error loading events:', error); return false; }
}

async function syncEventsToSupabase() {
    try {
        if (events.length === 0) return;
        const { error: deleteError } = await supabaseClient
            .from('events')
            .delete()
            .neq('id', '');
        if (deleteError) throw deleteError;
        const { error: insertError } = await supabaseClient
            .from('events')
            .insert(events);
        if (insertError) throw insertError;
        console.log('Events synced to Supabase:', events.length);
    } catch (error) { console.error('Error syncing events:', error); }
}

// ============================================================
// ===== CHARGER BILLETS =====
// ============================================================

async function loadTicketsFromSupabase() {
    try {
        const { data, error } = await supabaseClient
            .from('tickets')
            .select('*')
            .order('purchaseDate', { ascending: false });
        if (error) { console.error("Error loading tickets:", error); return false; }
        if (data && data.length > 0) {
            tickets = data;
            localStorage.setItem('betix_tickets', JSON.stringify(tickets));
            renderTickets();
            renderHistory();
            console.log('Tickets loaded from Supabase:', tickets.length);
            return true;
        }
        return false;
    } catch (error) { console.error('Error loading tickets:', error); return false; }
}

async function syncTicketsToSupabase() {
    try {
        if (tickets.length === 0) return;
        for (const ticket of tickets) {
            const { error } = await supabaseClient
                .from('tickets')
                .upsert(ticket, { onConflict: 'id' });
            if (error) console.error('Error syncing ticket:', error);
        }
        console.log('Tickets synced to Supabase:', tickets.length);
    } catch (error) { console.error('Error syncing tickets:', error); }
}

// ============================================================
// ===== NOTIFICATIONS =====
// ============================================================

async function loadNotificationsFromSupabase() {
    try {
        const { data, error } = await supabaseClient
            .from('notifications')
            .select('*')
            .order('date', { ascending: false });
        if (error) { console.error("Error loading notifications:", error); return false; }
        if (data && data.length > 0) {
            notifications = data;
            localStorage.setItem('betix_notifications', JSON.stringify(notifications));
            updateNotifBadgeHeader();
            console.log('Notifications loaded from Supabase:', notifications.length);
            return true;
        }
        return false;
    } catch (error) { console.error('Error loading notifications:', error); return false; }
}

async function syncNotificationsToSupabase() {
    try {
        if (notifications.length === 0) return;
        for (const notif of notifications) {
            const { error } = await supabaseClient
                .from('notifications')
                .upsert(notif, { onConflict: 'id' });
            if (error) console.error('Error syncing notification:', error);
        }
        console.log('Notifications synced to Supabase:', notifications.length);
    } catch (error) { console.error('Error syncing notifications:', error); }
}

function addNotification(message, type) {
    var notif = {
        id: Date.now(),
        message: message,
        type: type || 'info',
        read: false,
        date: new Date().toISOString()
    };
    notifications.unshift(notif);
    if (notifications.length > 100) {
        notifications = notifications.slice(0, 100);
    }
    saveNotifications();
    updateNotifBadgeHeader();
}

function updateNotifBadgeHeader() {
    var badge = document.getElementById('notifBadgeHeader');
    if (!badge) return;
    var unread = 0;
    for (var i = 0; i < notifications.length; i++) {
        if (!notifications[i].read) unread++;
    }
    if (unread > 0) {
        badge.textContent = unread;
        badge.style.display = 'flex';
    } else {
        badge.style.display = 'none';
    }
    updateSidebarNotifBadge();
}

function updateSidebarNotifBadge() {
    var badge = document.getElementById('sidebarNotifBadge');
    if (!badge) return;
    var unread = 0;
    for (var i = 0; i < notifications.length; i++) {
        if (!notifications[i].read) unread++;
    }
    if (unread > 0) {
        badge.textContent = unread;
        badge.classList.remove('hidden');
    } else {
        badge.classList.add('hidden');
    }
}

// ============================================================
// ===== RATINGS =====
// ============================================================

async function loadRatingsFromSupabase() {
    try {
        const { data, error } = await supabaseClient
            .from('ratings')
            .select('*');
        if (error) { console.error("Error loading ratings:", error); return false; }
        if (data && data.length > 0) {
            ratings = data;
            localStorage.setItem('betix_ratings', JSON.stringify(ratings));
            console.log('Ratings loaded from Supabase:', ratings.length);
            return true;
        }
        return false;
    } catch (error) { console.error('Error loading ratings:', error); return false; }
}

async function syncRatingsToSupabase() {
    try {
        if (ratings.length === 0) return;
        for (const rating of ratings) {
            const { error } = await supabaseClient
                .from('ratings')
                .upsert(rating, { onConflict: 'id' });
            if (error) console.error('Error syncing rating:', error);
        }
        console.log('Ratings synced to Supabase:', ratings.length);
    } catch (error) { console.error('Error syncing ratings:', error); }
}

// ============================================================
// ===== CHAT =====
// ============================================================

async function loadChatFromSupabase() {
    try {
        const { data, error } = await supabaseClient
            .from('chat_messages')
            .select('*')
            .order('timestamp', { ascending: true });
        if (error) { console.error("Error loading chat messages:", error); return false; }
        if (data && data.length > 0) {
            chatMessages = data;
            localStorage.setItem('betix_chat_messages', JSON.stringify(chatMessages));
            renderChatMessages();
            console.log('Chat messages loaded from Supabase:', chatMessages.length);
            return true;
        }
        return false;
    } catch (error) { console.error('Error loading chat messages:', error); return false; }
}

async function syncChatToSupabase() {
    try {
        if (chatMessages.length === 0) return;
        for (const msg of chatMessages) {
            const { error } = await supabaseClient
                .from('chat_messages')
                .upsert(msg, { onConflict: 'id' });
            if (error) console.error('Error syncing chat message:', error);
        }
        console.log('Chat messages synced to Supabase:', chatMessages.length);
    } catch (error) { console.error('Error syncing chat messages:', error); }
}

function renderChatMessages() {
    var container = document.getElementById('chatMessages');
    if (!container) return;
    container.innerHTML = '';
    if (!chatMessages || chatMessages.length === 0) {
        var emptyMsg = document.createElement('div');
        emptyMsg.className = 'chat-message support';
        emptyMsg.innerHTML = '<div class="message-bubble">Hello! How can we help you today?</div>';
        container.appendChild(emptyMsg);
        return;
    }
    for (var i = 0; i < chatMessages.length; i++) {
        var m = chatMessages[i];
        var d = document.createElement('div');
        d.className = 'chat-message ' + (m.isUser ? 'user' : 'support');
        d.innerHTML = '<div class="message-bubble">' + escapeHtml(m.text) + '</div><span class="message-time">' + m.time + '</span>';
        container.appendChild(d);
    }
    container.scrollTop = container.scrollHeight;
}

// ============================================================
// ===== ADMIN LOGS =====
// ============================================================

async function loadAdminLogsFromSupabase() {
    try {
        const { data, error } = await supabaseClient
            .from('admin_logs')
            .select('*')
            .order('timestamp', { ascending: false });
        if (error) { console.error("Error loading admin logs:", error); return false; }
        if (data && data.length > 0) {
            adminLogs = data;
            localStorage.setItem('betix_admin_logs', JSON.stringify(adminLogs));
            renderAdminLogs();
            console.log('Admin logs loaded from Supabase:', adminLogs.length);
            return true;
        }
        return false;
    } catch (error) { console.error('Error loading admin logs:', error); return false; }
}

async function syncAdminLogsToSupabase() {
    try {
        if (adminLogs.length === 0) return;
        for (const log of adminLogs) {
            const { error } = await supabaseClient
                .from('admin_logs')
                .upsert(log, { onConflict: 'id' });
            if (error) console.error('Error syncing admin log:', error);
        }
        console.log('Admin logs synced to Supabase:', adminLogs.length);
    } catch (error) { console.error('Error syncing admin logs:', error); }
}

function addAdminLog(action, details) {
    var log = {
        id: Date.now(),
        timestamp: new Date().toISOString(),
        date: new Date().toLocaleString('en-US'),
        user: currentUser.wallet || window.currentUser?.wallet || 'Local Admin',
        action: action,
        details: details || ''
    };
    adminLogs.unshift(log);
    if (adminLogs.length > 500) {
        adminLogs = adminLogs.slice(0, 500);
    }
    localStorage.setItem('betix_admin_logs', JSON.stringify(adminLogs));
    syncAdminLogsToSupabase();
    renderAdminLogs();
}

function renderAdminLogs() {
    var container = document.getElementById('adminLogsList');
    if (!container) return;
    if (adminLogs.length === 0) {
        container.innerHTML = '<p style="text-align:center;padding:20px;color:var(--gray);">No logs available</p>';
        return;
    }
    container.innerHTML = adminLogs.map(function(log) {
        return '<div class="admin-log-item">' +
            '<div>' +
                '<span class="log-user">' + escapeHtml(log.user) + '</span>' +
                ' <span class="log-action">' + escapeHtml(log.action) + '</span>' +
                (log.details ? ' <span style="color:var(--gray);font-size:0.8rem;">' + escapeHtml(log.details) + '</span>' : '') +
            '</div>' +
            '<span class="log-time">' + escapeHtml(log.date) + '</span>' +
        '</div>';
    }).join('');
}

function adminClearLogs() {
    if (confirm('Clear all connection logs?')) {
        adminLogs = [];
        localStorage.setItem('betix_admin_logs', JSON.stringify(adminLogs));
        syncAdminLogsToSupabase();
        renderAdminLogs();
        addAdminLog('Logs cleared', 'All logs were deleted');
        alert('Logs cleared');
    }
}

// ============================================================
// ===== SYNC ALL =====
// ============================================================

async function syncAllFromSupabase() {
    console.log('Syncing all data from Supabase...');
    await loadEventsFromSupabase();
    await loadTicketsFromSupabase();
    await loadNotificationsFromSupabase();
    await loadRatingsFromSupabase();
    await loadChatFromSupabase();
    await loadAdminLogsFromSupabase();
    await loadUserFromSupabase();
    console.log('All data synced from Supabase');
}

async function syncAllToSupabase() {
    console.log('Syncing all data to Supabase...');
    await syncEventsToSupabase();
    await syncTicketsToSupabase();
    await syncNotificationsToSupabase();
    await syncRatingsToSupabase();
    await syncChatToSupabase();
    await syncAdminLogsToSupabase();
    await saveUserToSupabase();
    console.log('All data synced to Supabase');
}

// ============================================================
// ===== NAVIGATION =====
// ============================================================

function goToMyEvents() { showPage('myevents'); }
function goToTickets() { showPage('tickets'); }
function goToHistory() { showPage('history'); }
function goToRatings() { showPage('ratings'); }

function showPage(pageName) {
    updateActivity();
    var pages = ['homePage', 'createPage', 'ticketsPage', 'historyPage', 'profilePage', 'whitepaperPage', 'faqPage', 'settingsPage', 'ratingsPage', 'adminPage', 'slidesPage', 'myeventsPage', 'notificationsPage'];
    for (var i = 0; i < pages.length; i++) { 
        var el = document.getElementById(pages[i]); 
        if (el) { 
            el.style.display = 'none'; 
            el.classList.add('hidden-page'); 
        } 
    }
    var displayPage = pageName;
    if (pageName === 'home') { 
        document.getElementById('homePage').style.display = 'block'; 
        renderEventsByCategory();
        displayPage = 'home';
    } else { 
        var target = document.getElementById(pageName + 'Page'); 
        if (target) { 
            target.style.display = 'block'; 
            target.classList.remove('hidden-page'); 
        }
        displayPage = pageName;
    }
    if (pageHistory[pageHistory.length - 1] !== displayPage) {
        pageHistory.push(displayPage);
    }
    updateBackButton(displayPage);
    if (pageName === 'tickets') renderTickets();
    if (pageName === 'history') renderHistory();
    if (pageName === 'profile') updateProfilePage();
    if (pageName === 'ratings') renderMyRatings();
    if (pageName === 'admin') loadAdminPage();
    if (pageName === 'faq') initFaq();
    if (pageName === 'myevents') renderMyEvents();
    if (pageName === 'notifications') renderNotificationsPage();
    closeSidebar();
    window.scrollTo(0, 0);
}

function closeSidebar() { var s = document.getElementById('sidebar'); if (s) s.classList.remove('open'); var o = document.getElementById('overlay'); if (o) o.classList.remove('active'); }
function openSidebar() { var s = document.getElementById('sidebar'); if (s) s.classList.add('open'); var o = document.getElementById('overlay'); if (o) o.classList.add('active'); }

function updateBackButton(currentPage) {
    var backBtn = document.getElementById('backBtn');
    if (!backBtn) return;
    if (currentPage !== 'home' && currentPage !== 'homePage') {
        backBtn.style.display = 'flex';
        backBtn.classList.add('visible');
    } else {
        backBtn.style.display = 'none';
        backBtn.classList.remove('visible');
    }
}

function goBack() {
    if (pageHistory.length > 1) {
        pageHistory.pop();
        var previousPage = pageHistory[pageHistory.length - 1];
        showPage(previousPage);
    } else {
        showPage('home');
    }
}

// ============================================================
// ===== LANGUAGE MANAGEMENT =====
// ============================================================

function changeLanguage(lang) {
    localStorage.setItem('betix_language', lang);
    var nativeSelect = document.getElementById('nativeLangSelect');
    if (nativeSelect) {
        nativeSelect.value = lang;
    }
    var googleSelect = document.querySelector('.goog-te-combo');
    if (googleSelect) {
        googleSelect.value = lang;
        googleSelect.dispatchEvent(new Event('change'));
    }
    setTimeout(function() {
        location.reload();
    }, 600);
}

function detectLanguage() {
    var savedLang = localStorage.getItem('betix_language') || 'en';
    var urlParams = new URLSearchParams(window.location.search);
    var urlLang = urlParams.get('lang');
    if (urlLang) {
        localStorage.setItem('betix_language', urlLang);
        savedLang = urlLang;
    }
    var nativeSelect = document.getElementById('nativeLangSelect');
    if (nativeSelect) {
        nativeSelect.value = savedLang;
    }
    setTimeout(function() {
        var googleSelect = document.querySelector('.goog-te-combo');
        if (googleSelect && googleSelect.value !== savedLang) {
            googleSelect.value = savedLang;
            googleSelect.dispatchEvent(new Event('change'));
        }
    }, 800);
    return savedLang;
}

// ============================================================
// ===== PROFILE FUNCTIONS =====
// ============================================================

function updateUserInfo() {
    var sidebarName = document.getElementById('sidebarName');
    var sidebarWallet = document.getElementById('sidebarWallet');
    var sidebarText = document.getElementById('sidebarAvatarText');
    var sidebarImg = document.getElementById('sidebarAvatarImage');
    
    if (window.currentUser) {
        if (sidebarName) sidebarName.innerText = window.currentUser.username || window.currentUser.name || 'Guest';
        if (sidebarWallet) sidebarWallet.innerText = window.currentUser.wallet ? window.currentUser.wallet.substring(0, 15) + '...' : 'Not connected';
    } else if (currentUser) {
        if (sidebarName) sidebarName.innerText = currentUser.name || 'Guest';
        if (sidebarWallet) sidebarWallet.innerText = currentUser.wallet ? currentUser.wallet.substring(0, 15) + '...' : 'Not connected';
    }
    
    if (sidebarImg && sidebarText) {
        var photo = window.currentUser?.avatar_url || currentUser?.profilePhoto || null;
        if (photo) {
            sidebarImg.src = photo;
            sidebarImg.style.display = 'block';
            sidebarText.style.display = 'none';
        } else {
            sidebarImg.style.display = 'none';
            sidebarText.style.display = 'flex';
            sidebarText.innerText = (window.currentUser?.username || currentUser?.name || 'U').substring(0, 2).toUpperCase();
        }
    }
    updateConnectButtons();
}

function updateAllProfileImages() {
    var photo = window.currentUser?.avatar_url || currentUser?.profilePhoto || '';
    var sidebarImg = document.getElementById('sidebarAvatarImage');
    var sidebarText = document.getElementById('sidebarAvatarText');
    if (sidebarImg && sidebarText) {
        if (photo) {
            sidebarImg.src = photo;
            sidebarImg.style.display = 'block';
            sidebarText.style.display = 'none';
        } else {
            sidebarImg.style.display = 'none';
            sidebarText.style.display = 'flex';
            if (sidebarText) sidebarText.innerText = (window.currentUser?.username || currentUser?.name || 'U').substring(0, 2).toUpperCase();
        }
    }
    var profileImg = document.getElementById('profilePageAvatar');
    var profilePlaceholder = document.getElementById('profilePageAvatarPlaceholder');
    if (profileImg && profilePlaceholder) {
        if (photo) {
            profileImg.src = photo;
            profileImg.style.display = 'block';
            profilePlaceholder.style.display = 'none';
        } else {
            profileImg.style.display = 'none';
            profilePlaceholder.style.display = 'flex';
            profilePlaceholder.innerHTML = '<i class="fas fa-user"></i>';
        }
    }
}

function updateProfilePage() {
    var user = window.currentUser || currentUser;
    var profileName = document.getElementById('profileNameDisplay');
    var profileWallet = document.getElementById('profileWalletDisplay');
    var ticketCount = document.getElementById('ticketCount');
    var ratedCount = document.getElementById('ratedCount');
    var loyaltyDisplay = document.getElementById('loyaltyPointsDisplay');
    var myEventsCount = document.getElementById('myEventsCount');
    var historyCount = document.getElementById('historyCount');
    var profileRatingDisplay = document.getElementById('profileRatingDisplay');
    var profileLoyaltyDisplay = document.getElementById('profileLoyaltyDisplay');
    
    if (profileName) profileName.innerText = user?.username || user?.name || 'Guest';
    if (profileWallet) profileWallet.innerText = user?.wallet || 'Not connected';
    if (ticketCount) ticketCount.innerText = tickets.length;
    if (ratedCount) ratedCount.innerText = ratings.filter(function(r) { return r.userWallet === (user?.wallet || user?.pi_uid); }).length;
    if (loyaltyDisplay) loyaltyDisplay.innerText = user?.loyaltyPoints || 0;
    if (historyCount) historyCount.innerText = tickets.length;
    if (profileRatingDisplay) {
        var userRatings = ratings.filter(function(r) { return r.userWallet === (user?.wallet || user?.pi_uid); });
        var avg = userRatings.length > 0 ? (userRatings.reduce(function(a, r) { return a + r.rating; }, 0) / userRatings.length).toFixed(1) : '0';
        profileRatingDisplay.innerText = avg;
    }
    if (profileLoyaltyDisplay) profileLoyaltyDisplay.innerText = user?.loyaltyPoints || 0;
    
    var myEvents = events.filter(function(e) {
        return e.organizer === user?.wallet || e.organizerName === user?.username || e.organizer === user?.pi_uid;
    });
    if (myEventsCount) myEventsCount.innerText = myEvents.length;
    
    updateAllProfileImages();
    updateConnectButtons();
}

function updateConnectButtons() {
    var isConnected = window.currentUser || currentUser?.wallet;
    var sidebarBtn = document.getElementById('sidebarWalletBtn');
    if (sidebarBtn) {
        if (isConnected) {
            sidebarBtn.textContent = 'Disconnect';
            sidebarBtn.classList.add('disconnect');
        } else {
            sidebarBtn.textContent = 'Connect Pi';
            sidebarBtn.classList.remove('disconnect');
        }
    }
    var profilePageBtn = document.getElementById('profileConnectBtnPage');
    if (profilePageBtn) {
        if (isConnected) {
            profilePageBtn.textContent = 'Disconnect';
        } else {
            profilePageBtn.textContent = 'Connect Pi';
        }
    }
}

// ============================================================
// ===== PROFILE PHOTO UPLOAD =====
// ============================================================

async function handleProfilePhotoUpload(file) {
    if (!file) return;
    if (!file.type.startsWith('image/')) {
        alert('Please select an image');
        return;
    }
    if (file.size > 10 * 1024 * 1024) {
        alert('Image is too large (max 10MB)');
        return;
    }
    
    var loadingMsg = document.getElementById('profilePhotoLoading');
    if (loadingMsg) loadingMsg.style.display = 'block';
    
    try {
        var compressedData = await compressProfilePhoto(file);
        
        if (window.currentUser) {
            window.currentUser.avatar_url = compressedData;
            localStorage.setItem('betix_user', JSON.stringify(window.currentUser));
            await supabaseClient
                .from('users')
                .update({ profilePhoto: compressedData })
                .eq('pi_uid', window.currentUser.pi_uid);
        } else {
            currentUser.profilePhoto = compressedData;
            saveUser();
        }
        
        updateAllProfileImages();
        alert('Profile photo updated and compressed!');
    } catch (error) {
        console.error('Error compressing image:', error);
        alert('Error compressing image. Please try with a smaller image.');
    } finally {
        if (loadingMsg) loadingMsg.style.display = 'none';
    }
}

// ============================================================
// ===== IMAGE UPLOAD FOR EVENTS =====
// ============================================================

async function handleImageUploadModern(file, index) {
    if (!file) return;
    
    if (!file.type.startsWith('image/')) {
        alert('Please select an image');
        return;
    }
    
    if (file.size > 10 * 1024 * 1024) {
        alert('Image is too large (max 10MB)');
        return;
    }
    
    var box = document.getElementById('uploadBox' + (index + 1));
    var progress = document.getElementById('progress' + (index + 1));
    var progressFill = document.getElementById('progressFill' + (index + 1));
    var progressText = document.getElementById('progressText' + (index + 1));
    var previewContainer = document.getElementById('previewContainer' + index);
    var previewImage = document.getElementById('previewImage' + index);
    
    progress.style.display = 'block';
    progressFill.style.width = '0%';
    progressText.textContent = '0%';
    box.classList.add('compress');
    
    try {
        var progressInterval = setInterval(function() {
            var currentWidth = parseInt(progressFill.style.width) || 0;
            if (currentWidth < 90) {
                var newWidth = currentWidth + Math.random() * 15;
                if (newWidth > 90) newWidth = 90;
                progressFill.style.width = newWidth + '%';
                progressText.textContent = Math.round(newWidth) + '%';
            }
        }, 200);
        
        var compressedData = await compressEventImage(file);
        
        clearInterval(progressInterval);
        progressFill.style.width = '100%';
        progressText.textContent = '100%';
        
        setTimeout(function() {
            progress.style.display = 'none';
            progressFill.style.width = '0%';
            
            previewImage.src = compressedData;
            previewContainer.style.display = 'block';
            box.classList.add('has-image');
            box.classList.remove('compress');
            
            uploadedImages[index] = compressedData;
            console.log('Image ' + (index + 1) + ' uploaded and compressed successfully');
        }, 300);
        
    } catch (error) {
        console.error('Error compressing image:', error);
        alert('Error compressing image. Please try with a smaller image.');
        progress.style.display = 'none';
        box.classList.remove('compress');
    }
}

function removeImageModern(index) {
    var box = document.getElementById('uploadBox' + (index + 1));
    var previewContainer = document.getElementById('previewContainer' + index);
    var previewImage = document.getElementById('previewImage' + index);
    var input = document.getElementById('imageInput' + index);
    
    previewContainer.style.display = 'none';
    previewImage.src = '#';
    box.classList.remove('has-image');
    box.classList.remove('compress');
    input.value = '';
    delete uploadedImages[index];
    
    console.log('Image ' + (index + 1) + ' removed');
}

function getUploadedImages() {
    var images = [];
    for (var key in uploadedImages) {
        if (uploadedImages.hasOwnProperty(key)) {
            images.push(uploadedImages[key]);
        }
    }
    return images;
}

// ============================================================
// ===== CREATE EVENT =====
// ============================================================

function createEvent(e) {
    e.preventDefault();
    var user = window.currentUser || currentUser;
    if (!user || !user.wallet && !user.pi_uid) { 
        alert('Connect your Pi account first'); 
        return; 
    }
    
    var images = getUploadedImages();
    if (images.length < 2) { 
        alert('Please add 2 photos for your event'); 
        return; 
    }
    
    var conditions = document.getElementById('eventConditions').value.trim();
    if (!conditions) {
        alert('Please add participation conditions');
        return;
    }
    
    var category = document.getElementById('eventCategory').value;
    var country = document.getElementById('eventCountry').value;
    
    var newEvent = {
        id: Date.now().toString(),
        title: document.getElementById('eventTitle').value,
        category: category,
        country: country,
        date: document.getElementById('eventDate').value,
        location: document.getElementById('eventLocation').value,
        description: document.getElementById('eventDescription').value,
        conditions: conditions,
        price: parseFloat(document.getElementById('eventPrice').value) || 0.0003,
        seatsTotal: parseInt(document.getElementById('eventSeats').value),
        seatsLeft: parseInt(document.getElementById('eventSeats').value),
        images: images,
        coverImage: images[0],
        organizer: user.wallet || user.pi_uid,
        organizerName: user.username || user.name,
        createdAt: new Date().toISOString(),
        boosts: 0
    };
    
    if (!newEvent.title || !newEvent.date || !newEvent.location || !newEvent.seatsTotal) { 
        alert('Please fill in all required fields'); 
        return; 
    }
    
    openPublishConfirm(newEvent);
}

function openPublishConfirm(eventData) {
    pendingEventData = eventData;
    
    document.getElementById('confirmTitle').textContent = eventData.title;
    document.getElementById('confirmCategory').textContent = eventData.category;
    document.getElementById('confirmCountry').textContent = eventData.country;
    var dateEvent = new Date(eventData.date);
    document.getElementById('confirmDate').textContent = dateEvent.toLocaleDateString('en-US') + ' at ' + dateEvent.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    document.getElementById('confirmLocation').textContent = eventData.location || 'Online';
    document.getElementById('confirmPrice').textContent = eventData.price + ' Pi';
    document.getElementById('confirmSeats').textContent = eventData.seatsTotal;
    document.getElementById('confirmOrganizer').textContent = eventData.organizerName || eventData.organizer;
    document.getElementById('confirmDescription').textContent = eventData.description || 'No description';
    document.getElementById('confirmConditions').textContent = eventData.conditions || 'No conditions specified';
    
    var imagesContainer = document.getElementById('confirmImages');
    imagesContainer.innerHTML = '';
    if (eventData.images && eventData.images.length > 0) {
        for (var i = 0; i < eventData.images.length; i++) {
            var img = document.createElement('img');
            img.src = eventData.images[i];
            img.alt = 'Event image ' + (i + 1);
            imagesContainer.appendChild(img);
        }
    }
    
    document.getElementById('publishConfirmPopup').classList.add('show');
}

function closePublishConfirmPopup() {
    document.getElementById('publishConfirmPopup').classList.remove('show');
    pendingEventData = null;
}

function confirmPublishEvent() {
    if (!pendingEventData) return;
    
    var newEvent = pendingEventData;
    events.push(newEvent);
    saveEvents();
    
    document.getElementById('eventForm').reset();
    for (var i = 0; i < 2; i++) {
        removeImageModern(i);
    }
    uploadedImages = {};
    
    addNotification('New event "' + newEvent.title + '" has been published!', 'event');
    
    closePublishConfirmPopup();
    renderEventsByCategory();
    updateProfilePage();
    alert('Event "' + newEvent.title + '" has been successfully published!');
    showPage('home');
}

// ============================================================
// ===== RENDER EVENTS =====
// ============================================================

function renderEventsByCategory() {
    var container = document.getElementById('eventsByCategory');
    if (!container) return;
    var filtered = events.filter(function(e) { 
        var matchCategory = (currentFilter === 'All' || e.category === currentFilter);
        var matchCountry = (currentCountryFilter === 'All' || e.country === currentCountryFilter);
        var matchSearch = (e.title.toLowerCase().includes(searchQuery) || (e.location && e.location.toLowerCase().includes(searchQuery)));
        return matchCategory && matchCountry && matchSearch;
    });
    if (filtered.length === 0) { 
        container.innerHTML = '<p style="text-align:center;padding:2rem;color:var(--gray);">No events found</p>'; 
        return; 
    }
    var cats = ['Concert', 'Sport', 'Conference', 'Training', 'Cinema', 'Festival', 'Theatre', 'Dance', 'Exhibition', 'Gala', 'Seminar'];
    var html = '';
    if (currentFilter !== 'All') {
        html = '<div class="category-section"><div class="events-grid-centered">';
        filtered.forEach(function(e) {
            html += renderEventCard(e);
        });
        html += '</div></div>';
    } else {
        for (var i = 0; i < cats.length; i++) {
            var cat = cats[i];
            var catEvents = filtered.filter(function(e) { return e.category === cat; });
            if (catEvents.length) {
                html += '<div class="category-section"><div class="category-header">' + cat + '</div><div class="events-grid-centered">';
                catEvents.forEach(function(e) {
                    html += renderEventCard(e);
                });
                html += '</div></div>';
            }
        }
    }
    container.innerHTML = html;
}

function renderEventCard(event) {
    var avgRating = 0;
    var eventRatings = ratings.filter(function(r) { return r.eventId === event.id; });
    if (eventRatings.length > 0) { avgRating = eventRatings.reduce(function(a, r) { return a + r.rating; }, 0) / eventRatings.length; }
    var organizerDisplay = event.organizerName || event.organizer || 'Anonymous';
    if (organizerDisplay.length > 15) {
        organizerDisplay = organizerDisplay.substring(0, 12) + '...';
    }
    var dateEvent = new Date(event.date);
    var dateFormatted = dateEvent.toLocaleDateString('en-US');
    var timeFormatted = dateEvent.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    var ratingStars = '';
    var fullStars = Math.floor(avgRating);
    for (var i = 0; i < fullStars; i++) ratingStars += '★';
    for (var i = fullStars; i < 5; i++) ratingStars += '☆';
    var ratingHtml = avgRating > 0 ? ratingStars + ' ' + avgRating.toFixed(1) + ' (' + eventRatings.length + ')' : 'New';
    var fallbackImage = eventImagesList[event.category] || eventImagesList.Concert;
    return '<div class="event-card" onclick="openEventDetails(\'' + event.id + '\')" style="cursor:pointer;">' +
        '<div class="event-card-banner">' +
            '<img src="' + (event.coverImage || fallbackImage) + '" alt="' + escapeHtml(event.title) + '" onerror="this.src=\'' + fallbackImage + '\'">' +
            '<span class="event-card-badge">' + escapeHtml(event.category) + '</span>' +
        '</div>' +
        '<div class="event-card-body">' +
            '<div class="event-card-title">' + escapeHtml(event.title) + 
                '<span class="organizer-name"><i class="fas fa-user"></i> by ' + escapeHtml(organizerDisplay) + '</span>' +
            '</div>' +
            '<div class="event-card-details">' +
                '<div class="detail-item"><i class="fas fa-calendar-day"></i> ' + dateFormatted + '</div>' +
                '<div class="detail-item"><i class="fas fa-clock"></i> ' + timeFormatted + '</div>' +
                '<div class="detail-item"><i class="fas fa-map-marker-alt"></i> ' + escapeHtml(event.location || 'Online') + '</div>' +
                '<div class="detail-item"><i class="fas fa-flag"></i> ' + escapeHtml(event.country || 'Not specified') + '</div>' +
            '</div>' +
            (event.description ? '<div class="event-card-desc">' + escapeHtml(event.description.substring(0, 80)) + (event.description.length > 80 ? '...' : '') + '</div>' : '') +
            '<div class="event-card-stats">' +
                '<span class="event-card-rating"><i class="fas fa-star"></i> ' + ratingHtml + '</span>' +
            '</div>' +
            '<div class="event-card-footer">' +
                '<div><span class="event-card-price">' + event.price + ' Pi</span> <span class="event-card-seats">' + event.seatsLeft + '/' + event.seatsTotal + ' seats</span></div>' +
                '<button class="buy-btn" onclick="event.stopPropagation(); openQuantityPopup(\'' + event.id + '\')">Buy Ticket</button>' +
            '</div>' +
        '</div>' +
    '</div>';
}

// ============================================================
// ===== EVENT DETAILS =====
// ============================================================

function openEventDetails(eventId) {
    var event = events.find(function(e) { return e.id === eventId; });
    if (!event) {
        alert('Event not found');
        return;
    }
    var modal = document.getElementById('eventDetailModal');
    var closeBtn = document.getElementById('eventDetailClose');
    document.getElementById('detailTitle').textContent = event.title;
    document.getElementById('detailCategory').textContent = event.category;
    document.getElementById('detailCountry').textContent = event.country || 'Not specified';
    var dateEvent = new Date(event.date);
    document.getElementById('detailDate').textContent = dateEvent.toLocaleDateString('en-US') + ' at ' + dateEvent.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    document.getElementById('detailLocation').textContent = event.location || 'Online';
    document.getElementById('detailPrice').textContent = event.price + ' Pi';
    document.getElementById('detailSeats').textContent = event.seatsLeft + '/' + event.seatsTotal + ' seats';
    document.getElementById('detailDescription').textContent = event.description || 'No description';
    document.getElementById('detailOrganizer').textContent = event.organizerName || event.organizer || 'Unknown';
    document.getElementById('detailCreated').textContent = new Date(event.createdAt).toLocaleDateString('en-US');
    document.getElementById('detailBoosts').textContent = event.seatsLeft + '/' + event.seatsTotal;
    var conditionsContainer = document.getElementById('detailConditions');
    if (conditionsContainer) {
        if (event.conditions) {
            var conditionsList = event.conditions.split('\n').filter(function(line) { return line.trim() !== ''; });
            if (conditionsList.length > 0) {
                var html = '<ul class="conditions-list">';
                for (var i = 0; i < conditionsList.length; i++) {
                    html += '<li>' + escapeHtml(conditionsList[i].trim()) + '</li>';
                }
                html += '</ul>';
                conditionsContainer.innerHTML = html;
            } else {
                conditionsContainer.innerHTML = '<p>' + escapeHtml(event.conditions) + '</p>';
            }
        } else {
            conditionsContainer.innerHTML = '<p style="color: var(--gray);">No conditions specified</p>';
        }
    }
    var eventRatings = ratings.filter(function(r) { return r.eventId === event.id; });
    var avgRating = 0;
    if (eventRatings.length > 0) {
        avgRating = eventRatings.reduce(function(a, r) { return a + r.rating; }, 0) / eventRatings.length;
    }
    var ratingStars = '';
    var fullStars = Math.floor(avgRating);
    for (var i = 0; i < fullStars; i++) ratingStars += '★';
    for (var i = fullStars; i < 5; i++) ratingStars += '☆';
    document.getElementById('detailRating').textContent = eventRatings.length > 0 ? ratingStars + ' ' + avgRating.toFixed(1) + ' (' + eventRatings.length + ' reviews)' : 'Not yet rated';
    var gallery = document.getElementById('detailGallery');
    gallery.innerHTML = '';
    if (event.images && event.images.length > 0) {
        var galleryContainer = document.createElement('div');
        galleryContainer.className = 'gallery-scroll';
        var maxImages = Math.min(event.images.length, 5);
        for (var j = 0; j < maxImages; j++) {
            var imgWrapper = document.createElement('div');
            imgWrapper.className = 'gallery-item';
            var img = document.createElement('img');
            img.src = event.images[j];
            img.alt = event.title + ' - photo ' + (j + 1);
            img.onerror = function() {
                this.src = eventImagesList[event.category] || 'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?w=600&h=400&fit=crop';
            };
            img.onclick = (function(index) {
                return function() { openGallery(event.id, index); };
            })(j);
            imgWrapper.appendChild(img);
            galleryContainer.appendChild(imgWrapper);
        }
        gallery.appendChild(galleryContainer);
        if (event.images.length > 5) {
            var badge = document.createElement('div');
            badge.className = 'gallery-badge';
            badge.textContent = '+' + (event.images.length - 5) + ' photos';
            gallery.appendChild(badge);
        }
    } else {
        var defaultImg = document.createElement('img');
        defaultImg.src = eventImagesList[event.category] || 'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?w=600&h=400&fit=crop';
        defaultImg.alt = event.title;
        defaultImg.onclick = function() { openGallery(event.id, 0); };
        defaultImg.style.cursor = 'pointer';
        gallery.appendChild(defaultImg);
    }
    var reviewsContainer = document.getElementById('detailReviews');
    reviewsContainer.innerHTML = '';
    if (eventRatings.length > 0) {
        eventRatings.forEach(function(r) {
            var div = document.createElement('div');
            div.className = 'review-item';
            var stars = '';
            for (var k = 0; k < r.rating; k++) stars += '★';
            for (var k = r.rating; k < 5; k++) stars += '☆';
            div.innerHTML = '<div class="review-header"><span class="review-user">' + escapeHtml(r.userName || r.userWallet) + '</span><span class="review-stars">' + stars + '</span></div>' +
                           (r.comment ? '<div class="review-text">"' + escapeHtml(r.comment) + '"</div>' : '') +
                           '<div class="review-date">' + new Date(r.date).toLocaleDateString('en-US') + '</div>';
            reviewsContainer.appendChild(div);
        });
    } else {
        reviewsContainer.innerHTML = '<p style="color: var(--gray); font-size: 0.9rem;">No reviews yet</p>';
    }
    document.getElementById('detailBuyBtn').onclick = function() {
        modal.classList.remove('show');
        document.body.style.overflow = '';
        openQuantityPopup(event.id);
    };
    closeBtn.onclick = function() { 
        modal.classList.remove('show');
        document.body.style.overflow = '';
    };
    window.onclick = function(e) { 
        if (e.target === modal) {
            modal.classList.remove('show');
            document.body.style.overflow = '';
        }
    };
    modal.classList.add('show');
    document.body.style.overflow = 'hidden';
}

function openGallery(eventId, startIndex) {
    var event = events.find(function(e) { return e.id === eventId; });
    if (!event) return;
    var images = event.images && event.images.length ? event.images : [eventImagesList[event.category]];
    var currentIndex = startIndex || 0;
    var modal = document.getElementById('fullGalleryModal');
    if (!modal) {
        modal = document.createElement('div');
        modal.id = 'fullGalleryModal';
        modal.className = 'gallery-modal';
        modal.innerHTML = '<span class="gallery-close">&times;</span><img id="galleryCurrentImage" src=""><div class="gallery-nav"><button id="galleryPrev">Previous</button><button id="galleryNext">Next</button></div>';
        document.body.appendChild(modal);
        document.querySelector('#fullGalleryModal .gallery-close').onclick = function() { document.getElementById('fullGalleryModal').classList.remove('show'); };
    }
    var imgElement = document.getElementById('galleryCurrentImage');
    var prevBtn = document.getElementById('galleryPrev');
    var nextBtn = document.getElementById('galleryNext');
    function updateImage(index) { if (index < 0) index = images.length - 1; if (index >= images.length) index = 0; currentIndex = index; imgElement.src = images[currentIndex]; }
    updateImage(currentIndex);
    prevBtn.onclick = function() { updateImage(currentIndex - 1); };
    nextBtn.onclick = function() { updateImage(currentIndex + 1); };
    modal.classList.add('show');
}

// ============================================================
// ===== FILTERS =====
// ============================================================

function initFilters() {
    var cats = ['All', 'Concert', 'Sport', 'Conference', 'Training', 'Cinema', 'Festival', 'Theatre', 'Dance', 'Exhibition', 'Gala', 'Seminar'];
    var container = document.getElementById('filtersContainer');
    if (!container) return;
    container.innerHTML = cats.map(function(c) { return '<div class="filter-chip ' + (c === currentFilter ? 'active' : '') + '" data-category="' + c + '">' + c + '</div>'; }).join('');
    var chips = document.querySelectorAll('.filter-chip');
    for (var i = 0; i < chips.length; i++) { chips[i].addEventListener('click', function() { currentFilter = this.dataset.category; initFilters(); renderEventsByCategory(); }); }
}

function filterByCountry(country) {
    currentCountryFilter = country;
    renderEventsByCategory();
}

function initCountrySelectors() {
    var filterSelect = document.getElementById('countrySelect');
    if (filterSelect) {
        filterSelect.innerHTML = '';
        for (var i = 0; i < countriesList.length; i++) {
            var country = countriesList[i];
            var option = document.createElement('option');
            option.value = country;
            option.textContent = country;
            if (country === currentCountryFilter) {
                option.selected = true;
            }
            filterSelect.appendChild(option);
        }
    }
    var eventSelect = document.getElementById('eventCountry');
    if (eventSelect) {
        eventSelect.innerHTML = '';
        for (var i = 0; i < countriesList.length; i++) {
            var country = countriesList[i];
            if (country === 'All') continue;
            var option = document.createElement('option');
            option.value = country;
            option.textContent = country;
            if (country === 'France') {
                option.selected = true;
            }
            eventSelect.appendChild(option);
        }
    }
}

// ============================================================
// ===== TICKETS AND HISTORY =====
// ============================================================

function renderTickets() {
    var container = document.getElementById('ticketsList');
    if (!container) return;
    var user = window.currentUser || currentUser;
    var userTickets = tickets.filter(function(t) { 
        return t.buyerWallet === user?.wallet || t.buyerId === user?.pi_uid;
    });
    var active = userTickets.filter(function(t) { return new Date(t.eventDate) > new Date(); });
    active.sort(function(a, b) { return new Date(b.purchaseDate) - new Date(a.purchaseDate); });
    if (!active.length) { container.innerHTML = '<p style="text-align:center;padding:2rem;">No active tickets</p>'; return; }
    container.innerHTML = active.map(function(t) { 
        return '<div class="ticket-card">' +
            '<h3>' + escapeHtml(t.eventTitle) + '</h3>' +
            '<p><strong>Buyer :</strong> ' + escapeHtml(t.buyerName || t.buyerWallet) + '</p>' +
            '<p><strong>Price :</strong> ' + t.price + ' Pi</p>' +
            '<p><strong>Date :</strong> ' + formatDate(t.eventDate) + '</p>' +
            '<p><strong>Location :</strong> ' + escapeHtml(t.eventLocation || 'Not specified') + '</p>' +
            '<p><strong>Purchased on :</strong> ' + formatDateTime(t.purchaseDate) + '</p>' +
            '<p><strong>Code :</strong> <code>' + t.qrCode + '</code></p>' +
            '<button class="btn-qr" onclick="showTicketQR(\'' + t.qrCode + '\')">Show QR Code</button>' +
            (t.status === 'Valid' ? '<button class="btn-validate" onclick="validateTicket(\'' + t.id + '\')">Validate</button>' : '') +
        '</div>'; 
    }).join('');
}

function renderHistory() {
    var container = document.getElementById('historyList');
    if (!container) return;
    var user = window.currentUser || currentUser;
    var userTickets = tickets.filter(function(t) { 
        return t.buyerWallet === user?.wallet || t.buyerId === user?.pi_uid;
    });
    var old = userTickets.filter(function(t) { return new Date(t.eventDate) <= new Date(); });
    old.sort(function(a, b) { return new Date(b.purchaseDate) - new Date(a.purchaseDate); });
    if (!old.length) { container.innerHTML = '<p style="text-align:center;padding:2rem;">No history</p>'; return; }
    container.innerHTML = old.map(function(t) { 
        return '<div class="ticket-card" style="opacity:0.8;">' +
            '<h3>' + escapeHtml(t.eventTitle) + '</h3>' +
            '<p><strong>Buyer :</strong> ' + escapeHtml(t.buyerName || t.buyerWallet) + '</p>' +
            '<p><strong>Price :</strong> ' + t.price + ' Pi</p>' +
            '<p><strong>Date :</strong> ' + formatDate(t.eventDate) + '</p>' +
            '<p><strong>Purchased on :</strong> ' + formatDateTime(t.purchaseDate) + '</p>' +
            '<p style="color:#ef4444;">Past event</p>' +
        '</div>'; 
    }).join('');
}

function renderMyEvents() {
    var container = document.getElementById('myEventsList');
    if (!container) return;
    var user = window.currentUser || currentUser;
    var myEvents = events.filter(function(e) {
        return e.organizer === user?.wallet || e.organizerName === user?.username || e.organizer === user?.pi_uid;
    });
    if (myEvents.length === 0) {
        container.innerHTML = '<p style="text-align:center;padding:2rem;color:var(--gray);">You haven\'t created any events yet</p>';
        return;
    }
    container.innerHTML = myEvents.map(function(e) {
        var dateEvent = new Date(e.date);
        var dateFormatted = dateEvent.toLocaleDateString('en-US');
        var timeFormatted = dateEvent.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
        var fallbackImage = eventImagesList[e.category] || eventImagesList.Concert;
        return '<div class="event-card" style="cursor:default;">' +
            '<div class="event-card-banner">' +
                '<img src="' + (e.coverImage || fallbackImage) + '" alt="' + escapeHtml(e.title) + '" onerror="this.src=\'' + fallbackImage + '\'">' +
                '<span class="event-card-badge">' + escapeHtml(e.category) + '</span>' +
            '</div>' +
            '<div class="event-card-body">' +
                '<div class="event-card-title">' + escapeHtml(e.title) + '</div>' +
                '<div class="event-card-details">' +
                    '<div class="detail-item"><i class="fas fa-calendar-day"></i> ' + dateFormatted + '</div>' +
                    '<div class="detail-item"><i class="fas fa-clock"></i> ' + timeFormatted + '</div>' +
                    '<div class="detail-item"><i class="fas fa-map-marker-alt"></i> ' + escapeHtml(e.location || 'Online') + '</div>' +
                    '<div class="detail-item"><i class="fas fa-flag"></i> ' + escapeHtml(e.country || 'Not specified') + '</div>' +
                '</div>' +
                '<div class="event-card-footer">' +
                    '<div><span class="event-card-price">' + e.price + ' Pi</span> <span class="event-card-seats">' + e.seatsLeft + '/' + e.seatsTotal + ' seats</span></div>' +
                '</div>' +
            '</div>' +
        '</div>';
    }).join('');
}

function renderMyRatings() {
    var container = document.getElementById('myRatingsList');
    if (!container) return;
    var user = window.currentUser || currentUser;
    var myRatings = ratings.filter(function(r) { return r.userWallet === user?.wallet || r.userId === user?.pi_uid; });
    if (!myRatings.length) { container.innerHTML = '<p style="text-align:center;padding:2rem;">No ratings</p>'; return; }
    container.innerHTML = myRatings.map(function(r) { 
        var stars = ''; 
        for (var i = 0; i < r.rating; i++) stars += '★'; 
        for (var i = r.rating; i < 5; i++) stars += '☆'; 
        return '<div class="ticket-card"><h3>' + escapeHtml(r.eventTitle) + '</h3><div>Rating: ' + r.rating + '/5 ' + stars + '</div>' + (r.comment ? '<p>"' + escapeHtml(r.comment) + '"</p>' : '') + '<small>' + new Date(r.date).toLocaleDateString() + '</small></div>'; 
    }).join('');
}

// ============================================================
// ===== TICKET QUANTITY POPUP =====
// ============================================================

var selectedEventForPurchase = null;
var currentTicketQuantity = 1;

function openQuantityPopup(eventId) {
    var event = events.find(function(e) { return e.id === eventId; });
    if (!event) { alert('Event not found'); return; }
    var user = window.currentUser || currentUser;
    if (!user || !user.wallet && !user.pi_uid) {
        alert('Please connect your Pi account first');
        connectToPi();
        return;
    }
    if (event.seatsLeft <= 0) { alert('No seats available for this event'); return; }
    selectedEventForPurchase = event;
    currentTicketQuantity = 1;
    var popup = document.getElementById('quantityPopup');
    var titleEl = document.getElementById('quantityEventTitle');
    var infoEl = document.getElementById('quantityEventInfo');
    var maxInfo = document.getElementById('maxQuantityInfo');
    var quantityInput = document.getElementById('ticketQuantity');
    var totalDisplay = document.getElementById('totalPriceDisplay');
    if (titleEl) titleEl.textContent = event.title;
    if (infoEl) {
        var dateEvent = new Date(event.date);
        infoEl.textContent = dateEvent.toLocaleDateString('en-US') + ' at ' + dateEvent.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }) + ' | ' + event.location;
    }
    if (maxInfo) {
        var maxQty = Math.min(event.seatsLeft, 10);
        maxInfo.textContent = 'Maximum ' + maxQty + ' tickets available';
    }
    if (quantityInput) {
        quantityInput.value = 1;
        quantityInput.max = Math.min(event.seatsLeft, 10);
        quantityInput.min = 1;
    }
    if (totalDisplay) {
        totalDisplay.textContent = event.price + ' Pi';
    }
    popup.classList.add('show');
}

function closeQuantityPopup() {
    document.getElementById('quantityPopup').classList.remove('show');
    selectedEventForPurchase = null;
}

function updateQuantity(delta) {
    var input = document.getElementById('ticketQuantity');
    if (!input) return;
    var current = parseInt(input.value) || 1;
    var maxVal = parseInt(input.max) || 10;
    var newVal = current + delta;
    if (newVal < 1) newVal = 1;
    if (newVal > maxVal) newVal = maxVal;
    input.value = newVal;
    currentTicketQuantity = newVal;
    updateTotalPrice();
}

function updateTotalPrice() {
    var input = document.getElementById('ticketQuantity');
    var totalDisplay = document.getElementById('totalPriceDisplay');
    if (!input || !totalDisplay || !selectedEventForPurchase) return;
    var qty = parseInt(input.value) || 1;
    var total = qty * selectedEventForPurchase.price;
    totalDisplay.textContent = total.toFixed(6) + ' Pi';
}

function confirmPurchaseFromPopup() {
    if (!selectedEventForPurchase) {
        alert('No event selected');
        return;
    }
    
    var quantityInput = document.getElementById('ticketQuantity');
    var quantity = parseInt(quantityInput.value) || 1;
    
    if (quantity < 1) {
        alert('Please select at least 1 ticket');
        return;
    }
    
    if (quantity > selectedEventForPurchase.seatsLeft) {
        alert('Only ' + selectedEventForPurchase.seatsLeft + ' tickets available');
        return;
    }
    
    if (quantity > 10) {
        alert('Maximum 10 tickets per purchase');
        return;
    }
    
    confirmPurchase(selectedEventForPurchase.id, quantity);
}

// ============================================================
// ===== CONFIRMATION ACHAT =====
// ============================================================

async function confirmPurchase(eventId, quantity) {
    var event = events.find(function(e) { return e.id === eventId; });
    if (!event) { alert('Event not found'); return; }
    if (quantity > event.seatsLeft) { alert('Only ' + event.seatsLeft + ' seats available'); return; }
    var totalPrice = quantity * event.price;
    if (!confirm('Buy ' + quantity + ' ticket(s) for "' + event.title + '" (Total: ' + totalPrice.toFixed(6) + ' Pi) ?')) { return; }
    closeQuantityPopup();
    
    var user = window.currentUser || currentUser;
    
    try {
        var ticketsAdded = [];
        for (var i = 0; i < quantity; i++) {
            var ticket = {
                id: Date.now().toString() + '-' + i,
                eventId: event.id,
                eventTitle: event.title,
                eventDate: event.date,
                eventLocation: event.location,
                price: event.price,
                buyerWallet: user?.wallet || user?.pi_uid,
                buyerName: user?.username || user?.name,
                buyerId: user?.pi_uid,
                purchaseDate: new Date().toISOString(),
                purchaseDateTime: new Date().toLocaleString('en-US'),
                qrCode: generateQRCode(),
                ticketId: generateTicketId(),
                status: 'Valid'
            };
            tickets.push(ticket);
            ticketsAdded.push(ticket);
        }
        event.seatsLeft -= quantity;
        event.boosts = (event.boosts || 0) + quantity;
        saveEvents();
        saveTickets();
        addNotification('Purchase of ' + quantity + ' ticket(s) for "' + event.title + '" by ' + (user?.username || 'a user'), 'purchase');
        renderEventsByCategory();
        renderTickets();
        renderHistory();
        updateProfilePage();
        showSuccessPopup(event, ticketsAdded, quantity);
    } catch (error) { alert("Error: " + error.message); }
}

// ============================================================
// ===== SUCCESS POPUP =====
// ============================================================

function showSuccessPopup(event, ticketsList, quantity) {
    var popup = document.getElementById('successPopup');
    var title = document.getElementById('successTitle');
    var message = document.getElementById('successMessage');
    var info = document.getElementById('successTicketInfo');
    if (!popup) return;
    var qty = quantity || ticketsList.length;
    var ticket = ticketsList[0] || {};
    title.textContent = 'Purchase successful';
    message.textContent = qty + ' ticket(s) added successfully.';
    var dateEvent = new Date(event.date);
    var dateFormatted = dateEvent.toLocaleDateString('en-US');
    var timeFormatted = dateEvent.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    var totalPrice = qty * event.price;
    var codeDisplay = ticket.qrCode || 'N/A';
    info.innerHTML = 
        '<div class="ticket-line"><span class="ticket-label">Event</span><span class="ticket-value">' + escapeHtml(event.title) + '</span></div>' +
        '<div class="ticket-line"><span class="ticket-label">Date</span><span class="ticket-value">' + dateFormatted + ' at ' + timeFormatted + '</span></div>' +
        '<div class="ticket-line"><span class="ticket-label">Location</span><span class="ticket-value">' + escapeHtml(event.location || 'Online') + '</span></div>' +
        '<div class="ticket-line"><span class="ticket-label">Country</span><span class="ticket-value">' + escapeHtml(event.country || 'Not specified') + '</span></div>' +
        '<div class="ticket-line"><span class="ticket-label">Organizer</span><span class="ticket-value">' + escapeHtml(event.organizerName || event.organizer) + '</span></div>' +
        '<div class="ticket-line"><span class="ticket-label">Quantity</span><span class="ticket-value">' + qty + '</span></div>' +
        '<div class="ticket-line"><span class="ticket-label">Total</span><span class="ticket-value">' + totalPrice.toFixed(6) + ' Pi</span></div>' +
        '<div class="ticket-line"><span class="ticket-label">Code</span><span class="ticket-value" style="font-size:0.7rem;font-family:monospace;">' + codeDisplay + '</span></div>';
    popup.classList.add('show');
}

function closeSuccessPopup() {
    var popup = document.getElementById('successPopup');
    if (popup) {
        popup.classList.remove('show');
    }
}

// ============================================================
// ===== QR CODE FUNCTIONS =====
// ============================================================

function showTicketQR(qrCode) {
    var modal = document.createElement('div');
    modal.className = 'qr-modal';
    modal.innerHTML = `
        <div class="qr-modal-content">
            <span class="close-btn" onclick="this.parentElement.parentElement.remove()">&times;</span>
            <h3>Your QR Code</h3>
            <div class="qr-code-display">
                <img src="https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(qrCode)}" 
                     alt="QR Code" class="qr-image">
            </div>
            <p class="qr-text">${qrCode}</p>
            <button onclick="navigator.clipboard.writeText('${qrCode}')" class="btn-copy">
                Copy
            </button>
            <button onclick="validateTicketByQR('${qrCode}')" class="btn-validate">
                Validate this ticket
            </button>
        </div>
    `;
    document.body.appendChild(modal);
    
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            modal.remove();
        }
    });
}

// ============================================================
// ===== VALIDATE TICKET =====
// ============================================================

async function validateTicket(ticketId) {
    try {
        console.log('Validating ticket:', ticketId);
        
        var { data: ticket, error } = await supabaseClient
            .from('tickets')
            .select('*')
            .eq('id', ticketId)
            .single();
        
        if (error || !ticket) {
            alert('Ticket not found');
            return;
        }
        
        if (ticket.status === 'Used') {
            alert('This ticket has already been used');
            return;
        }
        
        if (ticket.status === 'Expired') {
            alert('This ticket has expired');
            return;
        }
        
        var confirm = window.confirm(
            'Validate this ticket?\n\n' +
            'ID: ' + (ticket.ticketId || ticket.id) + '\n' +
            'Buyer: ' + (ticket.buyerName || 'Unknown') + '\n' +
            'Event: ' + (ticket.eventTitle || 'Unknown')
        );
        
        if (!confirm) return;
        
        var { data, error: updateError } = await supabaseClient
            .from('tickets')
            .update({
                status: 'Used',
                used_at: new Date().toISOString()
            })
            .eq('id', ticketId)
            .select();
        
        if (updateError) {
            console.error('Error validating ticket:', updateError);
            alert('Error validating ticket');
            return;
        }
        
        alert('Ticket validated successfully!');
        renderTickets();
        renderHistory();
        
    } catch (error) {
        console.error('Error validating ticket:', error);
        alert('Error validating ticket');
    }
}

async function validateTicketByQR(qrCode) {
    try {
        console.log('Validating ticket by QR:', qrCode);
        
        var { data: ticket, error } = await supabaseClient
            .from('tickets')
            .select('*')
            .eq('qrCode', qrCode)
            .single();
        
        if (error || !ticket) {
            alert('Ticket not found');
            return;
        }
        
        if (ticket.status === 'Used') {
            alert('This ticket has already been used');
            return;
        }
        
        if (ticket.status === 'Expired') {
            alert('This ticket has expired');
            return;
        }
        
        await validateTicket(ticket.id);
        
    } catch (error) {
        console.error('Error validating ticket:', error);
        alert('Error validating ticket');
    }
}

// ============================================================
// ===== ADMIN FUNCTIONS =====
// ============================================================

function initAdmin() {
    var adminItem = document.getElementById('adminMenuItem');
    if (!adminItem) return;
    var logo = document.querySelector('.logo');
    var clicks = 0;
    if (logo) logo.addEventListener('click', function() { 
        clicks++; 
        if (clicks === 5) { 
            var pwd = prompt('Admin code:'); 
            if (pwd === adminPassword || pwd === 'Betix@2026#') { 
                localStorage.setItem('betix_admin_password', pwd);
                adminPassword = pwd;
                adminItem.style.display = 'block'; 
                adminItem.style.background = 'linear-gradient(135deg, #1a1a2e, #0D47A1)';
                adminItem.style.color = 'white';
                addAdminLog('Admin authentication', 'Login via logo');
                alert('Admin activated'); 
            } 
            clicks = 0; 
        } 
        setTimeout(function() { clicks = 0; }, 2000); 
    });
    if (localStorage.getItem('betix_admin_password') === adminPassword || localStorage.getItem('betix_admin_password') === 'Betix@2026#') {
        adminItem.style.display = 'block';
        adminItem.style.background = 'linear-gradient(135deg, #1a1a2e, #0D47A1)';
        adminItem.style.color = 'white';
    }
}

function loadAdminPage() {
    var storedPassword = localStorage.getItem('betix_admin_password');
    if (storedPassword !== adminPassword && storedPassword !== 'Betix@2026#') {
        alert('Access denied. Please authenticate via 5 clicks on the logo.');
        showPage('home');
        return;
    }
    if (storedPassword && storedPassword !== adminPassword) {
        adminPassword = storedPassword;
    }
    document.getElementById('adminUserCount').innerText = connectedUsers.length || 1;
    document.getElementById('adminTicketCount').innerText = tickets.length;
    document.getElementById('adminEventCount').innerText = events.length;
    var lastLogin = localStorage.getItem('betix_admin_last_login') || 'Never';
    var loginCount = localStorage.getItem('betix_admin_login_count') || 0;
    document.getElementById('adminLastLogin').textContent = lastLogin;
    document.getElementById('adminLoginCount').textContent = loginCount;
    document.getElementById('adminCurrentPasswordDisplay').textContent = '••••••••';
    renderAdminEvents();
    renderAdminSlides();
    renderAdminUsers();
    renderAdminLogs();
    initAdminTabs();
    if (!adminTimerInterval) {
        startAdminSession();
    }
    var userSearch = document.getElementById('adminUserSearch');
    if (userSearch) {
        userSearch.addEventListener('input', function() {
            filterAdminUsers(this.value);
        });
    }
}

function renderAdminEvents() {
    var container = document.getElementById('adminEventsList');
    if (!container) return;
    if (events.length === 0) {
        container.innerHTML = '<p style="color: var(--gray); text-align:center; padding:20px;">No events created</p>';
        return;
    }
    container.innerHTML = events.map(function(e) {
        return '<div class="admin-event-item">' +
            '<div class="event-info">' +
                '<strong>' + escapeHtml(e.title) + '</strong>' +
                '<small>' + e.category + ' | ' + e.country + ' | ' + e.seatsLeft + '/' + e.seatsTotal + ' seats | ' + new Date(e.date).toLocaleDateString('en-US') + '</small>' +
                '<small>Organizer: ' + escapeHtml(e.organizerName || e.organizer) + '</small>' +
            '</div>' +
            '<div class="event-actions">' +
                '<button class="admin-delete-btn" onclick="adminDeleteEvent(\'' + e.id + '\')">Delete</button>' +
            '</div>' +
        '</div>';
    }).join('');
}

function adminDeleteEvent(id) {
    if (confirm('Delete this event?')) {
        events = events.filter(function(e) { return e.id !== id; });
        saveEvents();
        renderAdminEvents();
        renderEventsByCategory();
        document.getElementById('adminEventCount').innerText = events.length;
        addAdminLog('Event deleted', 'ID: ' + id);
        alert('Event deleted');
    }
}

function adminDeleteAllEvents() {
    if (confirm('Delete ALL events? This action is irreversible.')) {
        events = [];
        saveEvents();
        renderAdminEvents();
        renderEventsByCategory();
        document.getElementById('adminEventCount').innerText = 0;
        addAdminLog('All events deleted', 'Mass deletion');
        alert('All events have been deleted');
    }
}

function renderAdminSlides() {
    var container = document.getElementById('adminSlidesList');
    if (!container) return;
    if (heroSlides.length === 0) {
        container.innerHTML = '<p style="color: var(--gray); text-align:center; padding:20px;">No images in carousel</p>';
        return;
    }
    container.innerHTML = heroSlides.map(function(slide, index) {
        return '<div class="admin-slide-item">' +
            '<img src="' + slide.image + '" class="slide-preview" onerror="this.style.display=\'none\'">' +
            '<div class="slide-info">' +
                '<h4>' + escapeHtml(slide.title) + '</h4>' +
                '<p>' + (slide.badge || 'Uncategorized') + ' • ' + (slide.description || '') + '</p>' +
            '</div>' +
            '<div class="slide-actions">' +
                '<button class="edit-btn" onclick="adminEditSlide(' + index + ')">Edit</button>' +
                '<button class="delete-btn" onclick="adminDeleteSlide(' + index + ')">Delete</button>' +
            '</div>' +
        '</div>';
    }).join('');
}

function adminShowSlideForm(index) {
    var container = document.getElementById('adminSlideFormContainer');
    var title = document.getElementById('adminSlideFormTitle');
    var imageInput = document.getElementById('adminSlideImageInput');
    var preview = document.getElementById('adminSlidePreview');
    var uploadBox = document.getElementById('adminUploadBox');
    preview.style.display = 'none';
    preview.src = '';
    uploadBox.classList.remove('has-image');
    imageInput.value = '';
    container.style.display = 'block';
    if (index >= 0 && index < heroSlides.length) {
        title.textContent = 'Edit carousel image';
        document.getElementById('adminSlideBadge').value = heroSlides[index].badge || '';
        document.getElementById('adminSlideTitle').value = heroSlides[index].title || '';
        document.getElementById('adminSlideDesc').value = heroSlides[index].description || '';
        document.getElementById('adminEditSlideIndex').value = index;
        if (heroSlides[index].image) {
            preview.src = heroSlides[index].image;
            preview.style.display = 'block';
            uploadBox.classList.add('has-image');
        }
    } else {
        title.textContent = 'Add carousel image';
        document.getElementById('adminSlideBadge').value = '';
        document.getElementById('adminSlideTitle').value = '';
        document.getElementById('adminSlideDesc').value = '';
        document.getElementById('adminEditSlideIndex').value = '-1';
    }
    container.scrollIntoView({ behavior: 'smooth' });
}

function adminSaveSlide() {
    var imageInput = document.getElementById('adminSlideImageInput');
    var badgeInput = document.getElementById('adminSlideBadge');
    var titleInput = document.getElementById('adminSlideTitle');
    var descInput = document.getElementById('adminSlideDesc');
    var editIndex = document.getElementById('adminEditSlideIndex');
    var preview = document.getElementById('adminSlidePreview');
    var badge = badgeInput.value.trim();
    var title = titleInput.value.trim();
    var description = descInput.value.trim();
    if (!title) {
        alert('Please enter a title');
        return;
    }
    var imageData = null;
    if (imageInput.files && imageInput.files[0]) {
        var file = imageInput.files[0];
        if (!file.type.startsWith('image/')) {
            alert('Please select an image');
            return;
        }
        if (file.size > 5 * 1024 * 1024) {
            alert('Image is too large (max 5MB)');
            return;
        }
        var reader = new FileReader();
        reader.onload = function(e) {
            imageData = e.target.result;
            saveSlideData(imageData, badge, title, description, parseInt(editIndex.value));
        };
        reader.readAsDataURL(file);
    } else {
        var index = parseInt(editIndex.value);
        if (index >= 0 && index < heroSlides.length) {
            imageData = heroSlides[index].image;
            saveSlideData(imageData, badge, title, description, index);
        } else {
            alert('Please select an image');
            return;
        }
    }
}

function saveSlideData(image, badge, title, description, index) {
    var slideData = { image: image, badge: badge, title: title, description: description };
    if (index >= 0 && index < heroSlides.length) {
        heroSlides[index] = slideData;
    } else {
        heroSlides.push(slideData);
    }
    localStorage.setItem('betix_hero_slides', JSON.stringify(heroSlides));
    adminCancelSlideForm();
    renderAdminSlides();
    initHeroSlider();
    addAdminLog('Slide modified', 'Title: ' + title);
    alert('Image saved successfully!');
}

function adminDeleteSlide(index) {
    if (!confirm('Delete this carousel image?')) return;
    var title = heroSlides[index]?.title || 'Untitled';
    heroSlides.splice(index, 1);
    localStorage.setItem('betix_hero_slides', JSON.stringify(heroSlides));
    renderAdminSlides();
    initHeroSlider();
    addAdminLog('Slide deleted', 'Title: ' + title);
}

function adminEditSlide(index) {
    adminShowSlideForm(index);
}

function adminCancelSlideForm() {
    document.getElementById('adminSlideFormContainer').style.display = 'none';
    document.getElementById('adminEditSlideIndex').value = '-1';
    document.getElementById('adminSlideImageInput').value = '';
    document.getElementById('adminSlidePreview').style.display = 'none';
    document.getElementById('adminSlidePreview').src = '';
    document.getElementById('adminUploadBox').classList.remove('has-image');
}

function renderAdminUsers() {
    var container = document.getElementById('adminUsersList');
    if (!container) return;
    var html = '<table>';
    html += '<tr><th>User</th><th>Pi Account</th><th>Tickets</th><th>Average Rating</th><th>Last Seen</th></tr>';
    var user = window.currentUser || currentUser;
    var userRatings = ratings.filter(function(r) { return r.userWallet === user?.wallet || r.userId === user?.pi_uid; });
    var avgRating = 0;
    if (userRatings.length > 0) {
        avgRating = userRatings.reduce(function(a, r) { return a + r.rating; }, 0) / userRatings.length;
    }
    html += '<tr><td>' + escapeHtml(user?.username || user?.name || 'Guest') + ' <span style="color:#f5a623;font-size:0.7rem;">(you)</span></td>' +
            '<td>' + (user?.wallet || 'Not connected') + '</td>' +
            '<td>' + tickets.length + '</td>' +
            '<td>' + (avgRating > 0 ? avgRating.toFixed(1) + '/5' : '-') + '</td>' +
            '<td>Active</td></tr>';
    for (var i = 0; i < connectedUsers.length; i++) {
        var u = connectedUsers[i];
        if (u.wallet !== user?.wallet) {
            var uRatings = ratings.filter(function(r) { return r.userWallet === u.wallet; });
            var uAvg = 0;
            if (uRatings.length > 0) {
                uAvg = uRatings.reduce(function(a, r) { return a + r.rating; }, 0) / uRatings.length;
            }
            html += '<tr><td>' + escapeHtml(u.name) + '</td>' +
                    '<td>' + (u.wallet || 'Not connected') + '</td>' +
                    '<td>' + (u.ticketCount || 0) + '</td>' +
                    '<td>' + (uAvg > 0 ? uAvg.toFixed(1) + '/5' : '-') + '</td>' +
                    '<td>' + (u.lastSeen || 'Unknown') + '</td></tr>';
        }
    }
    html += '</table>';
    container.innerHTML = html;
}

function filterAdminUsers(query) {
    var container = document.getElementById('adminUsersList');
    if (!container) return;
    var rows = container.querySelectorAll('tr');
    var search = query.toLowerCase().trim();
    rows.forEach(function(row, index) {
        if (index === 0) return;
        var text = row.textContent.toLowerCase();
        if (search === '' || text.includes(search)) {
            row.style.display = '';
        } else {
            row.style.display = 'none';
        }
    });
}

function initAdminTabs() {
    var tabs = document.querySelectorAll('.admin-tab');
    var contents = {
        events: document.getElementById('adminTabEvents'),
        slides: document.getElementById('adminTabSlides'),
        users: document.getElementById('adminTabUsers'),
        logs: document.getElementById('adminTabLogs'),
        settings: document.getElementById('adminTabSettings')
    };
    tabs.forEach(function(tab) {
        tab.addEventListener('click', function() {
            tabs.forEach(function(t) { t.classList.remove('active'); });
            this.classList.add('active');
            for (var key in contents) {
                if (contents[key]) {
                    contents[key].classList.remove('active');
                }
            }
            var tabName = this.dataset.tab;
            if (contents[tabName]) {
                contents[tabName].classList.add('active');
            }
        });
    });
}

function startAdminSession() {
    addAdminLog('Admin login', 'Access to administration interface');
    var lastLogin = localStorage.getItem('betix_admin_last_login');
    var loginCount = parseInt(localStorage.getItem('betix_admin_login_count') || 0) + 1;
    localStorage.setItem('betix_admin_login_count', loginCount);
    localStorage.setItem('betix_admin_last_login', new Date().toLocaleString('en-US'));
    adminSessionTimer = 1800;
    updateAdminTimerDisplay();
    if (adminTimerInterval) {
        clearInterval(adminTimerInterval);
    }
    adminTimerInterval = setInterval(function() {
        adminSessionTimer--;
        updateAdminTimerDisplay();
        if (adminSessionTimer <= 0) {
            clearInterval(adminTimerInterval);
            adminTimerInterval = null;
            adminLogout();
        }
    }, 1000);
    document.addEventListener('click', resetAdminTimer);
    document.addEventListener('keydown', resetAdminTimer);
    document.addEventListener('scroll', resetAdminTimer);
}

function resetAdminTimer() {
    if (adminTimerInterval) {
        adminSessionTimer = 1800;
        updateAdminTimerDisplay();
    }
}

function updateAdminTimerDisplay() {
    var display = document.getElementById('adminSessionTimer');
    if (display) {
        var minutes = Math.floor(adminSessionTimer / 60);
        var seconds = adminSessionTimer % 60;
        display.textContent = String(minutes).padStart(2, '0') + ':' + String(seconds).padStart(2, '0');
        if (adminSessionTimer < 300) {
            display.style.color = '#ef4444';
        } else if (adminSessionTimer < 600) {
            display.style.color = '#f59e0b';
        } else {
            display.style.color = '#f5a623';
        }
    }
}

function adminLogout() {
    if (adminTimerInterval) {
        clearInterval(adminTimerInterval);
        adminTimerInterval = null;
    }
    document.removeEventListener('click', resetAdminTimer);
    document.removeEventListener('keydown', resetAdminTimer);
    document.removeEventListener('scroll', resetAdminTimer);
    addAdminLog('Admin logout', 'Session ended');
    localStorage.removeItem('betix_admin_password');
    var adminBtn = document.getElementById('adminMenuItem');
    if (adminBtn) {
        adminBtn.style.display = 'none';
    }
    alert('Admin session ended');
    showPage('home');
}

function adminChangePassword() {
    var newPassword = document.getElementById('adminNewPassword').value;
    var confirmPassword = document.getElementById('adminConfirmPassword').value;
    var message = document.getElementById('adminPasswordMessage');
    if (!newPassword || newPassword.length < 6) {
        message.textContent = 'Password must be at least 6 characters';
        message.style.color = '#ef4444';
        return;
    }
    if (newPassword !== confirmPassword) {
        message.textContent = 'Passwords do not match';
        message.style.color = '#ef4444';
        return;
    }
    adminPassword = newPassword;
    localStorage.setItem('betix_admin_password', newPassword);
    message.textContent = 'Password changed successfully!';
    message.style.color = '#10b981';
    document.getElementById('adminNewPassword').value = '';
    document.getElementById('adminConfirmPassword').value = '';
    addAdminLog('Password changed', 'Admin password was updated');
    setTimeout(function() {
        message.textContent = '';
    }, 3000);
}

// ============================================================
// ===== NOTIFICATIONS PAGE =====
// ============================================================

function renderNotificationsPage() {
    var container = document.getElementById('notificationsList');
    if (!container) return;
    if (!notifications || notifications.length === 0) {
        container.innerHTML = '<div class="notification-empty"><i class="fas fa-bell-slash"></i>No notifications</div>';
        return;
    }
    var html = '';
    for (var i = 0; i < notifications.length; i++) {
        var notif = notifications[i];
        var time = new Date(notif.date);
        var timeStr = time.toLocaleDateString('en-US') + ' ' + time.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
        var unreadClass = notif.read ? '' : 'unread';
        var icon = notif.type === 'purchase' ? 'fa-shopping-cart' : notif.type === 'event' ? 'fa-calendar-plus' : 'fa-info-circle';
        html += '<div class="notification-item ' + unreadClass + '">' +
            '<div class="notif-icon"><i class="fas ' + icon + '"></i></div>' +
            '<div class="notif-content">' +
                '<div class="notif-msg">' + escapeHtml(notif.message) + '</div>' +
                '<div class="notif-time">' + timeStr + '</div>' +
            '</div>' +
        '</div>';
        notifications[i].read = true;
    }
    container.innerHTML = html;
    saveNotifications();
    updateNotifBadgeHeader();
}

// ============================================================
// ===== HERO SLIDER =====
// ============================================================

function initHeroSlider() {
    var slidesContainer = document.getElementById('heroSlides');
    if (!slidesContainer) return;
    slidesContainer.innerHTML = '';
    heroSlides.forEach(function(slide, index) {
        var div = document.createElement('div');
        div.className = 'hero-slide' + (index === 0 ? ' active' : '');
        div.innerHTML = '<div class="hero-slide-bg" style="background-image: url(\'' + slide.image + '\');"></div><div class="hero-slide-content"><div class="hero-badge">' + (slide.badge || 'Event') + '</div><h2>' + slide.title + '</h2><p>' + (slide.description || '') + '</p></div>';
        slidesContainer.appendChild(div);
    });
    var dotsContainer = document.getElementById('heroDots');
    if (dotsContainer) {
        dotsContainer.innerHTML = '';
        heroSlides.forEach(function(slide, i) {
            var dot = document.createElement('button');
            dot.className = 'dot' + (i === 0 ? ' active' : '');
            dot.setAttribute('data-index', i);
            dot.addEventListener('click', function() {
                var index = parseInt(this.getAttribute('data-index'));
                stopAutoPlay();
                goToSlide(index);
                setTimeout(startAutoPlay, 3000);
            });
            dotsContainer.appendChild(dot);
        });
    }
    var slides = document.querySelectorAll('.hero-slide');
    var dots = document.querySelectorAll('.hero-dots .dot');
    var prevBtn = document.getElementById('heroPrev');
    var nextBtn = document.getElementById('heroNext');
    var currentIndex = 0;
    var totalSlides = heroSlides.length;
    var autoPlayInterval = null;
    var isTransitioning = false;

    function goToSlide(index) {
        if (isTransitioning || totalSlides === 0) return;
        isTransitioning = true;
        if (index < 0) index = totalSlides - 1;
        if (index >= totalSlides) index = 0;
        currentIndex = index;
        var offset = -currentIndex * 100;
        slidesContainer.style.transform = 'translateX(' + offset + '%)';
        slides.forEach(function(slide, i) {
            slide.classList.remove('active');
            if (i === currentIndex) {
                slide.classList.add('active');
                var bg = slide.querySelector('.hero-slide-bg');
                if (bg) {
                    bg.style.transition = 'none';
                    bg.style.transform = 'scale(1.05)';
                    setTimeout(function() {
                        bg.style.transition = 'transform 8s ease';
                        bg.style.transform = 'scale(1)';
                    }, 50);
                }
            }
        });
        dots.forEach(function(dot, i) {
            dot.classList.remove('active');
            if (i === currentIndex) dot.classList.add('active');
        });
        setTimeout(function() {
            isTransitioning = false;
        }, 800);
    }

    function nextSlide() {
        if (totalSlides > 0) goToSlide(currentIndex + 1);
    }

    function prevSlide() {
        if (totalSlides > 0) goToSlide(currentIndex - 1);
    }

    function startAutoPlay() {
        if (autoPlayInterval) clearInterval(autoPlayInterval);
        if (totalSlides > 1) {
            autoPlayInterval = setInterval(nextSlide, 4000);
        }
    }

    function stopAutoPlay() {
        if (autoPlayInterval) {
            clearInterval(autoPlayInterval);
            autoPlayInterval = null;
        }
    }

    if (prevBtn) {
        prevBtn.onclick = function() {
            stopAutoPlay();
            prevSlide();
            setTimeout(startAutoPlay, 3000);
        };
    }
    if (nextBtn) {
        nextBtn.onclick = function() {
            stopAutoPlay();
            nextSlide();
            setTimeout(startAutoPlay, 3000);
        };
    }
    var hero = document.querySelector('.hero');
    if (hero) {
        hero.onmouseenter = stopAutoPlay;
        hero.onmouseleave = startAutoPlay;
    }
    startAutoPlay();
}

// ============================================================
// ===== FAQ =====
// ============================================================

var faqData = [
    [
        { q: "What is Betix?", a: "Betix is the first decentralized event ticketing platform built on the Pi Network blockchain." },
        { q: "How does Betix work?", a: "Betix uses the Pi Network blockchain to ensure secure and transparent transactions." },
        { q: "Is Betix free?", a: "Yes! Betix is completely free for users. No commission on sales." },
        { q: "Who can use Betix?", a: "Any Pi Network account holder can use Betix." }
    ],
    [
        { q: "How to buy a ticket?", a: "Connect, browse events, click 'Buy Ticket' and choose the quantity." },
        { q: "Are payments secure?", a: "Yes, via the Pi Network and Betix's escrow system." },
        { q: "Can I get a refund?", a: "Yes in case of cancellation, postponement or fraud." },
        { q: "Where are my tickets stored?", a: "In the 'My Tickets' section of your account." }
    ],
    [
        { q: "How to create an event?", a: "Connect, click 'Create Event' and fill out the form." },
        { q: "Conditions to be an organizer?", a: "Have an active Pi Network account and comply with the terms of use." },
        { q: "Can I modify an event?", a: "Yes, from the 'My Events' section (coming soon)." },
        { q: "How to boost my event?", a: "By paying a small amount in Pi to increase visibility." }
    ],
    [
        { q: "How to connect my Pi account?", a: "Click 'Connect Pi' in the menu and authorize access." },
        { q: "What is the escrow system?", a: "A mechanism that blocks funds until event validation." },
        { q: "Are transactions anonymous?", a: "Transactions are traceable on the blockchain, but your information remains private." },
        { q: "Other cryptocurrencies?", a: "Currently only Pi Network." }
    ],
    [
        { q: "Buyer protection?", a: "Via escrow, organizer verification and a refund policy." },
        { q: "Report a problem?", a: "Via chat, email or social networks." },
        { q: "Contact support?", a: "Online chat, email or Telegram." },
        { q: "Available languages?", a: "English, French, Portuguese, Chinese, Indonesian." }
    ],
    [
        { q: "Join the community?", a: "Follow us on Telegram, Twitter, Discord, Instagram and WhatsApp." },
        { q: "Become an ambassador?", a: "Contact us to apply for the ambassador program." },
        { q: "Become a partner?", a: "Contact us to discuss partnership opportunities." },
        { q: "Future projects?", a: "Mobile app, new cryptocurrencies, social features." }
    ]
];

var currentFaqPage = 0;

function renderFaqPage(pageIndex) {
    var container = document.getElementById('faqContainer');
    var pageNumber = document.getElementById('faqPageNumber');
    var totalPages = document.getElementById('faqTotalPages');
    var prevBtn = document.getElementById('faqPrevBtn');
    var nextBtn = document.getElementById('faqNextBtn');
    var dotsContainer = document.getElementById('faqPageDots');
    if (!container) return;
    var pageData = faqData[pageIndex] || faqData[0];
    var total = faqData.length;
    if (pageNumber) pageNumber.textContent = pageIndex + 1;
    if (totalPages) totalPages.textContent = total;
    var html = '';
    pageData.forEach(function(item, index) {
        html += '<div class="faq-item" style="animation-delay: ' + (index * 0.04) + 's">' +
            '<div class="faq-q"><span class="q-icon">Q</span>' + item.q + '</div>' +
            '<div class="faq-a">' + item.a + '</div>' +
        '</div>';
    });
    container.innerHTML = html;
    if (prevBtn) prevBtn.disabled = pageIndex === 0;
    if (nextBtn) nextBtn.disabled = pageIndex >= total - 1;
    if (dotsContainer) {
        dotsContainer.innerHTML = '';
        for (var i = 0; i < total; i++) {
            var dot = document.createElement('button');
            dot.className = 'faq-page-dot' + (i === pageIndex ? ' active' : '');
            dot.setAttribute('data-page', i);
            dot.addEventListener('click', function() {
                currentFaqPage = parseInt(this.getAttribute('data-page'));
                renderFaqPage(currentFaqPage);
                var faqContent = document.querySelector('.faq-page-content');
                if (faqContent) {
                    setTimeout(function() {
                        faqContent.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    }, 100);
                }
            });
            dotsContainer.appendChild(dot);
        }
    }
    var faqContent = document.querySelector('.faq-page-content');
    if (faqContent) {
        setTimeout(function() {
            faqContent.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 100);
    }
}

function initFaq() {
    console.log('Initializing FAQ...');
    renderFaqPage(0);
    initFaqPagination();
}

function initFaqPagination() {
    var prevBtn = document.getElementById('faqPrevBtn');
    var nextBtn = document.getElementById('faqNextBtn');
    if (prevBtn) {
        prevBtn.addEventListener('click', function() {
            if (currentFaqPage > 0) {
                currentFaqPage--;
                renderFaqPage(currentFaqPage);
            }
        });
    }
    if (nextBtn) {
        nextBtn.addEventListener('click', function() {
            if (currentFaqPage < faqData.length - 1) {
                currentFaqPage++;
                renderFaqPage(currentFaqPage);
            }
        });
    }
}

// ============================================================
// ===== CHAT INIT =====
// ============================================================

function initChat() {
    var widget = document.getElementById('chatWidget');
    var btn = document.getElementById('chatFloatBtn');
    var close = document.getElementById('chatCloseBtn');
    var send = document.getElementById('chatSendBtn');
    var input = document.getElementById('chatInput');
    var msgs = document.getElementById('chatMessages');
    if (!widget) return;
    
    function load() {
        if (!msgs) return;
        msgs.innerHTML = '';
        if (!chatMessages || chatMessages.length === 0) {
            var emptyMsg = document.createElement('div');
            emptyMsg.className = 'chat-message support';
            emptyMsg.innerHTML = '<div class="message-bubble">Hello! How can we help you today?</div>';
            msgs.appendChild(emptyMsg);
            return;
        }
        for (var i = 0; i < chatMessages.length; i++) {
            addMessage(chatMessages[i]);
        }
    }
    
    function addMessage(m) {
        if (!msgs) return;
        var d = document.createElement('div');
        d.className = 'chat-message ' + (m.isUser ? 'user' : 'support');
        d.innerHTML = '<div class="message-bubble">' + escapeHtml(m.text) + '</div><span class="message-time">' + m.time + '</span>';
        msgs.appendChild(d);
        msgs.scrollTop = msgs.scrollHeight;
    }
    
    if (btn) btn.addEventListener('click', function() { widget.classList.toggle('open'); });
    if (close) close.addEventListener('click', function() { widget.classList.remove('open'); });
    
    function sendMsg() {
        var msg = input.value.trim();
        if (!msg) return;
        var newMsg = {
            id: Date.now(),
            text: msg,
            sender: currentUser?.wallet || currentUser?.name || 'User',
            isUser: true,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            timestamp: new Date().toISOString()
        };
        chatMessages.push(newMsg);
        saveChatMessages();
        addMessage(newMsg);
        input.value = '';
        setTimeout(function() {
            var resp = "Thank you! Quick response by email: betixservices@gmail.com";
            if (msg.toLowerCase().includes('ticket')) {
                resp = "Your tickets are in the 'My Tickets' section.";
            } else if (msg.toLowerCase().includes('payment')) {
                resp = "Payments are secured via Pi Network.";
            }
            var auto = {
                id: Date.now() + 1,
                text: resp,
                sender: 'Betix Support',
                isUser: false,
                time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                timestamp: new Date().toISOString()
            };
            chatMessages.push(auto);
            saveChatMessages();
            addMessage(auto);
        }, 1000);
    }
    
    if (send) send.addEventListener('click', sendMsg);
    if (input) input.addEventListener('keypress', function(e) { if (e.key === 'Enter') sendMsg(); });
    load();
}

// ============================================================
// ===== LEGAL MODALS =====
// ============================================================

function showLegal(type) {
    var modal = document.getElementById('legalModal');
    var content = document.getElementById('modalContent');
    var closeBtn = document.getElementById('legalModalClose');
    var texts = {
        terms: '<h2>Terms of Service</h2><p><strong>Last updated:</strong> June 2026</p><p>Welcome to Betix. By using our platform, you agree to these terms.</p><h3>1. Acceptance of Terms</h3><p>By accessing and using Betix, you accept and agree to be bound by these Terms of Service.</p><h3>2. User Accounts</h3><p>You must connect a valid Pi Network wallet to use certain features. You are responsible for maintaining the security of your wallet.</p><h3>3. Events and Tickets</h3><p>Organizers are responsible for the accuracy of event information. Tickets are digital and non-transferable.</p><h3>4. Payments</h3><p>All payments are made in Pi cryptocurrency. Transactions are final and irreversible.</p><h3>5. Cancellations</h3><p>Organizers may cancel events. In such cases, tickets will be refunded in Pi.</p><h3>6. Prohibited Activities</h3><p>You may not use Betix for illegal activities, fraud, or to distribute harmful content.</p><h3>7. Limitation of Liability</h3><p>Betix is provided "as is" without warranties of any kind. We are not liable for any damages arising from your use of the platform.</p><h3>8. Changes to Terms</h3><p>We reserve the right to modify these terms at any time. Continued use constitutes acceptance of changes.</p><h3>9. Contact</h3><p>For questions about these terms, contact us at betixservices@gmail.com</p>',
        privacy: '<h2>Privacy Policy</h2><p><strong>Last updated:</strong> June 2026</p><p>Betix is committed to protecting your privacy. This policy explains how we collect, use, and protect your personal information.</p><h3>1. Information We Collect</h3><p>We collect information you provide directly, such as your Pi wallet address, name, and profile photo. We also collect usage data and device information.</p><h3>2. How We Use Information</h3><p>We use your information to provide and improve our services, process transactions, communicate with you, and ensure platform security.</p><h3>3. Data Storage</h3><p>Your data is stored securely on our servers. We use encryption to protect your personal information.</p><h3>4. Data Sharing</h3><p>We do not sell your personal information. We may share data with service providers who assist us in operating the platform.</p><h3>5. Your Rights</h3><p>You have the right to access, correct, or delete your personal data. Contact us to exercise these rights.</p><h3>6. Cookies</h3><p>We use cookies to improve your experience. You can control cookie preferences in your browser settings.</p><h3>7. Security</h3><p>We implement security measures to protect your data from unauthorized access, alteration, or disclosure.</p><h3>8. Children\'s Privacy</h3><p>Our platform is not directed at children under 13. We do not knowingly collect data from children.</p><h3>9. Changes to Policy</h3><p>We may update this policy from time to time. We will notify you of significant changes.</p><h3>10. Contact</h3><p>For privacy concerns, contact us at betixservices@gmail.com</p>',
        cookies: '<h2>Cookie Policy</h2><p><strong>Last updated:</strong> June 2026</p><p>This policy explains how Betix uses cookies and similar technologies.</p><h3>1. What are Cookies</h3><p>Cookies are small text files stored on your device that help us provide and improve our services.</p><h3>2. Types of Cookies We Use</h3><p><strong>Essential Cookies:</strong> Required for basic platform functionality.</p><p><strong>Preference Cookies:</strong> Remember your language and settings preferences.</p><p><strong>Analytics Cookies:</strong> Help us understand how users interact with our platform.</p><h3>3. Managing Cookies</h3><p>You can control cookies through your browser settings. Disabling cookies may affect platform functionality.</p><h3>4. Third-Party Cookies</h3><p>We may use third-party services that set their own cookies. We do not control these cookies.</p><h3>5. Updates</h3><p>We may update this policy periodically. Please check back regularly for changes.</p><h3>6. Contact</h3><p>For questions about our cookie policy, contact us at betixservices@gmail.com</p>',
        legal: '<h2>Legal Notices</h2><p><strong>Last updated:</strong> June 2026</p><h3>1. Publisher</h3><p>Betix is a decentralized event platform built on Pi Network.</p><h3>2. Contact Information</h3><p>Email: betixservices@gmail.com</p><p>Website: betixapp.vercel.app</p><h3>3. Intellectual Property</h3><p>All content on this platform, including text, images, and logos, is the property of Betix and protected by copyright laws.</p><h3>4. Disclaimer</h3><p>Information provided on this platform is for general informational purposes only. We do not guarantee the accuracy or completeness of information.</p><h3>5. Governing Law</h3><p>These legal notices are governed by the laws of the jurisdiction where Betix operates.</p><h3>6. Dispute Resolution</h3><p>Any disputes arising from your use of the platform shall be resolved through arbitration in accordance with applicable laws.</p>'
    };
    if (content) {
        content.innerHTML = texts[type] || '<p>Information in progress</p>';
    }
    if (modal) {
        modal.classList.add('show');
    }
    if (closeBtn) {
        closeBtn.onclick = function() {
            modal.classList.remove('show');
        };
    }
    window.onclick = function(e) {
        if (e.target === modal) {
            modal.classList.remove('show');
        }
    };
}

// ============================================================
// ===== NOTIFICATIONS PANEL =====
// ============================================================

function openNotificationPanel() {
    var panel = document.getElementById('notificationPanel');
    if (panel) {
        panel.classList.toggle('open');
        if (panel.classList.contains('open')) {
            renderNotificationPanel();
        }
    }
}

function closeNotificationPanel() {
    var panel = document.getElementById('notificationPanel');
    if (panel) {
        panel.classList.remove('open');
    }
}

function renderNotificationPanel() {
    var container = document.getElementById('notificationPanelBody');
    if (!container) return;
    if (!notifications || notifications.length === 0) {
        container.innerHTML = '<div class="notification-empty"><i class="fas fa-bell-slash"></i>No notifications</div>';
        return;
    }
    var html = '';
    for (var i = 0; i < Math.min(notifications.length, 20); i++) {
        var notif = notifications[i];
        var time = new Date(notif.date);
        var timeStr = time.toLocaleDateString('en-US') + ' ' + time.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
        var unreadClass = notif.read ? '' : 'unread';
        var icon = notif.type === 'purchase' ? 'fa-shopping-cart' : notif.type === 'event' ? 'fa-calendar-plus' : 'fa-info-circle';
        html += '<div class="notification-item ' + unreadClass + '">' +
            '<div class="notif-icon"><i class="fas ' + icon + '"></i></div>' +
            '<div class="notif-content">' +
                '<div class="notif-msg">' + escapeHtml(notif.message) + '</div>' +
                '<div class="notif-time">' + timeStr + '</div>' +
            '</div>' +
        '</div>';
        notifications[i].read = true;
    }
    container.innerHTML = html;
    saveNotifications();
    updateNotifBadgeHeader();
}

function toggleNotifications() {
    openNotificationPanel();
}

// ============================================================
// ===== CLEAR DATA =====
// ============================================================

function clearAllData() { 
    if (confirm('Delete all your data?')) { 
        localStorage.clear(); 
        location.reload(); 
    } 
}

function toggleDarkMode(e) { 
    if (e.target.checked) { 
        document.body.classList.add('dark-mode'); 
        localStorage.setItem('darkMode', 'true'); 
    } else { 
        document.body.classList.remove('dark-mode'); 
        localStorage.setItem('darkMode', 'false'); 
    } 
}

function handleLogoClick() {
    logoClickCount++;
    console.log('Logo clicks:', logoClickCount);
    if (logoClickCount >= 5) {
        var password = prompt('Enter administrator password:');
        if (password === adminPassword || password === 'Betix@2026#') {
            localStorage.setItem('betix_admin_password', password);
            adminPassword = password;
            var adminBtn = document.getElementById('adminMenuItem');
            if (adminBtn) {
                adminBtn.style.display = 'block';
                adminBtn.style.background = 'linear-gradient(135deg, #1a1a2e, #0D47A1)';
                adminBtn.style.color = 'white';
            }
            addAdminLog('Admin authentication', 'Login via logo');
            alert('Administrator access activated!');
            logoClickCount = 0;
        } else if (password !== null) {
            alert('Incorrect password');
            logoClickCount = 0;
        } else {
            logoClickCount = 0;
        }
    }
}

// ============================================================
// ===== DOM CONTENT LOADED =====
// ============================================================

document.addEventListener('DOMContentLoaded', function() {
    var loader = document.getElementById('loader');
    var main = document.getElementById('main-content');
    if (loader && main) {
        setTimeout(function() {
            loader.style.opacity = '0';
            setTimeout(function() {
                loader.style.display = 'none';
                main.style.display = 'block';
            }, 500);
        }, 800);
    }
    
    detectLanguage();
    
    if (!events.length) { 
        loadEventsFromSupabase();
    }
    
    initCountrySelectors();
    initFilters(); 
    renderEventsByCategory(); 
    updateUserInfo(); 
    updateProfilePage(); 
    updateAllProfileImages();
    updateNotifBadgeHeader();
    initAdmin(); 
    initChat(); 
    
    var dark = document.getElementById('darkModeToggle');
    if (localStorage.getItem('darkMode') === 'true') { if (dark) dark.checked = true; document.body.classList.add('dark-mode'); }
    if (dark) dark.addEventListener('change', toggleDarkMode);
    
    initHeroSlider();
    initFaq();
    renderAdminLogs();
    
    var storedPassword = localStorage.getItem('betix_admin_password');
    if (storedPassword === adminPassword || storedPassword === 'Betix@2026#') {
        var adminBtn = document.getElementById('adminMenuItem');
        if (adminBtn) {
            adminBtn.style.display = 'block';
            adminBtn.style.background = 'linear-gradient(135deg, #1a1a2e, #0D47A1)';
            adminBtn.style.color = 'white';
        }
        if (document.getElementById('adminPage') && document.getElementById('adminPage').style.display !== 'none') {
            startAdminSession();
        }
    }
    
    var menuBtn = document.getElementById('menuBtn');
    var closeSidebarBtn = document.getElementById('closeSidebarBtn');
    var overlay = document.getElementById('overlay');
    var sidebarWalletBtn = document.getElementById('sidebarWalletBtn');
    var eventForm = document.getElementById('eventForm');
    var searchInput = document.getElementById('searchInput');
    var clearDataBtn = document.getElementById('clearDataBtn');
    var backBtn = document.getElementById('backBtn');
    
    var profilePhotoInputSidebar = document.getElementById('profilePhotoInputSidebar');
    if (profilePhotoInputSidebar) {
        profilePhotoInputSidebar.addEventListener('change', function() {
            if (this.files && this.files[0]) {
                handleProfilePhotoUpload(this.files[0]);
            }
        });
    }
    
    var profilePhotoInputPage = document.getElementById('profilePhotoInputPage');
    if (profilePhotoInputPage) {
        profilePhotoInputPage.addEventListener('change', function() {
            if (this.files && this.files[0]) {
                handleProfilePhotoUpload(this.files[0]);
            }
        });
    }
    
    updateConnectButtons();
    
    var confirmPublishBtn = document.getElementById('confirmPublishBtn');
    if (confirmPublishBtn) {
        confirmPublishBtn.addEventListener('click', confirmPublishEvent);
    }
    
    var confirmBuyBtn = document.getElementById('confirmBuyBtn');
    if (confirmBuyBtn) {
        confirmBuyBtn.addEventListener('click', confirmPurchaseFromPopup);
    }
    
    var adminAddSlideBtn = document.getElementById('adminAddSlideBtn');
    var adminSaveSlideBtn = document.getElementById('adminSaveSlideBtn');
    var adminCancelSlideBtn = document.getElementById('adminCancelSlideBtn');
    var adminImageInput = document.getElementById('adminSlideImageInput');
    var adminUploadBox = document.getElementById('adminUploadBox');
    var adminPreview = document.getElementById('adminSlidePreview');
    
    if (adminAddSlideBtn) adminAddSlideBtn.addEventListener('click', function() { adminShowSlideForm(-1); });
    if (adminSaveSlideBtn) adminSaveSlideBtn.addEventListener('click', adminSaveSlide);
    if (adminCancelSlideBtn) adminCancelSlideBtn.addEventListener('click', adminCancelSlideForm);
    
    if (adminImageInput && adminUploadBox) {
        adminImageInput.addEventListener('change', function() {
            var file = this.files[0];
            if (file && file.type.startsWith('image/')) {
                var reader = new FileReader();
                reader.onload = function(e) {
                    adminPreview.src = e.target.result;
                    adminPreview.style.display = 'block';
                    adminUploadBox.classList.add('has-image');
                };
                reader.readAsDataURL(file);
            }
        });
        adminUploadBox.addEventListener('click', function(e) {
            if (e.target.tagName !== 'INPUT') {
                adminImageInput.click();
            }
        });
    }
    
    if (menuBtn) menuBtn.addEventListener('click', openSidebar);
    if (closeSidebarBtn) closeSidebarBtn.addEventListener('click', closeSidebar);
    if (overlay) overlay.addEventListener('click', closeSidebar);
    if (eventForm) eventForm.addEventListener('submit', createEvent);
    if (searchInput) searchInput.addEventListener('input', function(e) { searchQuery = e.target.value.toLowerCase(); renderEventsByCategory(); });
    if (clearDataBtn) clearDataBtn.addEventListener('click', clearAllData);
    if (backBtn) backBtn.addEventListener('click', goBack);
    
    var imageInputsModern = document.querySelectorAll('.image-input-modern');
    for (var i = 0; i < imageInputsModern.length; i++) {
        var input = imageInputsModern[i];
        var index = parseInt(input.dataset.index);
        
        input.addEventListener('change', function(e) {
            var idx = parseInt(this.dataset.index);
            if (this.files && this.files[0]) {
                handleImageUploadModern(this.files[0], idx);
            }
        });
        
        var box = document.getElementById('uploadBox' + (index + 1));
        if (box) {
            box.addEventListener('dragover', function(e) {
                e.preventDefault();
                this.classList.add('dragover');
            });
            
            box.addEventListener('dragleave', function(e) {
                e.preventDefault();
                this.classList.remove('dragover');
            });
            
            box.addEventListener('drop', function(e) {
                e.preventDefault();
                this.classList.remove('dragover');
                var files = e.dataTransfer.files;
                var inputFile = this.querySelector('.image-input-modern');
                if (files && files.length > 0 && inputFile) {
                    inputFile.files = files;
                    inputFile.dispatchEvent(new Event('change'));
                }
            });
        }
    }
    
    var sidebarItems = document.querySelectorAll('.sidebar-item');
    for (var i = 0; i < sidebarItems.length; i++) { 
        sidebarItems[i].addEventListener('click', function() { 
            var page = this.dataset.page;
            if (page) showPage(page); 
            closeSidebar(); 
        }); 
    }
    
    syncAllFromSupabase();

    setInterval(function() {
        syncAllToSupabase();
    }, 30000);

    window.addEventListener('beforeunload', function() {
        syncAllToSupabase();
    });
    
    if (window.currentUser || currentUser.wallet) {
        updateUserInfo();
        updateProfilePage();
        updateAllProfileImages();
    }
});

console.log('Betix loaded successfully!');
console.log('Admin: 5 clicks on logo + password Betix@2026#');
console.log('Admin connection logs active');
console.log('Admin session: 30 minutes of inactivity');