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
    }
});

console.log("Supabase initialized");

async function testSupabaseConnection() {
    try {
        const { error } = await supabaseClient
            .from('profiles')
            .select('count', { count: 'exact', head: true });
        if (error) {
            console.error('Supabase error:', error);
            return false;
        }
        console.log('Supabase OK');
        return true;
    } catch (e) {
        console.error('Error:', e);
        return false;
    }
}

var countriesList = [
    'All', 'France', 'RDC', 'Canada', 'USA', 'UK', 'Germany',
    'Italy', 'Spain', 'Portugal', 'Belgium', 'Switzerland',
    'Morocco', 'Algeria', 'Tunisia', 'Senegal', 'Ivory Coast',
    'Cameroon', 'Nigeria', 'Ghana', 'Kenya', 'South Africa'
];

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
var notifications = [];
var uploadedImages = {};
var pendingEventData = null;
var pageHistory = ['home'];

var BACKEND_URL = "https://betix-backend.onrender.com";

var heroSlides = [
    {
        image: 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=1200&h=600&fit=crop',
        badge: 'Music Festival',
        title: 'Summer Music Festival 2026'
    },
    {
        image: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=1200&h=600&fit=crop',
        badge: 'Football',
        title: 'Champions League Final'
    },
    {
        image: 'https://images.unsplash.com/photo-1505373877841-8d25f7d46678?w=1200&h=600&fit=crop',
        badge: 'Conference',
        title: 'Web3 Summit 2026'
    }
];

function escapeHtml(str) { if (!str) return ''; return str.replace(/[&<>]/g, function(m) { if (m === '&') return '&amp;'; if (m === '<') return '&lt;'; if (m === '>') return '&gt;'; return m; }); }

function formatDate(dateStr) { var date = new Date(dateStr); return !isNaN(date.getTime()) ? date.toLocaleDateString('en-US') : 'Date to be defined'; }

function formatDateTime(dateStr) { var date = new Date(dateStr); return !isNaN(date.getTime()) ? date.toLocaleString('en-US') : 'Unknown date'; }

// ============================================================
// ===== SAUVEGARDE SIMPLIFIEE =====
// ============================================================

async function saveUserToSupabase() {
    if (!currentUser.wallet) return false;
    try {
        var data = {
            pi_uid: currentUser.wallet,
            username: currentUser.name || 'Guest',
            photo_url: currentUser.profilePhoto || null,
            wallet: currentUser.wallet,
            name: currentUser.name || 'Guest'
        };
        var { error } = await supabaseClient
            .from('profiles')
            .upsert(data, { onConflict: 'pi_uid' });
        if (error) {
            console.error('Save error:', error);
            return false;
        }
        console.log('User saved');
        return true;
    } catch (e) { console.error('Error:', e); return false; }
}

async function loadEventsFromSupabase() {
    try {
        var { data, error } = await supabaseClient
            .from('events')
            .select('*')
            .order('date', { ascending: true });
        if (error) { console.error("Error loading events:", error); return false; }
        if (data && data.length > 0) {
            events = data;
            console.log('Events loaded:', events.length);
            return true;
        }
        return false;
    } catch (error) { console.error('Error:', error); return false; }
}

async function loadTicketsFromSupabase() {
    try {
        var { data, error } = await supabaseClient
            .from('tickets')
            .select('*')
            .order('purchase_date', { ascending: false });
        if (error) { console.error("Error loading tickets:", error); return false; }
        if (data && data.length > 0) {
            tickets = data;
            renderTickets();
            renderHistory();
            console.log('Tickets loaded:', tickets.length);
            return true;
        }
        return false;
    } catch (error) { console.error('Error:', error); return false; }
}

async function syncAllToSupabase() {
    console.log('Syncing...');
    if (events.length > 0) {
        var { error } = await supabaseClient
            .from('events')
            .upsert(events, { onConflict: 'id' });
        if (error) console.error('Sync events error:', error);
    }
    if (tickets.length > 0) {
        var { error } = await supabaseClient
            .from('tickets')
            .upsert(tickets, { onConflict: 'id' });
        if (error) console.error('Sync tickets error:', error);
    }
    await saveUserToSupabase();
}

// ============================================================
// ===== COMPRESSION =====
// ============================================================

function compressImage(file) {
    return new Promise((resolve, reject) => {
        if (!file || !file.type.startsWith('image/')) {
            reject(new Error('Not an image'));
            return;
        }
        var reader = new FileReader();
        reader.onload = function(event) {
            var img = new Image();
            img.onload = function() {
                var canvas = document.createElement('canvas');
                var max = 800;
                var width = img.width;
                var height = img.height;
                if (width > max || height > max) {
                    var ratio = Math.min(max / width, max / height);
                    width = Math.round(width * ratio);
                    height = Math.round(height * ratio);
                }
                canvas.width = width;
                canvas.height = height;
                var ctx = canvas.getContext('2d');
                ctx.drawImage(img, 0, 0, width, height);
                resolve(canvas.toDataURL('image/webp', 0.7));
            };
            img.src = event.target.result;
        };
        reader.readAsDataURL(file);
    });
}

// ============================================================
// ===== RENDER FUNCTIONS =====
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
        container.innerHTML = '<p style="text-align:center;padding:2rem;color:#6b7280;">No events found</p>';
        return;
    }
    
    var html = '<div class="events-grid-centered">';
    filtered.forEach(function(e) {
        html += renderEventCard(e);
    });
    html += '</div>';
    container.innerHTML = html;
}

function renderEventCard(event) {
    var dateEvent = new Date(event.date);
    var dateFormatted = dateEvent.toLocaleDateString('en-US');
    var timeFormatted = dateEvent.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    var fallbackImage = 'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?w=600&h=400&fit=crop';
    
    return '<div class="event-card" onclick="openEventDetails(\'' + event.id + '\')" style="cursor:pointer;">' +
        '<div class="event-card-banner">' +
            '<img src="' + (event.coverImage || fallbackImage) + '" alt="' + escapeHtml(event.title) + '" onerror="this.src=\'' + fallbackImage + '\'">' +
            '<span class="event-card-badge">' + escapeHtml(event.category || 'Event') + '</span>' +
        '</div>' +
        '<div class="event-card-body">' +
            '<div class="event-card-title">' + escapeHtml(event.title) +
                '<span class="organizer-name"> by ' + escapeHtml(event.organizerName || event.organizer || 'Anonymous') + '</span>' +
            '</div>' +
            '<div class="event-card-details">' +
                '<div class="detail-item"><i class="fas fa-calendar-day"></i> ' + dateFormatted + '</div>' +
                '<div class="detail-item"><i class="fas fa-clock"></i> ' + timeFormatted + '</div>' +
                '<div class="detail-item"><i class="fas fa-map-marker-alt"></i> ' + escapeHtml(event.location || 'Online') + '</div>' +
                '<div class="detail-item"><i class="fas fa-flag"></i> ' + escapeHtml(event.country || 'Not specified') + '</div>' +
            '</div>' +
            '<div class="event-card-footer">' +
                '<div><span class="event-card-price">' + event.price + ' Pi</span> <span class="event-card-seats">' + event.seatsLeft + '/' + event.seatsTotal + ' seats</span></div>' +
                '<button class="buy-btn" onclick="event.stopPropagation(); openQuantityPopup(\'' + event.id + '\')">Buy Ticket</button>' +
            '</div>' +
        '</div>' +
    '</div>';
}

function renderTickets() {
    var container = document.getElementById('ticketsList');
    if (!container) return;
    var active = tickets.filter(function(t) { return new Date(t.event_date || t.eventDate) > new Date(); });
    if (!active.length) { container.innerHTML = '<p style="text-align:center;padding:2rem;">No active tickets</p>'; return; }
    container.innerHTML = active.map(function(t) {
        return '<div class="ticket-card"><h3>' + escapeHtml(t.event_title || t.eventTitle) + '</h3><p><strong>Price:</strong> ' + t.price + ' Pi</p><p><strong>Date:</strong> ' + formatDate(t.event_date || t.eventDate) + '</p><p><strong>Code:</strong> <code>' + (t.qr_code || t.qrCode || 'N/A') + '</code></p></div>';
    }).join('');
}

function renderHistory() {
    var container = document.getElementById('historyList');
    if (!container) return;
    var old = tickets.filter(function(t) { return new Date(t.event_date || t.eventDate) <= new Date(); });
    if (!old.length) { container.innerHTML = '<p style="text-align:center;padding:2rem;">No history</p>'; return; }
    container.innerHTML = old.map(function(t) {
        return '<div class="ticket-card" style="opacity:0.8;"><h3>' + escapeHtml(t.event_title || t.eventTitle) + '</h3><p><strong>Price:</strong> ' + t.price + ' Pi</p><p><strong>Date:</strong> ' + formatDate(t.event_date || t.eventDate) + '</p><p style="color:#ef4444;">Past event</p></div>';
    }).join('');
}

// ============================================================
// ===== PROFILE FUNCTIONS =====
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
    var historyCount = document.getElementById('historyCount');
    if (profileName) profileName.innerText = currentUser.name;
    if (profileWallet) profileWallet.innerText = currentUser.wallet || 'Not connected';
    if (ticketCount) ticketCount.innerText = tickets.length;
    if (historyCount) historyCount.innerText = tickets.length;
    
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
            sidebarText.innerText = currentUser.name.substring(0, 2).toUpperCase();
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
// ===== NAVIGATION =====
// ============================================================

function showPage(pageName) {
    var pages = ['homePage', 'createPage', 'ticketsPage', 'historyPage', 'profilePage', 'settingsPage', 'faqPage', 'myeventsPage', 'notificationsPage'];
    for (var i = 0; i < pages.length; i++) {
        var el = document.getElementById(pages[i]);
        if (el) {
            el.style.display = 'none';
            el.classList.add('hidden-page');
        }
    }
    if (pageName === 'home') {
        document.getElementById('homePage').style.display = 'block';
        renderEventsByCategory();
    } else {
        var target = document.getElementById(pageName + 'Page');
        if (target) {
            target.style.display = 'block';
            target.classList.remove('hidden-page');
        }
    }
    if (pageName === 'tickets') renderTickets();
    if (pageName === 'history') renderHistory();
    if (pageName === 'profile') updateProfilePage();
    closeSidebar();
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

// ============================================================
// ===== CONNEXION PI =====
// ============================================================

async function connectToPi() {
    if (typeof Pi === 'undefined') {
        if (confirm("Pi Browser not detected. Use demo mode?")) {
            currentUser.wallet = 'demo_user';
            currentUser.name = 'Demo User';
            currentUser.profilePhoto = null;
            saveUserToSupabase();
            updateUserInfo();
            updateProfilePage();
            updateAllProfileImages();
            renderEventsByCategory();
            updateConnectButtons();
            alert('Demo mode activated!');
            closeSidebar();
            return;
        }
        alert("Please open this page in Pi Browser");
        return;
    }
    try {
        var scopes = ['username', 'payments'];
        var auth = await Pi.authenticate(scopes);
        if (auth && auth.user) {
            piUser = auth.user;
            currentUser.wallet = piUser.username;
            currentUser.name = piUser.username;
            saveUserToSupabase();
            updateUserInfo();
            updateProfilePage();
            updateAllProfileImages();
            renderEventsByCategory();
            updateConnectButtons();
            alert('Pi connected! Welcome ' + piUser.username);
            closeSidebar();
        }
    } catch (error) {
        console.error("Pi connection error:", error);
        alert("Connection error: " + (error.message || "Please try again"));
    }
}

function disconnectPi() {
    if (confirm('Disconnect your Pi account?')) {
        currentUser = { name: 'Guest', wallet: null, memberSince: '2026', loyaltyPoints: 0, profilePhoto: null };
        piUser = null;
        saveUserToSupabase();
        updateUserInfo();
        updateProfilePage();
        renderEventsByCategory();
        updateAllProfileImages();
        updateConnectButtons();
        closeSidebar();
        alert('Disconnected');
    }
}

// ============================================================
// ===== OPEN QUANTITY POPUP =====
// ============================================================

var selectedEventForPurchase = null;

function openQuantityPopup(eventId) {
    var event = events.find(function(e) { return e.id === eventId; });
    if (!event) { alert('Event not found'); return; }
    if (!piUser && !currentUser.wallet) {
        alert('Please connect your Pi account first');
        connectToPi();
        return;
    }
    if (event.seatsLeft <= 0) { alert('No seats available'); return; }
    selectedEventForPurchase = event;
    document.getElementById('quantityEventTitle').textContent = event.title;
    document.getElementById('ticketQuantity').value = 1;
    document.getElementById('totalPriceDisplay').textContent = event.price + ' Pi';
    document.getElementById('quantityPopup').classList.add('show');
}

function closeQuantityPopup() {
    document.getElementById('quantityPopup').classList.remove('show');
    selectedEventForPurchase = null;
}

function updateQuantity(delta) {
    var input = document.getElementById('ticketQuantity');
    var current = parseInt(input.value) || 1;
    var newVal = current + delta;
    if (newVal < 1) newVal = 1;
    if (newVal > 10) newVal = 10;
    input.value = newVal;
    if (selectedEventForPurchase) {
        var total = newVal * selectedEventForPurchase.price;
        document.getElementById('totalPriceDisplay').textContent = total.toFixed(6) + ' Pi';
    }
}

async function confirmPurchase() {
    if (!selectedEventForPurchase) return;
    var input = document.getElementById('ticketQuantity');
    var quantity = parseInt(input.value) || 1;
    var event = selectedEventForPurchase;
    var totalPrice = quantity * event.price;
    
    if (!confirm('Buy ' + quantity + ' ticket(s) for "' + event.title + '" (Total: ' + totalPrice.toFixed(6) + ' Pi) ?')) { return; }
    closeQuantityPopup();
    
    try {
        // Simuler un paiement
        var ticketsAdded = [];
        for (var i = 0; i < quantity; i++) {
            var ticket = {
                id: Date.now().toString() + '-' + i,
                eventId: event.id,
                eventTitle: event.title,
                eventDate: event.date,
                eventLocation: event.location,
                price: event.price,
                buyerWallet: currentUser.wallet,
                buyerName: currentUser.name,
                purchaseDate: new Date().toISOString(),
                qrCode: 'BETIX-' + Date.now() + '-' + i
            };
            tickets.push(ticket);
            ticketsAdded.push(ticket);
        }
        event.seatsLeft -= quantity;
        
        // Sauvegarde dans Supabase
        var { error } = await supabaseClient
            .from('tickets')
            .insert(ticketsAdded);
        if (error) {
            console.error('Error saving tickets:', error);
        } else {
            console.log('Tickets saved to Supabase');
        }
        
        // Mettre à jour l'événement
        var { error: updateError } = await supabaseClient
            .from('events')
            .update({ seats_left: event.seatsLeft })
            .eq('id', event.id);
        if (updateError) console.error('Error updating event:', updateError);
        
        renderEventsByCategory();
        renderTickets();
        renderHistory();
        updateProfilePage();
        alert('Purchase successful! ' + quantity + ' ticket(s) added.');
        
    } catch (error) {
        alert('Error: ' + error.message);
    }
}

// ============================================================
// ===== CREATE EVENT =====
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
    events.push(newEvent);
    
    var { error } = await supabaseClient
        .from('events')
        .insert(newEvent);
    if (error) {
        console.error('Error saving event:', error);
        alert('Error saving event: ' + error.message);
    } else {
        console.log('Event saved to Supabase');
        alert('Event published successfully!');
    }
    
    closePublishConfirmPopup();
    renderEventsByCategory();
    updateProfilePage();
    document.getElementById('eventForm').reset();
    uploadedImages = {};
    pendingEventData = null;
    showPage('home');
}

function createEvent(e) {
    e.preventDefault();
    if (!currentUser.wallet) {
        alert('Connect your Pi account first');
        return;
    }
    
    var images = [];
    for (var key in uploadedImages) {
        if (uploadedImages.hasOwnProperty(key)) {
            images.push(uploadedImages[key]);
        }
    }
    if (images.length < 2) {
        alert('Please add 2 photos for your event');
        return;
    }
    
    var newEvent = {
        id: Date.now().toString(),
        title: document.getElementById('eventTitle').value,
        category: document.getElementById('eventCategory').value,
        country: document.getElementById('eventCountry').value,
        date: document.getElementById('eventDate').value,
        location: document.getElementById('eventLocation').value,
        description: document.getElementById('eventDescription').value,
        conditions: document.getElementById('eventConditions').value,
        price: parseFloat(document.getElementById('eventPrice').value) || 0.0003,
        seatsTotal: parseInt(document.getElementById('eventSeats').value),
        seatsLeft: parseInt(document.getElementById('eventSeats').value),
        images: images,
        coverImage: images[0],
        organizer: currentUser.wallet,
        organizerName: currentUser.name,
        createdAt: new Date().toISOString(),
        boosts: 0
    };
    
    if (!newEvent.title || !newEvent.date || !newEvent.location || !newEvent.seatsTotal) {
        alert('Please fill in all required fields');
        return;
    }
    
    openPublishConfirm(newEvent);
}

// ============================================================
// ===== IMAGE UPLOAD =====
// ============================================================

async function handleImageUploadModern(file, index) {
    if (!file) return;
    if (!file.type.startsWith('image/')) {
        alert('Please select an image');
        return;
    }
    try {
        var compressedData = await compressImage(file);
        var previewContainer = document.getElementById('previewContainer' + index);
        var previewImage = document.getElementById('previewImage' + index);
        var box = document.getElementById('uploadBox' + (index + 1));
        previewImage.src = compressedData;
        previewContainer.style.display = 'block';
        box.classList.add('has-image');
        uploadedImages[index] = compressedData;
        console.log('Image ' + (index + 1) + ' uploaded');
    } catch (error) {
        alert('Error compressing image: ' + error.message);
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
// ===== EVENT DETAILS =====
// ============================================================

function openEventDetails(eventId) {
    var event = events.find(function(e) { return e.id === eventId; });
    if (!event) { alert('Event not found'); return; }
    
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
    
    var gallery = document.getElementById('detailGallery');
    gallery.innerHTML = '';
    if (event.images && event.images.length > 0) {
        var img = document.createElement('img');
        img.src = event.images[0];
        img.style.width = '100%';
        img.style.height = '100%';
        img.style.objectFit = 'cover';
        gallery.appendChild(img);
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
// ===== LANGUAGE & THEME =====
// ============================================================

function detectLanguage() {
    var savedLang = localStorage.getItem('betix_language') || 'en';
    var nativeSelect = document.getElementById('nativeLangSelect');
    if (nativeSelect) nativeSelect.value = savedLang;
    return savedLang;
}

function changeLanguage(lang) {
    localStorage.setItem('betix_language', lang);
    location.reload();
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

function initFilters() {
    var cats = ['All', 'Concert', 'Sport', 'Conference', 'Training', 'Cinema', 'Festival', 'Theatre', 'Dance', 'Exhibition', 'Gala', 'Seminar'];
    var container = document.getElementById('filtersContainer');
    if (!container) return;
    container.innerHTML = cats.map(function(c) {
        return '<div class="filter-chip ' + (c === currentFilter ? 'active' : '') + '" data-category="' + c + '">' + c + '</div>';
    }).join('');
    var chips = document.querySelectorAll('.filter-chip');
    for (var i = 0; i < chips.length; i++) {
        chips[i].addEventListener('click', function() {
            currentFilter = this.dataset.category;
            initFilters();
            renderEventsByCategory();
        });
    }
}

function initCountrySelectors() {
    var filterSelect = document.getElementById('countrySelect');
    if (filterSelect) {
        filterSelect.innerHTML = '';
        for (var i = 0; i < countriesList.length; i++) {
            var option = document.createElement('option');
            option.value = countriesList[i];
            option.textContent = countriesList[i];
            if (countriesList[i] === currentCountryFilter) option.selected = true;
            filterSelect.appendChild(option);
        }
    }
    var eventSelect = document.getElementById('eventCountry');
    if (eventSelect) {
        eventSelect.innerHTML = '';
        for (var i = 0; i < countriesList.length; i++) {
            if (countriesList[i] === 'All') continue;
            var option = document.createElement('option');
            option.value = countriesList[i];
            option.textContent = countriesList[i];
            if (countriesList[i] === 'France') option.selected = true;
            eventSelect.appendChild(option);
        }
    }
}

function filterByCountry(country) {
    currentCountryFilter = country;
    renderEventsByCategory();
}

function initHeroSlider() {
    var slidesContainer = document.getElementById('heroSlides');
    if (!slidesContainer) return;
    slidesContainer.innerHTML = '';
    heroSlides.forEach(function(slide, index) {
        var div = document.createElement('div');
        div.className = 'hero-slide' + (index === 0 ? ' active' : '');
        div.innerHTML = '<div class="hero-slide-bg" style="background-image: url(\'' + slide.image + '\');"></div><div class="hero-slide-content"><div class="hero-badge">' + (slide.badge || 'Event') + '</div><h2>' + slide.title + '</h2></div>';
        slidesContainer.appendChild(div);
    });
    
    var dotsContainer = document.getElementById('heroDots');
    if (dotsContainer) {
        dotsContainer.innerHTML = '';
        heroSlides.forEach(function(slide, i) {
            var dot = document.createElement('button');
            dot.className = 'dot' + (i === 0 ? ' active' : '');
            dot.setAttribute('data-index', i);
            dot.onclick = function() {
                var index = parseInt(this.getAttribute('data-index'));
                var slides = document.querySelectorAll('.hero-slide');
                var dots = document.querySelectorAll('.hero-dots .dot');
                var container = document.getElementById('heroSlides');
                container.style.transform = 'translateX(-' + (index * 100) + '%)';
                slides.forEach(function(s, i) { s.classList.remove('active'); if (i === index) s.classList.add('active'); });
                dots.forEach(function(d, i) { d.classList.remove('active'); if (i === index) d.classList.add('active'); });
            };
            dotsContainer.appendChild(dot);
        });
    }
    
    var prevBtn = document.getElementById('heroPrev');
    var nextBtn = document.getElementById('heroNext');
    if (prevBtn) {
        prevBtn.onclick = function() {
            var current = document.querySelector('.hero-slide.active');
            var slides = document.querySelectorAll('.hero-slide');
            var index = 0;
            for (var i = 0; i < slides.length; i++) {
                if (slides[i].classList.contains('active')) { index = i; break; }
            }
            var newIndex = (index - 1 + slides.length) % slides.length;
            var dots = document.querySelectorAll('.hero-dots .dot');
            var container = document.getElementById('heroSlides');
            container.style.transform = 'translateX(-' + (newIndex * 100) + '%)';
            slides.forEach(function(s, i) { s.classList.remove('active'); if (i === newIndex) s.classList.add('active'); });
            dots.forEach(function(d, i) { d.classList.remove('active'); if (i === newIndex) d.classList.add('active'); });
        };
    }
    if (nextBtn) {
        nextBtn.onclick = function() {
            var current = document.querySelector('.hero-slide.active');
            var slides = document.querySelectorAll('.hero-slide');
            var index = 0;
            for (var i = 0; i < slides.length; i++) {
                if (slides[i].classList.contains('active')) { index = i; break; }
            }
            var newIndex = (index + 1) % slides.length;
            var dots = document.querySelectorAll('.hero-dots .dot');
            var container = document.getElementById('heroSlides');
            container.style.transform = 'translateX(-' + (newIndex * 100) + '%)';
            slides.forEach(function(s, i) { s.classList.remove('active'); if (i === newIndex) s.classList.add('active'); });
            dots.forEach(function(d, i) { d.classList.remove('active'); if (i === newIndex) d.classList.add('active'); });
        };
    }
}

// ============================================================
// ===== NOTIFICATIONS =====
// ============================================================

function updateNotifBadgeHeader() {
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
    updateNotifBadgeHeader();
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
    initCountrySelectors();
    initFilters();
    renderEventsByCategory();
    updateUserInfo();
    updateProfilePage();
    updateAllProfileImages();
    updateNotifBadgeHeader();
    initHeroSlider();
    
    var dark = document.getElementById('darkModeToggle');
    if (localStorage.getItem('darkMode') === 'true') {
        if (dark) dark.checked = true;
        document.body.classList.add('dark-mode');
    }
    if (dark) dark.addEventListener('change', toggleDarkMode);
    
    var menuBtn = document.getElementById('menuBtn');
    var closeSidebarBtn = document.getElementById('closeSidebarBtn');
    var overlay = document.getElementById('overlay');
    var eventForm = document.getElementById('eventForm');
    var searchInput = document.getElementById('searchInput');
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
    
    var confirmPublishBtn = document.getElementById('confirmPublishBtn');
    if (confirmPublishBtn) {
        confirmPublishBtn.addEventListener('click', function(e) {
            e.preventDefault();
            confirmPublishEvent();
        });
    }
    
    if (menuBtn) menuBtn.addEventListener('click', openSidebar);
    if (closeSidebarBtn) closeSidebarBtn.addEventListener('click', closeSidebar);
    if (overlay) overlay.addEventListener('click', closeSidebar);
    if (eventForm) eventForm.addEventListener('submit', createEvent);
    if (searchInput) {
        searchInput.addEventListener('input', function(e) {
            searchQuery = e.target.value.toLowerCase();
            renderEventsByCategory();
        });
    }
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
    }
    
    var sidebarItems = document.querySelectorAll('.sidebar-item');
    for (var i = 0; i < sidebarItems.length; i++) {
        sidebarItems[i].addEventListener('click', function() {
            var page = this.dataset.page;
            if (page) showPage(page);
            closeSidebar();
        });
    }
    
    var confirmBuyBtn = document.getElementById('confirmBuyBtn');
    if (confirmBuyBtn) {
        confirmBuyBtn.addEventListener('click', confirmPurchase);
    }
    
    // Charger les données depuis Supabase
    (async function initApp() {
        console.log('Initializing Betix...');
        var connected = await testSupabaseConnection();
        if (!connected) {
            console.warn('Supabase not accessible, using localStorage');
        }
        await loadEventsFromSupabase();
        await loadTicketsFromSupabase();
        renderEventsByCategory();
        renderTickets();
        renderHistory();
        updateProfilePage();
        updateAllProfileImages();
        updateUserInfo();
        console.log('Betix initialized');
    })();
    
    setInterval(function() {
        syncAllToSupabase();
    }, 30000);
});

console.log('Betix loaded successfully!');
console.log('Admin: 5 clicks on logo + password Betix@2026#');