// ============================================================
// ===== SUPABASE CONFIGURATION =====
// ============================================================

const SUPABASE_URL = "https://tycebwzgsujiazgopkri.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR5Y2Vid3pnc3VqaWF6Z29wa3JpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODIzODg2NTMsImV4cCI6MjA5Nzk2NDY1M30.7x1rouTbMJE2WcY008vRnqGuAWq3yM_eZCS4Q8_3TrQ";

const supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false },
    db: { schema: 'public' }
});

console.log("Supabase initialized");

// ============================================================
// ===== COMPRESSION D'IMAGES =====
// ============================================================

function compressImage(file, options = {}) {
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
            reader.onload = e => resolve(e.target.result);
            reader.onerror = () => reject(new Error('Erreur de lecture du fichier'));
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
                    compressedDataUrl = canvas.toDataURL(format, Math.max(0.3, config.quality - 0.2));
                }
                resolve(compressedDataUrl);
            };
            img.onerror = () => reject(new Error('Erreur de chargement de l\'image'));
            img.src = event.target.result;
        };
        reader.onerror = () => reject(new Error('Erreur de lecture du fichier'));
        reader.readAsDataURL(file);
    });
}

async function compressProfilePhoto(file) {
    return await compressImage(file, { maxWidth: 300, maxHeight: 300, quality: 0.6, format: 'image/webp', maxSizeMB: 0.5 });
}

async function compressEventImage(file) {
    return await compressImage(file, { maxWidth: 1200, maxHeight: 800, quality: 0.7, format: 'image/webp', maxSizeMB: 1.5 });
}

// ============================================================
// ===== SUPABASE STORAGE =====
// ============================================================

async function uploadToSupabaseStorage(bucket, filePath, base64Data) {
    try {
        const response = await fetch(base64Data);
        const blob = await response.blob();
        const { error } = await supabaseClient.storage.from(bucket).upload(filePath, blob, {
            contentType: blob.type,
            cacheControl: '3600',
            upsert: true
        });
        if (error) throw error;
        return supabaseClient.storage.from(bucket).getPublicUrl(filePath).publicUrl;
    } catch (error) {
        console.error('Error uploading to Supabase storage:', error);
        return null;
    }
}

async function uploadProfilePhoto(piUid, base64Data) {
    return await uploadToSupabaseStorage('avatars', `${piUid}/avatar_${Date.now()}.webp`, base64Data);
}

async function uploadEventImage(eventId, base64Data, index) {
    return await uploadToSupabaseStorage('events-images', `${eventId}/image_${index}_${Date.now()}.webp`, base64Data);
}

// ============================================================
// ===== SUPABASE TABLE FUNCTIONS =====
// ============================================================

async function saveUserToSupabase(piUid, username, wallet, avatarUrl = null, points = 0) {
    try {
        const now = new Date().toISOString();
        const userData = { pi_uid: piUid, username, wallet, avatar_url: avatarUrl, points, updated_at: now };
        const { data: existing } = await supabaseClient.from('users').select('pi_uid').eq('pi_uid', piUid).single();
        if (existing) {
            await supabaseClient.from('users').update(userData).eq('pi_uid', piUid);
        } else {
            userData.created_at = now;
            await supabaseClient.from('users').insert(userData);
        }
        console.log('User saved to Supabase:', piUid);
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
            organizer_pi_uid: eventData.organizerPiUid || eventData.organizer,
            title: eventData.title,
            description: eventData.description || '',
            image_url: eventData.coverImage || (eventData.images?.[0]) || '',
            location: eventData.location || '',
            event_date: eventData.date,
            category: eventData.category || '',
            ticket_price: eventData.price || 0,
            max_tickets: eventData.seatsTotal || 0,
            created_at: eventData.createdAt || new Date().toISOString(),
            duration_value: eventData.durationValue || null,
            duration_unit: eventData.durationUnit || null
        };
        await supabaseClient.from('events').upsert(dbEvent, { onConflict: 'id' });
        console.log('Event saved to Supabase:', eventData.id);
        return true;
    } catch (error) {
        console.error('Error saving event to Supabase:', error);
        return false;
    }
}

async function loadEventsFromSupabase() {
    try {
        const { data, error } = await supabaseClient.from('events').select('*').order('event_date', { ascending: true });
        if (error) throw error;
        return data || [];
    } catch (error) {
        console.error('Error loading events from Supabase:', error);
        return [];
    }
}

async function updateEventInSupabase(eventId, updates) {
    try {
        await supabaseClient.from('events').update(updates).eq('id', eventId);
        console.log('Event updated in Supabase:', eventId);
        return true;
    } catch (error) {
        console.error('Error updating event in Supabase:', error);
        return false;
    }
}

async function deleteEventFromSupabase(eventId) {
    try {
        await supabaseClient.from('events').delete().eq('id', eventId);
        console.log('Event deleted from Supabase:', eventId);
        return true;
    } catch (error) {
        console.error('Error deleting event from Supabase:', error);
        return false;
    }
}

// ============================================================
// ===== TICKET FUNCTIONS (CORRIGÉES) =====
// ============================================================

async function saveTicketToSupabase(ticketData) {
    try {
        const dbTicket = {
            id: ticketData.id,
            event_id: ticketData.eventId,
            event_title: ticketData.eventTitle || 'Event',
            event_location: ticketData.eventLocation || '',
            price: ticketData.price || 0,
            buyer_pi_uid: ticketData.buyerWallet || ticketData.userWallet,
            buyer_name: ticketData.buyerName || ticketData.buyerWallet || 'Anonymous',
            qr_code: ticketData.qrCode || '',
            status: 'Valid',
            purchase_date: ticketData.purchaseDate || new Date().toISOString(),
            expiration_date: ticketData.eventDate || new Date().toISOString(),
            transaction_id: ticketData.transactionId || '',
            category: ticketData.category || ''
        };
        await supabaseClient.from('tickets').upsert(dbTicket, { onConflict: 'id' });
        console.log('Ticket saved to Supabase:', ticketData.id);
        return true;
    } catch (error) {
        console.error('Error saving ticket to Supabase:', error);
        return false;
    }
}

async function loadTicketsFromSupabase(piUid) {
    try {
        const { data, error } = await supabaseClient.from('tickets').select('*').eq('buyer_pi_uid', piUid).order('purchase_date', { ascending: false });
        if (error) throw error;
        console.log('Tickets loaded from Supabase:', data?.length || 0);
        return data || [];
    } catch (error) {
        console.error('Error loading tickets from Supabase:', error);
        return [];
    }
}

async function saveTransactionToSupabase(transactionData) {
    try {
        await supabaseClient.from('transactions').insert({
            id: transactionData.id || Date.now().toString(),
            buyer_pi_uid: transactionData.buyerWallet || transactionData.buyerPiUid,
            event_id: transactionData.eventId,
            amount: transactionData.amount || 0,
            currency: 'Pi',
            payment_id: transactionData.txid || transactionData.paymentId || '',
            status: 'completed',
            created_at: transactionData.date || new Date().toISOString()
        });
        console.log('Transaction saved to Supabase');
        return true;
    } catch (error) {
        console.error('Error saving transaction to Supabase:', error);
        return false;
    }
}

async function saveNotificationToSupabase(notificationData) {
    try {
        await supabaseClient.from('notifications').insert({
            id: notificationData.id || Date.now().toString(),
            receiver_pi_uid: notificationData.receiverPiUid || notificationData.userWallet,
            title: notificationData.title || 'Notification',
            message: notificationData.message || '',
            is_read: notificationData.read || false,
            created_at: notificationData.date || new Date().toISOString()
        });
        console.log('Notification saved to Supabase');
        return true;
    } catch (error) {
        console.error('Error saving notification to Supabase:', error);
        return false;
    }
}

async function loadNotificationsFromSupabase(piUid) {
    try {
        const { data, error } = await supabaseClient.from('notifications').select('*').eq('receiver_pi_uid', piUid).order('created_at', { ascending: false });
        if (error) throw error;
        return data || [];
    } catch (error) {
        console.error('Error loading notifications from Supabase:', error);
        return [];
    }
}

// ============================================================
// ===== COUNTRY LIST =====
// ============================================================

var countriesList = [
    { name: 'All', flag: '🌍' },
    { name: 'France', flag: '🇫🇷' }, { name: 'RDC', flag: '🇨🇩' }, { name: 'Congo', flag: '🇨🇬' },
    { name: 'Belgium', flag: '🇧🇪' }, { name: 'Switzerland', flag: '🇨🇭' }, { name: 'Canada', flag: '🇨🇦' },
    { name: 'Senegal', flag: '🇸🇳' }, { name: 'Cameroon', flag: '🇨🇲' }, { name: 'Cote d\'Ivoire', flag: '🇨🇮' },
    { name: 'Mali', flag: '🇲🇱' }, { name: 'Niger', flag: '🇳🇪' }, { name: 'Nigeria', flag: '🇳🇬' },
    { name: 'South Africa', flag: '🇿🇦' }, { name: 'Angola', flag: '🇦🇴' }, { name: 'Mozambique', flag: '🇲🇿' },
    { name: 'Kenya', flag: '🇰🇪' }, { name: 'Tanzania', flag: '🇹🇿' }, { name: 'Uganda', flag: '🇺🇬' },
    { name: 'Rwanda', flag: '🇷🇼' }, { name: 'Burundi', flag: '🇧🇮' }, { name: 'Ethiopia', flag: '🇪🇹' },
    { name: 'Somalia', flag: '🇸🇴' }, { name: 'Djibouti', flag: '🇩🇯' }, { name: 'Eritrea', flag: '🇪🇷' },
    { name: 'Sudan', flag: '🇸🇩' }, { name: 'South Sudan', flag: '🇸🇸' }, { name: 'Egypt', flag: '🇪🇬' },
    { name: 'Libya', flag: '🇱🇾' }, { name: 'Tunisia', flag: '🇹🇳' }, { name: 'Algeria', flag: '🇩🇿' },
    { name: 'Morocco', flag: '🇲🇦' }, { name: 'Mauritania', flag: '🇲🇷' }, { name: 'Ghana', flag: '🇬🇭' },
    { name: 'Guinea', flag: '🇬🇳' }, { name: 'Burkina Faso', flag: '🇧🇫' }, { name: 'Benin', flag: '🇧🇯' },
    { name: 'Togo', flag: '🇹🇬' }, { name: 'Liberia', flag: '🇱🇷' }, { name: 'Sierra Leone', flag: '🇸🇱' },
    { name: 'Gambia', flag: '🇬🇲' }, { name: 'Guinea-Bissau', flag: '🇬🇼' }, { name: 'Cape Verde', flag: '🇨🇻' },
    { name: 'Sao Tome', flag: '🇸🇹' }, { name: 'Gabon', flag: '🇬🇦' }, { name: 'Equatorial Guinea', flag: '🇬🇶' },
    { name: 'Central African Republic', flag: '🇨🇫' }, { name: 'Chad', flag: '🇹🇩' }, { name: 'Madagascar', flag: '🇲🇬' },
    { name: 'Comoros', flag: '🇰🇲' }, { name: 'Mauritius', flag: '🇲🇺' }, { name: 'Seychelles', flag: '🇸🇨' },
    { name: 'Zambia', flag: '🇿🇲' }, { name: 'Zimbabwe', flag: '🇿🇼' }, { name: 'Botswana', flag: '🇧🇼' },
    { name: 'Namibia', flag: '🇳🇦' }, { name: 'Lesotho', flag: '🇱🇸' }, { name: 'Eswatini', flag: '🇸🇿' },
    { name: 'Malawi', flag: '🇲🇼' }, { name: 'Spain', flag: '🇪🇸' }, { name: 'Portugal', flag: '🇵🇹' },
    { name: 'Germany', flag: '🇩🇪' }, { name: 'Italy', flag: '🇮🇹' }, { name: 'United Kingdom', flag: '🇬🇧' },
    { name: 'United States', flag: '🇺🇸' }, { name: 'Russia', flag: '🇷🇺' }, { name: 'Ukraine', flag: '🇺🇦' },
    { name: 'Turkey', flag: '🇹🇷' }, { name: 'Iran', flag: '🇮🇷' }, { name: 'China', flag: '🇨🇳' },
    { name: 'Japan', flag: '🇯🇵' }, { name: 'India', flag: '🇮🇳' }, { name: 'Indonesia', flag: '🇮🇩' },
    { name: 'Australia', flag: '🇦🇺' }, { name: 'Mexico', flag: '🇲🇽' }, { name: 'Argentina', flag: '🇦🇷' },
    { name: 'Brazil', flag: '🇧🇷' }, { name: 'Denmark', flag: '🇩🇰' }, { name: 'Sweden', flag: '🇸🇪' },
    { name: 'Austria', flag: '🇦🇹' }
];

// ============================================================
// ===== GLOBAL VARIABLES =====
// ============================================================

var events = [];
var tickets = [];
var currentUser = { name: 'Guest', wallet: null, piUid: null, memberSince: '2026', loyaltyPoints: 0, profilePhoto: null };
var currentFilter = 'All';
var currentCountryFilter = 'All';
var searchQuery = '';
var piUser = null;
var ratings = [];
var chatMessages = [];
var connectedUsers = [];
var notifications = [];
var selectedRating = 0;
var lastActivity = localStorage.getItem('betix_last_activity') || Date.now();
var pageHistory = ['home'];
var logoClickCount = 0;
var uploadedImages = {};
var pendingEventData = null;
var adminPassword = localStorage.getItem('betix_admin_password') || 'Betix@2026#';
var adminLogs = [];
var isSyncing = false;

var BACKEND_URL = "https://betix-backend.onrender.com";

// ============================================================
// ===== HERO SLIDES =====
// ============================================================

var heroSlides = JSON.parse(localStorage.getItem('betix_hero_slides')) || [];

if (heroSlides.length === 0) {
    heroSlides = [
        { image: 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=1200&h=600&fit=crop', badge: 'Music Festival', title: 'Summer Music Festival 2026', description: '3 days of electrifying performances by top artists' },
        { image: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=1200&h=600&fit=crop', badge: 'Football', title: 'Champions League Final', description: 'The biggest football event of the year live' },
        { image: 'https://images.unsplash.com/photo-1505373877841-8d25f7d46678?w=1200&h=600&fit=crop', badge: 'Conference', title: 'Web3 Summit 2026', description: 'The future of decentralized technology unveiled' },
        { image: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=1200&h=600&fit=crop', badge: 'Cinema', title: 'International Film Festival', description: 'Premieres and exclusive screenings' },
        { image: 'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=1200&h=600&fit=crop', badge: 'Concert', title: 'World Tour Concert', description: 'An unforgettable night with global superstars' }
    ];
    localStorage.setItem('betix_hero_slides', JSON.stringify(heroSlides));
}

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

// ============================================================
// ===== DEMO EVENTS (organizerName: 'Betix') =====
// ============================================================

var demoEvents = [
    { id: '1', title: 'Jazz Concert', category: 'Concert', country: 'France', date: '2026-07-15T20:00', location: 'Paris, Olympia', description: 'An exceptional jazz evening with international artists', conditions: 'Active Pi Network wallet\nPayment in Pi (indicated amount)\nPresent ticket at entrance\nRespect event rules', price: 0.0003, seatsTotal: 100, seatsLeft: 100, images: [eventImagesList.Concert], coverImage: eventImagesList.Concert, organizer: 'Betix', organizerName: 'Betix', createdAt: new Date().toISOString(), boosts: 0 },
    { id: '2', title: 'Football Match', category: 'Sport', country: 'France', date: '2026-07-20T18:00', location: 'Marseille', description: 'Friendly match between local teams', conditions: 'Active Pi Network wallet\nPayment in Pi (indicated amount)\nPresent ticket at entrance', price: 0.0003, seatsTotal: 500, seatsLeft: 500, images: [eventImagesList.Football], coverImage: eventImagesList.Football, organizer: 'Betix', organizerName: 'Betix', createdAt: new Date().toISOString(), boosts: 0 },
    { id: '3', title: 'Blockchain Conference', category: 'Conference', country: 'France', date: '2026-07-25T14:00', location: 'Lyon', description: 'Discover the future of blockchain and Web3', conditions: 'Active Pi Network wallet\nPayment in Pi (indicated amount)\nRegistration required', price: 0.0003, seatsTotal: 200, seatsLeft: 200, images: [eventImagesList.Conference], coverImage: eventImagesList.Conference, organizer: 'Betix', organizerName: 'Betix', createdAt: new Date().toISOString(), boosts: 0 },
    { id: '4', title: 'Crypto Training', category: 'Training', country: 'France', date: '2026-08-01T09:00', location: 'Online', description: 'Learn to trade and invest in cryptocurrencies', conditions: 'Active Pi Network wallet\nPayment in Pi (indicated amount)', price: 0.0003, seatsTotal: 50, seatsLeft: 50, images: [eventImagesList.Training], coverImage: eventImagesList.Training, organizer: 'Betix', organizerName: 'Betix', createdAt: new Date().toISOString(), boosts: 0 },
    { id: '5', title: 'Movie Premiere', category: 'Cinema', country: 'France', date: '2026-08-05T19:00', location: 'Paris', description: 'Exclusive film premiere', conditions: 'Active Pi Network wallet\nPayment in Pi (indicated amount)\nPresent ticket at entrance', price: 0.0003, seatsTotal: 300, seatsLeft: 300, images: [eventImagesList.Cinema], coverImage: eventImagesList.Cinema, organizer: 'Betix', organizerName: 'Betix', createdAt: new Date().toISOString(), boosts: 0 },
    { id: '6', title: 'Music Festival', category: 'Festival', country: 'France', date: '2026-08-10T12:00', location: 'Nice', description: '3 days of festivities with over 20 artists', conditions: 'Active Pi Network wallet\nPayment in Pi (indicated amount)\nPresent ticket at entrance', price: 0.0003, seatsTotal: 1000, seatsLeft: 1000, images: [eventImagesList.Festival], coverImage: eventImagesList.Festival, organizer: 'Betix', organizerName: 'Betix', createdAt: new Date().toISOString(), boosts: 0 },
    { id: '7', title: 'Theatre Play', category: 'Theatre', country: 'France', date: '2026-07-18T19:30', location: 'Paris, Theatre National', description: 'A captivating play about love and redemption', conditions: 'Active Pi Network wallet\nPayment in Pi (indicated amount)', price: 0.0002, seatsTotal: 200, seatsLeft: 200, images: [eventImagesList.Theatre], coverImage: eventImagesList.Theatre, organizer: 'Betix', organizerName: 'Betix', createdAt: new Date().toISOString(), boosts: 0 },
    { id: '8', title: 'Dance Show', category: 'Dance', country: 'France', date: '2026-07-22T20:00', location: 'Lyon, Opera', description: 'A breathtaking contemporary dance show', conditions: 'Active Pi Network wallet\nPayment in Pi (indicated amount)', price: 0.00025, seatsTotal: 150, seatsLeft: 150, images: [eventImagesList.Dance], coverImage: eventImagesList.Dance, organizer: 'Betix', organizerName: 'Betix', createdAt: new Date().toISOString(), boosts: 0 },
    { id: '9', title: 'Modern Art Exhibition', category: 'Exhibition', country: 'France', date: '2026-07-28T10:00', location: 'Paris, Centre Pompidou', description: 'Discover works by the greatest modern artists', conditions: 'Active Pi Network wallet\nPayment in Pi (indicated amount)', price: 0.00015, seatsTotal: 100, seatsLeft: 100, images: [eventImagesList.Exhibition], coverImage: eventImagesList.Exhibition, organizer: 'Betix', organizerName: 'Betix', createdAt: new Date().toISOString(), boosts: 0 },
    { id: '10', title: 'Charity Gala', category: 'Gala', country: 'France', date: '2026-08-02T19:00', location: 'Paris, Palais des Congres', description: 'An elegant gala evening supporting charitable causes', conditions: 'Active Pi Network wallet\nPayment in Pi (indicated amount)\nFormal attire required', price: 0.0005, seatsTotal: 300, seatsLeft: 300, images: [eventImagesList.Gala], coverImage: eventImagesList.Gala, organizer: 'Betix', organizerName: 'Betix', createdAt: new Date().toISOString(), boosts: 0 },
    { id: '11', title: 'Innovation Seminar', category: 'Seminar', country: 'France', date: '2026-08-08T09:00', location: 'Paris, La Defense', description: 'Seminar on innovation and new technologies', conditions: 'Active Pi Network wallet\nPayment in Pi (indicated amount)\nRegistration required', price: 0.00035, seatsTotal: 80, seatsLeft: 80, images: [eventImagesList.Seminar], coverImage: eventImagesList.Seminar, organizer: 'Betix', organizerName: 'Betix', createdAt: new Date().toISOString(), boosts: 0 },
    { id: '12', title: 'Football Derby', category: 'Sport', country: 'RDC', date: '2026-07-19T19:00', location: 'Kinshasa, Stade des Martyrs', description: 'A massive football derby between rival teams', conditions: 'Active Pi Network wallet\nPayment in Pi (indicated amount)', price: 0.0004, seatsTotal: 2000, seatsLeft: 2000, images: [eventImagesList.Football], coverImage: eventImagesList.Football, organizer: 'Betix', organizerName: 'Betix', createdAt: new Date().toISOString(), boosts: 0 },
    { id: '13', title: 'Basketball Match', category: 'Sport', country: 'RDC', date: '2026-07-25T16:00', location: 'Kinshasa, Gymnasium', description: 'Basketball match between local teams', conditions: 'Active Pi Network wallet\nPayment in Pi (indicated amount)', price: 0.0002, seatsTotal: 500, seatsLeft: 500, images: [eventImagesList.Sport], coverImage: eventImagesList.Sport, organizer: 'Betix', organizerName: 'Betix', createdAt: new Date().toISOString(), boosts: 0 },
    { id: '14', title: 'Rumba Festival', category: 'Festival', country: 'RDC', date: '2026-08-01T14:00', location: 'Kinshasa, Place du 30 Juin', description: 'Celebrating Congolese Rumba with international artists', conditions: 'Active Pi Network wallet\nPayment in Pi (indicated amount)', price: 0.0003, seatsTotal: 3000, seatsLeft: 3000, images: [eventImagesList.Festival], coverImage: eventImagesList.Festival, organizer: 'Betix', organizerName: 'Betix', createdAt: new Date().toISOString(), boosts: 0 },
    { id: '15', title: 'Tech Africa Conference', category: 'Conference', country: 'RDC', date: '2026-08-05T09:00', location: 'Kinshasa, Cite de l\'UA', description: 'Conference on new technologies in Africa', conditions: 'Active Pi Network wallet\nPayment in Pi (indicated amount)\nRegistration required', price: 0.00025, seatsTotal: 300, seatsLeft: 300, images: [eventImagesList.Conference], coverImage: eventImagesList.Conference, organizer: 'Betix', organizerName: 'Betix', createdAt: new Date().toISOString(), boosts: 0 },
    { id: '16', title: 'African Art Exhibition', category: 'Exhibition', country: 'RDC', date: '2026-08-10T10:00', location: 'Kinshasa, Musee National', description: 'Exhibition dedicated to modern and traditional African art', conditions: 'Active Pi Network wallet\nPayment in Pi (indicated amount)', price: 0.00015, seatsTotal: 150, seatsLeft: 150, images: [eventImagesList.Exhibition], coverImage: eventImagesList.Exhibition, organizer: 'Betix', organizerName: 'Betix', createdAt: new Date().toISOString(), boosts: 0 }
];

function escapeHtml(str) { if (!str) return ''; return str.replace(/[&<>]/g, m => m === '&' ? '&amp;' : m === '<' ? '&lt;' : m === '>' ? '&gt;' : m); }
function formatDate(dateStr) { var date = new Date(dateStr); return !isNaN(date.getTime()) ? date.toLocaleDateString('en-US') : 'Date to be defined'; }
function formatDateTime(dateStr) { var date = new Date(dateStr); return !isNaN(date.getTime()) ? date.toLocaleString('en-US') : 'Unknown date'; }

// ============================================================
// ===== SAVE / LOAD LOCAL =====
// ============================================================

function saveEvents() { localStorage.setItem('betix_events', JSON.stringify(events)); }
function saveTickets() { localStorage.setItem('betix_tickets', JSON.stringify(tickets)); }
function saveUser() { localStorage.setItem('betix_user', JSON.stringify(currentUser)); }
function saveNotifications() { localStorage.setItem('betix_notifications', JSON.stringify(notifications)); }
function saveChatMessages() { localStorage.setItem('betix_chat_messages', JSON.stringify(chatMessages)); }
function saveRatings() { localStorage.setItem('betix_ratings', JSON.stringify(ratings)); }
function saveConnectedUsers() { localStorage.setItem('betix_connected_users', JSON.stringify(connectedUsers)); }

// ============================================================
// ===== SYNC FUNCTIONS =====
// ============================================================

async function syncUserToSupabase() {
    if (!currentUser.piUid && !currentUser.wallet) return;
    await saveUserToSupabase(currentUser.piUid || currentUser.wallet, currentUser.name || 'User', currentUser.wallet, currentUser.profilePhoto || null, currentUser.loyaltyPoints || 0);
}

async function syncEventsToSupabase() {
    if (isSyncing) return;
    isSyncing = true;
    try {
        for (const event of events) await saveEventToSupabase(event);
        console.log('All events synced to Supabase');
    } catch (error) { console.error('Error syncing events:', error); }
    finally { isSyncing = false; }
}

async function syncTicketsToSupabase() {
    try {
        for (const ticket of tickets) await saveTicketToSupabase(ticket);
        console.log('All tickets synced to Supabase');
    } catch (error) { console.error('Error syncing tickets:', error); }
}

async function syncNotificationsToSupabase() {
    try {
        for (const notif of notifications) {
            await saveNotificationToSupabase({
                ...notif,
                receiverPiUid: notif.userWallet || currentUser.wallet,
                title: notif.type === 'purchase' ? 'Ticket Purchase' : 'Notification'
            });
        }
    } catch (error) { console.error('Error syncing notifications:', error); }
}

// ============================================================
// ===== LOAD ALL FROM SUPABASE =====
// ============================================================

async function loadAllFromSupabase() {
    console.log('Loading data from Supabase...');
    
    try {
        // 1. Load events
        const supabaseEvents = await loadEventsFromSupabase();
        if (supabaseEvents.length > 0) {
            const loadedEvents = supabaseEvents.map(e => ({
                id: e.id, title: e.title, category: e.category || '', country: e.country || 'France',
                date: e.event_date, location: e.location || '', description: e.description || '',
                conditions: e.conditions || 'Active Pi Network wallet\nPayment in Pi (indicated amount)',
                price: e.ticket_price || 0.0003, seatsTotal: e.max_tickets || 100, seatsLeft: e.max_tickets || 100,
                images: e.image_url ? [e.image_url] : [], coverImage: e.image_url || '',
                organizer: e.organizer_pi_uid || '', organizerName: e.organizer_name || '',
                createdAt: e.created_at || new Date().toISOString(), boosts: 0,
                durationValue: e.duration_value || null, durationUnit: e.duration_unit || null
            }));
            const existingIds = new Set(events.map(e => e.id));
            const newEvents = loadedEvents.filter(e => !existingIds.has(e.id));
            if (newEvents.length > 0) { events = events.concat(newEvents); console.log('Added new events:', newEvents.length); }
        } else {
            if (events.length === 0) { events = JSON.parse(JSON.stringify(demoEvents)); saveEvents(); await syncEventsToSupabase(); }
        }
        saveEvents();
        
        // 2. Load tickets (CONSERVE TOUS LES TICKETS LOCAUX)
        if (currentUser.piUid || currentUser.wallet) {
            const piUid = currentUser.piUid || currentUser.wallet;
            const supabaseTickets = await loadTicketsFromSupabase(piUid);
            const existingIds = new Set(tickets.map(t => t.id));
            if (supabaseTickets.length > 0) {
                const loadedTickets = supabaseTickets.map(t => ({
                    id: t.id, eventId: t.event_id, eventTitle: t.event_title || t.event_id || 'Event',
                    eventDate: t.expiration_date || new Date().toISOString(), eventLocation: t.event_location || '',
                    price: t.price || 0, buyerWallet: t.buyer_pi_uid, buyerName: t.buyer_name || t.buyer_pi_uid || 'Anonymous',
                    userWallet: t.buyer_pi_uid, purchaseDate: t.purchase_date || new Date().toISOString(),
                    purchaseDateTime: new Date(t.purchase_date || new Date()).toLocaleString('en-US'),
                    transactionId: t.transaction_id || '', qrCode: t.qr_code || 'BETIX-' + Date.now(),
                    category: t.category || '', status: t.status || 'Valid'
                }));
                const newTickets = loadedTickets.filter(t => !existingIds.has(t.id));
                if (newTickets.length > 0) { tickets = tickets.concat(newTickets); console.log('Added new tickets:', newTickets.length); }
                else { console.log('No new tickets, keeping local tickets:', tickets.length); }
            } else { console.log('No tickets in Supabase, keeping local tickets:', tickets.length); }
            saveTickets();
        }
        
        // 3. Load notifications
        if (currentUser.piUid || currentUser.wallet) {
            const piUid = currentUser.piUid || currentUser.wallet;
            const supabaseNotifs = await loadNotificationsFromSupabase(piUid);
            if (supabaseNotifs.length > 0) {
                const notifIds = new Set(notifications.map(n => n.id));
                const newNotifs = supabaseNotifs.filter(n => !notifIds.has(n.id)).map(n => ({
                    id: n.id, message: n.message || n.title || '', type: n.type || 'info',
                    read: n.is_read || false, date: n.created_at || new Date().toISOString()
                }));
                if (newNotifs.length > 0) { notifications = notifications.concat(newNotifs); }
                saveNotifications();
                updateNotifBadgeHeader();
            }
        }
        
        renderEventsByCategory();
        renderTickets();
        renderHistory();
        updateProfilePage();
        console.log('All data loaded from Supabase - Tickets:', tickets.length);
        
    } catch (error) {
        console.error('Error loading data from Supabase:', error);
    }
}

// ============================================================
// ===== DELETE EVENT =====
// ============================================================

async function deleteEventSafely(eventId) {
    if (!confirm('Delete this event?')) return false;
    try {
        await deleteEventFromSupabase(eventId);
        events = events.filter(e => e.id !== eventId);
        saveEvents();
        tickets = tickets.filter(t => t.eventId !== eventId);
        saveTickets();
        await loadAllFromSupabase();
        renderAdminEvents();
        renderEventsByCategory();
        renderMyEvents();
        document.getElementById('adminEventCount') && (document.getElementById('adminEventCount').innerText = events.length);
        alert('Event deleted successfully!');
        return true;
    } catch (error) {
        console.error('Error deleting event:', error);
        alert('Error deleting event. Please try again.');
        return false;
    }
}

// ============================================================
// ===== LOADER =====
// ============================================================

function showLoader(message) {
    var existing = document.getElementById('betixLoader');
    if (existing) { existing.style.display = 'flex'; var msgEl = document.getElementById('betixLoaderMessage'); if (msgEl && message) msgEl.textContent = message; return; }
    var loaderDiv = document.createElement('div');
    loaderDiv.id = 'betixLoader';
    loaderDiv.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.6);backdrop-filter:blur(4px);display:flex;flex-direction:column;justify-content:center;align-items:center;z-index:99999;transition:opacity 0.3s ease;';
    loaderDiv.innerHTML = '<div style="background:#ffffff;border-radius:20px;padding:40px 50px 35px;text-align:center;box-shadow:0 20px 60px rgba(0,0,0,0.3);max-width:320px;width:90%;animation:popIn 0.3s ease;"><div style="width:60px;height:60px;border:4px solid #e5e7eb;border-top:4px solid #0D47A1;border-radius:50%;animation:spin 0.8s linear infinite;margin:0 auto 16px;"></div><p id="betixLoaderMessage" style="margin:0;font-size:1rem;font-weight:500;color:#1f2937;">' + (message || 'Loading...') + '</p><p style="margin:4px 0 0;font-size:0.75rem;color:#9ca3af;">Please wait</p></div><style>@keyframes spin{0%{transform:rotate(0deg)}100%{transform:rotate(360deg)}}@keyframes popIn{0%{transform:scale(0.8);opacity:0}100%{transform:scale(1);opacity:1}}</style>';
    document.body.appendChild(loaderDiv);
}

function hideLoader() {
    var loader = document.getElementById('betixLoader');
    if (loader) { loader.style.opacity = '0'; setTimeout(() => { if (loader.parentNode) loader.parentNode.removeChild(loader); }, 300); }
}

// ============================================================
// ===== RENDER CHAT =====
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
    for (var m of chatMessages) {
        var d = document.createElement('div');
        d.className = 'chat-message ' + (m.isUser ? 'user' : 'support');
        d.innerHTML = '<div class="message-bubble">' + escapeHtml(m.text) + '</div><span class="message-time">' + m.time + '</span>';
        container.appendChild(d);
    }
    container.scrollTop = container.scrollHeight;
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
    setTimeout(() => location.reload(), 800);
}

function detectLanguage() {
    var savedLang = localStorage.getItem('betix_language') || 'en';
    var urlParams = new URLSearchParams(window.location.search);
    var urlLang = urlParams.get('lang');
    if (urlLang) { localStorage.setItem('betix_language', urlLang); savedLang = urlLang; }
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
        container.innerHTML = '<div class="notification-empty"><i class="fas fa-bell-slash"></i>No notifications</div>';
        return;
    }
    var html = '';
    for (var n of notifications) {
        var time = new Date(n.date);
        var timeStr = time.toLocaleDateString('en-US') + ' ' + time.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
        var icon = n.type === 'purchase' ? 'fa-shopping-cart' : n.type === 'event' ? 'fa-calendar-plus' : 'fa-info-circle';
        html += '<div class="notification-item ' + (n.read ? '' : 'unread') + '">' +
            '<div class="notif-icon"><i class="fas ' + icon + '"></i></div>' +
            '<div class="notif-content"><div class="notif-msg">' + escapeHtml(n.message) + '</div><div class="notif-time">' + timeStr + '</div></div>' +
        '</div>';
        n.read = true;
    }
    container.innerHTML = html;
    saveNotifications();
    updateNotifBadgeHeader();
}

function updateNotifBadgeHeader() {
    var badge = document.getElementById('notifBadgeHeader');
    if (!badge) return;
    var unread = notifications.filter(n => !n.read).length;
    if (unread > 0) { badge.textContent = unread; badge.style.display = 'flex'; } else { badge.style.display = 'none'; }
    updateSidebarNotifBadge();
}

function updateSidebarNotifBadge() {
    var badge = document.getElementById('sidebarNotifBadge');
    if (!badge) return;
    var unread = notifications.filter(n => !n.read).length;
    if (unread > 0) { badge.textContent = unread; badge.classList.remove('hidden'); } else { badge.classList.add('hidden'); }
}

function addNotification(message, type) {
    notifications.unshift({ id: Date.now().toString(), message, type: type || 'info', read: false, date: new Date().toISOString() });
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

function showPage(pageName) {
    updateActivity();
    var pages = ['homePage', 'createPage', 'ticketsPage', 'historyPage', 'profilePage', 'whitepaperPage', 'faqPage', 'settingsPage', 'ratingsPage', 'adminPage', 'slidesPage', 'myeventsPage', 'notificationsPage'];
    for (var p of pages) { var el = document.getElementById(p); if (el) { el.style.display = 'none'; el.classList.add('hidden-page'); } }
    if (pageName === 'home') { document.getElementById('homePage').style.display = 'block'; renderEventsByCategory(); }
    else { var target = document.getElementById(pageName + 'Page'); if (target) { target.style.display = 'block'; target.classList.remove('hidden-page'); } }
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

function updateBackButton(currentPage) {
    var backBtn = document.getElementById('backBtn');
    if (!backBtn) return;
    if (currentPage !== 'home' && currentPage !== 'homePage') { backBtn.style.display = 'flex'; backBtn.classList.add('visible'); }
    else { backBtn.style.display = 'none'; backBtn.classList.remove('visible'); }
}

function goBack() {
    if (pageHistory.length > 1) { pageHistory.pop(); showPage(pageHistory[pageHistory.length - 1]); }
    else showPage('home');
}

function closeSidebar() { var s = document.getElementById('sidebar'); if (s) s.classList.remove('open'); var o = document.getElementById('overlay'); if (o) o.classList.remove('active'); }
function openSidebar() { var s = document.getElementById('sidebar'); if (s) s.classList.add('open'); var o = document.getElementById('overlay'); if (o) o.classList.add('active'); }

function updateActivity() { lastActivity = Date.now(); localStorage.setItem('betix_last_activity', lastActivity); }
function isSessionExpired() { return (Date.now() - parseInt(localStorage.getItem('betix_last_activity') || 0)) > 86400000; }

function disconnectPi() {
    if (confirm('Are you sure you want to disconnect your Pi account?')) {
        currentUser = { name: 'Guest', wallet: null, piUid: null, memberSince: '2026', loyaltyPoints: 0, profilePhoto: null };
        piUser = null;
        saveUser();
        localStorage.removeItem('betix_last_activity');
        localStorage.removeItem('betix_pending_payment');
        updateUserInfo();
        updateProfilePage();
        renderEventsByCategory();
        renderTickets();
        renderHistory();
        updateAllProfileImages();
        updateConnectButtons();
        closeSidebar();
        alert('You are disconnected');
    }
}

function logout() { disconnectPi(); }

function updateConnectButtons() {
    var sidebarBtn = document.getElementById('sidebarWalletBtn');
    if (sidebarBtn) {
        if (currentUser.wallet) {
            sidebarBtn.textContent = 'Disconnect';
            sidebarBtn.classList.add('disconnect');
            sidebarBtn.onclick = disconnectPi;
        } else {
            sidebarBtn.textContent = 'Connect Pi';
            sidebarBtn.classList.remove('disconnect');
            sidebarBtn.onclick = connectToPi;
        }
    }
    var profileBtn = document.getElementById('profileConnectBtnPage');
    if (profileBtn) {
        if (currentUser.wallet) { profileBtn.textContent = 'Disconnect'; profileBtn.onclick = disconnectPi; }
        else { profileBtn.textContent = 'Connect Pi'; profileBtn.onclick = connectToPi; }
    }
}

// ============================================================
// ===== IMAGE UPLOAD =====
// ============================================================

async function handleImageUploadModern(file, index) {
    if (!file || !file.type.startsWith('image/')) { alert('Please select an image'); return; }
    if (file.size > 10 * 1024 * 1024) { alert('Image is too large (max 10MB)'); return; }
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
            if (currentWidth < 90) { var newWidth = Math.min(90, currentWidth + Math.random() * 15); progressFill.style.width = newWidth + '%'; progressText.textContent = Math.round(newWidth) + '%'; }
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
    for (var key in uploadedImages) { if (uploadedImages.hasOwnProperty(key)) images.push(uploadedImages[key]); }
    return images;
}

// ============================================================
// ===== PROFILE PHOTO =====
// ============================================================

async function handleProfilePhotoUpload(file) {
    if (!file || !file.type.startsWith('image/')) { alert('Please select an image'); return; }
    if (file.size > 10 * 1024 * 1024) { alert('Image is too large (max 10MB)'); return; }
    var loadingMsg = document.getElementById('profilePhotoLoading');
    if (loadingMsg) loadingMsg.style.display = 'block';
    try {
        var compressedData = await compressProfilePhoto(file);
        var piUid = currentUser.piUid || currentUser.wallet;
        if (piUid) {
            var publicUrl = await uploadProfilePhoto(piUid, compressedData);
            currentUser.profilePhoto = publicUrl || compressedData;
        } else { currentUser.profilePhoto = compressedData; }
        saveUser();
        updateAllProfileImages();
        alert('Profile photo updated successfully!');
    } catch (error) { console.error('Error compressing image:', error); alert('Error compressing image. Please try with a smaller image.'); }
    finally { if (loadingMsg) loadingMsg.style.display = 'none'; }
}

function updateAllProfileImages() {
    var photo = currentUser.profilePhoto || '';
    var sidebarImg = document.getElementById('sidebarAvatarImage');
    var sidebarText = document.getElementById('sidebarAvatarText');
    if (sidebarImg && sidebarText) {
        if (photo) { sidebarImg.src = photo; sidebarImg.style.display = 'block'; sidebarText.style.display = 'none'; }
        else { sidebarImg.style.display = 'none'; sidebarText.style.display = 'flex'; sidebarText.innerText = currentUser.name.substring(0, 2).toUpperCase(); }
    }
    var profileImg = document.getElementById('profilePageAvatar');
    var profilePlaceholder = document.getElementById('profilePageAvatarPlaceholder');
    if (profileImg && profilePlaceholder) {
        if (photo) { profileImg.src = photo; profileImg.style.display = 'block'; profilePlaceholder.style.display = 'none'; }
        else { profileImg.style.display = 'none'; profilePlaceholder.style.display = 'flex'; profilePlaceholder.innerHTML = '<i class="fas fa-user"></i>'; }
    }
}

// ============================================================
// ===== LOYALTY POINTS =====
// ============================================================

function calculateLoyaltyPoints() {
    currentUser.loyaltyPoints = ratings.filter(r => r.userWallet === (currentUser.wallet || currentUser.name)).reduce((a, r) => a + r.rating, 0);
    saveUser();
    return currentUser.loyaltyPoints;
}

function updateLoyaltyPointsDisplay() {
    var pointsSpan = document.getElementById('loyaltyPoints');
    if (pointsSpan) pointsSpan.innerText = currentUser.loyaltyPoints || 0;
}

// ============================================================
// ===== UPDATE USER INFO =====
// ============================================================

function updateUserInfo() {
    var sidebarName = document.getElementById('sidebarName');
    var sidebarWallet = document.getElementById('sidebarWallet');
    var sidebarText = document.getElementById('sidebarAvatarText');
    var sidebarImg = document.getElementById('sidebarAvatarImage');
    if (sidebarName) sidebarName.innerText = currentUser.name;
    if (sidebarWallet) sidebarWallet.innerText = currentUser.wallet ? currentUser.wallet.substring(0, 15) + '...' : 'Not connected';
    if (sidebarImg && sidebarText) {
        if (currentUser.profilePhoto) { sidebarImg.src = currentUser.profilePhoto; sidebarImg.style.display = 'block'; sidebarText.style.display = 'none'; }
        else { sidebarImg.style.display = 'none'; sidebarText.style.display = 'flex'; sidebarText.innerText = currentUser.name.substring(0, 2).toUpperCase(); }
    }
    updateConnectButtons();
}

function updateProfilePage() {
    var profileName = document.getElementById('profileNameDisplay');
    var profileWallet = document.getElementById('profileWalletDisplay');
    var ticketCount = document.getElementById('ticketCount');
    var ratedCount = document.getElementById('ratedCount');
    var loyaltyDisplay = document.getElementById('loyaltyPointsDisplay');
    var myEventsCount = document.getElementById('myEventsCount');
    var historyCount = document.getElementById('historyCount');
    var profileRatingDisplay = document.getElementById('profileRatingDisplay');
    var profileLoyaltyDisplay = document.getElementById('profileLoyaltyDisplay');
    if (profileName) profileName.innerText = currentUser.name;
    if (profileWallet) profileWallet.innerText = currentUser.wallet || 'Not connected';
    if (ticketCount) ticketCount.innerText = tickets.length;
    var userRatings = ratings.filter(r => r.userWallet === (currentUser.wallet || currentUser.name));
    if (ratedCount) ratedCount.innerText = userRatings.length;
    if (loyaltyDisplay) loyaltyDisplay.innerText = currentUser.loyaltyPoints || 0;
    if (historyCount) historyCount.innerText = tickets.length;
    if (profileRatingDisplay) {
        var avg = userRatings.length > 0 ? (userRatings.reduce((a, r) => a + r.rating, 0) / userRatings.length).toFixed(1) : '0';
        profileRatingDisplay.innerText = avg;
    }
    if (profileLoyaltyDisplay) profileLoyaltyDisplay.innerText = currentUser.loyaltyPoints || 0;
    var myEvents = events.filter(e => e.organizer === currentUser.wallet || e.organizerName === currentUser.name);
    if (myEventsCount) myEventsCount.innerText = myEvents.length;
    updateAllProfileImages();
    updateConnectButtons();
    updateLoyaltyPointsDisplay();
}

// ============================================================
// ===== TICKETS =====
// ============================================================

function renderTickets() {
    var container = document.getElementById('ticketsList');
    if (!container) return;
    var active = tickets.filter(t => new Date(t.eventDate) > new Date()).sort((a, b) => new Date(b.purchaseDate) - new Date(a.purchaseDate));
    if (!active.length) { container.innerHTML = '<p style="text-align:center;padding:2rem;color:var(--gray);">No active tickets</p>'; return; }
    container.innerHTML = active.map(t => renderTicketCard(t, 'valid')).join('');
}

function renderHistory() {
    var container = document.getElementById('historyList');
    if (!container) return;
    var old = tickets.filter(t => new Date(t.eventDate) <= new Date()).sort((a, b) => new Date(b.purchaseDate) - new Date(a.purchaseDate));
    if (!old.length) { container.innerHTML = '<p style="text-align:center;padding:2rem;color:var(--gray);">No history</p>'; return; }
    container.innerHTML = old.map(t => renderTicketCard(t, 'past')).join('');
}

function renderTicketCard(ticket, status) {
    var dateEvent = new Date(ticket.eventDate);
    var dateFormatted = dateEvent.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    var timeFormatted = dateEvent.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    var statusClass = status === 'valid' ? 'valid' : 'past';
    var statusText = status === 'valid' ? 'Valid' : 'Past Event';
    var qrCode = ticket.qrCode || 'BETIX-' + ticket.id.substring(0, 8);
    var shortQr = qrCode.length > 12 ? qrCode.substring(0, 10) + '...' : qrCode;
    var participantName = ticket.buyerName || ticket.buyerWallet || 'Anonymous';
    if (participantName.length > 20) participantName = participantName.substring(0, 18) + '...';
    var eventTitle = ticket.eventTitle || 'Event';
    var categoryDisplay = ticket.category || 'Event';
    var standardDescription = 'Billet électronique officiel Betix confirmant votre participation à cet événement. Présentez ce ticket (QR Code ou code du billet) lors du contrôle d\'accès.';
    var cleanTicketId = ticket.id.replace(/[^a-zA-Z0-9]/g, '');
    return '<div class="ticket-card-premium" id="ticket-' + cleanTicketId + '">' +
        '<div class="ticket-header"><span class="ticket-status ' + statusClass + '">' + statusText + '</span><span class="ticket-number">#' + ticket.id.substring(0, 8).toUpperCase() + '</span></div>' +
        '<div class="ticket-body">' +
            '<div class="ticket-event-title">' + escapeHtml(eventTitle) + '</div>' +
            '<span class="ticket-category">' + escapeHtml(categoryDisplay) + '</span>' +
            '<div class="ticket-description-standard"><i class="fas fa-check-circle" style="color:#10b981; font-size:0.75rem; margin-right:4px;"></i> ' + standardDescription + '</div>' +
            '<div class="ticket-info-grid">' +
                '<div class="ticket-info-item"><i class="fas fa-calendar-day"></i> <span class="ticket-label">Date</span> <span class="ticket-value">' + dateFormatted + '</span></div>' +
                '<div class="ticket-info-item"><i class="fas fa-clock"></i> <span class="ticket-label">Time</span> <span class="ticket-value">' + timeFormatted + '</span></div>' +
                '<div class="ticket-info-item"><i class="fas fa-map-marker-alt"></i> <span class="ticket-label">Location</span> <span class="ticket-value">' + escapeHtml(ticket.eventLocation || 'Online') + '</span></div>' +
                '<div class="ticket-info-item"><i class="fas fa-tag"></i> <span class="ticket-label">Price</span> <span class="ticket-value">' + (ticket.price || 0) + ' Pi</span></div>' +
            '</div>' +
            '<div class="ticket-footer">' +
                '<div class="ticket-qr"><div class="qr-code">' + shortQr + '</div><div><span class="qr-label">Ticket Code</span><br><span style="font-size:0.6rem;color:var(--gray);font-family:monospace;">' + qrCode + '</span></div></div>' +
                '<div class="ticket-participant">Participant<br><span class="participant-name">' + escapeHtml(participantName) + '</span></div>' +
            '</div>' +
            '<button class="btn-download-ticket" onclick="downloadTicket(\'' + cleanTicketId + '\', \'' + escapeHtml(eventTitle).replace(/'/g, "\\'") + '\')"><i class="fas fa-download"></i> Download Ticket</button>' +
        '</div>' +
        '<div class="ticket-logo-placeholder">BETIX</div>' +
    '</div>';
}

// ============================================================
// ===== DOWNLOAD TICKET =====
// ============================================================

function downloadTicket(ticketId, eventTitle) {
    var ticketElement = document.getElementById('ticket-' + ticketId);
    if (!ticketElement) { alert('Ticket not found. Please refresh the page and try again.'); return; }
    var container = document.createElement('div');
    container.style.cssText = 'position:fixed;top:-9999px;left:-9999px;width:400px;background:#ffffff;border-radius:20px;box-shadow:0 4px 24px rgba(0,0,0,0.08);border:1px solid rgba(0,0,0,0.06);padding:0;overflow:hidden;font-family:-apple-system,BlinkMacSystemFont,sans-serif;z-index:99999;';
    var ticketClone = ticketElement.cloneNode(true);
    ticketClone.style.cssText = 'margin:0;border-radius:20px;box-shadow:none;width:100%;';
    var downloadBtn = ticketClone.querySelector('.btn-download-ticket');
    if (downloadBtn) downloadBtn.style.display = 'none';
    container.appendChild(ticketClone);
    document.body.appendChild(container);
    if (typeof html2canvas === 'undefined') {
        var script = document.createElement('script');
        script.src = 'https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js';
        script.onload = function() { setTimeout(function() { captureTicket(container, eventTitle); }, 300); };
        script.onerror = function() { alert('Error loading html2canvas. Please check your internet connection.'); document.body.removeChild(container); };
        document.head.appendChild(script);
    } else { setTimeout(function() { captureTicket(container, eventTitle); }, 300); }
}

function captureTicket(container, eventTitle) {
    if (typeof html2canvas === 'undefined') { alert('html2canvas is not available. Please try again.'); document.body.removeChild(container); return; }
    setTimeout(function() {
        html2canvas(container, { scale: 2, useCORS: true, backgroundColor: '#ffffff', logging: false, width: 400, height: container.scrollHeight })
            .then(function(canvas) {
                try {
                    var link = document.createElement('a');
                    var safeTitle = eventTitle.replace(/[^a-zA-Z0-9]/g, '-').substring(0, 50);
                    link.download = 'Betix-Ticket-' + safeTitle + '.png';
                    link.href = canvas.toDataURL('image/png');
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                } catch (e) { console.error('Download error:', e); alert('Error generating ticket image.'); }
                document.body.removeChild(container);
            })
            .catch(function(e) { console.error('html2canvas error:', e); alert('Error generating ticket image.'); document.body.removeChild(container); });
    }, 500);
}

// ============================================================
// ===== MY RATINGS =====
// ============================================================

function renderMyRatings() {
    var container = document.getElementById('myRatingsList');
    if (!container) return;
    var myRatings = ratings.filter(r => r.userWallet === (currentUser.wallet || currentUser.name));
    if (!myRatings.length) { container.innerHTML = '<p style="text-align:center;padding:2rem;">No ratings</p>'; return; }
    container.innerHTML = myRatings.map(r => {
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

function renderAdminLogs() {
    var container = document.getElementById('adminLogsList');
    if (!container) return;
    if (!adminLogs.length) { container.innerHTML = '<p style="text-align:center;padding:20px;color:var(--gray);">No logs available</p>'; return; }
    container.innerHTML = adminLogs.map(log =>
        '<div class="admin-log-item"><div><span class="log-user">' + escapeHtml(log.user) + '</span> <span class="log-action">' + escapeHtml(log.action) + '</span>' + (log.details ? ' <span style="color:var(--gray);font-size:0.8rem;">' + escapeHtml(log.details) + '</span>' : '') + '</div><span class="log-time">' + escapeHtml(log.date) + '</span></div>'
    ).join('');
}

function loadAdminPage() {
    var storedPassword = localStorage.getItem('betix_admin_password');
    if (storedPassword !== adminPassword && storedPassword !== 'Betix@2026#') { alert('Access denied.'); showPage('home'); return; }
    if (storedPassword && storedPassword !== adminPassword) adminPassword = storedPassword;
    document.getElementById('adminUserCount').innerText = connectedUsers.length || 1;
    document.getElementById('adminTicketCount').innerText = tickets.length;
    document.getElementById('adminEventCount').innerText = events.length;
    renderAdminEvents();
    renderAdminSlides();
    renderAdminUsers();
    renderAdminLogs();
    initAdminTabs();
}

function renderAdminEvents() {
    var container = document.getElementById('adminEventsList');
    if (!container) return;
    if (!events.length) { container.innerHTML = '<p style="color: var(--gray); text-align:center; padding:20px;">No events created</p>'; return; }
    container.innerHTML = events.map(e =>
        '<div class="admin-event-item"><div class="event-info"><strong>' + escapeHtml(e.title) + '</strong><small>' + e.category + ' | ' + e.country + ' | ' + e.seatsLeft + '/' + e.seatsTotal + ' seats | ' + new Date(e.date).toLocaleDateString('en-US') + '</small><small>Organizer: ' + escapeHtml(e.organizerName || e.organizer) + '</small></div><div class="event-actions"><button class="admin-delete-btn" onclick="deleteEventSafely(\'' + e.id + '\')">Delete</button></div></div>'
    ).join('');
}

function renderAdminUsers() {
    var container = document.getElementById('adminUsersList');
    if (!container) return;
    var html = '<table><tr><th>User</th><th>Pi Account</th><th>Tickets</th><th>Average Rating</th><th>Last Seen</th></tr>';
    html += '<tr><td>' + escapeHtml(currentUser.name) + ' <span style="color:#f5a623;font-size:0.7rem;">(you)</span></td><td>' + (currentUser.wallet || 'Not connected') + '</td><td>' + tickets.length + '</td><td>-</td><td>Active</td></tr>';
    for (var u of connectedUsers) {
        if (u.wallet !== currentUser.wallet) {
            var uRatings = ratings.filter(r => r.userWallet === u.wallet);
            var uAvg = uRatings.length ? (uRatings.reduce((a, r) => a + r.rating, 0) / uRatings.length).toFixed(1) : '-';
            html += '<tr><td>' + escapeHtml(u.name) + '</td><td>' + (u.wallet || 'Not connected') + '</td><td>' + (u.ticketCount || 0) + '</td><td>' + uAvg + '</td><td>' + (u.lastSeen || 'Unknown') + '</td></tr>';
        }
    }
    html += '</table>';
    container.innerHTML = html;
}

function renderAdminSlides() {
    var container = document.getElementById('adminSlidesList');
    if (!container) return;
    if (!heroSlides.length) { container.innerHTML = '<p style="color: var(--gray); text-align:center; padding:20px;">No images in carousel</p>'; return; }
    container.innerHTML = heroSlides.map((slide, index) =>
        '<div class="admin-slide-item"><img src="' + slide.image + '" class="slide-preview" onerror="this.style.display=\'none\'"><div class="slide-info"><h4>' + escapeHtml(slide.title) + '</h4><p>' + (slide.badge || 'Uncategorized') + ' • ' + (slide.description || '') + '</p></div><div class="slide-actions"><button class="edit-btn" onclick="adminEditSlide(' + index + ')">Edit</button><button class="delete-btn" onclick="adminDeleteSlide(' + index + ')">Delete</button></div></div>'
    ).join('');
}

function adminEditSlide(index) { adminShowSlideForm(index); }
function adminDeleteSlide(index) { if (!confirm('Delete this carousel image?')) return; heroSlides.splice(index, 1); localStorage.setItem('betix_hero_slides', JSON.stringify(heroSlides)); renderAdminSlides(); initHeroSlider(); }

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
        if (heroSlides[index].image) { preview.src = heroSlides[index].image; preview.style.display = 'block'; uploadBox.classList.add('has-image'); }
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
    if (!title) { alert('Please enter a title'); return; }
    var imageData = null;
    if (imageInput.files && imageInput.files[0]) {
        var file = imageInput.files[0];
        if (!file.type.startsWith('image/')) { alert('Please select an image'); return; }
        if (file.size > 5 * 1024 * 1024) { alert('Image is too large (max 5MB)'); return; }
        var reader = new FileReader();
        reader.onload = function(e) { saveSlideData(e.target.result, badge, title, description, editIndex); };
        reader.readAsDataURL(file);
    } else {
        if (editIndex >= 0 && editIndex < heroSlides.length) { saveSlideData(heroSlides[editIndex].image, badge, title, description, editIndex); }
        else { alert('Please select an image'); }
    }
}

function saveSlideData(image, badge, title, description, index) {
    var slideData = { image, badge, title, description };
    if (index >= 0 && index < heroSlides.length) heroSlides[index] = slideData;
    else heroSlides.push(slideData);
    localStorage.setItem('betix_hero_slides', JSON.stringify(heroSlides));
    document.getElementById('adminSlideFormContainer').style.display = 'none';
    renderAdminSlides();
    initHeroSlider();
    alert('Image saved successfully!');
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
    tabs.forEach(tab => tab.addEventListener('click', function() {
        tabs.forEach(t => t.classList.remove('active'));
        this.classList.add('active');
        for (var key in contents) { if (contents[key]) contents[key].classList.remove('active'); }
        var tabName = this.dataset.tab;
        if (contents[tabName]) contents[tabName].classList.add('active');
    }));
}

// ============================================================
// ===== MY EVENTS =====
// ============================================================

function renderMyEvents() {
    var container = document.getElementById('myEventsList');
    if (!container) return;
    var myEvents = events.filter(e => e.organizer === currentUser.wallet || e.organizerName === currentUser.name);
    if (!myEvents.length) { container.innerHTML = '<p style="text-align:center;padding:2rem;color:var(--gray);">You haven\'t created any events yet</p>'; return; }
    container.innerHTML = myEvents.map(e => renderMyEventCard(e)).join('');
}

function renderMyEventCard(event) {
    var dateEvent = new Date(event.date);
    var dateFormatted = dateEvent.toLocaleDateString('en-US');
    var timeFormatted = dateEvent.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    var galleryHtml = event.images && event.images.length ?
        '<div class="event-gallery-wrapper"><div class="event-gallery">' + event.images.slice(0, 3).map((img, i) =>
            '<img src="' + img + '" class="event-gallery-img" onclick="event.stopPropagation(); openGallery(\'' + event.id + '\', ' + i + ')">'
        ).join('') + '</div></div>' :
        '<div class="event-gallery-wrapper"><div class="event-gallery"><img src="' + eventImagesList[event.category] + '" class="event-gallery-img" style="width:100%;height:150px;object-fit:cover;"></div></div>';
    var ticketSold = tickets.filter(t => t.eventId === event.id).length;
    var flagEmojis = { 'France': '🇫🇷', 'RDC': '🇨🇩', 'Congo': '🇨🇬', 'Belgium': '🇧🇪', 'Switzerland': '🇨🇭', 'Canada': '🇨🇦', 'Senegal': '🇸🇳', 'Cameroon': '🇨🇲', 'Cote d\'Ivoire': '🇨🇮', 'Mali': '🇲🇱', 'Niger': '🇳🇪', 'Nigeria': '🇳🇬', 'South Africa': '🇿🇦', 'Angola': '🇦🇴', 'Mozambique': '🇲🇿', 'Kenya': '🇰🇪', 'Tanzania': '🇹🇿', 'Uganda': '🇺🇬', 'Rwanda': '🇷🇼', 'Burundi': '🇧🇮', 'Ethiopia': '🇪🇹', 'Somalia': '🇸🇴', 'Djibouti': '🇩🇯', 'Eritrea': '🇪🇷', 'Sudan': '🇸🇩', 'South Sudan': '🇸🇸', 'Egypt': '🇪🇬', 'Libya': '🇱🇾', 'Tunisia': '🇹🇳', 'Algeria': '🇩🇿', 'Morocco': '🇲🇦', 'Mauritania': '🇲🇷', 'Ghana': '🇬🇭', 'Guinea': '🇬🇳', 'Burkina Faso': '🇧🇫', 'Benin': '🇧🇯', 'Togo': '🇹🇬', 'Liberia': '🇱🇷', 'Sierra Leone': '🇸🇱', 'Gambia': '🇬🇲', 'Guinea-Bissau': '🇬🇼', 'Cape Verde': '🇨🇻', 'Sao Tome': '🇸🇹', 'Gabon': '🇬🇦', 'Equatorial Guinea': '🇬🇶', 'Central African Republic': '🇨🇫', 'Chad': '🇹🇩', 'Madagascar': '🇲🇬', 'Comoros': '🇰🇲', 'Mauritius': '🇲🇺', 'Seychelles': '🇸🇨', 'Zambia': '🇿🇲', 'Zimbabwe': '🇿🇼', 'Botswana': '🇧🇼', 'Namibia': '🇳🇦', 'Lesotho': '🇱🇸', 'Eswatini': '🇸🇿', 'Malawi': '🇲🇼', 'Spain': '🇪🇸', 'Portugal': '🇵🇹', 'Germany': '🇩🇪', 'Italy': '🇮🇹', 'United Kingdom': '🇬🇧', 'United States': '🇺🇸', 'Russia': '🇷🇺', 'Ukraine': '🇺🇦', 'Turkey': '🇹🇷', 'Iran': '🇮🇷', 'China': '🇨🇳', 'Japan': '🇯🇵', 'India': '🇮🇳', 'Indonesia': '🇮🇩', 'Australia': '🇦🇺', 'Mexico': '🇲🇽', 'Argentina': '🇦🇷', 'Brazil': '🇧🇷', 'Denmark': '🇩🇰', 'Sweden': '🇸🇪', 'Austria': '🇦🇹' };
    var countryFlag = flagEmojis[event.country] || '🌍';
    var durationDisplay = event.durationValue && event.durationUnit ? '<div class="detail-item"><i class="fas fa-hourglass-half"></i> ' + event.durationValue + ' ' + event.durationUnit + '</div>' : '';
    return '<div class="event-card" style="cursor:default; position:relative;">' +
        galleryHtml +
        '<div class="event-info">' +
            '<div class="event-title">' + escapeHtml(event.title) + '</div>' +
            '<div class="event-details-grid">' +
                '<div class="detail-item"><i class="fas fa-calendar-day"></i> ' + dateFormatted + '</div>' +
                '<div class="detail-item"><i class="fas fa-clock"></i> ' + timeFormatted + '</div>' +
                '<div class="detail-item"><i class="fas fa-map-marker-alt"></i> ' + escapeHtml(event.location || 'Online') + '</div>' +
                '<div class="detail-item"><span class="flag-icon">' + countryFlag + '</span> ' + escapeHtml(event.country || 'Not specified') + '</div>' +
                '<div class="detail-item"><i class="fas fa-ticket-alt"></i> ' + ticketSold + ' sold</div>' +
                '<div class="detail-item"><i class="fas fa-users"></i> ' + event.seatsLeft + '/' + event.seatsTotal + ' seats</div>' +
                durationDisplay +
            '</div>' +
            '<div class="event-footer" style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:8px; margin-top:8px;">' +
                '<div><span class="event-price">' + event.price + ' Pi</span></div>' +
                '<div style="display:flex; gap:8px;">' +
                    '<button class="btn-secondary" onclick="event.stopPropagation(); openEditEventModal(\'' + event.id + '\')" style="background:var(--primary); color:white; padding:4px 12px; font-size:0.7rem;">Edit</button>' +
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
    var filtered = events.filter(e => {
        var matchCategory = currentFilter === 'All' || e.category === currentFilter;
        var matchCountry = currentCountryFilter === 'All' || e.country === currentCountryFilter;
        var matchSearch = e.title.toLowerCase().includes(searchQuery) || (e.location && e.location.toLowerCase().includes(searchQuery));
        return matchCategory && matchCountry && matchSearch;
    });
    if (!filtered.length) { container.innerHTML = '<p style="text-align:center;padding:2rem;color:var(--gray);">No events found</p>'; return; }
    var cats = ['Concert', 'Sport', 'Conference', 'Training', 'Cinema', 'Festival', 'Theatre', 'Dance', 'Exhibition', 'Gala', 'Seminar'];
    var html = '';
    if (currentFilter !== 'All') {
        html = '<div class="category-section"><div class="events-grid-centered">' + filtered.map(e => renderEventCard(e)).join('') + '</div></div>';
    } else {
        for (var cat of cats) {
            var catEvents = filtered.filter(e => e.category === cat);
            if (catEvents.length) {
                html += '<div class="category-section"><div class="category-header">' + cat + '</div><div class="events-grid-centered">' + catEvents.map(e => renderEventCard(e)).join('') + '</div></div>';
            }
        }
    }
    container.innerHTML = html;
}

function renderEventCard(event) {
    var avgRating = 0;
    var eventRatings = ratings.filter(r => r.eventId === event.id);
    if (eventRatings.length) avgRating = eventRatings.reduce((a, r) => a + r.rating, 0) / eventRatings.length;
    var dateEvent = new Date(event.date);
    var dateFormatted = dateEvent.toLocaleDateString('en-US', { month: 'numeric', day: 'numeric', year: 'numeric' });
    var timeFormatted = dateEvent.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    var fallbackImage = eventImagesList[event.category] || eventImagesList.Concert;
    var posterImage = event.coverImage || (event.images && event.images[0]) || fallbackImage;
    var desc = event.description || '';
    if (desc.length > 120) desc = desc.substring(0, 117) + '...';
    var organizerDisplay = event.organizerName || event.organizer || 'Anonymous';
    if (organizerDisplay.length > 20) organizerDisplay = organizerDisplay.substring(0, 18) + '...';
    var organizerFormatted = organizerDisplay.startsWith('@') ? organizerDisplay : '@' + organizerDisplay;
    var ratingDisplay = eventRatings.length ?
        '<span class="stars">' + '★'.repeat(Math.floor(avgRating)) + '☆'.repeat(5 - Math.floor(avgRating)) + '</span> ' + avgRating.toFixed(1) + ' (' + eventRatings.length + ')' :
        '<span class="new-badge">New</span>';
    var priceDisplay = event.price + ' Pi';
    var durationDisplay = event.durationValue && event.durationUnit ?
        '<span class="event-duration-display"><i class="fas fa-hourglass-half"></i> ' + event.durationValue + ' ' + event.durationUnit + '</span>' :
        '<span class="event-duration-display"><i class="fas fa-hourglass-half"></i> Not specified</span>';
    return '<div class="event-card-classic" onclick="openEventDetails(\'' + event.id + '\')">' +
        '<div class="poster-wrapper-classic"><img src="' + posterImage + '" alt="' + escapeHtml(event.title) + '" onerror="this.src=\'' + fallbackImage + '\'"><span class="category-badge-classic">' + escapeHtml(event.category) + '</span></div>' +
        '<div class="card-content-classic">' +
            '<div class="event-title-classic">' + escapeHtml(event.title) + '</div>' +
            (desc ? '<div class="event-desc-classic">' + escapeHtml(desc) + '</div>' : '') +
            '<div class="info-grid-classic">' +
                '<div class="info-item-classic"><i class="fas fa-calendar-day"></i> ' + dateFormatted + '</div>' +
                '<div class="info-item-classic"><i class="fas fa-map-marker-alt"></i> ' + escapeHtml(event.location || 'Online') + '</div>' +
                '<div class="info-item-classic"><i class="fas fa-clock"></i> ' + timeFormatted + '</div>' +
                '<div class="info-item-classic">' + durationDisplay + '</div>' +
            '</div>' +
            '<div class="card-footer-classic">' +
                '<span class="event-rating-classic">' + ratingDisplay + '</span>' +
                '<span><span class="event-price-classic">' + priceDisplay + '</span> <span class="event-seats-classic">' + event.seatsLeft + '/' + event.seatsTotal + ' seats</span></span>' +
            '</div>' +
            '<button class="buy-btn-classic" onclick="event.stopPropagation(); openQuantityPopup(\'' + event.id + '\')">Buy Ticket</button>' +
            '<div class="event-organizer-classic"><span class="org-icon">🙎‍♂️</span> By ' + escapeHtml(organizerFormatted) + '</div>' +
        '</div>' +
    '</div>';
}

// ============================================================
// ===== CONNEXION PI =====
// ============================================================

async function connectToPi() {
    if (typeof Pi === 'undefined') {
        if (confirm("Pi Browser not detected. Use demo mode?")) {
            currentUser.wallet = 'demo_user';
            currentUser.piUid = 'demo_user';
            currentUser.name = 'Demo User';
            currentUser.memberSince = '2026';
            currentUser.loyaltyPoints = 0;
            currentUser.profilePhoto = null;
            saveUser();
            await syncUserToSupabase();
            updateActivity();
            updateUserInfo();
            updateProfilePage();
            updateAllProfileImages();
            renderEventsByCategory();
            updateConnectButtons();
            await loadAllFromSupabase();
            alert('Pi account connected (demo mode)! Welcome Demo User');
            closeSidebar();
            return;
        }
        alert("Please open this page in Pi Browser");
        return;
    }
    try {
        var auth = await Pi.authenticate(['username', 'payments'], onIncompletePaymentFound);
        if (auth && auth.user) {
            piUser = auth.user;
            currentUser.wallet = piUser.username;
            currentUser.piUid = piUser.username;
            currentUser.name = piUser.username;
            if (!currentUser.loyaltyPoints) currentUser.loyaltyPoints = 0;
            if (!currentUser.profilePhoto) currentUser.profilePhoto = null;
            saveUser();
            await syncUserToSupabase();
            updateActivity();
            updateUserInfo();
            updateProfilePage();
            updateAllProfileImages();
            trackUserConnection();
            renderEventsByCategory();
            updateConnectButtons();
            await loadAllFromSupabase();
            alert('Pi account connected! Welcome ' + piUser.username);
            closeSidebar();
        }
    } catch (error) {
        console.error("Pi connection error:", error);
        alert("Connection error: " + (error.message || "Please try again"));
    }
}

async function onIncompletePaymentFound(payment) { console.log("Incomplete payment found:", payment); }

// ============================================================
// ===== CONFIRMATION ACHAT =====
// ============================================================

async function confirmPurchase(eventId, quantity) {
    var event = events.find(e => e.id === eventId);
    if (!event) { alert('Event not found'); return; }
    if (quantity > event.seatsLeft) { alert('Only ' + event.seatsLeft + ' seats available'); return; }
    var totalPrice = quantity * event.price;
    if (!confirm('Buy ' + quantity + ' ticket(s) for "' + event.title + '" (Total: ' + totalPrice.toFixed(6) + ' Pi) ?')) { return; }
    closeQuantityPopup();
    try {
        var payment = await Pi.createPayment({
            amount: Number(totalPrice),
            memo: quantity + ' ticket(s): ' + event.title,
            metadata: { eventId: event.id, eventTitle: event.title, quantity: quantity }
        }, {
            onReadyForServerApproval: function(paymentId) {
                fetch(BACKEND_URL + '/api/pi/approve', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ paymentId: paymentId }) });
            },
            onReadyForServerCompletion: function(paymentId, txid) {
                fetch(BACKEND_URL + '/api/pi/complete', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ paymentId: paymentId, txid: txid, amount: totalPrice, metadata: { eventId: event.id, quantity: quantity } }) })
                    .then(async function() {
                        var ticketsAdded = [];
                        for (var i = 0; i < quantity; i++) {
                            var ticket = {
                                id: 'ticket_' + Date.now() + '_' + i + '_' + Math.random().toString(36).substring(2, 6),
                                eventId: event.id,
                                eventTitle: event.title,
                                eventDate: event.date,
                                eventLocation: event.location,
                                category: event.category || '',
                                price: event.price,
                                buyerWallet: piUser ? piUser.username : currentUser.wallet,
                                buyerName: piUser ? piUser.username : currentUser.name,
                                userWallet: currentUser.wallet,
                                purchaseDate: new Date().toISOString(),
                                purchaseDateTime: new Date().toLocaleString('en-US'),
                                transactionId: txid,
                                qrCode: 'BETIX-' + Date.now() + '-' + txid.substring(0, 8) + '-' + i,
                                status: 'Valid'
                            };
                            tickets.push(ticket);
                            ticketsAdded.push(ticket);
                        }
                        event.seatsLeft -= quantity;
                        event.boosts = (event.boosts || 0) + quantity;
                        saveEvents();
                        saveTickets();
                        for (var ticket of ticketsAdded) await saveTicketToSupabase(ticket);
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
                        addNotification('Purchase of ' + quantity + ' ticket(s) for "' + event.title + '" by ' + (currentUser.name || 'a user'), 'purchase');
                        renderEventsByCategory();
                        renderTickets();
                        renderHistory();
                        updateProfilePage();
                        await syncUserToSupabase();
                        showSuccessPopup(event, ticketsAdded, quantity);
                    });
            },
            onCancel: function() { alert("Payment cancelled"); },
            onError: function(error) { alert("Payment error: " + error.message); }
        });
    } catch (error) {
        console.error('Purchase error:', error);
        alert("Error: " + error.message);
    }
}

function confirmPurchaseFromPopup() {
    if (!selectedEventForPurchase) { alert('No event selected'); return; }
    var quantity = parseInt(document.getElementById('ticketQuantity').value) || 1;
    if (quantity < 1) { alert('Please select at least 1 ticket'); return; }
    if (quantity > selectedEventForPurchase.seatsLeft) { alert('Only ' + selectedEventForPurchase.seatsLeft + ' tickets available'); return; }
    if (quantity > 10) { alert('Maximum 10 tickets per purchase'); return; }
    confirmPurchase(selectedEventForPurchase.id, quantity);
}

// ============================================================
// ===== QUANTITY POPUP =====
// ============================================================

var selectedEventForPurchase = null;

function openQuantityPopup(eventId) {
    var event = events.find(e => e.id === eventId);
    if (!event) { alert('Event not found'); return; }
    if (!piUser && !currentUser.wallet) { alert('Please connect your Pi account first'); connectToPi(); return; }
    if (event.seatsLeft <= 0) { alert('No seats available for this event'); return; }
    selectedEventForPurchase = event;
    var popup = document.getElementById('quantityPopup');
    document.getElementById('quantityEventTitle').textContent = event.title;
    var dateEvent = new Date(event.date);
    document.getElementById('quantityEventInfo').textContent = dateEvent.toLocaleDateString('en-US') + ' at ' + dateEvent.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }) + ' | ' + event.location;
    var maxQty = Math.min(event.seatsLeft, 10);
    document.getElementById('maxQuantityInfo').textContent = 'Maximum ' + maxQty + ' tickets available';
    var quantityInput = document.getElementById('ticketQuantity');
    quantityInput.value = 1;
    quantityInput.max = maxQty;
    quantityInput.min = 1;
    document.getElementById('totalPriceDisplay').textContent = event.price + ' Pi';
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
    var newVal = Math.max(1, Math.min(maxVal, current + delta));
    input.value = newVal;
    updateTotalPrice();
}

function updateTotalPrice() {
    var input = document.getElementById('ticketQuantity');
    var totalDisplay = document.getElementById('totalPriceDisplay');
    if (!input || !totalDisplay || !selectedEventForPurchase) return;
    var qty = parseInt(input.value) || 1;
    totalDisplay.textContent = (qty * selectedEventForPurchase.price).toFixed(6) + ' Pi';
}

// ============================================================
// ===== CREATE EVENT =====
// ============================================================

function createEvent(e) {
    e.preventDefault();
    if (!currentUser.wallet) { alert('Connect your Pi account first'); return; }
    var images = getUploadedImages();
    if (images.length < 2) { alert('Please add 2 photos for your event'); return; }
    var conditions = document.getElementById('eventConditions').value.trim();
    if (!conditions) { alert('Please add participation conditions'); return; }
    var description = document.getElementById('eventDescription').value.trim();
    if (description.length > 500) { alert('Description is too long (max 500 characters)'); return; }
    var location = document.getElementById('eventLocation').value.trim();
    if (location.length > 100) { alert('Location is too long (max 100 characters)'); return; }
    if (conditions.length > 1500) { alert('Conditions are too long (max 1500 characters)'); return; }
    var category = document.getElementById('eventCategory').value;
    var country = document.getElementById('eventCountry').value;
    var durationValue = document.getElementById('eventDurationValue').value;
    var durationUnit = document.getElementById('eventDurationUnit').value;
    var durationValueNum = durationValue ? parseFloat(durationValue) : null;
    var newEvent = {
        id: Date.now().toString(),
        title: document.getElementById('eventTitle').value,
        category: category,
        country: country,
        date: document.getElementById('eventDate').value,
        location: location,
        description: description,
        conditions: conditions,
        price: parseFloat(document.getElementById('eventPrice').value) || 0.0003,
        seatsTotal: parseInt(document.getElementById('eventSeats').value),
        seatsLeft: parseInt(document.getElementById('eventSeats').value),
        images: images,
        coverImage: images[0],
        organizer: currentUser.wallet,
        organizerPiUid: currentUser.piUid || currentUser.wallet,
        organizerName: currentUser.name,
        createdAt: new Date().toISOString(),
        boosts: 0,
        durationValue: durationValueNum,
        durationUnit: durationUnit
    };
    if (!newEvent.title || !newEvent.date || !newEvent.location || !newEvent.seatsTotal) { alert('Please fill in all required fields'); return; }
    if (newEvent.title.length > 100) { alert('Title is too long (max 100 characters)'); return; }
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
    document.getElementById('confirmOrganizer').textContent = currentUser.name || currentUser.wallet;
    document.getElementById('confirmDescription').textContent = eventData.description || 'No description';
    document.getElementById('confirmConditions').textContent = eventData.conditions || 'No conditions specified';
    var durationDisplay = document.getElementById('confirmDuration');
    if (durationDisplay) {
        if (eventData.durationValue && eventData.durationUnit) {
            durationDisplay.textContent = eventData.durationValue + ' ' + eventData.durationUnit;
            durationDisplay.style.display = 'block';
        } else { durationDisplay.style.display = 'none'; }
    }
    var imagesContainer = document.getElementById('confirmImages');
    imagesContainer.innerHTML = '';
    if (eventData.images && eventData.images.length) {
        for (var img of eventData.images) {
            var imgEl = document.createElement('img');
            imgEl.src = img;
            imgEl.alt = 'Event image';
            imagesContainer.appendChild(imgEl);
        }
    }
    document.getElementById('publishConfirmPopup').classList.add('show');
}

function closePublishConfirmPopup() {
    document.getElementById('publishConfirmPopup').classList.remove('show');
    pendingEventData = null;
}

async function confirmPublishEvent() {
    if (!pendingEventData) return;
    showLoader('Publishing your event...');
    try {
        var newEvent = pendingEventData;
        var uploadedUrls = [];
        if (newEvent.images && newEvent.images.length) {
            for (var i = 0; i < newEvent.images.length; i++) {
                var url = await uploadEventImage(newEvent.id, newEvent.images[i], i);
                uploadedUrls.push(url || newEvent.images[i]);
            }
        }
        newEvent.images = uploadedUrls;
        newEvent.coverImage = uploadedUrls.length ? uploadedUrls[0] : '';
        newEvent.organizerPiUid = currentUser.piUid || currentUser.wallet;
        var existingIndex = events.findIndex(e => e.id === newEvent.id);
        if (existingIndex !== -1) events[existingIndex] = newEvent;
        else events.push(newEvent);
        saveEvents();
        await saveEventToSupabase(newEvent);
        document.getElementById('eventForm').reset();
        for (var i = 0; i < 2; i++) removeImageModern(i);
        uploadedImages = {};
        addNotification('New event "' + newEvent.title + '" has been published!', 'event');
        closePublishConfirmPopup();
        hideLoader();
        renderEventsByCategory();
        updateProfilePage();
        alert('Event "' + newEvent.title + '" has been successfully published!');
        showPage('home');
    } catch (error) {
        console.error('Error publishing event:', error);
        hideLoader();
        alert('Error publishing event. Please try again.');
    }
}

// ============================================================
// ===== EDIT EVENT =====
// ============================================================

var editingEventId = null;

function openEditEventModal(eventId) {
    var event = events.find(e => e.id === eventId);
    if (!event) { alert('Event not found'); return; }
    if (event.organizer !== currentUser.wallet && event.organizerName !== currentUser.name) { alert('You are not the organizer of this event'); return; }
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
    var event = events.find(e => e.id === editingEventId);
    if (!event) { alert('Event not found'); return; }
    var description = document.getElementById('editEventDescription').value.trim();
    var location = document.getElementById('editEventLocation').value.trim();
    var conditions = document.getElementById('editEventConditions').value.trim();
    var seatsTotal = parseInt(document.getElementById('editEventSeats').value);
    var durationValue = document.getElementById('editEventDurationValue').value;
    var durationUnit = document.getElementById('editEventDurationUnit').value;
    if (description.length > 500) { alert('Description is too long (max 500 characters)'); return; }
    if (location.length > 100) { alert('Location is too long (max 100 characters)'); return; }
    if (conditions.length > 1500) { alert('Conditions are too long (max 1500 characters)'); return; }
    if (!seatsTotal || seatsTotal < 1) { alert('Please enter a valid number of seats'); return; }
    var ticketsSold = tickets.filter(t => t.eventId === editingEventId).length;
    if (seatsTotal < ticketsSold) { alert('You cannot reduce seats below ' + ticketsSold + ' already sold'); return; }
    var updates = {
        description: description,
        location: location,
        conditions: conditions,
        seatsTotal: seatsTotal,
        seatsLeft: seatsTotal - ticketsSold,
        durationValue: durationValue ? parseFloat(durationValue) : null,
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
    addNotification('Event "' + event.title + '" has been updated', 'event');
    closeEditEventModal();
    renderEventsByCategory();
    renderMyEvents();
    alert('Event updated successfully!');
}

// ============================================================
// ===== SUCCESS POPUP =====
// ============================================================

function showSuccessPopup(event, ticketsList, quantity) {
    var popup = document.getElementById('successPopup');
    if (!popup) return;
    var qty = quantity || ticketsList.length;
    var ticket = ticketsList[0] || {};
    document.getElementById('successTitle').textContent = 'Purchase successful';
    document.getElementById('successMessage').textContent = qty + ' ticket(s) added successfully.';
    var dateEvent = new Date(event.date);
    var dateFormatted = dateEvent.toLocaleDateString('en-US');
    var timeFormatted = dateEvent.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    var totalPrice = qty * event.price;
    var codeDisplay = ticket.qrCode || 'N/A';
    document.getElementById('successTicketInfo').innerHTML =
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
    if (popup) popup.classList.remove('show');
}

// ============================================================
// ===== EVENT DETAILS =====
// ============================================================

function openEventDetails(eventId) {
    var event = events.find(e => e.id === eventId);
    if (!event) { alert('Event not found'); return; }
    var modal = document.getElementById('eventDetailModal');
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
    var durationDisplay = document.getElementById('detailDuration');
    if (durationDisplay) {
        if (event.durationValue && event.durationUnit) {
            durationDisplay.textContent = 'Duration: ' + event.durationValue + ' ' + event.durationUnit;
            durationDisplay.style.display = 'block';
        } else { durationDisplay.style.display = 'none'; }
    }
    var conditionsContainer = document.getElementById('detailConditions');
    if (conditionsContainer) {
        if (event.conditions) {
            var conditionsList = event.conditions.split('\n').filter(line => line.trim());
            if (conditionsList.length) {
                conditionsContainer.innerHTML = '<ul class="conditions-list">' + conditionsList.map(c => '<li>' + escapeHtml(c.trim()) + '</li>').join('') + '</ul>';
            } else { conditionsContainer.innerHTML = '<p>' + escapeHtml(event.conditions) + '</p>'; }
        } else { conditionsContainer.innerHTML = '<p style="color: var(--gray);">No conditions specified</p>'; }
    }
    var eventRatings = ratings.filter(r => r.eventId === event.id);
    var avgRating = eventRatings.length ? eventRatings.reduce((a, r) => a + r.rating, 0) / eventRatings.length : 0;
    var ratingStars = '★'.repeat(Math.floor(avgRating)) + '☆'.repeat(5 - Math.floor(avgRating));
    document.getElementById('detailRating').textContent = eventRatings.length ? ratingStars + ' ' + avgRating.toFixed(1) + ' (' + eventRatings.length + ' reviews)' : 'Not yet rated';
    var gallery = document.getElementById('detailGallery');
    gallery.innerHTML = '';
    if (event.images && event.images.length) {
        var galleryContainer = document.createElement('div');
        galleryContainer.className = 'gallery-scroll';
        var maxImages = Math.min(event.images.length, 5);
        for (var j = 0; j < maxImages; j++) {
            (function(idx) {
                var wrapper = document.createElement('div');
                wrapper.className = 'gallery-item';
                var img = document.createElement('img');
                img.src = event.images[idx];
                img.alt = event.title + ' - photo ' + (idx + 1);
                img.onerror = function() { this.src = eventImagesList[event.category] || 'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?w=600&h=400&fit=crop'; };
                img.onclick = function() { openGallery(event.id, idx); };
                wrapper.appendChild(img);
                galleryContainer.appendChild(wrapper);
            })(j);
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
    if (eventRatings.length) {
        eventRatings.forEach(function(r) {
            var div = document.createElement('div');
            div.className = 'review-item';
            var stars = '★'.repeat(r.rating) + '☆'.repeat(5 - r.rating);
            div.innerHTML = '<div class="review-header"><span class="review-user">' + escapeHtml(r.userName || r.userWallet) + '</span><span class="review-stars">' + stars + '</span></div>' +
                (r.comment ? '<div class="review-text">"' + escapeHtml(r.comment) + '"</div>' : '') +
                '<div class="review-date">' + new Date(r.date).toLocaleDateString('en-US') + '</div>';
            reviewsContainer.appendChild(div);
        });
    } else { reviewsContainer.innerHTML = '<p style="color: var(--gray); font-size: 0.9rem;">No reviews yet</p>'; }
    document.getElementById('detailBuyBtn').onclick = function() { modal.classList.remove('show'); document.body.style.overflow = ''; openQuantityPopup(event.id); };
    document.getElementById('eventDetailClose').onclick = function() { modal.classList.remove('show'); document.body.style.overflow = ''; };
    window.onclick = function(e) { if (e.target === modal) { modal.classList.remove('show'); document.body.style.overflow = ''; } };
    modal.classList.add('show');
    document.body.style.overflow = 'hidden';
}

// ============================================================
// ===== GALLERY =====
// ============================================================

function openGallery(eventId, startIndex) {
    var event = events.find(e => e.id === eventId);
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
    container.innerHTML = cats.map(c => '<div class="filter-chip ' + (c === currentFilter ? 'active' : '') + '" data-category="' + c + '">' + c + '</div>').join('');
    document.querySelectorAll('.filter-chip').forEach(chip => chip.addEventListener('click', function() {
        currentFilter = this.dataset.category;
        initFilters();
        renderEventsByCategory();
    }));
}

function initCountrySelectors() {
    var filterSelect = document.getElementById('countrySelect');
    if (filterSelect) {
        filterSelect.innerHTML = '';
        countriesList.forEach(country => {
            var option = document.createElement('option');
            option.value = country.name;
            option.textContent = country.flag + ' ' + country.name;
            if (country.name === currentCountryFilter) option.selected = true;
            filterSelect.appendChild(option);
        });
    }
    var eventSelect = document.getElementById('eventCountry');
    if (eventSelect) {
        eventSelect.innerHTML = '';
        countriesList.filter(c => c.name !== 'All').forEach(country => {
            var option = document.createElement('option');
            option.value = country.name;
            option.textContent = country.flag + ' ' + country.name;
            if (country.name === 'France') option.selected = true;
            eventSelect.appendChild(option);
        });
    }
}

function filterByCountry(country) {
    currentCountryFilter = country;
    renderEventsByCategory();
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
        setTimeout(function() { isTransitioning = false; }, 800);
    }

    function nextSlide() { if (totalSlides > 0) goToSlide(currentIndex + 1); }
    function prevSlide() { if (totalSlides > 0) goToSlide(currentIndex - 1); }

    function startAutoPlay() {
        if (autoPlayInterval) clearInterval(autoPlayInterval);
        if (totalSlides > 1) autoPlayInterval = setInterval(nextSlide, 4000);
    }
    function stopAutoPlay() { if (autoPlayInterval) { clearInterval(autoPlayInterval); autoPlayInterval = null; } }

    if (prevBtn) { prevBtn.onclick = function() { stopAutoPlay(); prevSlide(); setTimeout(startAutoPlay, 3000); }; }
    if (nextBtn) { nextBtn.onclick = function() { stopAutoPlay(); nextSlide(); setTimeout(startAutoPlay, 3000); }; }
    var hero = document.querySelector('.hero');
    if (hero) { hero.onmouseenter = stopAutoPlay; hero.onmouseleave = startAutoPlay; }
    startAutoPlay();
}

// ============================================================
// ===== TRACK USER =====
// ============================================================

function trackUserConnection() {
    if (!currentUser.wallet) return;
    var existing = connectedUsers.find(u => u.wallet === currentUser.wallet);
    var userData = {
        name: currentUser.name,
        wallet: currentUser.wallet,
        ticketCount: tickets.length,
        lastSeen: new Date().toLocaleString(),
        profilePhoto: currentUser.profilePhoto || null,
        loyaltyPoints: currentUser.loyaltyPoints || 0,
        memberSince: currentUser.memberSince || '2026'
    };
    if (!existing) connectedUsers.push(userData);
    else { Object.assign(existing, userData); }
    localStorage.setItem('betix_connected_users', JSON.stringify(connectedUsers));
    syncUserToSupabase();
}

// ============================================================
// ===== DARK MODE =====
// ============================================================

function toggleDarkMode(e) {
    if (e.target.checked) { document.body.classList.add('dark-mode'); localStorage.setItem('darkMode', 'true'); }
    else { document.body.classList.remove('dark-mode'); localStorage.setItem('darkMode', 'false'); }
}

// ============================================================
// ===== CLEAR DATA =====
// ============================================================

function clearAllData() {
    if (confirm('Delete all your data?')) { localStorage.clear(); location.reload(); }
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
    if (content) content.innerHTML = texts[type] || '<p>Information in progress</p>';
    if (modal) modal.classList.add('show');
    if (closeBtn) closeBtn.onclick = function() { modal.classList.remove('show'); };
    window.onclick = function(e) { if (e.target === modal) modal.classList.remove('show'); };
}

// ============================================================
// ===== FAQ =====
// ============================================================

var faqData = [
    [{ q: "What is Betix?", a: "Betix is the first decentralized event ticketing platform built on the Pi Network blockchain." }, { q: "How does Betix work?", a: "Betix uses the Pi Network blockchain to ensure secure and transparent transactions." }, { q: "Is Betix free?", a: "Yes! Betix is completely free for users. No commission on sales." }, { q: "Who can use Betix?", a: "Any Pi Network account holder can use Betix." }],
    [{ q: "How to buy a ticket?", a: "Connect, browse events, click 'Buy Ticket' and choose the quantity." }, { q: "Are payments secure?", a: "Yes, via the Pi Network and Betix's escrow system." }, { q: "Can I get a refund?", a: "Yes in case of cancellation, postponement or fraud." }, { q: "Where are my tickets stored?", a: "In the 'My Tickets' section of your account." }],
    [{ q: "How to create an event?", a: "Connect, click 'Create Event' and fill out the form." }, { q: "Conditions to be an organizer?", a: "Have an active Pi Network account and comply with the terms of use." }, { q: "Can I modify an event?", a: "Yes, from the 'My Events' section." }, { q: "How to boost my event?", a: "By paying a small amount in Pi to increase visibility." }],
    [{ q: "How to connect my Pi account?", a: "Click 'Connect Pi' in the menu and authorize access." }, { q: "What is the escrow system?", a: "A mechanism that blocks funds until event validation." }, { q: "Are transactions anonymous?", a: "Transactions are traceable on the blockchain, but your information remains private." }, { q: "Other cryptocurrencies?", a: "Currently only Pi Network." }],
    [{ q: "Buyer protection?", a: "Via escrow, organizer verification and a refund policy." }, { q: "Report a problem?", a: "Via chat, email or social networks." }, { q: "Contact support?", a: "Online chat, email or Telegram." }, { q: "Available languages?", a: "English, French, Portuguese, Chinese, Indonesian." }],
    [{ q: "Join the community?", a: "Follow us on Telegram, Twitter, Discord, Instagram and WhatsApp." }, { q: "Become an ambassador?", a: "Contact us to apply for the ambassador program." }, { q: "Become a partner?", a: "Contact us to discuss partnership opportunities." }, { q: "Future projects?", a: "Mobile app, new cryptocurrencies, social features." }]
];

var currentFaqPage = 0;

function renderFaqPage(pageIndex) {
    var container = document.getElementById('faqContainer');
    if (!container) return;
    var pageData = faqData[pageIndex] || faqData[0];
    var html = pageData.map((item, index) =>
        '<div class="faq-item" style="animation-delay: ' + (index * 0.04) + 's"><div class="faq-q"><span class="q-icon">Q</span>' + item.q + '</div><div class="faq-a">' + item.a + '</div></div>'
    ).join('');
    container.innerHTML = html;
    document.getElementById('faqPageNumber').textContent = pageIndex + 1;
    document.getElementById('faqTotalPages').textContent = faqData.length;
    document.getElementById('faqPrevBtn').disabled = pageIndex === 0;
    document.getElementById('faqNextBtn').disabled = pageIndex >= faqData.length - 1;
    var dotsContainer = document.getElementById('faqPageDots');
    if (dotsContainer) {
        dotsContainer.innerHTML = '';
        for (var i = 0; i < faqData.length; i++) {
            var dot = document.createElement('button');
            dot.className = 'faq-page-dot' + (i === pageIndex ? ' active' : '');
            dot.setAttribute('data-page', i);
            dot.addEventListener('click', function() {
                currentFaqPage = parseInt(this.getAttribute('data-page'));
                renderFaqPage(currentFaqPage);
                var faqContent = document.querySelector('.faq-page-content');
                if (faqContent) setTimeout(() => faqContent.scrollIntoView({ behavior: 'smooth', block: 'start' }), 100);
            });
            dotsContainer.appendChild(dot);
        }
    }
    var faqContent = document.querySelector('.faq-page-content');
    if (faqContent) setTimeout(() => faqContent.scrollIntoView({ behavior: 'smooth', block: 'start' }), 100);
}

function initFaqPagination() {
    document.getElementById('faqPrevBtn').addEventListener('click', function() {
        if (currentFaqPage > 0) { currentFaqPage--; renderFaqPage(currentFaqPage); }
    });
    document.getElementById('faqNextBtn').addEventListener('click', function() {
        if (currentFaqPage < faqData.length - 1) { currentFaqPage++; renderFaqPage(currentFaqPage); }
    });
}

function initFaq() {
    console.log('Initializing FAQ...');
    renderFaqPage(0);
    initFaqPagination();
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
    if (!widget) return;
    var msgs = document.getElementById('chatMessages');

    function addMessage(m) {
        if (!msgs) return;
        var d = document.createElement('div');
        d.className = 'chat-message ' + (m.isUser ? 'user' : 'support');
        d.innerHTML = '<div class="message-bubble">' + escapeHtml(m.text) + '</div><span class="message-time">' + m.time + '</span>';
        msgs.appendChild(d);
        msgs.scrollTop = msgs.scrollHeight;
    }

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
        chatMessages.forEach(addMessage);
    }

    if (btn) btn.addEventListener('click', function() { widget.classList.toggle('open'); });
    if (close) close.addEventListener('click', function() { widget.classList.remove('open'); });

    function sendMsg() {
        var msg = input.value.trim();
        if (!msg) return;
        var newMsg = {
            id: Date.now(), text: msg, sender: currentUser.wallet || currentUser.name,
            isUser: true, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            timestamp: new Date().toISOString()
        };
        chatMessages.push(newMsg);
        saveChatMessages();
        addMessage(newMsg);
        input.value = '';
        setTimeout(function() {
            var resp = "Thank you! Quick response by email: betixservices@gmail.com";
            if (msg.toLowerCase().includes('ticket')) resp = "Your tickets are in the 'My Tickets' section.";
            else if (msg.toLowerCase().includes('payment')) resp = "Payments are secured via Pi Network.";
            var auto = {
                id: Date.now() + 1, text: resp, sender: 'Betix Support',
                isUser: false, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
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
    var modal = document.getElementById('legalModal');
    var content = document.getElementById('modalContent');
    var close = document.querySelector('#legalModal .modal-close');
    if (close) close.onclick = function() { modal.classList.remove('show'); };
    window.onclick = function(e) { if (e.target === modal) modal.classList.remove('show'); };
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
            setTimeout(function() { loader.style.display = 'none'; main.style.display = 'block'; }, 500);
        }, 800);
    }

    detectLanguage();

    // Charger les tickets depuis localStorage d'abord
    var savedTickets = localStorage.getItem('betix_tickets');
    if (savedTickets) {
        try { tickets = JSON.parse(savedTickets); console.log('Tickets loaded from localStorage:', tickets.length); }
        catch (e) { console.error('Error parsing saved tickets:', e); tickets = []; }
    }

    var savedEvents = localStorage.getItem('betix_events');
    if (savedEvents) {
        try { events = JSON.parse(savedEvents); console.log('Events loaded from localStorage:', events.length); }
        catch (e) { console.error('Error parsing saved events:', e); events = []; }
    }

    if (!events || !events.length) { events = JSON.parse(JSON.stringify(demoEvents)); saveEvents(); }

    initCountrySelectors();
    calculateLoyaltyPoints();
    initFilters();
    renderEventsByCategory();
    updateUserInfo();
    updateProfilePage();
    updateAllProfileImages();
    updateNotifBadgeHeader();
    initAdmin();
    initChat();
    initLegalModals();

    var dark = document.getElementById('darkModeToggle');
    if (localStorage.getItem('darkMode') === 'true') { if (dark) dark.checked = true; document.body.classList.add('dark-mode'); }
    if (dark) dark.addEventListener('change', toggleDarkMode);

    initHeroSlider();
    initFaq();
    renderAdminLogs();

    var storedPassword = localStorage.getItem('betix_admin_password');
    if (storedPassword === adminPassword || storedPassword === 'Betix@2026#') {
        var adminBtn = document.getElementById('adminMenuItem');
        if (adminBtn) { adminBtn.style.display = 'block'; adminBtn.style.background = 'linear-gradient(135deg, #1a1a2e, #0D47A1)'; adminBtn.style.color = 'white'; }
        if (document.getElementById('adminPage') && document.getElementById('adminPage').style.display !== 'none') startAdminSession();
    }

    var menuBtn = document.getElementById('menuBtn');
    var closeSidebarBtn = document.getElementById('closeSidebarBtn');
    var overlay = document.getElementById('overlay');
    var eventForm = document.getElementById('eventForm');
    var searchInput = document.getElementById('searchInput');
    var clearDataBtn = document.getElementById('clearDataBtn');
    var backBtn = document.getElementById('backBtn');

    var profilePhotoInputSidebar = document.getElementById('profilePhotoInputSidebar');
    if (profilePhotoInputSidebar) {
        profilePhotoInputSidebar.addEventListener('change', function() {
            if (this.files && this.files[0]) handleProfilePhotoUpload(this.files[0]);
        });
    }

    var profilePhotoInputPage = document.getElementById('profilePhotoInputPage');
    if (profilePhotoInputPage) {
        profilePhotoInputPage.addEventListener('change', function() {
            if (this.files && this.files[0]) handleProfilePhotoUpload(this.files[0]);
        });
    }

    updateConnectButtons();

    var confirmPublishBtn = document.getElementById('confirmPublishBtn');
    if (confirmPublishBtn) confirmPublishBtn.addEventListener('click', confirmPublishEvent);

    var confirmBuyBtn = document.getElementById('confirmBuyBtn');
    if (confirmBuyBtn) confirmBuyBtn.addEventListener('click', confirmPurchaseFromPopup);

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
            if (e.target.tagName !== 'INPUT') adminImageInput.click();
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
                if (files && files.length && inputFile) {
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

    setTimeout(loadAllFromSupabase, 1000);

    setInterval(function() {
        syncEventsToSupabase();
        syncTicketsToSupabase();
        syncUserToSupabase();
        syncNotificationsToSupabase();
    }, 60000);

    window.addEventListener('beforeunload', function() {
        syncEventsToSupabase();
        syncTicketsToSupabase();
        syncUserToSupabase();
        syncNotificationsToSupabase();
    });

    if (currentUser.wallet && isSessionExpired()) disconnectPi();
});

console.log('Betix loaded successfully!');
console.log('Admin: 5 clicks on logo + password Betix@2026#');