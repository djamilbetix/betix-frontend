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
// ===== PI BROWSER SECURITY CHECK =====
// ============================================================

function checkPiBrowser() {
    var isPiBrowser = false;
    
    try {
        if (typeof Pi !== 'undefined' && Pi.version) {
            isPiBrowser = true;
        }
    } catch(e) {}
    
    try {
        if (navigator.userAgent && navigator.userAgent.indexOf('PiBrowser') !== -1) {
            isPiBrowser = true;
        }
    } catch(e) {}
    
    try {
        var urlParams = new URLSearchParams(window.location.search);
        if (urlParams.get('pibrowser') === 'true') {
            isPiBrowser = true;
        }
    } catch(e) {}
    
    if (!isPiBrowser && !localStorage.getItem('betix_pi_warning_dismissed')) {
        setTimeout(function() {
            var warning = document.getElementById('piBrowserCheck');
            if (warning && warning.style.display !== 'flex') {
                warning.style.display = 'flex';
            }
        }, 1500);
    } else {
        var warning = document.getElementById('piBrowserCheck');
        if (warning) {
            warning.style.display = 'none';
        }
    }
}

function dismissPiWarning() {
    localStorage.setItem('betix_pi_warning_dismissed', 'true');
    var warning = document.getElementById('piBrowserCheck');
    if (warning) {
        warning.style.display = 'none';
    }
}

// ============================================================
// ===== COUNTRY LIST WITH FLAGS =====
// ============================================================

var countriesWithFlags = [
    { flag: '🌍', name: 'All' },
    { flag: '🇦🇫', name: 'Afghanistan' },
    { flag: '🇩🇿', name: 'Algeria' },
    { flag: '🇦🇴', name: 'Angola' },
    { flag: '🇦🇷', name: 'Argentina' },
    { flag: '🇦🇺', name: 'Australia' },
    { flag: '🇦🇹', name: 'Austria' },
    { flag: '🇧🇪', name: 'Belgium' },
    { flag: '🇧🇯', name: 'Benin' },
    { flag: '🇧🇼', name: 'Botswana' },
    { flag: '🇧🇷', name: 'Brazil' },
    { flag: '🇧🇫', name: 'Burkina Faso' },
    { flag: '🇧🇮', name: 'Burundi' },
    { flag: '🇨🇲', name: 'Cameroon' },
    { flag: '🇨🇦', name: 'Canada' },
    { flag: '🇨🇻', name: 'Cape Verde' },
    { flag: '🇨🇫', name: 'Central African Republic' },
    { flag: '🇹🇩', name: 'Chad' },
    { flag: '🇨🇳', name: 'China' },
    { flag: '🇰🇲', name: 'Comoros' },
    { flag: '🇨🇬', name: 'Congo' },
    { flag: '🇨🇮', name: 'Cote d\'Ivoire' },
    { flag: '🇩🇰', name: 'Denmark' },
    { flag: '🇩🇯', name: 'Djibouti' },
    { flag: '🇪🇬', name: 'Egypt' },
    { flag: '🇬🇶', name: 'Equatorial Guinea' },
    { flag: '🇪🇷', name: 'Eritrea' },
    { flag: '🇸🇿', name: 'Eswatini' },
    { flag: '🇪🇹', name: 'Ethiopia' },
    { flag: '🇫🇷', name: 'France' },
    { flag: '🇬🇦', name: 'Gabon' },
    { flag: '🇬🇲', name: 'Gambia' },
    { flag: '🇩🇪', name: 'Germany' },
    { flag: '🇬🇭', name: 'Ghana' },
    { flag: '🇬🇳', name: 'Guinea' },
    { flag: '🇬🇼', name: 'Guinea-Bissau' },
    { flag: '🇮🇳', name: 'India' },
    { flag: '🇮🇩', name: 'Indonesia' },
    { flag: '🇮🇷', name: 'Iran' },
    { flag: '🇮🇹', name: 'Italy' },
    { flag: '🇯🇵', name: 'Japan' },
    { flag: '🇰🇪', name: 'Kenya' },
    { flag: '🇱🇸', name: 'Lesotho' },
    { flag: '🇱🇷', name: 'Liberia' },
    { flag: '🇱🇾', name: 'Libya' },
    { flag: '🇲🇬', name: 'Madagascar' },
    { flag: '🇲🇼', name: 'Malawi' },
    { flag: '🇲🇱', name: 'Mali' },
    { flag: '🇲🇷', name: 'Mauritania' },
    { flag: '🇲🇺', name: 'Mauritius' },
    { flag: '🇲🇽', name: 'Mexico' },
    { flag: '🇲🇦', name: 'Morocco' },
    { flag: '🇲🇿', name: 'Mozambique' },
    { flag: '🇳🇦', name: 'Namibia' },
    { flag: '🇳🇪', name: 'Niger' },
    { flag: '🇳🇬', name: 'Nigeria' },
    { flag: '🇵🇹', name: 'Portugal' },
    { flag: '🇨🇩', name: 'RDC' },
    { flag: '🇷🇺', name: 'Russia' },
    { flag: '🇷🇼', name: 'Rwanda' },
    { flag: '🇸🇹', name: 'Sao Tome' },
    { flag: '🇸🇳', name: 'Senegal' },
    { flag: '🇸🇨', name: 'Seychelles' },
    { flag: '🇸🇱', name: 'Sierra Leone' },
    { flag: '🇸🇴', name: 'Somalia' },
    { flag: '🇿🇦', name: 'South Africa' },
    { flag: '🇸🇸', name: 'South Sudan' },
    { flag: '🇪🇸', name: 'Spain' },
    { flag: '🇸🇩', name: 'Sudan' },
    { flag: '🇸🇪', name: 'Sweden' },
    { flag: '🇨🇭', name: 'Switzerland' },
    { flag: '🇹🇿', name: 'Tanzania' },
    { flag: '🇹🇬', name: 'Togo' },
    { flag: '🇹🇳', name: 'Tunisia' },
    { flag: '🇹🇷', name: 'Turkey' },
    { flag: '🇺🇬', name: 'Uganda' },
    { flag: '🇺🇦', name: 'Ukraine' },
    { flag: '🇬🇧', name: 'United Kingdom' },
    { flag: '🇺🇸', name: 'United States' },
    { flag: '🇿🇲', name: 'Zambia' },
    { flag: '🇿🇼', name: 'Zimbabwe' },
    { flag: '🇦🇪', name: 'United Arab Emirates' },
    { flag: '🇸🇦', name: 'Saudi Arabia' },
    { flag: '🇳🇱', name: 'Netherlands' },
    { flag: '🇨🇿', name: 'Czech Republic' },
    { flag: '🇬🇷', name: 'Greece' },
    { flag: '🇭🇺', name: 'Hungary' },
    { flag: '🇮🇪', name: 'Ireland' },
    { flag: '🇳🇴', name: 'Norway' },
    { flag: '🇵🇱', name: 'Poland' },
    { flag: '🇷🇴', name: 'Romania' },
    { flag: '🇸🇰', name: 'Slovakia' },
    { flag: '🇻🇳', name: 'Vietnam' },
    { flag: '🇹🇭', name: 'Thailand' },
    { flag: '🇲🇾', name: 'Malaysia' },
    { flag: '🇸🇬', name: 'Singapore' },
    { flag: '🇵🇭', name: 'Philippines' },
    { flag: '🇵🇰', name: 'Pakistan' },
    { flag: '🇧🇩', name: 'Bangladesh' },
    { flag: '🇱🇰', name: 'Sri Lanka' },
    { flag: '🇳🇵', name: 'Nepal' },
    { flag: '🇲🇲', name: 'Myanmar' },
    { flag: '🇰🇭', name: 'Cambodia' },
    { flag: '🇱🇦', name: 'Laos' },
    { flag: '🇲🇳', name: 'Mongolia' },
    { flag: '🇰🇿', name: 'Kazakhstan' },
    { flag: '🇺🇿', name: 'Uzbekistan' },
    { flag: '🇹🇲', name: 'Turkmenistan' },
    { flag: '🇰🇬', name: 'Kyrgyzstan' },
    { flag: '🇹🇯', name: 'Tajikistan' },
    { flag: '🇦🇿', name: 'Azerbaijan' },
    { flag: '🇬🇪', name: 'Georgia' },
    { flag: '🇦🇲', name: 'Armenia' },
    { flag: '🇱🇹', name: 'Lithuania' },
    { flag: '🇱🇻', name: 'Latvia' },
    { flag: '🇪🇪', name: 'Estonia' },
    { flag: '🇫🇮', name: 'Finland' },
    { flag: '🇮🇸', name: 'Iceland' },
    { flag: '🇲🇰', name: 'North Macedonia' },
    { flag: '🇦🇱', name: 'Albania' },
    { flag: '🇲🇪', name: 'Montenegro' },
    { flag: '🇧🇦', name: 'Bosnia and Herzegovina' },
    { flag: '🇭🇷', name: 'Croatia' },
    { flag: '🇸🇮', name: 'Slovenia' },
    { flag: '🇧🇬', name: 'Bulgaria' },
    { flag: '🇲🇩', name: 'Moldova' },
    { flag: '🇧🇾', name: 'Belarus' }
];

var countriesList = countriesWithFlags.map(function(c) { return c.name; });

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
        
        var result = await supabaseClient.storage
            .from(bucket)
            .upload(filePath, blob, {
                contentType: blob.type,
                cacheControl: '3600',
                upsert: true
            });
        
        if (result.error) throw result.error;
        
        var publicUrlData = supabaseClient.storage
            .from(bucket)
            .getPublicUrl(filePath);
        
        return publicUrlData.data.publicUrl;
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
        
        var existing = await supabaseClient
            .from('users')
            .select('pi_uid')
            .eq('pi_uid', piUid)
            .single();
        
        if (existing.data) {
            var updateResult = await supabaseClient
                .from('users')
                .update(userData)
                .eq('pi_uid', piUid);
            if (updateResult.error) throw updateResult.error;
            console.log('User updated in Supabase:', piUid);
        } else {
            userData.created_at = now;
            var insertResult = await supabaseClient
                .from('users')
                .insert(userData);
            if (insertResult.error) throw insertResult.error;
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
        var result = await supabaseClient
            .from('users')
            .select('*')
            .eq('pi_uid', piUid)
            .single();
        
        if (result.error) {
            if (result.error.code === 'PGRST116') {
                return null;
            }
            throw result.error;
        }
        return result.data;
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
            duration: eventData.duration || '1 day',
            category: eventData.category || '',
            ticket_price: eventData.price || 0,
            max_tickets: eventData.seatsTotal || 0,
            created_at: eventData.createdAt || new Date().toISOString()
        };
        
        var result = await supabaseClient
            .from('events')
            .upsert(dbEvent, { onConflict: 'id' });
        
        if (result.error) throw result.error;
        console.log('Event saved to Supabase:', eventData.id);
        return true;
    } catch (error) {
        console.error('Error saving event to Supabase:', error);
        return false;
    }
}

async function loadEventsFromSupabase() {
    try {
        var result = await supabaseClient
            .from('events')
            .select('*')
            .order('event_date', { ascending: true });
        
        if (result.error) throw result.error;
        return result.data || [];
    } catch (error) {
        console.error('Error loading events from Supabase:', error);
        return [];
    }
}

async function deleteEventFromSupabase(eventId) {
    try {
        var result = await supabaseClient
            .from('events')
            .delete()
            .eq('id', eventId);
        if (result.error) throw result.error;
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
            status: 'Valid',
            purchase_date: ticketData.purchaseDate || new Date().toISOString(),
            expiration_date: ticketData.eventDate || null
        };
        
        var result = await supabaseClient
            .from('tickets')
            .upsert(dbTicket, { onConflict: 'id' });
        
        if (result.error) throw result.error;
        console.log('Ticket saved to Supabase:', ticketData.id);
        return true;
    } catch (error) {
        console.error('Error saving ticket to Supabase:', error);
        return false;
    }
}

async function loadTicketsFromSupabase(piUid) {
    try {
        var result = await supabaseClient
            .from('tickets')
            .select('*')
            .eq('buyer_pi_uid', piUid)
            .order('purchase_date', { ascending: false });
        
        if (result.error) throw result.error;
        return result.data || [];
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
        
        var result = await supabaseClient
            .from('transactions')
            .insert(dbTransaction);
        
        if (result.error) throw result.error;
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
        
        var result = await supabaseClient
            .from('notifications')
            .insert(dbNotification);
        
        if (result.error) throw result.error;
        console.log('Notification saved to Supabase');
        return true;
    } catch (error) {
        console.error('Error saving notification to Supabase:', error);
        return false;
    }
}

async function loadNotificationsFromSupabase(piUid) {
    try {
        var result = await supabaseClient
            .from('notifications')
            .select('*')
            .eq('receiver_pi_uid', piUid)
            .order('created_at', { ascending: false });
        
        if (result.error) throw result.error;
        return result.data || [];
    } catch (error) {
        console.error('Error loading notifications from Supabase:', error);
        return [];
    }
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
var isPublishing = false;

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
    { id: '3', title: 'Blockchain Conference', category: 'Conference', country: 'France', date: '2026-07-25T14:00', location: 'Lyon', description: 'Discover the future of blockchain and Web3', conditions: 'Active Pi Network wallet\nPayment in Pi (indicated amount)\nRegistration required', price: 0.0003, seatsTotal: 200, seatsLeft: 200, images: [eventImagesList.Conference], coverImage: eventImagesList.Conference, organizer: 'Demo', organizerName: 'Demo', createdAt: new Date().toISOString(), boosts: 0 },
    { id: '4', title: 'Crypto Training', category: 'Training', country: 'France', date: '2026-08-01T09:00', location: 'Online', description: 'Learn to trade and invest in cryptocurrencies', conditions: 'Active Pi Network wallet\nPayment in Pi (indicated amount)', price: 0.0003, seatsTotal: 50, seatsLeft: 50, images: [eventImagesList.Training], coverImage: eventImagesList.Training, organizer: 'Demo', organizerName: 'Demo', createdAt: new Date().toISOString(), boosts: 0 },
    { id: '5', title: 'Movie Premiere', category: 'Cinema', country: 'France', date: '2026-08-05T19:00', location: 'Paris', description: 'Exclusive film premiere', conditions: 'Active Pi Network wallet\nPayment in Pi (indicated amount)\nPresent ticket at entrance', price: 0.0003, seatsTotal: 300, seatsLeft: 300, images: [eventImagesList.Cinema], coverImage: eventImagesList.Cinema, organizer: 'Demo', organizerName: 'Demo', createdAt: new Date().toISOString(), boosts: 0 },
    { id: '6', title: 'Music Festival', category: 'Festival', country: 'France', date: '2026-08-10T12:00', location: 'Nice', description: '3 days of festivities with over 20 artists', conditions: 'Active Pi Network wallet\nPayment in Pi (indicated amount)\nPresent ticket at entrance', price: 0.0003, seatsTotal: 1000, seatsLeft: 1000, images: [eventImagesList.Festival], coverImage: eventImagesList.Festival, organizer: 'Demo', organizerName: 'Demo', createdAt: new Date().toISOString(), boosts: 0 },
    { id: '7', title: 'Theatre Play', category: 'Theatre', country: 'France', date: '2026-07-18T19:30', location: 'Paris, Theatre National', description: 'A captivating play about love and redemption', conditions: 'Active Pi Network wallet\nPayment in Pi (indicated amount)', price: 0.0002, seatsTotal: 200, seatsLeft: 200, images: [eventImagesList.Theatre], coverImage: eventImagesList.Theatre, organizer: 'Demo', organizerName: 'Demo', createdAt: new Date().toISOString(), boosts: 0 },
    { id: '8', title: 'Dance Show', category: 'Dance', country: 'France', date: '2026-07-22T20:00', location: 'Lyon, Opera', description: 'A breathtaking contemporary dance show', conditions: 'Active Pi Network wallet\nPayment in Pi (indicated amount)', price: 0.00025, seatsTotal: 150, seatsLeft: 150, images: [eventImagesList.Dance], coverImage: eventImagesList.Dance, organizer: 'Demo', organizerName: 'Demo', createdAt: new Date().toISOString(), boosts: 0 },
    { id: '9', title: 'Modern Art Exhibition', category: 'Exhibition', country: 'France', date: '2026-07-28T10:00', location: 'Paris, Centre Pompidou', description: 'Discover works by the greatest modern artists', conditions: 'Active Pi Network wallet\nPayment in Pi (indicated amount)', price: 0.00015, seatsTotal: 100, seatsLeft: 100, images: [eventImagesList.Exhibition], coverImage: eventImagesList.Exhibition, organizer: 'Demo', organizerName: 'Demo', createdAt: new Date().toISOString(), boosts: 0 },
    { id: '10', title: 'Charity Gala', category: 'Gala', country: 'France', date: '2026-08-02T19:00', location: 'Paris, Palais des Congres', description: 'An elegant gala evening supporting charitable causes', conditions: 'Active Pi Network wallet\nPayment in Pi (indicated amount)\nFormal attire required', price: 0.0005, seatsTotal: 300, seatsLeft: 300, images: [eventImagesList.Gala], coverImage: eventImagesList.Gala, organizer: 'Demo', organizerName: 'Demo', createdAt: new Date().toISOString(), boosts: 0 },
    { id: '11', title: 'Innovation Seminar', category: 'Seminar', country: 'France', date: '2026-08-08T09:00', location: 'Paris, La Defense', description: 'Seminar on innovation and new technologies', conditions: 'Active Pi Network wallet\nPayment in Pi (indicated amount)\nRegistration required', price: 0.00035, seatsTotal: 80, seatsLeft: 80, images: [eventImagesList.Seminar], coverImage: eventImagesList.Seminar, organizer: 'Demo', organizerName: 'Demo', createdAt: new Date().toISOString(), boosts: 0 },
    { id: '12', title: 'Football Derby', category: 'Sport', country: 'RDC', date: '2026-07-19T19:00', location: 'Kinshasa, Stade des Martyrs', description: 'A massive football derby between rival teams', conditions: 'Active Pi Network wallet\nPayment in Pi (indicated amount)', price: 0.0004, seatsTotal: 2000, seatsLeft: 2000, images: [eventImagesList.Football], coverImage: eventImagesList.Football, organizer: 'Demo', organizerName: 'Demo', createdAt: new Date().toISOString(), boosts: 0 },
    { id: '13', title: 'Basketball Match', category: 'Sport', country: 'RDC', date: '2026-07-25T16:00', location: 'Kinshasa, Gymnasium', description: 'Basketball match between local teams', conditions: 'Active Pi Network wallet\nPayment in Pi (indicated amount)', price: 0.0002, seatsTotal: 500, seatsLeft: 500, images: [eventImagesList.Sport], coverImage: eventImagesList.Sport, organizer: 'Demo', organizerName: 'Demo', createdAt: new Date().toISOString(), boosts: 0 },
    { id: '14', title: 'Rumba Festival', category: 'Festival', country: 'RDC', date: '2026-08-01T14:00', location: 'Kinshasa, Place du 30 Juin', description: 'Celebrating Congolese Rumba with international artists', conditions: 'Active Pi Network wallet\nPayment in Pi (indicated amount)', price: 0.0003, seatsTotal: 3000, seatsLeft: 3000, images: [eventImagesList.Festival], coverImage: eventImagesList.Festival, organizer: 'Demo', organizerName: 'Demo', createdAt: new Date().toISOString(), boosts: 0 },
    { id: '15', title: 'Tech Africa Conference', category: 'Conference', country: 'RDC', date: '2026-08-05T09:00', location: 'Kinshasa, Cite de l\'UA', description: 'Conference on new technologies in Africa', conditions: 'Active Pi Network wallet\nPayment in Pi (indicated amount)\nRegistration required', price: 0.00025, seatsTotal: 300, seatsLeft: 300, images: [eventImagesList.Conference], coverImage: eventImagesList.Conference, organizer: 'Demo', organizerName: 'Demo', createdAt: new Date().toISOString(), boosts: 0 },
    { id: '16', title: 'African Art Exhibition', category: 'Exhibition', country: 'RDC', date: '2026-08-10T10:00', location: 'Kinshasa, Musee National', description: 'Exhibition dedicated to modern and traditional African art', conditions: 'Active Pi Network wallet\nPayment in Pi (indicated amount)', price: 0.00015, seatsTotal: 150, seatsLeft: 150, images: [eventImagesList.Exhibition], coverImage: eventImagesList.Exhibition, organizer: 'Demo', organizerName: 'Demo', createdAt: new Date().toISOString(), boosts: 0 }
];

function escapeHtml(str) { if (!str) return ''; return str.replace(/[&<>]/g, function(m) { if (m === '&') return '&amp;'; if (m === '<') return '&lt;'; if (m === '>') return '&gt;'; return m; }); }
function formatDate(dateStr) { var date = new Date(dateStr); return !isNaN(date.getTime()) ? date.toLocaleDateString('en-US') : 'Date to be defined'; }
function formatDateTime(dateStr) { var date = new Date(dateStr); return !isNaN(date.getTime()) ? date.toLocaleString('en-US') : 'Unknown date'; }

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
            message: notif.message || '',
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
                duration: e.duration || '1 day',
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
                boosts: 0
            };
        });
        localStorage.setItem('betix_events', JSON.stringify(events));
    } else {
        events = JSON.parse(JSON.stringify(demoEvents));
        localStorage.setItem('betix_events', JSON.stringify(events));
        await syncEventsToSupabase();
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
                    qrCode: t.qr_code || 'BETIX-' + Date.now()
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
        try {
            googleSelect.value = lang;
            googleSelect.dispatchEvent(new Event('change'));
            setTimeout(function() {
                var currentUrl = window.location.href.split('?')[0];
                var urlLang = new URLSearchParams(window.location.search).get('lang');
                if (urlLang !== lang) {
                    window.location.href = currentUrl + '?lang=' + lang;
                }
            }, 500);
        } catch(e) {
            console.log('Translation error:', e);
            var currentUrl = window.location.href.split('?')[0];
            window.location.href = currentUrl + '?lang=' + lang;
        }
    } else {
        var currentUrl = window.location.href.split('?')[0];
        window.location.href = currentUrl + '?lang=' + lang;
    }
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
        if (googleSelect) {
            if (googleSelect.value !== savedLang) {
                googleSelect.value = savedLang;
                googleSelect.dispatchEvent(new Event('change'));
            }
        }
    }, 1000);
    
    setTimeout(function() {
        var googleSelect = document.querySelector('.goog-te-combo');
        if (googleSelect && googleSelect.value !== savedLang) {
            googleSelect.value = savedLang;
            googleSelect.dispatchEvent(new Event('change'));
        }
    }, 2500);
    
    return savedLang;
}

// ============================================================
// ===== NOTIFICATIONS =====
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

function toggleNotifications() {
    openNotificationPanel();
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
// ===== MODERN IMAGE UPLOAD WITH COMPRESSION =====
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
// ===== PROFILE PHOTO AVEC COMPRESSION ET UPLOAD SUPABASE =====
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

function startSessionMonitor() { setInterval(function() { if (currentUser.wallet && isSessionExpired()) { disconnectPi(); alert('Session expired due to inactivity. Please reconnect.'); } }, 60000); }
function bindActivityListeners() { var events = ['click', 'scroll', 'keydown', 'touchstart']; for (var i = 0; i < events.length; i++) { document.addEventListener(events[i], updateActivity); } }

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

// ============================================================
// ===== UPDATE CONNECT BUTTONS =====
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

async function onIncompletePaymentFound(payment) { console.log("Incomplete payment found:", payment); }

// ============================================================
// ===== CONFIRMATION ACHAT - PAIEMENT PI NETWORK =====
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
                fetch(BACKEND_URL + '/api/pi/approve', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ paymentId: paymentId }) });
            },
            onReadyForServerCompletion: function(paymentId, txid) {
                fetch(BACKEND_URL + '/api/pi/complete', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ paymentId: paymentId, txid: txid, amount: totalPrice, metadata: { eventId: event.id, quantity: quantity } }) }).then(async function() {
                    var ticketsAdded = [];
                    for (var i = 0; i < quantity; i++) {
                        var ticket = {
                            id: Date.now().toString() + '-' + i,
                            eventId: event.id,
                            eventTitle: event.title,
                            eventDate: event.date,
                            eventLocation: event.location,
                            price: event.price,
                            buyerWallet: piUser ? piUser.username : currentUser.wallet,
                            buyerName: piUser ? piUser.username : currentUser.name,
                            userWallet: currentUser.wallet,
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
                    
                    for (var i = 0; i < ticketsAdded.length; i++) {
                        await saveTicketToSupabase(ticketsAdded[i]);
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
// ===== CONFIRMATION D'ACHAT DEPUIS LA POPUP =====
// ============================================================

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
// ===== TICKET QUANTITY POPUP =====
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
    
    var durationText = eventData.durationValue + ' ' + eventData.durationUnit;
    document.getElementById('confirmDuration').textContent = durationText;
    
    document.getElementById('confirmLocation').textContent = eventData.location || 'Online';
    document.getElementById('confirmPrice').textContent = eventData.price + ' Pi';
    document.getElementById('confirmSeats').textContent = eventData.seatsTotal;
    document.getElementById('confirmOrganizer').textContent = currentUser.name || currentUser.wallet;
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

async function confirmPublishEvent() {
    if (!pendingEventData) return;
    
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
    newEvent.duration = document.getElementById('eventDuration').value + ' ' + document.getElementById('eventDurationUnit').value;
    newEvent.durationValue = parseInt(document.getElementById('eventDuration').value) || 1;
    newEvent.durationUnit = document.getElementById('eventDurationUnit').value;
    
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
    
    closePublishConfirmPopup();
    renderEventsByCategory();
    updateProfilePage();
    
    var publishBtn = document.getElementById('publishEventBtn');
    var publishLoading = document.getElementById('publishLoading');
    isPublishing = false;
    publishBtn.style.display = 'block';
    publishLoading.style.display = 'none';
    publishBtn.disabled = false;
    
    alert('Event "' + newEvent.title + '" has been successfully published!');
    showPage('home');
}

// ============================================================
// ===== CREATE EVENT (avec anti-double publication) =====
// ============================================================

function createEvent(e) {
    e.preventDefault();
    
    if (isPublishing) {
        alert('Event is already being published. Please wait.');
        return;
    }
    
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
    
    var publishBtn = document.getElementById('publishEventBtn');
    var publishLoading = document.getElementById('publishLoading');
    isPublishing = true;
    publishBtn.style.display = 'none';
    publishLoading.style.display = 'block';
    
    var category = document.getElementById('eventCategory').value;
    var country = document.getElementById('eventCountry').value;
    var durationValue = parseInt(document.getElementById('eventDuration').value) || 1;
    var durationUnit = document.getElementById('eventDurationUnit').value;
    
    var newEvent = {
        id: Date.now().toString(),
        title: document.getElementById('eventTitle').value,
        category: category,
        country: country,
        date: document.getElementById('eventDate').value,
        duration: durationValue + ' ' + durationUnit,
        durationValue: durationValue,
        durationUnit: durationUnit,
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
        boosts: 0
    };
    
    if (!newEvent.title || !newEvent.date || !newEvent.location || !newEvent.seatsTotal) { 
        alert('Please fill in all required fields');
        publishBtn.style.display = 'block';
        publishLoading.style.display = 'none';
        isPublishing = false;
        return; 
    }
    
    openPublishConfirm(newEvent);
}

// ============================================================
// ===== PURCHASE SUCCESS POPUP =====
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
// ===== PROFILE =====
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
    if (profileName) profileName.innerText = currentUser.name;
    if (profileWallet) profileWallet.innerText = currentUser.wallet || 'Not connected';
    if (ticketCount) ticketCount.innerText = tickets.length;
    if (ratedCount) ratedCount.innerText = ratings.filter(function(r) { return r.userWallet === (currentUser.wallet || currentUser.name); }).length;
    if (loyaltyDisplay) loyaltyDisplay.innerText = currentUser.loyaltyPoints || 0;
    if (historyCount) historyCount.innerText = tickets.length;
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
    updateLoyaltyPointsDisplay();
}

// ============================================================
// ===== TICKETS AND HISTORY (avec affichage amélioré) =====
// ============================================================

function renderTickets() {
    var container = document.getElementById('ticketsList');
    if (!container) return;
    var active = tickets.filter(function(t) { return new Date(t.eventDate) > new Date(); });
    active.sort(function(a, b) { return new Date(b.purchaseDate) - new Date(a.purchaseDate); });
    if (!active.length) { 
        container.innerHTML = 
            '<div class="empty-state">' +
                '<i class="fas fa-ticket-alt" style="font-size:3rem;color:var(--primary);"></i>' +
                '<h3 style="margin-top:1rem;">No active tickets</h3>' +
                '<p class="empty-sub">You haven\'t purchased any tickets yet</p>' +
            '</div>';
        return; 
    }
    container.innerHTML = active.map(function(t) { 
        var dateEvent = new Date(t.eventDate);
        var dateFormatted = dateEvent.toLocaleDateString('en-US');
        var timeFormatted = dateEvent.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
        var ticketNumber = t.id || 'N/A';
        
        return '<div class="ticket-premium-betix">' +
            '<div class="ticket-header-betix">' +
                '<div class="ticket-title-betix">' + escapeHtml(t.eventTitle) + '</div>' +
                '<span class="ticket-status-betix valid">Valid</span>' +
            '</div>' +
            '<div class="ticket-body-betix">' +
                '<div class="ticket-row-betix">' +
                    '<span class="ticket-label-betix">Date</span>' +
                    '<span class="ticket-value-betix">' + dateFormatted + '</span>' +
                '</div>' +
                '<div class="ticket-row-betix">' +
                    '<span class="ticket-label-betix">Time</span>' +
                    '<span class="ticket-value-betix">' + timeFormatted + '</span>' +
                '</div>' +
                '<div class="ticket-row-betix">' +
                    '<span class="ticket-label-betix">Location</span>' +
                    '<span class="ticket-value-betix">' + escapeHtml(t.eventLocation || 'Not specified') + '</span>' +
                '</div>' +
                '<div class="ticket-row-betix">' +
                    '<span class="ticket-label-betix">Ticket</span>' +
                    '<span class="ticket-value-betix highlight">' + ticketNumber.substring(0, 12) + '...</span>' +
                '</div>' +
            '</div>' +
            '<div class="ticket-footer-betix">' +
                '<div class="ticket-qr-betix">' +
                    '<i class="fas fa-qrcode"></i>' +
                    '<span>' + (t.qrCode || 'N/A') + '</span>' +
                '</div>' +
                '<div class="ticket-buyer-betix">' +
                    '<span class="buyer-name">' + escapeHtml(t.buyerName || t.buyerWallet) + '</span>' +
                    '<span class="buyer-label">Participant</span>' +
                '</div>' +
            '</div>' +
            '<div class="ticket-number-betix">#' + ticketNumber + '</div>' +
        '</div>';
    }).join('');
}

function renderHistory() {
    var container = document.getElementById('historyList');
    if (!container) return;
    var old = tickets.filter(function(t) { return new Date(t.eventDate) <= new Date(); });
    old.sort(function(a, b) { return new Date(b.purchaseDate) - new Date(a.purchaseDate); });
    if (!old.length) { 
        container.innerHTML = 
            '<div class="empty-state">' +
                '<i class="fas fa-history" style="font-size:3rem;color:var(--primary);"></i>' +
                '<h3 style="margin-top:1rem;">No history</h3>' +
                '<p class="empty-sub">Your past tickets will appear here</p>' +
            '</div>';
        return; 
    }
    container.innerHTML = old.map(function(t) { 
        var dateEvent = new Date(t.eventDate);
        var dateFormatted = dateEvent.toLocaleDateString('en-US');
        var timeFormatted = dateEvent.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
        var ticketNumber = t.id || 'N/A';
        
        return '<div class="ticket-premium-betix" style="opacity:0.7;">' +
            '<div class="ticket-header-betix">' +
                '<div class="ticket-title-betix">' + escapeHtml(t.eventTitle) + '</div>' +
                '<span class="ticket-status-betix expired">Expired</span>' +
            '</div>' +
            '<div class="ticket-body-betix">' +
                '<div class="ticket-row-betix">' +
                    '<span class="ticket-label-betix">Date</span>' +
                    '<span class="ticket-value-betix">' + dateFormatted + '</span>' +
                '</div>' +
                '<div class="ticket-row-betix">' +
                    '<span class="ticket-label-betix">Time</span>' +
                    '<span class="ticket-value-betix">' + timeFormatted + '</span>' +
                '</div>' +
                '<div class="ticket-row-betix">' +
                    '<span class="ticket-label-betix">Location</span>' +
                    '<span class="ticket-value-betix">' + escapeHtml(t.eventLocation || 'Not specified') + '</span>' +
                '</div>' +
                '<div class="ticket-row-betix">' +
                    '<span class="ticket-label-betix">Ticket</span>' +
                    '<span class="ticket-value-betix highlight">' + ticketNumber.substring(0, 12) + '...</span>' +
                '</div>' +
            '</div>' +
            '<div class="ticket-footer-betix">' +
                '<div class="ticket-qr-betix">' +
                    '<i class="fas fa-qrcode" style="color:#ef4444;"></i>' +
                    '<span>' + (t.qrCode || 'N/A') + '</span>' +
                '</div>' +
                '<div class="ticket-buyer-betix">' +
                    '<span class="buyer-name" style="color:#ef4444;">' + escapeHtml(t.buyerName || t.buyerWallet) + '</span>' +
                    '<span class="buyer-label">Participant</span>' +
                '</div>' +
            '</div>' +
            '<div class="ticket-number-betix">#' + ticketNumber + '</div>' +
        '</div>';
    }).join('');
}

// ============================================================
// ===== MY RATINGS =====
// ============================================================

function renderMyRatings() {
    var container = document.getElementById('myRatingsList');
    if (!container) return;
    var myRatings = ratings.filter(function(r) { return r.userWallet === (currentUser.wallet || currentUser.name); });
    if (!myRatings.length) { 
        container.innerHTML = 
            '<div class="empty-state">' +
                '<i class="fas fa-star" style="font-size:3rem;color:var(--primary);"></i>' +
                '<h3 style="margin-top:1rem;">No ratings</h3>' +
                '<p class="empty-sub">You haven\'t rated any events yet</p>' +
            '</div>';
        return; 
    }
    container.innerHTML = myRatings.map(function(r) { 
        var stars = ''; 
        for (var i = 0; i < r.rating; i++) stars += '★'; 
        for (var i = r.rating; i < 5; i++) stars += '☆'; 
        return '<div class="ticket-card"><h3>' + escapeHtml(r.eventTitle) + '</h3><div>Rating: ' + r.rating + '/5 ' + stars + '</div>' + (r.comment ? '<p>"' + escapeHtml(r.comment) + '"</p>' : '') + '<small>' + new Date(r.date).toLocaleDateString() + '</small></div>'; 
    }).join('');
}

// ============================================================
// ===== MY EVENTS (version améliorée) =====
// ============================================================

function renderMyEvents() {
    var container = document.getElementById('myEventsList');
    if (!container) return;
    var myEvents = events.filter(function(e) {
        return e.organizer === currentUser.wallet || e.organizerName === currentUser.name;
    });
    if (myEvents.length === 0) {
        container.innerHTML = 
            '<div class="empty-state">' +
                '<i class="fas fa-calendar-plus" style="font-size:3rem;color:var(--primary);"></i>' +
                '<h3 style="margin-top:1rem;">No events yet</h3>' +
                '<p class="empty-sub">You haven\'t created any events. Start now!</p>' +
                '<button class="btn-primary" onclick="showPage(\'create\')" style="width:auto;padding:10px 30px;margin-top:1rem;">Create Your First Event</button>' +
            '</div>';
        return;
    }
    container.innerHTML = myEvents.map(function(e) {
        return renderMyEventCard(e);
    }).join('');
    
    updateMyEventsStats();
}

function updateMyEventsStats() {
    var myEvents = events.filter(function(e) {
        return e.organizer === currentUser.wallet || e.organizerName === currentUser.name;
    });
    document.getElementById('myEventsCount').innerText = myEvents.length;
}

function renderMyEventCard(event) {
    var dateEvent = new Date(event.date);
    var dateFormatted = dateEvent.toLocaleDateString('en-US');
    var timeFormatted = dateEvent.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    var ticketSold = tickets.filter(function(t) { return t.eventId === event.id; }).length;
    var durationText = event.duration || '1 day';
    var timeAgo = getTimeAgo(event.createdAt);
    
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
    
    return '<div class="event-card my-event-card" style="cursor:default;">' +
        galleryHtml +
        '<div class="event-info">' +
            '<div class="event-title">' + escapeHtml(event.title) + 
                '<span class="event-time-ago">' + timeAgo + '</span>' +
            '</div>' +
            '<div class="event-details-grid">' +
                '<div class="detail-item"><i class="fas fa-calendar-day"></i> ' + dateFormatted + '</div>' +
                '<div class="detail-item"><i class="fas fa-clock"></i> ' + timeFormatted + '</div>' +
                '<div class="detail-item"><i class="fas fa-hourglass-half"></i> ' + escapeHtml(durationText) + '</div>' +
                '<div class="detail-item"><i class="fas fa-map-marker-alt"></i> ' + escapeHtml(event.location || 'Online') + '</div>' +
                '<div class="detail-item"><i class="fas fa-flag"></i> ' + escapeHtml(event.country || 'Not specified') + '</div>' +
                '<div class="detail-item"><i class="fas fa-ticket-alt"></i> <span class="ticket-sold-count">' + ticketSold + '</span> sold</div>' +
                '<div class="detail-item"><i class="fas fa-users"></i> ' + event.seatsLeft + '/' + event.seatsTotal + ' seats</div>' +
            '</div>' +
            '<div class="event-footer">' +
                '<div><span class="event-price">' + event.price + ' Pi</span></div>' +
                '<div class="event-actions">' +
                    '<button class="btn-edit-event" onclick="event.stopPropagation(); openEditEvent(\'' + event.id + '\')"><i class="fas fa-edit"></i> Edit</button>' +
                '</div>' +
            '</div>' +
        '</div>' +
    '</div>';
}

// ============================================================
// ===== TEMPS ÉCOULÉ (comme X/Twitter) =====
// ============================================================

function getTimeAgo(dateString) {
    if (!dateString) return 'Just now';
    var now = new Date();
    var past = new Date(dateString);
    var diffMs = now - past;
    var diffSec = Math.floor(diffMs / 1000);
    var diffMin = Math.floor(diffSec / 60);
    var diffHour = Math.floor(diffMin / 60);
    var diffDay = Math.floor(diffHour / 24);
    
    if (diffSec < 60) return 'Just now';
    if (diffMin < 60) return diffMin + 'm';
    if (diffHour < 24) return diffHour + 'h';
    if (diffDay === 1) return 'Yesterday';
    if (diffDay < 7) return diffDay + 'd';
    
    var date = new Date(dateString);
    var month = date.toLocaleString('en-US', { month: 'short' });
    var day = date.getDate();
    var year = date.getFullYear();
    
    if (diffDay < 365) return day + ' ' + month;
    return day + ' ' + month + ' ' + year;
}

// ============================================================
// ===== MODIFIER UN ÉVÉNEMENT =====
// ============================================================

function openEditEvent(eventId) {
    var event = events.find(function(e) { return e.id === eventId; });
    if (!event) { alert('Event not found'); return; }
    if (event.organizer !== currentUser.wallet && event.organizerName !== currentUser.name) {
        alert('You are not the organizer of this event');
        return;
    }
    
    var modal = document.createElement('div');
    modal.className = 'modal show';
    modal.id = 'editEventModal';
    modal.innerHTML = 
        '<div class="modal-content" style="max-width:600px;">' +
            '<span class="modal-close" onclick="document.getElementById(\'editEventModal\').remove()"><i class="fas fa-times"></i></span>' +
            '<h2>Edit Event</h2>' +
            '<div class="form-group"><label>Description</label><textarea id="editDescription" rows="3">' + escapeHtml(event.description || '') + '</textarea></div>' +
            '<div class="form-group"><label>Location</label><input type="text" id="editLocation" value="' + escapeHtml(event.location || '') + '"></div>' +
            '<div class="form-group"><label>Conditions</label><textarea id="editConditions" rows="4">' + escapeHtml(event.conditions || '') + '</textarea></div>' +
            '<div class="form-group"><label>Seats</label><input type="number" id="editSeats" value="' + event.seatsTotal + '" min="' + (event.seatsTotal - event.seatsLeft) + '"></div>' +
            '<button class="btn-primary" onclick="saveEventEdit(\'' + event.id + '\')">Save Changes</button>' +
        '</div>';
    document.body.appendChild(modal);
}

async function saveEventEdit(eventId) {
    var event = events.find(function(e) { return e.id === eventId; });
    if (!event) { alert('Event not found'); return; }
    
    var description = document.getElementById('editDescription').value.trim();
    var location = document.getElementById('editLocation').value.trim();
    var conditions = document.getElementById('editConditions').value.trim();
    var newSeats = parseInt(document.getElementById('editSeats').value);
    
    if (!description) { alert('Description is required'); return; }
    if (!location) { alert('Location is required'); return; }
    if (!conditions) { alert('Conditions are required'); return; }
    if (!newSeats || newSeats < (event.seatsTotal - event.seatsLeft)) {
        alert('Seats cannot be less than tickets already sold (' + (event.seatsTotal - event.seatsLeft) + ')');
        return;
    }
    
    event.description = description;
    event.location = location;
    event.conditions = conditions;
    event.seatsTotal = newSeats;
    event.seatsLeft = newSeats - (event.seatsTotal - event.seatsLeft);
    
    saveEvents();
    renderMyEvents();
    renderEventsByCategory();
    
    document.getElementById('editEventModal').remove();
    alert('Event updated successfully!');
}

// ============================================================
// ===== RENDER EVENTS (version améliorée) =====
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
    var durationText = event.duration || '1 day';
    var timeAgo = getTimeAgo(event.createdAt);
    
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
                '<span class="event-time-ago" style="font-size:0.65rem;color:var(--gray);font-weight:400;display:block;margin-top:2px;">' + timeAgo + '</span>' +
            '</div>' +
            (event.description ? '<div class="event-card-desc">' + escapeHtml(event.description.substring(0, 80)) + (event.description.length > 80 ? '...' : '') + '</div>' : '') +
            '<div class="event-card-details">' +
                '<div class="detail-item"><i class="fas fa-map-marker-alt"></i> ' + escapeHtml(event.location || 'Online') + '</div>' +
                '<div class="detail-item"><i class="fas fa-clock"></i> ' + timeFormatted + '</div>' +
                '<div class="detail-item"><i class="fas fa-calendar-day"></i> ' + dateFormatted + '</div>' +
                '<div class="detail-item"><i class="fas fa-hourglass-half"></i> ' + escapeHtml(durationText) + '</div>' +
                '<div class="detail-item"><i class="fas fa-tag"></i> ' + event.price + ' Pi</div>' +
                '<div class="detail-item"><i class="fas fa-users"></i> ' + event.seatsLeft + '/' + event.seatsTotal + ' seats</div>' +
            '</div>' +
            '<div class="event-card-stats">' +
                '<span class="event-card-rating"><i class="fas fa-star"></i> ' + ratingHtml + '</span>' +
            '</div>' +
            '<div class="event-card-footer">' +
                '<div class="organizer-by">By <span>@' + escapeHtml(organizerDisplay) + '</span></div>' +
                '<button class="buy-btn" onclick="event.stopPropagation(); openQuantityPopup(\'' + event.id + '\')">Buy Ticket</button>' +
            '</div>' +
        '</div>' +
    '</div>';
}

// ============================================================
// ===== EVENT DETAILS (avec ordre des informations) =====
// ============================================================

function openEventDetails(eventId) {
    var event = events.find(function(e) { return e.id === eventId; });
    if (!event) {
        alert('Event not found');
        return;
    }
    var modal = document.getElementById('eventDetailModal');
    var closeBtn = document.getElementById('eventDetailClose');
    var dateEvent = new Date(event.date);
    var dateFormatted = dateEvent.toLocaleDateString('en-US');
    var timeFormatted = dateEvent.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    var durationText = event.duration || '1 day';
    
    document.getElementById('detailTitle').textContent = event.title;
    document.getElementById('detailTitle').style.fontSize = '1.6rem';
    document.getElementById('detailTitle').style.fontWeight = '700';
    
    var organizerText = event.organizerName || event.organizer || 'Unknown';
    var organizerLine = document.getElementById('detailOrganizerLine');
    if (organizerLine) {
        organizerLine.innerHTML = 'By <span style="color:#f5a623;font-weight:600;">@' + escapeHtml(organizerText) + '</span>';
    }
    
    document.getElementById('detailDescription').textContent = event.description || 'No description';
    document.getElementById('detailDescription').style.fontSize = '1rem';
    document.getElementById('detailDescription').style.lineHeight = '1.6';
    document.getElementById('detailDescription').style.color = '#4b5563';
    
    document.getElementById('detailCategory').textContent = event.category;
    document.getElementById('detailCountry').textContent = event.country || 'Not specified';
    document.getElementById('detailLocation').textContent = event.location || 'Online';
    document.getElementById('detailDate').textContent = dateFormatted + ' at ' + timeFormatted;
    
    var durationEl = document.getElementById('detailDuration');
    if (durationEl) {
        durationEl.textContent = durationText;
    }
    
    document.getElementById('detailPrice').textContent = event.price + ' Pi';
    document.getElementById('detailSeats').textContent = event.seatsLeft + '/' + event.seatsTotal + ' seats';
    
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
// ===== INIT COUNTRY SELECTORS =====
// ============================================================

function initCountrySelectors() {
    var filterSelect = document.getElementById('countrySelect');
    if (filterSelect) {
        filterSelect.innerHTML = '';
        for (var i = 0; i < countriesWithFlags.length; i++) {
            var country = countriesWithFlags[i];
            var option = document.createElement('option');
            option.value = country.name;
            option.textContent = country.flag + ' ' + country.name;
            if (country.name === currentCountryFilter) {
                option.selected = true;
            }
            filterSelect.appendChild(option);
        }
    }
    var eventSelect = document.getElementById('eventCountry');
    if (eventSelect) {
        eventSelect.innerHTML = '';
        for (var i = 0; i < countriesWithFlags.length; i++) {
            var country = countriesWithFlags[i];
            if (country.name === 'All') continue;
            var option = document.createElement('option');
            option.value = country.name;
            option.textContent = country.flag + ' ' + country.name;
            if (country.name === 'France') {
                option.selected = true;
            }
            eventSelect.appendChild(option);
        }
    }
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
    
    setTimeout(function() {
        checkPiBrowser();
    }, 1200);
    
    detectLanguage();
    
    if (!events.length) { events = JSON.parse(JSON.stringify(demoEvents)); saveEvents(); }
    
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
});

console.log('Betix loaded successfully!');
console.log('Supabase connected (Storage only mode)');
console.log('Admin: 5 clicks on logo + password Betix@2026#');