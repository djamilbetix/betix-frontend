let events = JSON.parse(localStorage.getItem('betix_events')) || [];
let tickets = JSON.parse(localStorage.getItem('betix_tickets')) || [];
let currentUser = JSON.parse(localStorage.getItem('betix_user')) || { name: 'Invité', wallet: null, memberSince: '2026' };
let currentFilter = 'Tous';
let searchQuery = '';
let piUser = null;
let ratings = JSON.parse(localStorage.getItem('betix_ratings')) || [];
let chatMessages = JSON.parse(localStorage.getItem('betix_chat_messages')) || [];
let connectedUsers = JSON.parse(localStorage.getItem('betix_connected_users')) || [];
let adminCode = 'BETIX2026';
let selectedRating = 0;

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
    { id: '1', title: 'Concert de Jazz', category: 'Concert', date: '2026-07-15T20:00', location: 'Paris, Olympia', description: 'Soiree jazz', price: 0.0003, seatsTotal: 100, seatsLeft: 100, image: eventImagesList.Concert, organizer: 'Demo', createdAt: new Date().toISOString() },
    { id: '2', title: 'Match de Football', category: 'Sport', date: '2026-07-20T18:00', location: 'Marseille', description: 'Match amical', price: 0.0003, seatsTotal: 500, seatsLeft: 500, image: eventImagesList.Sport, organizer: 'Demo', createdAt: new Date().toISOString() },
    { id: '3', title: 'Conference Blockchain', category: 'Conference', date: '2026-07-25T14:00', location: 'Lyon', description: 'Decouvrez l\'avenir', price: 0.0003, seatsTotal: 200, seatsLeft: 200, image: eventImagesList.Conference, organizer: 'Demo', createdAt: new Date().toISOString() },
    { id: '4', title: 'Formation Crypto', category: 'Formation', date: '2026-08-01T09:00', location: 'En ligne', description: 'Apprenez a trader', price: 0.0003, seatsTotal: 50, seatsLeft: 50, image: eventImagesList.Formation, organizer: 'Demo', createdAt: new Date().toISOString() },
    { id: '5', title: 'Avant-premiere', category: 'Cinema', date: '2026-08-05T19:00', location: 'Paris', description: 'Film exclusif', price: 0.0003, seatsTotal: 300, seatsLeft: 300, image: eventImagesList.Cinema, organizer: 'Demo', createdAt: new Date().toISOString() },
    { id: '6', title: 'Festival de Musique', category: 'Festival', date: '2026-08-10T12:00', location: 'Nice', description: '3 jours de festivites', price: 0.0003, seatsTotal: 1000, seatsLeft: 1000, image: eventImagesList.Festival, organizer: 'Demo', createdAt: new Date().toISOString() }
];

function escapeHtml(str) { if (!str) return ''; return str.replace(/[&<>]/g, function(m) { if (m === '&') return '&amp;'; if (m === '<') return '&lt;'; if (m === '>') return '&gt;'; return m; }); }
function formatDate(dateStr) { const date = new Date(dateStr); return !isNaN(date.getTime()) ? date.toLocaleDateString('fr-FR') : 'Date a definir'; }
function saveEvents() { localStorage.setItem('betix_events', JSON.stringify(events)); }
function saveTickets() { localStorage.setItem('betix_tickets', JSON.stringify(tickets)); }
function saveUser() { localStorage.setItem('betix_user', JSON.stringify(currentUser)); }

function showPage(pageName) {
    const pages = ['homePage', 'createPage', 'ticketsPage', 'historyPage', 'profilePage', 'whitepaperPage', 'faqPage', 'socialPage', 'settingsPage', 'ratingsPage', 'adminPage'];
    pages.forEach(page => { const el = document.getElementById(page); if (el) { el.style.display = 'none'; el.classList.add('hidden-page'); } });
    if (pageName === 'home') { document.getElementById('homePage').style.display = 'block'; renderEventsByCategory(); }
    else { const target = document.getElementById(pageName + 'Page'); if (target) { target.style.display = 'block'; target.classList.remove('hidden-page'); } }
    if (pageName === 'tickets') renderTickets();
    if (pageName === 'history') renderHistory();
    if (pageName === 'profile') updateProfilePage();
    if (pageName === 'ratings') renderMyRatings();
    if (pageName === 'admin') loadAdminPage();
    closeSidebar();
    window.scrollTo(0, 0);
}

function closeSidebar() { document.getElementById('sidebar')?.classList.remove('open'); document.getElementById('overlay')?.classList.remove('active'); }
function openSidebar() { document.getElementById('sidebar')?.classList.add('open'); document.getElementById('overlay')?.classList.add('active'); }

function renderEventCard(event) {
    const hasRated = ratings.some(r => r.eventId === event.id && r.userWallet === (currentUser.wallet || currentUser.name));
    const userRating = ratings.find(r => r.eventId === event.id && r.userWallet === (currentUser.wallet || currentUser.name));
    let avgRating = 0;
    const eventRatings = ratings.filter(r => r.eventId === event.id);
    if (eventRatings.length > 0) avgRating = eventRatings.reduce((a, r) => a + r.rating, 0) / eventRatings.length;
    const hasTicket = tickets.some(t => t.eventId === event.id && t.buyerWallet === (currentUser.wallet || currentUser.name));
    return `<div class="event-card"><img src="${event.image}" class="event-image" onerror="this.src='${eventImagesList[event.category] || eventImagesList.Concert}'"><div class="event-info"><div class="event-title">${escapeHtml(event.title)}</div><div class="event-date">${formatDate(event.date)}</div><div class="event-location">${escapeHtml(event.location || 'Lieu')}</div><div class="event-price">${event.price} Pi</div><div class="event-seats">${event.seatsLeft}/${event.seatsTotal} places</div>${avgRating > 0 ? `<div class="event-rating">Note: ${avgRating.toFixed(1)}/5 (${eventRatings.length} avis)</div>` : ''}<button class="buy-btn" onclick="buyTicket('${event.id}')">Acheter</button>${!hasRated && hasTicket ? `<button class="rating-btn" onclick="openRatingModal('${event.id}', '${escapeHtml(event.title)}')">Noter</button>` : ''}${hasRated ? `<div class="rated-badge">Note: ${userRating?.rating}/5</div>` : ''}</div></div>`;
}

function renderEventsByCategory() {
    const container = document.getElementById('eventsByCategory');
    if (!container) return;
    let filtered = events.filter(e => (currentFilter === 'Tous' || e.category === currentFilter) && (e.title.toLowerCase().includes(searchQuery) || (e.location && e.location.toLowerCase().includes(searchQuery))));
    if (filtered.length === 0) { container.innerHTML = '<p style="text-align:center;padding:2rem;">Aucun evenement</p>'; return; }
    if (currentFilter !== 'Tous') { container.innerHTML = `<div class="category-section"><div class="events-grid">${filtered.map(e => renderEventCard(e)).join('')}</div></div>`; return; }
    const cats = ['Concert', 'Sport', 'Conference', 'Formation', 'Cinema', 'Festival'];
    let html = '';
    cats.forEach(cat => { const catEvents = filtered.filter(e => e.category === cat); if (catEvents.length) html += `<div class="category-section"><div class="category-header">${cat}</div><div class="events-grid">${catEvents.map(e => renderEventCard(e)).join('')}</div></div>`; });
    container.innerHTML = html;
}

function initFilters() {
    const cats = ['Tous', 'Concert', 'Sport', 'Conference', 'Formation', 'Cinema', 'Festival'];
    const container = document.getElementById('filtersContainer');
    if (!container) return;
    container.innerHTML = cats.map(c => `<div class="filter-chip ${c === currentFilter ? 'active' : ''}" data-category="${c}">${c}</div>`).join('');
    document.querySelectorAll('.filter-chip').forEach(chip => { chip.addEventListener('click', () => { currentFilter = chip.dataset.category; initFilters(); renderEventsByCategory(); }); });
}

async function connectToPi() {
    if (typeof Pi === 'undefined') { 
        alert("Veuillez ouvrir cette page dans Pi Browser");
        return;
    }
    
    try {
        const scopes = ['username', 'payments'];
        const auth = await Pi.authenticate(scopes, onIncompletePaymentFound);
        
        if (auth && auth.user) {
            piUser = auth.user;
            currentUser.wallet = piUser.username;
            currentUser.name = piUser.username;
            saveUser();
            updateUserInfo();
            updateProfilePage();
            trackUserConnection();
            renderEventsByCategory();
            alert(`Wallet Pi connecté ! Bienvenue ${piUser.username}`);
            closeSidebar();
        }
    } catch (error) {
        console.error("Erreur connexion Pi:", error);
        alert("Erreur de connexion: " + (error.message || "Veuillez réessayer"));
    }
}

async function onIncompletePaymentFound(payment) {
    console.log("Paiement incomplet trouvé:", payment);
    const pendingPayment = JSON.parse(localStorage.getItem('betix_pending_payment') || '{}');
    
    if (pendingPayment.eventId && payment.metadata?.eventId === pendingPayment.eventId) {
        try {
            await Pi.completePayment(payment.paymentId, payment.txid);
            alert("Paiement complété avec succès !");
            
            const event = events.find(e => e.id === pendingPayment.eventId);
            if (event) {
                event.seatsLeft--;
                saveEvents();
                tickets.push({
                    id: Date.now().toString(),
                    eventId: event.id,
                    eventTitle: event.title,
                    eventDate: event.date,
                    eventLocation: event.location,
                    price: event.price,
                    buyerWallet: piUser?.username || currentUser.wallet,
                    purchaseDate: new Date().toISOString(),
                    transactionId: payment.txid,
                    qrCode: `BETIX-${Date.now()}`
                });
                saveTickets();
                renderEventsByCategory();
                renderTickets();
                updateProfilePage();
                alert("Ticket ajouté à votre compte !");
            }
            localStorage.removeItem('betix_pending_payment');
        } catch (error) {
            console.error("Erreur complétion paiement:", error);
        }
    }
}

async function buyTicket(eventId) {
    if (typeof Pi === 'undefined') {
        alert("Veuillez ouvrir dans Pi Browser pour payer");
        return;
    }
    
    if (!piUser && !currentUser.wallet) {
        alert("Veuillez d'abord connecter votre wallet Pi");
        await connectToPi();
        return;
    }
    
    const event = events.find(e => e.id === eventId);
    if (!event || event.seatsLeft <= 0) {
        alert("Plus de places disponibles");
        return;
    }
    
    if (!confirm(`Acheter "${event.title}" pour ${event.price} Pi ?`)) return;
    
    try {
        const payment = await Pi.createPayment({
            amount: Number(event.price),
            memo: `Ticket: ${event.title}`,
            metadata: { eventId: event.id, eventTitle: event.title }
        }, {
            onReadyForServerApproval: function(paymentId) {
                console.log("📝 Approval:", paymentId);
                fetch(`${BACKEND_URL}/api/pi/approve`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ paymentId })
                })
                .then(res => res.json())
                .then(() => Pi.approvePayment(paymentId))
                .catch(err => console.error("Erreur approve:", err));
            },
            
            onReadyForServerCompletion: function(paymentId, txid) {
                console.log("💰 Completion:", paymentId, txid);
                fetch(`${BACKEND_URL}/api/pi/complete`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ paymentId, txid, amount: event.price, metadata: { eventId: event.id } })
                })
                .then(res => res.json())
                .then(() => Pi.completePayment(paymentId, txid))
                .then(() => {
                    event.seatsLeft--;
                    saveEvents();
                    tickets.push({
                        id: Date.now().toString(),
                        eventId: event.id,
                        eventTitle: event.title,
                        eventDate: event.date,
                        eventLocation: event.location,
                        price: event.price,
                        buyerWallet: piUser?.username || currentUser.wallet,
                        purchaseDate: new Date().toISOString(),
                        transactionId: txid,
                        qrCode: `BETIX-${Date.now()}`
                    });
                    saveTickets();
                    renderEventsByCategory();
                    renderTickets();
                    renderHistory();
                    updateProfilePage();
                    alert(`✅ Achat réussi ! Ticket pour "${event.title}" ajouté.`);
                })
                .catch(err => console.error("Erreur complete:", err));
            },
            
            onCancel: function(paymentId) {
                console.log("❌ Annulé:", paymentId);
                fetch(`${BACKEND_URL}/api/pi/cancel`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ paymentId })
                }).catch(()=>{});
                alert("Paiement annulé");
            },
            
            onError: function(error, paymentId) {
                console.error("💥 Erreur:", error);
                alert("Erreur de paiement: " + (error.message || "Vérifiez votre wallet"));
            }
        });
    } catch (error) {
        console.error("Exception:", error);
        alert("Erreur: " + error.message);
    }
}

function connectWallet() { connectToPi(); }

function updateUserInfo() {
    const sidebarName = document.getElementById('sidebarName');
    const sidebarWallet = document.getElementById('sidebarWallet');
    const sidebarAvatar = document.getElementById('sidebarAvatar');
    if (sidebarName) sidebarName.innerText = currentUser.name;
    if (sidebarWallet) sidebarWallet.innerText = currentUser.wallet ? currentUser.wallet.substring(0, 15) + '...' : 'Non connecte';
    if (sidebarAvatar) sidebarAvatar.innerText = currentUser.name.substring(0, 2).toUpperCase();
}

function updateProfilePage() {
    const profileName = document.getElementById('profileName');
    const profileWallet = document.getElementById('profileWallet');
    const ticketCount = document.getElementById('ticketCount');
    const ratedCount = document.getElementById('ratedCount');
    if (profileName) profileName.innerText = currentUser.name;
    if (profileWallet) profileWallet.innerText = currentUser.wallet || 'Non connecte';
    if (ticketCount) ticketCount.innerText = tickets.length;
    if (ratedCount) ratedCount.innerText = ratings.filter(r => r.userWallet === (currentUser.wallet || currentUser.name)).length;
}

function renderTickets() {
    const container = document.getElementById('ticketsList');
    if (!container) return;
    const active = tickets.filter(t => new Date(t.eventDate) > new Date());
    if (!active.length) { container.innerHTML = '<p style="text-align:center;padding:2rem;">Aucun ticket actif</p>'; return; }
    container.innerHTML = active.map(t => `<div class="ticket-card"><h3>${escapeHtml(t.eventTitle)}</h3><p>Date: ${formatDate(t.eventDate)}</p><p>Lieu: ${escapeHtml(t.eventLocation)}</p><p>Prix: ${t.price} Pi</p><p>Code: ${t.qrCode}</p></div>`).join('');
}

function renderHistory() {
    const container = document.getElementById('historyList');
    if (!container) return;
    const old = tickets.filter(t => new Date(t.eventDate) <= new Date());
    if (!old.length) { container.innerHTML = '<p style="text-align:center;padding:2rem;">Aucun historique</p>'; return; }
    container.innerHTML = old.map(t => `<div class="ticket-card"><h3>${escapeHtml(t.eventTitle)}</h3><p>Date: ${formatDate(t.eventDate)}</p><p>Achete: ${new Date(t.purchaseDate).toLocaleDateString()}</p></div>`).join('');
}

function createEvent(e) {
    e.preventDefault();
    if (!currentUser.wallet) { alert('Connectez wallet d\'abord'); return; }
    const category = document.getElementById('eventCategory').value;
    const newEvent = {
        id: Date.now().toString(), title: document.getElementById('eventTitle').value, category: category,
        date: document.getElementById('eventDate').value, location: document.getElementById('eventLocation').value,
        description: document.getElementById('eventDescription').value, price: parseFloat(document.getElementById('eventPrice').value) || 0.0003,
        seatsTotal: parseInt(document.getElementById('eventSeats').value), seatsLeft: parseInt(document.getElementById('eventSeats').value),
        image: document.getElementById('eventImage').value || eventImagesList[category], organizer: currentUser.wallet, createdAt: new Date().toISOString()
    };
    if (!newEvent.title || !newEvent.date || !newEvent.location || !newEvent.seatsTotal) { alert('Champs requis'); return; }
    events.push(newEvent); saveEvents(); document.getElementById('eventForm').reset(); alert('Evenement cree !'); showPage('home');
}

function openRatingModal(eventId, eventTitle) {
    selectedRating = 0;
    const modal = document.getElementById('ratingModal');
    document.getElementById('ratingEventInfo').innerHTML = `<p><strong>${escapeHtml(eventTitle)}</strong></p>`;
    document.getElementById('ratingComment').value = '';
    const stars = document.querySelectorAll('#ratingModal .star');
    stars.forEach(star => { star.classList.remove('active'); star.onclick = () => { selectedRating = parseInt(star.dataset.rating); stars.forEach(s => { if (parseInt(s.dataset.rating) <= selectedRating) s.classList.add('active'); else s.classList.remove('active'); }); }; });
    document.getElementById('submitRatingBtn').onclick = () => {
        if (selectedRating === 0) { alert('Choisissez une note'); return; }
        ratings.push({ id: Date.now(), eventId: eventId, eventTitle: eventTitle, rating: selectedRating, comment: document.getElementById('ratingComment').value || '', userWallet: currentUser.wallet || currentUser.name, userName: currentUser.name, date: new Date().toISOString() });
        localStorage.setItem('betix_ratings', JSON.stringify(ratings));
        alert(`Note ${selectedRating}/5 enregistree`);
        modal.classList.remove('show');
        renderEventsByCategory(); renderMyRatings(); updateProfilePage();
    };
    modal.classList.add('show');
    document.getElementById('ratingModalClose').onclick = () => modal.classList.remove('show');
}

function renderMyRatings() {
    const container = document.getElementById('myRatingsList');
    if (!container) return;
    const myRatings = ratings.filter(r => r.userWallet === (currentUser.wallet || currentUser.name));
    if (!myRatings.length) { container.innerHTML = '<p style="text-align:center;padding:2rem;">Aucune evaluation</p>'; return; }
    container.innerHTML = myRatings.map(r => { let stars = ''; for (let i = 0; i < r.rating; i++) stars += '★'; for (let i = r.rating; i < 5; i++) stars += '☆'; return `<div class="ticket-card"><h3>${escapeHtml(r.eventTitle)}</h3><div>Note: ${r.rating}/5 ${stars}</div>${r.comment ? `<p>"${escapeHtml(r.comment)}"</p>` : ''}<small>${new Date(r.date).toLocaleDateString()}</small></div>`; }).join('');
}

function initAdmin() {
    const adminItem = document.getElementById('adminMenuItem');
    if (!adminItem) return;
    const logo = document.querySelector('.logo');
    let clicks = 0;
    logo?.addEventListener('click', () => { clicks++; if (clicks === 5) { const pwd = prompt('Code admin:'); if (pwd === adminCode) { localStorage.setItem('betix_admin_password', pwd); adminItem.style.display = 'block'; alert('Admin active'); } clicks = 0; } setTimeout(() => { clicks = 0; }, 2000); });
    if (localStorage.getItem('betix_admin_password') === adminCode) adminItem.style.display = 'block';
}

function loadAdminPage() {
    if (localStorage.getItem('betix_admin_password') !== adminCode) { alert('Acces refuse'); showPage('home'); return; }
    document.getElementById('adminUserCount').innerText = connectedUsers.length || 1;
    document.getElementById('adminTicketCount').innerText = tickets.length;
    document.getElementById('adminEventCount').innerText = events.length;
    let usersHtml = '<table></tr><th>Utilisateur</th><th>Wallet</th><th>Tickets</th></tr>';
    usersHtml += '<tr><td>' + escapeHtml(currentUser.name) + '</td><td>' + (currentUser.wallet || 'Non connecte') + 'NonNullable?' + tickets.length + '</td></tr>';
    connectedUsers.forEach(u => { usersHtml += '<tr><td>' + escapeHtml(u.name) + 'NonNullable?' + (u.wallet || 'Non connecte') + 'NonNullable?' + (u.ticketCount || 0) + '</td></tr>'; });
    usersHtml += '</table>';
    document.getElementById('adminUsersList').innerHTML = usersHtml;
    document.getElementById('adminEventsList').innerHTML = events.map(e => `<div class="admin-event-item"><div><strong>${escapeHtml(e.title)}</strong><br><small>${e.category} | ${e.seatsLeft}/${e.seatsTotal}</small></div><button class="admin-delete-btn" onclick="adminDeleteEvent('${e.id}')">Supprimer</button></div>`).join('');
}
function adminDeleteEvent(id) { if (confirm('Supprimer ?')) { events = events.filter(e => e.id !== id); saveEvents(); loadAdminPage(); renderEventsByCategory(); alert('Supprime'); } }

function initChat() {
    const widget = document.getElementById('chatWidget'), btn = document.getElementById('chatFloatBtn'), close = document.getElementById('chatCloseBtn'), send = document.getElementById('chatSendBtn'), input = document.getElementById('chatInput'), msgs = document.getElementById('chatMessages');
    if (!widget) return;
    function load() { if (!msgs) return; msgs.innerHTML = ''; if (!chatMessages.length) add({ text: "Bonjour ! Comment pouvons-nous vous aider ?", sender: 'Support', isUser: false, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }); else chatMessages.forEach(m => add(m)); }
    function add(m) { if (!msgs) return; const d = document.createElement('div'); d.className = `chat-message ${m.isUser ? 'user' : 'support'}`; d.innerHTML = `<div class="message-bubble">${escapeHtml(m.text)}</div><span class="message-time">${m.time}</span>`; msgs.appendChild(d); msgs.scrollTop = msgs.scrollHeight; }
    btn?.addEventListener('click', () => widget.classList.toggle('open'));
    close?.addEventListener('click', () => widget.classList.remove('open'));
    function sendMsg() { const msg = input.value.trim(); if (!msg) return; const newMsg = { id: Date.now(), text: msg, sender: currentUser.wallet || currentUser.name, isUser: true, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }; add(newMsg); chatMessages.push(newMsg); localStorage.setItem('betix_chat_messages', JSON.stringify(chatMessages)); input.value = ''; setTimeout(() => { let resp = "Merci ! Reponse rapide par email: betixservices@gmail.com"; if (msg.toLowerCase().includes('ticket')) resp = "Vos tickets dans l'onglet 'Mes tickets'."; else if (msg.toLowerCase().includes('paiement')) resp = "Paiements securises via Pi Network."; const auto = { id: Date.now() + 1, text: resp, sender: 'Support Betix', isUser: false, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }; add(auto); chatMessages.push(auto); localStorage.setItem('betix_chat_messages', JSON.stringify(chatMessages)); }, 1000); }
    send?.addEventListener('click', sendMsg);
    input?.addEventListener('keypress', e => { if (e.key === 'Enter') sendMsg(); });
    load();
}

function initLegalModals() {
    const modal = document.getElementById('legalModal'), content = document.getElementById('modalContent'), close = document.querySelector('#legalModal .modal-close');
    const privacy = '<div class="legal-content"><h1>Confidentialite</h1><p>Betix collecte les donnees necessaires.</p><p>betixservices@gmail.com</p></div>';
    const terms = '<div class="legal-content"><h1>Conditions</h1><p>Paiements irreversibles.</p><p>betixservices@gmail.com</p></div>';
    const legal = '<div class="legal-content"><h1>Mentions</h1><p>Betix - Plateforme decentralisee</p><p>betixservices@gmail.com</p></div>';
    const cookies = '<div class="legal-content"><h1>Cookies</h1><p>Cookies pour ameliorer l\'experience.</p></div>';
    function show(c) { content.innerHTML = c; modal.classList.add('show'); }
    close.onclick = () => modal.classList.remove('show');
    window.onclick = e => { if (e.target === modal) modal.classList.remove('show'); };
    const privacyLink = document.getElementById('privacyLink');
    const termsLink = document.getElementById('termsLink');
    const legalNoticeLink = document.getElementById('legalNoticeLink');
    const cookiesLink = document.getElementById('cookiesLink');
    if (privacyLink) privacyLink.addEventListener('click', e => { e.preventDefault(); show(privacy); });
    if (termsLink) termsLink.addEventListener('click', e => { e.preventDefault(); show(terms); });
    if (legalNoticeLink) legalNoticeLink.addEventListener('click', e => { e.preventDefault(); show(legal); });
    if (cookiesLink) cookiesLink.addEventListener('click', e => { e.preventDefault(); show(cookies); });
}

function subscribeNewsletter() {
    const email = document.getElementById('newsletterEmail')?.value;
    if (email && email.includes('@')) { let subs = JSON.parse(localStorage.getItem('betix_newsletter')) || []; if (!subs.includes(email)) { subs.push(email); localStorage.setItem('betix_newsletter', JSON.stringify(subs)); alert('Inscrit !'); document.getElementById('newsletterEmail').value = ''; } else alert('Deja inscrit'); }
    else alert('Email valide requis');
}

function trackUserConnection() {
    if (currentUser.wallet) {
        const existing = connectedUsers.find(u => u.wallet === currentUser.wallet);
        if (!existing) connectedUsers.push({ name: currentUser.name, wallet: currentUser.wallet, ticketCount: tickets.length, lastSeen: new Date().toLocaleString() });
        else { existing.lastSeen = new Date().toLocaleString(); existing.ticketCount = tickets.length; }
        localStorage.setItem('betix_connected_users', JSON.stringify(connectedUsers));
    }
}

function clearAllData() { if (confirm('Supprimer toutes vos donnees ?')) { localStorage.clear(); location.reload(); } }
function toggleDarkMode(e) { if (e.target.checked) { document.body.classList.add('dark-mode'); localStorage.setItem('darkMode', 'true'); } else { document.body.classList.remove('dark-mode'); localStorage.setItem('darkMode', 'false'); } }
function showWhitepaperLang(lang) { const fr = document.getElementById('whitepaper-fr'), en = document.getElementById('whitepaper-en'); if (lang === 'fr') { fr.style.display = 'block'; en.style.display = 'none'; } else { fr.style.display = 'none'; en.style.display = 'block'; } }

function googleTranslateElementInit() {
    new google.translate.TranslateElement({
        pageLanguage: 'fr',
        includedLanguages: 'fr,en,es,de,it,pt,ar,zh-CN,zh-TW,ja,ko,ru,nl,pl,tr,vi,th,el,hi,he,sv,da,no,fi,cs,hu,ro',
        layout: google.translate.TranslateElement.InlineLayout.HORIZONTAL,
        autoDisplay: false,
        multilanguagePage: true
    }, 'google_translate_element');
    
    setTimeout(function() {
        const select = document.querySelector('.goog-te-combo');
        if (select) {
            select.style.width = '100%';
            select.style.maxWidth = '320px';
            select.style.padding = '10px';
            select.style.fontSize = '14px';
            select.style.backgroundColor = 'var(--betix-degrade)';
            select.style.color = 'white';
            select.style.border = 'none';
            select.style.borderRadius = '8px';
            select.style.cursor = 'pointer';
        }
        const iframes = document.querySelectorAll('iframe');
        iframes.forEach(iframe => {
            if (iframe.className === 'goog-te-banner-frame' || iframe.id === 'google_translate_frame') {
                iframe.style.display = 'none';
                iframe.style.visibility = 'hidden';
                iframe.style.height = '0px';
                iframe.style.width = '0px';
            }
        });
        document.body.style.top = '0px';
        document.body.style.position = 'relative';
    }, 500);
}

document.addEventListener('DOMContentLoaded', function() {
    if (typeof Pi !== 'undefined') {
        Pi.init({ version: "2.0", sandbox: true });
        console.log("✅ Pi SDK initialisé dans DOMContentLoaded");
    }
    
    if (!events.length) { events = [...demoEvents]; saveEvents(); }
    initFilters(); renderEventsByCategory(); updateUserInfo(); updateProfilePage(); initAdmin(); initChat(); initLegalModals();
    
    const dark = document.getElementById('darkModeToggle');
    if (localStorage.getItem('darkMode') === 'true') { if (dark) dark.checked = true; document.body.classList.add('dark-mode'); }
    if (dark) dark.addEventListener('change', toggleDarkMode);
    
    const menuBtn = document.getElementById('menuBtn');
    const closeSidebarBtn = document.getElementById('closeSidebarBtn');
    const overlay = document.getElementById('overlay');
    const sidebarWalletBtn = document.getElementById('sidebarWalletBtn');
    const profileConnectBtn = document.getElementById('profileConnectBtn');
    const eventForm = document.getElementById('eventForm');
    const searchInput = document.getElementById('searchInput');
    const clearDataBtn = document.getElementById('clearDataBtn');
    
    if (menuBtn) menuBtn.addEventListener('click', openSidebar);
    if (closeSidebarBtn) closeSidebarBtn.addEventListener('click', closeSidebar);
    if (overlay) overlay.addEventListener('click', closeSidebar);
    if (sidebarWalletBtn) sidebarWalletBtn.addEventListener('click', connectToPi);
    if (profileConnectBtn) profileConnectBtn.addEventListener('click', connectToPi);
    if (eventForm) eventForm.addEventListener('submit', createEvent);
    if (searchInput) searchInput.addEventListener('input', e => { searchQuery = e.target.value.toLowerCase(); renderEventsByCategory(); });
    if (clearDataBtn) clearDataBtn.addEventListener('click', clearAllData);
    
    document.querySelectorAll('.sidebar-item').forEach(btn => { btn.addEventListener('click', () => { showPage(btn.dataset.page); closeSidebar(); }); });
    
    const loader = document.getElementById('loader'), main = document.getElementById('main-content');
    if (loader && main) { setTimeout(() => { loader.style.opacity = '0'; setTimeout(() => { loader.style.display = 'none'; main.style.display = 'block'; }, 500); }, 800); }
});