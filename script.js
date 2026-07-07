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

console.log("Supabase initialized (Storage only mode)");

// ============================================================
// ===== BACKEND URL =====
// ============================================================

const BACKEND_URL = "https://betix-backend.onrender.com";

// ============================================================
// ===== COUNTRY LIST (COMPLÈTE AVEC DRAPEAUX) =====
// ============================================================

var countriesWithFlags = [
    { name: 'Afghanistan', flag: '🇦🇫' },
    { name: 'Albania', flag: '🇦🇱' },
    { name: 'Algeria', flag: '🇩🇿' },
    { name: 'Andorra', flag: '🇦🇩' },
    { name: 'Angola', flag: '🇦🇴' },
    { name: 'Antigua and Barbuda', flag: '🇦🇬' },
    { name: 'Argentina', flag: '🇦🇷' },
    { name: 'Armenia', flag: '🇦🇲' },
    { name: 'Australia', flag: '🇦🇺' },
    { name: 'Austria', flag: '🇦🇹' },
    { name: 'Azerbaijan', flag: '🇦🇿' },
    { name: 'Bahamas', flag: '🇧🇸' },
    { name: 'Bahrain', flag: '🇧🇭' },
    { name: 'Bangladesh', flag: '🇧🇩' },
    { name: 'Barbados', flag: '🇧🇧' },
    { name: 'Belarus', flag: '🇧🇾' },
    { name: 'Belgium', flag: '🇧🇪' },
    { name: 'Belize', flag: '🇧🇿' },
    { name: 'Benin', flag: '🇧🇯' },
    { name: 'Bhutan', flag: '🇧🇹' },
    { name: 'Bolivia', flag: '🇧🇴' },
    { name: 'Bosnia and Herzegovina', flag: '🇧🇦' },
    { name: 'Botswana', flag: '🇧🇼' },
    { name: 'Brazil', flag: '🇧🇷' },
    { name: 'Brunei', flag: '🇧🇳' },
    { name: 'Bulgaria', flag: '🇧🇬' },
    { name: 'Burkina Faso', flag: '🇧🇫' },
    { name: 'Burundi', flag: '🇧🇮' },
    { name: 'Cambodia', flag: '🇰🇭' },
    { name: 'Cameroon', flag: '🇨🇲' },
    { name: 'Canada', flag: '🇨🇦' },
    { name: 'Cape Verde', flag: '🇨🇻' },
    { name: 'Central African Republic', flag: '🇨🇫' },
    { name: 'Chad', flag: '🇹🇩' },
    { name: 'Chile', flag: '🇨🇱' },
    { name: 'China', flag: '🇨🇳' },
    { name: 'Colombia', flag: '🇨🇴' },
    { name: 'Comoros', flag: '🇰🇲' },
    { name: 'Congo', flag: '🇨🇬' },
    { name: 'Costa Rica', flag: '🇨🇷' },
    { name: 'Croatia', flag: '🇭🇷' },
    { name: 'Cuba', flag: '🇨🇺' },
    { name: 'Cyprus', flag: '🇨🇾' },
    { name: 'Czech Republic', flag: '🇨🇿' },
    { name: 'Denmark', flag: '🇩🇰' },
    { name: 'Djibouti', flag: '🇩🇯' },
    { name: 'Dominica', flag: '🇩🇲' },
    { name: 'Dominican Republic', flag: '🇩🇴' },
    { name: 'Ecuador', flag: '🇪🇨' },
    { name: 'Egypt', flag: '🇪🇬' },
    { name: 'El Salvador', flag: '🇸🇻' },
    { name: 'Equatorial Guinea', flag: '🇬🇶' },
    { name: 'Eritrea', flag: '🇪🇷' },
    { name: 'Estonia', flag: '🇪🇪' },
    { name: 'Eswatini', flag: '🇸🇿' },
    { name: 'Ethiopia', flag: '🇪🇹' },
    { name: 'Fiji', flag: '🇫🇯' },
    { name: 'Finland', flag: '🇫🇮' },
    { name: 'France', flag: '🇫🇷' },
    { name: 'Gabon', flag: '🇬🇦' },
    { name: 'Gambia', flag: '🇬🇲' },
    { name: 'Georgia', flag: '🇬🇪' },
    { name: 'Germany', flag: '🇩🇪' },
    { name: 'Ghana', flag: '🇬🇭' },
    { name: 'Greece', flag: '🇬🇷' },
    { name: 'Grenada', flag: '🇬🇩' },
    { name: 'Guatemala', flag: '🇬🇹' },
    { name: 'Guinea', flag: '🇬🇳' },
    { name: 'Guinea-Bissau', flag: '🇬🇼' },
    { name: 'Guyana', flag: '🇬🇾' },
    { name: 'Haiti', flag: '🇭🇹' },
    { name: 'Honduras', flag: '🇭🇳' },
    { name: 'Hungary', flag: '🇭🇺' },
    { name: 'Iceland', flag: '🇮🇸' },
    { name: 'India', flag: '🇮🇳' },
    { name: 'Indonesia', flag: '🇮🇩' },
    { name: 'Iran', flag: '🇮🇷' },
    { name: 'Iraq', flag: '🇮🇶' },
    { name: 'Ireland', flag: '🇮🇪' },
    { name: 'Israel', flag: '🇮🇱' },
    { name: 'Italy', flag: '🇮🇹' },
    { name: 'Jamaica', flag: '🇯🇲' },
    { name: 'Japan', flag: '🇯🇵' },
    { name: 'Jordan', flag: '🇯🇴' },
    { name: 'Kazakhstan', flag: '🇰🇿' },
    { name: 'Kenya', flag: '🇰🇪' },
    { name: 'Kiribati', flag: '🇰🇮' },
    { name: 'Kuwait', flag: '🇰🇼' },
    { name: 'Kyrgyzstan', flag: '🇰🇬' },
    { name: 'Laos', flag: '🇱🇦' },
    { name: 'Latvia', flag: '🇱🇻' },
    { name: 'Lebanon', flag: '🇱🇧' },
    { name: 'Lesotho', flag: '🇱🇸' },
    { name: 'Liberia', flag: '🇱🇷' },
    { name: 'Libya', flag: '🇱🇾' },
    { name: 'Liechtenstein', flag: '🇱🇮' },
    { name: 'Lithuania', flag: '🇱🇹' },
    { name: 'Luxembourg', flag: '🇱🇺' },
    { name: 'Madagascar', flag: '🇲🇬' },
    { name: 'Malawi', flag: '🇲🇼' },
    { name: 'Malaysia', flag: '🇲🇾' },
    { name: 'Maldives', flag: '🇲🇻' },
    { name: 'Mali', flag: '🇲🇱' },
    { name: 'Malta', flag: '🇲🇹' },
    { name: 'Marshall Islands', flag: '🇲🇭' },
    { name: 'Mauritania', flag: '🇲🇷' },
    { name: 'Mauritius', flag: '🇲🇺' },
    { name: 'Mexico', flag: '🇲🇽' },
    { name: 'Micronesia', flag: '🇫🇲' },
    { name: 'Moldova', flag: '🇲🇩' },
    { name: 'Monaco', flag: '🇲🇨' },
    { name: 'Mongolia', flag: '🇲🇳' },
    { name: 'Montenegro', flag: '🇲🇪' },
    { name: 'Morocco', flag: '🇲🇦' },
    { name: 'Mozambique', flag: '🇲🇿' },
    { name: 'Myanmar', flag: '🇲🇲' },
    { name: 'Namibia', flag: '🇳🇦' },
    { name: 'Nauru', flag: '🇳🇷' },
    { name: 'Nepal', flag: '🇳🇵' },
    { name: 'Netherlands', flag: '🇳🇱' },
    { name: 'New Zealand', flag: '🇳🇿' },
    { name: 'Nicaragua', flag: '🇳🇮' },
    { name: 'Niger', flag: '🇳🇪' },
    { name: 'Nigeria', flag: '🇳🇬' },
    { name: 'North Korea', flag: '🇰🇵' },
    { name: 'North Macedonia', flag: '🇲🇰' },
    { name: 'Norway', flag: '🇳🇴' },
    { name: 'Oman', flag: '🇴🇲' },
    { name: 'Pakistan', flag: '🇵🇰' },
    { name: 'Palau', flag: '🇵🇼' },
    { name: 'Palestine', flag: '🇵🇸' },
    { name: 'Panama', flag: '🇵🇦' },
    { name: 'Papua New Guinea', flag: '🇵🇬' },
    { name: 'Paraguay', flag: '🇵🇾' },
    { name: 'Peru', flag: '🇵🇪' },
    { name: 'Philippines', flag: '🇵🇭' },
    { name: 'Poland', flag: '🇵🇱' },
    { name: 'Portugal', flag: '🇵🇹' },
    { name: 'Qatar', flag: '🇶🇦' },
    { name: 'RDC', flag: '🇨🇩' },
    { name: 'Romania', flag: '🇷🇴' },
    { name: 'Russia', flag: '🇷🇺' },
    { name: 'Rwanda', flag: '🇷🇼' },
    { name: 'Saint Kitts and Nevis', flag: '🇰🇳' },
    { name: 'Saint Lucia', flag: '🇱🇨' },
    { name: 'Saint Vincent', flag: '🇻🇨' },
    { name: 'Samoa', flag: '🇼🇸' },
    { name: 'San Marino', flag: '🇸🇲' },
    { name: 'Sao Tome and Principe', flag: '🇸🇹' },
    { name: 'Saudi Arabia', flag: '🇸🇦' },
    { name: 'Senegal', flag: '🇸🇳' },
    { name: 'Serbia', flag: '🇷🇸' },
    { name: 'Seychelles', flag: '🇸🇨' },
    { name: 'Sierra Leone', flag: '🇸🇱' },
    { name: 'Singapore', flag: '🇸🇬' },
    { name: 'Slovakia', flag: '🇸🇰' },
    { name: 'Slovenia', flag: '🇸🇮' },
    { name: 'Solomon Islands', flag: '🇸🇧' },
    { name: 'Somalia', flag: '🇸🇴' },
    { name: 'South Africa', flag: '🇿🇦' },
    { name: 'South Korea', flag: '🇰🇷' },
    { name: 'South Sudan', flag: '🇸🇸' },
    { name: 'Spain', flag: '🇪🇸' },
    { name: 'Sri Lanka', flag: '🇱🇰' },
    { name: 'Sudan', flag: '🇸🇩' },
    { name: 'Suriname', flag: '🇸🇷' },
    { name: 'Sweden', flag: '🇸🇪' },
    { name: 'Switzerland', flag: '🇨🇭' },
    { name: 'Syria', flag: '🇸🇾' },
    { name: 'Taiwan', flag: '🇹🇼' },
    { name: 'Tajikistan', flag: '🇹🇯' },
    { name: 'Tanzania', flag: '🇹🇿' },
    { name: 'Thailand', flag: '🇹🇭' },
    { name: 'Timor-Leste', flag: '🇹🇱' },
    { name: 'Togo', flag: '🇹🇬' },
    { name: 'Tonga', flag: '🇹🇴' },
    { name: 'Trinidad and Tobago', flag: '🇹🇹' },
    { name: 'Tunisia', flag: '🇹🇳' },
    { name: 'Turkey', flag: '🇹🇷' },
    { name: 'Turkmenistan', flag: '🇹🇲' },
    { name: 'Tuvalu', flag: '🇹🇻' },
    { name: 'Uganda', flag: '🇺🇬' },
    { name: 'Ukraine', flag: '🇺🇦' },
    { name: 'United Arab Emirates', flag: '🇦🇪' },
    { name: 'United Kingdom', flag: '🇬🇧' },
    { name: 'United States', flag: '🇺🇸' },
    { name: 'Uruguay', flag: '🇺🇾' },
    { name: 'Uzbekistan', flag: '🇺🇿' },
    { name: 'Vanuatu', flag: '🇻🇺' },
    { name: 'Vatican City', flag: '🇻🇦' },
    { name: 'Venezuela', flag: '🇻🇪' },
    { name: 'Vietnam', flag: '🇻🇳' },
    { name: 'Yemen', flag: '🇾🇪' },
    { name: 'Zambia', flag: '🇿🇲' },
    { name: 'Zimbabwe', flag: '🇿🇼' }
];

countriesWithFlags.sort(function(a, b) {
    return a.name.localeCompare(b.name);
});

var flagMap = {};
for (var i = 0; i < countriesWithFlags.length; i++) {
    flagMap[countriesWithFlags[i].name] = countriesWithFlags[i].flag;
}

// ============================================================
// ===== GLOBAL VARIABLES =====
// ============================================================

var events = [];
var tickets = [];
var currentUser = { 
    name: 'Guest', 
    wallet: null, 
    piUid: null,
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
        }
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
// ===== UTILITY FUNCTIONS =====
// ============================================================

function escapeHtml(str) { if (!str) return ''; return str.replace(/[&<>]/g, function(m) { if (m === '&') return '&amp;'; if (m === '<') return '&lt;'; if (m === '>') return '&gt;'; return m; }); }

function formatDate(dateStr) { var date = new Date(dateStr); return !isNaN(date.getTime()) ? date.toLocaleDateString('en-US') : 'Date to be defined'; }

function formatDateTime(dateStr) { var date = new Date(dateStr); return !isNaN(date.getTime()) ? date.toLocaleString('en-US') : 'Unknown date'; }

function getDurationDisplay(event) {
    if (!event.durationValue || !event.durationUnit) return '';
    var unitMap = {
        'hours': 'hour',
        'days': 'day',
        'weeks': 'week',
        'months': 'month',
        'years': 'year'
    };
    var unit = unitMap[event.durationUnit] || event.durationUnit;
    var display = event.durationValue + ' ' + unit;
    if (event.durationValue > 1) display += 's';
    return display;
}

function getCountryFlag(countryName) {
    if (!countryName) return '🌍';
    return flagMap[countryName] || '🌍';
}

// ============================================================
// ===== COMPRESSION D'IMAGES =====
// ============================================================

function compressImage(file, options) {
    options = options || {};
    return new Promise(function(resolve, reject) {
        if (!file || !file.type.startsWith('image/')) {
            reject(new Error('Le fichier n\'est pas une image'));
            return;
        }

        var config = {
            maxWidth: options.maxWidth || 1200,
            maxHeight: options.maxHeight || 800,
            quality: options.quality || 0.7,
            format: options.format || 'image/webp',
            maxSizeMB: options.maxSizeMB || 1.5
        };

        var reader = new FileReader();
        reader.onload = function(event) {
            var img = new Image();
            img.onload = function() {
                var width = img.width;
                var height = img.height;
                
                if (width > config.maxWidth || height > config.maxHeight) {
                    var ratio = Math.min(config.maxWidth / width, config.maxHeight / height);
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
                
                var format = config.format;
                if (format === 'image/webp') {
                    var testCanvas = document.createElement('canvas');
                    testCanvas.width = 1;
                    testCanvas.height = 1;
                    var testData = testCanvas.toDataURL('image/webp');
                    if (!testData || testData.indexOf('image/webp') === -1) {
                        format = 'image/jpeg';
                    }
                }
                
                var compressedDataUrl = canvas.toDataURL(format, config.quality);
                resolve(compressedDataUrl);
            };
            img.onerror = function() { reject(new Error('Erreur de chargement de l\'image')); };
            img.src = event.target.result;
        };
        reader.onerror = function() { reject(new Error('Erreur de lecture du fichier')); };
        reader.readAsDataURL(file);
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
// ===== SUPABASE STORAGE FUNCTIONS =====
// ============================================================

async function uploadToSupabaseStorage(bucket, filePath, base64Data) {
    try {
        var response = await fetch(base64Data);
        var blob = await response.blob();
        
        var { data, error } = await supabaseClient.storage
            .from(bucket)
            .upload(filePath, blob, {
                contentType: blob.type,
                cacheControl: '3600',
                upsert: true
            });
        
        if (error) throw error;
        
        var { data: publicUrlData } = supabaseClient.storage
            .from(bucket)
            .getPublicUrl(filePath);
        
        return publicUrlData.publicUrl;
    } catch (error) {
        console.error('Error uploading to Supabase storage:', error);
        return null;
    }
}

async function uploadEventImage(eventId, base64Data, index) {
    var filePath = eventId + '/image_' + index + '_' + Date.now() + '.webp';
    return await uploadToSupabaseStorage('events-images', filePath, base64Data);
}

// ============================================================
// ===== SUPABASE TABLE FUNCTIONS =====
// ============================================================

async function saveEventToSupabase(eventData) {
    try {
        var dbEvent = {
            id: eventData.id,
            organizer_pi_uid: eventData.organizerPiUid || eventData.organizer,
            title: eventData.title,
            description: eventData.description || '',
            image_url: eventData.coverImage || (eventData.images && eventData.images[0]) || '',
            location: eventData.location || '',
            event_date: eventData.date,
            category: eventData.category || '',
            ticket_price: eventData.price || 0,
            max_tickets: eventData.seatsTotal || 0,
            created_at: eventData.createdAt || new Date().toISOString(),
            duration_value: eventData.durationValue || null,
            duration_unit: eventData.durationUnit || null,
            country: eventData.country || '',
            ticket_types: JSON.stringify(eventData.ticketTypes || {})
        };
        
        var { error } = await supabaseClient
            .from('events')
            .upsert(dbEvent, { onConflict: 'id' });
        
        if (error) throw error;
        console.log('Event saved to Supabase:', eventData.id);
        return true;
    } catch (error) {
        console.error('Error saving event to Supabase:', error);
        return false;
    }
}

async function loadEventsFromSupabase() {
    try {
        var { data, error } = await supabaseClient
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
        var { error } = await supabaseClient
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
        var { error } = await supabaseClient
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
        var dbTicket = {
            id: ticketData.id,
            event_id: ticketData.eventId,
            buyer_pi_uid: ticketData.buyerWallet || ticketData.userWallet,
            qr_code: ticketData.qrCode || '',
            status: ticketData.status || 'Valid',
            purchase_date: ticketData.purchaseDate || new Date().toISOString(),
            expiration_date: ticketData.eventDate || null,
            ticket_type: ticketData.ticketType || 'Standard',
            quantity: ticketData.quantity || 1,
            transaction_id: ticketData.transactionId || '',
            payment_status: ticketData.paymentStatus || 'Paid',
            ticket_price: ticketData.price || 0,
            event_title: ticketData.eventTitle || ''
        };
        
        var { error } = await supabaseClient
            .from('tickets')
            .upsert(dbTicket, { onConflict: 'id' });
        
        if (error) throw error;
        console.log('Ticket saved to Supabase:', ticketData.id);
        return true;
    } catch (error) {
        console.error('Error saving ticket to Supabase:', error);
        return false;
    }
}

async function loadTicketsFromSupabase(piUid) {
    try {
        var { data, error } = await supabaseClient
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
        
        var { error } = await supabaseClient
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
        var dbNotification = {
            id: notificationData.id || Date.now().toString(),
            receiver_pi_uid: notificationData.receiverPiUid || notificationData.userWallet,
            title: notificationData.title || 'Notification',
            message: notificationData.message || '',
            is_read: notificationData.read || false,
            created_at: notificationData.date || new Date().toISOString()
        };
        
        var { error } = await supabaseClient
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
        var { data, error } = await supabaseClient
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
// ===== SAVE FUNCTIONS =====
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
            id: notif.id,
            receiverPiUid: receiverPiUid,
            title: notif.type === 'purchase' ? 'Ticket Purchase' : 'Notification',
            message: notif.message,
            read: notif.read || false,
            date: notif.date || new Date().toISOString()
        });
    }
}

// ============================================================
// ===== LOAD FUNCTIONS (Supabase) =====
// ============================================================

async function loadAllFromSupabase() {
    console.log('Loading data from Supabase...');
    
    var supabaseEvents = await loadEventsFromSupabase();
    if (supabaseEvents.length > 0) {
        events = supabaseEvents.map(function(e) {
            var ticketTypes = { standard: { enabled: true, price: e.ticket_price || 0.0003 } };
            try {
                if (e.ticket_types) {
                    var parsed = typeof e.ticket_types === 'string' ? JSON.parse(e.ticket_types) : e.ticket_types;
                    if (parsed && typeof parsed === 'object') {
                        ticketTypes = parsed;
                    }
                }
            } catch (err) {
                console.warn('Error parsing ticket_types:', err);
            }
            
            if (!ticketTypes.standard) {
                ticketTypes.standard = { enabled: true, price: e.ticket_price || 0.0003 };
            }
            
            return {
                id: e.id,
                title: e.title,
                category: e.category || '',
                country: e.country || 'France',
                date: e.event_date,
                location: e.location || '',
                description: e.description || '',
                conditions: e.conditions || 'Active Pi Network wallet\nPayment in Pi (indicated amount)',
                price: e.ticket_price || 0.0003,
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
                ticketTypes: ticketTypes
            };
        });
        localStorage.setItem('betix_events', JSON.stringify(events));
    } else {
        events = [];
        localStorage.setItem('betix_events', JSON.stringify(events));
    }
    
    if (currentUser.piUid || currentUser.wallet) {
        var piUid = currentUser.piUid || currentUser.wallet;
        var supabaseTickets = await loadTicketsFromSupabase(piUid);
        if (supabaseTickets.length > 0) {
            tickets = supabaseTickets.map(function(t) {
                return {
                    id: t.id,
                    eventId: t.event_id,
                    eventTitle: t.event_title || 'Event',
                    eventDate: t.expiration_date || new Date().toISOString(),
                    eventLocation: t.event_location || '',
                    price: t.ticket_price || 0,
                    buyerWallet: t.buyer_pi_uid,
                    buyerName: t.buyer_name || t.buyer_pi_uid,
                    userWallet: t.buyer_pi_uid,
                    purchaseDate: t.purchase_date || new Date().toISOString(),
                    purchaseDateTime: new Date(t.purchase_date || new Date()).toLocaleString('en-US'),
                    transactionId: t.transaction_id || '',
                    qrCode: t.qr_code || 'BETIX-' + Date.now(),
                    status: t.status || 'Valid',
                    ticketType: t.ticket_type || 'Standard',
                    quantity: t.quantity || 1,
                    paymentStatus: t.payment_status || 'Paid'
                };
            });
            localStorage.setItem('betix_tickets', JSON.stringify(tickets));
        } else {
            tickets = [];
            localStorage.setItem('betix_tickets', JSON.stringify(tickets));
        }
    }
    
    if (currentUser.piUid || currentUser.wallet) {
        var piUid = currentUser.piUid || currentUser.wallet;
        var supabaseNotifs = await loadNotificationsFromSupabase(piUid);
        if (supabaseNotifs.length > 0) {
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
        }
    }
    
    renderEventsByCategory();
    renderTickets();
    renderHistory();
    updateProfilePage();
    console.log('All data loaded from Supabase');
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
// ===== CONNEXION PI AVEC LOADING SPINNER =====
// ============================================================

async function connectToPi() {
    var authLoading = document.getElementById('authLoadingOverlay');
    if (authLoading) {
        authLoading.classList.add('active');
    }
    
    try {
        if (typeof Pi === 'undefined') { 
            if (confirm("Pi Browser not detected. Use demo mode?")) {
                currentUser.wallet = 'demo_user';
                currentUser.piUid = 'demo_user';
                currentUser.name = 'Demo User';
                currentUser.memberSince = '2026';
                currentUser.loyaltyPoints = 0;
                currentUser.profilePhoto = null;
                saveUser();
                updateActivity();
                updateUserInfo();
                updateProfilePage();
                renderEventsByCategory();
                updateConnectButtons();
                loadAllFromSupabase();
                alert('Pi account connected (demo mode)! Welcome Demo User');
                closeSidebar();
                if (authLoading) {
                    authLoading.classList.remove('active');
                }
                return;
            }
            alert("Please open this page in Pi Browser");
            if (authLoading) {
                authLoading.classList.remove('active');
            }
            return; 
        }
        
        var scopes = ['username', 'payments'];
        var auth = await Pi.authenticate(scopes, onIncompletePaymentFound);
        
        if (auth && auth.user) {
            piUser = auth.user;
            currentUser.wallet = piUser.username;
            currentUser.piUid = piUser.username;
            currentUser.name = piUser.username;
            if (!currentUser.loyaltyPoints) currentUser.loyaltyPoints = 0;
            if (!currentUser.profilePhoto) currentUser.profilePhoto = null;
            
            saveUser();
            
            updateActivity();
            updateUserInfo();
            updateProfilePage();
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
    } finally {
        if (authLoading) {
            authLoading.classList.remove('active');
        }
    }
}

async function onIncompletePaymentFound(payment) { 
    console.log("Incomplete payment found:", payment); 
}

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
        updateConnectButtons();
        closeSidebar();
        alert('You are disconnected');
    }
}

function logout() { disconnectPi(); }

// ============================================================
// ===== USER INFO & PROFILE =====
// ============================================================

function updateUserInfo() {
    var sidebarName = document.getElementById('sidebarName');
    var sidebarWallet = document.getElementById('sidebarWallet');
    var sidebarText = document.getElementById('sidebarAvatarText');
    if (sidebarName) sidebarName.innerText = currentUser.name;
    if (sidebarWallet) sidebarWallet.innerText = currentUser.wallet ? currentUser.wallet.substring(0, 15) + '...' : 'Not connected';
    if (sidebarText) {
        sidebarText.innerText = currentUser.name.substring(0, 2).toUpperCase();
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
    var memberSince = document.getElementById('memberSince');
    
    if (profileName) profileName.innerText = currentUser.name;
    if (profileWallet) profileWallet.innerText = currentUser.wallet || 'Not connected';
    if (ticketCount) ticketCount.innerText = tickets.length;
    if (ratedCount) {
        var userRatings = ratings.filter(function(r) { return r.userWallet === (currentUser.wallet || currentUser.name); });
        ratedCount.innerText = userRatings.length;
    }
    if (loyaltyDisplay) loyaltyDisplay.innerText = currentUser.loyaltyPoints || 0;
    if (historyCount) historyCount.innerText = tickets.length;
    if (memberSince) memberSince.innerText = currentUser.memberSince || '2026';
    
    if (profileRatingDisplay) {
        var userRatings = ratings.filter(function(r) { return r.userWallet === (currentUser.wallet || currentUser.name); });
        var avg = userRatings.length > 0 ? (userRatings.reduce(function(a, r) { return a + r.rating; }, 0) / userRatings.length).toFixed(1) : '0';
        profileRatingDisplay.innerText = avg;
    }
    if (profileLoyaltyDisplay) profileLoyaltyDisplay.innerText = currentUser.loyaltyPoints || 0;
    
    var myEvents = events.filter(function(e) {
        return e.organizer === currentUser.wallet || e.organizerName === currentUser.name;
    });
    if (myEventsCount) myEventsCount.innerText = myEvents.length;
    
    updateConnectButtons();
}

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

function goToMyEvents() { showPage('myevents'); }
function goToTickets() { showPage('tickets'); }
function goToHistory() { showPage('history'); }
function goToRatings() { showPage('ratings'); }

// ============================================================
// ===== NAVIGATION =====
// ============================================================

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

function goBack() {
    if (pageHistory.length > 1) {
        pageHistory.pop();
        var previousPage = pageHistory[pageHistory.length - 1];
        showPage(previousPage);
    } else {
        showPage('home');
    }
}

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

function updateActivity() { 
    lastActivity = Date.now(); 
    localStorage.setItem('betix_last_activity', lastActivity); 
}

function isSessionExpired() { 
    var last = parseInt(localStorage.getItem('betix_last_activity') || 0); 
    var now = Date.now(); 
    return (now - last) > 86400000; 
}

function startSessionMonitor() { 
    setInterval(function() { 
        if (currentUser.wallet && isSessionExpired()) { 
            disconnectPi(); 
            alert('Session expired due to inactivity. Please reconnect.'); 
        } 
    }, 60000); 
}

function bindActivityListeners() { 
    var events = ['click', 'scroll', 'keydown', 'touchstart']; 
    for (var i = 0; i < events.length; i++) { 
        document.addEventListener(events[i], updateActivity); 
    } 
}

function clearAllData() { 
    if (confirm('Delete all your data?')) { 
        localStorage.clear(); 
        location.reload(); 
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
// ===== RENDER EVENTS =====
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
    
    var countryFlag = getCountryFlag(event.country);
    var countryDisplay = event.country || 'International';
    
    var durationDisplay = getDurationDisplay(event);
    
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
    
    var priceDisplay = event.price + ' Pi';
    
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
                '<div class="info-item-classic">' +
                    (durationDisplay ? '<i class="fas fa-hourglass-half"></i> ' + durationDisplay : '<i class="fas fa-flag"></i> ' + countryFlag + ' ' + escapeHtml(countryDisplay)) +
                '</div>' +
            '</div>' +
            '<div class="card-footer-classic">' +
                '<span class="event-rating-classic">' + ratingDisplay + '</span>' +
                '<span>' +
                    '<span class="event-price-classic">' + priceDisplay + '</span>' +
                    ' <span class="event-seats-classic">' + event.seatsLeft + '/' + event.seatsTotal + ' seats</span>' +
                '</span>' +
            '</div>' +
            '<button class="buy-btn-classic" onclick="event.stopPropagation(); openQuantityPopup(\'' + event.id + '\')">Buy Ticket</button>' +
            '<div class="event-organizer-classic">' +
                '<span class="org-icon">👤</span> By ' + escapeHtml(organizerFormatted) +
            '</div>' +
        '</div>' +
    '</div>';
}

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
        for (var i = 0; i < filtered.length; i++) {
            html += renderEventCard(filtered[i]);
        }
        html += '</div></div>';
    } else {
        for (var i = 0; i < cats.length; i++) {
            var cat = cats[i];
            var catEvents = filtered.filter(function(e) { return e.category === cat; });
            if (catEvents.length) {
                html += '<div class="category-section"><div class="category-header">' + cat + '</div><div class="events-grid-centered">';
                for (var j = 0; j < catEvents.length; j++) {
                    html += renderEventCard(catEvents[j]);
                }
                html += '</div></div>';
            }
        }
    }
    container.innerHTML = html;
}

// ============================================================
// ===== INIT COUNTRY SELECTORS =====
// ============================================================

function initCountrySelectors() {
    var filterSelect = document.getElementById('countrySelect');
    if (filterSelect) {
        filterSelect.innerHTML = '';
        var allOption = document.createElement('option');
        allOption.value = 'All';
        allOption.textContent = '🌍 All Countries';
        filterSelect.appendChild(allOption);
        
        for (var i = 0; i < countriesWithFlags.length; i++) {
            var c = countriesWithFlags[i];
            var option = document.createElement('option');
            option.value = c.name;
            option.textContent = c.flag + ' ' + c.name;
            if (c.name === currentCountryFilter) {
                option.selected = true;
            }
            filterSelect.appendChild(option);
        }
    }
}

// ============================================================
// ===== INIT FILTERS =====
// ============================================================

function initFilters() {
    var cats = ['All', 'Concert', 'Sport', 'Conference', 'Training', 'Cinema', 'Festival', 'Theatre', 'Dance', 'Exhibition', 'Gala', 'Seminar'];
    var container = document.getElementById('filtersContainer');
    if (!container) return;
    
    container.innerHTML = '';
    for (var i = 0; i < cats.length; i++) {
        var chip = document.createElement('div');
        chip.className = 'filter-chip' + (cats[i] === currentFilter ? ' active' : '');
        chip.dataset.category = cats[i];
        chip.textContent = cats[i];
        container.appendChild(chip);
    }
    
    var chips = document.querySelectorAll('.filter-chip');
    for (var i = 0; i < chips.length; i++) {
        chips[i].addEventListener('click', function() {
            currentFilter = this.dataset.category;
            initFilters();
            renderEventsByCategory();
        });
    }
}

// ============================================================
// ===== FILTER BY COUNTRY =====
// ============================================================

function filterByCountry(country) {
    currentCountryFilter = country;
    renderEventsByCategory();
}

// ============================================================
// ===== RENDER TICKETS =====
// ============================================================

function renderTickets() {
    var container = document.getElementById('ticketsList');
    if (!container) return;
    
    var active = tickets.filter(function(t) { 
        return new Date(t.eventDate) > new Date(); 
    });
    active.sort(function(a, b) { 
        return new Date(b.purchaseDate) - new Date(a.purchaseDate); 
    });
    
    if (!active.length) { 
        container.innerHTML = '<p style="text-align:center;padding:2rem;color:var(--gray);">No active tickets</p>'; 
        return; 
    }
    
    var html = '<div class="ticket-container">';
    for (var i = 0; i < active.length; i++) {
        html += renderTicketPremium(active[i], 'valid');
    }
    html += '</div>';
    container.innerHTML = html;
}

function renderHistory() {
    var container = document.getElementById('historyList');
    if (!container) return;
    
    var old = tickets.filter(function(t) { 
        return new Date(t.eventDate) <= new Date(); 
    });
    old.sort(function(a, b) { 
        return new Date(b.purchaseDate) - new Date(a.purchaseDate); 
    });
    
    if (!old.length) { 
        container.innerHTML = '<p style="text-align:center;padding:2rem;color:var(--gray);">No history</p>'; 
        return; 
    }
    
    var html = '<div class="ticket-container">';
    for (var i = 0; i < old.length; i++) {
        html += renderTicketPremium(old[i], 'past');
    }
    html += '</div>';
    container.innerHTML = html;
}

function renderTicketPremium(ticket, status) {
    var event = events.find(function(e) { return e.id === ticket.eventId; });
    
    var dateEvent = new Date(ticket.eventDate);
    var dateFormatted = dateEvent.toLocaleDateString('en-US', { 
        weekday: 'short', 
        month: 'short', 
        day: 'numeric', 
        year: 'numeric' 
    });
    var timeFormatted = dateEvent.toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit' 
    });
    
    var statusClass = status === 'valid' ? 'valid' : 'past';
    var statusText = status === 'valid' ? 'Valid' : 'Past Event';
    var categoryDisplay = ticket.category || (event ? event.category : 'Event');
    var priceDisplay = ticket.price || (event ? event.price : 0);
    var organizerDisplay = event ? (event.organizerName || event.organizer) : ticket.buyerName || 'Anonymous';
    if (organizerDisplay && !organizerDisplay.startsWith('@')) {
        organizerDisplay = '@' + organizerDisplay;
    }
    var durationDisplay = event ? getDurationDisplay(event) : '';
    var qrCode = ticket.qrCode || 'BETIX-' + ticket.id.substring(0, 8);
    var participantName = ticket.buyerName || ticket.buyerWallet || 'Anonymous';
    if (participantName.length > 20) {
        participantName = participantName.substring(0, 18) + '...';
    }
    var quantity = ticket.quantity || 1;
    var ticketType = ticket.ticketType || 'Standard';
    var paymentStatus = ticket.paymentStatus || 'Paid';
    var transactionId = ticket.transactionId || '';
    var orderNumber = ticket.id ? ticket.id.substring(0, 12).toUpperCase() : '';
    var ticketNumber = 'BTX-' + (ticket.id ? ticket.id.substring(0, 8) : '') + '-' + String(Math.floor(Math.random() * 1000)).padStart(3, '0');
    var purchaseDate = new Date(ticket.purchaseDate || ticket.purchaseDateTime || new Date());
    var purchaseDateFormatted = purchaseDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    var purchaseTimeFormatted = purchaseDate.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    var officialDesc = 'Official Betix digital ticket confirming your participation in this event. Present this ticket (QR Code or ticket code) at the entrance.';
    
    var ticketTypeBadge = ticketType === 'VIP' ? 
        '<span class="ticket-type-badge vip">VIP</span>' : 
        '<span class="ticket-type-badge standard">Standard</span>';
    
    return '<div class="ticket-premium">' +
        '<div class="ticket-inner">' +
            '<div class="ticket-watermark">BETIX</div>' +
            '<div class="ticket-logo-discreet">Betix</div>' +
            '<div class="ticket-header">' +
                '<span class="ticket-status-badge ' + statusClass + '">' + statusText + '</span>' +
                '<span class="ticket-order-id">Order #' + orderNumber + '</span>' +
            '</div>' +
            '<div class="ticket-body">' +
                '<div class="ticket-event-title">' + escapeHtml(ticket.eventTitle || 'Event') + ' ' + ticketTypeBadge + '</div>' +
                '<span class="ticket-category-badge">' + escapeHtml(categoryDisplay) + '</span>' +
                '<div class="ticket-official-desc">' + officialDesc + '</div>' +
                '<div class="ticket-info-grid">' +
                    '<div class="ticket-info-item"><i class="fas fa-calendar-day"></i> <span class="ticket-label">Date</span> <span class="ticket-value">' + dateFormatted + '</span></div>' +
                    '<div class="ticket-info-item"><i class="fas fa-clock"></i> <span class="ticket-label">Time</span> <span class="ticket-value">' + timeFormatted + '</span></div>' +
                    '<div class="ticket-info-item"><i class="fas fa-map-marker-alt"></i> <span class="ticket-label">Location</span> <span class="ticket-value">' + escapeHtml(ticket.eventLocation || 'Online') + '</span></div>' +
                    (durationDisplay ? '<div class="ticket-info-item"><i class="fas fa-hourglass-half"></i> <span class="ticket-label">Duration</span> <span class="ticket-value">' + durationDisplay + '</span></div>' : '') +
                    '<div class="ticket-info-item"><i class="fas fa-tag"></i> <span class="ticket-label">Price</span> <span class="ticket-value">' + priceDisplay + ' Pi</span></div>' +
                    '<div class="ticket-info-item"><i class="fas fa-user"></i> <span class="ticket-label">Organizer</span> <span class="ticket-value">' + escapeHtml(organizerDisplay) + '</span></div>' +
                '</div>' +
                '<div class="ticket-separator"><span class="ticket-scissors-icon"><i class="fas fa-cut"></i></span></div>' +
                '<div class="ticket-qr-section">' +
                    '<div class="ticket-qr-code">' +
                        '<div class="qr-box">' + qrCode.substring(0, 12) + '</div>' +
                        '<span class="qr-label">QR Code</span>' +
                    '</div>' +
                    '<div class="ticket-qr-info">' +
                        '<div class="qr-info-row"><span class="qr-info-label">Ticket Code</span><span class="qr-info-value">' + qrCode + '</span></div>' +
                        '<div class="qr-info-row"><span class="qr-info-label">Ticket Number</span><span class="qr-info-value">' + ticketNumber + '</span></div>' +
                        '<div class="qr-info-row"><span class="qr-info-label">Type</span><span class="qr-info-value">' + ticketType + '</span></div>' +
                        '<div class="qr-info-row"><span class="qr-info-label">Quantity</span><span class="qr-info-value">' + quantity + '</span></div>' +
                        '<div class="qr-info-row"><span class="qr-info-label">Payment</span><span class="qr-info-value">' + paymentStatus + '</span></div>' +
                        (transactionId ? '<div class="qr-info-row"><span class="qr-info-label">Transaction</span><span class="qr-info-value" style="font-size:0.6rem;">' + transactionId.substring(0, 16) + '...</span></div>' : '') +
                        '<div class="qr-info-row"><span class="qr-info-label">Purchase Date</span><span class="qr-info-value">' + purchaseDateFormatted + ' ' + purchaseTimeFormatted + '</span></div>' +
                    '</div>' +
                '</div>' +
            '</div>' +
            '<div class="ticket-footer">' +
                '<div class="ticket-participant">Participant <span class="participant-name">' + escapeHtml(participantName) + '</span></div>' +
                '<div class="ticket-footer-brand"><i class="fas fa-ticket-alt"></i> Powered by Betix &bull; Secure Digital Ticketing</div>' +
            '</div>' +
        '</div>' +
    '</div>';
}

// ============================================================
// ===== QUANTITY POPUP AVEC DEUX TYPES DE BILLETS =====
// ============================================================

var selectedEventForPurchase = null;
var selectedQuantities = { standard: 0, vip: 0 };
var currentTicketQuantity = 1;

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
    selectedQuantities = { standard: 0, vip: 0 };
    
    var popup = document.getElementById('quantityPopup');
    var titleEl = document.getElementById('quantityEventTitle');
    var infoEl = document.getElementById('quantityEventInfo');
    var maxInfo = document.getElementById('maxQuantityInfo');
    var typeSelector = document.getElementById('ticketTypeSelector');
    var totalDisplay = document.getElementById('totalPriceDisplay');
    
    if (titleEl) titleEl.textContent = event.title;
    if (infoEl) {
        var dateEvent = new Date(event.date);
        infoEl.textContent = dateEvent.toLocaleDateString('en-US') + ' at ' + dateEvent.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }) + ' | ' + event.location;
    }
    if (maxInfo) {
        maxInfo.textContent = 'Maximum ' + event.seatsLeft + ' tickets total';
    }
    
    // Générer les options de types de billets avec quantités
    if (typeSelector) {
        typeSelector.innerHTML = '';
        var ticketTypes = event.ticketTypes || { standard: { enabled: true, price: event.price || 0.0003 } };
        var hasSelected = false;
        
        if (ticketTypes.standard && ticketTypes.standard.enabled) {
            var divStd = document.createElement('div');
            divStd.className = 'ticket-type-option selected';
            divStd.dataset.type = 'standard';
            divStd.innerHTML = 
                '<span class="type-name">Standard</span>' +
                '<span class="type-price">' + parseFloat(ticketTypes.standard.price).toFixed(6) + ' Pi</span>' +
                '<div class="type-quantity">' +
                    '<button class="qty-mini" onclick="event.stopPropagation(); updateTicketTypeQuantity(\'standard\', -1)">-</button>' +
                    '<span class="qty-value" id="qtyStandard">0</span>' +
                    '<button class="qty-mini" onclick="event.stopPropagation(); updateTicketTypeQuantity(\'standard\', 1)">+</button>' +
                '</div>' +
                '<span class="type-check"><i class="fas fa-check"></i></span>';
            divStd.onclick = function() { 
                document.querySelectorAll('.ticket-type-option').forEach(function(el) {
                    el.classList.toggle('selected', el === this);
                }, this);
            };
            typeSelector.appendChild(divStd);
            hasSelected = true;
        }
        
        if (ticketTypes.vip && ticketTypes.vip.enabled) {
            var divVip = document.createElement('div');
            divVip.className = 'ticket-type-option';
            divVip.dataset.type = 'vip';
            divVip.innerHTML = 
                '<span class="type-name">VIP</span>' +
                '<span class="type-price">' + parseFloat(ticketTypes.vip.price).toFixed(6) + ' Pi</span>' +
                '<div class="type-quantity">' +
                    '<button class="qty-mini" onclick="event.stopPropagation(); updateTicketTypeQuantity(\'vip\', -1)">-</button>' +
                    '<span class="qty-value" id="qtyVip">0</span>' +
                    '<button class="qty-mini" onclick="event.stopPropagation(); updateTicketTypeQuantity(\'vip\', 1)">+</button>' +
                '</div>' +
                '<span class="type-check"><i class="fas fa-check"></i></span>';
            divVip.onclick = function() {
                document.querySelectorAll('.ticket-type-option').forEach(function(el) {
                    el.classList.toggle('selected', el === this);
                }, this);
            };
            typeSelector.appendChild(divVip);
            if (!hasSelected) {
                divVip.classList.add('selected');
                hasSelected = true;
            }
        }
        
        // Si aucune catégorie n'est sélectionnée, forcer Standard
        if (!hasSelected) {
            var divStd = document.createElement('div');
            divStd.className = 'ticket-type-option selected';
            divStd.dataset.type = 'standard';
            divStd.innerHTML = 
                '<span class="type-name">Standard</span>' +
                '<span class="type-price">' + (event.price || 0.0003).toFixed(6) + ' Pi</span>' +
                '<div class="type-quantity">' +
                    '<button class="qty-mini" onclick="event.stopPropagation(); updateTicketTypeQuantity(\'standard\', -1)">-</button>' +
                    '<span class="qty-value" id="qtyStandard">0</span>' +
                    '<button class="qty-mini" onclick="event.stopPropagation(); updateTicketTypeQuantity(\'standard\', 1)">+</button>' +
                '</div>' +
                '<span class="type-check"><i class="fas fa-check"></i></span>';
            divStd.onclick = function() {
                document.querySelectorAll('.ticket-type-option').forEach(function(el) {
                    el.classList.toggle('selected', el === this);
                }, this);
            };
            typeSelector.appendChild(divStd);
        }
    }
    
    updateTotalPrice();
    popup.classList.add('show');
}

function updateTicketTypeQuantity(type, delta) {
    var event = selectedEventForPurchase;
    if (!event) return;
    
    var ticketTypes = event.ticketTypes || { standard: { enabled: true, price: event.price || 0.0003 } };
    var maxTotal = event.seatsLeft;
    
    // Calculer le total actuel
    var currentTotal = selectedQuantities.standard + selectedQuantities.vip;
    var newVal = selectedQuantities[type] + delta;
    if (newVal < 0) newVal = 0;
    if (currentTotal + delta > maxTotal) {
        alert('Total tickets cannot exceed ' + maxTotal);
        return;
    }
    selectedQuantities[type] = newVal;
    
    // Mettre à jour l'affichage
    var qtyEl = document.getElementById('qty' + type.charAt(0).toUpperCase() + type.slice(1));
    if (qtyEl) qtyEl.textContent = selectedQuantities[type];
    
    // Sélectionner automatiquement le type si quantité > 0
    if (selectedQuantities[type] > 0) {
        document.querySelectorAll('.ticket-type-option').forEach(function(el) {
            el.classList.toggle('selected', el.dataset.type === type);
        });
    }
    
    updateTotalPrice();
}

function updateTotalPrice() {
    var totalDisplay = document.getElementById('totalPriceDisplay');
    if (!totalDisplay || !selectedEventForPurchase) return;
    
    var ticketTypes = selectedEventForPurchase.ticketTypes || { standard: { enabled: true, price: selectedEventForPurchase.price || 0.0003 } };
    var total = 0;
    var totalQty = 0;
    
    if (ticketTypes.standard && ticketTypes.standard.enabled) {
        total += selectedQuantities.standard * (ticketTypes.standard.price || 0);
        totalQty += selectedQuantities.standard;
    }
    if (ticketTypes.vip && ticketTypes.vip.enabled) {
        total += selectedQuantities.vip * (ticketTypes.vip.price || 0);
        totalQty += selectedQuantities.vip;
    }
    
    totalDisplay.textContent = total.toFixed(6) + ' Pi';
    
    // Mettre à jour le bouton de confirmation
    var confirmBtn = document.getElementById('confirmBuyBtn');
    if (confirmBtn) {
        if (totalQty > 0) {
            confirmBtn.textContent = 'Buy ' + totalQty + ' ticket(s) - ' + total.toFixed(6) + ' Pi';
            confirmBtn.disabled = false;
        } else {
            confirmBtn.textContent = 'Select at least 1 ticket';
            confirmBtn.disabled = true;
        }
    }
}

function closeQuantityPopup() {
    document.getElementById('quantityPopup').classList.remove('show');
    selectedEventForPurchase = null;
    selectedQuantities = { standard: 0, vip: 0 };
}

function confirmPurchaseFromPopup() {
    if (!selectedEventForPurchase) {
        alert('No event selected');
        return;
    }
    
    var totalQty = selectedQuantities.standard + selectedQuantities.vip;
    if (totalQty <= 0) {
        alert('Please select at least 1 ticket');
        return;
    }
    
    if (totalQty > selectedEventForPurchase.seatsLeft) {
        alert('Only ' + selectedEventForPurchase.seatsLeft + ' tickets available');
        return;
    }
    
    // Déterminer le type de billet principal (celui avec le plus de quantité)
    var primaryType = 'standard';
    if (selectedQuantities.vip > 0 && selectedQuantities.vip >= selectedQuantities.standard) {
        primaryType = 'vip';
    }
    
    confirmPurchase(selectedEventForPurchase.id, totalQty, primaryType);
}

// ============================================================
// ===== PURCHASE =====
// ============================================================

async function confirmPurchase(eventId, quantity, ticketType) {
    var event = events.find(function(e) { return e.id === eventId; });
    if (!event) { alert('Event not found'); return; }
    if (quantity > event.seatsLeft) { alert('Only ' + event.seatsLeft + ' seats available'); return; }
    
    var ticketTypes = event.ticketTypes || { standard: { enabled: true, price: event.price || 0.0003 } };
    var price = 0;
    var ticketTypeName = 'Standard';
    
    // Calculer le prix moyen
    var totalPrice = 0;
    if (ticketTypes.standard && ticketTypes.standard.enabled) {
        totalPrice += selectedQuantities.standard * (ticketTypes.standard.price || 0);
    }
    if (ticketTypes.vip && ticketTypes.vip.enabled) {
        totalPrice += selectedQuantities.vip * (ticketTypes.vip.price || 0);
    }
    
    // Utiliser le type principal pour l'affichage
    if (selectedQuantities.vip > 0 && selectedQuantities.vip >= selectedQuantities.standard) {
        ticketTypeName = 'VIP';
    } else {
        ticketTypeName = 'Standard';
    }
    
    if (!confirm('Buy ' + quantity + ' ticket(s) for "' + event.title + '" (Total: ' + totalPrice.toFixed(6) + ' Pi) ?')) { return; }
    closeQuantityPopup();
    
    try {
        var payment = await Pi.createPayment({
            amount: Number(totalPrice),
            memo: quantity + ' ticket(s): ' + event.title + ' (' + selectedQuantities.standard + ' Standard, ' + selectedQuantities.vip + ' VIP)',
            metadata: { 
                eventId: event.id, 
                eventTitle: event.title, 
                quantity: quantity,
                standardQty: selectedQuantities.standard,
                vipQty: selectedQuantities.vip,
                ticketType: ticketTypeName
            }
        }, {
            onReadyForServerApproval: function(paymentId) {
                fetch(BACKEND_URL + '/api/pi/approve', { 
                    method: 'POST', 
                    headers: { 'Content-Type': 'application/json' }, 
                    body: JSON.stringify({ paymentId: paymentId }) 
                });
            },
            onReadyForServerCompletion: function(paymentId, txid) {
                fetch(BACKEND_URL + '/api/pi/complete', { 
                    method: 'POST', 
                    headers: { 'Content-Type': 'application/json' }, 
                    body: JSON.stringify({ 
                        paymentId: paymentId, 
                        txid: txid, 
                        amount: totalPrice, 
                        metadata: { 
                            eventId: event.id, 
                            quantity: quantity,
                            standardQty: selectedQuantities.standard,
                            vipQty: selectedQuantities.vip
                        } 
                    }) 
                }).then(async function() {
                    var ticketsAdded = [];
                    var ticketIndex = 0;
                    
                    // Créer les tickets Standard
                    for (var i = 0; i < selectedQuantities.standard; i++) {
                        var stdPrice = (ticketTypes.standard && ticketTypes.standard.enabled) ? ticketTypes.standard.price : event.price || 0.0003;
                        var ticket = {
                            id: Date.now().toString() + '-' + ticketIndex++,
                            eventId: event.id,
                            eventTitle: event.title,
                            eventDate: event.date,
                            eventLocation: event.location,
                            category: event.category || '',
                            price: stdPrice,
                            buyerWallet: piUser ? piUser.username : currentUser.wallet,
                            buyerName: piUser ? piUser.username : currentUser.name,
                            userWallet: currentUser.wallet,
                            purchaseDate: new Date().toISOString(),
                            purchaseDateTime: new Date().toLocaleString('en-US'),
                            transactionId: txid,
                            qrCode: 'BETIX-' + Date.now() + '-' + txid.substring(0, 8) + '-' + ticketIndex,
                            status: 'Valid',
                            ticketType: 'Standard',
                            quantity: 1,
                            paymentStatus: 'Paid'
                        };
                        tickets.push(ticket);
                        ticketsAdded.push(ticket);
                    }
                    
                    // Créer les tickets VIP
                    for (var i = 0; i < selectedQuantities.vip; i++) {
                        var vipPrice = (ticketTypes.vip && ticketTypes.vip.enabled) ? ticketTypes.vip.price : 0.001;
                        var ticket = {
                            id: Date.now().toString() + '-' + ticketIndex++,
                            eventId: event.id,
                            eventTitle: event.title,
                            eventDate: event.date,
                            eventLocation: event.location,
                            category: event.category || '',
                            price: vipPrice,
                            buyerWallet: piUser ? piUser.username : currentUser.wallet,
                            buyerName: piUser ? piUser.username : currentUser.name,
                            userWallet: currentUser.wallet,
                            purchaseDate: new Date().toISOString(),
                            purchaseDateTime: new Date().toLocaleString('en-US'),
                            transactionId: txid,
                            qrCode: 'BETIX-' + Date.now() + '-' + txid.substring(0, 8) + '-' + ticketIndex,
                            status: 'Valid',
                            ticketType: 'VIP',
                            quantity: 1,
                            paymentStatus: 'Paid'
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
                        'Purchase of ' + quantity + ' ticket(s) for "' + event.title + '" (' + selectedQuantities.standard + ' Standard, ' + selectedQuantities.vip + ' VIP)',
                        'purchase'
                    );
                    renderEventsByCategory();
                    renderTickets();
                    renderHistory();
                    updateProfilePage();
                    showSuccessPopup(event, ticketsAdded, quantity);
                });
            },
            onCancel: function() { alert("Payment cancelled"); },
            onError: function(error) { alert("Payment error: " + error.message); }
        });
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
    var codeDisplay = ticket.qrCode || 'N/A';
    var typeDisplay = ticket.ticketType || 'Standard';
    
    // Calculer le total
    var totalPrice = 0;
    for (var i = 0; i < ticketsList.length; i++) {
        totalPrice += ticketsList[i].price || 0;
    }
    
    var stdCount = ticketsList.filter(function(t) { return t.ticketType === 'Standard'; }).length;
    var vipCount = ticketsList.filter(function(t) { return t.ticketType === 'VIP'; }).length;
    
    info.innerHTML = 
        '<div class="ticket-line"><span class="ticket-label">Event</span><span class="ticket-value">' + escapeHtml(event.title) + '</span></div>' +
        '<div class="ticket-line"><span class="ticket-label">Standard</span><span class="ticket-value">' + stdCount + ' x ' + (ticketTypes && ticketTypes.standard ? ticketTypes.standard.price.toFixed(6) : event.price.toFixed(6)) + ' Pi</span></div>' +
        (vipCount > 0 ? '<div class="ticket-line"><span class="ticket-label">VIP</span><span class="ticket-value">' + vipCount + ' x ' + (ticketTypes && ticketTypes.vip ? ticketTypes.vip.price.toFixed(6) : '0.001') + ' Pi</span></div>' : '') +
        '<div class="ticket-line"><span class="ticket-label">Date</span><span class="ticket-value">' + dateFormatted + ' at ' + timeFormatted + '</span></div>' +
        '<div class="ticket-line"><span class="ticket-label">Location</span><span class="ticket-value">' + escapeHtml(event.location || 'Online') + '</span></div>' +
        '<div class="ticket-line"><span class="ticket-label">Organizer</span><span class="ticket-value">' + escapeHtml(event.organizerName || event.organizer) + '</span></div>' +
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
// ===== IMAGE UPLOAD MODERN (CORRIGÉ) =====
// ============================================================

async function handleImageUploadModern(file, index) {
    if (!file) {
        console.warn('No file selected for index', index);
        return;
    }
    
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
            
            // AFFICHER L'IMAGE DANS L'APERÇU
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
// ===== CREATE EVENT AVEC TYPES DE BILLETS =====
// ============================================================

function createEvent(e) {
    e.preventDefault();
    
    if (!currentUser.wallet) { 
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
    
    var durationValue = document.getElementById('eventDurationValue').value;
    var durationUnit = document.getElementById('eventDurationUnit').value;
    var durationValueNum = durationValue ? parseInt(durationValue) : null;
    
    // Récupérer les types de billets
    var standardEnabled = document.getElementById('ticketStandardEnabled').checked;
    var standardPrice = parseFloat(document.getElementById('ticketStandardPrice').value);
    var vipEnabled = document.getElementById('ticketVipEnabled').checked;
    var vipPrice = parseFloat(document.getElementById('ticketVipPrice').value);
    
    var ticketTypes = {
        standard: {
            enabled: standardEnabled,
            price: standardEnabled ? standardPrice : 0
        },
        vip: {
            enabled: vipEnabled,
            price: vipEnabled ? vipPrice : 0
        }
    };
    
    // Vérifier qu'au moins un type de billet est sélectionné
    if (!ticketTypes.standard.enabled && !ticketTypes.vip.enabled) {
        alert('Please select at least one ticket type (Standard or VIP)');
        return;
    }
    
    // Vérifier que les prix sont renseignés pour les types sélectionnés
    if (ticketTypes.standard.enabled && (!ticketTypes.standard.price || ticketTypes.standard.price <= 0 || isNaN(ticketTypes.standard.price))) {
        alert('Please enter a valid price for Standard tickets');
        document.getElementById('ticketStandardPrice').focus();
        return;
    }
    if (ticketTypes.vip.enabled && (!ticketTypes.vip.price || ticketTypes.vip.price <= 0 || isNaN(ticketTypes.vip.price))) {
        alert('Please enter a valid price for VIP tickets');
        document.getElementById('ticketVipPrice').focus();
        return;
    }
    
    var mainPrice = ticketTypes.standard.enabled ? ticketTypes.standard.price : (ticketTypes.vip.enabled ? ticketTypes.vip.price : 0.0003);
    
    var newEvent = {
        id: Date.now().toString(),
        title: document.getElementById('eventTitle').value,
        category: category,
        country: country || 'France',
        date: document.getElementById('eventDate').value,
        location: document.getElementById('eventLocation').value,
        description: document.getElementById('eventDescription').value,
        conditions: conditions,
        price: mainPrice,
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
        durationUnit: durationUnit,
        ticketTypes: ticketTypes
    };
    
    if (!newEvent.title || !newEvent.date || !newEvent.location || !newEvent.seatsTotal) { 
        alert('Please fill in all required fields'); 
        return; 
    }
    
    openPublishConfirm(newEvent);
}

// ============================================================
// ===== PUBLISH CONFIRMATION =====
// ============================================================

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
    
    var ticketTypesDisplay = document.getElementById('confirmTicketTypes');
    if (ticketTypesDisplay && eventData.ticketTypes) {
        var typesHtml = '';
        if (eventData.ticketTypes.standard && eventData.ticketTypes.standard.enabled) {
            typesHtml += '<span style="display:inline-block;background:#e8f5e9;color:#2e7d32;padding:2px 12px;border-radius:12px;font-size:0.7rem;margin:2px;">Standard: ' + eventData.ticketTypes.standard.price.toFixed(6) + ' Pi</span> ';
        }
        if (eventData.ticketTypes.vip && eventData.ticketTypes.vip.enabled) {
            typesHtml += '<span style="display:inline-block;background:#fff3e0;color:#e65100;padding:2px 12px;border-radius:12px;font-size:0.7rem;margin:2px;">VIP: ' + eventData.ticketTypes.vip.price.toFixed(6) + ' Pi</span> ';
        }
        ticketTypesDisplay.innerHTML = typesHtml || 'Not specified';
    }
    
    var durationDisplay = document.getElementById('confirmDuration');
    if (durationDisplay) {
        if (eventData.durationValue && eventData.durationUnit) {
            var durDisplay = getDurationDisplay(eventData);
            durationDisplay.textContent = 'Duration: ' + durDisplay;
            durationDisplay.style.display = 'block';
        } else {
            durationDisplay.style.display = 'none';
        }
    }
    
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
    
    var confirmBtn = document.getElementById('confirmPublishBtn');
    confirmBtn.disabled = false;
    confirmBtn.textContent = 'Publish Event';
    
    var loadingOverlay = document.querySelector('.publish-loading-overlay');
    if (loadingOverlay) {
        loadingOverlay.classList.remove('active');
    }
    
    document.getElementById('publishConfirmPopup').classList.add('show');
}

function closePublishConfirmPopup() {
    document.getElementById('publishConfirmPopup').classList.remove('show');
    pendingEventData = null;
    
    var loadingOverlay = document.querySelector('.publish-loading-overlay');
    if (loadingOverlay) {
        loadingOverlay.classList.remove('active');
    }
    var confirmBtn = document.getElementById('confirmPublishBtn');
    if (confirmBtn) {
        confirmBtn.disabled = false;
        confirmBtn.textContent = 'Publish Event';
    }
}

async function confirmPublishEvent() {
    if (!pendingEventData) return;
    
    var confirmBtn = document.getElementById('confirmPublishBtn');
    var loadingOverlay = document.querySelector('.publish-loading-overlay');
    
    confirmBtn.disabled = true;
    confirmBtn.textContent = 'Publishing...';
    if (loadingOverlay) {
        loadingOverlay.classList.add('active');
    }
    
    var newEvent = pendingEventData;
    
    try {
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
        
        document.getElementById('eventForm').reset();
        for (var i = 0; i < 2; i++) {
            removeImageModern(i);
        }
        uploadedImages = {};
        
        addNotification(
            'New event "' + newEvent.title + '" has been published!',
            'event'
        );
        
        if (loadingOverlay) {
            loadingOverlay.classList.remove('active');
        }
        confirmBtn.disabled = false;
        confirmBtn.textContent = 'Publish Event';
        
        closePublishConfirmPopup();
        renderEventsByCategory();
        updateProfilePage();
        alert('Event "' + newEvent.title + '" has been successfully published!');
        showPage('home');
        
    } catch (error) {
        console.error('Error publishing event:', error);
        if (loadingOverlay) {
            loadingOverlay.classList.remove('active');
        }
        confirmBtn.disabled = false;
        confirmBtn.textContent = 'Publish Event';
        alert('An error occurred while publishing the event. Please try again.');
    }
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
        container.innerHTML = '<p style="text-align:center;padding:2rem;color:var(--gray);">You haven\'t created any events yet</p>';
        return;
    }
    
    var html = '';
    for (var i = 0; i < myEvents.length; i++) {
        html += renderMyEventCard(myEvents[i]);
    }
    container.innerHTML = html;
}

function renderMyEventCard(event) {
    var dateEvent = new Date(event.date);
    var dateFormatted = dateEvent.toLocaleDateString('en-US');
    var timeFormatted = dateEvent.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    
    var galleryHtml = '';
    if (event.images && event.images.length > 0) {
        galleryHtml = '<div class="event-gallery-wrapper"><div class="event-gallery">';
        for (var i = 0; i < Math.min(event.images.length, 3); i++) {
            galleryHtml += '<img src="' + event.images[i] + '" class="event-gallery-img" onclick="event.stopPropagation(); openGallery(\'' + event.id + '\', ' + i + ')">';
        }
        galleryHtml += '</div></div>';
    } else {
        galleryHtml = '<div class="event-gallery-wrapper"><div class="event-gallery"><img src="' + eventImagesList[event.category] + '" class="event-gallery-img" style="width:100%;height:150px;object-fit:cover;"></div></div>';
    }
    
    var ticketSold = tickets.filter(function(t) { return t.eventId === event.id; }).length;
    
    var durationDisplay = '';
    if (event.durationValue && event.durationUnit) {
        var durDisplay = getDurationDisplay(event);
        durationDisplay = '<div class="detail-item"><i class="fas fa-clock"></i> Duration: ' + durDisplay + '</div>';
    }
    
    var ticketTypesDisplay = '';
    if (event.ticketTypes) {
        var types = [];
        if (event.ticketTypes.standard && event.ticketTypes.standard.enabled) {
            types.push('Standard (' + event.ticketTypes.standard.price.toFixed(6) + ' Pi)');
        }
        if (event.ticketTypes.vip && event.ticketTypes.vip.enabled) {
            types.push('VIP (' + event.ticketTypes.vip.price.toFixed(6) + ' Pi)');
        }
        if (types.length > 0) {
            ticketTypesDisplay = '<div class="detail-item"><i class="fas fa-ticket-alt"></i> ' + types.join(' | ') + '</div>';
        }
    }
    
    return '<div class="event-card" style="cursor:default; position:relative;">' +
        galleryHtml +
        '<div class="event-info">' +
            '<div class="event-title">' + escapeHtml(event.title) + '</div>' +
            '<div class="event-details-grid">' +
                '<div class="detail-item"><i class="fas fa-calendar-day"></i> ' + dateFormatted + '</div>' +
                '<div class="detail-item"><i class="fas fa-clock"></i> ' + timeFormatted + '</div>' +
                '<div class="detail-item"><i class="fas fa-map-marker-alt"></i> ' + escapeHtml(event.location || 'Online') + '</div>' +
                '<div class="detail-item"><i class="fas fa-flag"></i> ' + getCountryFlag(event.country) + ' ' + escapeHtml(event.country || 'Not specified') + '</div>' +
                '<div class="detail-item"><i class="fas fa-ticket-alt"></i> ' + ticketSold + ' sold</div>' +
                '<div class="detail-item"><i class="fas fa-users"></i> ' + event.seatsLeft + '/' + event.seatsTotal + ' seats</div>' +
                durationDisplay +
                ticketTypesDisplay +
            '</div>' +
            '<div class="event-footer" style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:8px; margin-top:8px;">' +
                '<div><span class="event-price">' + event.price.toFixed(6) + ' Pi</span></div>' +
                '<div style="display:flex; gap:8px;">' +
                    '<button class="btn-secondary" onclick="event.stopPropagation(); openEditEventModal(\'' + event.id + '\')" style="background:var(--primary); color:white; padding:4px 12px; font-size:0.7rem;">Edit</button>' +
                '</div>' +
            '</div>' +
        '</div>' +
    '</div>';
}

// ============================================================
// ===== EDIT EVENT MODAL =====
// ============================================================

var editingEventId = null;

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
    document.getElementById('detailCountry').textContent = getCountryFlag(event.country) + ' ' + (event.country || 'Not specified');
    
    var dateEvent = new Date(event.date);
    document.getElementById('detailDate').textContent = dateEvent.toLocaleDateString('en-US') + ' at ' + dateEvent.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    document.getElementById('detailLocation').textContent = event.location || 'Online';
    document.getElementById('detailPrice').textContent = event.price.toFixed(6) + ' Pi';
    document.getElementById('detailSeats').textContent = event.seatsLeft + '/' + event.seatsTotal + ' seats';
    document.getElementById('detailDescription').textContent = event.description || 'No description';
    document.getElementById('detailOrganizer').textContent = event.organizerName || event.organizer || 'Unknown';
    document.getElementById('detailCreated').textContent = new Date(event.createdAt).toLocaleDateString('en-US');
    document.getElementById('detailBoosts').textContent = event.seatsLeft + '/' + event.seatsTotal;
    
    var durationDisplay = document.getElementById('detailDuration');
    if (durationDisplay) {
        var durDisplay = getDurationDisplay(event);
        if (durDisplay) {
            durationDisplay.textContent = 'Duration: ' + durDisplay;
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
        for (var k = 0; k < eventRatings.length; k++) {
            var r = eventRatings[k];
            var div = document.createElement('div');
            div.className = 'review-item';
            var stars = '';
            for (var s = 0; s < r.rating; s++) stars += '★';
            for (var s = r.rating; s < 5; s++) stars += '☆';
            div.innerHTML = '<div class="review-header"><span class="review-user">' + escapeHtml(r.userName || r.userWallet) + '</span><span class="review-stars">' + stars + '</span></div>' +
                           (r.comment ? '<div class="review-text">"' + escapeHtml(r.comment) + '"</div>' : '') +
                           '<div class="review-date">' + new Date(r.date).toLocaleDateString('en-US') + '</div>';
            reviewsContainer.appendChild(div);
        }
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
// ===== MY RATINGS =====
// ============================================================

function renderMyRatings() {
    var container = document.getElementById('myRatingsList');
    if (!container) return;
    var myRatings = ratings.filter(function(r) { return r.userWallet === (currentUser.wallet || currentUser.name); });
    if (!myRatings.length) { 
        container.innerHTML = '<p style="text-align:center;padding:2rem;">No ratings</p>'; 
        return; 
    }
    var html = '';
    for (var i = 0; i < myRatings.length; i++) {
        var r = myRatings[i];
        var stars = '';
        for (var s = 0; s < r.rating; s++) stars += '★';
        for (var s = r.rating; s < 5; s++) stars += '☆';
        html += '<div class="ticket-card"><h3>' + escapeHtml(r.eventTitle) + '</h3><div>Rating: ' + r.rating + '/5 ' + stars + '</div>' + (r.comment ? '<p>"' + escapeHtml(r.comment) + '"</p>' : '') + '<small>' + new Date(r.date).toLocaleDateString() + '</small></div>';
    }
    container.innerHTML = html;
}

// ============================================================
// ===== ADMIN FUNCTIONS =====
// ============================================================

function initAdmin() {
    var adminItem = document.getElementById('adminMenuItem');
    if (!adminItem) return;
    
    var logo = document.querySelector('.logo');
    var clicks = 0;
    if (logo) {
        logo.addEventListener('click', function() { 
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
    }
    
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
    var html = '';
    for (var i = 0; i < adminLogs.length; i++) {
        var log = adminLogs[i];
        html += '<div class="admin-log-item">' +
            '<div>' +
                '<span class="log-user">' + escapeHtml(log.user) + '</span>' +
                ' <span class="log-action">' + escapeHtml(log.action) + '</span>' +
                (log.details ? ' <span style="color:var(--gray);font-size:0.8rem;">' + escapeHtml(log.details) + '</span>' : '') +
            '</div>' +
            '<span class="log-time">' + escapeHtml(log.date) + '</span>' +
        '</div>';
    }
    container.innerHTML = html;
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
    var html = '';
    for (var i = 0; i < events.length; i++) {
        var e = events[i];
        html += '<div class="admin-event-item">' +
            '<div class="event-info">' +
                '<strong>' + escapeHtml(e.title) + '</strong>' +
                '<small>' + e.category + ' | ' + e.country + ' | ' + e.seatsLeft + '/' + e.seatsTotal + ' seats | ' + new Date(e.date).toLocaleDateString('en-US') + '</small>' +
                '<small>Organizer: ' + escapeHtml(e.organizerName || e.organizer) + '</small>' +
            '</div>' +
            '<div class="event-actions">' +
                '<button class="admin-delete-btn" onclick="adminDeleteEvent(\'' + e.id + '\')">Delete</button>' +
            '</div>' +
        '</div>';
    }
    container.innerHTML = html;
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
    var html = '';
    for (var i = 0; i < heroSlides.length; i++) {
        var slide = heroSlides[i];
        html += '<div class="admin-slide-item">' +
            '<img src="' + slide.image + '" class="slide-preview" onerror="this.style.display=\'none\'">' +
            '<div class="slide-info">' +
                '<h4>' + escapeHtml(slide.title) + '</h4>' +
                '<p>' + (slide.badge || 'Uncategorized') + ' • ' + (slide.description || '') + '</p>' +
            '</div>' +
            '<div class="slide-actions">' +
                '<button class="edit-btn" onclick="adminEditSlide(' + i + ')">Edit</button>' +
                '<button class="delete-btn" onclick="adminDeleteSlide(' + i + ')">Delete</button>' +
            '</div>' +
        '</div>';
    }
    container.innerHTML = html;
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
        { q: "How to buy a ticket?", a: "Connect, browse events, click 'Buy Ticket' and choose the ticket type and quantity." },
        { q: "Are payments secure?", a: "Yes, via the Pi Network and Betix's escrow system." },
        { q: "Can I get a refund?", a: "Yes in case of cancellation, postponement or fraud." },
        { q: "Where are my tickets stored?", a: "In the 'My Tickets' section of your account." }
    ],
    [
        { q: "How to create an event?", a: "Connect, click 'Create Event' and fill out the form." },
        { q: "What ticket types can I offer?", a: "You can offer Standard and VIP tickets with different prices." },
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
    for (var i = 0; i < pageData.length; i++) {
        var item = pageData[i];
        html += '<div class="faq-item" style="animation-delay: ' + (i * 0.04) + 's">' +
            '<div class="faq-q"><span class="q-icon">Q</span>' + item.q + '</div>' +
            '<div class="faq-a">' + item.a + '</div>' +
        '</div>';
    }
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
// ===== HERO SLIDER =====
// ============================================================

function initHeroSlider() {
    var slidesContainer = document.getElementById('heroSlides');
    if (!slidesContainer) return;
    
    slidesContainer.innerHTML = '';
    for (var i = 0; i < heroSlides.length; i++) {
        var slide = heroSlides[i];
        var div = document.createElement('div');
        div.className = 'hero-slide' + (i === 0 ? ' active' : '');
        div.innerHTML = '<div class="hero-slide-bg" style="background-image: url(\'' + slide.image + '\');"></div><div class="hero-slide-content"><div class="hero-badge">' + (slide.badge || 'Event') + '</div><h2>' + slide.title + '</h2><p>' + (slide.description || '') + '</p></div>';
        slidesContainer.appendChild(div);
    }
    
    var dotsContainer = document.getElementById('heroDots');
    if (dotsContainer) {
        dotsContainer.innerHTML = '';
        for (var i = 0; i < heroSlides.length; i++) {
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
        }
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
        
        for (var i = 0; i < slides.length; i++) {
            slides[i].classList.remove('active');
            if (i === currentIndex) {
                slides[i].classList.add('active');
                var bg = slides[i].querySelector('.hero-slide-bg');
                if (bg) {
                    bg.style.transition = 'none';
                    bg.style.transform = 'scale(1.05)';
                    setTimeout(function() {
                        bg.style.transition = 'transform 8s ease';
                        bg.style.transform = 'scale(1)';
                    }, 50);
                }
            }
        }
        for (var i = 0; i < dots.length; i++) {
            dots[i].classList.remove('active');
            if (i === currentIndex) dots[i].classList.add('active');
        }
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
            profilePhoto: currentUser.profilePhoto || null,
            loyaltyPoints: currentUser.loyaltyPoints || 0,
            memberSince: currentUser.memberSince || '2026'
        };
        if (!existing) {
            connectedUsers.push(userData);
        } else {
            existing.name = currentUser.name;
            existing.ticketCount = tickets.length;
            existing.lastSeen = new Date().toLocaleString();
            existing.profilePhoto = currentUser.profilePhoto || null;
            existing.loyaltyPoints = currentUser.loyaltyPoints || 0;
        }
        localStorage.setItem('betix_connected_users', JSON.stringify(connectedUsers));
    }
}

// ============================================================
// ===== DARK MODE =====
// ============================================================

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
    
    events = [];
    tickets = [];
    notifications = [];
    
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
    if (searchInput) searchInput.addEventListener('input', function(e) { 
        searchQuery = e.target.value.toLowerCase(); 
        renderEventsByCategory(); 
    });
    if (clearDataBtn) clearDataBtn.addEventListener('click', clearAllData);
    if (backBtn) backBtn.addEventListener('click', goBack);
    
    // Gestionnaire d'événements pour les cases à cocher des types de billets
    var ticketStandardEnabled = document.getElementById('ticketStandardEnabled');
    var ticketStandardPrice = document.getElementById('ticketStandardPrice');
    var ticketVipEnabled = document.getElementById('ticketVipEnabled');
    var ticketVipPrice = document.getElementById('ticketVipPrice');
    
    if (ticketStandardEnabled && ticketStandardPrice) {
        ticketStandardEnabled.addEventListener('change', function() {
            ticketStandardPrice.disabled = !this.checked;
            if (!this.checked) ticketStandardPrice.value = '';
        });
        ticketStandardPrice.disabled = !ticketStandardEnabled.checked;
    }
    if (ticketVipEnabled && ticketVipPrice) {
        ticketVipEnabled.addEventListener('change', function() {
            ticketVipPrice.disabled = !this.checked;
            if (!this.checked) ticketVipPrice.value = '';
        });
        ticketVipPrice.disabled = !ticketVipEnabled.checked;
    }
    
    var imageInputsModern = document.querySelectorAll('.image-input-modern');
    for (var i = 0; i < imageInputsModern.length; i++) {
        var input = imageInputsModern[i];
        input.addEventListener('change', function(e) {
            var idx = parseInt(this.dataset.index);
            if (this.files && this.files[0]) {
                handleImageUploadModern(this.files[0], idx);
            }
        });
        
        var box = document.getElementById('uploadBox' + (i + 1));
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
        syncEventsToSupabase();
        syncTicketsToSupabase();
        syncNotificationsToSupabase();
    }, 30000);

    window.addEventListener('beforeunload', function() {
        syncEventsToSupabase();
        syncTicketsToSupabase();
        syncNotificationsToSupabase();
    });
    
    if (currentUser.wallet && isSessionExpired()) { 
        disconnectPi(); 
    }
});

console.log('Betix loaded successfully!');
console.log('Supabase connected (Storage only mode)');
console.log('Admin: 5 clicks on logo + password Betix@2026#');