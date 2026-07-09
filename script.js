// ============================================================
// ===== SUPABASE CONFIGURATION =====
// ============================================================

const SUPABASE_URL = "https://tycebwzgsujiazgopkri.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR5Y2Vid3pnc3VqaWF6Z29wa3JpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODIzODg2NTMsImV4cCI6MjA5Nzk2NDY1M30.7x1rouTbMJE2WcY008vRnqGuAWq3yM_eZCS4Q8_3TrQ";

const supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    auth: {
        persistSession: false,
        autoRefreshToken: false,
        detectSessionInUrl: false
    },
    db: {
        schema: 'public'
    }
});

console.log("Supabase initialized");

// ============================================================
// ===== COUNTRY LIST =====
// ============================================================

const countriesList = [
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
// ===== COUNTRY FLAGS =====
// ============================================================

const countryFlags = {
    'All': '🌍',
    'Afghanistan': '🇦🇫', 'Algeria': '🇩🇿', 'Angola': '🇦🇴', 'Argentina': '🇦🇷', 'Australia': '🇦🇺',
    'Austria': '🇦🇹', 'Belgium': '🇧🇪', 'Benin': '🇧🇯', 'Botswana': '🇧🇼', 'Brazil': '🇧🇷',
    'Burkina Faso': '🇧🇫', 'Burundi': '🇧🇮', 'Cameroon': '🇨🇲', 'Canada': '🇨🇦', 'Cape Verde': '🇨🇻',
    'Central African Republic': '🇨🇫', 'Chad': '🇹🇩', 'China': '🇨🇳', 'Comoros': '🇰🇲',
    'Congo': '🇨🇬', 'Cote d\'Ivoire': '🇨🇮', 'Denmark': '🇩🇰', 'Djibouti': '🇩🇯', 'Egypt': '🇪🇬',
    'Equatorial Guinea': '🇬🇶', 'Eritrea': '🇪🇷', 'Eswatini': '🇸🇿', 'Ethiopia': '🇪🇹',
    'France': '🇫🇷', 'Gabon': '🇬🇦', 'Gambia': '🇬🇲', 'Germany': '🇩🇪', 'Ghana': '🇬🇭',
    'Guinea': '🇬🇳', 'Guinea-Bissau': '🇬🇼', 'India': '🇮🇳', 'Indonesia': '🇮🇩', 'Iran': '🇮🇷',
    'Italy': '🇮🇹', 'Japan': '🇯🇵', 'Kenya': '🇰🇪', 'Lesotho': '🇱🇸', 'Liberia': '🇱🇷',
    'Libya': '🇱🇾', 'Madagascar': '🇲🇬', 'Malawi': '🇲🇼', 'Mali': '🇲🇱', 'Mauritania': '🇲🇷',
    'Mauritius': '🇲🇺', 'Mexico': '🇲🇽', 'Morocco': '🇲🇦', 'Mozambique': '🇲🇿', 'Namibia': '🇳🇦',
    'Niger': '🇳🇪', 'Nigeria': '🇳🇬', 'Portugal': '🇵🇹', 'RDC': '🇨🇩', 'Russia': '🇷🇺',
    'Rwanda': '🇷🇼', 'Sao Tome': '🇸🇹', 'Senegal': '🇸🇳', 'Seychelles': '🇸🇨',
    'Sierra Leone': '🇸🇱', 'Somalia': '🇸🇴', 'South Africa': '🇿🇦', 'South Sudan': '🇸🇸',
    'Spain': '🇪🇸', 'Sudan': '🇸🇩', 'Sweden': '🇸🇪', 'Switzerland': '🇨🇭',
    'Tanzania': '🇹🇿', 'Togo': '🇹🇬', 'Tunisia': '🇹🇳', 'Turkey': '🇹🇷',
    'Uganda': '🇺🇬', 'Ukraine': '🇺🇦', 'United Kingdom': '🇬🇧',
    'United States': '🇺🇸', 'Zambia': '🇿🇲', 'Zimbabwe': '🇿🇼'
};

// ============================================================
// ===== PI SDK INITIALIZATION =====
// ============================================================

let piSDKReady = false;

function initPiSDK() {
    if (typeof Pi !== 'undefined') {
        try {
            Pi.init({ version: "2.0", sandbox: true });
            piSDKReady = true;
            console.log("Pi SDK initialized successfully");
            return true;
        } catch (error) {
            console.error("Pi SDK init error:", error);
            piSDKReady = false;
            return false;
        }
    }
    console.log("Pi SDK not available yet");
    return false;
}

initPiSDK();
setTimeout(function() { if (!piSDKReady) initPiSDK(); }, 500);
setTimeout(function() { if (!piSDKReady) initPiSDK(); }, 1000);
setTimeout(function() { if (!piSDKReady) initPiSDK(); }, 2000);
setTimeout(function() { if (!piSDKReady) initPiSDK(); }, 3000);
setTimeout(function() { if (!piSDKReady) initPiSDK(); }, 5000);

async function ensurePiSDKReady() {
    let attempts = 0;
    while (!piSDKReady && attempts < 15) {
        initPiSDK();
        await new Promise(resolve => setTimeout(resolve, 500));
        attempts++;
    }
    return piSDKReady;
}

// ============================================================
// ===== GLOBAL VARIABLES =====
// ============================================================

let events = [];
let tickets = [];
let usedTickets = [];
let currentUser = { 
    name: 'Guest', 
    wallet: null, 
    piUid: null,
    memberSince: '2026', 
    loyaltyPoints: 0
};
let currentFilter = 'All';
let currentCountryFilter = 'All';
let searchQuery = '';
let piUser = null;
let ratings = [];
let chatMessages = [];
let connectedUsers = [];
let notifications = [];
let adminPassword = localStorage.getItem('betix_admin_password') || 'Betix@2026#';
let lastActivity = localStorage.getItem('betix_last_activity') || Date.now();
let pageHistory = ['home'];
let logoClickCount = 0;
let pendingEventData = null;
let editingEventId = null;
let selectedEventForPurchase = null;
let selectedTicketType = 'standard';
let uploadedImages = {};

let adminSessionTimer = 1800;
let adminTimerInterval = null;
let adminLogs = [];

// ============================================================
// ===== HERO SLIDES =====
// ============================================================

let heroSlides = JSON.parse(localStorage.getItem('betix_hero_slides')) || [];

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

const BACKEND_URL = "https://betix-backend.onrender.com";

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
// ===== FONCTIONS UTILITAIRES =====
// ============================================================

function escapeHtml(str) { if (!str) return ''; return str.replace(/[&<>]/g, function(m) { if (m === '&') return '&amp;'; if (m === '<') return '&lt;'; if (m === '>') return '&gt;'; return m; }); }
function formatDate(dateStr) { var date = new Date(dateStr); return !isNaN(date.getTime()) ? date.toLocaleDateString('en-US') : 'Date to be defined'; }
function formatDateTime(dateStr) { var date = new Date(dateStr); return !isNaN(date.getTime()) ? date.toLocaleString('en-US') : 'Unknown date'; }

// ============================================================
// ===== SUPABASE STORAGE FUNCTIONS =====
// ============================================================

async function uploadEventImage(eventId, base64Data, index) {
    try {
        const response = await fetch(base64Data);
        const blob = await response.blob();
        
        const filePath = eventId + '/image_' + index + '_' + Date.now() + '.webp';
        
        const { data, error } = await supabaseClient.storage
            .from('events-images')
            .upload(filePath, blob, {
                contentType: blob.type,
                cacheControl: '3600',
                upsert: true
            });
        
        if (error) throw error;
        
        const { data: publicUrlData } = supabaseClient.storage
            .from('events-images')
            .getPublicUrl(filePath);
        
        return publicUrlData.publicUrl;
    } catch (error) {
        console.error('Error uploading to Supabase storage:', error);
        return null;
    }
}

// ============================================================
// ===== SUPABASE TABLE FUNCTIONS =====
// ============================================================

async function saveUserToSupabase(piUid, username, wallet, points) {
    points = points || 0;
    try {
        const now = new Date().toISOString();
        const userData = {
            pi_uid: piUid,
            username: username,
            wallet: wallet,
            points: points,
            updated_at: now
        };
        
        const { data: existing, error: checkError } = await supabaseClient
            .from('users')
            .select('pi_uid')
            .eq('pi_uid', piUid)
            .single();
        
        if (checkError && checkError.code !== 'PGRST116') {
            throw checkError;
        }
        
        if (existing) {
            const { error } = await supabaseClient
                .from('users')
                .update(userData)
                .eq('pi_uid', piUid);
            if (error) throw error;
            console.log('User updated in Supabase:', piUid);
        } else {
            userData.created_at = now;
            const { error } = await supabaseClient
                .from('users')
                .insert(userData);
            if (error) throw error;
            console.log('User created in Supabase:', piUid);
        }
        return true;
    } catch (error) {
        console.error('Error saving user to Supabase:', error);
        return false;
    }
}

async function saveEventToSupabase(eventData) {
    try {
        const dbEvent = {
            id: eventData.id,
            organizer_pi_uid: eventData.organizerPiUid || eventData.organizer || currentUser.piUid || currentUser.wallet,
            organizer_name: eventData.organizerName || eventData.organizer || currentUser.name,
            title: eventData.title,
            description: eventData.description || '',
            image_url: eventData.coverImage || (eventData.images && eventData.images[0]) || '',
            location: eventData.location || '',
            country: eventData.country || 'France',
            event_date: eventData.date,
            category: eventData.category || '',
            ticket_price_standard: (eventData.ticketTypes && eventData.ticketTypes.standard && eventData.ticketTypes.standard.price) || eventData.price || 0,
            ticket_price_vip: (eventData.ticketTypes && eventData.ticketTypes.vip && eventData.ticketTypes.vip.price) || 0,
            ticket_standard_enabled: (eventData.ticketTypes && eventData.ticketTypes.standard && eventData.ticketTypes.standard.enabled) || false,
            ticket_vip_enabled: (eventData.ticketTypes && eventData.ticketTypes.vip && eventData.ticketTypes.vip.enabled) || false,
            max_tickets: eventData.seatsTotal || 0,
            created_at: eventData.createdAt || new Date().toISOString(),
            conditions: eventData.conditions || '',
            duration_value: eventData.durationValue || null,
            duration_unit: eventData.durationUnit || null
        };
        
        console.log('Saving event to Supabase:', dbEvent);
        
        const { data, error } = await supabaseClient
            .from('events')
            .upsert(dbEvent, { onConflict: 'id' });
        
        if (error) {
            console.error('Supabase error details:', error);
            throw error;
        }
        
        console.log('Event saved to Supabase successfully:', eventData.id);
        return true;
    } catch (error) {
        console.error('Error saving event to Supabase:', error);
        return false;
    }
}

async function loadEventsFromSupabase() {
    try {
        const { data, error } = await supabaseClient
            .from('events')
            .select('*')
            .order('event_date', { ascending: true });
        
        if (error) throw error;
        return data || [];
    } catch (error) {
        console.error('Error loading events from Supabase:', error);
        return [];
    }
}

async function updateEventInSupabase(eventId, updates) {
    try {
        const { error } = await supabaseClient
            .from('events')
            .update(updates)
            .eq('id', eventId);
        
        if (error) throw error;
        console.log('Event updated in Supabase:', eventId);
        return true;
    } catch (error) {
        console.error('Error updating event in Supabase:', error);
        return false;
    }
}

async function deleteEventFromSupabase(eventId) {
    try {
        const { error } = await supabaseClient
            .from('events')
            .delete()
            .eq('id', eventId);
        if (error) throw error;
        console.log('Event deleted from Supabase:', eventId);
        return true;
    } catch (error) {
        console.error('Error deleting event from Supabase:', error);
        return false;
    }
}

async function saveTicketToSupabase(ticketData) {
    try {
        const dbTicket = {
            id: ticketData.id,
            event_id: ticketData.eventId,
            buyer_pi_uid: ticketData.buyerWallet || ticketData.userWallet || currentUser.wallet,
            buyer_name: ticketData.buyerName || ticketData.buyerWallet || currentUser.name,
            ticket_type: ticketData.ticketType || 'standard',
            price: ticketData.price || 0,
            qr_code: ticketData.qrCode || '',
            status: ticketData.status || 'Valid',
            purchase_date: ticketData.purchaseDate || new Date().toISOString(),
            expiration_date: ticketData.eventDate || null,
            event_title: ticketData.eventTitle || '',
            event_location: ticketData.eventLocation || '',
            transaction_id: ticketData.transactionId || ''
        };
        
        console.log('Saving ticket to Supabase:', dbTicket);
        
        const { data, error } = await supabaseClient
            .from('tickets')
            .upsert(dbTicket, { onConflict: 'id' });
        
        if (error) {
            console.error('Supabase error details:', error);
            throw error;
        }
        
        console.log('Ticket saved to Supabase successfully:', ticketData.id);
        return true;
    } catch (error) {
        console.error('Error saving ticket to Supabase:', error);
        return false;
    }
}

async function loadTicketsFromSupabase(piUid) {
    try {
        const { data, error } = await supabaseClient
            .from('tickets')
            .select('*')
            .eq('buyer_pi_uid', piUid)
            .order('purchase_date', { ascending: false });
        
        if (error) throw error;
        return data || [];
    } catch (error) {
        console.error('Error loading tickets from Supabase:', error);
        return [];
    }
}

async function saveTransactionToSupabase(transactionData) {
    try {
        const dbTransaction = {
            id: transactionData.id || Date.now().toString(),
            buyer_pi_uid: transactionData.buyerWallet || transactionData.buyerPiUid,
            event_id: transactionData.eventId,
            amount: transactionData.amount || 0,
            currency: 'Pi',
            payment_id: transactionData.txid || transactionData.paymentId || '',
            status: transactionData.status || 'completed',
            created_at: transactionData.date || new Date().toISOString()
        };
        
        const { error } = await supabaseClient
            .from('transactions')
            .insert(dbTransaction);
        
        if (error) throw error;
        console.log('Transaction saved to Supabase:', dbTransaction.id);
        return true;
    } catch (error) {
        console.error('Error saving transaction to Supabase:', error);
        return false;
    }
}

async function saveNotificationToSupabase(notificationData) {
    try {
        const dbNotification = {
            id: notificationData.id || Date.now().toString(),
            receiver_pi_uid: notificationData.receiverPiUid || notificationData.userWallet,
            title: notificationData.title || 'Notification',
            message: notificationData.message || '',
            is_read: notificationData.read || false,
            created_at: notificationData.date || new Date().toISOString()
        };
        
        const { error } = await supabaseClient
            .from('notifications')
            .insert(dbNotification);
        
        if (error) throw error;
        console.log('Notification saved to Supabase');
        return true;
    } catch (error) {
        console.error('Error saving notification to Supabase:', error);
        return false;
    }
}

async function loadNotificationsFromSupabase(piUid) {
    try {
        const { data, error } = await supabaseClient
            .from('notifications')
            .select('*')
            .eq('receiver_pi_uid', piUid)
            .order('created_at', { ascending: false });
        
        if (error) throw error;
        return data || [];
    } catch (error) {
        console.error('Error loading notifications from Supabase:', error);
        return [];
    }
}

// ============================================================
// ===== FONCTIONS DE SAUVEGARDE =====
// ============================================================

function saveEvents() { 
    localStorage.setItem('betix_events', JSON.stringify(events));
    syncEventsToSupabase();
}

function saveTickets() { 
    localStorage.setItem('betix_tickets', JSON.stringify(tickets));
    saveUsedTickets();
    syncTicketsToSupabase();
}

function saveUsedTickets() { 
    localStorage.setItem('betix_used_tickets', JSON.stringify(usedTickets));
}

function loadUsedTickets() {
    var stored = localStorage.getItem('betix_used_tickets');
    if (stored) {
        try {
            usedTickets = JSON.parse(stored);
        } catch (e) {
            usedTickets = [];
        }
    } else {
        usedTickets = [];
    }
}

function saveUser() { 
    localStorage.setItem('betix_user', JSON.stringify(currentUser));
    syncUserToSupabase();
}

function saveNotifications() { 
    localStorage.setItem('betix_notifications', JSON.stringify(notifications));
    syncNotificationsToSupabase();
}

function saveChatMessages() {
    localStorage.setItem('betix_chat_messages', JSON.stringify(chatMessages));
}

function saveRatings() {
    localStorage.setItem('betix_ratings', JSON.stringify(ratings));
}

function saveConnectedUsers() {
    localStorage.setItem('betix_connected_users', JSON.stringify(connectedUsers));
}

// ============================================================
// ===== SYNC FUNCTIONS (Supabase) =====
// ============================================================

async function syncUserToSupabase() {
    if (!currentUser.piUid && !currentUser.wallet) return;
    var piUid = currentUser.piUid || currentUser.wallet;
    await saveUserToSupabase(
        piUid,
        currentUser.name || 'User',
        currentUser.wallet || piUid,
        currentUser.loyaltyPoints || 0
    );
}

async function syncEventsToSupabase() {
    for (var i = 0; i < events.length; i++) {
        await saveEventToSupabase(events[i]);
    }
}

async function syncTicketsToSupabase() {
    for (var i = 0; i < tickets.length; i++) {
        await saveTicketToSupabase(tickets[i]);
    }
}

async function syncNotificationsToSupabase() {
    for (var i = 0; i < notifications.length; i++) {
        var notif = notifications[i];
        var receiverPiUid = notif.userWallet || currentUser.wallet;
        await saveNotificationToSupabase({
            ...notif,
            receiverPiUid: receiverPiUid,
            title: notif.type === 'purchase' ? 'Ticket Purchase' : notif.type === 'event' ? 'New Event' : 'Notification'
        });
    }
}

// ============================================================
// ===== LOAD FUNCTIONS (Supabase) =====
// ============================================================

async function loadAllFromSupabase() {
    console.log('Loading data from Supabase...');
    
    loadUsedTickets();
    
    try {
        var supabaseEvents = await loadEventsFromSupabase();
        if (supabaseEvents && supabaseEvents.length > 0) {
            events = supabaseEvents.map(function(e) {
                return {
                    id: e.id,
                    title: e.title,
                    category: e.category || '',
                    country: e.country || 'France',
                    date: e.event_date,
                    location: e.location || '',
                    description: e.description || '',
                    conditions: e.conditions || 'Active Pi Network wallet\nPayment in Pi (indicated amount)',
                    price: e.ticket_price_standard || 0.0003,
                    seatsTotal: e.max_tickets || 100,
                    seatsLeft: e.max_tickets || 100,
                    images: e.image_url ? [e.image_url] : [],
                    coverImage: e.image_url || '',
                    organizer: e.organizer_pi_uid || '',
                    organizerName: e.organizer_name || '',
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
        } else {
            var localEvents = localStorage.getItem('betix_events');
            if (localEvents) {
                try {
                    events = JSON.parse(localEvents);
                    for (var i = 0; i < events.length; i++) {
                        await saveEventToSupabase(events[i]);
                    }
                } catch (e) {
                    events = [];
                }
            } else {
                events = [];
            }
        }
        
        if (currentUser.piUid || currentUser.wallet) {
            var piUid = currentUser.piUid || currentUser.wallet;
            var supabaseTickets = await loadTicketsFromSupabase(piUid);
            if (supabaseTickets && supabaseTickets.length > 0) {
                tickets = supabaseTickets.map(function(t) {
                    return {
                        id: t.id,
                        eventId: t.event_id,
                        eventTitle: t.event_title || 'Event',
                        eventDate: t.expiration_date || new Date().toISOString(),
                        eventLocation: t.event_location || '',
                        price: t.price || 0,
                        buyerWallet: t.buyer_pi_uid,
                        buyerName: t.buyer_name || t.buyer_pi_uid,
                        userWallet: t.buyer_pi_uid,
                        ticketType: t.ticket_type || 'standard',
                        status: t.status || 'Valid',
                        purchaseDate: t.purchase_date || new Date().toISOString(),
                        purchaseDateTime: new Date(t.purchase_date || new Date()).toLocaleString('en-US'),
                        transactionId: t.transaction_id || '',
                        qrCode: t.qr_code || 'BETIX-' + Date.now()
                    };
                });
                localStorage.setItem('betix_tickets', JSON.stringify(tickets));
            } else {
                var localTickets = localStorage.getItem('betix_tickets');
                if (localTickets) {
                    try {
                        tickets = JSON.parse(localTickets);
                        for (var j = 0; j < tickets.length; j++) {
                            await saveTicketToSupabase(tickets[j]);
                        }
                    } catch (e) {
                        tickets = [];
                    }
                } else {
                    tickets = [];
                }
            }
        }
        
        if (currentUser.piUid || currentUser.wallet) {
            var piUid2 = currentUser.piUid || currentUser.wallet;
            var supabaseNotifs = await loadNotificationsFromSupabase(piUid2);
            if (supabaseNotifs && supabaseNotifs.length > 0) {
                notifications = supabaseNotifs.map(function(n) {
                    return {
                        id: n.id,
                        message: n.message || n.title || '',
                        type: n.type || 'info',
                        read: n.is_read || false,
                        date: n.created_at || new Date().toISOString()
                    };
                });
                localStorage.setItem('betix_notifications', JSON.stringify(notifications));
                updateNotifBadgeHeader();
            } else {
                var localNotifs = localStorage.getItem('betix_notifications');
                if (localNotifs) {
                    try {
                        notifications = JSON.parse(localNotifs);
                        for (var k = 0; k < notifications.length; k++) {
                            await saveNotificationToSupabase(notifications[k]);
                        }
                    } catch (e) {
                        notifications = [];
                    }
                } else {
                    notifications = [];
                }
            }
        }
        
        renderEventsByCategory();
        renderTickets();
        renderHistory();
        updateProfilePage();
        console.log('All data loaded from Supabase');
    } catch (error) {
        console.error('Error loading data from Supabase:', error);
        var localEvents = localStorage.getItem('betix_events');
        if (localEvents) {
            try {
                events = JSON.parse(localEvents);
            } catch (e) {
                events = [];
            }
        }
        var localTickets = localStorage.getItem('betix_tickets');
        if (localTickets) {
            try {
                tickets = JSON.parse(localTickets);
            } catch (e) {
                tickets = [];
            }
        }
        var localNotifs = localStorage.getItem('betix_notifications');
        if (localNotifs) {
            try {
                notifications = JSON.parse(localNotifs);
            } catch (e) {
                notifications = [];
            }
        }
        renderEventsByCategory();
        renderTickets();
        renderHistory();
        updateProfilePage();
    }
}

// ============================================================
// ===== RENDER CHAT MESSAGES =====
// ============================================================

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
        var googleSelectRetry = document.querySelector('.goog-te-combo');
        if (googleSelectRetry && googleSelectRetry.value !== lang) {
            googleSelectRetry.value = lang;
            googleSelectRetry.dispatchEvent(new Event('change'));
        }
    }, 1000);
    
    setTimeout(function() {
        location.reload();
    }, 800);
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
    }, 1500);
    
    return savedLang;
}

// ============================================================
// ===== NOTIFICATIONS =====
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

function addNotification(message, type) {
    var notif = {
        id: Date.now().toString(),
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

// ============================================================
// ===== NAVIGATION PROFIL =====
// ============================================================

function goToMyEvents() { showPage('myevents'); }
function goToTickets() { showPage('tickets'); }
function goToHistory() { showPage('history'); }
function goToRatings() { showPage('ratings'); }

// ============================================================
// ===== UTILITY FUNCTIONS =====
// ============================================================

function calculateLoyaltyPoints() {
    var points = 0;
    for (var i = 0; i < ratings.length; i++) {
        if (ratings[i].userWallet === (currentUser.wallet || currentUser.name)) {
            points += ratings[i].rating;
        }
    }
    currentUser.loyaltyPoints = points;
    saveUser();
    return points;
}

function updateLoyaltyPointsDisplay() {
    var pointsSpan = document.getElementById('loyaltyPoints');
    if (pointsSpan) pointsSpan.innerText = currentUser.loyaltyPoints || 0;
}

function updateActivity() { lastActivity = Date.now(); localStorage.setItem('betix_last_activity', lastActivity); }
function isSessionExpired() { var last = parseInt(localStorage.getItem('betix_last_activity') || 0); var now = Date.now(); return (now - last) > 86400000; }

function disconnectPi() {
    if (confirm('Are you sure you want to disconnect your Pi account?')) {
        currentUser = { name: 'Guest', wallet: null, piUid: null, memberSince: '2026', loyaltyPoints: 0 };
        piUser = null;
        saveUser();
        localStorage.removeItem('betix_last_activity');
        localStorage.removeItem('betix_pending_payment');
        updateUserInfo();
        updateProfilePage();
        renderEventsByCategory();
        renderTickets();
        renderHistory();
        updateConnectButtons();
        closeSidebar();
        alert('You are disconnected');
    }
}

function logout() { disconnectPi(); }

function startSessionMonitor() { setInterval(function() { if (currentUser.wallet && isSessionExpired()) { disconnectPi(); alert('Session expired due to inactivity. Please reconnect.'); } }, 60000); }
function bindActivityListeners() { var events = ['click', 'scroll', 'keydown', 'touchstart']; for (var i = 0; i < events.length; i++) { document.addEventListener(events[i], updateActivity); } }

function updateBackButton(currentPage) {
    var backBtn = document.getElementById('backBtn');
    if (!backBtn) return;
    // Le bouton retour s'affiche uniquement sur les pages autres que 'home' et 'homePage'
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

// ============================================================
// ===== SIDEBAR - CORRIGÉ AVEC 3 MÉCANISMES =====
// ============================================================

function closeSidebar() {
    var s = document.getElementById('sidebar');
    var o = document.getElementById('overlay');
    if (s) {
        s.classList.remove('open');
        document.body.style.overflow = '';
    }
    if (o) {
        o.classList.remove('active');
    }
}

function openSidebar() {
    var s = document.getElementById('sidebar');
    var o = document.getElementById('overlay');
    if (s) {
        s.classList.add('open');
        document.body.style.overflow = 'hidden';
    }
    if (o) {
        o.classList.add('active');
    }
}

// ============================================================
// ===== UPDATE CONNECT BUTTONS =====
// ============================================================

function updateConnectButtons() {
    var sidebarBtn = document.getElementById('sidebarWalletBtn');
    if (sidebarBtn) {
        if (currentUser.wallet) {
            sidebarBtn.textContent = 'Disconnect';
            sidebarBtn.classList.add('disconnect');
            sidebarBtn.classList.remove('loading');
            sidebarBtn.onclick = function() { disconnectPi(); };
            sidebarBtn.disabled = false;
        } else {
            sidebarBtn.textContent = 'Connect Pi';
            sidebarBtn.classList.remove('disconnect');
            sidebarBtn.classList.remove('loading');
            sidebarBtn.onclick = function() { connectToPi(); };
            sidebarBtn.disabled = false;
        }
    }
    var profilePageBtn = document.getElementById('profileConnectBtnPage');
    if (profilePageBtn) {
        if (currentUser.wallet) {
            profilePageBtn.textContent = 'Disconnect';
            profilePageBtn.onclick = function() { disconnectPi(); };
        } else {
            profilePageBtn.textContent = 'Connect Pi';
            profilePageBtn.onclick = function() { connectToPi(); };
        }
    }
}

// ============================================================
// ===== CONNEXION PI - AVEC SPINNER =====
// ============================================================

async function connectToPi() {
    showConnectSpinner();
    
    try {
        if (!piSDKReady) {
            var ready = await ensurePiSDKReady();
            if (!ready) {
                hideConnectSpinner();
                alert("Pi Network SDK is not available. Please make sure you are using the Pi Browser.");
                return;
            }
        }
        
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
                updateActivity();
                updateUserInfo();
                updateProfilePage();
                renderEventsByCategory();
                updateConnectButtons();
                loadAllFromSupabase();
                alert('Pi account connected (demo mode)! Welcome Demo User');
                closeSidebar();
                return;
            }
            alert("Please open this page in Pi Browser");
            return;
        }
        
        console.log("Pi SDK is ready, attempting authentication...");
        
        var scopes = ['username', 'payments'];
        var auth = await Pi.authenticate(scopes, onIncompletePaymentFound);
        
        if (auth && auth.user) {
            piUser = auth.user;
            currentUser.wallet = piUser.username;
            currentUser.piUid = piUser.username;
            currentUser.name = piUser.username;
            if (!currentUser.loyaltyPoints) currentUser.loyaltyPoints = 0;
            
            saveUser();
            await syncUserToSupabase();
            
            updateActivity();
            updateUserInfo();
            updateProfilePage();
            trackUserConnection();
            renderEventsByCategory();
            updateConnectButtons();
            
            await loadAllFromSupabase();
            
            alert('Pi account connected! Welcome ' + piUser.username);
            closeSidebar();
        } else {
            hideConnectSpinner();
            alert('Authentication failed. Please try again.');
        }
    } catch (error) { 
        console.error("Pi connection error:", error); 
        hideConnectSpinner();
        alert("Connection error: " + (error.message || "Please try again")); 
    } finally {
        hideConnectSpinner();
    }
}

function showConnectSpinner() {
    var btn = document.getElementById('sidebarWalletBtn');
    if (btn) {
        btn.textContent = 'Connecting...';
        btn.disabled = true;
        btn.classList.add('loading');
    }
}

function hideConnectSpinner() {
    var btn = document.getElementById('sidebarWalletBtn');
    if (btn) {
        btn.disabled = false;
        btn.classList.remove('loading');
        updateConnectButtons();
    }
}

async function onIncompletePaymentFound(payment) { console.log("Incomplete payment found:", payment); }

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
    
    function updateStatusBadge(checkbox, badge, activeText, inactiveText) {
        activeText = activeText || 'Active';
        inactiveText = inactiveText || 'Inactive';
        if (!checkbox || !badge) return;
        if (checkbox.checked) {
            badge.textContent = activeText;
            badge.className = 'type-status-badge active';
        } else {
            badge.textContent = inactiveText;
            badge.className = 'type-status-badge inactive';
        }
    }
    
    if (standardCheckbox && standardPriceGroup) {
        standardCheckbox.addEventListener('change', function() {
            if (this.checked) {
                standardPriceGroup.classList.remove('hidden');
                standardPriceGroup.style.display = 'flex';
                document.getElementById('ticketStandardPrice').required = true;
            } else {
                standardPriceGroup.classList.add('hidden');
                standardPriceGroup.style.display = 'none';
                document.getElementById('ticketStandardPrice').required = false;
                document.getElementById('ticketStandardPrice').value = '';
            }
            updateStatusBadge(standardCheckbox, standardStatusBadge);
        });
        if (standardCheckbox.checked) {
            standardPriceGroup.classList.remove('hidden');
            standardPriceGroup.style.display = 'flex';
            document.getElementById('ticketStandardPrice').required = true;
        } else {
            standardPriceGroup.classList.add('hidden');
            standardPriceGroup.style.display = 'none';
            document.getElementById('ticketStandardPrice').required = false;
        }
        updateStatusBadge(standardCheckbox, standardStatusBadge);
    }
    
    if (vipCheckbox && vipPriceGroup) {
        vipCheckbox.addEventListener('change', function() {
            if (this.checked) {
                vipPriceGroup.classList.remove('hidden');
                vipPriceGroup.style.display = 'flex';
                document.getElementById('ticketVipPrice').required = true;
            } else {
                vipPriceGroup.classList.add('hidden');
                vipPriceGroup.style.display = 'none';
                document.getElementById('ticketVipPrice').required = false;
                document.getElementById('ticketVipPrice').value = '';
            }
            updateStatusBadge(vipCheckbox, vipStatusBadge);
        });
        if (vipCheckbox.checked) {
            vipPriceGroup.classList.remove('hidden');
            vipPriceGroup.style.display = 'flex';
            document.getElementById('ticketVipPrice').required = true;
        } else {
            vipPriceGroup.classList.add('hidden');
            vipPriceGroup.style.display = 'none';
            document.getElementById('ticketVipPrice').required = false;
        }
        updateStatusBadge(vipCheckbox, vipStatusBadge);
    }
}

// ============================================================
// ===== INIT COUNTRY SELECTORS - AVEC DRAPEAUX =====
// ============================================================

function initCountrySelectors() {
    var filterSelect = document.getElementById('countrySelect');
    if (filterSelect) {
        filterSelect.innerHTML = '';
        for (var i = 0; i < countriesList.length; i++) {
            var country = countriesList[i];
            var flag = countryFlags[country] || '🌍';
            var option = document.createElement('option');
            option.value = country;
            option.textContent = flag + ' ' + country;
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
            var flag = countryFlags[country] || '🌍';
            var option = document.createElement('option');
            option.value = country;
            option.textContent = flag + ' ' + country;
            if (country === 'France') {
                option.selected = true;
            }
            eventSelect.appendChild(option);
        }
    }
}

// ============================================================
// ===== CONFIRMATION ACHAT =====
// ============================================================

function openQuantityPopup(eventId) {
    var event = events.find(function(e) { return e.id === eventId; });
    if (!event) { alert('Event not found'); return; }
    if (!piUser && !currentUser.wallet) {
        alert('Please connect your Pi account first');
        connectToPi();
        return;
    }
    if (event.seatsLeft <= 0) { alert('No seats available for this event'); return; }
    
    selectedEventForPurchase = event;
    
    var popup = document.getElementById('quantityPopup');
    var titleEl = document.getElementById('quantityEventTitle');
    var infoEl = document.getElementById('quantityEventInfo');
    var maxInfo = document.getElementById('maxQuantityInfo');
    var quantityInput = document.getElementById('ticketQuantity');
    var totalDisplay = document.getElementById('totalPriceDisplay');
    var ticketTypeSelect = document.getElementById('ticketTypeSelect');
    
    if (titleEl) titleEl.textContent = event.title;
    if (infoEl) {
        var dateEvent = new Date(event.date);
        infoEl.textContent = dateEvent.toLocaleDateString('en-US') + ' at ' + dateEvent.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }) + ' | ' + event.location;
    }
    if (maxInfo) {
        maxInfo.textContent = 'Maximum ' + Math.min(event.seatsLeft, 10) + ' tickets available';
    }
    if (quantityInput) {
        quantityInput.value = 1;
        quantityInput.max = Math.min(event.seatsLeft, 10);
        quantityInput.min = 1;
    }
    
    if (ticketTypeSelect) {
        ticketTypeSelect.innerHTML = '';
        var options = [];
        if (event.ticketTypes && event.ticketTypes.standard && event.ticketTypes.standard.enabled) {
            options.push({ value: 'standard', label: 'Standard - ' + event.ticketTypes.standard.price + ' Pi' });
        }
        if (event.ticketTypes && event.ticketTypes.vip && event.ticketTypes.vip.enabled) {
            options.push({ value: 'vip', label: 'VIP - ' + event.ticketTypes.vip.price + ' Pi' });
        }
        if (options.length === 0) {
            options.push({ value: 'standard', label: 'Standard - ' + event.price + ' Pi' });
        }
        for (var i = 0; i < options.length; i++) {
            var opt = document.createElement('option');
            opt.value = options[i].value;
            opt.textContent = options[i].label;
            ticketTypeSelect.appendChild(opt);
        }
        selectedTicketType = options[0].value;
    }
    
    updateTicketTotal();
    popup.classList.add('show');
}

function updateTicketTotal() {
    var input = document.getElementById('ticketQuantity');
    var totalDisplay = document.getElementById('totalPriceDisplay');
    var ticketTypeSelect = document.getElementById('ticketTypeSelect');
    if (!input || !totalDisplay || !selectedEventForPurchase) return;
    
    var qty = parseInt(input.value) || 1;
    var type = ticketTypeSelect ? ticketTypeSelect.value : 'standard';
    var price = (selectedEventForPurchase.ticketTypes && selectedEventForPurchase.ticketTypes[type] && selectedEventForPurchase.ticketTypes[type].price) || selectedEventForPurchase.price || 0;
    var total = qty * price;
    totalDisplay.textContent = total.toFixed(6) + ' Pi';
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
    updateTicketTotal();
}

async function confirmPurchaseFromPopup() {
    if (!selectedEventForPurchase) {
        alert('No event selected');
        return;
    }
    
    var quantityInput = document.getElementById('ticketQuantity');
    var quantity = parseInt(quantityInput.value) || 1;
    var ticketTypeSelect = document.getElementById('ticketTypeSelect');
    var ticketType = ticketTypeSelect ? ticketTypeSelect.value : 'standard';
    
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
    
    await confirmPurchase(selectedEventForPurchase.id, quantity, ticketType);
}

async function confirmPurchase(eventId, quantity, ticketType) {
    var event = events.find(function(e) { return e.id === eventId; });
    if (!event) { alert('Event not found'); return; }
    
    var price = (event.ticketTypes && event.ticketTypes[ticketType] && event.ticketTypes[ticketType].price) || event.price || 0;
    if (quantity > event.seatsLeft) { alert('Only ' + event.seatsLeft + ' seats available'); return; }
    
    var totalPrice = quantity * price;
    var typeLabel = ticketType === 'vip' ? 'VIP' : 'Standard';
    
    if (!confirm('Buy ' + quantity + ' ' + typeLabel + ' ticket(s) for "' + event.title + '" (Total: ' + totalPrice.toFixed(6) + ' Pi) ?')) { return; }
    
    closeQuantityPopup();
    
    try {
        var payment = await Pi.createPayment({
            amount: Number(totalPrice),
            memo: quantity + ' ' + typeLabel + ' ticket(s): ' + event.title,
            metadata: { eventId: event.id, eventTitle: event.title, quantity: quantity, ticketType: ticketType }
        }, {
            onReadyForServerApproval: function(paymentId) {
                fetch(BACKEND_URL + '/api/pi/approve', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ paymentId: paymentId }) });
            },
            onReadyForServerCompletion: function(paymentId, txid) {
                fetch(BACKEND_URL + '/api/pi/complete', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ paymentId: paymentId, txid: txid, amount: totalPrice, metadata: { eventId: event.id, quantity: quantity, ticketType: ticketType } }) }).then(async function() {
                    var ticketsAdded = [];
                    for (var i = 0; i < quantity; i++) {
                        var ticket = {
                            id: Date.now().toString() + '-' + i,
                            eventId: event.id,
                            eventTitle: event.title,
                            eventDate: event.date,
                            eventLocation: event.location,
                            category: event.category || '',
                            price: price,
                            ticketType: ticketType,
                            buyerWallet: piUser ? piUser.username : currentUser.wallet,
                            buyerName: piUser ? piUser.username : currentUser.name,
                            userWallet: currentUser.wallet,
                            status: 'Valid',
                            purchaseDate: new Date().toISOString(),
                            purchaseDateTime: new Date().toLocaleString('en-US'),
                            transactionId: txid,
                            qrCode: 'BETIX-' + Date.now() + '-' + txid.substring(0, 8) + '-' + i
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
                    
                    await saveTransactionToSupabase({
                        id: Date.now().toString(),
                        buyerWallet: currentUser.wallet,
                        buyerPiUid: currentUser.piUid || currentUser.wallet,
                        eventId: event.id,
                        amount: totalPrice,
                        txid: txid,
                        status: 'completed',
                        date: new Date().toISOString()
                    });
                    
                    addNotification(
                        'Purchase of ' + quantity + ' ' + typeLabel + ' ticket(s) for "' + event.title + '" by ' + (currentUser.name || 'a user'),
                        'purchase'
                    );
                    renderEventsByCategory();
                    renderTickets();
                    renderHistory();
                    updateProfilePage();
                    syncUserToSupabase();
                    showSuccessPopup(event, ticketsAdded, quantity, ticketType);
                });
            },
            onCancel: function() { alert("Payment cancelled"); },
            onError: function(error) { alert("Payment error: " + error.message); }
        });
    } catch (error) { alert("Error: " + error.message); }
}

// ============================================================
// ===== PURCHASE SUCCESS POPUP =====
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
    
    title.textContent = 'Purchase successful!';
    message.textContent = qty + ' ' + typeLabel + ' ticket(s) added successfully.';
    
    var dateEvent = new Date(event.date);
    var dateFormatted = dateEvent.toLocaleDateString('en-US');
    var timeFormatted = dateEvent.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    var totalPrice = qty * price;
    var codeDisplay = ticket.qrCode || 'N/A';
    
    info.innerHTML = 
        '<div class="ticket-line"><span class="ticket-label">Event</span><span class="ticket-value">' + escapeHtml(event.title) + '</span></div>' +
        '<div class="ticket-line"><span class="ticket-label">Type</span><span class="ticket-value">' + typeLabel + '</span></div>' +
        '<div class="ticket-line"><span class="ticket-label">Date</span><span class="ticket-value">' + dateFormatted + ' at ' + timeFormatted + '</span></div>' +
        '<div class="ticket-line"><span class="ticket-label">Location</span><span class="ticket-value">' + escapeHtml(event.location || 'Online') + '</span></div>' +
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
// ===== CREATE EVENT =====
// ============================================================

async function createEvent(e) {
    e.preventDefault();
    
    var publishBtn = document.getElementById('publishEventBtn');
    
    if (publishBtn.classList.contains('loading')) {
        return;
    }
    
    if (!currentUser.wallet) { 
        alert('Connect your Pi account first'); 
        return; 
    }
    
    var title = document.getElementById('eventTitle').value.trim();
    var category = document.getElementById('eventCategory').value;
    var country = document.getElementById('eventCountry').value;
    var date = document.getElementById('eventDate').value;
    var location = document.getElementById('eventLocation').value.trim();
    var description = document.getElementById('eventDescription').value.trim();
    var conditions = document.getElementById('eventConditions').value.trim();
    var seatsTotal = parseInt(document.getElementById('eventSeats').value);
    var durationValue = document.getElementById('eventDurationValue').value;
    var durationUnit = document.getElementById('eventDurationUnit').value;
    var durationValueNum = durationValue ? parseInt(durationValue) : null;
    
    if (!title) {
        alert('Please enter a title');
        return;
    }
    if (!date) {
        alert('Please select a date and time');
        return;
    }
    if (!location) {
        alert('Please enter a location');
        return;
    }
    if (!seatsTotal || seatsTotal < 1) {
        alert('Please enter a valid number of seats');
        return;
    }
    if (!conditions) {
        alert('Please add participation conditions');
        return;
    }
    
    var standardEnabled = document.getElementById('ticketStandardEnabled').checked;
    var vipEnabled = document.getElementById('ticketVipEnabled').checked;
    var standardPrice = parseFloat(document.getElementById('ticketStandardPrice').value);
    var vipPrice = parseFloat(document.getElementById('ticketVipPrice').value);
    
    if (!standardEnabled && !vipEnabled) {
        alert('Please enable at least one ticket type (Standard or VIP)');
        return;
    }
    
    if (standardEnabled && (!standardPrice || standardPrice <= 0)) {
        alert('Please enter a valid price for Standard tickets');
        return;
    }
    
    if (vipEnabled && (!vipPrice || vipPrice <= 0)) {
        alert('Please enter a valid price for VIP tickets');
        return;
    }
    
    var images = getUploadedImages();
    if (images.length < 2) { 
        alert('Please add 2 photos for your event'); 
        return; 
    }
    
    publishBtn.classList.add('loading');
    publishBtn.disabled = true;
    
    try {
        var newEvent = {
            id: Date.now().toString(),
            title: title,
            category: category,
            country: country,
            date: date,
            location: location,
            description: description || '',
            conditions: conditions,
            price: standardEnabled ? standardPrice : (vipEnabled ? vipPrice : 0.0003),
            seatsTotal: seatsTotal,
            seatsLeft: seatsTotal,
            images: images,
            coverImage: images[0],
            organizer: currentUser.wallet,
            organizerPiUid: currentUser.piUid || currentUser.wallet,
            organizerName: currentUser.name,
            createdAt: new Date().toISOString(),
            boosts: 0,
            durationValue: durationValueNum,
            durationUnit: durationUnit,
            ticketTypes: {
                standard: { enabled: standardEnabled, price: standardPrice || 0 },
                vip: { enabled: vipEnabled, price: vipPrice || 0 }
            }
        };
        
        openPublishConfirm(newEvent);
        
    } catch (error) {
        console.error('Error creating event:', error);
        alert('An error occurred while creating the event: ' + error.message);
        publishBtn.classList.remove('loading');
        publishBtn.disabled = false;
    }
}

// ============================================================
// ===== PUBLISH CONFIRMATION =====
// ============================================================

function openPublishConfirm(eventData) {
    pendingEventData = eventData;
    
    var confirmTitle = document.getElementById('confirmTitle');
    var confirmCategory = document.getElementById('confirmCategory');
    var confirmCountry = document.getElementById('confirmCountry');
    var confirmDate = document.getElementById('confirmDate');
    var confirmLocation = document.getElementById('confirmLocation');
    var confirmPrice = document.getElementById('confirmPrice');
    var confirmSeats = document.getElementById('confirmSeats');
    var confirmOrganizer = document.getElementById('confirmOrganizer');
    var confirmDescription = document.getElementById('confirmDescription');
    var confirmConditions = document.getElementById('confirmConditions');
    var confirmTicketTypes = document.getElementById('confirmTicketTypes');
    var confirmDuration = document.getElementById('confirmDuration');
    var confirmImages = document.getElementById('confirmImages');
    
    if (!confirmTitle || !confirmCategory || !confirmCountry || !confirmDate || 
        !confirmLocation || !confirmPrice || !confirmSeats || !confirmOrganizer || 
        !confirmDescription || !confirmConditions || !confirmImages) {
        console.error('Some confirmation elements are missing from the DOM');
        alert('An error occurred: missing confirmation elements. Please try again.');
        var publishBtn = document.getElementById('publishEventBtn');
        if (publishBtn) {
            publishBtn.classList.remove('loading');
            publishBtn.disabled = false;
        }
        return;
    }
    
    confirmTitle.textContent = eventData.title || 'Untitled';
    confirmCategory.textContent = eventData.category || 'Uncategorized';
    confirmCountry.textContent = eventData.country || 'Not specified';
    
    var dateEvent = new Date(eventData.date);
    confirmDate.textContent = dateEvent.toLocaleDateString('en-US') + ' at ' + dateEvent.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    confirmLocation.textContent = eventData.location || 'Online';
    confirmPrice.textContent = eventData.price + ' Pi';
    confirmSeats.textContent = eventData.seatsTotal || 0;
    confirmOrganizer.textContent = currentUser.name || currentUser.wallet || 'Unknown';
    confirmDescription.textContent = eventData.description || 'No description';
    confirmConditions.textContent = eventData.conditions || 'No conditions specified';
    
    if (confirmTicketTypes) {
        var types = [];
        if (eventData.ticketTypes && eventData.ticketTypes.standard && eventData.ticketTypes.standard.enabled) {
            types.push('Standard: ' + eventData.ticketTypes.standard.price + ' Pi');
        }
        if (eventData.ticketTypes && eventData.ticketTypes.vip && eventData.ticketTypes.vip.enabled) {
            types.push('VIP: ' + eventData.ticketTypes.vip.price + ' Pi');
        }
        confirmTicketTypes.textContent = types.join(' | ') || 'Not specified';
    }
    
    if (confirmDuration) {
        if (eventData.durationValue && eventData.durationUnit) {
            confirmDuration.textContent = eventData.durationValue + ' ' + eventData.durationUnit;
            confirmDuration.style.display = 'block';
        } else {
            confirmDuration.style.display = 'none';
        }
    }
    
    confirmImages.innerHTML = '';
    if (eventData.images && eventData.images.length > 0) {
        for (var i = 0; i < eventData.images.length; i++) {
            var img = document.createElement('img');
            img.src = eventData.images[i];
            img.alt = 'Event image ' + (i + 1);
            confirmImages.appendChild(img);
        }
    }
    
    document.getElementById('publishConfirmPopup').classList.add('show');
}

function closePublishConfirmPopup() {
    document.getElementById('publishConfirmPopup').classList.remove('show');
    var publishBtn = document.getElementById('publishEventBtn');
    if (publishBtn) {
        publishBtn.classList.remove('loading');
        publishBtn.disabled = false;
    }
    pendingEventData = null;
}

async function confirmPublishEvent() {
    if (!pendingEventData) {
        alert('No event data to publish');
        return;
    }
    
    var publishBtn = document.getElementById('publishEventBtn');
    var confirmBtn = document.getElementById('confirmPublishBtn');
    
    if (confirmBtn) {
        confirmBtn.classList.add('loading');
        confirmBtn.disabled = true;
        confirmBtn.textContent = 'Publishing...';
    }
    
    try {
        var newEvent = pendingEventData;
        
        var uploadedUrls = [];
        if (newEvent.images && newEvent.images.length > 0) {
            for (var i = 0; i < newEvent.images.length; i++) {
                var imageData = newEvent.images[i];
                var url = await uploadEventImage(newEvent.id, imageData, i);
                if (url) {
                    uploadedUrls.push(url);
                } else {
                    uploadedUrls.push(imageData);
                }
            }
        }
        
        newEvent.images = uploadedUrls;
        newEvent.coverImage = uploadedUrls.length > 0 ? uploadedUrls[0] : '';
        newEvent.organizerPiUid = currentUser.piUid || currentUser.wallet;
        
        events.push(newEvent);
        saveEvents();
        
        var form = document.getElementById('eventForm');
        if (form) form.reset();
        
        for (var i = 0; i < 2; i++) {
            removeImageModern(i);
        }
        uploadedImages = {};
        
        var standardCheckbox = document.getElementById('ticketStandardEnabled');
        var vipCheckbox = document.getElementById('ticketVipEnabled');
        if (standardCheckbox) standardCheckbox.checked = true;
        if (vipCheckbox) vipCheckbox.checked = false;
        setupTicketTypesUI();
        
        addNotification(
            'New event "' + newEvent.title + '" has been published!',
            'event'
        );
        
        closePublishConfirmPopup();
        document.getElementById('publishConfirmPopup').classList.remove('show');
        
        renderEventsByCategory();
        updateProfilePage();
        
        if (publishBtn) {
            publishBtn.classList.remove('loading');
            publishBtn.disabled = false;
        }
        
        alert('Event "' + newEvent.title + '" has been successfully published!');
        showPage('home');
        
    } catch (error) {
        console.error('Error publishing event:', error);
        alert('An error occurred while publishing the event: ' + error.message);
        
        if (confirmBtn) {
            confirmBtn.classList.remove('loading');
            confirmBtn.disabled = false;
            confirmBtn.textContent = 'Publish Event';
        }
        if (publishBtn) {
            publishBtn.classList.remove('loading');
            publishBtn.disabled = false;
        }
    }
}

// ============================================================
// ===== IMAGE UPLOAD =====
// ============================================================

function compressImage(file) {
    return new Promise(function(resolve, reject) {
        if (!file || !file.type.startsWith('image/')) {
            reject(new Error('Not an image'));
            return;
        }
        
        var reader = new FileReader();
        reader.onload = function(event) {
            var img = new Image();
            img.onload = function() {
                var width = img.width;
                var height = img.height;
                var maxWidth = 800;
                var maxHeight = 800;
                
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
                
                var format = 'image/webp';
                var testCanvas = document.createElement('canvas');
                testCanvas.width = 1;
                testCanvas.height = 1;
                var testData = testCanvas.toDataURL('image/webp');
                if (!testData || testData.indexOf('image/webp') === -1) {
                    format = 'image/jpeg';
                }
                
                var compressedDataUrl = canvas.toDataURL(format, 0.7);
                resolve(compressedDataUrl);
            };
            img.onerror = function() { reject(new Error('Failed to load image')); };
            img.src = event.target.result;
        };
        reader.onerror = function() { reject(new Error('Failed to read file')); };
        reader.readAsDataURL(file);
    });
}

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
        
        var compressedData = await compressImage(file);
        
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
// ===== MODIFIER UN ÉVÉNEMENT =====
// ============================================================

function openEditEventModal(eventId) {
    var event = events.find(function(e) { return e.id === eventId; });
    if (!event) {
        alert('Event not found');
        return;
    }
    
    if (event.organizer !== currentUser.wallet && event.organizerName !== currentUser.name) {
        alert('You are not the organizer of this event');
        return;
    }
    
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
    if (!event) {
        alert('Event not found');
        return;
    }
    
    var description = document.getElementById('editEventDescription').value.trim();
    var location = document.getElementById('editEventLocation').value.trim();
    var conditions = document.getElementById('editEventConditions').value.trim();
    var seatsTotal = parseInt(document.getElementById('editEventSeats').value);
    var durationValue = document.getElementById('editEventDurationValue').value;
    var durationUnit = document.getElementById('editEventDurationUnit').value;
    
    if (!seatsTotal || seatsTotal < 1) {
        alert('Please enter a valid number of seats');
        return;
    }
    
    var ticketsSold = tickets.filter(function(t) { return t.eventId === editingEventId; }).length;
    if (seatsTotal < ticketsSold) {
        alert('You cannot reduce the number of seats below the number already sold (' + ticketsSold + ' seats sold)');
        return;
    }
    
    var updates = {
        description: description,
        location: location,
        conditions: conditions,
        seatsTotal: seatsTotal,
        seatsLeft: seatsTotal - ticketsSold,
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
        description: updates.description,
        location: updates.location,
        conditions: updates.conditions,
        max_tickets: updates.seatsTotal,
        duration_value: updates.durationValue,
        duration_unit: updates.durationUnit
    });
    
    addNotification(
        'Event "' + event.title + '" has been updated',
        'event'
    );
    
    closeEditEventModal();
    renderEventsByCategory();
    renderMyEvents();
    alert('Event updated successfully!');
}

// ============================================================
// ===== TICKETS AND HISTORY - CORRIGÉ =====
// ============================================================

function renderTickets() {
    var container = document.getElementById('ticketsList');
    if (!container) return;
    
    // Un ticket est actif s'il n'est PAS utilisé (peu importe la date)
    // Un ticket utilisé = utiliséTickets contient son ID OU status === 'Used'
    var active = tickets.filter(function(t) {
        var isUsed = usedTickets.indexOf(t.id) !== -1 || t.status === 'Used';
        return !isUsed;
    });
    
    active.sort(function(a, b) { return new Date(b.purchaseDate) - new Date(a.purchaseDate); });
    
    if (!active.length) { 
        container.innerHTML = '<p style="text-align:center;padding:2rem;color:var(--gray);">No active tickets</p>'; 
        return; 
    }
    container.innerHTML = active.map(function(t) { return renderTicketCard(t, 'valid'); }).join('');
}

function renderHistory() {
    var container = document.getElementById('historyList');
    if (!container) return;
    
    // Un ticket est dans l'historique s'il est utilisé (peu importe la date)
    var history = tickets.filter(function(t) {
        var isUsed = usedTickets.indexOf(t.id) !== -1 || t.status === 'Used';
        return isUsed;
    });
    
    history.sort(function(a, b) { return new Date(b.purchaseDate) - new Date(a.purchaseDate); });
    
    if (!history.length) { 
        container.innerHTML = '<p style="text-align:center;padding:2rem;color:var(--gray);">No ticket history</p>'; 
        return; 
    }
    container.innerHTML = history.map(function(t) { return renderTicketCard(t, 'past'); }).join('');
}

function renderTicketCard(ticket, status) {
    var dateEvent = new Date(ticket.eventDate);
    var dateFormatted = dateEvent.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    var timeFormatted = dateEvent.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    
    var isVip = ticket.ticketType === 'vip';
    var statusClass = status === 'valid' ? 'valid' : 'past';
    var statusText = status === 'valid' ? 'Valid' : 'Past Event';
    var typeLabel = isVip ? 'VIP' : 'Standard';
    
    var vipClass = isVip ? 'ticket-vip' : '';
    var vipBadgeStyle = isVip ? 'vip-badge' : '';
    var vipHeaderStyle = isVip ? 'vip-header' : '';
    
    var qrCode = ticket.qrCode || 'BETIX-' + ticket.id.substring(0, 8);
    var shortQr = qrCode.length > 12 ? qrCode.substring(0, 10) + '...' : qrCode;
    
    var participantName = ticket.buyerName || ticket.buyerWallet || 'Anonymous';
    if (participantName.length > 20) {
        participantName = participantName.substring(0, 18) + '...';
    }
    
    var categoryDisplay = ticket.category || 'Event';
    
    var downloadButton = '';
    if (status === 'valid') {
        downloadButton = '<button class="btn-download-ticket" onclick="downloadTicketPDF(\'' + ticket.id + '\')"><i class="fas fa-file-pdf"></i> Télécharger le ticket</button>';
    }
    
    return '<div class="ticket-card-premium ' + vipClass + '">' +
        '<div class="ticket-header ' + vipHeaderStyle + '">' +
            '<span class="ticket-status ' + statusClass + ' ' + vipBadgeStyle + '">' + statusText + ' - ' + typeLabel + '</span>' +
            '<span class="ticket-number">#' + ticket.id.substring(0, 8).toUpperCase() + '</span>' +
        '</div>' +
        '<div class="ticket-body">' +
            '<div class="ticket-event-title">' + escapeHtml(ticket.eventTitle) + '</div>' +
            '<span class="ticket-category ' + (isVip ? 'vip-category' : '') + '">' + escapeHtml(categoryDisplay) + ' | ' + typeLabel + '</span>' +
            '<div class="ticket-info-grid">' +
                '<div class="ticket-info-item"><i class="fas fa-calendar-day"></i> <span class="ticket-label">Date</span> <span class="ticket-value">' + dateFormatted + '</span></div>' +
                '<div class="ticket-info-item"><i class="fas fa-clock"></i> <span class="ticket-label">Time</span> <span class="ticket-value">' + timeFormatted + '</span></div>' +
                '<div class="ticket-info-item"><i class="fas fa-map-marker-alt"></i> <span class="ticket-label">Location</span> <span class="ticket-value">' + escapeHtml(ticket.eventLocation || 'Online') + '</span></div>' +
                '<div class="ticket-info-item"><i class="fas fa-tag"></i> <span class="ticket-label">Price</span> <span class="ticket-value">' + (ticket.price || 0) + ' Pi</span></div>' +
            '</div>' +
            '<div class="ticket-footer">' +
                '<div class="ticket-qr">' +
                    '<div class="qr-code ' + (isVip ? 'vip-qr' : '') + '">' + shortQr + '</div>' +
                    '<div><span class="qr-label">Ticket Code</span><br><span style="font-size:0.6rem;color:var(--gray);font-family:monospace;">' + qrCode + '</span></div>' +
                '</div>' +
                '<div class="ticket-participant">' +
                    'Participant<br><span class="participant-name">' + escapeHtml(participantName) + '</span>' +
                '</div>' +
            '</div>' +
            downloadButton +
        '</div>' +
        '<div class="ticket-logo-placeholder">BETIX</div>' +
    '</div>';
}

// ============================================================
// ===== TÉLÉCHARGER LE TICKET EN PDF =====
// ============================================================

function downloadTicketPDF(ticketId) {
    var ticket = tickets.find(function(t) { return t.id === ticketId; });
    if (!ticket) {
        alert('Ticket not found');
        return;
    }
    
    try {
        var { jsPDF } = window.jspdf;
        var doc = new jsPDF('p', 'mm', 'a4');
        
        var pageWidth = doc.internal.pageSize.getWidth();
        var pageHeight = doc.internal.pageSize.getHeight();
        
        var primaryColor = [13, 71, 161];
        var goldColor = [212, 145, 30];
        var darkColor = [26, 26, 46];
        var grayColor = [107, 114, 128];
        
        doc.setFillColor(255, 255, 255);
        doc.rect(0, 0, pageWidth, pageHeight, 'F');
        
        var isVip = ticket.ticketType === 'vip';
        var bandeauColor = isVip ? goldColor : primaryColor;
        
        doc.setFillColor(bandeauColor[0], bandeauColor[1], bandeauColor[2]);
        doc.rect(0, 0, pageWidth, 50, 'F');
        
        doc.setFontSize(28);
        doc.setTextColor(255, 255, 255);
        doc.setFont('helvetica', 'bold');
        doc.text('BETIX', 20, 30);
        
        doc.setFontSize(11);
        doc.setFont('helvetica', 'normal');
        doc.text('Decentralized Event Ticketing Platform', 20, 40);
        
        var typeLabel = isVip ? 'VIP TICKET' : 'STANDARD TICKET';
        var typeColor = isVip ? goldColor : [16, 185, 129];
        
        doc.setFillColor(typeColor[0], typeColor[1], typeColor[2]);
        doc.roundedRect(pageWidth - 60, 12, 40, 18, 3, 3, 'F');
        doc.setFontSize(9);
        doc.setTextColor(255, 255, 255);
        doc.setFont('helvetica', 'bold');
        doc.text(typeLabel, pageWidth - 40, 25, { align: 'center' });
        
        var yPos = 70;
        
        doc.setFontSize(22);
        doc.setTextColor(darkColor[0], darkColor[1], darkColor[2]);
        doc.setFont('helvetica', 'bold');
        var titleLines = doc.splitTextToSize(ticket.eventTitle || 'Event', pageWidth - 40);
        doc.text(titleLines, 20, yPos);
        yPos += (titleLines.length * 8) + 8;
        
        doc.setDrawColor(isVip ? goldColor[0] : primaryColor[0], isVip ? goldColor[1] : primaryColor[1], isVip ? goldColor[2] : primaryColor[2]);
        doc.setLineWidth(0.8);
        doc.line(20, yPos, pageWidth - 20, yPos);
        yPos += 10;
        
        doc.setFontSize(10);
        doc.setTextColor(grayColor[0], grayColor[1], grayColor[2]);
        doc.setFont('helvetica', 'normal');
        
        var dateEvent = new Date(ticket.eventDate);
        var dateFormatted = dateEvent.toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
        var timeFormatted = dateEvent.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
        
        var infoItems = [
            ['📅 Date', dateFormatted],
            ['⏰ Heure', timeFormatted],
            ['📍 Lieu', ticket.eventLocation || 'En ligne'],
            ['🎫 Type', typeLabel],
            ['💰 Prix', ticket.price + ' Pi'],
            ['👤 Participant', ticket.buyerName || ticket.buyerWallet || 'Anonyme']
        ];
        
        var col1 = 20;
        var col2 = 70;
        var rowHeight = 9;
        
        for (var i = 0; i < infoItems.length; i++) {
            var item = infoItems[i];
            doc.setFont('helvetica', 'bold');
            doc.setTextColor(darkColor[0], darkColor[1], darkColor[2]);
            doc.text(item[0] + ' :', col1, yPos);
            
            doc.setFont('helvetica', 'normal');
            doc.setTextColor(60, 60, 60);
            var textWidth = doc.getTextWidth(item[1]);
            if (textWidth > pageWidth - col2 - 20) {
                var lines = doc.splitTextToSize(item[1], pageWidth - col2 - 20);
                doc.text(lines, col2, yPos);
                yPos += (lines.length - 1) * rowHeight;
            } else {
                doc.text(item[1], col2, yPos);
            }
            yPos += rowHeight;
        }
        
        yPos += 10;
        
        doc.setFontSize(9);
        doc.setTextColor(darkColor[0], darkColor[1], darkColor[2]);
        doc.setFont('helvetica', 'bold');
        doc.text('Code du billet :', 20, yPos);
        yPos += 6;
        
        var qrCode = ticket.qrCode || 'BETIX-' + ticket.id.substring(0, 8);
        doc.setFont('courier', 'normal');
        doc.setFontSize(10);
        doc.setTextColor(isVip ? goldColor[0] : primaryColor[0], isVip ? goldColor[1] : primaryColor[1], isVip ? goldColor[2] : primaryColor[2]);
        doc.text(qrCode, 20, yPos);
        yPos += 12;
        
        doc.setFontSize(8);
        doc.setTextColor(grayColor[0], grayColor[1], grayColor[2]);
        doc.setFont('helvetica', 'italic');
        doc.text('Ce billet est strictement personnel et nominatif.', 20, yPos);
        yPos += 6;
        doc.text('Présentez-le à l\'entrée de l\'événement.', 20, yPos);
        yPos += 12;
        
        doc.setFontSize(7);
        doc.setTextColor(grayColor[0], grayColor[1], grayColor[2]);
        doc.setFont('helvetica', 'normal');
        doc.text('BETIX - Plateforme décentralisée d\'événements sur Pi Network', pageWidth / 2, pageHeight - 20, { align: 'center' });
        doc.text('Délivré le ' + new Date(ticket.purchaseDate).toLocaleDateString('fr-FR'), pageWidth / 2, pageHeight - 13, { align: 'center' });
        
        doc.setFillColor(isVip ? goldColor[0] : primaryColor[0], isVip ? goldColor[1] : primaryColor[1], isVip ? goldColor[2] : primaryColor[2]);
        doc.rect(0, pageHeight - 5, pageWidth, 5, 'F');
        
        var fileName = 'Billet_Betix_' + ticket.eventTitle.replace(/\s+/g, '_') + '_' + ticket.id.substring(0, 6) + '.pdf';
        doc.save(fileName);
        
        addNotification('Ticket "' + ticket.eventTitle + '" téléchargé en PDF', 'info');
        
    } catch (error) {
        console.error('Error generating PDF:', error);
        alert('Erreur lors de la génération du PDF. Veuillez réessayer.');
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
    container.innerHTML = myRatings.map(function(r) { var stars = ''; for (var i = 0; i < r.rating; i++) stars += '★'; for (var i = r.rating; i < 5; i++) stars += '☆'; return '<div class="ticket-card"><h3>' + escapeHtml(r.eventTitle) + '</h3><div>Rating: ' + r.rating + '/5 ' + stars + '</div>' + (r.comment ? '<p>"' + escapeHtml(r.comment) + '"</p>' : '') + '<small>' + new Date(r.date).toLocaleDateString() + '</small></div>'; }).join('');
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

function addAdminLog(action, details) {
    var log = {
        id: Date.now(),
        timestamp: new Date().toISOString(),
        date: new Date().toLocaleString('en-US'),
        user: currentUser.wallet || 'Local Admin',
        action: action,
        details: details || ''
    };
    adminLogs.unshift(log);
    if (adminLogs.length > 500) {
        adminLogs = adminLogs.slice(0, 500);
    }
    localStorage.setItem('betix_admin_logs', JSON.stringify(adminLogs));
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
        renderAdminLogs();
        addAdminLog('Logs cleared', 'All logs were deleted');
        alert('Logs cleared');
    }
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

function renderAdminUsers() {
    var container = document.getElementById('adminUsersList');
    if (!container) return;
    var html = '<table>';
    html += '<tr><th>User</th><th>Pi Account</th><th>Tickets</th><th>Average Rating</th><th>Last Seen</th></tr>';
    var userRatings = ratings.filter(function(r) { return r.userWallet === (currentUser.wallet || currentUser.name); });
    var avgRating = 0;
    if (userRatings.length > 0) {
        avgRating = userRatings.reduce(function(a, r) { return a + r.rating; }, 0) / userRatings.length;
    }
    html += '<tr><td>' + escapeHtml(currentUser.name) + ' <span style="color:#f5a623;font-size:0.7rem;">(you)</span></td>' +
            '<td>' + (currentUser.wallet || 'Not connected') + '</td>' +
            '<td>' + tickets.length + '</td>' +
            '<td>' + (avgRating > 0 ? avgRating.toFixed(1) + '/5' : '-') + '</td>' +
            '<td>Active</td></tr>';
    for (var i = 0; i < connectedUsers.length; i++) {
        var u = connectedUsers[i];
        if (u.wallet !== currentUser.wallet) {
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

function renderAdminEvents() {
    var container = document.getElementById('adminEventsList');
    if (!container) return;
    if (events.length === 0) {
        container.innerHTML = '<p style="color: var(--gray); text-align:center; padding:20px;">No events created</p>';
        return;
    }
    container.innerHTML = events.map(function(e) {
        var types = [];
        if (e.ticketTypes && e.ticketTypes.standard && e.ticketTypes.standard.enabled) types.push('Standard: ' + e.ticketTypes.standard.price + ' Pi');
        if (e.ticketTypes && e.ticketTypes.vip && e.ticketTypes.vip.enabled) types.push('VIP: ' + e.ticketTypes.vip.price + ' Pi');
        var typesDisplay = types.join(' | ') || 'No ticket types';
        return '<div class="admin-event-item">' +
            '<div class="event-info">' +
                '<strong>' + escapeHtml(e.title) + '</strong>' +
                '<small>' + e.category + ' | ' + e.country + ' | ' + e.seatsLeft + '/' + e.seatsTotal + ' seats | ' + new Date(e.date).toLocaleDateString('en-US') + '</small>' +
                '<small>Tickets: ' + typesDisplay + '</small>' +
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
        deleteEventFromSupabase(id);
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
    var title = heroSlides[index] ? heroSlides[index].title : 'Untitled';
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

// ============================================================
// ===== MY EVENTS =====
// ============================================================

function renderMyEvents() {
    var container = document.getElementById('myEventsList');
    if (!container) return;
    var myEvents = events.filter(function(e) {
        return e.organizer === currentUser.wallet || e.organizerName === currentUser.name;
    });
    if (myEvents.length === 0) {
        container.innerHTML = '<div style="text-align:center;padding:3rem 1rem;color:var(--gray);"><i class="fas fa-calendar-plus" style="font-size:2rem;display:block;margin-bottom:1rem;opacity:0.3;"></i><p style="font-size:1.1rem;font-weight:500;margin-bottom:0.3rem;">No events created yet</p><p style="font-size:0.85rem;">Click "Create Event" to get started</p></div>';
        return;
    }
    container.innerHTML = myEvents.map(function(e) {
        return renderMyEventCardProfessional(e);
    }).join('');
}

function renderMyEventCardProfessional(event) {
    var dateEvent = new Date(event.date);
    var dateFormatted = dateEvent.toLocaleDateString('en-US', { month: 'numeric', day: 'numeric', year: 'numeric' });
    var timeFormatted = dateEvent.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    
    var fallbackImage = eventImagesList[event.category] || eventImagesList.Concert;
    var posterImage = event.coverImage || (event.images && event.images[0]) || fallbackImage;
    
    var ticketSold = tickets.filter(function(t) { return t.eventId === event.id; }).length;
    var isSoldOut = event.seatsLeft <= 0;
    var statusText = isSoldOut ? 'Sold Out' : 'Active';
    var statusClass = isSoldOut ? 'sold-out' : '';
    
    var typesDisplay = '';
    if (event.ticketTypes && event.ticketTypes.standard && event.ticketTypes.standard.enabled) typesDisplay += 'Standard: ' + event.ticketTypes.standard.price + ' Pi | ';
    if (event.ticketTypes && event.ticketTypes.vip && event.ticketTypes.vip.enabled) typesDisplay += 'VIP: ' + event.ticketTypes.vip.price + ' Pi';
    if (!typesDisplay) typesDisplay = 'No ticket types';
    
    var durationDisplay = '';
    if (event.durationValue && event.durationUnit) {
        durationDisplay = '<div class="detail-item"><i class="fas fa-clock"></i> ' + event.durationValue + ' ' + event.durationUnit + '</div>';
    }
    
    return '<div class="my-event-card">' +
        '<div class="event-gallery-wrapper">' +
            '<div class="event-gallery">' +
                '<img src="' + posterImage + '" class="event-gallery-img" alt="' + escapeHtml(event.title) + '" onerror="this.src=\'' + fallbackImage + '\'">' +
            '</div>' +
            '<span class="event-status-badge ' + statusClass + '">' + statusText + '</span>' +
        '</div>' +
        '<div class="event-info">' +
            '<div class="event-title">' + escapeHtml(event.title) + '</div>' +
            '<div class="event-details-grid">' +
                '<div class="detail-item"><i class="fas fa-calendar-day"></i> ' + dateFormatted + '</div>' +
                '<div class="detail-item"><i class="fas fa-clock"></i> ' + timeFormatted + '</div>' +
                '<div class="detail-item"><i class="fas fa-map-marker-alt"></i> ' + escapeHtml(event.location || 'Online') + '</div>' +
                '<div class="detail-item"><i class="fas fa-flag"></i> ' + escapeHtml(event.country || 'Not specified') + '</div>' +
                durationDisplay +
                '<div class="detail-item" style="grid-column: 1 / -1; font-size:0.7rem; color:var(--gray);">' + typesDisplay + '</div>' +
            '</div>' +
            '<div class="event-footer">' +
                '<div class="event-stats">' +
                    '<span><i class="fas fa-ticket-alt"></i> ' + ticketSold + ' sold</span>' +
                    '<span><i class="fas fa-users"></i> ' + event.seatsLeft + '/' + event.seatsTotal + '</span>' +
                '</div>' +
                '<div class="event-actions">' +
                    '<button class="btn-edit-event" onclick="event.stopPropagation(); openEditEventModal(\'' + event.id + '\')"><i class="fas fa-edit"></i> Edit</button>' +
                    '<button class="btn-delete-event" onclick="event.stopPropagation(); adminDeleteEvent(\'' + event.id + '\')"><i class="fas fa-trash"></i></button>' +
                '</div>' +
            '</div>' +
        '</div>' +
    '</div>';
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

// ============================================================
// ===== RENDER EVENT CARD =====
// ============================================================

function renderEventCard(event) {
    var avgRating = 0;
    var eventRatings = ratings.filter(function(r) { return r.eventId === event.id; });
    if (eventRatings.length > 0) { avgRating = eventRatings.reduce(function(a, r) { return a + r.rating; }, 0) / eventRatings.length; }
    
    var dateEvent = new Date(event.date);
    var dateFormatted = dateEvent.toLocaleDateString('en-US', { month: 'numeric', day: 'numeric', year: 'numeric' });
    var timeFormatted = dateEvent.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    
    var fallbackImage = eventImagesList[event.category] || eventImagesList.Concert;
    var posterImage = event.coverImage || (event.images && event.images[0]) || fallbackImage;
    
    var flagEmojis = {
        'France': 'FR', 'RDC': 'CD', 'Congo': 'CG', 'Belgium': 'BE',
        'Switzerland': 'CH', 'Canada': 'CA', 'Senegal': 'SN', 'Cameroon': 'CM',
        'Cote d\'Ivoire': 'CI', 'Ivory Coast': 'CI', 'Mali': 'ML', 'Niger': 'NE',
        'Nigeria': 'NG', 'South Africa': 'ZA', 'Angola': 'AO', 'Mozambique': 'MZ',
        'Kenya': 'KE', 'Tanzania': 'TZ', 'Uganda': 'UG', 'Rwanda': 'RW',
        'Burundi': 'BI', 'Ethiopia': 'ET', 'Somalia': 'SO', 'Djibouti': 'DJ',
        'Eritrea': 'ER', 'Sudan': 'SD', 'South Sudan': 'SS', 'Egypt': 'EG',
        'Libya': 'LY', 'Tunisia': 'TN', 'Algeria': 'DZ', 'Morocco': 'MA',
        'Mauritania': 'MR', 'Ghana': 'GH', 'Guinea': 'GN', 'Burkina Faso': 'BF',
        'Benin': 'BJ', 'Togo': 'TG', 'Liberia': 'LR', 'Sierra Leone': 'SL',
        'Gambia': 'GM', 'Guinea-Bissau': 'GW', 'Cape Verde': 'CV', 'Sao Tome': 'ST',
        'Gabon': 'GA', 'Equatorial Guinea': 'GQ', 'Central African Republic': 'CF',
        'Chad': 'TD', 'Madagascar': 'MG', 'Comoros': 'KM', 'Mauritius': 'MU',
        'Seychelles': 'SC', 'Zambia': 'ZM', 'Zimbabwe': 'ZW', 'Botswana': 'BW',
        'Namibia': 'NA', 'Lesotho': 'LS', 'Eswatini': 'SZ', 'Malawi': 'MW',
        'Spain': 'ES', 'Portugal': 'PT', 'Germany': 'DE', 'Italy': 'IT',
        'United Kingdom': 'GB', 'United States': 'US', 'Russia': 'RU',
        'Ukraine': 'UA', 'Turkey': 'TR', 'Iran': 'IR', 'China': 'CN',
        'Japan': 'JP', 'India': 'IN', 'Indonesia': 'ID', 'Australia': 'AU',
        'Mexico': 'MX', 'Argentina': 'AR', 'Brazil': 'BR', 'Denmark': 'DK',
        'Sweden': 'SE', 'Austria': 'AT'
    };
    
    var countryFlag = flagEmojis[event.country] || '🌍';
    var countryDisplay = event.country || 'International';
    
    var desc = event.description || '';
    if (desc.length > 120) {
        desc = desc.substring(0, 117) + '...';
    }
    
    var organizerDisplay = event.organizerName || event.organizer || 'Anonymous';
    if (organizerDisplay.length > 20) {
        organizerDisplay = organizerDisplay.substring(0, 18) + '...';
    }
    var organizerFormatted = organizerDisplay;
    if (!organizerFormatted.startsWith('@')) {
        organizerFormatted = '@' + organizerFormatted;
    }
    
    var ratingDisplay = '';
    if (eventRatings.length > 0) {
        var stars = '';
        var fullStars = Math.floor(avgRating);
        for (var i = 0; i < fullStars; i++) stars += '★';
        for (var i = fullStars; i < 5; i++) stars += '☆';
        ratingDisplay = '<span class="stars">' + stars + '</span> ' + avgRating.toFixed(1) + ' (' + eventRatings.length + ')';
    } else {
        ratingDisplay = '<span class="new-badge">New</span>';
    }
    
    var priceDisplay = '';
    if (event.ticketTypes && event.ticketTypes.standard && event.ticketTypes.standard.enabled) {
        priceDisplay += 'Standard: ' + event.ticketTypes.standard.price + ' Pi';
    }
    if (event.ticketTypes && event.ticketTypes.vip && event.ticketTypes.vip.enabled) {
        if (priceDisplay) priceDisplay += ' | ';
        priceDisplay += 'VIP: ' + event.ticketTypes.vip.price + ' Pi';
    }
    if (!priceDisplay) {
        priceDisplay = event.price + ' Pi';
    }
    
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
            '<div class="event-organizer-classic">' +
                '<span class="org-icon"><i class="fas fa-user"></i></span> By ' + escapeHtml(organizerFormatted) +
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
    
    var durationDisplay = document.getElementById('detailDuration');
    if (durationDisplay) {
        if (event.durationValue && event.durationUnit) {
            durationDisplay.textContent = 'Duration: ' + event.durationValue + ' ' + event.durationUnit;
            durationDisplay.style.display = 'block';
        } else {
            durationDisplay.style.display = 'none';
        }
    }
    
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
    var prevBtn = document.getElementById('galleryPrev');
    var nextBtn = document.getElementById('galleryNext');
    function updateImage(index) { if (index < 0) index = images.length - 1; if (index >= images.length) index = 0; currentIndex = index; imgElement.src = images[currentIndex]; }
    updateImage(currentIndex);
    prevBtn.onclick = function() { updateImage(currentIndex - 1); };
    nextBtn.onclick = function() { updateImage(currentIndex + 1); };
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
    var chips = document.querySelectorAll('.filter-chip');
    for (var i = 0; i < chips.length; i++) { chips[i].addEventListener('click', function() { currentFilter = this.dataset.category; initFilters(); renderEventsByCategory(); }); }
}

// ============================================================
// ===== TRACK USER CONNECTION =====
// ============================================================

function trackUserConnection() {
    if (currentUser.wallet) {
        var existing = null;
        for (var i = 0; i < connectedUsers.length; i++) { 
            if (connectedUsers[i].wallet === currentUser.wallet) { 
                existing = connectedUsers[i]; 
                break; 
            } 
        }
        var userData = {
            name: currentUser.name,
            wallet: currentUser.wallet,
            ticketCount: tickets.length,
            lastSeen: new Date().toLocaleString(),
            loyaltyPoints: currentUser.loyaltyPoints || 0,
            memberSince: currentUser.memberSince || '2026'
        };
        if (!existing) {
            connectedUsers.push(userData);
        } else {
            existing.name = currentUser.name;
            existing.ticketCount = tickets.length;
            existing.lastSeen = new Date().toLocaleString();
            existing.loyaltyPoints = currentUser.loyaltyPoints || 0;
        }
        localStorage.setItem('betix_connected_users', JSON.stringify(connectedUsers));
        syncUserToSupabase();
    }
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

// ============================================================
// ===== SHOW LEGAL =====
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
        { q: "How to buy a ticket?", a: "Connect, browse events, click 'Buy Ticket' and choose the quantity and type." },
        { q: "Are payments secure?", a: "Yes, via the Pi Network and Betix's escrow system." },
        { q: "Can I get a refund?", a: "Yes in case of cancellation, postponement or fraud." },
        { q: "Where are my tickets stored?", a: "In the 'My Tickets' section of your account." }
    ],
    [
        { q: "How to create an event?", a: "Connect, click 'Create Event' and fill out the form." },
        { q: "Conditions to be an organizer?", a: "Have an active Pi Network account and comply with the terms of use." },
        { q: "Can I modify an event?", a: "Yes, from the 'My Events' section." },
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

function initFaq() {
    console.log('Initializing FAQ...');
    renderFaqPage(0);
    initFaqPagination();
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
            sender: currentUser.wallet || currentUser.name,
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

function initLegalModals() {
    var modal = document.getElementById('legalModal'), content = document.getElementById('modalContent'), close = document.querySelector('#legalModal .modal-close');
    function show(c) { content.innerHTML = c; modal.classList.add('show'); }
    if (close) close.onclick = function() { modal.classList.remove('show'); };
    window.onclick = function(e) { if (e.target === modal) modal.classList.remove('show'); };
}

// ============================================================
// ===== HERO SLIDER - CORRIGÉ AVEC AUTO-PLAY =====
// ============================================================

function initHeroSlider() {
    var slidesContainer = document.getElementById('heroSlides');
    if (!slidesContainer) {
        console.warn('Hero slides container not found');
        return;
    }
    
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
        slidesContainer.style.transition = 'transform 0.7s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
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
        }, 750);
    }

    function nextSlide() {
        if (totalSlides > 0) goToSlide(currentIndex + 1);
    }

    function prevSlide() {
        if (totalSlides > 0) goToSlide(currentIndex - 1);
    }

    function startAutoPlay() {
        stopAutoPlay();
        if (totalSlides > 1) {
            autoPlayInterval = setInterval(function() {
                if (!isTransitioning) {
                    nextSlide();
                }
            }, 4000);
            console.log('Carousel auto-play started');
        }
    }

    function stopAutoPlay() {
        if (autoPlayInterval) {
            clearInterval(autoPlayInterval);
            autoPlayInterval = null;
            console.log('Carousel auto-play stopped');
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
    console.log('Hero slider initialized with ' + totalSlides + ' slides');
}

// ============================================================
// ===== FILTER BY COUNTRY =====
// ============================================================

function filterByCountry(country) {
    currentCountryFilter = country;
    renderEventsByCategory();
}

// ============================================================
// ===== LOGO MANAGEMENT =====
// ============================================================

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
// ===== UPDATE USER INFO =====
// ============================================================

function updateUserInfo() {
    var nameEl = document.getElementById('sidebarName');
    var walletEl = document.getElementById('sidebarWallet');
    var avatarText = document.getElementById('sidebarAvatarText');
    var profileName = document.getElementById('profileNameDisplay');
    var profileWallet = document.getElementById('profileWalletDisplay');
    var memberSince = document.getElementById('memberSince');
    
    if (nameEl) nameEl.textContent = currentUser.name || 'Guest';
    if (walletEl) walletEl.textContent = currentUser.wallet ? 'Wallet: ' + currentUser.wallet : 'Not connected';
    if (avatarText) avatarText.textContent = (currentUser.name || 'U')[0].toUpperCase();
    if (profileName) profileName.textContent = currentUser.name || 'Guest';
    if (profileWallet) profileWallet.textContent = currentUser.wallet || 'Not connected';
    if (memberSince) memberSince.textContent = currentUser.memberSince || '2026';
    
    updateConnectButtons();
    updateSidebarNotifBadge();
}

function updateProfilePage() {
    var myEventsCount = document.getElementById('myEventsCount');
    var ticketCount = document.getElementById('ticketCount');
    var historyCount = document.getElementById('historyCount');
    var ratedCount = document.getElementById('ratedCount');
    var ratingDisplay = document.getElementById('profileRatingDisplay');
    var loyaltyDisplay = document.getElementById('profileLoyaltyDisplay');
    var profileName = document.getElementById('profileNameDisplay');
    var profileWallet = document.getElementById('profileWalletDisplay');
    var memberSince = document.getElementById('memberSince');
    var avatarPlaceholder = document.getElementById('profilePageAvatarPlaceholder');
    
    var myEvents = events.filter(function(e) { return e.organizer === currentUser.wallet || e.organizerName === currentUser.name; });
    var userTickets = tickets.filter(function(t) { return t.userWallet === currentUser.wallet || t.buyerWallet === currentUser.wallet; });
    var userRatings = ratings.filter(function(r) { return r.userWallet === currentUser.wallet || r.userWallet === currentUser.name; });
    
    if (myEventsCount) myEventsCount.textContent = myEvents.length;
    if (ticketCount) ticketCount.textContent = userTickets.length;
    if (historyCount) historyCount.textContent = tickets.filter(function(t) { 
        var isUsed = usedTickets.indexOf(t.id) !== -1 || t.status === 'Used';
        return isUsed;
    }).length;
    if (ratedCount) ratedCount.textContent = userRatings.length;
    if (ratingDisplay) ratingDisplay.textContent = userRatings.length;
    if (loyaltyDisplay) loyaltyDisplay.textContent = currentUser.loyaltyPoints || 0;
    if (profileName) profileName.textContent = currentUser.name || 'Guest';
    if (profileWallet) profileWallet.textContent = currentUser.wallet || 'Not connected';
    if (memberSince) memberSince.textContent = currentUser.memberSince || '2026';
    
    if (avatarPlaceholder) {
        var initial = (currentUser.name || 'G')[0].toUpperCase();
        avatarPlaceholder.innerHTML = '<span style="font-size: 2.8rem; font-weight: 600;">' + initial + '</span>';
    }
}

// ============================================================
// ===== DOM CONTENT LOADED =====
// ============================================================

document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM Content Loaded - Starting application...');
    
    try {
        var loader = document.getElementById('loader');
        var main = document.getElementById('main-content');
        
        if (loader && main) {
            console.log('Loader and main content found');
            setTimeout(function() {
                loader.style.opacity = '0';
                setTimeout(function() {
                    loader.style.display = 'none';
                    main.style.display = 'block';
                    console.log('Application loaded successfully');
                }, 500);
            }, 800);
        } else {
            console.warn('Loader or main content not found');
        }
        
        detectLanguage();
        loadUsedTickets();
        
        if (!events || events.length === 0) { 
            events = []; 
            saveEvents(); 
        }
        
        initCountrySelectors();
        calculateLoyaltyPoints();
        initFilters(); 
        renderEventsByCategory(); 
        updateUserInfo(); 
        updateProfilePage(); 
        updateNotifBadgeHeader();
        initAdmin(); 
        initChat(); 
        initLegalModals();
        
        var dark = document.getElementById('darkModeToggle');
        if (localStorage.getItem('darkMode') === 'true') { 
            if (dark) dark.checked = true; 
            document.body.classList.add('dark-mode'); 
        }
        if (dark) dark.addEventListener('change', toggleDarkMode);
        
        initHeroSlider();
        initFaq();
        renderAdminLogs();
        setupTicketTypesUI();
        
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
        
        // ===== CORRECTION MENU - 3 MÉCANISMES ROBUSTES =====
        var menuBtn = document.getElementById('menuBtn');
        var headerRight = document.getElementById('headerRight');
        
        if (menuBtn) {
            console.log('Menu button found, adding click listeners');
            
            menuBtn.style.cssText += 'display: flex !important; align-items: center !important; justify-content: center !important; z-index: 99999 !important; position: relative !important; pointer-events: auto !important; cursor: pointer !important; opacity: 1 !important; visibility: visible !important; width: 50px !important; height: 50px !important; min-width: 50px !important; min-height: 50px !important; border-radius: 12px !important; background: rgba(255,255,255,0.25) !important; border: 2px solid rgba(255,255,255,0.15) !important; font-size: 1.5rem !important; color: white !important;';
            
            menuBtn.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                e.stopImmediatePropagation();
                console.log('🍔 Menu button clicked (direct)');
                openSidebar();
                return false;
            });
            
            if (headerRight) {
                headerRight.addEventListener('click', function(e) {
                    var target = e.target;
                    var btn = target.closest('#menuBtn');
                    if (btn) {
                        e.preventDefault();
                        e.stopPropagation();
                        console.log('🍔 Menu button clicked via header-right delegation');
                        openSidebar();
                    }
                });
            }
            
            document.addEventListener('click', function(e) {
                var target = e.target;
                var btn = target.closest('#menuBtn');
                if (btn) {
                    e.preventDefault();
                    e.stopPropagation();
                    console.log('🍔 Menu button clicked via document delegation');
                    openSidebar();
                }
            });
            
            menuBtn.addEventListener('mouseenter', function() {
                this.style.background = 'rgba(255,255,255,0.4)';
                this.style.transform = 'scale(1.05)';
            });
            menuBtn.addEventListener('mouseleave', function() {
                this.style.background = 'rgba(255,255,255,0.25)';
                this.style.transform = 'scale(1)';
            });
            
            menuBtn.style.pointerEvents = 'auto';
            menuBtn.style.cursor = 'pointer';
        } else {
            console.error('Menu button not found in DOM');
        }
        
        // ===== CORRECTION BOUTON RETOUR =====
        var backBtn = document.getElementById('backBtn');
        if (backBtn) {
            console.log('Back button found, adding click listener');
            
            backBtn.style.cssText += 'display: flex !important; align-items: center !important; justify-content: center !important; z-index: 99999 !important; position: relative !important; pointer-events: auto !important; cursor: pointer !important; opacity: 1 !important; visibility: visible !important;';
            
            backBtn.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                console.log('⬅️ Back button clicked');
                goBack();
                return false;
            });
            
            backBtn.style.pointerEvents = 'auto';
            backBtn.style.cursor = 'pointer';
        }
        
        // ===== FERMETURE SIDEBAR =====
        var closeSidebarBtn = document.getElementById('closeSidebarBtn');
        if (closeSidebarBtn) {
            closeSidebarBtn.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                console.log('📂 Close sidebar clicked');
                closeSidebar();
            });
        }
        
        var overlay = document.getElementById('overlay');
        if (overlay) {
            overlay.addEventListener('click', function(e) {
                console.log('📂 Overlay clicked, closing sidebar');
                closeSidebar();
            });
        }
        
        var eventForm = document.getElementById('eventForm');
        var searchInput = document.getElementById('searchInput');
        var clearDataBtn = document.getElementById('clearDataBtn');
        
        updateConnectButtons();
        
        var confirmPublishBtn = document.getElementById('confirmPublishBtn');
        if (confirmPublishBtn) {
            confirmPublishBtn.addEventListener('click', confirmPublishEvent);
        }
        
        var confirmBuyBtn = document.getElementById('confirmBuyBtn');
        if (confirmBuyBtn) {
            confirmBuyBtn.addEventListener('click', confirmPurchaseFromPopup);
        }
        
        var ticketTypeSelect = document.getElementById('ticketTypeSelect');
        if (ticketTypeSelect) {
            ticketTypeSelect.addEventListener('change', updateTicketTotal);
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
        
        if (eventForm) eventForm.addEventListener('submit', createEvent);
        if (searchInput) searchInput.addEventListener('input', function(e) { 
            searchQuery = e.target.value.toLowerCase(); 
            renderEventsByCategory(); 
        });
        if (clearDataBtn) clearDataBtn.addEventListener('click', clearAllData);
        
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
        
        bindActivityListeners(); 
        startSessionMonitor();

        loadAllFromSupabase();

        setInterval(function() {
            syncUserToSupabase();
            syncEventsToSupabase();
            syncTicketsToSupabase();
            syncNotificationsToSupabase();
        }, 30000);

        window.addEventListener('beforeunload', function() {
            syncUserToSupabase();
            syncEventsToSupabase();
            syncTicketsToSupabase();
            syncNotificationsToSupabase();
        });
        
        if (currentUser.wallet && isSessionExpired()) { disconnectPi(); }
        
        console.log('Betix loaded successfully!');
        console.log('Supabase connected');
        console.log('Admin: 5 clicks on logo + password Betix@2026#');
        console.log('✅ Menu button fix applied with 3 mechanisms');
        console.log('✅ Back button fix applied');
        console.log('✅ Hero slider auto-play enabled');
        console.log('✅ Ticket download feature added');
        console.log('✅ VIP tickets now appear in My Tickets');
        console.log('✅ Data persistence improved with Supabase');
        console.log('✅ Profile page improved with professional design');
        console.log('✅ My Events page improved with professional design');
        console.log('✅ Tickets stay in My Tickets until manually used');
        
    } catch (error) {
        console.error('Error during application startup:', error);
        var loader = document.getElementById('loader');
        var main = document.getElementById('main-content');
        if (loader && main) {
            loader.style.display = 'none';
            main.style.display = 'block';
        }
    }
});

// ============================================================
// ===== FONCTIONS DE SECOURS POUR DEBUG =====
// ============================================================

window.debugMenu = function() {
    console.log('🔍 Debug menu:');
    var btn = document.getElementById('menuBtn');
    console.log('  - menuBtn exists:', !!btn);
    if (btn) {
        console.log('  - menuBtn styles:', btn.style.cssText);
        console.log('  - menuBtn computed:', window.getComputedStyle(btn));
        console.log('  - menuBtn pointer-events:', window.getComputedStyle(btn).pointerEvents);
    }
    var sidebar = document.getElementById('sidebar');
    console.log('  - sidebar open:', sidebar ? sidebar.classList.contains('open') : 'not found');
};

window.forceOpenMenu = function() {
    console.log('💪 Force opening menu...');
    var s = document.getElementById('sidebar');
    var o = document.getElementById('overlay');
    if (s) {
        s.classList.add('open');
        document.body.style.overflow = 'hidden';
    }
    if (o) {
        o.classList.add('active');
    }
};

window.forceCloseMenu = function() {
    console.log('💪 Force closing menu...');
    var s = document.getElementById('sidebar');
    var o = document.getElementById('overlay');
    if (s) {
        s.classList.remove('open');
        document.body.style.overflow = '';
    }
    if (o) {
        o.classList.remove('active');
    }
};

function testMenuButton() {
    var btn = document.getElementById('menuBtn');
    if (btn) {
        console.log('✅ Menu button found!');
        console.log('📏 Dimensions:', btn.offsetWidth + 'x' + btn.offsetHeight);
        console.log('👆 Pointer Events:', window.getComputedStyle(btn).pointerEvents);
        console.log('📐 Z-index:', window.getComputedStyle(btn).zIndex);
        console.log('🔍 Position:', window.getComputedStyle(btn).position);
        console.log('👀 Visibility:', window.getComputedStyle(btn).visibility);
        console.log('📦 Display:', window.getComputedStyle(btn).display);
        
        var rect = btn.getBoundingClientRect();
        console.log('📍 Position du bouton:', rect);
        console.log('📐 Centre du bouton:', (rect.left + rect.width/2) + 'x' + (rect.top + rect.height/2));
        
        return 'Menu button is present and visible';
    } else {
        console.error('❌ Menu button NOT found!');
        return 'Menu button NOT found!';
    }
}

setTimeout(function() {
    testMenuButton();
}, 2000);