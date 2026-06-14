let events = JSON.parse(localStorage.getItem('betix_events')) || [];
let tickets = JSON.parse(localStorage.getItem('betix_tickets')) || [];
let currentUser = JSON.parse(localStorage.getItem('betix_user')) || { name: 'Invite', wallet: null, memberSince: '2026', loyaltyPoints: 0 };
let currentFilter = 'Tous';
let searchQuery = '';
let piUser = null;
let ratings = JSON.parse(localStorage.getItem('betix_ratings')) || [];
let chatMessages = JSON.parse(localStorage.getItem('betix_chat_messages')) || [];
let connectedUsers = JSON.parse(localStorage.getItem('betix_connected_users')) || [];
let adminCode = 'BETIX2026';
let selectedRating = 0;
let lastActivity = localStorage.getItem('betix_last_activity') || Date.now();

const BACKEND_URL = "https://betix-backend.onrender.com";

const eventImagesList = {
    Concert: 'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?w=600&h=400&fit=crop',
    Sport: 'https://images.unsplash.com/photo-1461896836934-ffe807baa261?w=600&h=400&fit=crop',
    Conference: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=600&h=400&fit=crop',
    Formation: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=600&h=400&fit=crop',
    Cinema: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=600&h=400&fit=crop',
    Festival: 'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=600&h=400&fit=crop'
};

const demoEvents = [
    { id: '1', title: 'Concert de Jazz', category: 'Concert', date: '2026-07-15T20:00', location: 'Paris, Olympia', description: 'Soiree jazz exceptionnelle avec les meilleurs artistes internationaux. Venez profiter d\'une ambiance unique.', price: 0.0003, seatsTotal: 100, seatsLeft: 100, images: [eventImagesList.Concert, eventImagesList.Concert], coverImage: eventImagesList.Concert, organizer: 'Demo', createdAt: new Date().toISOString(), boosts: 0 },
    { id: '2', title: 'Match de Football', category: 'Sport', date: '2026-07-20T18:00', location: 'Marseille', description: 'Match amical entre equipes locales. Ambiance garantie', price: 0.0003, seatsTotal: 500, seatsLeft: 500, images: [eventImagesList.Sport, eventImagesList.Sport], coverImage: eventImagesList.Sport, organizer: 'Demo', createdAt: new Date().toISOString(), boosts: 0 },
    { id: '3', title: 'Conference Blockchain', category: 'Conference', date: '2026-07-25T14:00', location: 'Lyon', description: 'Decouvrez l\'avenir de la blockchain et du Web3 avec des experts du secteur.', price: 0.0003, seatsTotal: 200, seatsLeft: 200, images: [eventImagesList.Conference, eventImagesList.Conference], coverImage: eventImagesList.Conference, organizer: 'Demo', createdAt: new Date().toISOString(), boosts: 0 },
    { id: '4', title: 'Formation Crypto', category: 'Formation', date: '2026-08-01T09:00', location: 'En ligne', description: 'Apprenez a trader et a investir dans les cryptomonnaies en toute securite.', price: 0.0003, seatsTotal: 50, seatsLeft: 50, images: [eventImagesList.Formation, eventImagesList.Formation], coverImage: eventImagesList.Formation, organizer: 'Demo', createdAt: new Date().toISOString(), boosts: 0 },
    { id: '5', title: 'Avant-premiere', category: 'Cinema', date: '2026-08-05T19:00', location: 'Paris', description: 'Film exclusif en avant-premiere suivi d\'un debat avec le realisateur.', price: 0.0003, seatsTotal: 300, seatsLeft: 300, images: [eventImagesList.Cinema, eventImagesList.Cinema], coverImage: eventImagesList.Cinema, organizer: 'Demo', createdAt: new Date().toISOString(), boosts: 0 },
    { id: '6', title: 'Festival de Musique', category: 'Festival', date: '2026-08-10T12:00', location: 'Nice', description: '3 jours de festivites avec plus de 20 artistes sur scene.', price: 0.0003, seatsTotal: 1000, seatsLeft: 1000, images: [eventImagesList.Festival, eventImagesList.Festival], coverImage: eventImagesList.Festival, organizer: 'Demo', createdAt: new Date().toISOString(), boosts: 0 }
];

function escapeHtml(str) { if (!str) return ''; return str.replace(/[&<>]/g, function(m) { if (m === '&') return '&amp;'; if (m === '<') return '&lt;'; if (m === '>') return '&gt;'; return m; }); }
function formatDate(dateStr) { const date = new Date(dateStr); return !isNaN(date.getTime()) ? date.toLocaleDateString('fr-FR') : 'Date a definir'; }
function formatDateTime(dateStr) { const date = new Date(dateStr); return !isNaN(date.getTime()) ? date.toLocaleString('fr-FR') : 'Date inconnue'; }
function saveEvents() { localStorage.setItem('betix_events', JSON.stringify(events)); }
function saveTickets() { localStorage.setItem('betix_tickets', JSON.stringify(tickets)); }
function saveUser() { localStorage.setItem('betix_user', JSON.stringify(currentUser)); }

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
    if (pointsSpan) {
        pointsSpan.innerText = currentUser.loyaltyPoints || 0;
    }
}

function updateActivity() { lastActivity = Date.now(); localStorage.setItem('betix_last_activity', lastActivity); }
function isSessionExpired() { const last = parseInt(localStorage.getItem('betix_last_activity') || 0); const now = Date.now(); return (now - last) > 86400000; }
function logout() { if (confirm('Etes-vous sur de vouloir vous deconnecter ?')) { currentUser = { name: 'Invite', wallet: null, memberSince: '2026', loyaltyPoints: 0 }; piUser = null; saveUser(); localStorage.removeItem('betix_last_activity'); localStorage.removeItem('betix_pending_payment'); updateUserInfo(); updateProfilePage(); renderEventsByCategory(); renderTickets(); renderHistory(); alert('Vous etes deconnecte'); closeSidebar(); } }
function startSessionMonitor() { setInterval(function() { if (currentUser.wallet && isSessionExpired()) { logout(); alert('Session expiree pour inactivite. Veuillez vous reconnecter.'); } }, 60000); }
function bindActivityListeners() { var events = ['click', 'scroll', 'keydown', 'touchstart']; for (var i = 0; i < events.length; i++) { document.addEventListener(events[i], updateActivity); } }

function showPage(pageName) {
    updateActivity();
    var pages = ['homePage', 'createPage', 'ticketsPage', 'historyPage', 'profilePage', 'whitepaperPage', 'faqPage', 'socialPage', 'settingsPage', 'ratingsPage', 'adminPage'];
    for (var i = 0; i < pages.length; i++) { var el = document.getElementById(pages[i]); if (el) { el.style.display = 'none'; el.classList.add('hidden-page'); } }
    if (pageName === 'home') { document.getElementById('homePage').style.display = 'block'; renderEventsByCategory(); }
    else { var target = document.getElementById(pageName + 'Page'); if (target) { target.style.display = 'block'; target.classList.remove('hidden-page'); } }
    if (pageName === 'tickets') renderTickets();
    if (pageName === 'history') renderHistory();
    if (pageName === 'profile') updateProfilePage();
    if (pageName === 'ratings') renderMyRatings();
    if (pageName === 'admin') loadAdminPage();
    closeSidebar();
    window.scrollTo(0, 0);
}

function closeSidebar() { var s = document.getElementById('sidebar'); if (s) s.classList.remove('open'); var o = document.getElementById('overlay'); if (o) o.classList.remove('active'); }
function openSidebar() { var s = document.getElementById('sidebar'); if (s) s.classList.add('open'); var o = document.getElementById('overlay'); if (o) o.classList.add('active'); }

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
        modal.innerHTML = '<span class="gallery-close">&times;</span><img id="galleryCurrentImage" src=""><div class="gallery-nav"><button id="galleryPrev">Precedent</button><button id="galleryNext">Suivant</button></div>';
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

function renderEventCard(event) {
    var hasRated = ratings.some(function(r) { return r.eventId === event.id && r.userWallet === (currentUser.wallet || currentUser.name); });
    var userRating = ratings.find(function(r) { return r.eventId === event.id && r.userWallet === (currentUser.wallet || currentUser.name); });
    var avgRating = 0;
    var eventRatings = ratings.filter(function(r) { return r.eventId === event.id; });
    if (eventRatings.length > 0) { avgRating = eventRatings.reduce(function(a, r) { return a + r.rating; }, 0) / eventRatings.length; }
    var hasTicket = tickets.some(function(t) { return t.eventId === event.id && t.buyerWallet === (currentUser.wallet || currentUser.name); });
    
    var galleryHtml = '';
    if (event.images && event.images.length > 0) {
        galleryHtml = '<div class="event-gallery">';
        for (var i = 0; i < Math.min(event.images.length, 4); i++) {
            galleryHtml += '<img src="' + event.images[i] + '" class="event-gallery-img" onclick="openGallery(\'' + event.id + '\', ' + i + ')">';
        }
        if (event.images.length > 4) { galleryHtml += '<div class="event-gallery-img" style="background:#e5e7eb;display:flex;align-items:center;justify-content:center;font-size:0.8rem;">+' + (event.images.length - 4) + '</div>'; }
        galleryHtml += '</div>';
    } else {
        galleryHtml = '<img src="' + eventImagesList[event.category] + '" class="event-gallery-img" style="width:100%;height:160px;" onclick="openGallery(\'' + event.id + '\', 0)">';
    }
    
    var dateEvent = new Date(event.date);
    var dateFormatted = dateEvent.toLocaleDateString('fr-FR');
    var timeFormatted = dateEvent.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
    
    var ratingStars = '';
    var fullStars = Math.floor(avgRating);
    for (var i = 0; i < fullStars; i++) ratingStars += '★';
    for (var i = fullStars; i < 5; i++) ratingStars += '☆';
    
    var ratingHtml = avgRating > 0 ? '<span class="event-rating">' + ratingStars + ' ' + avgRating.toFixed(1) + ' (' + eventRatings.length + ')</span>' : '<span class="event-rating">Nouveau</span>';
    
    var descriptionShort = event.description ? event.description.substring(0, 100) + (event.description.length > 100 ? '...' : '') : '';
    
    var ratingButtonHtml = '';
    if (!hasRated && hasTicket) {
        ratingButtonHtml = '<button class="rating-btn" onclick="openRatingModal(\'' + event.id + '\', \'' + escapeHtml(event.title) + '\')">⭐ Noter cet événement</button>';
    } else if (hasRated) {
        ratingButtonHtml = '<div class="rated-badge">✓ Vous avez noté ' + (userRating ? userRating.rating : '') + '/5</div>';
    }
    
    return '<div class="event-card">' +
        galleryHtml +
        '<div class="event-info">' +
            '<div class="event-title">' + escapeHtml(event.title) + '</div>' +
            '<div class="event-meta">' +
                '<div class="event-meta-item">📅 ' + dateFormatted + ' à ' + timeFormatted + '</div>' +
                '<div class="event-meta-item">📍 ' + escapeHtml(event.location || 'En ligne') + '</div>' +
            '</div>' +
            (descriptionShort ? '<div class="event-description">' + escapeHtml(descriptionShort) + '</div>' : '') +
            '<div class="event-stats">' +
                ratingHtml +
                '<span class="boost-count">⭐ ' + (event.boosts || 0) + ' boosts</span>' +
            '</div>' +
            '<div class="event-footer">' +
                '<div class="event-price">' + event.price + ' Pi</div>' +
                '<div class="event-seats">🎟️ ' + event.seatsLeft + '/' + event.seatsTotal + ' places</div>' +
                '<button class="buy-btn" onclick="buyTicket(\'' + event.id + '\')">Acheter</button>' +
                ratingButtonHtml +
            '</div>' +
        '</div>' +
    '</div>';
}

function renderEventsByCategory() {
    var container = document.getElementById('eventsByCategory');
    if (!container) return;
    var filtered = events.filter(function(e) { return (currentFilter === 'Tous' || e.category === currentFilter) && (e.title.toLowerCase().includes(searchQuery) || (e.location && e.location.toLowerCase().includes(searchQuery))); });
    if (filtered.length === 0) { container.innerHTML = '<p style="text-align:center;padding:2rem;">Aucun evenement</p>'; return; }
    if (currentFilter !== 'Tous') { container.innerHTML = '<div class="category-section"><div class="events-grid">' + filtered.map(function(e) { return renderEventCard(e); }).join('') + '</div></div>'; return; }
    var cats = ['Concert', 'Sport', 'Conference', 'Formation', 'Cinema', 'Festival'];
    var html = '';
    for (var i = 0; i < cats.length; i++) {
        var cat = cats[i];
        var catEvents = filtered.filter(function(e) { return e.category === cat; });
        if (catEvents.length) html += '<div class="category-section"><div class="category-header">' + cat + '</div><div class="events-grid">' + catEvents.map(function(e) { return renderEventCard(e); }).join('') + '</div></div>';
    }
    container.innerHTML = html;
}

function initFilters() {
    var cats = ['Tous', 'Concert', 'Sport', 'Conference', 'Formation', 'Cinema', 'Festival'];
    var container = document.getElementById('filtersContainer');
    if (!container) return;
    container.innerHTML = cats.map(function(c) { return '<div class="filter-chip ' + (c === currentFilter ? 'active' : '') + '" data-category="' + c + '">' + c + '</div>'; }).join('');
    var chips = document.querySelectorAll('.filter-chip');
    for (var i = 0; i < chips.length; i++) { chips[i].addEventListener('click', function() { currentFilter = this.dataset.category; initFilters(); renderEventsByCategory(); }); }
}

async function connectToPi() {
    if (typeof Pi === 'undefined') { alert("Veuillez ouvrir cette page dans Pi Browser"); return; }
    try {
        var scopes = ['username', 'payments'];
        var auth = await Pi.authenticate(scopes, onIncompletePaymentFound);
        if (auth && auth.user) {
            piUser = auth.user;
            currentUser.wallet = piUser.username;
            currentUser.name = piUser.username;
            if (!currentUser.loyaltyPoints) currentUser.loyaltyPoints = 0;
            saveUser();
            updateActivity();
            updateUserInfo();
            updateProfilePage();
            trackUserConnection();
            renderEventsByCategory();
            alert('Wallet Pi connecte ! Bienvenue ' + piUser.username);
            closeSidebar();
        }
    } catch (error) { console.error("Erreur connexion Pi:", error); alert("Erreur de connexion: " + (error.message || "Veuillez reessayer")); }
}

async function onIncompletePaymentFound(payment) { console.log("Paiement incomplet trouve:", payment); }

async function buyTicket(eventId) {
    updateActivity();
    if (typeof Pi === 'undefined') { alert("Veuillez ouvrir dans Pi Browser pour payer"); return; }
    if (!piUser && !currentUser.wallet) { alert("Veuillez d'abord connecter votre wallet Pi"); await connectToPi(); return; }
    var event = events.find(function(e) { return e.id === eventId; });
    if (!event || event.seatsLeft <= 0) { alert("Plus de places disponibles"); return; }
    if (!confirm('Acheter "' + event.title + '" pour ' + event.price + ' Pi ?')) return;
    try {
        var payment = await Pi.createPayment({
            amount: Number(event.price),
            memo: 'Ticket: ' + event.title,
            metadata: { eventId: event.id, eventTitle: event.title }
        }, {
            onReadyForServerApproval: function(paymentId) {
                fetch(BACKEND_URL + '/api/pi/approve', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ paymentId: paymentId }) });
            },
            onReadyForServerCompletion: function(paymentId, txid) {
                fetch(BACKEND_URL + '/api/pi/complete', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ paymentId: paymentId, txid: txid, amount: event.price, metadata: { eventId: event.id } }) }).then(function() {
                    var ticketExiste = tickets.some(function(t) { return t.transactionId === txid; });
                    if (!ticketExiste) {
                        event.seatsLeft--;
                        saveEvents();
                        tickets.push({
                            id: Date.now().toString(), eventId: event.id, eventTitle: event.title, eventDate: event.date, eventLocation: event.location,
                            price: event.price, buyerWallet: piUser ? piUser.username : currentUser.wallet, buyerName: piUser ? piUser.username : currentUser.name,
                            purchaseDate: new Date().toISOString(), purchaseDateTime: new Date().toLocaleString('fr-FR'), transactionId: txid,
                            qrCode: 'BETIX-' + Date.now() + '-' + txid.substring(0, 8)
                        });
                        saveTickets();
                    }
                    renderEventsByCategory(); renderTickets(); renderHistory(); updateProfilePage();
                    alert('Achat reussi ! Ticket pour "' + event.title + '" ajoute.');
                });
            },
            onCancel: function() { alert("Paiement annule"); },
            onError: function(error) { alert("Erreur de paiement: " + error.message); }
        });
    } catch (error) { alert("Erreur: " + error.message); }
}

async function boostEvent(eventId) {
    if (typeof Pi === 'undefined') { alert("Veuillez ouvrir dans Pi Browser"); return; }
    if (!piUser && !currentUser.wallet) { alert("Veuillez d'abord connecter votre wallet Pi"); await connectToPi(); return; }
    var event = events.find(function(e) { return e.id === eventId; });
    if (!event) return;
    if (!confirm('Booster "' + event.title + '" pour 0.001 Pi ? Cela aide le createur a gagner en visibilite.')) return;
    try {
        var payment = await Pi.createPayment({
            amount: 0.001,
            memo: 'Boost: ' + event.title,
            metadata: { eventId: event.id, type: 'boost' }
        }, {
            onReadyForServerApproval: function(paymentId) {
                fetch(BACKEND_URL + '/api/pi/approve', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ paymentId: paymentId }) });
            },
            onReadyForServerCompletion: function(paymentId, txid) {
                fetch(BACKEND_URL + '/api/pi/complete', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ paymentId: paymentId, txid: txid }) }).then(function() {
                    event.boosts = (event.boosts || 0) + 1;
                    saveEvents();
                    renderEventsByCategory();
                    alert('Merci ! L\'evenement a maintenant ' + event.boosts + ' boost(s)');
                });
            },
            onCancel: function() { alert('Boost annule'); },
            onError: function(error) { alert('Erreur: ' + error.message); }
        });
    } catch(error) { alert('Erreur: ' + error.message); }
}

function connectWallet() { connectToPi(); }

function updateUserInfo() {
    var sidebarName = document.getElementById('sidebarName');
    var sidebarWallet = document.getElementById('sidebarWallet');
    var sidebarAvatar = document.getElementById('sidebarAvatar');
    if (sidebarName) sidebarName.innerText = currentUser.name;
    if (sidebarWallet) sidebarWallet.innerText = currentUser.wallet ? currentUser.wallet.substring(0, 15) + '...' : 'Non connecte';
    if (sidebarAvatar) sidebarAvatar.innerText = currentUser.name.substring(0, 2).toUpperCase();
}

function updateProfilePage() {
    var profileName = document.getElementById('profileName');
    var profileWallet = document.getElementById('profileWallet');
    var ticketCount = document.getElementById('ticketCount');
    var ratedCount = document.getElementById('ratedCount');
    if (profileName) profileName.innerText = currentUser.name;
    if (profileWallet) profileWallet.innerText = currentUser.wallet || 'Non connecte';
    if (ticketCount) ticketCount.innerText = tickets.length;
    if (ratedCount) ratedCount.innerText = ratings.filter(function(r) { return r.userWallet === (currentUser.wallet || currentUser.name); }).length;
    updateLoyaltyPointsDisplay();
}

function renderTickets() {
    var container = document.getElementById('ticketsList');
    if (!container) return;
    var active = tickets.filter(function(t) { return new Date(t.eventDate) > new Date(); });
    active.sort(function(a, b) { return new Date(b.purchaseDate) - new Date(a.purchaseDate); });
    if (!active.length) { container.innerHTML = '<p style="text-align:center;padding:2rem;">Aucun ticket actif</p>'; return; }
    container.innerHTML = active.map(function(t) { return '<div class="ticket-card"><h3>' + escapeHtml(t.eventTitle) + '</h3><p><strong>Acheteur :</strong> ' + escapeHtml(t.buyerName || t.buyerWallet) + '</p><p><strong>Prix :</strong> ' + t.price + ' Pi</p><p><strong>Date :</strong> ' + formatDate(t.eventDate) + '</p><p><strong>Lieu :</strong> ' + escapeHtml(t.eventLocation || 'Non specifie') + '</p><p><strong>Achete le :</strong> ' + formatDateTime(t.purchaseDate) + '</p><p><strong>Code :</strong> <code>' + t.qrCode + '</code></p></div>'; }).join('');
}

function renderHistory() {
    var container = document.getElementById('historyList');
    if (!container) return;
    var old = tickets.filter(function(t) { return new Date(t.eventDate) <= new Date(); });
    old.sort(function(a, b) { return new Date(b.purchaseDate) - new Date(a.purchaseDate); });
    if (!old.length) { container.innerHTML = '<p style="text-align:center;padding:2rem;">Aucun historique</p>'; return; }
    container.innerHTML = old.map(function(t) { return '<div class="ticket-card" style="opacity:0.8;"><h3>' + escapeHtml(t.eventTitle) + '</h3><p><strong>Acheteur :</strong> ' + escapeHtml(t.buyerName || t.buyerWallet) + '</p><p><strong>Prix :</strong> ' + t.price + ' Pi</p><p><strong>Date :</strong> ' + formatDate(t.eventDate) + '</p><p><strong>Achete le :</strong> ' + formatDateTime(t.purchaseDate) + '</p><p style="color:#ef4444;">Evenement passe</p></div>'; }).join('');
}

function createEvent(e) {
    e.preventDefault();
    if (!currentUser.wallet) { alert('Connectez votre wallet d\'abord'); return; }
    var imageInputs = document.querySelectorAll('.eventImageUrl');
    var images = [];
    for (var i = 0; i < imageInputs.length; i++) { var url = imageInputs[i].value.trim(); if (url) images.push(url); }
    if (images.length < 2) { alert('Veuillez ajouter au moins 2 photos pour votre evenement'); return; }
    var category = document.getElementById('eventCategory').value;
    var newEvent = {
        id: Date.now().toString(), title: document.getElementById('eventTitle').value, category: category,
        date: document.getElementById('eventDate').value, location: document.getElementById('eventLocation').value,
        description: document.getElementById('eventDescription').value, price: parseFloat(document.getElementById('eventPrice').value) || 0.0003,
        seatsTotal: parseInt(document.getElementById('eventSeats').value), seatsLeft: parseInt(document.getElementById('eventSeats').value),
        images: images, coverImage: images[0], organizer: currentUser.wallet, createdAt: new Date().toISOString(), boosts: 0
    };
    if (!newEvent.title || !newEvent.date || !newEvent.location || !newEvent.seatsTotal) { alert('Champs requis'); return; }
    events.push(newEvent); saveEvents();
    document.getElementById('eventForm').reset();
    var container = document.getElementById('imageUrlsContainer');
    container.innerHTML = '<input type="url" class="eventImageUrl" placeholder="URL de l\'image 1" required><input type="url" class="eventImageUrl" placeholder="URL de l\'image 2" required>';
    alert('Evenement cree avec ' + images.length + ' photos !');
    showPage('home');
}

function openRatingModal(eventId, eventTitle) {
    selectedRating = 0;
    var modal = document.getElementById('ratingModal');
    document.getElementById('ratingEventInfo').innerHTML = '<p><strong>' + escapeHtml(eventTitle) + '</strong></p>';
    document.getElementById('ratingComment').value = '';
    var stars = document.querySelectorAll('#ratingModal .star');
    for (var i = 0; i < stars.length; i++) {
        stars[i].classList.remove('active');
        stars[i].onclick = function() { selectedRating = parseInt(this.dataset.rating); for (var j = 0; j < stars.length; j++) { if (parseInt(stars[j].dataset.rating) <= selectedRating) stars[j].classList.add('active'); else stars[j].classList.remove('active'); } };
    }
    document.getElementById('submitRatingBtn').onclick = function() {
        if (selectedRating === 0) { alert('Choisissez une note'); return; }
        ratings.push({ id: Date.now(), eventId: eventId, eventTitle: eventTitle, rating: selectedRating, comment: document.getElementById('ratingComment').value || '', userWallet: currentUser.wallet || currentUser.name, userName: currentUser.name, date: new Date().toISOString() });
        localStorage.setItem('betix_ratings', JSON.stringify(ratings));
        currentUser.loyaltyPoints = (currentUser.loyaltyPoints || 0) + selectedRating;
        saveUser();
        updateLoyaltyPointsDisplay();
        alert('Note ' + selectedRating + '/5 enregistree ! Vous gagnez ' + selectedRating + ' points de fidelite.');
        modal.classList.remove('show');
        renderEventsByCategory(); renderMyRatings(); updateProfilePage();
    };
    modal.classList.add('show');
    document.getElementById('ratingModalClose').onclick = function() { modal.classList.remove('show'); };
}

function renderMyRatings() {
    var container = document.getElementById('myRatingsList');
    if (!container) return;
    var myRatings = ratings.filter(function(r) { return r.userWallet === (currentUser.wallet || currentUser.name); });
    if (!myRatings.length) { container.innerHTML = '<p style="text-align:center;padding:2rem;">Aucune evaluation</p>'; return; }
    container.innerHTML = myRatings.map(function(r) { var stars = ''; for (var i = 0; i < r.rating; i++) stars += '★'; for (var i = r.rating; i < 5; i++) stars += '☆'; return '<div class="ticket-card"><h3>' + escapeHtml(r.eventTitle) + '</h3><div>Note: ' + r.rating + '/5 ' + stars + '</div>' + (r.comment ? '<p>"' + escapeHtml(r.comment) + '"</p>' : '') + '<small>' + new Date(r.date).toLocaleDateString() + '</small></div>'; }).join('');
}

function initAdmin() {
    var adminItem = document.getElementById('adminMenuItem');
    if (!adminItem) return;
    var logo = document.querySelector('.logo');
    var clicks = 0;
    if (logo) logo.addEventListener('click', function() { clicks++; if (clicks === 5) { var pwd = prompt('Code admin:'); if (pwd === adminCode) { localStorage.setItem('betix_admin_password', pwd); adminItem.style.display = 'block'; alert('Admin active'); } clicks = 0; } setTimeout(function() { clicks = 0; }, 2000); });
    if (localStorage.getItem('betix_admin_password') === adminCode) adminItem.style.display = 'block';
}

function loadAdminPage() {
    if (localStorage.getItem('betix_admin_password') !== adminCode) { alert('Acces refuse'); showPage('home'); return; }
    document.getElementById('adminUserCount').innerText = connectedUsers.length || 1;
    document.getElementById('adminTicketCount').innerText = tickets.length;
    document.getElementById('adminEventCount').innerText = events.length;
    var usersHtml = '<table border="1" cellpadding="5"><tr><th>Utilisateur</th><th>Wallet</th><th>Tickets</th></tr>';
    usersHtml += '<tr><td>' + escapeHtml(currentUser.name) + '</td><td>' + (currentUser.wallet || 'Non connecte') + 'NonNullable?' + tickets.length + 'NonNullable?' + '</tr>';
    for (var i = 0; i < connectedUsers.length; i++) { var u = connectedUsers[i]; usersHtml += '<tr><td>' + escapeHtml(u.name) + 'NonNullable?' + (u.wallet || 'Non connecte') + 'NonNullable?' + (u.ticketCount || 0) + 'NonNullable?' + '</tr>'; }
    usersHtml += '</table';
    document.getElementById('adminUsersList').innerHTML = usersHtml;
    document.getElementById('adminEventsList').innerHTML = events.map(function(e) { return '<div class="admin-event-item"><div><strong>' + escapeHtml(e.title) + '</strong><br><small>' + e.category + ' | ' + e.seatsLeft + '/' + e.seatsTotal + '</small></div><button class="admin-delete-btn" onclick="adminDeleteEvent(\'' + e.id + '\')">Supprimer</button></div>'; }).join('');
}
function adminDeleteEvent(id) { if (confirm('Supprimer ?')) { events = events.filter(function(e) { return e.id !== id; }); saveEvents(); loadAdminPage(); renderEventsByCategory(); alert('Supprime'); } }

function initChat() {
    var widget = document.getElementById('chatWidget'), btn = document.getElementById('chatFloatBtn'), close = document.getElementById('chatCloseBtn'), send = document.getElementById('chatSendBtn'), input = document.getElementById('chatInput'), msgs = document.getElementById('chatMessages');
    if (!widget) return;
    function load() { if (!msgs) return; msgs.innerHTML = ''; if (!chatMessages.length) add({ text: "Bonjour ! Comment pouvons-nous vous aider ?", sender: 'Support', isUser: false, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }); else for (var i = 0; i < chatMessages.length; i++) add(chatMessages[i]); }
    function add(m) { if (!msgs) return; var d = document.createElement('div'); d.className = 'chat-message ' + (m.isUser ? 'user' : 'support'); d.innerHTML = '<div class="message-bubble">' + escapeHtml(m.text) + '</div><span class="message-time">' + m.time + '</span>'; msgs.appendChild(d); msgs.scrollTop = msgs.scrollHeight; }
    if (btn) btn.addEventListener('click', function() { widget.classList.toggle('open'); });
    if (close) close.addEventListener('click', function() { widget.classList.remove('open'); });
    function sendMsg() { var msg = input.value.trim(); if (!msg) return; var newMsg = { id: Date.now(), text: msg, sender: currentUser.wallet || currentUser.name, isUser: true, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }; add(newMsg); chatMessages.push(newMsg); localStorage.setItem('betix_chat_messages', JSON.stringify(chatMessages)); input.value = ''; setTimeout(function() { var resp = "Merci ! Reponse rapide par email: betixservices@gmail.com"; if (msg.toLowerCase().includes('ticket')) resp = "Vos tickets dans l'onglet 'Mes tickets'."; else if (msg.toLowerCase().includes('paiement')) resp = "Paiements securises via Pi Network."; var auto = { id: Date.now() + 1, text: resp, sender: 'Support Betix', isUser: false, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }; add(auto); chatMessages.push(auto); localStorage.setItem('betix_chat_messages', JSON.stringify(chatMessages)); }, 1000); }
    if (send) send.addEventListener('click', sendMsg);
    if (input) input.addEventListener('keypress', function(e) { if (e.key === 'Enter') sendMsg(); });
    load();
}

function initLegalModals() {
    var modal = document.getElementById('legalModal'), content = document.getElementById('modalContent'), close = document.querySelector('#legalModal .modal-close');
    var privacy = '<div class="legal-content"><h1>Confidentialite</h1><p>Betix collecte les donnees necessaires.</p><p>betixservices@gmail.com</p></div>';
    var terms = '<div class="legal-content"><h1>Conditions</h1><p>Paiements irreversibles.</p><p>betixservices@gmail.com</p></div>';
    var legal = '<div class="legal-content"><h1>Mentions</h1><p>Betix - Plateforme decentralisee</p><p>betixservices@gmail.com</p></div>';
    var cookies = '<div class="legal-content"><h1>Cookies</h1><p>Cookies pour ameliorer l\'experience.</p></div>';
    function show(c) { content.innerHTML = c; modal.classList.add('show'); }
    if (close) close.onclick = function() { modal.classList.remove('show'); };
    window.onclick = function(e) { if (e.target === modal) modal.classList.remove('show'); };
    var privacyLink = document.getElementById('privacyLink');
    var termsLink = document.getElementById('termsLink');
    var legalNoticeLink = document.getElementById('legalNoticeLink');
    var cookiesLink = document.getElementById('cookiesLink');
    if (privacyLink) privacyLink.addEventListener('click', function(e) { e.preventDefault(); show(privacy); });
    if (termsLink) termsLink.addEventListener('click', function(e) { e.preventDefault(); show(terms); });
    if (legalNoticeLink) legalNoticeLink.addEventListener('click', function(e) { e.preventDefault(); show(legal); });
    if (cookiesLink) cookiesLink.addEventListener('click', function(e) { e.preventDefault(); show(cookies); });
}

function subscribeNewsletter() {
    var email = document.getElementById('newsletterEmail') ? document.getElementById('newsletterEmail').value : null;
    if (email && email.includes('@')) { var subs = JSON.parse(localStorage.getItem('betix_newsletter')) || []; if (subs.indexOf(email) === -1) { subs.push(email); localStorage.setItem('betix_newsletter', JSON.stringify(subs)); alert('Inscrit !'); if (document.getElementById('newsletterEmail')) document.getElementById('newsletterEmail').value = ''; } else alert('Deja inscrit'); }
    else alert('Email valide requis');
}

function trackUserConnection() {
    if (currentUser.wallet) {
        var existing = null;
        for (var i = 0; i < connectedUsers.length; i++) { if (connectedUsers[i].wallet === currentUser.wallet) { existing = connectedUsers[i]; break; } }
        if (!existing) connectedUsers.push({ name: currentUser.name, wallet: currentUser.wallet, ticketCount: tickets.length, lastSeen: new Date().toLocaleString() });
        else { existing.lastSeen = new Date().toLocaleString(); existing.ticketCount = tickets.length; }
        localStorage.setItem('betix_connected_users', JSON.stringify(connectedUsers));
    }
}

function clearAllData() { if (confirm('Supprimer toutes vos donnees ?')) { localStorage.clear(); location.reload(); } }
function toggleDarkMode(e) { if (e.target.checked) { document.body.classList.add('dark-mode'); localStorage.setItem('darkMode', 'true'); } else { document.body.classList.remove('dark-mode'); localStorage.setItem('darkMode', 'false'); } }
function showWhitepaperLang(lang) { var fr = document.getElementById('whitepaper-fr'), en = document.getElementById('whitepaper-en'); if (lang === 'fr') { fr.style.display = 'block'; en.style.display = 'none'; } else { fr.style.display = 'none'; en.style.display = 'block'; } }

function googleTranslateElementInit() {
    new google.translate.TranslateElement({
        pageLanguage: 'fr',
        includedLanguages: 'fr,en,es,de,it,pt,ar,zh-CN,zh-TW,ja,ko,ru,nl,pl,tr,vi,th,el,hi,he,sv,da,no,fi,cs,hu,ro',
        layout: google.translate.TranslateElement.InlineLayout.HORIZONTAL,
        autoDisplay: false,
        multilanguagePage: true
    }, 'google_translate_element');
    setTimeout(function() {
        var select = document.querySelector('.goog-te-combo');
        if (select) { select.style.width = '100%'; select.style.maxWidth = '320px'; select.style.padding = '10px'; select.style.fontSize = '14px'; select.style.background = 'var(--gradient)'; select.style.color = 'white'; select.style.border = 'none'; select.style.borderRadius = '8px'; }
        var iframes = document.querySelectorAll('iframe');
        for (var i = 0; i < iframes.length; i++) { var iframe = iframes[i]; if (iframe.className === 'goog-te-banner-frame' || iframe.id === 'google_translate_frame') { iframe.style.display = 'none'; iframe.style.visibility = 'hidden'; iframe.style.height = '0px'; iframe.style.width = '0px'; } }
        document.body.style.top = '0px'; document.body.style.position = 'relative';
    }, 500);
}

document.addEventListener('DOMContentLoaded', function() {
    if (typeof Pi !== 'undefined') { Pi.init({ version: "2.0", sandbox: true }); }
    if (!events.length) { events = JSON.parse(JSON.stringify(demoEvents)); saveEvents(); }
    calculateLoyaltyPoints();
    initFilters(); renderEventsByCategory(); updateUserInfo(); updateProfilePage(); initAdmin(); initChat(); initLegalModals();
    var dark = document.getElementById('darkModeToggle');
    if (localStorage.getItem('darkMode') === 'true') { if (dark) dark.checked = true; document.body.classList.add('dark-mode'); }
    if (dark) dark.addEventListener('change', toggleDarkMode);
    var menuBtn = document.getElementById('menuBtn'); var closeSidebarBtn = document.getElementById('closeSidebarBtn'); var overlay = document.getElementById('overlay');
    var sidebarWalletBtn = document.getElementById('sidebarWalletBtn'); var profileConnectBtn = document.getElementById('profileConnectBtn');
    var eventForm = document.getElementById('eventForm'); var searchInput = document.getElementById('searchInput'); var clearDataBtn = document.getElementById('clearDataBtn');
    var logoutBtn = document.getElementById('logoutBtn');
    if (menuBtn) menuBtn.addEventListener('click', openSidebar);
    if (closeSidebarBtn) closeSidebarBtn.addEventListener('click', closeSidebar);
    if (overlay) overlay.addEventListener('click', closeSidebar);
    if (sidebarWalletBtn) sidebarWalletBtn.addEventListener('click', connectToPi);
    if (profileConnectBtn) profileConnectBtn.addEventListener('click', connectToPi);
    if (eventForm) eventForm.addEventListener('submit', createEvent);
    if (searchInput) searchInput.addEventListener('input', function(e) { searchQuery = e.target.value.toLowerCase(); renderEventsByCategory(); });
    if (clearDataBtn) clearDataBtn.addEventListener('click', clearAllData);
    if (logoutBtn) logoutBtn.addEventListener('click', logout);
    var addImageBtn = document.getElementById('addImageBtn');
    if (addImageBtn) { addImageBtn.addEventListener('click', function() { var container = document.getElementById('imageUrlsContainer'); var newInput = document.createElement('input'); newInput.type = 'url'; newInput.className = 'eventImageUrl'; newInput.placeholder = 'URL de l\'image'; container.appendChild(newInput); }); }
    var sidebarItems = document.querySelectorAll('.sidebar-item');
    for (var i = 0; i < sidebarItems.length; i++) { sidebarItems[i].addEventListener('click', function() { showPage(this.dataset.page); closeSidebar(); }); }
    bindActivityListeners(); startSessionMonitor();
    if (currentUser.wallet && isSessionExpired()) { logout(); }
    var loader = document.getElementById('loader'), main = document.getElementById('main-content');
    if (loader && main) { setTimeout(function() { loader.style.opacity = '0'; setTimeout(function() { loader.style.display = 'none'; main.style.display = 'block'; }, 500); }, 800); }
});