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
    console.log("Paiement incomplet trouvé:", payment);
    return payment;
}

// ============================================================
// ===== CONNEXION PI - VERSION ULTRA SIMPLE =====
// ============================================================

async function connectToPi() {
    console.log("🔵 Connexion Pi...");
    
    // Vérifier Pi SDK
    if (typeof Pi === 'undefined') {
        alert("❌ Pi SDK non chargé. Utilise le Pi Browser.");
        console.error("Pi SDK non disponible");
        return;
    }

    try {
        // Initialiser
        Pi.init({ version: "2.0", sandbox: true });
        console.log("✅ Pi initialisé");
        
        // Authentifier
        console.log("🔐 Demande d'autorisation...");
        const auth = await Pi.authenticate(['username', 'payments'], function(payment) {
            console.log("Paiement:", payment);
        });
        
        console.log("📋 Auth:", auth);
        
        if (auth && auth.user) {
            console.log("✅ Connecté:", auth.user);
            
            // Sauvegarder l'utilisateur
            const user = {
                pi_uid: auth.user.uid,
                username: auth.user.username,
                wallet: auth.user.wallet_address || null
            };
            
            // Enregistrer dans Supabase
            const { data: savedUser, error } = await supabaseClient
                .from('users')
                .upsert({
                    pi_uid: user.pi_uid,
                    username: user.username,
                    wallet: user.wallet,
                    last_login: new Date().toISOString()
                })
                .select()
                .single();
            
            if (error) {
                console.error("❌ Erreur Supabase:", error);
                alert("Erreur lors de l'enregistrement");
                return;
            }
            
            if (savedUser) {
                window.currentUser = savedUser;
                localStorage.setItem('betix_user', JSON.stringify(savedUser));
                
                // Mettre à jour l'interface
                document.getElementById('sidebarName').textContent = savedUser.username;
                document.getElementById('sidebarWallet').textContent = savedUser.wallet ? savedUser.wallet.substring(0, 15) + '...' : 'Not connected';
                
                const btn = document.getElementById('sidebarWalletBtn');
                if (btn) {
                    btn.textContent = 'Disconnect';
                    btn.onclick = function() {
                        if (confirm('Déconnecter ?')) {
                            window.currentUser = null;
                            localStorage.removeItem('betix_user');
                            location.reload();
                        }
                    };
                }
                
                // Mettre à jour le profil
                const profileName = document.getElementById('profileNameDisplay');
                if (profileName) profileName.textContent = savedUser.username;
                
                alert('✅ Bienvenue ' + savedUser.username + ' !');
                console.log("✅ Utilisateur connecté:", savedUser.username);
                return savedUser;
            }
        } else {
            alert("❌ Authentification annulée");
        }
        
    } catch (error) {
        console.error("❌ Erreur:", error);
        alert("Erreur: " + error.message);
    }
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
        
        const btn = document.getElementById('sidebarWalletBtn');
        if (btn) {
            btn.textContent = 'Connect Pi';
            btn.onclick = function() { connectToPi(); };
        }
        
        const profileBtn = document.getElementById('profileConnectBtnPage');
        if (profileBtn) {
            profileBtn.textContent = 'Connect Pi';
            profileBtn.onclick = function() { connectToPi(); };
        }
        
        alert('Déconnecté');
        location.reload();
    }
}

// ============================================================
// ===== VÉRIFICATION DU SDK PI =====
// ============================================================

function checkPiSDK() {
    if (typeof Pi !== 'undefined') {
        console.log('✅ Pi SDK chargé');
        return true;
    } else {
        console.warn('⚠️ Pi SDK non chargé');
        return false;
    }
}

checkPiSDK();

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
    var pages = ['homePage', 'createPage', 'ticketsPage', 'historyPage', '