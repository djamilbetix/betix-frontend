// ============================================================
// ===== CONFIGURATION =====
// ============================================================

const SUPABASE_URL = "https://tycebwzgsujiazgopkri.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR5Y2Vid3pnc3VqaWF6Z29wa3JpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODIzODg2NTMsImV4cCI6MjA5Nzk2NDY1M30.7x1rouTbMJE2WcY008vRnqGuAWq3yM_eZCS4Q8_3TrQ";

const supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const BACKEND_URL = "https://betix-backend.onrender.com";

// ============================================================
// ===== GLOBAL VARIABLES =====
// ============================================================

let events = [];
let tickets = [];
let usedTickets = [];
let currentUser = { name: 'Guest', wallet: null, piUid: null, memberSince: '2026', loyaltyPoints: 0 };
let currentFilter = 'All';
let currentCountryFilter = 'All';
let searchQuery = '';
let piUser = null;
let ratings = [];
let chatMessages = [];
let connectedUsers = [];
let notifications = [];
let adminLogs = [];
let adminPassword = localStorage.getItem('betix_admin_password') || 'Betix@2026#';
let pageHistory = ['home'];
let logoClickCount = 0;
let pendingEventData = null;
let editingEventId = null;
let selectedEventForPurchase = null;
let uploadedImages = {};
let isProcessingPayment = false;
let adminSessionTimer = 1800;
let adminTimerInterval = null;

// ============================================================
// ===== COUNTRIES =====
// ============================================================

const countriesList = [
    'All', 'France', 'RDC', 'Congo', 'Belgium', 'Switzerland', 'Canada',
    'Senegal', 'Cameroon', 'Mali', 'Niger', 'Nigeria', 'South Africa',
    'Angola', 'Mozambique', 'Kenya', 'Tanzania', 'Uganda', 'Rwanda',
    'Burundi', 'Ethiopia', 'Somalia', 'Djibouti', 'Eritrea', 'Sudan',
    'South Sudan', 'Egypt', 'Libya', 'Tunisia', 'Algeria', 'Morocco',
    'Mauritania', 'Ghana', 'Guinea', 'Burkina Faso', 'Benin', 'Togo',
    'Liberia', 'Sierra Leone', 'Gambia', 'Guinea-Bissau', 'Cape Verde',
    'Sao Tome', 'Gabon', 'Equatorial Guinea', 'Central African Republic',
    'Chad', 'Madagascar', 'Comoros', 'Mauritius', 'Seychelles',
    'Zambia', 'Zimbabwe', 'Botswana', 'Namibia', 'Lesotho', 'Eswatini',
    'Malawi', 'Spain', 'Portugal', 'Germany', 'Italy', 'United Kingdom',
    'United States', 'Russia', 'Ukraine', 'Turkey', 'Iran', 'China',
    'Japan', 'India', 'Indonesia', 'Australia', 'Mexico', 'Argentina',
    'Brazil', 'Denmark', 'Sweden', 'Austria'
];

const countryFlags = {
    'France': '🇫🇷', 'RDC': '🇨🇩', 'Congo': '🇨🇬', 'Belgium': '🇧🇪',
    'Switzerland': '🇨🇭', 'Canada': '🇨🇦', 'Senegal': '🇸🇳', 'Cameroon': '🇨🇲',
    'Mali': '🇲🇱', 'Niger': '🇳🇪', 'Nigeria': '🇳🇬', 'South Africa': '🇿🇦',
    'Angola': '🇦🇴', 'Mozambique': '🇲🇿', 'Kenya': '🇰🇪', 'Tanzania': '🇹🇿',
    'Uganda': '🇺🇬', 'Rwanda': '🇷🇼', 'Burundi': '🇧🇮', 'Ethiopia': '🇪🇹',
    'Somalia': '🇸🇴', 'Djibouti': '🇩🇯', 'Eritrea': '🇪🇷', 'Sudan': '🇸🇩',
    'South Sudan': '🇸🇸', 'Egypt': '🇪🇬', 'Libya': '🇱🇾', 'Tunisia': '🇹🇳',
    'Algeria': '🇩🇿', 'Morocco': '🇲🇦', 'Mauritania': '🇲🇷', 'Ghana': '🇬🇭',
    'Guinea': '🇬🇳', 'Burkina Faso': '🇧🇫', 'Benin': '🇧🇯', 'Togo': '🇹🇬',
    'Liberia': '🇱🇷', 'Sierra Leone': '🇸🇱', 'Gambia': '🇬🇲', 'Guinea-Bissau': '🇬🇼',
    'Cape Verde': '🇨🇻', 'Sao Tome': '🇸🇹', 'Gabon': '🇬🇦', 'Equatorial Guinea': '🇬🇶',
    'Central African Republic': '🇨🇫', 'Chad': '🇹🇩', 'Madagascar': '🇲🇬',
    'Comoros': '🇰🇲', 'Mauritius': '🇲🇺', 'Seychelles': '🇸🇨', 'Zambia': '🇿🇲',
    'Zimbabwe': '🇿🇼', 'Botswana': '🇧🇼', 'Namibia': '🇳🇦', 'Lesotho': '🇱🇸',
    'Eswatini': '🇸🇿', 'Malawi': '🇲🇼', 'Spain': '🇪🇸', 'Portugal': '🇵🇹',
    'Germany': '🇩🇪', 'Italy': '🇮🇹', 'United Kingdom': '🇬🇧', 'United States': '🇺🇸',
    'Russia': '🇷🇺', 'Ukraine': '🇺🇦', 'Turkey': '🇹🇷', 'Iran': '🇮🇷',
    'China': '🇨🇳', 'Japan': '🇯🇵', 'India': '🇮🇳', 'Indonesia': '🇮🇩',
    'Australia': '🇦🇺', 'Mexico': '🇲🇽', 'Argentina': '🇦🇷', 'Brazil': '🇧🇷',
    'Denmark': '🇩🇰', 'Sweden': '🇸🇪', 'Austria': '🇦🇹'
};

// ============================================================
// ===== EVENT IMAGES =====
// ============================================================

const eventImagesList = {
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

// ============================================================
// ===== HERO SLIDES =====
// ============================================================

let heroSlides = JSON.parse(localStorage.getItem('betix_hero_slides')) || [];
if (heroSlides.length === 0) {
    heroSlides = [
        { image: 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=1200&h=600&fit=crop', badge: 'Music Festival', title: 'Summer Music Festival 2026', description: '3 days of electrifying performances' },
        { image: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=1200&h=600&fit=crop', badge: 'Football', title: 'Champions League Final', description: 'The biggest football event of the year' },
        { image: 'https://images.unsplash.com/photo-1505373877841-8d25f7d46678?w=1200&h=600&fit=crop', badge: 'Conference', title: 'Web3 Summit 2026', description: 'The future of decentralized technology' },
        { image: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=1200&h=600&fit=crop', badge: 'Cinema', title: 'International Film Festival', description: 'Premieres and exclusive screenings' },
        { image: 'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=1200&h=600&fit=crop', badge: 'Concert', title: 'World Tour Concert', description: 'An unforgettable night with global superstars' }
    ];
    localStorage.setItem('betix_hero_slides', JSON.stringify(heroSlides));
}

// ============================================================
// ===== UTILITY FUNCTIONS =====
// ============================================================

function escapeHtml(str) { if (!str) return ''; return String(str).replace(/[&<>]/g, function(m) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;' }[m] || m; }); }

function formatDate(dateStr) { try { var d = new Date(dateStr); return !isNaN(d.getTime()) ? d.toLocaleDateString('en-US') : 'Date to be defined'; } catch(e) { return 'Date to be defined'; } }

function getFlag(country) { return countryFlags[country] || '🌍'; }

// ============================================================
// ===== SUPABASE FUNCTIONS =====
// ============================================================

async function saveUserToSupabase(piUid, username, wallet, points) {
    try {
        var now = new Date().toISOString();
        var userData = { pi_uid: piUid, username: username, wallet: wallet, points: points || 0, updated_at: now, last_seen: now };
        var { data: existing } = await supabaseClient.from('users').select('pi_uid').eq('pi_uid', piUid).single();
        if (existing) {
            await supabaseClient.from('users').update(userData).eq('pi_uid', piUid);
        } else {
            userData.created_at = now;
            await supabaseClient.from('users').insert(userData);
        }
        return true;
    } catch(e) { console.error('Save user error:', e); return false; }
}

async function saveEventToSupabase(eventData) {
    try {
        if (!eventData.id) return false;
        var dbEvent = {
            id: eventData.id,
            organizer_pi_uid: eventData.organizerPiUid || eventData.organizer || 'unknown',
            organizer_name: eventData.organizerName || eventData.organizer || 'Anonymous',
            title: eventData.title || 'Untitled',
            description: eventData.description || '',
            image_url: eventData.coverImage || (eventData.images && eventData.images[0]) || '',
            location: eventData.location || '',
            pays: eventData.pays || eventData.country || 'France',
            event_date: eventData.date || new Date().toISOString(),
            category: eventData.category || '',
            ticket_price_standard: (eventData.ticketTypes && eventData.ticketTypes.standard && eventData.ticketTypes.standard.price) || 0,
            ticket_price_vip: (eventData.ticketTypes && eventData.ticketTypes.vip && eventData.ticketTypes.vip.price) || 0,
            ticket_standard_enabled: (eventData.ticketTypes && eventData.ticketTypes.standard && eventData.ticketTypes.standard.enabled) || false,
            ticket_vip_enabled: (eventData.ticketTypes && eventData.ticketTypes.vip && eventData.ticketTypes.vip.enabled) || false,
            max_tickets: eventData.seatsTotal || 0,
            created_at: eventData.createdAt || new Date().toISOString(),
            conditions: eventData.conditions || '',
            duration_value: eventData.durationValue || null,
            duration_unit: eventData.durationUnit || null
        };
        await supabaseClient.from('events').upsert(dbEvent, { onConflict: 'id' });
        return true;
    } catch(e) { console.error('Save event error:', e); return false; }
}

async function saveTicketToSupabase(ticketData) {
    try {
        if (!ticketData || !ticketData.id) return false;
        var dbTicket = {
            id: ticketData.id,
            event_id: ticketData.eventId || '',
            buyer_pi_uid: ticketData.buyerWallet || ticketData.userWallet || 'unknown',
            buyer_name: ticketData.buyerName || ticketData.buyerWallet || 'Anonymous',
            ticket_type: ticketData.ticketType || 'standard',
            price: parseFloat(ticketData.price) || 0,
            qr_code: ticketData.qrCode || 'BETIX-' + Date.now(),
            status: ticketData.status || 'Valid',
            purchase_date: ticketData.purchaseDate || new Date().toISOString(),
            expiration_date: ticketData.eventDate || new Date(Date.now() + 86400000 * 30).toISOString(),
            event_title: ticketData.eventTitle || 'Event',
            event_location: ticketData.eventLocation || '',
            pays: ticketData.pays || 'France',
            transaction_id: ticketData.transactionId || ''
        };
        await supabaseClient.from('tickets').upsert(dbTicket, { onConflict: 'id', ignoreDuplicates: false });
        return true;
    } catch(e) { console.error('Save ticket error:', e); return false; }
}

async function loadEventsFromSupabase() {
    try {
        var { data, error } = await supabaseClient.from('events').select('*').order('event_date', { ascending: true });
        if (error) return [];
        return data || [];
    } catch(e) { console.error('Load events error:', e); return []; }
}

async function loadTicketsFromSupabase(piUid) {
    try {
        if (!piUid) return [];
        var { data, error } = await supabaseClient.from('tickets').select('*').eq('buyer_pi_uid', piUid).order('purchase_date', { ascending: false });
        if (error) return [];
        return data || [];
    } catch(e) { console.error('Load tickets error:', e); return []; }
}

async function loadNotificationsFromSupabase(piUid) {
    try {
        if (!piUid) return [];
        var { data, error } = await supabaseClient.from('notifications').select('*').eq('receiver_pi_uid', piUid).order('created_at', { ascending: false });
        if (error) return [];
        return data || [];
    } catch(e) { console.error('Load notifications error:', e); return []; }
}

async function updateEventInSupabase(eventId, updates) {
    try {
        await supabaseClient.from('events').update(updates).eq('id', eventId);
        return true;
    } catch(e) { console.error('Update event error:', e); return false; }
}

async function deleteEventFromSupabase(eventId) {
    try {
        await supabaseClient.from('events').delete().eq('id', eventId);
        return true;
    } catch(e) { console.error('Delete event error:', e); return false; }
}

async function saveTransactionToSupabase(transactionData) {
    try {
        var dbTransaction = {
            id: transactionData.id || Date.now().toString(),
            buyer_pi_uid: transactionData.buyerWallet || transactionData.buyerPiUid,
            event_id: transactionData.eventId,
            amount: transactionData.amount || 0,
            currency: 'Pi',
            payment_id: transactionData.txid || transactionData.paymentId || '',
            status: transactionData.status || 'completed',
            created_at: transactionData.date || new Date().toISOString()
        };
        await supabaseClient.from('transactions').insert(dbTransaction);
        return true;
    } catch(e) { console.error('Save transaction error:', e); return false; }
}

// ============================================================
// ===== SAVE FUNCTIONS =====
// ============================================================

function saveEvents() { localStorage.setItem('betix_events', JSON.stringify(events)); syncEventsToSupabase(); }
function saveTickets() { localStorage.setItem('betix_tickets', JSON.stringify(tickets)); saveUsedTickets(); syncTicketsToSupabase(); }
function saveUsedTickets() { localStorage.setItem('betix_used_tickets', JSON.stringify(usedTickets)); }
function saveUser() { localStorage.setItem('betix_user', JSON.stringify(currentUser)); syncUserToSupabase(); }
function saveNotifications() { localStorage.setItem('betix_notifications', JSON.stringify(notifications)); }
function saveChatMessages() { localStorage.setItem('betix_chat_messages', JSON.stringify(chatMessages)); }
function saveRatings() { localStorage.setItem('betix_ratings', JSON.stringify(ratings)); }
function saveConnectedUsers() { localStorage.setItem('betix_connected_users', JSON.stringify(connectedUsers)); }

function loadUsedTickets() {
    var stored = localStorage.getItem('betix_used_tickets');
    usedTickets = stored ? JSON.parse(stored) : [];
}

// ============================================================
// ===== SYNC FUNCTIONS =====
// ============================================================

async function syncUserToSupabase() {
    if (!currentUser.piUid && !currentUser.wallet) return;
    var piUid = currentUser.piUid || currentUser.wallet;
    await saveUserToSupabase(piUid, currentUser.name, currentUser.wallet, currentUser.loyaltyPoints);
}

async function syncEventsToSupabase() {
    for (var i = 0; i < events.length; i++) await saveEventToSupabase(events[i]);
}

async function syncTicketsToSupabase() {
    for (var i = 0; i < tickets.length; i++) await saveTicketToSupabase(tickets[i]);
}

async function syncAllToSupabase() {
    try {
        await syncUserToSupabase();
        await syncEventsToSupabase();
        await syncTicketsToSupabase();
        return { events: events.length, tickets: tickets.length };
    } catch(e) { console.error('Sync error:', e); return { events: 0, tickets: 0 }; }
}

// ============================================================
// ===== LOAD ALL FROM SUPABASE =====
// ============================================================

async function loadAllFromSupabase() {
    loadUsedTickets();
    try {
        var supabaseEvents = await loadEventsFromSupabase();
        if (supabaseEvents && supabaseEvents.length > 0) {
            events = supabaseEvents.map(function(e) {
                return {
                    id: e.id, title: e.title, category: e.category || '',
                    pays: e.pays || 'France', country: e.pays || 'France',
                    date: e.event_date, location: e.location || '',
                    description: e.description || '',
                    conditions: e.conditions || 'Active Pi Network wallet\nPayment in Pi',
                    price: e.ticket_price_standard || 0.0003,
                    seatsTotal: e.max_tickets || 100, seatsLeft: e.max_tickets || 100,
                    images: e.image_url ? [e.image_url] : [],
                    coverImage: e.image_url || '',
                    organizer: e.organizer_pi_uid || '',
                    organizerName: e.organizer_name || '',
                    organizerPiUid: e.organizer_pi_uid || '',
                    createdAt: e.created_at || new Date().toISOString(),
                    boosts: 0,
                    durationValue: e.duration_value || null,
                    durationUnit: e.duration_unit || null,
                    ticketTypes: {
                        standard: { enabled: e.ticket_standard_enabled || false, price: e.ticket_price_standard || 0 },
                        vip: { enabled: e.ticket_vip_enabled || false, price: e.ticket_price_vip || 0 }
                    }
                };
            });
            localStorage.setItem('betix_events', JSON.stringify(events));
        }

        if (currentUser.piUid || currentUser.wallet) {
            var piUid = currentUser.piUid || currentUser.wallet;
            var supabaseTickets = await loadTicketsFromSupabase(piUid);
            if (supabaseTickets && supabaseTickets.length > 0) {
                tickets = supabaseTickets.map(function(t) {
                    return {
                        id: t.id, eventId: t.event_id, eventTitle: t.event_title || 'Event',
                        eventDate: t.expiration_date || t.event_date || new Date().toISOString(),
                        eventLocation: t.event_location || '',
                        price: parseFloat(t.price) || 0,
                        buyerWallet: t.buyer_pi_uid,
                        buyerName: t.buyer_name || t.buyer_pi_uid,
                        userWallet: t.buyer_pi_uid,
                        ticketType: t.ticket_type || 'standard',
                        pays: t.pays || 'France',
                        status: t.status || 'Valid',
                        purchaseDate: t.purchase_date || new Date().toISOString(),
                        purchaseDateTime: new Date(t.purchase_date || new Date()).toLocaleString('en-US'),
                        transactionId: t.transaction_id || '',
                        qrCode: t.qr_code || 'BETIX-' + Date.now()
                    };
                });
                localStorage.setItem('betix_tickets', JSON.stringify(tickets));
            }
        }

        if (currentUser.piUid || currentUser.wallet) {
            var piUid2 = currentUser.piUid || currentUser.wallet;
            var supabaseNotifs = await loadNotificationsFromSupabase(piUid2);
            if (supabaseNotifs && supabaseNotifs.length > 0) {
                notifications = supabaseNotifs.map(function(n) {
                    return { id: n.id, message: n.message || n.title || '', type: n.type || 'info', read: n.is_read || false, date: n.created_at || new Date().toISOString() };
                });
                localStorage.setItem('betix_notifications', JSON.stringify(notifications));
                updateNotifBadgeHeader();
            }
        }

        renderEventsByCategory();
        renderTickets();
        renderHistory();
        updateProfilePage();

    } catch(e) {
        console.error('Load data error:', e);
        try {
            var localEvents = localStorage.getItem('betix_events');
            if (localEvents) events = JSON.parse(localEvents);
            var localTickets = localStorage.getItem('betix_tickets');
            if (localTickets) tickets = JSON.parse(localTickets);
        } catch(e2) { console.error('Fallback error:', e2); }
    }
}

// ============================================================
// ===== LANGUAGE =====
// ============================================================

function changeLanguage(lang) {
    localStorage.setItem('betix_language', lang);
    var nativeSelect = document.getElementById('nativeLangSelect');
    if (nativeSelect) nativeSelect.value = lang;
    var googleSelect = document.querySelector('.goog-te-combo');
    if (googleSelect) { googleSelect.value = lang; googleSelect.dispatchEvent(new Event('change')); }
    setTimeout(function() { location.reload(); }, 800);
}

function detectLanguage() {
    var savedLang = localStorage.getItem('betix_language') || 'en';
    var nativeSelect = document.getElementById('nativeLangSelect');
    if (nativeSelect) nativeSelect.value = savedLang;
    return savedLang;
}

// ============================================================
// ===== NOTIFICATIONS =====
// ============================================================

function renderNotificationsPage() {
    var container = document.getElementById('notificationsList');
    if (!container) return;
    if (!notifications || notifications.length === 0) {
        container.innerHTML = '<div style="text-align:center;padding:2rem;color:var(--gray);">No notifications</div>';
        return;
    }
    var html = '';
    for (var i = 0; i < notifications.length; i++) {
        var notif = notifications[i];
        var time = new Date(notif.date);
        var timeStr = time.toLocaleDateString('en-US') + ' ' + time.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
        var unreadClass = notif.read ? '' : 'unread';
        html += '<div class="notification-item ' + unreadClass + '">' +
            '<div class="notif-icon"><i class="fas fa-info-circle"></i></div>' +
            '<div class="notif-content"><div class="notif-msg">' + escapeHtml(notif.message) + '</div><div class="notif-time">' + timeStr + '</div></div>' +
        '</div>';
        notifications[i].read = true;
    }
    container.innerHTML = html;
    saveNotifications();
    updateNotifBadgeHeader();
}

function updateNotifBadgeHeader() {
    var badge = document.getElementById('sidebarNotifBadge');
    if (!badge) return;
    var unread = notifications.filter(function(n) { return !n.read; }).length;
    if (unread > 0) { badge.textContent = unread; badge.classList.remove('hidden'); }
    else { badge.classList.add('hidden'); }
}

function addNotification(message, type) {
    var notif = { id: Date.now().toString(), message: message, type: type || 'info', read: false, date: new Date().toISOString() };
    notifications.unshift(notif);
    if (notifications.length > 100) notifications = notifications.slice(0, 100);
    saveNotifications();
    updateNotifBadgeHeader();
}

// ============================================================
// ===== NAVIGATION =====
// ============================================================

function goToMyEvents() { showPage('myevents'); }
function goToTickets() { showPage('tickets'); }
function goToHistory() { showPage('history'); }
function goToRatings() { showPage('ratings'); }

function updateBackButton(currentPage) {
    var backBtn = document.getElementById('backBtn');
    if (!backBtn) return;
    if (currentPage !== 'home') { backBtn.style.display = 'flex'; backBtn.classList.add('visible'); }
    else { backBtn.style.display = 'none'; backBtn.classList.remove('visible'); }
}

function goBack() {
    if (pageHistory.length > 1) {
        pageHistory.pop();
        showPage(pageHistory[pageHistory.length - 1]);
    } else { showPage('home'); }
}

function showPage(pageName) {
    var pages = ['homePage', 'createPage', 'ticketsPage', 'historyPage', 'profilePage', 'whitepaperPage', 'faqPage', 'settingsPage', 'ratingsPage', 'adminPage', 'myeventsPage', 'notificationsPage'];
    for (var i = 0; i < pages.length; i++) {
        var el = document.getElementById(pages[i]);
        if (el) { el.style.display = 'none'; el.classList.add('hidden-page'); }
    }
    if (pageName === 'home') {
        document.getElementById('homePage').style.display = 'block';
        renderEventsByCategory();
    } else {
        var target = document.getElementById(pageName + 'Page');
        if (target) { target.style.display = 'block'; target.classList.remove('hidden-page'); }
    }
    if (pageHistory[pageHistory.length - 1] !== pageName) pageHistory.push(pageName);
    updateBackButton(pageName);
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

// ============================================================
// ===== SIDEBAR =====
// ============================================================

function closeSidebar() {
    var s = document.getElementById('sidebar');
    var o = document.getElementById('overlay');
    if (s) { s.classList.remove('open'); document.body.style.overflow = ''; }
    if (o) { o.classList.remove('active'); }
}

function openSidebar() {
    var s = document.getElementById('sidebar');
    var o = document.getElementById('overlay');
    if (s) { s.classList.add('open'); document.body.style.overflow = 'hidden'; }
    if (o) { o.classList.add('active'); }
}

// ============================================================
// ===== CONNECTION =====
// ============================================================

function updateConnectButtons() {
    var sidebarBtn = document.getElementById('sidebarWalletBtn');
    if (sidebarBtn) {
        if (currentUser.wallet) {
            sidebarBtn.textContent = 'Disconnect';
            sidebarBtn.classList.add('disconnect');
            sidebarBtn.onclick = function() { disconnectPi(); };
        } else {
            sidebarBtn.textContent = 'Connect Pi';
            sidebarBtn.classList.remove('disconnect');
            sidebarBtn.onclick = function() { connectToPi(); };
        }
    }
    var profileBtn = document.getElementById('profileConnectBtnPage');
    if (profileBtn) {
        if (currentUser.wallet) {
            profileBtn.textContent = 'Disconnect';
            profileBtn.onclick = function() { disconnectPi(); };
        } else {
            profileBtn.textContent = 'Connect Pi';
            profileBtn.onclick = function() { connectToPi(); };
        }
    }
}

function disconnectPi() {
    if (confirm('Are you sure you want to disconnect?')) {
        currentUser = { name: 'Guest', wallet: null, piUid: null, memberSince: '2026', loyaltyPoints: 0 };
        piUser = null;
        saveUser();
        updateUserInfo();
        updateProfilePage();
        renderEventsByCategory();
        updateConnectButtons();
        closeSidebar();
        alert('You are disconnected');
    }
}

async function connectToPi() {
    showConnectSpinner();
    try {
        if (typeof Pi === 'undefined') {
            hideConnectSpinner();
            if (confirm("Pi Browser not detected. Use demo mode?")) {
                currentUser.wallet = 'demo_user';
                currentUser.piUid = 'demo_user';
                currentUser.name = 'Demo User';
                currentUser.memberSince = '2026';
                currentUser.loyaltyPoints = 0;
                saveUser();
                syncUserToSupabase();
                updateUserInfo();
                updateProfilePage();
                renderEventsByCategory();
                updateConnectButtons();
                loadAllFromSupabase();
                alert('Demo mode connected!');
                closeSidebar();
                return;
            }
            alert("Please open this page in Pi Browser");
            return;
        }
        var auth = await Pi.authenticate(['username', 'payments'], function(payment) { console.log("Incomplete payment:", payment); });
        if (auth && auth.user) {
            piUser = auth.user;
            currentUser.wallet = piUser.username;
            currentUser.piUid = piUser.username;
            currentUser.name = piUser.username;
            if (!currentUser.loyaltyPoints) currentUser.loyaltyPoints = 0;
            saveUser();
            await syncUserToSupabase();
            updateUserInfo();
            updateProfilePage();
            trackUserConnection();
            renderEventsByCategory();
            updateConnectButtons();
            await loadAllFromSupabase();
            alert('Connected! Welcome ' + piUser.username);
            closeSidebar();
        } else {
            alert('Authentication failed');
        }
    } catch(e) {
        console.error("Connection error:", e);
        alert("Connection error: " + (e.message || "Please try again"));
    } finally {
        hideConnectSpinner();
    }
}

function showConnectSpinner() {
    var btn = document.getElementById('sidebarWalletBtn');
    if (btn) { btn.textContent = 'Connecting...'; btn.disabled = true; }
}

function hideConnectSpinner() {
    var btn = document.getElementById('sidebarWalletBtn');
    if (btn) { btn.disabled = false; updateConnectButtons(); }
}

function trackUserConnection() {
    if (currentUser.wallet) {
        var existing = connectedUsers.find(function(u) { return u.wallet === currentUser.wallet; });
        var userData = { name: currentUser.name, wallet: currentUser.wallet, ticketCount: tickets.length, lastSeen: new Date().toLocaleString(), loyaltyPoints: currentUser.loyaltyPoints || 0, memberSince: currentUser.memberSince || '2026' };
        if (!existing) connectedUsers.push(userData);
        else { existing.name = currentUser.name; existing.ticketCount = tickets.length; existing.lastSeen = new Date().toLocaleString(); existing.loyaltyPoints = currentUser.loyaltyPoints || 0; }
        localStorage.setItem('betix_connected_users', JSON.stringify(connectedUsers));
        syncUserToSupabase();
    }
}

// ============================================================
// ===== TICKET TYPES UI =====
// ============================================================

function setupTicketTypesUI() {
    var standardCheckbox = document.getElementById('ticketStandardEnabled');
    var vipCheckbox = document.getElementById('ticketVipEnabled');
    var standardPriceGroup = document.getElementById('standardPriceGroup');
    var vipPriceGroup = document.getElementById('vipPriceGroup');
    var standardStatusBadge = document.getElementById('standardStatusBadge');
    var vipStatusBadge = document.getElementById('vipStatusBadge');

    function updateStatusBadge(checkbox, badge) {
        if (!checkbox || !badge) return;
        if (checkbox.checked) {
            badge.textContent = 'Active';
            badge.className = 'type-status-badge active';
        } else {
            badge.textContent = 'Inactive';
            badge.className = 'type-status-badge inactive';
        }
    }

    if (standardCheckbox && standardPriceGroup) {
        standardCheckbox.addEventListener('change', function() {
            if (this.checked) { standardPriceGroup.classList.remove('hidden'); standardPriceGroup.style.display = 'flex'; }
            else { standardPriceGroup.classList.add('hidden'); standardPriceGroup.style.display = 'none'; }
            updateStatusBadge(standardCheckbox, standardStatusBadge);
        });
        if (standardCheckbox.checked) { standardPriceGroup.classList.remove('hidden'); standardPriceGroup.style.display = 'flex'; }
        else { standardPriceGroup.classList.add('hidden'); standardPriceGroup.style.display = 'none'; }
        updateStatusBadge(standardCheckbox, standardStatusBadge);
    }

    if (vipCheckbox && vipPriceGroup) {
        vipCheckbox.addEventListener('change', function() {
            if (this.checked) { vipPriceGroup.classList.remove('hidden'); vipPriceGroup.style.display = 'flex'; }
            else { vipPriceGroup.classList.add('hidden'); vipPriceGroup.style.display = 'none'; }
            updateStatusBadge(vipCheckbox, vipStatusBadge);
        });
        if (vipCheckbox.checked) { vipPriceGroup.classList.remove('hidden'); vipPriceGroup.style.display = 'flex'; }
        else { vipPriceGroup.classList.add('hidden'); vipPriceGroup.style.display = 'none'; }
        updateStatusBadge(vipCheckbox, vipStatusBadge);
    }
}

// ============================================================
// ===== COUNTRY SELECTORS =====
// ============================================================

function initCountrySelectors() {
    var filterSelect = document.getElementById('countrySelect');
    if (filterSelect) {
        filterSelect.innerHTML = '';
        for (var i = 0; i < countriesList.length; i++) {
            var country = countriesList[i];
            var flag = getFlag(country);
            var option = document.createElement('option');
            option.value = country;
            option.textContent = flag + ' ' + country;
            if (country === currentCountryFilter) option.selected = true;
            filterSelect.appendChild(option);
        }
    }
    var eventSelect = document.getElementById('eventCountry');
    if (eventSelect) {
        eventSelect.innerHTML = '';
        for (var i = 0; i < countriesList.length; i++) {
            var country = countriesList[i];
            if (country === 'All') continue;
            var flag = getFlag(country);
            var option = document.createElement('option');
            option.value = country;
            option.textContent = flag + ' ' + country;
            if (country === 'France') option.selected = true;
            eventSelect.appendChild(option);
        }
    }
}

// ============================================================
// ===== QUANTITY POPUP =====
// ============================================================

function openQuantityPopup(eventId) {
    var event = events.find(function(e) { return e.id === eventId; });
    if (!event) { alert('Event not found'); return; }
    if (!currentUser.wallet) { alert('Please connect your Pi account first'); connectToPi(); return; }
    if (event.seatsLeft <= 0) { alert('No seats available'); return; }

    selectedEventForPurchase = event;
    document.getElementById('quantityEventTitle').textContent = event.title;
    var dateEvent = new Date(event.date);
    document.getElementById('quantityEventInfo').textContent = dateEvent.toLocaleDateString('en-US') + ' at ' + dateEvent.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }) + ' | ' + event.location;
    document.getElementById('maxQuantityInfo').textContent = 'Maximum ' + Math.min(event.seatsLeft, 10) + ' tickets';
    document.getElementById('ticketQuantity').value = 1;
    document.getElementById('ticketQuantity').max = Math.min(event.seatsLeft, 10);

    var ticketTypeSelect = document.getElementById('ticketTypeSelect');
    ticketTypeSelect.innerHTML = '';
    var options = [];
    if (event.ticketTypes && event.ticketTypes.standard && event.ticketTypes.standard.enabled) {
        options.push({ value: 'standard', label: 'Standard - ' + event.ticketTypes.standard.price + ' Pi' });
    }
    if (event.ticketTypes && event.ticketTypes.vip && event.ticketTypes.vip.enabled) {
        options.push({ value: 'vip', label: 'VIP - ' + event.ticketTypes.vip.price + ' Pi' });
    }
    if (options.length === 0) options.push({ value: 'standard', label: 'Standard - ' + event.price + ' Pi' });
    for (var i = 0; i < options.length; i++) {
        var opt = document.createElement('option');
        opt.value = options[i].value;
        opt.textContent = options[i].label;
        ticketTypeSelect.appendChild(opt);
    }
    updateTicketTotal();
    document.getElementById('quantityPopup').classList.add('show');
}

function updateTicketTotal() {
    var input = document.getElementById('ticketQuantity');
    var totalDisplay = document.getElementById('totalPriceDisplay');
    var ticketTypeSelect = document.getElementById('ticketTypeSelect');
    if (!input || !totalDisplay || !selectedEventForPurchase) return;
    var qty = parseInt(input.value) || 1;
    var type = ticketTypeSelect ? ticketTypeSelect.value : 'standard';
    var price = (selectedEventForPurchase.ticketTypes && selectedEventForPurchase.ticketTypes[type] && selectedEventForPurchase.ticketTypes[type].price) || selectedEventForPurchase.price || 0;
    totalDisplay.textContent = (qty * price).toFixed(6) + ' Pi';
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
    var newVal = Math.min(Math.max(current + delta, 1), maxVal);
    input.value = newVal;
    updateTicketTotal();
}

// ============================================================
// ===== PURCHASE =====
// ============================================================

async function confirmPurchaseFromPopup() {
    if (!selectedEventForPurchase) return alert('No event selected');
    if (isProcessingPayment) return alert('Payment in progress. Please wait.');

    var quantity = parseInt(document.getElementById('ticketQuantity').value) || 1;
    var ticketType = document.getElementById('ticketTypeSelect').value;

    if (quantity < 1) return alert('Select at least 1 ticket');
    if (quantity > selectedEventForPurchase.seatsLeft) return alert('Only ' + selectedEventForPurchase.seatsLeft + ' tickets available');
    if (quantity > 10) return alert('Maximum 10 tickets per purchase');

    await confirmPurchase(selectedEventForPurchase.id, quantity, ticketType);
}

async function confirmPurchase(eventId, quantity, ticketType) {
    var event = events.find(function(e) { return e.id === eventId; });
    if (!event) return alert('Event not found');

    var price = (event.ticketTypes && event.ticketTypes[ticketType] && event.ticketTypes[ticketType].price) || event.price || 0;
    if (quantity > event.seatsLeft) return alert('Only ' + event.seatsLeft + ' seats available');

    var totalPrice = quantity * price;
    var typeLabel = ticketType === 'vip' ? 'VIP' : 'Standard';

    if (!confirm('Buy ' + quantity + ' ' + typeLabel + ' ticket(s) for "' + event.title + '" (Total: ' + totalPrice.toFixed(6) + ' Pi) ?')) return;

    closeQuantityPopup();
    isProcessingPayment = true;

    var confirmBtn = document.getElementById('confirmBuyBtn');
    if (confirmBtn) { confirmBtn.textContent = 'Processing...'; confirmBtn.disabled = true; }

    try {
        if (typeof Pi === 'undefined') {
            alert('Pi SDK not available. Please use Pi Browser.');
            isProcessingPayment = false;
            if (confirmBtn) { confirmBtn.textContent = 'Confirm purchase'; confirmBtn.disabled = false; }
            return;
        }

        var payment = await Pi.createPayment({
            amount: Number(totalPrice),
            memo: quantity + ' ' + typeLabel + ' ticket(s): ' + event.title,
            metadata: { eventId: event.id, eventTitle: event.title, quantity: quantity, ticketType: ticketType }
        }, {
            onReadyForServerApproval: function(paymentId) {
                fetch(BACKEND_URL + '/api/pi/approve', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ paymentId: paymentId })
                }).catch(function(e) { console.error('Approve error:', e); });
            },
            onReadyForServerCompletion: async function(paymentId, txid) {
                console.log('Payment completed:', txid);
                try {
                    var ticketsAdded = [];
                    var purchaseDate = new Date().toISOString();
                    var purchaseDateTime = new Date().toLocaleString('en-US');

                    for (var i = 0; i < quantity; i++) {
                        var ticketId = Date.now().toString() + '-' + i + '-' + Math.random().toString(36).substring(2, 6);
                        var ticket = {
                            id: ticketId, eventId: event.id, eventTitle: event.title,
                            eventDate: event.date, eventLocation: event.location,
                            category: event.category || '', price: price,
                            ticketType: ticketType, pays: event.pays || event.country || 'France',
                            buyerWallet: currentUser.wallet, buyerName: currentUser.name,
                            userWallet: currentUser.wallet, status: 'Valid',
                            purchaseDate: purchaseDate, purchaseDateTime: purchaseDateTime,
                            transactionId: txid || 'tx-' + Date.now(),
                            qrCode: 'BETIX-' + Date.now() + '-' + (txid ? txid.substring(0, 8) : 'xxxx') + '-' + i
                        };
                        tickets.push(ticket);
                        ticketsAdded.push(ticket);
                    }

                    event.seatsLeft -= quantity;
                    event.boosts = (event.boosts || 0) + quantity;

                    saveEvents();
                    saveTickets();

                    for (var j = 0; j < ticketsAdded.length; j++) {
                        await saveTicketToSupabase(ticketsAdded[j]);
                    }
                    await saveEventToSupabase(event);
                    await saveTransactionToSupabase({
                        id: 'tx-' + Date.now(),
                        buyerWallet: currentUser.wallet,
                        buyerPiUid: currentUser.piUid || currentUser.wallet,
                        eventId: event.id, amount: totalPrice,
                        txid: txid || 'tx-' + Date.now(),
                        status: 'completed', date: new Date().toISOString()
                    });

                    addNotification('Purchase of ' + quantity + ' ' + typeLabel + ' ticket(s) for "' + event.title + '"', 'purchase');
                    renderEventsByCategory();
                    renderTickets();
                    renderHistory();
                    updateProfilePage();
                    await syncUserToSupabase();
                    showSuccessPopup(event, ticketsAdded, quantity, ticketType);

                } catch(e) {
                    console.error('Completion error:', e);
                    alert('Payment completed but there was an error saving your tickets.');
                } finally {
                    isProcessingPayment = false;
                    if (confirmBtn) { confirmBtn.textContent = 'Confirm purchase'; confirmBtn.disabled = false; }
                }
            },
            onCancel: function() {
                console.log('Payment cancelled');
                alert("Payment cancelled");
                isProcessingPayment = false;
                if (confirmBtn) { confirmBtn.textContent = 'Confirm purchase'; confirmBtn.disabled = false; }
            },
            onError: function(error) {
                console.error('Payment error:', error);
                alert("Payment error: " + (error.message || 'Unknown error'));
                isProcessingPayment = false;
                if (confirmBtn) { confirmBtn.textContent = 'Confirm purchase'; confirmBtn.disabled = false; }
            }
        });

    } catch(e) {
        console.error('Purchase error:', e);
        alert("Error: " + (e.message || 'Unknown error'));
        isProcessingPayment = false;
        if (confirmBtn) { confirmBtn.textContent = 'Confirm purchase'; confirmBtn.disabled = false; }
    }
}

// ============================================================
// ===== SUCCESS POPUP =====
// ============================================================

function showSuccessPopup(event, ticketsList, quantity, ticketType) {
    var popup = document.getElementById('successPopup');
    var title = document.getElementById('successTitle');
    var message = document.getElementById('successMessage');
    var info = document.getElementById('successTicketInfo');
    if (!popup) return;
    var qty = quantity || ticketsList.length;
    var ticket = ticketsList[0] || {};
    var typeLabel = ticketType === 'vip' ? 'VIP' : 'Standard';
    var price = (event.ticketTypes && event.ticketTypes[ticketType] && event.ticketTypes[ticketType].price) || event.price || 0;
    var totalPrice = qty * price;
    var dateEvent = new Date(event.date);
    var dateFormatted = dateEvent.toLocaleDateString('en-US');
    var timeFormatted = dateEvent.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

    title.textContent = 'Purchase successful!';
    message.textContent = qty + ' ' + typeLabel + ' ticket(s) added.';
    info.innerHTML =
        '<div class="ticket-line"><span class="ticket-label">Event</span><span class="ticket-value">' + escapeHtml(event.title) + '</span></div>' +
        '<div class="ticket-line"><span class="ticket-label">Type</span><span class="ticket-value">' + typeLabel + '</span></div>' +
        '<div class="ticket-line"><span class="ticket-label">Date</span><span class="ticket-value">' + dateFormatted + ' at ' + timeFormatted + '</span></div>' +
        '<div class="ticket-line"><span class="ticket-label">Location</span><span class="ticket-value">' + escapeHtml(event.location || 'Online') + '</span></div>' +
        '<div class="ticket-line"><span class="ticket-label">Quantity</span><span class="ticket-value">' + qty + '</span></div>' +
        '<div class="ticket-line"><span class="ticket-label">Total</span><span class="ticket-value">' + totalPrice.toFixed(6) + ' Pi</span></div>' +
        '<div class="ticket-line"><span class="ticket-label">Code</span><span class="ticket-value" style="font-size:0.7rem;font-family:monospace;">' + escapeHtml(ticket.qrCode || 'N/A') + '</span></div>';
    popup.classList.add('show');
}

function closeSuccessPopup() {
    document.getElementById('successPopup').classList.remove('show');
}

// ============================================================
// ===== CREATE EVENT =====
// ============================================================

async function createEvent(e) {
    e.preventDefault();
    var publishBtn = document.getElementById('publishEventBtn');
    if (publishBtn.classList.contains('loading')) return;
    if (!currentUser.wallet) { alert('Connect your Pi account first'); return; }

    var title = document.getElementById('eventTitle').value.trim();
    var category = document.getElementById('eventCategory').value;
    var pays = document.getElementById('eventCountry').value;
    var date = document.getElementById('eventDate').value;
    var location = document.getElementById('eventLocation').value.trim();
    var description = document.getElementById('eventDescription').value.trim();
    var conditions = document.getElementById('eventConditions').value.trim();
    var seatsTotal = parseInt(document.getElementById('eventSeats').value);
    var durationValue = document.getElementById('eventDurationValue').value;
    var durationUnit = document.getElementById('eventDurationUnit').value;

    if (!title) return alert('Enter a title');
    if (!date) return alert('Select a date and time');
    if (!location) return alert('Enter a location');
    if (!seatsTotal || seatsTotal < 1) return alert('Enter valid number of seats');
    if (!conditions) return alert('Add participation conditions');

    var standardEnabled = document.getElementById('ticketStandardEnabled').checked;
    var vipEnabled = document.getElementById('ticketVipEnabled').checked;
    var standardPrice = parseFloat(document.getElementById('ticketStandardPrice').value);
    var vipPrice = parseFloat(document.getElementById('ticketVipPrice').value);

    if (!standardEnabled && !vipEnabled) return alert('Enable at least one ticket type');
    if (standardEnabled && (!standardPrice || standardPrice <= 0)) return alert('Enter valid price for Standard tickets');
    if (vipEnabled && (!vipPrice || vipPrice <= 0)) return alert('Enter valid price for VIP tickets');

    var images = getUploadedImages();
    if (images.length < 2) return alert('Please add 2 photos');

    publishBtn.classList.add('loading');
    publishBtn.disabled = true;

    try {
        var newEvent = {
            id: Date.now().toString(),
            title: title, category: category, pays: pays, country: pays,
            date: date, location: location, description: description || '',
            conditions: conditions,
            price: standardEnabled ? standardPrice : (vipEnabled ? vipPrice : 0.0003),
            seatsTotal: seatsTotal, seatsLeft: seatsTotal,
            images: images, coverImage: images[0],
            organizer: currentUser.wallet, organizerPiUid: currentUser.piUid || currentUser.wallet,
            organizerName: currentUser.name, createdAt: new Date().toISOString(),
            boosts: 0, durationValue: durationValue ? parseInt(durationValue) : null,
            durationUnit: durationUnit || null,
            ticketTypes: {
                standard: { enabled: standardEnabled, price: standardPrice || 0 },
                vip: { enabled: vipEnabled, price: vipPrice || 0 }
            }
        };
        openPublishConfirm(newEvent);
    } catch(error) {
        console.error('Create event error:', error);
        alert('Error: ' + error.message);
        publishBtn.classList.remove('loading');
        publishBtn.disabled = false;
    }
}

// ============================================================
// ===== PUBLISH CONFIRMATION =====
// ============================================================

function openPublishConfirm(eventData) {
    pendingEventData = eventData;
    document.getElementById('confirmTitle').textContent = eventData.title || 'Untitled';
    document.getElementById('confirmCategory').textContent = eventData.category || 'Uncategorized';
    document.getElementById('confirmCountry').textContent = eventData.pays || eventData.country || 'Not specified';
    document.getElementById('confirmDate').textContent = new Date(eventData.date).toLocaleDateString('en-US') + ' at ' + new Date(eventData.date).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    document.getElementById('confirmLocation').textContent = eventData.location || 'Online';
    document.getElementById('confirmPrice').textContent = eventData.price + ' Pi';
    document.getElementById('confirmSeats').textContent = eventData.seatsTotal || 0;
    document.getElementById('confirmOrganizer').textContent = currentUser.name || currentUser.wallet || 'Unknown';
    document.getElementById('confirmDescription').textContent = eventData.description || 'No description';
    document.getElementById('confirmConditions').textContent = eventData.conditions || 'No conditions';

    var types = [];
    if (eventData.ticketTypes && eventData.ticketTypes.standard && eventData.ticketTypes.standard.enabled) {
        types.push('Standard: ' + eventData.ticketTypes.standard.price + ' Pi');
    }
    if (eventData.ticketTypes && eventData.ticketTypes.vip && eventData.ticketTypes.vip.enabled) {
        types.push('VIP: ' + eventData.ticketTypes.vip.price + ' Pi');
    }
    document.getElementById('confirmTicketTypes').textContent = types.join(' | ') || 'Not specified';

    var confirmImages = document.getElementById('confirmImages');
    confirmImages.innerHTML = '';
    if (eventData.images && eventData.images.length > 0) {
        for (var i = 0; i < eventData.images.length; i++) {
            var img = document.createElement('img');
            img.src = eventData.images[i];
            confirmImages.appendChild(img);
        }
    }
    document.getElementById('publishConfirmPopup').classList.add('show');
}

function closePublishConfirmPopup() {
    document.getElementById('publishConfirmPopup').classList.remove('show');
    var publishBtn = document.getElementById('publishEventBtn');
    if (publishBtn) { publishBtn.classList.remove('loading'); publishBtn.disabled = false; }
    pendingEventData = null;
}

async function confirmPublishEvent() {
    if (!pendingEventData) return alert('No event data');
    var confirmBtn = document.getElementById('confirmPublishBtn');
    if (confirmBtn) { confirmBtn.classList.add('loading'); confirmBtn.disabled = true; }

    try {
        var newEvent = pendingEventData;
        var uploadedUrls = [];
        if (newEvent.images && newEvent.images.length > 0) {
            for (var i = 0; i < newEvent.images.length; i++) {
                var url = await uploadEventImage(newEvent.id, newEvent.images[i], i);
                uploadedUrls.push(url || newEvent.images[i]);
            }
        }
        newEvent.images = uploadedUrls;
        newEvent.coverImage = uploadedUrls.length > 0 ? uploadedUrls[0] : '';

        events.push(newEvent);
        saveEvents();
        await saveEventToSupabase(newEvent);
        await syncUserToSupabase();

        document.getElementById('eventForm').reset();
        for (var i = 0; i < 2; i++) removeImageModern(i);
        uploadedImages = {};
        setupTicketTypesUI();

        addNotification('New event "' + newEvent.title + '" published!', 'event');
        closePublishConfirmPopup();
        renderEventsByCategory();
        updateProfilePage();
        if (confirmBtn) { confirmBtn.classList.remove('loading'); confirmBtn.disabled = false; }
        alert('Event "' + newEvent.title + '" published successfully!');
        showPage('home');

    } catch(error) {
        console.error('Publish error:', error);
        alert('Error: ' + error.message);
        if (confirmBtn) { confirmBtn.classList.remove('loading'); confirmBtn.disabled = false; }
    }
}

// ============================================================
// ===== IMAGE UPLOAD =====
// ============================================================

function compressImage(file) {
    return new Promise(function(resolve, reject) {
        if (!file || !file.type.startsWith('image/')) return reject(new Error('Not an image'));
        var reader = new FileReader();
        reader.onload = function(event) {
            var img = new Image();
            img.onload = function() {
                var width = img.width, height = img.height;
                var maxWidth = 800, maxHeight = 800;
                if (width > maxWidth || height > maxHeight) {
                    var ratio = Math.min(maxWidth / width, maxHeight / height);
                    width = Math.round(width * ratio);
                    height = Math.round(height * ratio);
                }
                var canvas = document.createElement('canvas');
                canvas.width = width;
                canvas.height = height;
                var ctx = canvas.getContext('2d');
                ctx.imageSmoothingEnabled = true;
                ctx.imageSmoothingQuality = 'high';
                ctx.drawImage(img, 0, 0, width, height);
                resolve(canvas.toDataURL('image/webp', 0.7));
            };
            img.onerror = function() { reject(new Error('Failed to load image')); };
            img.src = event.target.result;
        };
        reader.onerror = function() { reject(new Error('Failed to read file')); };
        reader.readAsDataURL(file);
    });
}

async function handleImageUploadModern(file, index) {
    if (!file || !file.type.startsWith('image/')) return alert('Please select an image');
    if (file.size > 10 * 1024 * 1024) return alert('Image too large (max 10MB)');

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
        var compressedData = await compressImage(file);
        progressFill.style.width = '100%';
        progressText.textContent = '100%';
        setTimeout(function() {
            progress.style.display = 'none';
            previewImage.src = compressedData;
            previewContainer.style.display = 'block';
            box.classList.add('has-image');
            box.classList.remove('compress');
            uploadedImages[index] = compressedData;
        }, 300);
    } catch(error) {
        console.error('Compress error:', error);
        alert('Error compressing image');
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
}

function getUploadedImages() {
    var images = [];
    for (var key in uploadedImages) {
        if (uploadedImages.hasOwnProperty(key)) images.push(uploadedImages[key]);
    }
    return images;
}

async function uploadEventImage(eventId, base64Data, index) {
    try {
        var response = await fetch(base64Data);
        var blob = await response.blob();
        var filePath = eventId + '/image_' + index + '_' + Date.now() + '.webp';
        await supabaseClient.storage.from('events-images').upload(filePath, blob, { contentType: blob.type, cacheControl: '3600', upsert: true });
        var { data: publicUrlData } = supabaseClient.storage.from('events-images').getPublicUrl(filePath);
        return publicUrlData.publicUrl;
    } catch(e) { console.error('Upload error:', e); return null; }
}

// ============================================================
// ===== EDIT EVENT =====
// ============================================================

function openEditEventModal(eventId) {
    var event = events.find(function(e) { return e.id === eventId; });
    if (!event) return alert('Event not found');
    if (event.organizer !== currentUser.wallet && event.organizerName !== currentUser.name) return alert('You are not the organizer');

    editingEventId = eventId;
    document.getElementById('editEventDescription').value = event.description || '';
    document.getElementById('editEventLocation').value = event.location || '';
    document.getElementById('editEventConditions').value = event.conditions || '';
    document.getElementById('editEventSeats').value = event.seatsTotal || 0;
    document.getElementById('editEventDurationValue').value = event.durationValue || '';
    document.getElementById('editEventDurationUnit').value = event.durationUnit || 'hours';
    document.getElementById('editEventModal').classList.add('show');
}

function closeEditEventModal() {
    document.getElementById('editEventModal').classList.remove('show');
    editingEventId = null;
}

async function saveEventEdits() {
    if (!editingEventId) return;
    var event = events.find(function(e) { return e.id === editingEventId; });
    if (!event) return alert('Event not found');

    var description = document.getElementById('editEventDescription').value.trim();
    var location = document.getElementById('editEventLocation').value.trim();
    var conditions = document.getElementById('editEventConditions').value.trim();
    var seatsTotal = parseInt(document.getElementById('editEventSeats').value);
    var durationValue = document.getElementById('editEventDurationValue').value;
    var durationUnit = document.getElementById('editEventDurationUnit').value;

    if (!seatsTotal || seatsTotal < 1) return alert('Enter valid number of seats');

    var ticketsSold = tickets.filter(function(t) { return t.eventId === editingEventId; }).length;
    if (seatsTotal < ticketsSold) return alert('Cannot reduce seats below ' + ticketsSold + ' sold');

    var updates = {
        description: description, location: location, conditions: conditions,
        seatsTotal: seatsTotal, seatsLeft: seatsTotal - ticketsSold,
        durationValue: durationValue ? parseInt(durationValue) : null,
        durationUnit: durationUnit || null
    };

    event.description = updates.description;
    event.location = updates.location;
    event.conditions = updates.conditions;
    event.seatsTotal = updates.seatsTotal;
    event.seatsLeft = updates.seatsLeft;
    event.durationValue = updates.durationValue;
    event.durationUnit = updates.durationUnit;

    saveEvents();
    await updateEventInSupabase(editingEventId, {
        description: updates.description, location: updates.location,
        conditions: updates.conditions, max_tickets: updates.seatsTotal,
        duration_value: updates.durationValue, duration_unit: updates.durationUnit
    });

    addNotification('Event "' + event.title + '" updated', 'event');
    closeEditEventModal();
    renderEventsByCategory();
    renderMyEvents();
    alert('Event updated successfully!');
}

// ============================================================
// ===== TICKETS & HISTORY =====
// ============================================================

function renderTickets() {
    var container = document.getElementById('ticketsList');
    if (!container) return;
    var active = tickets.filter(function(t) {
        var isUsed = usedTickets.indexOf(t.id) !== -1;
        var isExpired = new Date(t.eventDate) <= new Date();
        return !isUsed && !isExpired && t.status !== 'Used';
    });
    active.sort(function(a, b) { return new Date(b.purchaseDate) - new Date(a.purchaseDate); });
    if (!active.length) { container.innerHTML = '<p style="text-align:center;padding:2rem;color:var(--gray);">No active tickets</p>'; return; }
    container.innerHTML = active.map(function(t) { return renderTicketCard(t, 'valid'); }).join('');
}

function renderHistory() {
    var container = document.getElementById('historyList');
    if (!container) return;
    var history = tickets.filter(function(t) {
        var isUsed = usedTickets.indexOf(t.id) !== -1;
        var isExpired = new Date(t.eventDate) <= new Date();
        return isUsed || isExpired || t.status === 'Used';
    });
    history.sort(function(a, b) { return new Date(b.purchaseDate) - new Date(a.purchaseDate); });
    if (!history.length) { container.innerHTML = '<p style="text-align:center;padding:2rem;color:var(--gray);">No ticket history</p>'; return; }
    container.innerHTML = history.map(function(t) { return renderTicketCard(t, 'past'); }).join('');
}

function renderTicketCard(ticket, status) {
    var dateEvent = new Date(ticket.eventDate);
    var dateFormatted = dateEvent.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    var timeFormatted = dateEvent.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    var isVip = ticket.ticketType === 'vip';
    var typeLabel = isVip ? 'VIP' : 'Standard';
    var vipClass = isVip ? 'ticket-vip' : '';
    var qrCode = ticket.qrCode || 'BETIX-' + ticket.id.substring(0, 8);
    var shortQr = qrCode.length > 12 ? qrCode.substring(0, 10) + '...' : qrCode;
    var participantName = ticket.buyerName || ticket.buyerWallet || 'Anonymous';
    if (participantName.length > 20) participantName = participantName.substring(0, 18) + '...';

    var downloadButton = status === 'valid' ? '<button class="btn-download-ticket" onclick="downloadTicket(\'' + ticket.id + '\')"><i class="fas fa-download"></i> Download Ticket</button>' : '';

    return '<div class="ticket-card-premium ' + vipClass + '">' +
        '<div class="ticket-header ' + (isVip ? 'vip-header' : '') + '">' +
            '<span class="ticket-status ' + status + ' ' + (isVip ? 'vip-badge' : '') + '">' + (status === 'valid' ? 'Valid' : 'Past') + ' - ' + typeLabel + '</span>' +
            '<span class="ticket-number">#' + ticket.id.substring(0, 8).toUpperCase() + '</span>' +
        '</div>' +
        '<div class="ticket-body">' +
            '<div class="ticket-event-title">' + escapeHtml(ticket.eventTitle) + '</div>' +
            '<span class="ticket-category ' + (isVip ? 'vip-category' : '') + '">' + escapeHtml(ticket.category || 'Event') + ' | ' + typeLabel + '</span>' +
            '<div class="ticket-info-grid">' +
                '<div class="ticket-info-item"><i class="fas fa-calendar-day"></i> <span class="ticket-label">Date</span> <span class="ticket-value">' + dateFormatted + '</span></div>' +
                '<div class="ticket-info-item"><i class="fas fa-clock"></i> <span class="ticket-label">Time</span> <span class="ticket-value">' + timeFormatted + '</span></div>' +
                '<div class="ticket-info-item"><i class="fas fa-map-marker-alt"></i> <span class="ticket-label">Location</span> <span class="ticket-value">' + escapeHtml(ticket.eventLocation || 'Online') + '</span></div>' +
                '<div class="ticket-info-item"><i class="fas fa-tag"></i> <span class="ticket-label">Price</span> <span class="ticket-value">' + (ticket.price || 0) + ' Pi</span></div>' +
                '<div class="ticket-info-item"><i class="fas fa-ticket-alt"></i> <span class="ticket-label">Type</span> <span class="ticket-value">' + typeLabel + '</span></div>' +
                '<div class="ticket-info-item"><i class="fas fa-globe"></i> <span class="ticket-label">Country</span> <span class="ticket-value">' + escapeHtml(ticket.pays || 'France') + '</span></div>' +
            '</div>' +
            '<div class="ticket-footer">' +
                '<div class="ticket-qr">' +
                    '<div class="qr-code ' + (isVip ? 'vip-qr' : '') + '">' + shortQr + '</div>' +
                    '<div><span class="qr-label">Code</span><br><span style="font-size:0.6rem;color:var(--gray);font-family:monospace;">' + qrCode + '</span></div>' +
                '</div>' +
                '<div class="ticket-participant">Participant<br><span class="participant-name">' + escapeHtml(participantName) + '</span></div>' +
            '</div>' +
            downloadButton +
        '</div>' +
        '<div class="ticket-logo-placeholder">BETIX</div>' +
    '</div>';
}

// ============================================================
// ===== DOWNLOAD TICKET =====
// ============================================================

async function downloadTicket(ticketId) {
    var ticket = tickets.find(function(t) { return t.id === ticketId; });
    if (!ticket) return alert('Ticket not found');

    try {
        var { jsPDF } = window.jspdf;
        var doc = new jsPDF('p', 'mm', 'a4');
        var pageWidth = 210, margin = 15, y = margin;

        doc.setFillColor(13, 71, 161);
        doc.rect(0, 0, pageWidth, 45, 'F');
        doc.setTextColor(255, 255, 255);
        doc.setFontSize(28);
        doc.setFont('helvetica', 'bold');
        doc.text('BETIX', pageWidth / 2, 22, { align: 'center' });
        doc.setFontSize(12);
        doc.setFont('helvetica', 'normal');
        doc.text('Event Ticket', pageWidth / 2, 34, { align: 'center' });

        y = 55;
        var isVip = ticket.ticketType === 'vip';
        var typeLabel = isVip ? 'VIP' : 'Standard';

        doc.setFillColor(isVip ? 212 : 13, isVip ? 145 : 71, isVip ? 30 : 161);
        doc.rect(margin, y, 40, 10, 'F');
        doc.setTextColor(255, 255, 255);
        doc.setFontSize(10);
        doc.setFont('helvetica', 'bold');
        doc.text(typeLabel, margin + 20, y + 7, { align: 'center' });

        y += 20;
        doc.setTextColor(26, 26, 46);
        doc.setFontSize(18);
        doc.setFont('helvetica', 'bold');
        var titleLines = doc.splitTextToSize(ticket.eventTitle, pageWidth - margin * 2);
        doc.text(titleLines, margin, y);
        y += titleLines.length * 8 + 8;

        doc.setDrawColor(200, 200, 200);
        doc.setFillColor(248, 250, 252);
        doc.roundedRect(margin, y, pageWidth - margin * 2, 110, 4, 4, 'FD');

        var infoY = y + 10;
        doc.setFontSize(10);
        doc.setFont('helvetica', 'normal');
        var dateEvent = new Date(ticket.eventDate);
        var dateFormatted = dateEvent.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });
        var timeFormatted = dateEvent.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

        var fields = [
            ['Date:', dateFormatted],
            ['Time:', timeFormatted],
            ['Location:', ticket.eventLocation || 'Online'],
            ['Price:', (ticket.price || 0) + ' Pi'],
            ['Type:', typeLabel],
            ['Country:', ticket.pays || 'France']
        ];

        for (var i = 0; i < fields.length; i++) {
            doc.setTextColor(107, 114, 128);
            doc.setFont('helvetica', 'normal');
            doc.text(fields[i][0], margin + 10, infoY);
            doc.setTextColor(26, 26, 46);
            doc.setFont('helvetica', 'bold');
            doc.text(fields[i][1], margin + 55, infoY);
            infoY += 10;
        }

        y += 120;
        doc.setDrawColor(200, 200, 200);
        doc.setFillColor(255, 255, 255);
        doc.roundedRect(margin, y, pageWidth - margin * 2, 30, 4, 4, 'FD');

        doc.setTextColor(107, 114, 128);
        doc.setFontSize(9);
        doc.setFont('helvetica', 'normal');
        doc.text('Ticket Number', margin + 10, y + 8);
        doc.setTextColor(26, 26, 46);
        doc.setFontSize(12);
        doc.setFont('helvetica', 'bold');
        var codeDisplay = ticket.qrCode || 'BETIX-' + ticket.id.substring(0, 8);
        doc.text(codeDisplay, margin + 10, y + 22);

        y += 40;
        doc.setDrawColor(200, 200, 200);
        doc.setFillColor(245, 247, 250);
        doc.roundedRect(margin, y, pageWidth - margin * 2, 45, 4, 4, 'FD');
        doc.setTextColor(107, 114, 128);
        doc.setFontSize(9);
        doc.setFont('helvetica', 'normal');
        doc.text('QR Code', margin + 10, y + 8);
        doc.setTextColor(26, 26, 46);
        doc.setFontSize(10);
        doc.setFont('helvetica', 'bold');
        var qrText = codeDisplay.length > 30 ? codeDisplay.substring(0, 28) + '...' : codeDisplay;
        doc.text(qrText, margin + 10, y + 22);

        y += 55;
        doc.setDrawColor(200, 200, 200);
        doc.line(margin, y, pageWidth - margin, y);
        y += 8;
        doc.setTextColor(107, 114, 128);
        doc.setFontSize(8);
        doc.setFont('helvetica', 'normal');
        doc.text('This ticket is valid for one entry. Please present this ticket at the entrance.', pageWidth / 2, y, { align: 'center' });
        y += 6;
        doc.text('BETIX - The first ticketing platform on Pi Network', pageWidth / 2, y, { align: 'center' });

        var fileName = 'ticket_' + ticket.eventTitle.replace(/\s+/g, '_') + '_' + ticket.id.substring(0, 6) + '.pdf';
        doc.save(fileName);
        addNotification('Ticket downloaded: ' + ticket.eventTitle, 'info');

    } catch(e) {
        console.error('PDF error:', e);
        alert('Error generating PDF: ' + e.message);
    }
}

// ============================================================
// ===== MY RATINGS =====
// ============================================================

function renderMyRatings() {
    var container = document.getElementById('myRatingsList');
    if (!container) return;
    var myRatings = ratings.filter(function(r) { return r.userWallet === (currentUser.wallet || currentUser.name); });
    if (!myRatings.length) { container.innerHTML = '<p style="text-align:center;padding:2rem;">No ratings</p>'; return; }
    container.innerHTML = myRatings.map(function(r) {
        var stars = '';
        for (var i = 0; i < r.rating; i++) stars += '★';
        for (var i = r.rating; i < 5; i++) stars += '☆';
        return '<div class="ticket-card"><h3>' + escapeHtml(r.eventTitle) + '</h3><div>Rating: ' + r.rating + '/5 ' + stars + '</div>' + (r.comment ? '<p>"' + escapeHtml(r.comment) + '"</p>' : '') + '<small>' + new Date(r.date).toLocaleDateString() + '</small></div>';
    }).join('');
}

// ============================================================
// ===== ADMIN =====
// ============================================================

function initAdmin() {
    var adminItem = document.getElementById('adminMenuItem');
    if (!adminItem) return;
    var logo = document.querySelector('.logo');
    if (logo) {
        logo.addEventListener('click', function() {
            logoClickCount++;
            if (logoClickCount === 5) {
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
                logoClickCount = 0;
            }
            setTimeout(function() { logoClickCount = 0; }, 2000);
        });
    }
    if (localStorage.getItem('betix_admin_password') === adminPassword || localStorage.getItem('betix_admin_password') === 'Betix@2026#') {
        adminItem.style.display = 'block';
        adminItem.style.background = 'linear-gradient(135deg, #1a1a2e, #0D47A1)';
        adminItem.style.color = 'white';
    }
}

function addAdminLog(action, details) {
    var log = { id: Date.now(), timestamp: new Date().toISOString(), date: new Date().toLocaleString('en-US'), user: currentUser.wallet || 'Local Admin', action: action, details: details || '' };
    adminLogs.unshift(log);
    if (adminLogs.length > 500) adminLogs = adminLogs.slice(0, 500);
    localStorage.setItem('betix_admin_logs', JSON.stringify(adminLogs));
    renderAdminLogs();
}

function renderAdminLogs() {
    var container = document.getElementById('adminLogsList');
    if (!container) return;
    if (adminLogs.length === 0) { container.innerHTML = '<p style="text-align:center;padding:20px;color:var(--gray);">No logs</p>'; return; }
    container.innerHTML = adminLogs.map(function(log) {
        return '<div class="admin-log-item"><div><span class="log-user">' + escapeHtml(log.user) + '</span> <span class="log-action">' + escapeHtml(log.action) + '</span>' + (log.details ? ' <span style="color:var(--gray);font-size:0.8rem;">' + escapeHtml(log.details) + '</span>' : '') + '</div><span class="log-time">' + escapeHtml(log.date) + '</span></div>';
    }).join('');
}

function adminClearLogs() {
    if (confirm('Clear all logs?')) { adminLogs = []; localStorage.setItem('betix_admin_logs', JSON.stringify(adminLogs)); renderAdminLogs(); addAdminLog('Logs cleared', 'All logs deleted'); alert('Logs cleared'); }
}

function startAdminSession() {
    addAdminLog('Admin login', 'Access to administration');
    localStorage.setItem('betix_admin_login_count', (parseInt(localStorage.getItem('betix_admin_login_count') || 0) + 1).toString());
    localStorage.setItem('betix_admin_last_login', new Date().toLocaleString('en-US'));
    adminSessionTimer = 1800;
    updateAdminTimerDisplay();
    if (adminTimerInterval) clearInterval(adminTimerInterval);
    adminTimerInterval = setInterval(function() {
        adminSessionTimer--;
        updateAdminTimerDisplay();
        if (adminSessionTimer <= 0) { clearInterval(adminTimerInterval); adminTimerInterval = null; adminLogout(); }
    }, 1000);
}

function resetAdminTimer() { if (adminTimerInterval) { adminSessionTimer = 1800; updateAdminTimerDisplay(); } }

function updateAdminTimerDisplay() {
    var display = document.getElementById('adminSessionTimer');
    if (display) {
        var minutes = Math.floor(adminSessionTimer / 60);
        var seconds = adminSessionTimer % 60;
        display.textContent = String(minutes).padStart(2, '0') + ':' + String(seconds).padStart(2, '0');
        display.style.color = adminSessionTimer < 300 ? '#ef4444' : adminSessionTimer < 600 ? '#f59e0b' : '#f5a623';
    }
}

function adminLogout() {
    if (adminTimerInterval) { clearInterval(adminTimerInterval); adminTimerInterval = null; }
    addAdminLog('Admin logout', 'Session ended');
    localStorage.removeItem('betix_admin_password');
    var adminBtn = document.getElementById('adminMenuItem');
    if (adminBtn) adminBtn.style.display = 'none';
    alert('Admin session ended');
    showPage('home');
}

function adminChangePassword() {
    var newPassword = document.getElementById('adminNewPassword').value;
    var confirmPassword = document.getElementById('adminConfirmPassword').value;
    var message = document.getElementById('adminPasswordMessage');
    if (!newPassword || newPassword.length < 6) { message.textContent = 'Password must be at least 6 characters'; message.style.color = '#ef4444'; return; }
    if (newPassword !== confirmPassword) { message.textContent = 'Passwords do not match'; message.style.color = '#ef4444'; return; }
    adminPassword = newPassword;
    localStorage.setItem('betix_admin_password', newPassword);
    message.textContent = 'Password changed successfully!';
    message.style.color = '#10b981';
    document.getElementById('adminNewPassword').value = '';
    document.getElementById('adminConfirmPassword').value = '';
    addAdminLog('Password changed', 'Admin password updated');
    setTimeout(function() { message.textContent = ''; }, 3000);
}

function loadAdminPage() {
    var storedPassword = localStorage.getItem('betix_admin_password');
    if (storedPassword !== adminPassword && storedPassword !== 'Betix@2026#') { alert('Access denied'); showPage('home'); return; }
    if (storedPassword && storedPassword !== adminPassword) adminPassword = storedPassword;

    document.getElementById('adminUserCount').innerText = connectedUsers.length || 1;
    document.getElementById('adminTicketCount').innerText = tickets.length;
    document.getElementById('adminEventCount').innerText = events.length;
    document.getElementById('adminLastLogin').textContent = localStorage.getItem('betix_admin_last_login') || 'Never';
    document.getElementById('adminLoginCount').textContent = localStorage.getItem('betix_admin_login_count') || 0;

    renderAdminEvents();
    renderAdminSlides();
    renderAdminUsers();
    renderAdminLogs();
    initAdminTabs();
    if (!adminTimerInterval) startAdminSession();

    var userSearch = document.getElementById('adminUserSearch');
    if (userSearch) userSearch.addEventListener('input', function() { filterAdminUsers(this.value); });
}

function filterAdminUsers(query) {
    var container = document.getElementById('adminUsersList');
    if (!container) return;
    var rows = container.querySelectorAll('tr');
    var search = query.toLowerCase().trim();
    rows.forEach(function(row, index) {
        if (index === 0) return;
        row.style.display = (search === '' || row.textContent.toLowerCase().includes(search)) ? '' : 'none';
    });
}

function renderAdminUsers() {
    var container = document.getElementById('adminUsersList');
    if (!container) return;
    var html = '<table><tr><th>User</th><th>Account</th><th>Tickets</th><th>Rating</th><th>Last Seen</th></tr>';
    var userRatings = ratings.filter(function(r) { return r.userWallet === (currentUser.wallet || currentUser.name); });
    var avgRating = userRatings.length > 0 ? (userRatings.reduce(function(a, r) { return a + r.rating; }, 0) / userRatings.length) : 0;
    html += '<tr><td>' + escapeHtml(currentUser.name) + ' <span style="color:#f5a623;font-size:0.7rem;">(you)</span></td><td>' + (currentUser.wallet || 'Not connected') + '</td><td>' + tickets.length + '</td><td>' + (avgRating > 0 ? avgRating.toFixed(1) + '/5' : '-') + '</td><td>Active</td></tr>';
    for (var i = 0; i < connectedUsers.length; i++) {
        var u = connectedUsers[i];
        if (u.wallet !== currentUser.wallet) {
            var uRatings = ratings.filter(function(r) { return r.userWallet === u.wallet; });
            var uAvg = uRatings.length > 0 ? (uRatings.reduce(function(a, r) { return a + r.rating; }, 0) / uRatings.length) : 0;
            html += '<tr><td>' + escapeHtml(u.name) + '</td><td>' + (u.wallet || 'Not connected') + '</td><td>' + (u.ticketCount || 0) + '</td><td>' + (uAvg > 0 ? uAvg.toFixed(1) + '/5' : '-') + '</td><td>' + (u.lastSeen || 'Unknown') + '</td></tr>';
        }
    }
    html += '</table>';
    container.innerHTML = html;
}

function renderAdminEvents() {
    var container = document.getElementById('adminEventsList');
    if (!container) return;
    if (events.length === 0) { container.innerHTML = '<p style="text-align:center;padding:20px;color:var(--gray);">No events</p>'; return; }
    container.innerHTML = events.map(function(e) {
        var types = [];
        if (e.ticketTypes && e.ticketTypes.standard && e.ticketTypes.standard.enabled) types.push('Standard: ' + e.ticketTypes.standard.price + ' Pi');
        if (e.ticketTypes && e.ticketTypes.vip && e.ticketTypes.vip.enabled) types.push('VIP: ' + e.ticketTypes.vip.price + ' Pi');
        return '<div class="admin-event-item"><div class="event-info"><strong>' + escapeHtml(e.title) + '</strong><small>' + e.category + ' | ' + (e.pays || e.country || 'France') + ' | ' + e.seatsLeft + '/' + e.seatsTotal + ' seats</small><small>Tickets: ' + (types.join(' | ') || 'None') + '</small><small>Organizer: ' + escapeHtml(e.organizerName || e.organizer) + '</small></div><div class="event-actions"><button class="admin-delete-btn" onclick="adminDeleteEvent(\'' + e.id + '\')">Delete</button></div></div>';
    }).join('');
}

function adminDeleteEvent(id) {
    if (confirm('Delete this event?')) {
        events = events.filter(function(e) { return e.id !== id; });
        saveEvents();
        deleteEventFromSupabase(id);
        renderAdminEvents();
        renderEventsByCategory();
        document.getElementById('adminEventCount').innerText = events.length;
        addAdminLog('Event deleted', 'ID: ' + id);
        alert('Event deleted');
    }
}

function adminDeleteAllEvents() {
    if (confirm('Delete ALL events?')) {
        events = [];
        saveEvents();
        renderAdminEvents();
        renderEventsByCategory();
        document.getElementById('adminEventCount').innerText = 0;
        addAdminLog('All events deleted', 'Mass deletion');
        alert('All events deleted');
    }
}

function renderAdminSlides() {
    var container = document.getElementById('adminSlidesList');
    if (!container) return;
    if (heroSlides.length === 0) { container.innerHTML = '<p style="text-align:center;padding:20px;color:var(--gray);">No slides</p>'; return; }
    container.innerHTML = heroSlides.map(function(slide, index) {
        return '<div class="admin-slide-item"><img src="' + slide.image + '" class="slide-preview" onerror="this.style.display=\'none\'"><div class="slide-info"><h4>' + escapeHtml(slide.title) + '</h4><p>' + (slide.badge || 'Uncategorized') + ' • ' + (slide.description || '') + '</p></div><div class="slide-actions"><button class="edit-btn" onclick="adminEditSlide(' + index + ')">Edit</button><button class="delete-btn" onclick="adminDeleteSlide(' + index + ')">Delete</button></div></div>';
    }).join('');
}

function adminShowSlideForm(index) {
    var container = document.getElementById('adminSlideFormContainer');
    var preview = document.getElementById('adminSlidePreview');
    var uploadBox = document.getElementById('adminUploadBox');
    preview.style.display = 'none';
    preview.src = '';
    uploadBox.classList.remove('has-image');
    document.getElementById('adminSlideImageInput').value = '';
    container.style.display = 'block';

    if (index >= 0 && index < heroSlides.length) {
        document.getElementById('adminSlideFormTitle').textContent = 'Edit carousel image';
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
        document.getElementById('adminSlideFormTitle').textContent = 'Add carousel image';
        document.getElementById('adminSlideBadge').value = '';
        document.getElementById('adminSlideTitle').value = '';
        document.getElementById('adminSlideDesc').value = '';
        document.getElementById('adminEditSlideIndex').value = '-1';
    }
    container.scrollIntoView({ behavior: 'smooth' });
}

function adminSaveSlide() {
    var imageInput = document.getElementById('adminSlideImageInput');
    var badge = document.getElementById('adminSlideBadge').value.trim();
    var title = document.getElementById('adminSlideTitle').value.trim();
    var description = document.getElementById('adminSlideDesc').value.trim();
    var editIndex = parseInt(document.getElementById('adminEditSlideIndex').value);

    if (!title) return alert('Enter a title');

    if (imageInput.files && imageInput.files[0]) {
        var file = imageInput.files[0];
        if (!file.type.startsWith('image/')) return alert('Select an image');
        if (file.size > 5 * 1024 * 1024) return alert('Image too large (max 5MB)');
        var reader = new FileReader();
        reader.onload = function(e) { saveSlideData(e.target.result, badge, title, description, editIndex); };
        reader.readAsDataURL(file);
    } else if (editIndex >= 0 && editIndex < heroSlides.length) {
        saveSlideData(heroSlides[editIndex].image, badge, title, description, editIndex);
    } else {
        alert('Please select an image');
    }
}

function saveSlideData(image, badge, title, description, index) {
    var slideData = { image: image, badge: badge, title: title, description: description };
    if (index >= 0 && index < heroSlides.length) heroSlides[index] = slideData;
    else heroSlides.push(slideData);
    localStorage.setItem('betix_hero_slides', JSON.stringify(heroSlides));
    adminCancelSlideForm();
    renderAdminSlides();
    initHeroSlider();
    addAdminLog('Slide modified', 'Title: ' + title);
    alert('Image saved!');
}

function adminDeleteSlide(index) {
    if (!confirm('Delete this slide?')) return;
    var title = heroSlides[index] ? heroSlides[index].title : 'Untitled';
    heroSlides.splice(index, 1);
    localStorage.setItem('betix_hero_slides', JSON.stringify(heroSlides));
    renderAdminSlides();
    initHeroSlider();
    addAdminLog('Slide deleted', 'Title: ' + title);
}

function adminEditSlide(index) { adminShowSlideForm(index); }

function adminCancelSlideForm() {
    document.getElementById('adminSlideFormContainer').style.display = 'none';
    document.getElementById('adminEditSlideIndex').value = '-1';
    document.getElementById('adminSlideImageInput').value = '';
    document.getElementById('adminSlidePreview').style.display = 'none';
    document.getElementById('adminSlidePreview').src = '';
    document.getElementById('adminUploadBox').classList.remove('has-image');
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
            for (var key in contents) { if (contents[key]) contents[key].classList.remove('active'); }
            var tabName = this.dataset.tab;
            if (contents[tabName]) contents[tabName].classList.add('active');
        });
    });
}

// ============================================================
// ===== MY EVENTS =====
// ============================================================

function renderMyEvents() {
    var container = document.getElementById('myEventsList');
    if (!container) return;
    var myEvents = events.filter(function(e) { return e.organizer === currentUser.wallet || e.organizerName === currentUser.name; });
    if (myEvents.length === 0) { container.innerHTML = '<p style="text-align:center;padding:2rem;color:var(--gray);">No events created</p>'; return; }
    container.innerHTML = myEvents.map(function(e) { return renderMyEventCard(e); }).join('');
}

function renderMyEventCard(event) {
    var dateEvent = new Date(event.date);
    var dateFormatted = dateEvent.toLocaleDateString('en-US');
    var timeFormatted = dateEvent.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    var ticketSold = tickets.filter(function(t) { return t.eventId === event.id; }).length;
    var posterImage = event.coverImage || (event.images && event.images[0]) || eventImagesList[event.category] || eventImagesList.Concert;

    var typesDisplay = '';
    if (event.ticketTypes && event.ticketTypes.standard && event.ticketTypes.standard.enabled) typesDisplay += 'Standard: ' + event.ticketTypes.standard.price + ' Pi | ';
    if (event.ticketTypes && event.ticketTypes.vip && event.ticketTypes.vip.enabled) typesDisplay += 'VIP: ' + event.ticketTypes.vip.price + ' Pi';
    if (!typesDisplay) typesDisplay = 'No ticket types';

    return '<div class="event-card" style="cursor:default;">' +
        '<div class="event-gallery-wrapper"><div class="event-gallery"><img src="' + posterImage + '" class="event-gallery-img" style="width:100%;height:150px;object-fit:cover;"></div></div>' +
        '<div class="event-info"><div class="event-title">' + escapeHtml(event.title) + '</div>' +
        '<div class="event-details-grid">' +
            '<div class="detail-item"><i class="fas fa-calendar-day"></i> ' + dateFormatted + '</div>' +
            '<div class="detail-item"><i class="fas fa-clock"></i> ' + timeFormatted + '</div>' +
            '<div class="detail-item"><i class="fas fa-map-marker-alt"></i> ' + escapeHtml(event.location || 'Online') + '</div>' +
            '<div class="detail-item"><i class="fas fa-flag"></i> ' + escapeHtml(event.pays || event.country || 'Not specified') + '</div>' +
            '<div class="detail-item"><i class="fas fa-ticket-alt"></i> ' + ticketSold + ' sold</div>' +
            '<div class="detail-item"><i class="fas fa-users"></i> ' + event.seatsLeft + '/' + event.seatsTotal + ' seats</div>' +
            '<div class="detail-item" style="grid-column:1/-1;font-size:0.7rem;color:var(--gray);">' + typesDisplay + '</div>' +
        '</div>' +
        '<div class="event-footer"><div style="display:flex;gap:8px;"><button class="btn-secondary" onclick="openEditEventModal(\'' + event.id + '\')" style="background:var(--primary);color:white;padding:4px 12px;font-size:0.7rem;">Edit</button></div></div>' +
        '</div></div>';
}

// ============================================================
// ===== RENDER EVENTS =====
// ============================================================

function renderEventsByCategory() {
    var container = document.getElementById('eventsByCategory');
    if (!container) return;

    var filtered = events.filter(function(e) {
        var matchCategory = (currentFilter === 'All' || e.category === currentFilter);
        var matchCountry = (currentCountryFilter === 'All' || (e.pays || e.country) === currentCountryFilter);
        var matchSearch = (e.title.toLowerCase().includes(searchQuery) || (e.location && e.location.toLowerCase().includes(searchQuery)));
        return matchCategory && matchCountry && matchSearch;
    });

    if (filtered.length === 0) { container.innerHTML = '<p style="text-align:center;padding:2rem;color:var(--gray);">No events found</p>'; return; }

    var cats = ['Concert', 'Sport', 'Conference', 'Training', 'Cinema', 'Festival', 'Theatre', 'Dance', 'Exhibition', 'Gala', 'Seminar'];
    var html = '';

    if (currentFilter !== 'All') {
        html = '<div class="category-section"><div class="events-grid-centered">';
        filtered.forEach(function(e) { html += renderEventCard(e); });
        html += '</div></div>';
    } else {
        for (var i = 0; i < cats.length; i++) {
            var cat = cats[i];
            var catEvents = filtered.filter(function(e) { return e.category === cat; });
            if (catEvents.length) {
                html += '<div class="category-section"><div class="category-header">' + cat + '</div><div class="events-grid-centered">';
                catEvents.forEach(function(e) { html += renderEventCard(e); });
                html += '</div></div>';
            }
        }
    }
    container.innerHTML = html;
}

// ============================================================
// ===== RENDER EVENT CARD =====
// ============================================================

function renderEventCard(event) {
    var avgRating = 0;
    var eventRatings = ratings.filter(function(r) { return r.eventId === event.id; });
    if (eventRatings.length > 0) {
        avgRating = eventRatings.reduce(function(a, r) { return a + r.rating; }, 0) / eventRatings.length;
    }

    var dateEvent = new Date(event.date);
    var dateFormatted = dateEvent.toLocaleDateString('en-US', { month: 'numeric', day: 'numeric', year: 'numeric' });
    var timeFormatted = dateEvent.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

    var fallbackImage = eventImagesList[event.category] || eventImagesList.Concert;
    var posterImage = event.coverImage || (event.images && event.images[0]) || fallbackImage;
    var countryFlag = getFlag(event.pays || event.country);
    var countryDisplay = event.pays || event.country || 'International';

    var desc = event.description || '';
    if (desc.length > 120) desc = desc.substring(0, 117) + '...';

    var organizerDisplay = event.organizerName || event.organizer || 'Anonymous';
    if (organizerDisplay.length > 20) organizerDisplay = organizerDisplay.substring(0, 18) + '...';
    var organizerFormatted = organizerDisplay.startsWith('@') ? organizerDisplay : '@' + organizerDisplay;

    var ratingDisplay = eventRatings.length > 0 ?
        '<span class="stars">' + '★'.repeat(Math.floor(avgRating)) + '☆'.repeat(5 - Math.floor(avgRating)) + '</span> ' + avgRating.toFixed(1) + ' (' + eventRatings.length + ')' :
        '<span class="new-badge">New</span>';

    var priceDisplay = '';
    if (event.ticketTypes && event.ticketTypes.standard && event.ticketTypes.standard.enabled) priceDisplay += 'Standard: ' + event.ticketTypes.standard.price + ' Pi';
    if (event.ticketTypes && event.ticketTypes.vip && event.ticketTypes.vip.enabled) {
        if (priceDisplay) priceDisplay += ' | ';
        priceDisplay += 'VIP: ' + event.ticketTypes.vip.price + ' Pi';
    }
    if (!priceDisplay) priceDisplay = event.price + ' Pi';

    var durationDisplay = '';
    if (event.durationValue && event.durationUnit) {
        durationDisplay = '<span class="event-duration-display"><i class="fas fa-hourglass-half"></i> ' + event.durationValue + ' ' + event.durationUnit + '</span>';
    }

    return '<div class="event-card-classic" onclick="openEventDetails(\'' + event.id + '\')">' +
        '<div class="poster-wrapper-classic">' +
            '<img src="' + posterImage + '" alt="' + escapeHtml(event.title) + '" onerror="this.src=\'' + fallbackImage + '\'">' +
            '<span class="category-badge-classic">' + escapeHtml(event.category) + '</span>' +
        '</div>' +
        '<div class="card-content-classic">' +
            '<div class="event-title-classic">' + escapeHtml(event.title) + '</div>' +
            (desc ? '<div class="event-desc-classic">' + escapeHtml(desc) + '</div>' : '') +
            '<div class="info-grid-classic">' +
                '<div class="info-item-classic"><i class="fas fa-calendar-day"></i> ' + dateFormatted + '</div>' +
                '<div class="info-item-classic"><i class="fas fa-map-marker-alt"></i> ' + escapeHtml(event.location || 'Online') + '</div>' +
                '<div class="info-item-classic"><i class="fas fa-clock"></i> ' + timeFormatted + '</div>' +
                '<div class="info-item-classic"><span class="flag-icon">' + countryFlag + '</span> ' + escapeHtml(countryDisplay) + '</div>' +
            '</div>' +
            durationDisplay +
            '<div class="card-footer-classic">' +
                '<span class="event-rating-classic">' + ratingDisplay + '</span>' +
                '<span class="event-price-classic">' + priceDisplay + '</span>' +
                ' <span class="event-seats-classic">' + event.seatsLeft + '/' + event.seatsTotal + ' seats</span>' +
            '</div>' +
            '<button class="buy-btn-classic" onclick="event.stopPropagation(); openQuantityPopup(\'' + event.id + '\')">Buy Ticket</button>' +
            '<div class="event-organizer-classic"><span class="org-icon"><i class="fas fa-user"></i></span> By ' + escapeHtml(organizerFormatted) + '</div>' +
        '</div>' +
    '</div>';
}

// ============================================================
// ===== EVENT DETAILS =====
// ============================================================

function openEventDetails(eventId) {
    var event = events.find(function(e) { return e.id === eventId; });
    if (!event) return alert('Event not found');

    var modal = document.getElementById('eventDetailModal');
    document.getElementById('detailTitle').textContent = event.title;
    document.getElementById('detailCategory').textContent = event.category;
    document.getElementById('detailCountry').textContent = event.pays || event.country || 'Not specified';
    var dateEvent = new Date(event.date);
    document.getElementById('detailDate').textContent = dateEvent.toLocaleDateString('en-US') + ' at ' + dateEvent.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    document.getElementById('detailLocation').textContent = event.location || 'Online';

    var priceDisplay = '';
    if (event.ticketTypes && event.ticketTypes.standard && event.ticketTypes.standard.enabled) priceDisplay += 'Standard: ' + event.ticketTypes.standard.price + ' Pi';
    if (event.ticketTypes && event.ticketTypes.vip && event.ticketTypes.vip.enabled) {
        if (priceDisplay) priceDisplay += ' | ';
        priceDisplay += 'VIP: ' + event.ticketTypes.vip.price + ' Pi';
    }
    if (!priceDisplay) priceDisplay = event.price + ' Pi';
    document.getElementById('detailPrice').textContent = priceDisplay;
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
                for (var i = 0; i < conditionsList.length; i++) html += '<li>' + escapeHtml(conditionsList[i].trim()) + '</li>';
                html += '</ul>';
                conditionsContainer.innerHTML = html;
            } else {
                conditionsContainer.innerHTML = '<p>' + escapeHtml(event.conditions) + '</p>';
            }
        } else {
            conditionsContainer.innerHTML = '<p style="color:var(--gray);">No conditions specified</p>';
        }
    }

    var eventRatings = ratings.filter(function(r) { return r.eventId === event.id; });
    var avgRating = eventRatings.length > 0 ? (eventRatings.reduce(function(a, r) { return a + r.rating; }, 0) / eventRatings.length) : 0;
    var ratingStars = '★'.repeat(Math.floor(avgRating)) + '☆'.repeat(5 - Math.floor(avgRating));
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
            img.onerror = function() { this.src = eventImagesList[event.category] || 'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?w=600&h=400&fit=crop'; };
            img.onclick = (function(index) { return function() { openGallery(event.id, index); }; })(j);
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
            var stars = '★'.repeat(r.rating) + '☆'.repeat(5 - r.rating);
            div.innerHTML = '<div class="review-header"><span class="review-user">' + escapeHtml(r.userName || r.userWallet) + '</span><span class="review-stars">' + stars + '</span></div>' + (r.comment ? '<div class="review-text">"' + escapeHtml(r.comment) + '"</div>' : '') + '<div class="review-date">' + new Date(r.date).toLocaleDateString('en-US') + '</div>';
            reviewsContainer.appendChild(div);
        });
    } else {
        reviewsContainer.innerHTML = '<p style="color:var(--gray);font-size:0.9rem;">No reviews yet</p>';
    }

    document.getElementById('detailBuyBtn').onclick = function() { modal.classList.remove('show'); document.body.style.overflow = ''; openQuantityPopup(event.id); };
    document.getElementById('eventDetailClose').onclick = function() { modal.classList.remove('show'); document.body.style.overflow = ''; };
    modal.classList.add('show');
    document.body.style.overflow = 'hidden';
}

// ============================================================
// ===== GALLERY =====
// ============================================================

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
    function updateImage(index) {
        if (index < 0) index = images.length - 1;
        if (index >= images.length) index = 0;
        currentIndex = index;
        imgElement.src = images[currentIndex];
    }
    updateImage(currentIndex);
    document.getElementById('galleryPrev').onclick = function() { updateImage(currentIndex - 1); };
    document.getElementById('galleryNext').onclick = function() { updateImage(currentIndex + 1); };
    modal.classList.add('show');
}

// ============================================================
// ===== INIT FILTERS =====
// ============================================================

function initFilters() {
    var cats = ['All', 'Concert', 'Sport', 'Conference', 'Training', 'Cinema', 'Festival', 'Theatre', 'Dance', 'Exhibition', 'Gala', 'Seminar'];
    var container = document.getElementById('filtersContainer');
    if (!container) return;
    container.innerHTML = cats.map(function(c) { return '<div class="filter-chip ' + (c === currentFilter ? 'active' : '') + '" data-category="' + c + '">' + c + '</div>'; }).join('');
    var chips = container.querySelectorAll('.filter-chip');
    for (var i = 0; i < chips.length; i++) {
        chips[i].addEventListener('click', function() {
            currentFilter = this.dataset.category;
            initFilters();
            renderEventsByCategory();
        });
    }
}

function filterByCountry(country) {
    currentCountryFilter = country;
    renderEventsByCategory();
}

// ============================================================
// ===== CLEAR DATA =====
// ============================================================

function clearAllData() {
    if (confirm('Delete all your data?')) { localStorage.clear(); location.reload(); }
}

function toggleDarkMode(e) {
    if (e.target.checked) { document.body.classList.add('dark-mode'); localStorage.setItem('darkMode', 'true'); }
    else { document.body.classList.remove('dark-mode'); localStorage.setItem('darkMode', 'false'); }
}

// ============================================================
// ===== LEGAL =====
// ============================================================

function showLegal(type) {
    var modal = document.getElementById('legalModal');
    var content = document.getElementById('modalContent');
    var texts = {
        terms: '<h2>Terms of Service</h2><p>Welcome to Betix. By using our platform, you agree to these terms.</p><p>All payments are made in Pi cryptocurrency. Transactions are final.</p><p>Contact: betixservices@gmail.com</p>',
        privacy: '<h2>Privacy Policy</h2><p>Betix is committed to protecting your privacy.</p><p>We collect your Pi wallet address and usage data to provide our services.</p><p>Contact: betixservices@gmail.com</p>',
        legal: '<h2>Legal Notices</h2><p>Betix is a decentralized event platform built on Pi Network.</p><p>Email: betixservices@gmail.com</p><p>Website: betixapp.vercel.app</p>'
    };
    content.innerHTML = texts[type] || '<p>Information in progress</p>';
    modal.classList.add('show');
    document.getElementById('legalModalClose').onclick = function() { modal.classList.remove('show'); };
    window.onclick = function(e) { if (e.target === modal) modal.classList.remove('show'); };
}

// ============================================================
// ===== FAQ =====
// ============================================================

var faqData = [
    [{ q: "What is Betix?", a: "The first decentralized event ticketing platform on Pi Network." },
     { q: "How does Betix work?", a: "Uses Pi Network blockchain for secure transactions." },
     { q: "Is Betix free?", a: "Yes! Completely free for users." },
     { q: "Who can use Betix?", a: "Any Pi Network account holder." }],
    [{ q: "How to buy a ticket?", a: "Connect, browse events, click 'Buy Ticket'." },
     { q: "Are payments secure?", a: "Yes, via Pi Network and escrow system." },
     { q: "Can I get a refund?", a: "Yes in case of cancellation or fraud." },
     { q: "Where are my tickets stored?", a: "In 'My Tickets' section." }],
    [{ q: "How to create an event?", a: "Connect, click 'Create Event', fill the form." },
     { q: "Conditions to be an organizer?", a: "Have an active Pi Network account." },
     { q: "Can I modify an event?", a: "Yes, from 'My Events' section." },
     { q: "How to boost my event?", a: "Pay in Pi to increase visibility." }],
    [{ q: "How to connect my Pi account?", a: "Click 'Connect Pi' in the menu." },
     { q: "What is the escrow system?", a: "Blocks funds until event validation." },
     { q: "Are transactions anonymous?", a: "Traceable on blockchain, but private." },
     { q: "Other cryptocurrencies?", a: "Currently only Pi Network." }],
    [{ q: "Buyer protection?", a: "Via escrow and refund policy." },
     { q: "Report a problem?", a: "Via chat or email." },
     { q: "Contact support?", a: "Online chat, email, or Telegram." },
     { q: "Available languages?", a: "English, French, Portuguese, Chinese." }],
    [{ q: "Join the community?", a: "Follow us on Telegram, Twitter, Discord." },
     { q: "Become an ambassador?", a: "Contact us to apply." },
     { q: "Become a partner?", a: "Contact us for partnership." },
     { q: "Future projects?", a: "Mobile app, new features." }]
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
        html += '<div class="faq-item" style="animation-delay:' + (index * 0.04) + 's"><div class="faq-q"><span class="q-icon">Q</span>' + item.q + '</div><div class="faq-a">' + item.a + '</div></div>';
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
            });
            dotsContainer.appendChild(dot);
        }
    }
}

function initFaq() {
    renderFaqPage(0);
    document.getElementById('faqPrevBtn').addEventListener('click', function() {
        if (currentFaqPage > 0) { currentFaqPage--; renderFaqPage(currentFaqPage); }
    });
    document.getElementById('faqNextBtn').addEventListener('click', function() {
        if (currentFaqPage < faqData.length - 1) { currentFaqPage++; renderFaqPage(currentFaqPage); }
    });
}

// ============================================================
// ===== CHAT =====
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
            var empty = document.createElement('div');
            empty.className = 'chat-message support';
            empty.innerHTML = '<div class="message-bubble">Hello! How can we help you?</div>';
            msgs.appendChild(empty);
            return;
        }
        for (var i = 0; i < chatMessages.length; i++) addMessage(chatMessages[i]);
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
        var newMsg = { id: Date.now(), text: msg, sender: currentUser.wallet || currentUser.name, isUser: true, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), timestamp: new Date().toISOString() };
        chatMessages.push(newMsg);
        saveChatMessages();
        addMessage(newMsg);
        input.value = '';
        setTimeout(function() {
            var resp = "Thank you! Quick response by email: betixservices@gmail.com";
            if (msg.toLowerCase().includes('ticket')) resp = "Your tickets are in 'My Tickets' section.";
            else if (msg.toLowerCase().includes('payment')) resp = "Payments are secured via Pi Network.";
            var auto = { id: Date.now() + 1, text: resp, sender: 'Betix Support', isUser: false, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), timestamp: new Date().toISOString() };
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
// ===== HERO SLIDER =====
// ============================================================

function initHeroSlider() {
    var slidesContainer = document.getElementById('heroSlides');
    if (!slidesContainer) return;

    slidesContainer.innerHTML = '';
    heroSlides.forEach(function(slide, index) {
        var div = document.createElement('div');
        div.className = 'hero-slide' + (index === 0 ? ' active' : '');
        div.innerHTML = '<div class="hero-slide-bg" style="background-image:url(\'' + slide.image + '\');"></div><div class="hero-slide-content"><div class="hero-badge">' + (slide.badge || 'Event') + '</div><h2>' + slide.title + '</h2><p>' + (slide.description || '') + '</p></div>';
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
        slidesContainer.style.transition = 'transform 0.7s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
        slidesContainer.style.transform = 'translateX(' + (-currentIndex * 100) + '%)';
        slides.forEach(function(slide, i) {
            slide.classList.remove('active');
            if (i === currentIndex) slide.classList.add('active');
        });
        dots.forEach(function(dot, i) {
            dot.classList.remove('active');
            if (i === currentIndex) dot.classList.add('active');
        });
        setTimeout(function() { isTransitioning = false; }, 750);
    }

    function nextSlide() { if (totalSlides > 0) goToSlide(currentIndex + 1); }
    function prevSlide() { if (totalSlides > 0) goToSlide(currentIndex - 1); }

    function startAutoPlay() {
        stopAutoPlay();
        if (totalSlides > 1) {
            autoPlayInterval = setInterval(function() { if (!isTransitioning) nextSlide(); }, 4000);
        }
    }

    function stopAutoPlay() {
        if (autoPlayInterval) { clearInterval(autoPlayInterval); autoPlayInterval = null; }
    }

    document.getElementById('heroPrev').onclick = function() { stopAutoPlay(); prevSlide(); setTimeout(startAutoPlay, 3000); };
    document.getElementById('heroNext').onclick = function() { stopAutoPlay(); nextSlide(); setTimeout(startAutoPlay, 3000); };

    var hero = document.querySelector('.hero');
    if (hero) { hero.onmouseenter = stopAutoPlay; hero.onmouseleave = startAutoPlay; }

    startAutoPlay();
}

// ============================================================
// ===== LOGO CLICK =====
// ============================================================

function handleLogoClick() {
    logoClickCount++;
    if (logoClickCount >= 5) {
        var password = prompt('Enter administrator password:');
        if (password === adminPassword || password === 'Betix@2026#') {
            localStorage.setItem('betix_admin_password', password);
            adminPassword = password;
            var adminBtn = document.getElementById('adminMenuItem');
            if (adminBtn) { adminBtn.style.display = 'block'; adminBtn.style.background = 'linear-gradient(135deg, #1a1a2e, #0D47A1)'; adminBtn.style.color = 'white'; }
            addAdminLog('Admin authentication', 'Login via logo');
            alert('Administrator access activated!');
            logoClickCount = 0;
        } else if (password !== null) {
            alert('Incorrect password');
            logoClickCount = 0;
        } else { logoClickCount = 0; }
    }
}

// ============================================================
// ===== UPDATE USER INFO =====
// ============================================================

function updateUserInfo() {
    var nameEl = document.getElementById('sidebarName');
    var walletEl = document.getElementById('sidebarWallet');
    var avatarText = document.getElementById('sidebarAvatarText');
    var profileName = document.getElementById('profileNameDisplay');
    var profileWallet = document.getElementById('profileWalletDisplay');
    var memberSince = document.getElementById('memberSince');
    var profileAvatar = document.getElementById('profileAvatarLetter');

    if (nameEl) nameEl.textContent = currentUser.name || 'Guest';
    if (walletEl) walletEl.textContent = currentUser.wallet ? 'Wallet: ' + currentUser.wallet : 'Not connected';
    if (avatarText) avatarText.textContent = (currentUser.name || 'U')[0].toUpperCase();
    if (profileName) profileName.textContent = currentUser.name || 'Guest';
    if (profileWallet) profileWallet.textContent = currentUser.wallet || 'Not connected';
    if (memberSince) memberSince.textContent = currentUser.memberSince || '2026';
    if (profileAvatar) profileAvatar.textContent = (currentUser.name || 'G')[0].toUpperCase();

    updateConnectButtons();
    updateSidebarNotifBadge();
}

function updateProfilePage() {
    var myEvents = events.filter(function(e) { return e.organizer === currentUser.wallet || e.organizerName === currentUser.name; });
    var userTickets = tickets.filter(function(t) { return t.userWallet === currentUser.wallet || t.buyerWallet === currentUser.wallet; });
    var userRatings = ratings.filter(function(r) { return r.userWallet === currentUser.wallet || r.userWallet === currentUser.name; });

    document.getElementById('myEventsCount').textContent = myEvents.length;
    document.getElementById('ticketCount').textContent = userTickets.length;
    document.getElementById('historyCount').textContent = tickets.filter(function(t) {
        var isUsed = usedTickets.indexOf(t.id) !== -1;
        var isExpired = new Date(t.eventDate) <= new Date();
        return (isUsed || isExpired) && (t.userWallet === currentUser.wallet || t.buyerWallet === currentUser.wallet);
    }).length;
    document.getElementById('ratedCount').textContent = userRatings.length;
    document.getElementById('profileRatingDisplay').textContent = userRatings.length;
    document.getElementById('profileLoyaltyDisplay').textContent = currentUser.loyaltyPoints || 0;

    updateUserInfo();
}

// ============================================================
// ===== INIT =====
// ============================================================

document.addEventListener('DOMContentLoaded', function() {
    console.log('Betix starting...');

    // Hide loader
    var loader = document.getElementById('loader');
    var main = document.getElementById('main-content');
    if (loader && main) {
        setTimeout(function() {
            loader.style.opacity = '0';
            setTimeout(function() {
                loader.style.display = 'none';
                main.style.display = 'block';
            }, 500);
        }, 600);
    }

    // Load data
    detectLanguage();
    loadUsedTickets();
    if (!events || events.length === 0) { events = []; saveEvents(); }

    // Init
    initCountrySelectors();
    initFilters();
    renderEventsByCategory();
    updateUserInfo();
    updateProfilePage();
    updateNotifBadgeHeader();
    initAdmin();
    initChat();
    setupTicketTypesUI();
    initHeroSlider();
    initFaq();
    renderAdminLogs();

    // Dark mode
    var darkToggle = document.getElementById('darkModeToggle');
    if (localStorage.getItem('darkMode') === 'true') {
        if (darkToggle) darkToggle.checked = true;
        document.body.classList.add('dark-mode');
    }
    if (darkToggle) darkToggle.addEventListener('change', toggleDarkMode);

    // Menu button
    document.getElementById('menuBtn').addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        openSidebar();
    });

    // Back button
    document.getElementById('backBtn').addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        goBack();
    });

    // Close sidebar
    document.getElementById('closeSidebarBtn').addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        closeSidebar();
    });
    document.getElementById('overlay').addEventListener('click', closeSidebar);

    // Event form
    document.getElementById('eventForm').addEventListener('submit', createEvent);

    // Search
    document.getElementById('searchInput').addEventListener('input', function(e) {
        searchQuery = e.target.value.toLowerCase();
        renderEventsByCategory();
    });

    // Clear data
    document.getElementById('clearDataBtn').addEventListener('click', clearAllData);

    // Confirm publish
    document.getElementById('confirmPublishBtn').addEventListener('click', confirmPublishEvent);
    document.getElementById('confirmBuyBtn').addEventListener('click', confirmPurchaseFromPopup);

    // Ticket type select change
    document.getElementById('ticketTypeSelect').addEventListener('change', updateTicketTotal);

    // Admin slides
    document.getElementById('adminAddSlideBtn').addEventListener('click', function() { adminShowSlideForm(-1); });
    document.getElementById('adminSaveSlideBtn').addEventListener('click', adminSaveSlide);
    document.getElementById('adminCancelSlideBtn').addEventListener('click', adminCancelSlideForm);

    // Admin image upload preview
    document.getElementById('adminSlideImageInput').addEventListener('change', function() {
        var file = this.files[0];
        if (file && file.type.startsWith('image/')) {
            var reader = new FileReader();
            reader.onload = function(e) {
                document.getElementById('adminSlidePreview').src = e.target.result;
                document.getElementById('adminSlidePreview').style.display = 'block';
                document.getElementById('adminUploadBox').classList.add('has-image');
            };
            reader.readAsDataURL(file);
        }
    });
    document.getElementById('adminUploadBox').addEventListener('click', function(e) {
        if (e.target.tagName !== 'INPUT') document.getElementById('adminSlideImageInput').click();
    });

    // Image uploads
    var imageInputs = document.querySelectorAll('.image-input-modern');
    for (var i = 0; i < imageInputs.length; i++) {
        var input = imageInputs[i];
        var index = parseInt(input.dataset.index);
        input.addEventListener('change', function(e) {
            var idx = parseInt(this.dataset.index);
            if (this.files && this.files[0]) handleImageUploadModern(this.files[0], idx);
        });

        var box = document.getElementById('uploadBox' + (index + 1));
        if (box) {
            box.addEventListener('dragover', function(e) { e.preventDefault(); this.classList.add('dragover'); });
            box.addEventListener('dragleave', function(e) { e.preventDefault(); this.classList.remove('dragover'); });
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

    // Sidebar items
    var sidebarItems = document.querySelectorAll('.sidebar-item');
    for (var i = 0; i < sidebarItems.length; i++) {
        sidebarItems[i].addEventListener('click', function() {
            var page = this.dataset.page;
            if (page) showPage(page);
            closeSidebar();
        });
    }

    // Load data from Supabase
    setTimeout(function() { loadAllFromSupabase(); }, 1000);

    // Auto sync
    setInterval(function() { syncAllToSupabase(); }, 60000);

    // Save on unload
    window.addEventListener('beforeunload', function() { syncAllToSupabase(); });

    console.log('Betix ready!');
});