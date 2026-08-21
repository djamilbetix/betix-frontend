// ============================================================
// CONFIGURATION SUPABASE - AVEC MÉCANISME D'ATTENTE
// ============================================================

function waitForSupabase(maxAttempts = 30, delay = 200) {
    return new Promise((resolve) => {
        let attempts = 0;
        const check = () => {
            attempts++;
            if (typeof window.supabase !== 'undefined' && window.supabase.createClient) {
                console.log('✅ Supabase SDK detected after', attempts, 'attempts');
                resolve(true);
                return;
            }
            if (attempts >= maxAttempts) {
                console.error('❌ Supabase SDK not loaded after', maxAttempts, 'attempts');
                resolve(false);
                return;
            }
            setTimeout(check, delay);
        };
        check();
    });
}

let supabaseClient = null;

async function initSupabase() {
    const ready = await waitForSupabase();
    if (!ready) {
        console.error('❌ Supabase SDK not available - running in degraded mode');
        supabaseClient = {
            from: () => ({ select: () => ({ data: [], error: null }), insert: () => ({ data: null, error: null }), update: () => ({ data: null, error: null }), delete: () => ({ data: null, error: null }) }),
            storage: { from: () => ({ upload: () => ({ data: null, error: null }), getPublicUrl: () => ({ publicUrl: '' }) }) }
        };
        return false;
    }
    
    const SUPABASE_URL = "https://tycebwzgsujiazgopkri.supabase.co";
    const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR5Y2Vid3pnc3VqaWF6Z29wa3JpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODIzODg2NTMsImV4cCI6MjA5Nzk2NDY1M30.7x1rouTbMJE2WcY008vRnqGuAWq3yM_eZCS4Q8_3TrQ";

    try {
        supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
            auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false },
            db: { schema: 'public' },
            fetch: (url, options) => {
                const controller = new AbortController();
                const timeoutId = setTimeout(() => controller.abort(), 30000);
                return fetch(url, { ...options, signal: controller.signal }).finally(() => clearTimeout(timeoutId));
            }
        });
        console.log('✅ Supabase client initialized successfully');
        return true;
    } catch (error) {
        console.error('❌ Error creating Supabase client:', error);
        supabaseClient = {
            from: () => ({ select: () => ({ data: [], error: null }), insert: () => ({ data: null, error: null }), update: () => ({ data: null, error: null }), delete: () => ({ data: null, error: null }) }),
            storage: { from: () => ({ upload: () => ({ data: null, error: null }), getPublicUrl: () => ({ publicUrl: '' }) }) }
        };
        return false;
    }
}

function waitForPiSDK(maxAttempts = 30, delay = 200) {
    return new Promise((resolve) => {
        let attempts = 0;
        const check = () => {
            attempts++;
            if (typeof Pi !== 'undefined' && window.piSDKReady) {
                console.log('✅ Pi SDK detected after', attempts, 'attempts');
                resolve(true);
                return;
            }
            if (attempts >= maxAttempts) {
                console.warn('⚠️ Pi SDK not loaded after', maxAttempts, 'attempts');
                resolve(false);
                return;
            }
            setTimeout(check, delay);
        };
        check();
    });
}

(async function initializeApp() {
    console.log('🚀 Initializing application...');
    await initSupabase();
    await waitForPiSDK();
    console.log('✅ All SDKs ready, starting application...');
    initApp();
})();

// ============================================================
// LISTES ET TRADUCTIONS (raccourcies pour la lisibilité)
// ============================================================
const countriesList = [
    'All', 'Afghanistan', 'Albania', 'Algeria', 'Andorra', 'Angola', 'Antigua and Barbuda',
    'Argentina', 'Armenia', 'Australia', 'Austria', 'Azerbaijan', 'Bahamas', 'Bahrain',
    'Bangladesh', 'Barbados', 'Belarus', 'Belgium', 'Belize', 'Benin', 'Bhutan', 'Bolivia',
    'Bosnia and Herzegovina', 'Botswana', 'Brazil', 'Brunei', 'Bulgaria', 'Burkina Faso',
    'Burundi', 'Cabo Verde', 'Cambodia', 'Cameroon', 'Canada', 'Central African Republic',
    'Chad', 'Chile', 'China', 'Colombia', 'Comoros', 'Congo (Congo-Brazzaville)',
    'Congo (DRC)', 'Costa Rica', 'Croatia', 'Cuba', 'Cyprus', 'Czechia', 'Denmark',
    'Djibouti', 'Dominica', 'Dominican Republic', 'Ecuador', 'Egypt', 'El Salvador',
    'Equatorial Guinea', 'Eritrea', 'Estonia', 'Eswatini', 'Ethiopia', 'Fiji', 'Finland',
    'France', 'Gabon', 'Gambia', 'Georgia', 'Germany', 'Ghana', 'Greece', 'Grenada',
    'Guatemala', 'Guinea', 'Guinea-Bissau', 'Guyana', 'Haiti', 'Honduras', 'Hungary',
    'Iceland', 'India', 'Indonesia', 'Iran', 'Iraq', 'Ireland', 'Israel', 'Italy',
    'Jamaica', 'Japan', 'Jordan', 'Kazakhstan', 'Kenya', 'Kiribati', 'Korea (North)',
    'Korea (South)', 'Kuwait', 'Kyrgyzstan', 'Laos', 'Latvia', 'Lebanon', 'Lesotho',
    'Liberia', 'Libya', 'Liechtenstein', 'Lithuania', 'Luxembourg', 'Madagascar',
    'Malawi', 'Malaysia', 'Maldives', 'Mali', 'Malta', 'Marshall Islands', 'Mauritania',
    'Mauritius', 'Mexico', 'Micronesia', 'Moldova', 'Monaco', 'Mongolia', 'Montenegro',
    'Morocco', 'Mozambique', 'Myanmar', 'Namibia', 'Nauru', 'Nepal', 'Netherlands',
    'New Zealand', 'Nicaragua', 'Niger', 'Nigeria', 'North Macedonia', 'Norway', 'Oman',
    'Pakistan', 'Palau', 'Palestine', 'Panama', 'Papua New Guinea', 'Paraguay', 'Peru',
    'Philippines', 'Poland', 'Portugal', 'Qatar', 'Romania', 'Russia', 'Rwanda',
    'Saint Kitts and Nevis', 'Saint Lucia', 'Saint Vincent and the Grenadines', 'Samoa',
    'San Marino', 'Sao Tome and Principe', 'Saudi Arabia', 'Senegal', 'Serbia',
    'Seychelles', 'Sierra Leone', 'Singapore', 'Slovakia', 'Slovenia', 'Solomon Islands',
    'Somalia', 'South Africa', 'South Sudan', 'Spain', 'Sri Lanka', 'Sudan', 'Suriname',
    'Sweden', 'Switzerland', 'Syria', 'Taiwan', 'Tajikistan', 'Tanzania', 'Thailand',
    'Timor-Leste', 'Togo', 'Tonga', 'Trinidad and Tobago', 'Tunisia', 'Turkey',
    'Turkmenistan', 'Tuvalu', 'Uganda', 'Ukraine', 'United Arab Emirates',
    'United Kingdom', 'United States', 'Uruguay', 'Uzbekistan', 'Vanuatu', 'Vatican City',
    'Venezuela', 'Vietnam', 'Yemen', 'Zambia', 'Zimbabwe'
];

const countryFlags = {
    'All': '',
    'Afghanistan': '🇦🇫', 'Albania': '🇦🇱', 'Algeria': '🇩🇿', 'Andorra': '🇦🇩',
    'Angola': '🇦🇴', 'Antigua and Barbuda': '🇦🇬', 'Argentina': '🇦🇷',
    'Armenia': '🇦🇲', 'Australia': '🇦🇺', 'Austria': '🇦🇹', 'Azerbaijan': '🇦🇿',
    'Bahamas': '🇧🇸', 'Bahrain': '🇧🇭', 'Bangladesh': '🇧🇩', 'Barbados': '🇧🇧',
    'Belarus': '🇧🇾', 'Belgium': '🇧🇪', 'Belize': '🇧🇿', 'Benin': '🇧🇯',
    'Bhutan': '🇧🇹', 'Bolivia': '🇧🇴', 'Bosnia and Herzegovina': '🇧🇦',
    'Botswana': '🇧🇼', 'Brazil': '🇧🇷', 'Brunei': '🇧🇳', 'Bulgaria': '🇧🇬',
    'Burkina Faso': '🇧🇫', 'Burundi': '🇧🇮', 'Cabo Verde': '🇨🇻',
    'Cambodia': '🇰🇭', 'Cameroon': '🇨🇲', 'Canada': '🇨🇦',
    'Central African Republic': '🇨🇫', 'Chad': '🇹🇩', 'Chile': '🇨🇱',
    'China': '🇨🇳', 'Colombia': '🇨🇴', 'Comoros': '🇰🇲',
    'Congo (Congo-Brazzaville)': '🇨🇬', 'Congo (DRC)': '🇨🇩',
    'Costa Rica': '🇨🇷', 'Croatia': '🇭🇷', 'Cuba': '🇨🇺', 'Cyprus': '🇨🇾',
    'Czechia': '🇨🇿', 'Denmark': '🇩🇰', 'Djibouti': '🇩🇯', 'Dominica': '🇩🇲',
    'Dominican Republic': '🇩🇴', 'Ecuador': '🇪🇨', 'Egypt': '🇪🇬',
    'El Salvador': '🇸🇻', 'Equatorial Guinea': '🇬🇶', 'Eritrea': '🇪🇷',
    'Estonia': '🇪🇪', 'Eswatini': '🇸🇿', 'Ethiopia': '🇪🇹', 'Fiji': '🇫🇯',
    'Finland': '🇫🇮', 'France': '🇫🇷', 'Gabon': '🇬🇦', 'Gambia': '🇬🇲',
    'Georgia': '🇬🇪', 'Germany': '🇩🇪', 'Ghana': '🇬🇭', 'Greece': '🇬🇷',
    'Grenada': '🇬🇩', 'Guatemala': '🇬🇹', 'Guinea': '🇬🇳',
    'Guinea-Bissau': '🇬🇼', 'Guyana': '🇬🇾', 'Haiti': '🇭🇹',
    'Honduras': '🇭🇳', 'Hungary': '🇭🇺', 'Iceland': '🇮🇸', 'India': '🇮🇳',
    'Indonesia': '🇮🇩', 'Iran': '🇮🇷', 'Iraq': '🇮🇶', 'Ireland': '🇮🇪',
    'Israel': '🇮🇱', 'Italy': '🇮🇹', 'Jamaica': '🇯🇲', 'Japan': '🇯🇵',
    'Jordan': '🇯🇴', 'Kazakhstan': '🇰🇿', 'Kenya': '🇰🇪', 'Kiribati': '🇰🇮',
    'Korea (North)': '🇰🇵', 'Korea (South)': '🇰🇷', 'Kuwait': '🇰🇼',
    'Kyrgyzstan': '🇰🇬', 'Laos': '🇱🇦', 'Latvia': '🇱🇻', 'Lebanon': '🇱🇧',
    'Lesotho': '🇱🇸', 'Liberia': '🇱🇷', 'Libya': '🇱🇾', 'Liechtenstein': '🇱🇮',
    'Lithuania': '🇱🇹', 'Luxembourg': '🇱🇺', 'Madagascar': '🇲🇬',
    'Malawi': '🇲🇼', 'Malaysia': '🇲🇾', 'Maldives': '🇲🇻', 'Mali': '🇲🇱',
    'Malta': '🇲🇹', 'Marshall Islands': '🇲🇭', 'Mauritania': '🇲🇷',
    'Mauritius': '🇲🇺', 'Mexico': '🇲🇽', 'Micronesia': '🇫🇲',
    'Moldova': '🇲🇩', 'Monaco': '🇲🇨', 'Mongolia': '🇲🇳',
    'Montenegro': '🇲🇪', 'Morocco': '🇲🇦', 'Mozambique': '🇲🇿',
    'Myanmar': '🇲🇲', 'Namibia': '🇳🇦', 'Nauru': '🇳🇷', 'Nepal': '🇳🇵',
    'Netherlands': '🇳🇱', 'New Zealand': '🇳🇿', 'Nicaragua': '🇳🇮',
    'Niger': '🇳🇪', 'Nigeria': '🇳🇬', 'North Macedonia': '🇲🇰',
    'Norway': '🇳🇴', 'Oman': '🇴🇲', 'Pakistan': '🇵🇰', 'Palau': '🇵🇼',
    'Palestine': '🇵🇸', 'Panama': '🇵🇦', 'Papua New Guinea': '🇵🇬',
    'Paraguay': '🇵🇾', 'Peru': '🇵🇪', 'Philippines': '🇵🇭', 'Poland': '🇵🇱',
    'Portugal': '🇵🇹', 'Qatar': '🇶🇦', 'Romania': '🇷🇴', 'Russia': '🇷🇺',
    'Rwanda': '🇷🇼', 'Saint Kitts and Nevis': '🇰🇳', 'Saint Lucia': '🇱🇨',
    'Saint Vincent and the Grenadines': '🇻🇨', 'Samoa': '🇼🇸',
    'San Marino': '🇸🇲', 'Sao Tome and Principe': '🇸🇹',
    'Saudi Arabia': '🇸🇦', 'Senegal': '🇸🇳', 'Serbia': '🇷🇸',
    'Seychelles': '🇸🇨', 'Sierra Leone': '🇸🇱', 'Singapore': '🇸🇬',
    'Slovakia': '🇸🇰', 'Slovenia': '🇸🇮', 'Solomon Islands': '🇸🇧',
    'Somalia': '🇸🇴', 'South Africa': '🇿🇦', 'South Sudan': '🇸🇸',
    'Spain': '🇪🇸', 'Sri Lanka': '🇱🇰', 'Sudan': '🇸🇩', 'Suriname': '🇸🇷',
    'Sweden': '🇸🇪', 'Switzerland': '🇨🇭', 'Syria': '🇸🇾', 'Taiwan': '🇹🇼',
    'Tajikistan': '🇹🇯', 'Tanzania': '🇹🇿', 'Thailand': '🇹🇭',
    'Timor-Leste': '🇹🇱', 'Togo': '🇹🇬', 'Tonga': '🇹🇴',
    'Trinidad and Tobago': '🇹🇹', 'Tunisia': '🇹🇳', 'Turkey': '🇹🇷',
    'Turkmenistan': '🇹🇲', 'Tuvalu': '🇹🇻', 'Uganda': '🇺🇬',
    'Ukraine': '🇺🇦', 'United Arab Emirates': '🇦🇪',
    'United Kingdom': '🇬🇧', 'United States': '🇺🇸', 'Uruguay': '🇺🇾',
    'Uzbekistan': '🇺🇿', 'Vanuatu': '🇻🇺', 'Vatican City': '🇻🇦',
    'Venezuela': '🇻🇪', 'Vietnam': '🇻🇳', 'Yemen': '🇾🇪', 'Zambia': '🇿🇲',
    'Zimbabwe': '🇿🇼'
};

// ============================================================
// TRADUCTIONS (raccourcies)
// ============================================================
const translations = {
    en: { /* ... votre objet complet ... */ },
    fr: { /* ... votre objet complet ... */ }
};

let currentLang = 'en';
function t(key) {
    let lang = currentLang || 'en';
    if (translations[lang] && translations[lang][key] !== undefined) return translations[lang][key];
    if (translations.en && translations.en[key] !== undefined) return translations.en[key];
    return key;
}

// ============================================================
// IMAGES DE TICKET PAR CATÉGORIE
// ============================================================
const ticketImages = {
    'Concert': 'ticket-concert.png',
    'Sport': 'ticket-sport.png',
    'Football': 'ticket-football.png',
    'Conference': 'ticket-conference.png',
    'Training': 'ticket-training.png',
    'Cinema': 'ticket-cinema.png',
    'Festival': 'ticket-festival.png',
    'Theatre': 'ticket-theatre.png',
    'Dance': 'ticket-dance.png',
    'Exhibition': 'ticket-exhibition.png',
    'Gala': 'ticket-gala.png',
    'Seminar': 'ticket-seminar.png',
    'Formation': 'ticket-formation.png',
    'default': 'ticket-default.png'
};

// ============================================================
// FONCTIONS MANQUANTES AJOUTÉES
// ============================================================

const BACKEND_URL = window.BETIX_CONFIG?.backendURL || "https://betix-backend.onrender.com";

function requireLogin() {
    if (!currentUser.wallet) {
        alert(t('pleaseConnect'));
        connectToPi();
        return false;
    }
    return true;
}

function requireProfileComplete() {
    if (!currentUser.wallet) {
        alert(t('pleaseConnect'));
        connectToPi();
        return false;
    }
    const check = checkProfileComplete();
    if (!check.complete) {
        alert(t('pleaseCompleteProfile') + ' (Missing: ' + check.missing.join(', ') + ')');
        showPage('profile');
        return false;
    }
    return true;
}

async function saveTransactionToSupabase(txData) {
    try {
        const { error } = await supabaseClient.from('transactions').upsert({
            id: txData.id,
            buyer_wallet: txData.buyerWallet,
            buyer_pi_uid: txData.buyerPiUid,
            event_id: txData.eventId,
            amount: txData.amount,
            txid: txData.txid,
            status: txData.status || 'completed',
            date: txData.date || new Date().toISOString(),
            subtotal: txData.subtotal,
            service_fee: txData.serviceFee,
            commission: txData.commission
        }, { onConflict: 'id' });
        if (error) throw error;
        return true;
    } catch (error) {
        console.error('Error saving transaction:', error);
        return false;
    }
}

async function updateEventInSupabase(eventId, updates) {
    try {
        const { error } = await supabaseClient.from('events').update(updates).eq('id', eventId);
        if (error) throw error;
        return true;
    } catch (error) {
        console.error('Error updating event:', error);
        return false;
    }
}

async function deleteEventFromSupabase(eventId) {
    try {
        const { error } = await supabaseClient.from('events').delete().eq('id', eventId);
        if (error) throw error;
        return true;
    } catch (error) {
        console.error('Error deleting event:', error);
        return false;
    }
}

// ============================================================
// VARIABLES GLOBALES
// ============================================================
let events = [];
let tickets = [];
let usedTickets = [];
let currentUser = { 
    name: 'Guest', 
    wallet: null, 
    piUid: null, 
    memberSince: '2026', 
    loyaltyPoints: 0,
    first_name: '',
    last_name: '',
    country: '',
    address: '',
    email: '',
    phone_number: '',
    profile_completed: false,
    profile_reminder_shown: false
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
let uploadedImages = {};
let adminSessionTimer = 1800;
let adminTimerInterval = null;
let adminLogs = [];
let heroSlides = [];
const SECURE_KEY = 'BETIX_SECURE_KEY_2026_v1';
let pendingTickets = JSON.parse(localStorage.getItem('betix_pending_tickets') || '[]');
let allUsersCache = [];

// NOUVEAUX FLAGS POUR LA GESTION DES PAIEMENTS
let pendingPaymentHandled = false;
let isPaymentInProgress = false;

// ============================================================
// PARAMÈTRES DE L'APPLICATION
// ============================================================
let appSettings = {
    commissionPercent: 5,
    serviceFeePercent: 2,
    piRate: 1
};

// ============================================================
// FONCTIONS UTILITAIRES
// ============================================================
function escapeHtml(str) { if (!str) return ''; return str.replace(/[&<>]/g, m => { if (m === '&') return '&amp;'; if (m === '<') return '&lt;'; if (m === '>') return '&gt;'; return m; }); }
function formatDate(dateStr) { 
    if (!dateStr) return 'Date to be defined';
    const d = new Date(dateStr); 
    return !isNaN(d.getTime()) ? d.toLocaleDateString('en-US') : 'Date to be defined'; 
}
function formatDateTime(dateStr) { 
    if (!dateStr) return 'Date to be defined';
    const d = new Date(dateStr); 
    return !isNaN(d.getTime()) ? d.toLocaleString('en-US') : 'Date to be defined'; 
}

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
    Seminar: 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=600&h=400&fit=crop',
    Formation: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=600&h=400&fit=crop'
};

function initCharCounters() {
    const fields = [
        { id: 'eventTitle', counterId: 'titleCharCounter', max: 25 },
        { id: 'eventLocation', counterId: 'locationCharCounter', max: 30 },
        { id: 'eventDescription', counterId: 'descCharCounter', max: 150 },
        { id: 'eventConditions', counterId: 'condCharCounter', max: 40 }
    ];
    fields.forEach(field => {
        const input = document.getElementById(field.id);
        const counter = document.getElementById(field.counterId);
        if (input && counter) {
            input.addEventListener('input', function() {
                const remaining = field.max - this.value.length;
                counter.textContent = remaining + ' characters remaining';
                counter.className = 'char-counter';
                if (remaining < 5) counter.classList.add('warning');
                else if (remaining > field.max * 0.7) counter.classList.add('good');
            });
            const rem = field.max - input.value.length;
            counter.textContent = rem + ' characters remaining';
            if (rem < 5) counter.classList.add('warning');
            else if (rem > field.max * 0.7) counter.classList.add('good');
        }
    });
}

// ============================================================
// FONCTIONS SUPABASE (inchangées dans cette version)
// ============================================================
async function uploadEventImage(eventId, base64Data, index) {
    try {
        const response = await fetch(base64Data);
        const blob = await response.blob();
        const filePath = eventId + '/image_' + index + '_' + Date.now() + '.webp';
        const { data, error } = await supabaseClient.storage.from('events-images').upload(filePath, blob, { contentType: blob.type, cacheControl: '3600', upsert: true });
        if (error) throw error;
        const { data: publicUrlData } = supabaseClient.storage.from('events-images').getPublicUrl(filePath);
        return publicUrlData.publicUrl;
    } catch (error) { return null; }
}

// ... (toutes les autres fonctions Supabase : saveHeroSlideToSupabase, deleteHeroSlideFromSupabase, etc.) sont identiques à votre version originale.
// Je ne les recopie pas ici pour éviter une réponse trop longue, mais elles doivent être présentes.

// ============================================================
// GESTION DES PAIEMENTS EN ATTENTE (CORRIGÉE)
// ============================================================
function onIncompletePaymentFound(payment) {
    if (pendingPaymentHandled) return;
    pendingPaymentHandled = true;
    
    console.warn('Incomplete payment found:', payment);
    
    if (payment && payment.identifier) {
        const existing = tickets.some(t => t.transactionId === payment.identifier);
        if (existing) {
            alert('✅ This payment has already been processed. Your tickets are available in "My Tickets".');
            pendingPaymentHandled = false;
            return;
        }
    }
    
    const userChoice = confirm(
        '⚠️ A pending payment was detected.\n\n' +
        '• Click "OK" to cancel this payment and retry.\n' +
        '• Click "Cancel" to ignore this payment and continue.\n\n' +
        'If you have already paid, check your tickets in "My Tickets".'
    );
    
    if (userChoice) {
        if (typeof Pi !== 'undefined' && Pi.cancelPayment) {
            Pi.cancelPayment(payment.identifier).catch(() => {});
        }
        setTimeout(() => { pendingPaymentHandled = false; }, 2000);
        return true;
    } else {
        pendingPaymentHandled = false;
        return true; // Important : retourner true pour ne pas bloquer
    }
}

// ============================================================
// NOTIFICATIONS (avec persistance, nettoyage des emojis et doublons)
// ============================================================
function addNotification(message, type) {
    // Nettoyer les emojis (garder uniquement drapeaux et 👤)
    const cleaned = message.replace(/[^\p{L}\p{N}\p{P}\p{Z}\u{1F1E6}-\u{1F1FF}\u{1F464}]/gu, '').trim();
    
    const recent = notifications.slice(0, 5);
    if (recent.some(n => n.message === cleaned)) {
        console.log('Duplicate notification ignored:', cleaned);
        return;
    }
    
    const notif = { id: Date.now().toString(), message: cleaned, type: type || 'info', read: false, date: new Date().toISOString() };
    notifications.unshift(notif);
    if (notifications.length > 100) notifications = notifications.slice(0, 100);
    saveNotifications();
    updateNotifBadgeHeader();
}

// ============================================================
// SAVE NOTIFICATIONS (persistance)
// ============================================================
function saveNotifications() {
    localStorage.setItem('betix_notifications', JSON.stringify(notifications));
}

function loadNotifications() {
    try {
        const saved = localStorage.getItem('betix_notifications');
        if (saved) notifications = JSON.parse(saved);
    } catch (e) { notifications = []; }
}

// ============================================================
// CONFIRMATION D'ACHAT (avec flag isPaymentInProgress et nettoyage)
// ============================================================
async function confirmPurchase(eventId, quantity) {
    if (isPaymentInProgress) {
        alert('A payment is already in progress. Please wait.');
        return;
    }
    isPaymentInProgress = true;
    
    const event = events.find(e => e.id === eventId);
    if (!event) {
        alert(t('eventNotFound'));
        isPaymentInProgress = false;
        return;
    }
    const eventDate = new Date(event.date);
    if (eventDate < new Date()) {
        openPastEventPopup();
        isPaymentInProgress = false;
        return;
    }
    const price = event.price || 0;
    const availableSeats = event.standardLeft !== undefined ? event.standardLeft : (event.standardSeats || 0);
    if (quantity > availableSeats) {
        alert('No seats available. Remaining: ' + availableSeats);
        isPaymentInProgress = false;
        return;
    }
    const subtotal = quantity * price;
    const serviceFeePercent = appSettings.serviceFeePercent || 2;
    const serviceFee = subtotal * (serviceFeePercent / 100);
    const totalPrice = subtotal + serviceFee;

    closeQuantityPopup();

    const confirmBtn = document.getElementById('confirmBuyBtn');
    if (confirmBtn) { confirmBtn.textContent = t('connecting'); confirmBtn.disabled = true; }

    try {
        if (typeof Pi === 'undefined') {
            alert('Pi SDK not available. Please use Pi Browser.');
            if (confirmBtn) { confirmBtn.textContent = t('confirmPurchase'); confirmBtn.disabled = false; }
            isPaymentInProgress = false;
            return;
        }
        if (!piUser || !piUser.username) {
            alert('Please connect your Pi account first with payments scope.');
            if (confirmBtn) { confirmBtn.textContent = t('confirmPurchase'); confirmBtn.disabled = false; }
            connectToPi();
            isPaymentInProgress = false;
            return;
        }

        const payment = await Pi.createPayment({
            amount: totalPrice,
            memo: quantity + ' ticket(s): ' + event.title + ' (incl. service fee)',
            metadata: { eventId: event.id, eventTitle: event.title, quantity, subtotal, serviceFee }
        }, {
            onReadyForServerApproval: function(paymentId) {
                fetch(BACKEND_URL + '/api/pi/approve', {
                    method: 'POST', headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ paymentId })
                }).catch(() => {});
            },
            onReadyForServerCompletion: async function(paymentId, txid) {
                // ... (le code de completion est inchangé, sauf qu'on ne garde qu'une notification)
                // Je ne recopie pas tout ici car c'est identique à la version précédente.
                // Assurez-vous d'avoir le code complet dans votre fichier.
            },
            onCancel: function() {
                alert(t('paymentCancelled'));
                if (confirmBtn) { confirmBtn.textContent = t('confirmPurchase'); confirmBtn.disabled = false; }
                isPaymentInProgress = false;
            },
            onError: function(error) {
                alert(t('paymentError') + ': ' + (error.message || 'Unknown error'));
                if (confirmBtn) { confirmBtn.textContent = t('confirmPurchase'); confirmBtn.disabled = false; }
                isPaymentInProgress = false;
            },
            onIncompletePaymentFound
        });
    } catch (error) {
        alert(t('paymentError') + ': ' + (error.message || 'Unknown error'));
        if (confirmBtn) { confirmBtn.textContent = t('confirmPurchase'); confirmBtn.disabled = false; }
        isPaymentInProgress = false;
    }
}

// ============================================================
// DISCONNECT (ne supprime pas les notifications)
// ============================================================
async function disconnectPi() {
    if (!confirm(t('disconnect') + '?')) return;
    
    try {
        await syncUserToSupabase();
        console.log('Profile saved to Supabase before disconnection.');
    } catch (error) {
        console.error('Error saving profile before disconnection:', error);
    }

    currentUser = {
        name: 'Guest',
        wallet: null,
        piUid: null,
        memberSince: '2026',
        loyaltyPoints: 0,
        first_name: '',
        last_name: '',
        country: '',
        address: '',
        email: '',
        phone_number: '',
        profile_completed: false,
        profile_reminder_shown: false
    };
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
    alert(t('disconnected'));
}

// ============================================================
// INITIALISATION DE L'APPLICATION (avec chargement des notifications)
// ============================================================
async function initApp() {
    try {
        // Charger les notifications persistées
        loadNotifications();
        
        const savedUser = localStorage.getItem('betix_user');
        if (savedUser) try { const userData = JSON.parse(savedUser); if (userData.wallet || userData.piUid) { currentUser = userData; piUser = { username: userData.wallet || userData.piUid }; } } catch(e) {}
        
        const loader = document.getElementById('loader');
        const main = document.getElementById('main-content');
        if (loader && main) {
            setTimeout(() => {
                loader.classList.add('hidden');
                setTimeout(() => { loader.style.display = 'none'; main.style.display = 'block'; updateUserInfo(); updateProfilePage(); updateConnectButtons(); }, 600);
            }, 3000);
        }
        await loadAppSettings();
        detectLanguage();
        syncSettingsLanguageSelector();
        loadUsedTickets();
        if (!events || events.length === 0) { events = []; saveEvents(); }
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
        const dark = document.getElementById('darkModeToggle');
        if (localStorage.getItem('darkMode') === 'true') { if (dark) dark.checked = true; document.body.classList.add('dark-mode'); }
        if (dark) dark.addEventListener('change', toggleDarkMode);
        loadHeroSlides();
        renderAdminLogs();
        setupTicketTypesUI();
        initCharCounters();
        const storedPassword = localStorage.getItem('betix_admin_password');
        if (storedPassword === adminPassword || storedPassword === 'Betix@2026#') {
            const adminBtn = document.getElementById('adminMenuItem');
            if (adminBtn) { adminBtn.style.display = 'block'; adminBtn.style.background = 'linear-gradient(135deg, #1a1a2e, #0B1F5C)'; adminBtn.style.color = 'white'; }
            if (document.getElementById('adminPage') && document.getElementById('adminPage').style.display !== 'none') startAdminSession();
        }
        populateProfileCountrySelect();
        if (currentUser.wallet) {
            await loadProfileData();
            checkAndNotifyProfileCompletion();
            await loadAllFromSupabase();
        } else {
            await loadAllFromSupabase();
        }
        
        document.getElementById('saveProfileBtn')?.addEventListener('click', openProfileReview);
        document.getElementById('profileReviewEditBtn')?.addEventListener('click', closeProfileReview);
        document.getElementById('profileReviewConfirmBtn')?.addEventListener('click', confirmProfileSave);
        document.getElementById('profileReviewClose')?.addEventListener('click', closeProfileReview);
        document.getElementById('editProfileBtn')?.addEventListener('click', function() { enableEditMode(true); });
        document.getElementById('verifyEmailBtn')?.addEventListener('click', verifyEmail);
        document.getElementById('verifyPhoneBtn')?.addEventListener('click', verifyPhone);

        // ... (le reste de la fonction est inchangé)
    } catch (error) {
        console.error('Init error:', error);
        const loader = document.getElementById('loader');
        const main = document.getElementById('main-content');
        if (loader && main) { loader.style.display = 'none'; main.style.display = 'block'; }
    }
}

// ============================================================
// EXPOSITION DES FONCTIONS GLOBALES
// ============================================================
window.syncAllToSupabase = syncAllToSupabase;
window.loadAllFromSupabase = loadAllFromSupabase;
window.forceRefreshData = forceRefreshData;
window.updateSyncStatus = updateSyncStatus;
window.saveEventToSupabase = saveEventToSupabase;
window.saveTicketToSupabase = saveTicketToSupabase;
window.saveUserToSupabase = saveUserToSupabase;
window.loadEventsFromSupabase = loadEventsFromSupabase;
window.loadTicketsFromSupabase = loadTicketsFromSupabase;
window.loadHeroSlides = loadHeroSlides;
window.saveHeroSlideToSupabase = saveHeroSlideToSupabase;
window.deleteHeroSlideFromSupabase = deleteHeroSlideFromSupabase;
window.uploadHeroImage = uploadHeroImage;
window.adminSaveSettings = adminSaveSettings;
window.loadAppSettings = loadAppSettings;
window.saveAppSettings = saveAppSettings;
window.downloadTicketPDF = downloadTicketPDF;
window.downloadTicketPNG = downloadTicketPNG;
window.viewTicketModal = viewTicketModal;
window.shareTicket = shareTicket;
window.openConfirmPurchasePopup = openConfirmPurchasePopup;
window.openTransactionProcessedPopup = openTransactionProcessedPopup;
window.openPastEventPopup = openPastEventPopup;
window.openQuantityPopup = openQuantityPopup;
window.requireLogin = requireLogin;
window.requireProfileComplete = requireProfileComplete;
window.retryPendingTickets = retryPendingTickets;
window.renderAdminUsers = renderAdminUsers;
window.refreshUsersList = refreshUsersList;
window.loadAllUsersFromSupabase = loadAllUsersFromSupabase;
window.deleteNotification = deleteNotification;
window.clearAllNotifications = clearAllNotifications;

// ============================================================
// LANCEMENT DE L'APPLICATION
// ============================================================
// L'application est déjà lancée par la IIFE en haut du fichier.
console.log('✅ Betix script loaded successfully.');
