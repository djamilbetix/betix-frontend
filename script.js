// =============================================
// ===== TRADUCTION AVEC MyMemory API =====
// =============================================

// Configuration
const MYMEMORY_API_URL = 'https://api.mymemory.translated.net/get';

let currentLang = localStorage.getItem('betix_language') || 'fr';
let isTranslating = false;

// Traduire un texte avec MyMemory
async function translateText(text, targetLang) {
    if (!text || text.trim() === '') return text;
    if (targetLang === 'fr') return text;
    
    try {
        const response = await fetch(
            `${MYMEMORY_API_URL}?q=${encodeURIComponent(text)}&langpair=fr|${targetLang}&de=betix@betix.com`
        );
        
        if (!response.ok) {
            console.log('Erreur traduction MyMemory');
            return text;
        }
        
        const data = await response.json();
        
        if (data.responseStatus === 200) {
            return data.responseData.translatedText || text;
        } else {
            console.log('Erreur MyMemory:', data.responseDetails);
            return text;
        }
    } catch (error) {
        console.log('Erreur traduction:', error);
        return text;
    }
}

// Traduire tous les elements de la page
async function translatePage(targetLang) {
    if (isTranslating) return;
    if (!targetLang || targetLang === currentLang) return;
    
    isTranslating = true;
    console.log('Traduction vers:', targetLang);
    
    try {
        currentLang = targetLang;
        localStorage.setItem('betix_language', targetLang);
        
        // Mettre a jour les boutons
        document.querySelectorAll('.lang-btn').forEach(btn => {
            btn.classList.remove('active');
            if (btn.dataset.lang === targetLang) {
                btn.classList.add('active');
            }
        });
        
        // Traduire les textes
        const elements = document.querySelectorAll('[data-translate]');
        console.log('Elements a traduire:', elements.length);
        
        // Traduire en parallele pour plus de rapidite
        const translationPromises = [];
        const elementsToTranslate = [];
        
        elements.forEach(el => {
            const original = el.dataset.originalText || el.textContent;
            el.dataset.originalText = original;
            translationPromises.push(translateText(original, targetLang));
            elementsToTranslate.push(el);
        });
        
        const translations = await Promise.all(translationPromises);
        translations.forEach((translated, index) => {
            if (translated) {
                elementsToTranslate[index].textContent = translated;
            }
        });
        
        // Traduire les placeholders
        const inputs = document.querySelectorAll('[data-translate-placeholder]');
        const placeholderPromises = [];
        const inputsToTranslate = [];
        
        inputs.forEach(el => {
            const original = el.dataset.originalPlaceholder || el.placeholder;
            el.dataset.originalPlaceholder = original;
            placeholderPromises.push(translateText(original, targetLang));
            inputsToTranslate.push(el);
        });
        
        const placeholderTranslations = await Promise.all(placeholderPromises);
        placeholderTranslations.forEach((translated, index) => {
            if (translated) {
                inputsToTranslate[index].placeholder = translated;
            }
        });
        
        console.log('Traduction terminee !');
    } catch (error) {
        console.log('Erreur lors de la traduction:', error);
    } finally {
        isTranslating = false;
    }
}

// Initialiser les boutons
function initLanguageButtons() {
    console.log('Initialisation des boutons de langue...');
    const buttons = document.querySelectorAll('.lang-btn');
    console.log('Boutons trouves:', buttons.length);
    
    if (buttons.length === 0) {
        console.log('Aucun bouton de langue trouve !');
        return;
    }
    
    // Supprimer les anciens ecouteurs pour eviter les doublons
    buttons.forEach(btn => {
        const newBtn = btn.cloneNode(true);
        btn.parentNode.replaceChild(newBtn, btn);
    });
    
    // Ajouter les nouveaux ecouteurs
    document.querySelectorAll('.lang-btn').forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            const lang = this.dataset.lang;
            console.log('Clic sur:', lang);
            translatePage(lang);
            // Fermer le selecteur après sélection
            const selector = document.getElementById('sidebarLangSelector');
            if (selector) {
                selector.style.display = 'none';
            }
        });
    });
    
    // Restaurer la langue sauvegardee
    const savedLang = localStorage.getItem('betix_language') || 'fr';
    document.querySelectorAll('.lang-btn').forEach(btn => {
        btn.classList.remove('active');
        if (btn.dataset.lang === savedLang) {
            btn.classList.add('active');
        }
    });
}

// Appliquer la langue sauvegardee
function applySavedLanguage() {
    const savedLang = localStorage.getItem('betix_language') || 'fr';
    console.log('Langue sauvegardee:', savedLang);
    if (savedLang !== 'fr') {
        setTimeout(function() {
            translatePage(savedLang);
        }, 800);
    }
}

// Reinitialisation apres chargement dynamique
function reinitTranslation() {
    const savedLang = localStorage.getItem('betix_language') || 'fr';
    if (savedLang !== 'fr' && !isTranslating) {
        console.log('Reinitialisation de la traduction...');
        setTimeout(function() {
            translatePage(savedLang);
        }, 500);
    }
}

// ===== INITIALISATION FORCEE =====
console.log('Chargement du module de traduction MyMemory...');

// Methode 1: Si le DOM est deja charge
if (document.readyState === 'complete' || document.readyState === 'interactive') {
    console.log('DOM deja charge, initialisation immediate...');
    setTimeout(function() {
        initLanguageButtons();
        applySavedLanguage();
    }, 200);
} else {
    // Methode 2: Attendre DOMContentLoaded
    document.addEventListener('DOMContentLoaded', function() {
        console.log('DOMContentLoaded, initialisation...');
        setTimeout(function() {
            initLanguageButtons();
            applySavedLanguage();
        }, 400);
    });
}

// Methode 3: Initialisation supplementaire apres le chargement complet
window.addEventListener('load', function() {
    console.log('Window load, verification...');
    setTimeout(function() {
        initLanguageButtons();
        reinitTranslation();
    }, 500);
});

// Methode 4: Reinitialisation periodique pour les pages dynamiques
setTimeout(function() {
    console.log('Reinitialisation de securite...');
    initLanguageButtons();
    reinitTranslation();
}, 2000);

// Methode 5: Observer les changements de page
const observer = new MutationObserver(function(mutations) {
    for (let mutation of mutations) {
        if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
            const savedLang = localStorage.getItem('betix_language') || 'fr';
            if (savedLang !== 'fr' && !isTranslating) {
                setTimeout(function() {
                    translatePage(savedLang);
                }, 300);
            }
            break;
        }
    }
});

document.addEventListener('DOMContentLoaded', function() {
    const mainContent = document.getElementById('main-content');
    if (mainContent) {
        observer.observe(mainContent, {
            childList: true,
            subtree: true
        });
    }
});

// =============================================
// ===== FIN DE LA PARTIE TRADUCTION =====
// =============================================

// ============================================================
// ===== VARIABLES GLOBALES =====
// ============================================================

let events = JSON.parse(localStorage.getItem('betix_events')) || [];
let tickets = JSON.parse(localStorage.getItem('betix_tickets')) || [];
let currentUser = JSON.parse(localStorage.getItem('betix_user')) || { name: 'Invite', wallet: null, memberSince: '2026', loyaltyPoints: 0 };
let currentFilter = 'Tous';
let searchQuery = '';
let piUser = null;
let ratings = JSON.parse(localStorage.getItem('betix_ratings')) || [];
let chatMessages = JSON.parse(localStorage.getItem('betix_chat_messages')) || [];
let connectedUsers = JSON.parse(localStorage.getItem('betix_connected_users')) || [];
let adminCode = 'Betix@2026#';
let selectedRating = 0;
let lastActivity = localStorage.getItem('betix_last_activity') || Date.now();
let pageHistory = ['home'];
let logoClickCount = 0;

// Variables admin
let adminSessionTimer = 1800;
let adminTimerInterval = null;
let adminLogs = JSON.parse(localStorage.getItem('betix_admin_logs')) || [];
let adminPassword = localStorage.getItem('betix_admin_password') || 'Betix@2026#';

let heroSlides = JSON.parse(localStorage.getItem('betix_hero_slides')) || [];

if (heroSlides.length === 0) {
    heroSlides = [
        {
            image: 'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?w=1200&h=600&fit=crop',
            badge: 'Concert',
            title: 'Concert de Jazz',
            description: 'Soiree exceptionnelle avec les meilleurs artistes'
        },
        {
            image: 'https://images.unsplash.com/photo-1461896836934-ffe807baa261?w=1200&h=600&fit=crop',
            badge: 'Sport',
            title: 'Match de Football',
            description: 'Vivez l emotion du sport en direct'
        },
        {
            image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1200&h=600&fit=crop',
            badge: 'Conference',
            title: 'Blockchain Summit',
            description: 'L avenir de la technologie decentralisee'
        },
        {
            image: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=1200&h=600&fit=crop',
            badge: 'Cinema',
            title: 'Avant-Premiere',
            description: 'Decouvrez les films en exclusivite'
        },
        {
            image: 'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=1200&h=600&fit=crop',
            badge: 'Festival',
            title: 'Festival de Musique',
            description: '3 jours de festivites inoubliables'
        }
    ];
    localStorage.setItem('betix_hero_slides', JSON.stringify(heroSlides));
}

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
    { id: '1', title: 'Concert de Jazz', category: 'Concert', date: '2026-07-15T20:00', location: 'Paris, Olympia', description: 'Soiree jazz exceptionnelle avec les meilleurs artistes internationaux', conditions: 'Avoir un wallet Pi Network actif\nPaiement en Pi (montant indique)\nPresenter son ticket a l entree\nRespecter les regles de l evenement', price: 0.0003, seatsTotal: 100, seatsLeft: 100, images: [eventImagesList.Concert], coverImage: eventImagesList.Concert, organizer: 'Demo', createdAt: new Date().toISOString(), boosts: 0 },
    { id: '2', title: 'Match de Football', category: 'Sport', date: '2026-07-20T18:00', location: 'Marseille', description: 'Match amical entre equipes locales', conditions: 'Avoir un wallet Pi Network actif\nPaiement en Pi (montant indique)\nPresenter son ticket a l entree', price: 0.0003, seatsTotal: 500, seatsLeft: 500, images: [eventImagesList.Sport], coverImage: eventImagesList.Sport, organizer: 'Demo', createdAt: new Date().toISOString(), boosts: 0 },
    { id: '3', title: 'Conference Blockchain', category: 'Conference', date: '2026-07-25T14:00', location: 'Lyon', description: 'Decouvrez l avenir de la blockchain et du Web3', conditions: 'Avoir un wallet Pi Network actif\nPaiement en Pi (montant indique)\nInscription obligatoire', price: 0.0003, seatsTotal: 200, seatsLeft: 200, images: [eventImagesList.Conference], coverImage: eventImagesList.Conference, organizer: 'Demo', createdAt: new Date().toISOString(), boosts: 0 },
    { id: '4', title: 'Formation Crypto', category: 'Formation', date: '2026-08-01T09:00', location: 'En ligne', description: 'Apprenez a trader et a investir dans les cryptomonnaies', conditions: 'Avoir un wallet Pi Network actif\nPaiement en Pi (montant indique)', price: 0.0003, seatsTotal: 50, seatsLeft: 50, images: [eventImagesList.Formation], coverImage: eventImagesList.Formation, organizer: 'Demo', createdAt: new Date().toISOString(), boosts: 0 },
    { id: '5', title: 'Avant-premiere', category: 'Cinema', date: '2026-08-05T19:00', location: 'Paris', description: 'Film exclusif en avant-premiere', conditions: 'Avoir un wallet Pi Network actif\nPaiement en Pi (montant indique)\nPresenter son ticket a l entree', price: 0.0003, seatsTotal: 300, seatsLeft: 300, images: [eventImagesList.Cinema], coverImage: eventImagesList.Cinema, organizer: 'Demo', createdAt: new Date().toISOString(), boosts: 0 },
    { id: '6', title: 'Festival de Musique', category: 'Festival', date: '2026-08-10T12:00', location: 'Nice', description: '3 jours de festivites avec plus de 20 artistes', conditions: 'Avoir un wallet Pi Network actif\nPaiement en Pi (montant indique)\nPresenter son ticket a l entree', price: 0.0003, seatsTotal: 1000, seatsLeft: 1000, images: [eventImagesList.Festival], coverImage: eventImagesList.Festival, organizer: 'Demo', createdAt: new Date().toISOString(), boosts: 0 }
];

function escapeHtml(str) { if (!str) return ''; return str.replace(/[&<>]/g, function(m) { if (m === '&') return '&amp;'; if (m === '<') return '&lt;'; if (m === '>') return '&gt;'; return m; }); }
function formatDate(dateStr) { var date = new Date(dateStr); return !isNaN(date.getTime()) ? date.toLocaleDateString('fr-FR') : 'Date a definir'; }
function formatDateTime(dateStr) { var date = new Date(dateStr); return !isNaN(date.getTime()) ? date.toLocaleString('fr-FR') : 'Date inconnue'; }
function saveEvents() { localStorage.setItem('betix_events', JSON.stringify(events)); }
function saveTickets() { localStorage.setItem('betix_tickets', JSON.stringify(tickets)); }
function saveUser() { localStorage.setItem('betix_user', JSON.stringify(currentUser)); }

// ============================================================
// ===== FONCTIONS UTILITAIRES =====
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
function logout() { if (confirm('Etes-vous sur de vouloir vous deconnecter ?')) { currentUser = { name: 'Invite', wallet: null, memberSince: '2026', loyaltyPoints: 0 }; piUser = null; saveUser(); localStorage.removeItem('betix_last_activity'); localStorage.removeItem('betix_pending_payment'); updateUserInfo(); updateProfilePage(); renderEventsByCategory(); renderTickets(); renderHistory(); alert('Vous etes deconnecte'); closeSidebar(); } }
function startSessionMonitor() { setInterval(function() { if (currentUser.wallet && isSessionExpired()) { logout(); alert('Session expiree pour inactivite. Veuillez vous reconnecter.'); } }, 60000); }
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
    var pages = ['homePage', 'createPage', 'ticketsPage', 'historyPage', 'profilePage', 'whitepaperPage', 'faqPage', 'settingsPage', 'ratingsPage', 'adminPage', 'slidesPage'];
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
    closeSidebar();
    window.scrollTo(0, 0);
    
    setTimeout(function() {
        reinitTranslation();
    }, 300);
}

function closeSidebar() { var s = document.getElementById('sidebar'); if (s) s.classList.remove('open'); var o = document.getElementById('overlay'); if (o) o.classList.remove('active'); }
function openSidebar() { var s = document.getElementById('sidebar'); if (s) s.classList.add('open'); var o = document.getElementById('overlay'); if (o) o.classList.add('active'); }

// ============================================================
// ===== ADMIN AVANCEE - SESSION, LOGS, MOT DE PASSE =====
// ============================================================

// ===== JOURNAL DES CONNEXIONS ADMIN =====

function addAdminLog(action, details) {
    var log = {
        id: Date.now(),
        timestamp: new Date().toISOString(),
        date: new Date().toLocaleString('fr-FR'),
        user: currentUser.wallet || 'Admin local',
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
        container.innerHTML = '<p style="text-align:center;padding:20px;color:var(--gray);" data-translate>Aucun journal disponible</p>';
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
    if (confirm('Effacer tout le journal des connexions ?')) {
        adminLogs = [];
        localStorage.setItem('betix_admin_logs', JSON.stringify(adminLogs));
        renderAdminLogs();
        addAdminLog('Journal efface', 'Tous les logs ont ete supprimes');
        alert('Journal efface');
    }
}

// ===== SESSION ADMIN AVEC TIMER =====

function startAdminSession() {
    addAdminLog('Connexion admin', 'Acces a l\'interface d\'administration');
    
    var lastLogin = localStorage.getItem('betix_admin_last_login');
    var loginCount = parseInt(localStorage.getItem('betix_admin_login_count') || 0) + 1;
    localStorage.setItem('betix_admin_login_count', loginCount);
    localStorage.setItem('betix_admin_last_login', new Date().toLocaleString('fr-FR'));
    
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
            display.style.color = '#4FC3F7';
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
    
    addAdminLog('Deconnexion admin', 'Fin de session');
    localStorage.removeItem('betix_admin_password');
    
    var adminBtn = document.getElementById('adminMenuItem');
    if (adminBtn) {
        adminBtn.style.display = 'none';
    }
    
    alert('Session administrateur terminee');
    showPage('home');
}

// ===== CHANGEMENT DE MOT DE PASSE =====

function adminChangePassword() {
    var newPassword = document.getElementById('adminNewPassword').value;
    var confirmPassword = document.getElementById('adminConfirmPassword').value;
    var message = document.getElementById('adminPasswordMessage');
    
    if (!newPassword || newPassword.length < 6) {
        message.textContent = 'Le mot de passe doit contenir au moins 6 caracteres';
        message.style.color = '#ef4444';
        return;
    }
    
    if (newPassword !== confirmPassword) {
        message.textContent = 'Les mots de passe ne correspondent pas';
        message.style.color = '#ef4444';
        return;
    }
    
    adminPassword = newPassword;
    localStorage.setItem('betix_admin_password', newPassword);
    
    message.textContent = 'Mot de passe change avec succes !';
    message.style.color = '#10b981';
    
    document.getElementById('adminNewPassword').value = '';
    document.getElementById('adminConfirmPassword').value = '';
    
    addAdminLog('Changement de mot de passe', 'Le mot de passe admin a ete modifie');
    
    setTimeout(function() {
        message.textContent = '';
    }, 3000);
}

// ===== LOAD ADMIN PAGE =====

function loadAdminPage() {
    var storedPassword = localStorage.getItem('betix_admin_password');
    if (storedPassword !== adminPassword && storedPassword !== 'Betix@2026#') {
        alert('Acces refuse. Veuillez vous authentifier via 5 clics sur le logo.');
        showPage('home');
        return;
    }
    
    if (storedPassword && storedPassword !== adminPassword) {
        adminPassword = storedPassword;
    }
    
    document.getElementById('adminUserCount').innerText = connectedUsers.length || 1;
    document.getElementById('adminTicketCount').innerText = tickets.length;
    document.getElementById('adminEventCount').innerText = events.length;
    
    var lastLogin = localStorage.getItem('betix_admin_last_login') || 'Jamais';
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

// ===== FILTRE DES UTILISATEURS =====

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

// ===== RENDER ADMIN USERS =====

function renderAdminUsers() {
    var container = document.getElementById('adminUsersList');
    if (!container) return;
    
    var html = '<table>';
    html += '<tr><th>Utilisateur</th><th>Wallet</th><th>Tickets</th><th>Note moyenne</th><th>Derniere connexion</th></tr>';
    
    var userRatings = ratings.filter(function(r) { return r.userWallet === (currentUser.wallet || currentUser.name); });
    var avgRating = 0;
    if (userRatings.length > 0) {
        avgRating = userRatings.reduce(function(a, r) { return a + r.rating; }, 0) / userRatings.length;
    }
    
    html += '<tr><td>' + escapeHtml(currentUser.name) + ' <span style="color:var(--primary);font-size:0.7rem;">(vous)</span></td>' +
            '<td>' + (currentUser.wallet || 'Non connecte') + '</td>' +
            '<td>' + tickets.length + '</td>' +
            '<td>' + (avgRating > 0 ? avgRating.toFixed(1) + '/5' : '-') + '</td>' +
            '<td>Actif</td></tr>';
    
    for (var i = 0; i < connectedUsers.length; i++) {
        var u = connectedUsers[i];
        if (u.wallet !== currentUser.wallet) {
            var uRatings = ratings.filter(function(r) { return r.userWallet === u.wallet; });
            var uAvg = 0;
            if (uRatings.length > 0) {
                uAvg = uRatings.reduce(function(a, r) { return a + r.rating; }, 0) / uRatings.length;
            }
            html += '<tr><td>' + escapeHtml(u.name) + '</td>' +
                    '<td>' + (u.wallet || 'Non connecte') + '</td>' +
                    '<td>' + (u.ticketCount || 0) + '</td>' +
                    '<td>' + (uAvg > 0 ? uAvg.toFixed(1) + '/5' : '-') + '</td>' +
                    '<td>' + (u.lastSeen || 'Inconnu') + '</td></tr>';
        }
    }
    html += '</table>';
    container.innerHTML = html;
}

// ===== ADMIN EVENTS =====

function renderAdminEvents() {
    var container = document.getElementById('adminEventsList');
    if (!container) return;
    
    if (events.length === 0) {
        container.innerHTML = '<p style="color: var(--gray); text-align:center; padding:20px;">Aucun evenement cree</p>';
        return;
    }
    
    container.innerHTML = events.map(function(e) {
        return '<div class="admin-event-item">' +
            '<div class="event-info">' +
                '<strong>' + escapeHtml(e.title) + '</strong>' +
                '<small>' + e.category + ' | ' + e.seatsLeft + '/' + e.seatsTotal + ' places | ' + new Date(e.date).toLocaleDateString('fr-FR') + '</small>' +
            '</div>' +
            '<div class="event-actions">' +
                '<button class="admin-delete-btn" onclick="adminDeleteEvent(\'' + e.id + '\')">Supprimer</button>' +
            '</div>' +
        '</div>';
    }).join('');
}

function adminDeleteEvent(id) {
    if (confirm('Supprimer cet evenement ?')) {
        events = events.filter(function(e) { return e.id !== id; });
        saveEvents();
        renderAdminEvents();
        renderEventsByCategory();
        document.getElementById('adminEventCount').innerText = events.length;
        addAdminLog('Evenement supprime', 'ID: ' + id);
        alert('Evenement supprime');
    }
}

function adminDeleteAllEvents() {
    if (confirm('Supprimer TOUS les evenements ? Cette action est irreversible.')) {
        events = [];
        saveEvents();
        renderAdminEvents();
        renderEventsByCategory();
        document.getElementById('adminEventCount').innerText = 0;
        addAdminLog('Tous les evenements supprimes', 'Suppression massive');
        alert('Tous les evenements ont ete supprimes');
    }
}

// ===== ADMIN SLIDES =====

function renderAdminSlides() {
    var container = document.getElementById('adminSlidesList');
    if (!container) return;
    
    if (heroSlides.length === 0) {
        container.innerHTML = '<p style="color: var(--gray); text-align:center; padding:20px;">Aucune image dans le carrousel</p>';
        return;
    }
    
    container.innerHTML = heroSlides.map(function(slide, index) {
        return '<div class="admin-slide-item">' +
            '<img src="' + slide.image + '" class="slide-preview" onerror="this.style.display=\'none\'">' +
            '<div class="slide-info">' +
                '<h4>' + escapeHtml(slide.title) + '</h4>' +
                '<p>' + (slide.badge || 'Sans categorie') + ' • ' + (slide.description || '') + '</p>' +
            '</div>' +
            '<div class="slide-actions">' +
                '<button class="edit-btn" onclick="adminEditSlide(' + index + ')">Modifier</button>' +
                '<button class="delete-btn" onclick="adminDeleteSlide(' + index + ')">Supprimer</button>' +
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
    var badgeInput = document.getElementById('adminSlideBadge');
    var titleInput = document.getElementById('adminSlideTitle');
    var descInput = document.getElementById('adminSlideDesc');
    var editIndex = document.getElementById('adminEditSlideIndex');
    
    preview.style.display = 'none';
    preview.src = '';
    uploadBox.classList.remove('has-image');
    imageInput.value = '';
    
    container.style.display = 'block';
    
    if (index >= 0 && index < heroSlides.length) {
        title.textContent = 'Modifier l\'image du carrousel';
        badgeInput.value = heroSlides[index].badge || '';
        titleInput.value = heroSlides[index].title || '';
        descInput.value = heroSlides[index].description || '';
        editIndex.value = index;
        if (heroSlides[index].image) {
            preview.src = heroSlides[index].image;
            preview.style.display = 'block';
            uploadBox.classList.add('has-image');
        }
    } else {
        title.textContent = 'Ajouter une image au carrousel';
        badgeInput.value = '';
        titleInput.value = '';
        descInput.value = '';
        editIndex.value = '-1';
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
        alert('Veuillez entrer un titre');
        return;
    }
    
    var imageData = null;
    if (imageInput.files && imageInput.files[0]) {
        var file = imageInput.files[0];
        if (!file.type.startsWith('image/')) {
            alert('Veuillez selectionner une image');
            return;
        }
        if (file.size > 5 * 1024 * 1024) {
            alert('L\'image est trop volumineuse (max 5MB)');
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
            alert('Veuillez selectionner une image');
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
    addAdminLog('Slide modifie', 'Titre: ' + title);
    alert('Image enregistree avec succes !');
}

function adminDeleteSlide(index) {
    if (!confirm('Supprimer cette image du carrousel ?')) return;
    var title = heroSlides[index]?.title || 'Sans titre';
    heroSlides.splice(index, 1);
    localStorage.setItem('betix_hero_slides', JSON.stringify(heroSlides));
    renderAdminSlides();
    initHeroSlider();
    addAdminLog('Slide supprime', 'Titre: ' + title);
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

// ===== ADMIN TABS =====

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
// ===== GESTION DU LOGO (5 clics pour Admin) =====
// ============================================================

function handleLogoClick() {
    logoClickCount++;
    console.log('Clics sur le logo:', logoClickCount);
    if (logoClickCount >= 5) {
        var password = prompt('Entrez le mot de passe administrateur:');
        if (password === adminPassword || password === 'Betix@2026#') {
            localStorage.setItem('betix_admin_password', password);
            adminPassword = password;
            
            var adminBtn = document.getElementById('adminMenuItem');
            if (adminBtn) {
                adminBtn.style.display = 'block';
                adminBtn.style.background = 'linear-gradient(135deg, #0D47A1, #1A73E8)';
                adminBtn.style.color = 'white';
            }
            
            addAdminLog('Authentification admin', 'Connexion via le logo');
            alert('Acces administrateur active !');
            logoClickCount = 0;
        } else if (password !== null) {
            alert('Mot de passe incorrect');
            logoClickCount = 0;
        } else {
            logoClickCount = 0;
        }
    }
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
        div.innerHTML = '<div class="hero-slide-bg" style="background-image: url(\'' + slide.image + '\');"></div><div class="hero-slide-content"><div class="hero-badge">' + (slide.badge || 'Evenement') + '</div><h2>' + slide.title + '</h2><p>' + (slide.description || '') + '</p></div>';
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
            autoPlayInterval = setInterval(nextSlide, 3000);
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
// ===== GESTION DES SLIDES (ancienne version) =====
// ============================================================

function renderSlidesManager() {
    var container = document.getElementById('slidesList');
    if (!container) return;
    
    if (heroSlides.length === 0) {
        container.innerHTML = '<p style="text-align:center;padding:2rem;color:var(--gray);">Aucun slide. Ajoutez-en un !</p>';
        return;
    }
    
    container.innerHTML = heroSlides.map(function(slide, index) {
        return '<div class="slide-item"><img src="' + slide.image + '" class="slide-preview" onerror="this.style.display=\'none\'"><div class="slide-info"><h4>' + slide.title + '</h4><p>' + (slide.badge || 'Sans categorie') + ' • ' + (slide.description || '') + '</p></div><div class="slide-actions"><button class="edit-btn" onclick="editSlide(' + index + ')">Modifier</button><button class="delete-btn" onclick="deleteSlide(' + index + ')">Supprimer</button></div></div>';
    }).join('');
}

function showSlideForm(index) {
    var container = document.getElementById('slideFormContainer');
    var title = document.getElementById('slideFormTitle');
    var imageInput = document.getElementById('slideImageUrl');
    var badgeInput = document.getElementById('slideBadge');
    var titleInput = document.getElementById('slideTitle');
    var descInput = document.getElementById('slideDesc');
    var editIndex = document.getElementById('editSlideIndex');
    
    container.style.display = 'block';
    
    if (index >= 0 && index < heroSlides.length) {
        title.textContent = 'Modifier le slide';
        imageInput.value = heroSlides[index].image || '';
        badgeInput.value = heroSlides[index].badge || '';
        titleInput.value = heroSlides[index].title || '';
        descInput.value = heroSlides[index].description || '';
        editIndex.value = index;
    } else {
        title.textContent = 'Ajouter un slide';
        imageInput.value = '';
        badgeInput.value = '';
        titleInput.value = '';
        descInput.value = '';
        editIndex.value = '-1';
    }
    
    container.scrollIntoView({ behavior: 'smooth' });
}

function saveSlide() {
    var imageInput = document.getElementById('slideImageUrl');
    var badgeInput = document.getElementById('slideBadge');
    var titleInput = document.getElementById('slideTitle');
    var descInput = document.getElementById('slideDesc');
    var editIndex = document.getElementById('editSlideIndex');
    
    var image = imageInput.value.trim();
    var badge = badgeInput.value.trim();
    var title = titleInput.value.trim();
    var description = descInput.value.trim();
    
    if (!image) {
        alert('Veuillez entrer une URL d\'image');
        return;
    }
    if (!title) {
        alert('Veuillez entrer un titre');
        return;
    }
    
    var slideData = { image: image, badge: badge, title: title, description: description };
    
    var index = parseInt(editIndex.value);
    if (index >= 0 && index < heroSlides.length) {
        heroSlides[index] = slideData;
    } else {
        heroSlides.push(slideData);
    }
    
    localStorage.setItem('betix_hero_slides', JSON.stringify(heroSlides));
    cancelSlideForm();
    renderSlidesManager();
    initHeroSlider();
    alert('Slide enregistre avec succes !');
}

function deleteSlide(index) {
    if (!confirm('Supprimer ce slide ?')) return;
    heroSlides.splice(index, 1);
    localStorage.setItem('betix_hero_slides', JSON.stringify(heroSlides));
    renderSlidesManager();
    initHeroSlider();
}

function editSlide(index) {
    showSlideForm(index);
}

function cancelSlideForm() {
    document.getElementById('slideFormContainer').style.display = 'none';
    document.getElementById('editSlideIndex').value = '-1';
}

// ============================================================
// ===== CREATION D'EVENEMENT =====
// ============================================================

function createEvent(e) {
    e.preventDefault();
    if (!currentUser.wallet) { alert('Connectez votre wallet d\'abord'); return; }
    
    var imageInputs = document.querySelectorAll('.image-input');
    var images = [];
    for (var i = 0; i < imageInputs.length; i++) {
        var input = imageInputs[i];
        if (input.dataset.imageData) {
            images.push(input.dataset.imageData);
        }
    }
    
    if (images.length < 2) { 
        alert('Veuillez ajouter au moins 2 photos pour votre evenement'); 
        return; 
    }
    
    var conditions = document.getElementById('eventConditions').value.trim();
    if (!conditions) {
        alert('Veuillez ajouter les conditions de participation');
        return;
    }
    
    var category = document.getElementById('eventCategory').value;
    var newEvent = {
        id: Date.now().toString(),
        title: document.getElementById('eventTitle').value,
        category: category,
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
        createdAt: new Date().toISOString(),
        boosts: 0
    };
    
    if (!newEvent.title || !newEvent.date || !newEvent.location || !newEvent.seatsTotal) { 
        alert('Veuillez remplir tous les champs requis'); 
        return; 
    }
    
    events.push(newEvent);
    saveEvents();
    document.getElementById('eventForm').reset();
    
    for (var i = 0; i < 5; i++) {
        var preview = document.getElementById('preview' + i);
        if (preview) {
            preview.style.display = 'none';
            preview.src = '';
        }
        var box = document.getElementById('uploadBox' + (i + 1));
        if (box) box.classList.remove('has-image');
        var input = document.querySelector('.image-input[data-index="' + i + '"]');
        if (input) {
            input.value = '';
            input.dataset.imageData = '';
        }
    }
    
    alert('Evenement cree avec ' + images.length + ' photos !');
    showPage('home');
}

// ============================================================
// ===== CONNEXION PI =====
// ============================================================

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

// ============================================================
// ===== ACHAT DE TICKET =====
// ============================================================

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
    if (!confirm('Booster "' + event.title + '" pour 0.001 Pi ?')) return;
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

// ============================================================
// ===== PROFIL =====
// ============================================================

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

// ============================================================
// ===== TICKETS ET HISTORIQUE =====
// ============================================================

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

// ============================================================
// ===== AUTRES FONCTIONS =====
// ============================================================

function handleImageUpload(input, index) {
    var file = input.files[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
        alert('Veuillez selectionner une image');
        input.value = '';
        return;
    }
    if (file.size > 5 * 1024 * 1024) {
        alert('L\'image est trop volumineuse (max 5MB)');
        input.value = '';
        return;
    }
    var reader = new FileReader();
    reader.onload = function(e) {
        var imageData = e.target.result;
        var preview = document.getElementById('preview' + index);
        if (preview) {
            preview.src = imageData;
            preview.style.display = 'block';
            var box = input.closest('.upload-box');
            if (box) box.classList.add('has-image');
        }
        input.dataset.imageData = imageData;
    };
    reader.readAsDataURL(file);
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
    if (logo) logo.addEventListener('click', function() { 
        clicks++; 
        if (clicks === 5) { 
            var pwd = prompt('Code admin:'); 
            if (pwd === adminPassword || pwd === 'Betix@2026#') { 
                localStorage.setItem('betix_admin_password', pwd);
                adminPassword = pwd;
                adminItem.style.display = 'block'; 
                adminItem.style.background = 'linear-gradient(135deg, #0D47A1, #1A73E8)';
                adminItem.style.color = 'white';
                addAdminLog('Authentification admin', 'Connexion via le logo');
                alert('Admin active'); 
            } 
            clicks = 0; 
        } 
        setTimeout(function() { clicks = 0; }, 2000); 
    });
    if (localStorage.getItem('betix_admin_password') === adminPassword || localStorage.getItem('betix_admin_password') === 'Betix@2026#') {
        adminItem.style.display = 'block';
        adminItem.style.background = 'linear-gradient(135deg, #0D47A1, #1A73E8)';
        adminItem.style.color = 'white';
    }
}

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
    function show(c) { content.innerHTML = c; modal.classList.add('show'); }
    if (close) close.onclick = function() { modal.classList.remove('show'); };
    window.onclick = function(e) { if (e.target === modal) modal.classList.remove('show'); };
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
        if (select) { select.style.width = '100%'; select.style.maxWidth = '320px'; select.style.padding = '10px'; select.style.fontSize = '14px'; select.style.background = 'var(--primary-gradient)'; select.style.color = 'white'; select.style.border = 'none'; select.style.borderRadius = '8px'; }
        var iframes = document.querySelectorAll('iframe');
        for (var i = 0; i < iframes.length; i++) { var iframe = iframes[i]; if (iframe.className === 'goog-te-banner-frame' || iframe.id === 'google_translate_frame') { iframe.style.display = 'none'; iframe.style.visibility = 'hidden'; iframe.style.height = '0px'; iframe.style.width = '0px'; } }
        document.body.style.top = '0px'; document.body.style.position = 'relative';
    }, 500);
}

// ============================================================
// ===== FAQ =====
// ============================================================

const faqData = [
    [
        { q: "Qu'est-ce que Betix ?", a: "Betix est la premiere plateforme de billetterie d'evenements decentralisee construite sur le reseau Pi Network." },
        { q: "Comment fonctionne Betix ?", a: "Betix utilise la blockchain Pi Network pour garantir la securite et la transparence des transactions." },
        { q: "Betix est-il gratuit ?", a: "Oui ! Betix est totalement gratuit pour les utilisateurs. Aucune commission sur les ventes." },
        { q: "Qui peut utiliser Betix ?", a: "Tout detenteur d'un compte Pi Network peut utiliser Betix." }
    ],
    [
        { q: "Comment acheter un billet ?", a: "Connectez-vous, parcourez les evenements, cliquez sur 'Acheter' et confirmez le paiement." },
        { q: "Les paiements sont-ils securises ?", a: "Oui, via le reseau Pi Network et le systeme d'escrow de Betix." },
        { q: "Puis-je obtenir un remboursement ?", a: "Oui en cas d'annulation, de report ou de fraude." },
        { q: "Ou sont stockes mes tickets ?", a: "Dans la section 'Mes tickets' de votre compte." }
    ],
    [
        { q: "Comment creer un evenement ?", a: "Connectez-vous, cliquez sur 'Creer un evenement' et remplissez le formulaire." },
        { q: "Conditions pour etre organisateur ?", a: "Avoir un compte Pi Network actif et respecter les conditions d'utilisation." },
        { q: "Modifier un evenement ?", a: "Oui, depuis la section 'Mes evenements' (disponible prochainement)." },
        { q: "Comment booster mon evenement ?", a: "En payant un petit montant en Pi pour augmenter la visibilite." }
    ],
    [
        { q: "Comment connecter mon wallet Pi ?", a: "Cliquez sur 'Connexion' dans le menu et autorisez l'acces." },
        { q: "Qu'est-ce que le systeme d'escrow ?", a: "Un mecanisme qui bloque les fonds jusqu'a la validation de l'evenement." },
        { q: "Transactions anonymes ?", a: "Les transactions sont tracables sur la blockchain, mais vos infos restent privees." },
        { q: "Autre crypto-monnaie ?", a: "Actuellement uniquement Pi Network." }
    ],
    [
        { q: "Protection des acheteurs ?", a: "Via l'escrow, la verification des organisateurs et une politique de remboursement." },
        { q: "Signaler un probleme ?", a: "Via le chat, l'email ou les reseaux sociaux." },
        { q: "Contacter le support ?", a: "Chat en ligne, email ou Telegram." },
        { q: "Langues disponibles ?", a: "Francais, Anglais, Portugais, Chinois, Indonesien." }
    ],
    [
        { q: "Rejoindre la communaute ?", a: "Suivez-nous sur Telegram, Twitter, Discord, Instagram." },
        { q: "Devenir ambassadeur ?", a: "Contactez-nous pour postuler au programme ambassadeur." },
        { q: "Devenir partenaire ?", a: "Contactez-nous pour discuter des opportunites de partenariat." },
        { q: "Projets futurs ?", a: "Application mobile, nouvelles crypto-monnaies, fonctionnalites sociales." }
    ]
];

let currentFaqPage = 0;

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
    console.log('Initialisation de la FAQ...');
    renderFaqPage(0);
    initFaqPagination();
}

// ============================================================
// ===== SHOW LEGAL =====
// ============================================================

function showLegal(type) {
    var modal = document.getElementById('legalModal');
    var content = document.getElementById('modalContent');
    var closeBtn = document.getElementById('legalModalClose');
    
    var texts = {
        privacy: '<h2>Politique de Confidentialite</h2><p>Betix s\'engage a proteger vos donnees personnelles.</p><p><strong>Contact :</strong> betixservices@gmail.com</p>',
        terms: '<h2>Conditions d\'Utilisation</h2><p>Les paiements en Pi sont irreversibles. Betix agit comme intermediaire de confiance.</p>',
        refund: '<h2>Politique de Remboursement</h2><p>Remboursement en cas d\'annulation, de report ou de fraude.</p>',
        support: '<h2>Support Client</h2><p>Email : betixservices@gmail.com<br>Chat en ligne<br>Telegram : @betix_support</p>',
        partner: '<h2>Devenir Partenaire</h2><p>Contactez-nous pour discuter des opportunites de partenariat.</p>',
        ambassador: '<h2>Programme Ambassadeur</h2><p>Contactez-nous pour postuler au programme ambassadeur.</p>'
    };
    
    if (content) {
        content.innerHTML = texts[type] || '<p>Informations en cours de redaction</p>';
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
// ===== RENDER EVENTS =====
// ============================================================

function renderEventsByCategory() {
    var container = document.getElementById('eventsByCategory');
    if (!container) return;
    var filtered = events.filter(function(e) { return (currentFilter === 'Tous' || e.category === currentFilter) && (e.title.toLowerCase().includes(searchQuery) || (e.location && e.location.toLowerCase().includes(searchQuery))); });
    if (filtered.length === 0) { container.innerHTML = '<p style="text-align:center;padding:2rem;">Aucun evenement</p>'; return; }
    if (currentFilter !== 'Tous') { container.innerHTML = '<div class="category-section"><div class="events-grid-centered">' + filtered.map(function(e) { return renderEventCard(e); }).join('') + '</div></div>'; return; }
    var cats = ['Concert', 'Sport', 'Conference', 'Formation', 'Cinema', 'Festival'];
    var html = '';
    for (var i = 0; i < cats.length; i++) {
        var cat = cats[i];
        var catEvents = filtered.filter(function(e) { return e.category === cat; });
        if (catEvents.length) html += '<div class="category-section"><div class="category-header">' + cat + '</div><div class="events-grid-centered">' + catEvents.map(function(e) { return renderEventCard(e); }).join('') + '</div></div>';
    }
    container.innerHTML = html;
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
        galleryHtml = '<div class="event-gallery-wrapper"><div class="event-gallery" onclick="event.stopPropagation();">';
        for (var i = 0; i < Math.min(event.images.length, 4); i++) {
            galleryHtml += '<img src="' + event.images[i] + '" class="event-gallery-img" onclick="event.stopPropagation(); openGallery(\'' + event.id + '\', ' + i + ')">';
        }
        if (event.images.length > 4) { 
            galleryHtml += '<div class="event-gallery-img" style="background:#e5e7eb;display:flex;align-items:center;justify-content:center;font-size:0.8rem;flex-shrink:0;">+' + (event.images.length - 4) + '</div>'; 
        }
        galleryHtml += '</div></div>';
    } else {
        galleryHtml = '<div class="event-gallery-wrapper"><div class="event-gallery" onclick="event.stopPropagation();"><img src="' + eventImagesList[event.category] + '" class="event-gallery-img" style="width:100%;height:160px;" onclick="event.stopPropagation(); openGallery(\'' + event.id + '\', 0)"></div></div>';
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
        ratingButtonHtml = '<button class="rating-btn" onclick="event.stopPropagation(); openRatingModal(\'' + event.id + '\', \'' + escapeHtml(event.title) + '\')">Noter cet evenement</button>';
    } else if (hasRated) {
        ratingButtonHtml = '<div class="rated-badge" onclick="event.stopPropagation();">Vous avez note ' + (userRating ? userRating.rating : '') + '/5</div>';
    }
    
    return '<div class="event-card" onclick="openEventDetails(\'' + event.id + '\')">' +
        '<span class="event-detail-hint">Voir les details</span>' +
        galleryHtml +
        '<div class="event-info">' +
            '<div class="event-title">' + escapeHtml(event.title) + '</div>' +
            '<div class="event-meta">' +
                '<div class="event-meta-item"> ' + dateFormatted + ' a ' + timeFormatted + '</div>' +
                '<div class="event-meta-item"> ' + escapeHtml(event.location || 'En ligne') + '</div>' +
            '</div>' +
            (descriptionShort ? '<div class="event-description">' + escapeHtml(descriptionShort) + '</div>' : '') +
            '<div class="event-stats">' + ratingHtml + '<span class="boost-count"> ' + (event.boosts || 0) + ' boosts</span></div>' +
            '<div class="event-footer">' +
                '<div class="event-price">' + event.price + ' Pi</div>' +
                '<div class="event-seats"> ' + event.seatsLeft + '/' + event.seatsTotal + ' places</div>' +
                '<button class="buy-btn" onclick="event.stopPropagation(); buyTicket(\'' + event.id + '\')">Acheter</button>' +
                ratingButtonHtml +
            '</div>' +
        '</div>' +
    '</div>';
}

// ============================================================
// ===== OPEN EVENT DETAILS =====
// ============================================================

function openEventDetails(eventId) {
    var event = events.find(function(e) { return e.id === eventId; });
    if (!event) {
        alert('Evenement non trouve');
        return;
    }
    
    var modal = document.getElementById('eventDetailModal');
    var closeBtn = document.getElementById('eventDetailClose');
    
    document.getElementById('detailTitle').textContent = event.title;
    document.getElementById('detailCategory').textContent = event.category;
    
    var dateEvent = new Date(event.date);
    document.getElementById('detailDate').textContent = dateEvent.toLocaleDateString('fr-FR') + ' a ' + dateEvent.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
    document.getElementById('detailLocation').textContent = event.location || 'En ligne';
    document.getElementById('detailPrice').textContent = event.price + ' Pi';
    document.getElementById('detailSeats').textContent = event.seatsLeft + '/' + event.seatsTotal + ' places';
    document.getElementById('detailDescription').textContent = event.description || 'Aucune description';
    document.getElementById('detailOrganizer').textContent = event.organizer || 'Inconnu';
    document.getElementById('detailCreated').textContent = new Date(event.createdAt).toLocaleDateString('fr-FR');
    document.getElementById('detailBoosts').textContent = event.boosts || 0;
    
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
            conditionsContainer.innerHTML = '<p style="color: var(--gray);">Aucune condition specifiee</p>';
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
    document.getElementById('detailRating').textContent = eventRatings.length > 0 ? ratingStars + ' ' + avgRating.toFixed(1) + ' (' + eventRatings.length + ' avis)' : 'Pas encore note';
    
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
                           '<div class="review-date">' + new Date(r.date).toLocaleDateString('fr-FR') + '</div>';
            reviewsContainer.appendChild(div);
        });
    } else {
        reviewsContainer.innerHTML = '<p style="color: var(--gray); font-size: 0.9rem;">Aucun avis pour le moment</p>';
    }
    
    document.getElementById('detailBuyBtn').onclick = function() {
        modal.classList.remove('show');
        document.body.style.overflow = '';
        buyTicket(event.id);
    };
    
    document.getElementById('detailBoostBtn').onclick = function() {
        modal.classList.remove('show');
        document.body.style.overflow = '';
        boostEvent(event.id);
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
// ===== OPEN GALLERY =====
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

// ============================================================
// ===== INIT FILTERS =====
// ============================================================

function initFilters() {
    var cats = ['Tous', 'Concert', 'Sport', 'Conference', 'Formation', 'Cinema', 'Festival'];
    var container = document.getElementById('filtersContainer');
    if (!container) return;
    container.innerHTML = cats.map(function(c) { return '<div class="filter-chip ' + (c === currentFilter ? 'active' : '') + '" data-category="' + c + '">' + c + '</div>'; }).join('');
    var chips = document.querySelectorAll('.filter-chip');
    for (var i = 0; i < chips.length; i++) { chips[i].addEventListener('click', function() { currentFilter = this.dataset.category; initFilters(); renderEventsByCategory(); }); }
}

// ============================================================
// ===== INITIALISATION PRINCIPALE =====
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
    
    if (!events.length) { events = JSON.parse(JSON.stringify(demoEvents)); saveEvents(); }
    calculateLoyaltyPoints();
    initFilters(); renderEventsByCategory(); updateUserInfo(); updateProfilePage(); initAdmin(); initChat(); initLegalModals();
    
    var dark = document.getElementById('darkModeToggle');
    if (localStorage.getItem('darkMode') === 'true') { if (dark) dark.checked = true; document.body.classList.add('dark-mode'); }
    if (dark) dark.addEventListener('change', toggleDarkMode);
    
    initHeroSlider();
    initFaq();
    renderAdminLogs();
    
    // Vérifier si l'admin est déjà connecté
    var storedPassword = localStorage.getItem('betix_admin_password');
    if (storedPassword === adminPassword || storedPassword === 'Betix@2026#') {
        var adminBtn = document.getElementById('adminMenuItem');
        if (adminBtn) {
            adminBtn.style.display = 'block';
            adminBtn.style.background = 'linear-gradient(135deg, #0D47A1, #1A73E8)';
            adminBtn.style.color = 'white';
        }
        if (document.getElementById('adminPage') && document.getElementById('adminPage').style.display !== 'none') {
            startAdminSession();
        }
    }
    
    // ===== GESTION DU LOGO LANGUE =====
    var langLogo = document.querySelector('.sidebar-lang-logo');
    var langSelector = document.getElementById('sidebarLangSelector');
    if (langLogo && langSelector) {
        langLogo.addEventListener('click', function() {
            if (langSelector.style.display === 'block') {
                langSelector.style.display = 'none';
            } else {
                langSelector.style.display = 'block';
                setTimeout(function() {
                    langSelector.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }, 100);
            }
        });
    }
    
    var menuBtn = document.getElementById('menuBtn');
    var closeSidebarBtn = document.getElementById('closeSidebarBtn');
    var overlay = document.getElementById('overlay');
    var sidebarWalletBtn = document.getElementById('sidebarWalletBtn');
    var profileConnectBtn = document.getElementById('profileConnectBtn');
    var eventForm = document.getElementById('eventForm');
    var searchInput = document.getElementById('searchInput');
    var clearDataBtn = document.getElementById('clearDataBtn');
    var logoutBtn = document.getElementById('logoutBtn');
    var backBtn = document.getElementById('backBtn');
    
    var addSlideBtn = document.getElementById('addSlideBtn');
    var saveSlideBtn = document.getElementById('saveSlideBtn');
    var cancelSlideBtn = document.getElementById('cancelSlideBtn');
    
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
    
    if (addSlideBtn) addSlideBtn.addEventListener('click', function() { showSlideForm(-1); });
    if (saveSlideBtn) saveSlideBtn.addEventListener('click', saveSlide);
    if (cancelSlideBtn) cancelSlideBtn.addEventListener('click', cancelSlideForm);
    
    if (menuBtn) menuBtn.addEventListener('click', openSidebar);
    if (closeSidebarBtn) closeSidebarBtn.addEventListener('click', closeSidebar);
    if (overlay) overlay.addEventListener('click', closeSidebar);
    if (sidebarWalletBtn) sidebarWalletBtn.addEventListener('click', connectToPi);
    if (profileConnectBtn) profileConnectBtn.addEventListener('click', connectToPi);
    if (eventForm) eventForm.addEventListener('submit', createEvent);
    if (searchInput) searchInput.addEventListener('input', function(e) { searchQuery = e.target.value.toLowerCase(); renderEventsByCategory(); });
    if (clearDataBtn) clearDataBtn.addEventListener('click', clearAllData);
    if (logoutBtn) logoutBtn.addEventListener('click', logout);
    if (backBtn) backBtn.addEventListener('click', goBack);
    
    var detailModal = document.getElementById('eventDetailModal');
    if (detailModal) {
        var observerModal = new MutationObserver(function() {
            if (!detailModal.classList.contains('show')) {
                document.body.style.overflow = '';
            }
        });
        observerModal.observe(detailModal, { attributes: true, attributeFilter: ['class'] });
    }
    
    var imageInputs = document.querySelectorAll('.image-input');
    for (var i = 0; i < imageInputs.length; i++) {
        var input = imageInputs[i];
        var index = parseInt(input.dataset.index);
        input.addEventListener('change', function() { handleImageUpload(this, index); });
        var box = document.getElementById('uploadBox' + (index + 1));
        if (box) {
            box.addEventListener('click', function(e) {
                if (e.target.tagName !== 'INPUT') {
                    input.click();
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
    
    if (currentUser.wallet && isSessionExpired()) { logout(); }
});

console.log('✅ Betix charge avec succes !');
console.log('🔐 Admin: 5 clics sur le logo + mot de passe Betix@2026#');
console.log('📋 Journal des connexions admin actif');
console.log('⏱️ Session admin: 30 minutes d\'inactivite');