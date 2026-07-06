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

const countriesWithFlags = [
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

// Tri alphabétique
countriesWithFlags.sort((a, b) => a.name.localeCompare(b.name));

// Map flag par nom de pays
const flagMap = {};
countriesWithFlags.forEach(c => { flagMap[c.name] = c.flag; });

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

function getCountryFlagEmoji(countryName) {
    return getCountryFlag(countryName);
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
            maxWidth: options.maxWidth || 800,
            maxHeight: options.maxHeight || 800,
            quality: options.quality || 0.7,
            format: options.format || 'image/webp',
            maxSizeMB: options.maxSizeMB || 5
        };

        if (file.size / (1024 * 1024) < 0.2) {
            var reader = new FileReader();
            reader.onload = function(e) { resolve(e.target.result); };
            reader.onerror = function() { reject(new Error('Erreur de lecture du fichier')); };
            reader.readAsDataURL(file);
            return;
        }

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
                
                var compressedSize = compressedDataUrl.length * 0.75 / (1024 * 1024);
                if (compressedSize > config.maxSizeMB && config.quality > 0.3) {
                    var newQuality = Math.max(0.3, config.quality - 0.2);
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

async function uploadProfilePhoto(piUid, base64Data) {
    var filePath = piUid + '/avatar_' + Date.now() + '.webp';
    return await uploadToSupabaseStorage('avatars', filePath, base64Data);
}

async function uploadEventImage(eventId, base64Data, index) {
    var filePath = eventId + '/image_' + index + '_' + Date.now() + '.webp';
    return await uploadToSupabaseStorage('events-images', filePath, base64Data);
}

// ============================================================
// ===== SUPABASE TABLE FUNCTIONS =====
// ============================================================

async function saveUserToSupabase(piUid, username, wallet, avatarUrl, points) {
    avatarUrl = avatarUrl || null;
    points = points || 0;
    try {
        var now = new Date().toISOString();
        var userData = {
            pi_uid: piUid,
            username: username,
            wallet: wallet,
            avatar_url: avatarUrl,
            points: points,
            updated_at: now
        };
        
        var { data: existing, error: checkError } = await supabaseClient
            .from('users')
            .select('pi_uid')
            .eq('pi_uid', piUid)
            .single();
        
        if (checkError && checkError.code !== 'PGRST116') {
            throw checkError;
        }
        
        if (existing) {
            var { error } = await supabaseClient
                .from('users')
                .update(userData)
                .eq('pi_uid', piUid);
            if (error) throw error;
            console.log('User updated in Supabase:', piUid);
        } else {
            userData.created_at = now;
            var { error } = await supabaseClient
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

async function loadUserFromSupabase(piUid) {
    try {
        var { data, error } = await supabaseClient
            .from('users')
            .select('*')
            .eq('pi_uid', piUid)
            .single();
        
        if (error) {
            if (error.code === 'PGRST116') {
                return null;
            }
            throw error;
        }
        return data;
    } catch (error) {
        console.error('Error loading user from Supabase:', error);
        return null;
    }
}

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
            country: eventData.country || ''
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
            payment_status: ticketData.paymentStatus || 'Paid'
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
    await saveUserToSupabase(
        piUid,
        currentUser.name || 'User',
        currentUser.wallet || piUid,
        currentUser.profilePhoto || null,
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
            id: notif.id,
            receiverPiUid: receiverPiUid,
            title: notif.type === 'purchase' ? 'Ticket Purchase' : notif.type === 'event' ? 'New Event' : 'Notification',
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
                durationUnit: e.duration_unit || null
            };
        });
        localStorage.setItem('betix_events', JSON.stringify(events));
    } else {
        // Ne pas créer d'événements de test, laisser vide
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
                    price: t.price || 0,
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
    // Filtre pays (avec drapeaux)
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
// ===== RENDER TICKETS - DESIGN PREMIUM =====
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
    var validationTime = ticket.validationTime || '';
    var purchaseDate = new Date(ticket.purchaseDate || ticket.purchaseDateTime || new Date());
    var purchaseDateFormatted = purchaseDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    var purchaseTimeFormatted = purchaseDate.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    var officialDesc = 'Official Betix digital ticket confirming your participation in this event. Present this ticket (QR Code or ticket code) at the entrance.';
    
    return '<div class="ticket-premium">' +
        '<div class="ticket-inner">' +
            '<div class="ticket-watermark">BETIX</div>' +
            '<div class="ticket-logo-discreet">Betix</div>' +
            '<div class="ticket-header">' +
                '<span class="ticket-status-badge ' + statusClass + '">' + statusText + '</span>' +
                '<span class="ticket-order-id">Order #' + orderNumber + '</span>' +
            '</div>' +
            '<div class="ticket-body">' +
                '<div class="ticket-event-title">' + escapeHtml(ticket.eventTitle || 'Event') + '</div>' +
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
                        (validationTime ? '<div class="qr-info-row"><span class="qr-info-label">Validated</span><span class="qr-info-value">' + validationTime + '</span></div>' : '') +
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
// ===== PROFILE, USER INFO, NOTIFICATIONS =====
// ============================================================

function updateUserInfo() {
    var sidebarName = document.getElementById('sidebarName');
    var sidebarWallet = document.getElementById('sidebarWallet');
    var sidebarText = document.getElementById('sidebarAvatarText');
    var sidebarImg = document.getElementById('sidebarAvatarImage');
    if (sidebarName) sidebarName.innerText = currentUser.name;
    if (sidebarWallet) sidebarWallet.innerText = currentUser.wallet ? currentUser.wallet.substring(0, 15) + '...' : 'Not connected';
    if (sidebarImg && sidebarText) {
        if (currentUser.profilePhoto) {
            sidebarImg.src = currentUser.profilePhoto;
            sidebarImg.style.display = 'block';
            sidebarText.style.display = 'none';
        } else {
            sidebarImg.style.display = 'none';
            sidebarText.style.display = 'flex';
            sidebarText.innerText = currentUser.name.substring(0, 2).toUpperCase();
        }
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
    
    var profileImg = document.getElementById('profilePageAvatar');
    var profilePlaceholder = document.getElementById('profilePageAvatarPlaceholder');
    if (profileImg && profilePlaceholder) {
        if (currentUser.profilePhoto) {
            profileImg.src = currentUser.profilePhoto;
            profileImg.style.display = 'block';
            profilePlaceholder.style.display = 'none';
        } else {
            profileImg.style.display = 'none';
            profilePlaceholder.style.display = 'flex';
            profilePlaceholder.innerHTML = '<i class="fas fa-user"></i>';
        }
    }
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
            syncUserToSupabase();
            updateActivity();
            updateUserInfo();
            updateProfilePage();
            updateAllProfileImages();
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
    try {
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
        updateAllProfileImages();
        updateConnectButtons();
        closeSidebar();
        alert('You are disconnected');
    }
}

function logout() { disconnectPi(); }

// ============================================================
// ===== PROFILE PHOTO =====
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
        
        var piUid = currentUser.piUid || currentUser.wallet;
        if (piUid) {
            var publicUrl = await uploadProfilePhoto(piUid, compressedData);
            if (publicUrl) {
                currentUser.profilePhoto = publicUrl;
            } else {
                currentUser.profilePhoto = compressedData;
            }
        } else {
            currentUser.profilePhoto = compressedData;
        }
        
        saveUser();
        updateAllProfileImages();
        alert('Profile photo updated successfully!');
    } catch (error) {
        console.error('Error compressing image:', error);
        alert('Error compressing image. Please try with a smaller image.');
    } finally {
        if (loadingMsg) loadingMsg.style.display = 'none';
    }
}

function updateAllProfileImages() {
    var photo = currentUser.profilePhoto || '';
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
            if (sidebarText) sidebarText.innerText = currentUser.name.substring(0, 2).toUpperCase();
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

function goToMyEvents() { showPage('myevents'); }
function goToTickets() { showPage('tickets'); }
function goToHistory() { showPage('history'); }
function goToRatings() { showPage('ratings'); }

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
        durationDisplay = '<div class="detail-item"><i class="fas fa-clock"></i> ' + durDisplay + '</div>';
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
// ===== QUANTITY POPUP =====
// ============================================================

var selectedEventForPurchase = null;
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
// ===== PURCHASE =====
// ============================================================

async function confirmPurchase(eventId, quantity) {
    var event = events.find(function(e) { return e.id === eventId; });
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
                        metadata: { eventId: event.id, quantity: quantity } 
                    }) 
                }).then(async function() {
                    var ticketsAdded = [];
                    for (var i = 0; i < quantity; i++) {
                        var ticket = {
                            id: Date.now().toString() + '-' + i,
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
                            status: 'Valid',
                            ticketType: 'Standard',
                            quantity: quantity,
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
                        'Purchase of ' + quantity + ' ticket(s) for "' + event.title + '" by ' + (currentUser.name || 'a user'),
                        'purchase'
                    );
                    renderEventsByCategory();
                    renderTickets();
                    renderHistory();
                    updateProfilePage();
                    syncUserToSupabase();
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
// ===== IMAGE UPLOAD MODERN =====
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
        organizer: currentUser.wallet,
        organizerPiUid: currentUser.piUid || currentUser.wallet,
        organizerName: currentUser.name,
        createdAt: new Date().toISOString(),
        boosts: 0,
        durationValue: durationValueNum,
        durationUnit: durationUnit
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
    updateAllProfileImages();
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
    if (searchInput) searchInput.addEventListener('input', function(e) { 
        searchQuery = e.target.value.toLowerCase(); 
        renderEventsByCategory(); 
    });
    if (clearDataBtn) clearDataBtn.addEventListener('click', clearAllData);
    if (backBtn) backBtn.addEventListener('click', goBack);
    
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
    
    if (currentUser.wallet && isSessionExpired()) { 
        disconnectPi(); 
    }
});

console.log('Betix loaded successfully!');
console.log('Supabase connected (Storage only mode)');
console.log('Admin: 5 clicks on logo + password Betix@2026#');