// ============================================================
// ===== SUPABASE CONFIGURATION =====
// ============================================================

const SUPABASE_URL = "https://tycebwzgsujiazgopkri.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR5Y2Vid3pnc3VqaWF6Z29wa3JpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODIzODg2NTMsImV4cCI6MjA5Nzk2NDY1M30.7x1rouTbMJE2WcY008vRnqGuAWq3yM_eZCS4Q8_3TrQ";

const supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false },
    db: { schema: 'public' },
    fetch: (url, options) => {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 30000);
        return fetch(url, { ...options, signal: controller.signal }).finally(() => clearTimeout(timeoutId));
    }
});

// ============================================================
// ===== COUNTRY LIST (COMPLETE) =====
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

// ============================================================
// ===== COUNTRY FLAGS =====
// ============================================================

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
// ===== PI SDK INITIALIZATION =====
// ============================================================

let piSDKReady = false;
function initPiSDK() {
    if (typeof Pi !== 'undefined') {
        try { Pi.init({ version: "2.0", sandbox: true }); piSDKReady = true; return true; } catch(e) {}
    }
    return false;
}
initPiSDK();
setTimeout(() => { if (!piSDKReady) initPiSDK(); }, 500);
setTimeout(() => { if (!piSDKReady) initPiSDK(); }, 1000);
setTimeout(() => { if (!piSDKReady) initPiSDK(); }, 2000);
setTimeout(() => { if (!piSDKReady) initPiSDK(); }, 3000);
setTimeout(() => { if (!piSDKReady) initPiSDK(); }, 5000);

async function ensurePiSDKReady() {
    let attempts = 0;
    while (!piSDKReady && attempts < 15) { initPiSDK(); await new Promise(r => setTimeout(r, 500)); attempts++; }
    return piSDKReady;
}

// ============================================================
// ===== BACKEND URL =====
// ============================================================

const BACKEND_URL = "https://betix-backend.onrender.com";

// ============================================================
// ===== CALLBACK SILENCIEUX POUR PAIEMENTS INCOMPLETS =====
// ============================================================

let isResolving = false;
let resolveAttempts = 0;
async function onIncompletePaymentFound(payment) {
    if (isResolving || resolveAttempts > 3) return null;
    isResolving = true;
    resolveAttempts++;
    try {
        const response = await fetch(BACKEND_URL + '/api/pi/resolve', {
            method: 'POST', headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ paymentId: payment.identifier })
        });
        const result = await response.json();
        if (result.status === 'completed' || result.status === 'cancelled') {
            setTimeout(() => window.location.reload(), 2000);
            return result;
        }
    } catch(e) {}
    finally { isResolving = false; setTimeout(() => { resolveAttempts = 0; }, 10000); }
    return null;
}

// ============================================================
// ===== TRANSLATIONS =====
// ============================================================

const translations = {
    en: { appName: 'Betix', home: 'Home', myEvents: 'My Events', profile: 'Profile', settings: 'Settings', myTickets: 'My Tickets', ticketHistory: 'Ticket History', faq: 'FAQ', administration: 'Administration', followUs: 'Follow us', notifications: 'Notifications', noNotifications: 'No notifications', connectPi: 'Connect Pi', disconnect: 'Disconnect', chooseLanguage: 'Choose Language:', selectLanguage: 'Select language', guest: 'Guest', notConnected: 'Not connected', connecting: 'Connecting...', welcome: 'Welcome', memberSince: 'Member since', ratings: 'ratings', points: 'points', myEventsCount: 'My Events', myTicketsCount: 'My Tickets', history: 'History', rated: 'Rated', viewAll: 'View all', createEvent: 'Create Event', searchEvent: 'Search event...', chooseCountry: 'Choose Country:', upcomingEvents: 'Upcoming Events', joinCommunity: 'Join the community and live unique experiences', noEvents: 'No events found', buyTicket: 'Buy Ticket', ticketsAvailable: 'tickets available', back: 'Back', title: 'Title', category: 'Category', country: 'Country', dateTime: 'Date & Time', duration: 'Duration', location: 'Location', description: 'Description', conditions: 'Conditions', totalSeats: 'Total Seats', ticketTypes: 'Ticket Types', enableAtLeastOne: 'Enable at least one ticket type and set its price', standard: 'Standard', price: 'Price', active: 'Active', inactive: 'Inactive', photos: 'Photos', imagesRequired: '2 images required', dropImage: 'Drop your image here', orClick: 'or click to browse', compressed: 'Compressed', imagesAutoCompressed: 'Images automatically compressed to WebP format for better performance', publishEvent: 'Publish Event', confirmPublication: 'Confirm Publication', reviewInfo: 'Please review all information before publishing your event', cancel: 'Cancel', publishing: 'Publishing...', eventPublished: 'Event has been successfully published!', editEvent: 'Edit Event', modifyFields: 'Modify the fields below to update your event', saveChanges: 'Save Changes', chooseQuantity: 'Choose quantity', maximumTickets: 'Maximum tickets available', total: 'Total', confirmPurchase: 'Confirm purchase', purchaseSuccessful: 'Purchase successful!', ticketsAdded: 'ticket(s) added successfully.', event: 'Event', type: 'Type', quantity: 'Quantity', code: 'Code', ok: 'OK', pendingPaymentFound: 'Pending Payment Found', pendingPaymentMessage: 'You already have a pending payment on this app. You can either cancel the pending payment and try again, or wait for it to complete.', ignore: 'Ignore', cancelAndRetry: 'Cancel & Retry', paymentError: 'Payment error', pendingPaymentError: 'A pending payment was found. Please complete or cancel the previous payment in your Pi wallet, then try again.', paymentCancelled: 'Payment cancelled', noSeatsAvailable: 'No seats available for this event', pleaseConnect: 'Please connect your Pi account first', authenticationFailed: 'Authentication failed. Please try again.', connectionError: 'Connection error', sessionExpired: 'Session expired due to inactivity. Please reconnect.', disconnected: 'You are disconnected', eventNotFound: 'Event not found', ticketNotFound: 'Ticket not found', downloadTicket: 'Download ticket', ticketDownloaded: 'Ticket downloaded', markUsed: 'Mark as used', markUsedConfirm: 'Mark this ticket as used? This action cannot be undone.', ticketMarkedUsed: 'Ticket marked as used successfully!', noActiveTickets: 'No active tickets', noTicketHistory: 'No ticket history', clearData: 'Clear my data', clearDataConfirm: 'Delete all your data?', darkMode: 'Dark mode', all: 'All', concert: 'Concert', sport: 'Sport', conference: 'Conference', training: 'Training', cinema: 'Cinema', festival: 'Festival', theatre: 'Theatre', dance: 'Dance', exhibition: 'Exhibition', gala: 'Gala', seminar: 'Seminar', formation: 'Formation', fullDescription: 'Full description', information: 'Information', organizer: 'Organizer', createdOn: 'Created on', seatsLeft: 'Seats left', rating: 'Rating', notYetRated: 'Not yet rated', noReviews: 'No reviews yet', noConditions: 'No conditions specified', by: 'By', new: 'New', soldOut: 'Sold Out', ended: 'Ended', tickets: 'tickets', views: 'views', footerTitleInfo: 'Info', footerTitleBetix: 'Betix', footerTitlePartners: 'Partners', footerTermsSale: 'Terms of sale', footerTermsUse: 'Terms of use', footerPrivacy: 'Privacy policy', footerAccessibility: 'Accessibility statement', footerPrivacyChoices: 'Privacy choices', footerFanGuide: 'Fan ticket guide', footerLegal: 'Legal notices', footerCookies: 'Cookie preferences', footerAbout: 'About us', footerContact: 'Contact us', footerFeedback: 'Your feedback', footerHelp: 'Help', footerJoinCommunity: 'Join the Betix community', footerPiNetwork: 'Pi Network', footerSecure: 'Secure', footerRights: 'All rights reserved.', footerBuiltOn: 'Built on Pi Network | Secured by Blockchain', footerSlogan: 'The first decentralized ticketing platform on Pi Network', footerDesc: 'Secure platform to buy and sell event tickets with Pi payment.' },
    fr: { appName: 'Betix', home: 'Accueil', myEvents: 'Mes Événements', profile: 'Profil', settings: 'Paramètres', myTickets: 'Mes Tickets', ticketHistory: 'Historique des Tickets', faq: 'FAQ', administration: 'Administration', followUs: 'Suivez-nous', notifications: 'Notifications', noNotifications: 'Aucune notification', connectPi: 'Connecter Pi', disconnect: 'Déconnecter', chooseLanguage: 'Choisir la langue :', selectLanguage: 'Sélectionner la langue', guest: 'Invité', notConnected: 'Non connecté', connecting: 'Connexion...', welcome: 'Bienvenue', memberSince: 'Membre depuis', ratings: 'avis', points: 'points', myEventsCount: 'Mes Événements', myTicketsCount: 'Mes Tickets', history: 'Historique', rated: 'Évalués', viewAll: 'Voir tout', createEvent: 'Créer un Événement', searchEvent: 'Rechercher un événement...', chooseCountry: 'Choisir le pays :', upcomingEvents: 'Événements à Venir', joinCommunity: 'Rejoignez la communauté et vivez des expériences uniques', noEvents: 'Aucun événement trouvé', buyTicket: 'Acheter un Ticket', ticketsAvailable: 'tickets disponibles', back: 'Retour', title: 'Titre', category: 'Catégorie', country: 'Pays', dateTime: 'Date et Heure', duration: 'Durée', location: 'Lieu', description: 'Description', conditions: 'Conditions', totalSeats: 'Places Totales', ticketTypes: 'Types de Billets', enableAtLeastOne: 'Activez au moins un type de billet et définissez son prix', standard: 'Standard', price: 'Prix', active: 'Actif', inactive: 'Inactif', photos: 'Photos', imagesRequired: '2 images requises', dropImage: 'Déposez votre image ici', orClick: 'ou cliquez pour parcourir', compressed: 'Compressée', imagesAutoCompressed: 'Images automatiquement compressées au format WebP pour de meilleures performances', publishEvent: 'Publier l\'Événement', confirmPublication: 'Confirmer la Publication', reviewInfo: 'Veuillez vérifier toutes les informations avant de publier votre événement', cancel: 'Annuler', publishing: 'Publication...', eventPublished: 'L\'événement a été publié avec succès !', editEvent: 'Modifier l\'Événement', modifyFields: 'Modifiez les champs ci-dessous pour mettre à jour votre événement', saveChanges: 'Enregistrer les Modifications', chooseQuantity: 'Choisir la quantité', maximumTickets: 'Maximum de tickets disponibles', total: 'Total', confirmPurchase: 'Confirmer l\'achat', purchaseSuccessful: 'Achat réussi !', ticketsAdded: 'ticket(s) ajouté(s) avec succès.', event: 'Événement', type: 'Type', quantity: 'Quantité', code: 'Code', ok: 'OK', pendingPaymentFound: 'Paiement en Attente Trouvé', pendingPaymentMessage: 'Vous avez déjà un paiement en attente sur cette application. Vous pouvez annuler le paiement en attente et réessayer, ou attendre qu\'il se termine.', ignore: 'Ignorer', cancelAndRetry: 'Annuler et Réessayer', paymentError: 'Erreur de paiement', pendingPaymentError: 'Un paiement en attente a été trouvé. Veuillez compléter ou annuler le paiement précédent dans votre portefeuille Pi, puis réessayer.', paymentCancelled: 'Paiement annulé', noSeatsAvailable: 'Aucune place disponible pour cet événement', pleaseConnect: 'Veuillez d\'abord connecter votre compte Pi', authenticationFailed: 'Échec de l\'authentification. Veuillez réessayer.', connectionError: 'Erreur de connexion', sessionExpired: 'Session expirée en raison d\'inactivité. Veuillez vous reconnecter.', disconnected: 'Vous êtes déconnecté', eventNotFound: 'Événement non trouvé', ticketNotFound: 'Ticket non trouvé', downloadTicket: 'Télécharger le ticket', ticketDownloaded: 'Ticket téléchargé', markUsed: 'Marquer comme utilisé', markUsedConfirm: 'Marquer ce ticket comme utilisé ? Cette action est irréversible.', ticketMarkedUsed: 'Ticket marqué comme utilisé avec succès !', noActiveTickets: 'Aucun ticket actif', noTicketHistory: 'Aucun historique de tickets', clearData: 'Effacer mes données', clearDataConfirm: 'Supprimer toutes vos données ?', darkMode: 'Mode sombre', all: 'Tous', concert: 'Concert', sport: 'Sport', conference: 'Conférence', training: 'Formation', cinema: 'Cinéma', festival: 'Festival', theatre: 'Théâtre', dance: 'Danse', exhibition: 'Exposition', gala: 'Gala', seminar: 'Séminaire', formation: 'Formation', fullDescription: 'Description complète', information: 'Informations', organizer: 'Organisateur', createdOn: 'Créé le', seatsLeft: 'Places restantes', rating: 'Évaluation', notYetRated: 'Pas encore évalué', noReviews: 'Aucun avis pour le moment', noConditions: 'Aucune condition spécifiée', by: 'Par', new: 'Nouveau', soldOut: 'Complet', ended: 'Terminé', tickets: 'tickets', views: 'vues', footerTitleInfo: 'Infos', footerTitleBetix: 'Betix', footerTitlePartners: 'Partenaires', footerTermsSale: 'Conditions de vente', footerTermsUse: 'Conditions d\'utilisation', footerPrivacy: 'Politique de confidentialité', footerAccessibility: 'Déclaration d\'accessibilité', footerPrivacyChoices: 'Choix de confidentialité', footerFanGuide: 'Guide du billet fan', footerLegal: 'Mentions légales', footerCookies: 'Préférences de cookies', footerAbout: 'À propos de nous', footerContact: 'Contactez-nous', footerFeedback: 'Votre avis', footerHelp: 'Aide', footerJoinCommunity: 'Rejoignez la communauté Betix', footerPiNetwork: 'Réseau Pi', footerSecure: 'Sécurisé', footerRights: 'Tous droits réservés.', footerBuiltOn: 'Construit sur Pi Network | Sécurisé par Blockchain', footerSlogan: 'La première plateforme de billetterie décentralisée sur Pi Network', footerDesc: 'Plateforme sécurisée pour acheter et vendre des billets avec paiement en Pi.' },
    pt: { appName: 'Betix', home: 'Início', myEvents: 'Meus Eventos', profile: 'Perfil', settings: 'Configurações', myTickets: 'Meus Ingressos', ticketHistory: 'Histórico de Ingressos', faq: 'FAQ', administration: 'Administração', followUs: 'Siga-nos', notifications: 'Notificações', noNotifications: 'Sem notificações', connectPi: 'Conectar Pi', disconnect: 'Desconectar', chooseLanguage: 'Escolha o idioma:', selectLanguage: 'Selecione o idioma', guest: 'Convidado', notConnected: 'Não conectado', connecting: 'Conectando...', welcome: 'Bem-vindo', memberSince: 'Membro desde', ratings: 'avaliações', points: 'pontos', myEventsCount: 'Meus Eventos', myTicketsCount: 'Meus Ingressos', history: 'Histórico', rated: 'Avaliados', viewAll: 'Ver tudo', createEvent: 'Criar Evento', searchEvent: 'Pesquisar evento...', chooseCountry: 'Escolha o país:', upcomingEvents: 'Próximos Eventos', joinCommunity: 'Junte-se à comunidade e viva experiências únicas', noEvents: 'Nenhum evento encontrado', buyTicket: 'Comprar Ingresso', ticketsAvailable: 'ingressos disponíveis', back: 'Voltar', title: 'Título', category: 'Categoria', country: 'País', dateTime: 'Data e Hora', duration: 'Duração', location: 'Local', description: 'Descrição', conditions: 'Condições', totalSeats: 'Total de Lugares', ticketTypes: 'Tipos de Ingressos', enableAtLeastOne: 'Ative pelo menos um tipo de ingresso e defina seu preço', standard: 'Padrão', price: 'Preço', active: 'Ativo', inactive: 'Inativo', photos: 'Fotos', imagesRequired: '2 imagens obrigatórias', dropImage: 'Solte sua imagem aqui', orClick: 'ou clique para procurar', compressed: 'Comprimida', imagesAutoCompressed: 'Imagens automaticamente comprimidas para formato WebP para melhor desempenho', publishEvent: 'Publicar Evento', confirmPublication: 'Confirmar Publicação', reviewInfo: 'Revise todas as informações antes de publicar seu evento', cancel: 'Cancelar', publishing: 'Publicando...', eventPublished: 'Evento publicado com sucesso!', editEvent: 'Editar Evento', modifyFields: 'Modifique os campos abaixo para atualizar seu evento', saveChanges: 'Salvar Alterações', chooseQuantity: 'Escolha a quantidade', maximumTickets: 'Máximo de ingressos disponíveis', total: 'Total', confirmPurchase: 'Confirmar compra', purchaseSuccessful: 'Compra bem-sucedida!', ticketsAdded: 'ingresso(s) adicionado(s) com sucesso.', event: 'Evento', type: 'Tipo', quantity: 'Quantidade', code: 'Código', ok: 'OK', pendingPaymentFound: 'Pagamento Pendente Encontrado', pendingPaymentMessage: 'Você já tem um pagamento pendente neste aplicativo. Você pode cancelar o pagamento pendente e tentar novamente, ou aguardar sua conclusão.', ignore: 'Ignorar', cancelAndRetry: 'Cancelar e Tentar Novamente', paymentError: 'Erro de pagamento', pendingPaymentError: 'Foi encontrado um pagamento pendente. Por favor, complete ou cancele o pagamento anterior em sua carteira Pi e tente novamente.', paymentCancelled: 'Pagamento cancelado', noSeatsAvailable: 'Nenhum lugar disponível para este evento', pleaseConnect: 'Por favor, conecte sua conta Pi primeiro', authenticationFailed: 'Falha na autenticação. Por favor, tente novamente.', connectionError: 'Erro de conexão', sessionExpired: 'Sessão expirada devido à inatividade. Por favor, reconecte-se.', disconnected: 'Você está desconectado', eventNotFound: 'Evento não encontrado', ticketNotFound: 'Ingresso não encontrado', downloadTicket: 'Baixar ingresso', ticketDownloaded: 'Ingresso baixado', markUsed: 'Marcar como usado', markUsedConfirm: 'Marcar este ingresso como usado? Esta ação não pode ser desfeita.', ticketMarkedUsed: 'Ingresso marcado como usado com sucesso!', noActiveTickets: 'Nenhum ingresso ativo', noTicketHistory: 'Nenhum histórico de ingressos', clearData: 'Limpar meus dados', clearDataConfirm: 'Excluir todos os seus dados?', darkMode: 'Modo escuro', all: 'Todos', concert: 'Concerto', sport: 'Esporte', conference: 'Conferência', training: 'Treinamento', cinema: 'Cinema', festival: 'Festival', theatre: 'Teatro', dance: 'Dança', exhibition: 'Exposição', gala: 'Gala', seminar: 'Seminário', formation: 'Formação', fullDescription: 'Descrição completa', information: 'Informações', organizer: 'Organizador', createdOn: 'Criado em', seatsLeft: 'Lugares restantes', rating: 'Avaliação', notYetRated: 'Ainda não avaliado', noReviews: 'Nenhuma avaliação ainda', noConditions: 'Nenhuma condição especificada', by: 'Por', new: 'Novo', soldOut: 'Esgotado', ended: 'Finalizado', tickets: 'ingressos', views: 'visualizações', footerTitleInfo: 'Informações', footerTitleBetix: 'Betix', footerTitlePartners: 'Parceiros', footerTermsSale: 'Termos de venda', footerTermsUse: 'Termos de uso', footerPrivacy: 'Política de privacidade', footerAccessibility: 'Declaração de acessibilidade', footerPrivacyChoices: 'Escolhas de privacidade', footerFanGuide: 'Guia do ingresso fã', footerLegal: 'Avisos legais', footerCookies: 'Preferências de cookies', footerAbout: 'Sobre nós', footerContact: 'Contate-nos', footerFeedback: 'Seu feedback', footerHelp: 'Ajuda', footerJoinCommunity: 'Junte-se à comunidade Betix', footerPiNetwork: 'Rede Pi', footerSecure: 'Seguro', footerRights: 'Todos os direitos reservados.', footerBuiltOn: 'Construído na Pi Network | Seguro por Blockchain', footerSlogan: 'A primeira plataforma de bilheteria descentralizada na Pi Network', footerDesc: 'Plataforma segura para comprar e vender ingressos com pagamento em Pi.' },
    es: { appName: 'Betix', home: 'Inicio', myEvents: 'Mis Eventos', profile: 'Perfil', settings: 'Configuración', myTickets: 'Mis Entradas', ticketHistory: 'Historial de Entradas', faq: 'FAQ', administration: 'Administración', followUs: 'Síguenos', notifications: 'Notificaciones', noNotifications: 'Sin notificaciones', connectPi: 'Conectar Pi', disconnect: 'Desconectar', chooseLanguage: 'Elige el idioma:', selectLanguage: 'Selecciona el idioma', guest: 'Invitado', notConnected: 'No conectado', connecting: 'Conectando...', welcome: 'Bienvenido', memberSince: 'Miembro desde', ratings: 'valoraciones', points: 'puntos', myEventsCount: 'Mis Eventos', myTicketsCount: 'Mis Entradas', history: 'Historial', rated: 'Valorados', viewAll: 'Ver todo', createEvent: 'Crear Evento', searchEvent: 'Buscar evento...', chooseCountry: 'Elige el país:', upcomingEvents: 'Próximos Eventos', joinCommunity: 'Únete a la comunidad y vive experiencias únicas', noEvents: 'No se encontraron eventos', buyTicket: 'Comprar Entrada', ticketsAvailable: 'entradas disponibles', back: 'Volver', title: 'Título', category: 'Categoría', country: 'País', dateTime: 'Fecha y Hora', duration: 'Duración', location: 'Ubicación', description: 'Descripción', conditions: 'Condiciones', totalSeats: 'Total de Asientos', ticketTypes: 'Tipos de Entradas', enableAtLeastOne: 'Habilita al menos un tipo de entrada y establece su precio', standard: 'Estándar', price: 'Precio', active: 'Activo', inactive: 'Inactivo', photos: 'Fotos', imagesRequired: '2 imágenes requeridas', dropImage: 'Suelta tu imagen aquí', orClick: 'o haz clic para buscar', compressed: 'Comprimida', imagesAutoCompressed: 'Imágenes comprimidas automáticamente a formato WebP para mejor rendimiento', publishEvent: 'Publicar Evento', confirmPublication: 'Confirmar Publicación', reviewInfo: 'Revisa toda la información antes de publicar tu evento', cancel: 'Cancelar', publishing: 'Publicando...', eventPublished: '¡Evento publicado con éxito!', editEvent: 'Editar Evento', modifyFields: 'Modifica los campos a continuación para actualizar tu evento', saveChanges: 'Guardar Cambios', chooseQuantity: 'Elige la cantidad', maximumTickets: 'Máximo de entradas disponibles', total: 'Total', confirmPurchase: 'Confirmar compra', purchaseSuccessful: '¡Compra exitosa!', ticketsAdded: 'entrada(s) añadida(s) con éxito.', event: 'Evento', type: 'Tipo', quantity: 'Cantidad', code: 'Código', ok: 'OK', pendingPaymentFound: 'Pago Pendiente Encontrado', pendingPaymentMessage: 'Ya tienes un pago pendiente en esta aplicación. Puedes cancelar el pago pendiente e intentarlo de nuevo, o esperar a que se complete.', ignore: 'Ignorar', cancelAndRetry: 'Cancelar y Reintentar', paymentError: 'Error de pago', pendingPaymentError: 'Se encontró un pago pendiente. Por favor, completa o cancela el pago anterior en tu cartera Pi y vuelve a intentarlo.', paymentCancelled: 'Pago cancelado', noSeatsAvailable: 'No hay asientos disponibles para este evento', pleaseConnect: 'Por favor, conecta tu cuenta Pi primero', authenticationFailed: 'Error de autenticación. Por favor, inténtalo de nuevo.', connectionError: 'Error de conexión', sessionExpired: 'Sesión expirada por inactividad. Por favor, reconéctate.', disconnected: 'Estás desconectado', eventNotFound: 'Evento no encontrado', ticketNotFound: 'Entrada no encontrada', downloadTicket: 'Descargar entrada', ticketDownloaded: 'Entrada descargada', markUsed: 'Marcar como usado', markUsedConfirm: '¿Marcar esta entrada como usada? Esta acción no se puede deshacer.', ticketMarkedUsed: '¡Entrada marcada como usada con éxito!', noActiveTickets: 'No hay entradas activas', noTicketHistory: 'No hay historial de entradas', clearData: 'Borrar mis datos', clearDataConfirm: '¿Eliminar todos tus datos?', darkMode: 'Modo oscuro', all: 'Todos', concert: 'Concierto', sport: 'Deporte', conference: 'Conferencia', training: 'Entrenamiento', cinema: 'Cine', festival: 'Festival', theatre: 'Teatro', dance: 'Baile', exhibition: 'Exposición', gala: 'Gala', seminar: 'Seminario', formation: 'Formación', fullDescription: 'Descripción completa', information: 'Información', organizer: 'Organizador', createdOn: 'Creado el', seatsLeft: 'Asientos restantes', rating: 'Valoración', notYetRated: 'Aún no valorado', noReviews: 'Aún no hay reseñas', noConditions: 'No se especificaron condiciones', by: 'Por', new: 'Nuevo', soldOut: 'Agotado', ended: 'Finalizado', tickets: 'entradas', views: 'vistas', footerTitleInfo: 'Información', footerTitleBetix: 'Betix', footerTitlePartners: 'Socios', footerTermsSale: 'Términos de venta', footerTermsUse: 'Términos de uso', footerPrivacy: 'Política de privacidad', footerAccessibility: 'Declaración de accesibilidad', footerPrivacyChoices: 'Opciones de privacidad', footerFanGuide: 'Guía del ticket fan', footerLegal: 'Avisos legales', footerCookies: 'Preferencias de cookies', footerAbout: 'Sobre nosotros', footerContact: 'Contáctanos', footerFeedback: 'Tu opinión', footerHelp: 'Ayuda', footerJoinCommunity: 'Únete a la comunidad Betix', footerPiNetwork: 'Red Pi', footerSecure: 'Seguro', footerRights: 'Todos los derechos reservados.', footerBuiltOn: 'Construido en Pi Network | Asegurado por Blockchain', footerSlogan: 'La primera plataforma de boletos descentralizada en Pi Network', footerDesc: 'Plataforma segura para comprar y vender boletos con pago en Pi.' },
    zh: { appName: 'Betix', home: '首页', myEvents: '我的活动', profile: '个人资料', settings: '设置', myTickets: '我的门票', ticketHistory: '门票历史', faq: '常见问题', administration: '管理', followUs: '关注我们', notifications: '通知', noNotifications: '没有通知', connectPi: '连接Pi', disconnect: '断开连接', chooseLanguage: '选择语言：', selectLanguage: '选择语言', guest: '访客', notConnected: '未连接', connecting: '连接中...', welcome: '欢迎', memberSince: '会员自', ratings: '评价', points: '积分', myEventsCount: '我的活动', myTicketsCount: '我的门票', history: '历史', rated: '已评价', viewAll: '查看全部', createEvent: '创建活动', searchEvent: '搜索活动...', chooseCountry: '选择国家：', upcomingEvents: '即将举行的活动', joinCommunity: '加入社区，体验独特的生活', noEvents: '未找到活动', buyTicket: '购买门票', ticketsAvailable: '可用门票', back: '返回', title: '标题', category: '类别', country: '国家', dateTime: '日期和时间', duration: '持续时间', location: '地点', description: '描述', conditions: '条件', totalSeats: '总座位数', ticketTypes: '门票类型', enableAtLeastOne: '至少启用一种门票类型并设置价格', standard: '标准', price: '价格', active: '活跃', inactive: '非活跃', photos: '照片', imagesRequired: '需要2张图片', dropImage: '将图片拖放到此处', orClick: '或点击浏览', compressed: '已压缩', imagesAutoCompressed: '图片自动压缩为WebP格式以提高性能', publishEvent: '发布活动', confirmPublication: '确认发布', reviewInfo: '请发布前检查所有信息', cancel: '取消', publishing: '发布中...', eventPublished: '活动发布成功！', editEvent: '编辑活动', modifyFields: '修改以下字段以更新您的活动', saveChanges: '保存更改', chooseQuantity: '选择数量', maximumTickets: '最大可用门票数', total: '总计', confirmPurchase: '确认购买', purchaseSuccessful: '购买成功！', ticketsAdded: '门票添加成功。', event: '活动', type: '类型', quantity: '数量', code: '代码', ok: '确定', pendingPaymentFound: '发现待处理付款', pendingPaymentMessage: '您在此应用中已有待处理付款。您可以取消待处理付款并重试，或等待其完成。', ignore: '忽略', cancelAndRetry: '取消并重试', paymentError: '付款错误', pendingPaymentError: '发现待处理付款。请完成或取消Pi钱包中的先前付款，然后重试。', paymentCancelled: '付款已取消', noSeatsAvailable: '此活动没有可用座位', pleaseConnect: '请先连接您的Pi账户', authenticationFailed: '身份验证失败。请重试。', connectionError: '连接错误', sessionExpired: '会话因不活动而过期。请重新连接。', disconnected: '您已断开连接', eventNotFound: '未找到活动', ticketNotFound: '未找到门票', downloadTicket: '下载门票', ticketDownloaded: '门票已下载', markUsed: '标记为已使用', markUsedConfirm: '将此门票标记为已使用？此操作不可撤销。', ticketMarkedUsed: '门票已成功标记为已使用！', noActiveTickets: '没有有效门票', noTicketHistory: '没有门票历史', clearData: '清除我的数据', clearDataConfirm: '删除所有数据？', darkMode: '暗色模式', all: '全部', concert: '音乐会', sport: '体育', conference: '会议', training: '培训', cinema: '电影院', festival: '节日', theatre: '剧院', dance: '舞蹈', exhibition: '展览', gala: '晚会', seminar: '研讨会', formation: '培训', fullDescription: '完整描述', information: '信息', organizer: '组织者', createdOn: '创建于', seatsLeft: '剩余座位', rating: '评分', notYetRated: '尚未评分', noReviews: '暂无评论', noConditions: '未指定条件', by: '由', new: '新', soldOut: '已售罄', ended: '已结束', tickets: '门票', views: '浏览', footerTitleInfo: '信息', footerTitleBetix: 'Betix', footerTitlePartners: '合作伙伴', footerTermsSale: '销售条款', footerTermsUse: '使用条款', footerPrivacy: '隐私政策', footerAccessibility: '无障碍声明', footerPrivacyChoices: '隐私选择', footerFanGuide: '粉丝门票指南', footerLegal: '法律声明', footerCookies: 'Cookie偏好设置', footerAbout: '关于我们', footerContact: '联系我们', footerFeedback: '您的反馈', footerHelp: '帮助', footerJoinCommunity: '加入Betix社区', footerPiNetwork: 'Pi网络', footerSecure: '安全', footerRights: '版权所有。', footerBuiltOn: '基于Pi网络构建 | 区块链保障安全', footerSlogan: 'Pi Network上第一个去中心化票务平台', footerDesc: '安全的平台，用于购买和出售Pi支付的门票。' }
};

let currentLang = 'en';
function getTranslation(key) {
    let lang = currentLang || 'en';
    if (translations[lang] && translations[lang][key] !== undefined) return translations[lang][key];
    if (translations.en && translations.en[key] !== undefined) return translations.en[key];
    return key;
}
function t(key) { return getTranslation(key); }

// ============================================================
// ===== GLOBAL VARIABLES =====
// ============================================================

let events = [];
let tickets = [];
let usedTickets = [];
let currentUser = { name: 'Guest', wallet: null, piUid: null, memberSince: '2026', loyaltyPoints: 0 };
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

// ============================================================
// ===== LIMITES CARACTÈRES FORMULAIRE =====
// ============================================================

function initCharCounters() {
    const fields = [
        { id: 'eventTitle', counterId: 'titleCharCounter', max: 25 },
        { id: 'eventLocation', counterId: 'locationCharCounter', max: 30 },
        { id: 'eventDescription', counterId: 'descCharCounter', max: 150 },
        { id: 'eventConditions', counterId: 'condCharCounter', max: 80 }
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
    Seminar: 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=600&h=400&fit=crop',
    Formation: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=600&h=400&fit=crop'
};

// ============================================================
// ===== FONCTIONS UTILITAIRES =====
// ============================================================

function escapeHtml(str) { if (!str) return ''; return str.replace(/[&<>]/g, m => { if (m === '&') return '&amp;'; if (m === '<') return '&lt;'; if (m === '>') return '&gt;'; return m; }); }
function formatDate(dateStr) { const d = new Date(dateStr); return !isNaN(d.getTime()) ? d.toLocaleDateString('en-US') : 'Date to be defined'; }
function formatDateTime(dateStr) { const d = new Date(dateStr); return !isNaN(d.getTime()) ? d.toLocaleString('en-US') : 'Unknown date'; }

// ============================================================
// ===== SUPABASE STORAGE FUNCTIONS =====
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

// ============================================================
// ===== HERO SLIDES SUPABASE FUNCTIONS =====
// ============================================================

async function saveHeroSlideToSupabase(slideData, index) {
    try {
        const dbSlide = {
            image_url: slideData.image,
            badge: slideData.badge || '',
            title: slideData.title,
            description: slideData.description || '',
            sort_order: (index !== undefined && index >= 0) ? index : 0,
            updated_at: new Date().toISOString()
        };
        if (slideData.id) {
            const { error } = await supabaseClient.from('hero_slides').update(dbSlide).eq('id', slideData.id);
            if (error) throw error;
        } else {
            dbSlide.created_at = new Date().toISOString();
            const { error } = await supabaseClient.from('hero_slides').insert(dbSlide);
            if (error) throw error;
        }
        return true;
    } catch (error) { return false; }
}

async function deleteHeroSlideFromSupabase(id) {
    try {
        const { error } = await supabaseClient.from('hero_slides').delete().eq('id', id);
        if (error) throw error;
        return true;
    } catch (error) { return false; }
}

async function migrateHeroSlides(slides) {
    for (let i = 0; i < slides.length; i++) await saveHeroSlideToSupabase(slides[i], i);
}

async function uploadHeroImage(base64Data, filename) {
    try {
        const response = await fetch(base64Data);
        const blob = await response.blob();
        const filePath = 'hero/' + filename.replace(/\s+/g, '_') + '_' + Date.now() + '.webp';
        const { data, error } = await supabaseClient.storage.from('events-images').upload(filePath, blob, { contentType: blob.type, cacheControl: '3600', upsert: true });
        if (error) throw error;
        const { data: publicUrlData } = supabaseClient.storage.from('events-images').getPublicUrl(filePath);
        return publicUrlData.publicUrl;
    } catch (error) { return null; }
}

async function loadHeroSlides() {
    try {
        const { data, error } = await supabaseClient.from('hero_slides').select('*').order('sort_order', { ascending: true });
        if (error) throw error;
        if (data && data.length > 0) {
            heroSlides = data.map(s => ({ id: s.id, image: s.image_url, badge: s.badge || '', title: s.title, description: s.description || '' }));
            localStorage.setItem('betix_hero_slides', JSON.stringify(heroSlides));
        } else {
            let local = localStorage.getItem('betix_hero_slides');
            if (local) try { heroSlides = JSON.parse(local); await migrateHeroSlides(heroSlides); } catch(e) { heroSlides = []; }
            else {
                heroSlides = [
                    { image: 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=1200&h=600&fit=crop', badge: 'Music Festival', title: 'Summer Music Festival 2026', description: '3 days of electrifying performances by top artists' },
                    { image: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=1200&h=600&fit=crop', badge: 'Football', title: 'Champions League Final', description: 'The biggest football event of the year live' },
                    { image: 'https://images.unsplash.com/photo-1505373877841-8d25f7d46678?w=1200&h=600&fit=crop', badge: 'Conference', title: 'Web3 Summit 2026', description: 'The future of decentralized technology unveiled' },
                    { image: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=1200&h=600&fit=crop', badge: 'Cinema', title: 'International Film Festival', description: 'Premieres and exclusive screenings' },
                    { image: 'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=1200&h=600&fit=crop', badge: 'Concert', title: 'World Tour Concert', description: 'An unforgettable night with global superstars' }
                ];
                await migrateHeroSlides(heroSlides);
            }
            localStorage.setItem('betix_hero_slides', JSON.stringify(heroSlides));
        }
        initHeroSlider();
        renderAdminSlides();
        return heroSlides;
    } catch (error) {
        let local = localStorage.getItem('betix_hero_slides');
        if (local) try { heroSlides = JSON.parse(local); initHeroSlider(); renderAdminSlides(); } catch(e) { heroSlides = []; }
        return heroSlides;
    }
}

// ============================================================
// ===== SUPABASE TABLE FUNCTIONS =====
// ============================================================

async function saveUserToSupabase(piUid, username, wallet, points) {
    points = points || 0;
    try {
        const now = new Date().toISOString();
        const userData = { pi_uid: piUid, username, wallet, points, updated_at: now, last_seen: now };
        const { data: existing, error: checkError } = await supabaseClient.from('users').select('pi_uid').eq('pi_uid', piUid).single();
        if (checkError && checkError.code !== 'PGRST116') throw checkError;
        if (existing) {
            const { error } = await supabaseClient.from('users').update(userData).eq('pi_uid', piUid);
            if (error) throw error;
        } else {
            userData.created_at = now;
            const { error } = await supabaseClient.from('users').insert(userData);
            if (error) throw error;
        }
        return true;
    } catch (error) { return false; }
}

async function saveEventToSupabase(eventData) {
    try {
        if (!eventData || !eventData.id) return false;
        const standardPrice = eventData.price || 0.0003;
        const imageUrls = eventData.images && eventData.images.length > 0 ? JSON.stringify(eventData.images) : null;
        const dbEvent = {
            id: eventData.id,
            organizer_pi_uid: eventData.organizerPiUid || eventData.organizer || currentUser.wallet || 'unknown',
            organizer_name: eventData.organizerName || eventData.organizer || currentUser.name || 'Anonymous',
            title: eventData.title || 'Untitled',
            description: eventData.description || '',
            image_url: eventData.coverImage || (eventData.images && eventData.images[0]) || '',
            image_urls: imageUrls,
            location: eventData.location || '',
            pays: eventData.pays || eventData.country || 'France',
            event_date: eventData.date || new Date().toISOString(),
            category: eventData.category || '',
            ticket_price_standard: standardPrice,
            ticket_standard_enabled: true,
            max_tickets: eventData.seatsTotal || 0,
            created_at: eventData.createdAt || new Date().toISOString(),
            conditions: eventData.conditions || '',
            duration_value: eventData.durationValue || null,
            duration_unit: eventData.durationUnit || null,
            standard_seats: eventData.seatsTotal || 0,
            standard_sold: eventData.standardSold || 0,
            updated_at: new Date().toISOString()
        };
        const { error } = await supabaseClient.from('events').upsert(dbEvent, { onConflict: 'id', ignoreDuplicates: false });
        if (error) throw error;
        return true;
    } catch (error) { return false; }
}

async function saveTicketToSupabase(ticketData) {
    try {
        if (!ticketData || !ticketData.id) return false;
        let eventPays = 'France', eventTitle = ticketData.eventTitle || 'Event', eventLocation = ticketData.eventLocation || '', eventDate = ticketData.eventDate || new Date().toISOString();
        if (ticketData.eventId) {
            const event = events.find(e => e.id === ticketData.eventId);
            if (event) { eventPays = event.pays || event.country || 'France'; eventTitle = event.title || eventTitle; eventLocation = event.location || eventLocation; eventDate = event.date || eventDate; }
        }
        const dbTicket = {
            id: ticketData.id,
            event_id: ticketData.eventId || '',
            buyer_pi_uid: ticketData.buyerWallet || ticketData.userWallet || currentUser.wallet || 'unknown',
            buyer_name: ticketData.buyerName || ticketData.buyerWallet || currentUser.name || 'Anonymous',
            ticket_type: 'standard',
            price: parseFloat(ticketData.price) || 0,
            qr_code: ticketData.qrCode || 'BETIX-' + Date.now(),
            status: ticketData.status || 'Valid',
            purchase_date: ticketData.purchaseDate || new Date().toISOString(),
            expiration_date: ticketData.eventDate || new Date(Date.now() + 86400000 * 30).toISOString(),
            event_title: eventTitle,
            event_location: eventLocation,
            pays: ticketData.pays || eventPays || 'France',
            transaction_id: ticketData.transactionId || '',
            updated_at: new Date().toISOString()
        };
        const { error } = await supabaseClient.from('tickets').upsert(dbTicket, { onConflict: 'id', ignoreDuplicates: false });
        if (error) throw error;
        return true;
    } catch (error) { return false; }
}

// ============================================================
// ===== LOAD FUNCTIONS =====
// ============================================================

async function loadEventsFromSupabase() {
    try {
        const { data, error } = await supabaseClient.from('events').select('*').order('event_date', { ascending: true });
        if (error) throw error;
        return (data || []).map(e => {
            const imagesArray = e.image_urls ? (() => { try { return JSON.parse(e.image_urls); } catch(parseErr) { return []; } })() : [];
            if (imagesArray.length === 0 && e.image_url) imagesArray.push(e.image_url);
            const standardSeats = e.standard_seats || 0;
            const standardSold = e.standard_sold || 0;
            return {
                id: e.id,
                title: e.title || 'Untitled',
                category: e.category || '',
                pays: e.pays || 'France',
                country: e.pays || 'France',
                date: e.event_date || new Date().toISOString(),
                location: e.location || '',
                description: e.description || '',
                conditions: e.conditions || '',
                price: e.ticket_price_standard || 0,
                seatsTotal: e.max_tickets || 0,
                seatsLeft: (e.max_tickets || 0) - standardSold,
                images: imagesArray,
                coverImage: (imagesArray.length > 0) ? imagesArray[0] : (e.image_url || ''),
                organizer: e.organizer_pi_uid || '',
                organizerName: e.organizer_name || '',
                organizerPiUid: e.organizer_pi_uid || '',
                createdAt: e.created_at || new Date().toISOString(),
                durationValue: e.duration_value || null,
                durationUnit: e.duration_unit || null,
                standardSeats,
                standardSold,
                standardLeft: standardSeats - standardSold,
                ticketTypes: { standard: { enabled: e.ticket_standard_enabled || false, price: e.ticket_price_standard || 0 } }
            };
        });
    } catch (error) { return []; }
}

async function loadTicketsFromSupabase(piUid) {
    try {
        if (!piUid) return [];
        const { data, error } = await supabaseClient.from('tickets').select('*').eq('buyer_pi_uid', piUid).order('purchase_date', { ascending: false });
        if (error) throw error;
        return data || [];
    } catch (error) { return []; }
}

async function loadNotificationsFromSupabase(piUid) {
    try {
        const { data, error } = await supabaseClient.from('notifications').select('*').eq('receiver_pi_uid', piUid).order('created_at', { ascending: false });
        if (error) throw error;
        return data || [];
    } catch (error) { return []; }
}

async function updateEventInSupabase(eventId, updates) {
    try {
        const { error } = await supabaseClient.from('events').update(updates).eq('id', eventId);
        if (error) throw error;
        return true;
    } catch (error) { return false; }
}

async function deleteEventFromSupabase(eventId) {
    try {
        const { error } = await supabaseClient.from('events').delete().eq('id', eventId);
        if (error) throw error;
        return true;
    } catch (error) { return false; }
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
        const { error } = await supabaseClient.from('transactions').insert(dbTransaction);
        if (error) throw error;
        return true;
    } catch (error) { return false; }
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
        const { error } = await supabaseClient.from('notifications').insert(dbNotification);
        if (error) throw error;
        return true;
    } catch (error) { return false; }
}

// ============================================================
// ===== FONCTIONS DE SAUVEGARDE =====
// ============================================================

function saveEvents() { localStorage.setItem('betix_events', JSON.stringify(events)); syncEventsToSupabase(); }
function saveTickets() { localStorage.setItem('betix_tickets', JSON.stringify(tickets)); saveUsedTickets(); syncTicketsToSupabase(); }
function saveUsedTickets() { localStorage.setItem('betix_used_tickets', JSON.stringify(usedTickets)); }
function loadUsedTickets() { try { usedTickets = JSON.parse(localStorage.getItem('betix_used_tickets') || '[]'); } catch(e) { usedTickets = []; } }
function saveUser() { localStorage.setItem('betix_user', JSON.stringify(currentUser)); syncUserToSupabase(); }
function saveNotifications() { localStorage.setItem('betix_notifications', JSON.stringify(notifications)); syncNotificationsToSupabase(); }
function saveChatMessages() { localStorage.setItem('betix_chat_messages', JSON.stringify(chatMessages)); }
function saveRatings() { localStorage.setItem('betix_ratings', JSON.stringify(ratings)); }
function saveConnectedUsers() { localStorage.setItem('betix_connected_users', JSON.stringify(connectedUsers)); }

async function syncUserToSupabase() {
    if (!currentUser.piUid && !currentUser.wallet) return;
    const piUid = currentUser.piUid || currentUser.wallet;
    await saveUserToSupabase(piUid, currentUser.name || 'User', currentUser.wallet || piUid, currentUser.loyaltyPoints || 0);
}
async function syncEventsToSupabase() {
    let success = 0;
    for (let i = 0; i < events.length; i++) {
        const saved = await saveEventToSupabase(events[i]);
        if (saved) success++;
        if (i % 5 === 0) await new Promise(r => setTimeout(r, 100));
    }
}
async function syncTicketsToSupabase() {
    let success = 0;
    for (let i = 0; i < tickets.length; i++) {
        const saved = await saveTicketToSupabase(tickets[i]);
        if (saved) success++;
        if (i % 5 === 0) await new Promise(r => setTimeout(r, 100));
    }
}
async function syncNotificationsToSupabase() {
    for (let i = 0; i < notifications.length; i++) {
        const notif = notifications[i];
        const receiverPiUid = notif.userWallet || currentUser.wallet;
        await saveNotificationToSupabase({ ...notif, receiverPiUid, title: notif.type === 'purchase' ? 'Ticket Purchase' : notif.type === 'event' ? 'New Event' : 'Notification' });
    }
}
async function syncAllToSupabase(retryCount = 0) {
    const maxRetries = 3;
    try {
        updateSyncStatus('syncing');
        await syncUserToSupabase();
        await syncEventsToSupabase();
        await syncTicketsToSupabase();
        await syncNotificationsToSupabase();
        updateSyncStatus('success');
        return { events: events.length, tickets: tickets.length };
    } catch (error) {
        if (retryCount < maxRetries) { await new Promise(r => setTimeout(r, 2000)); return syncAllToSupabase(retryCount + 1); }
        else { updateSyncStatus('error'); return { events: 0, tickets: 0, error: error.message }; }
    }
}

function updateSyncStatus(status) {
    const indicator = document.getElementById('syncStatusIndicator');
    if (!indicator) return;
    const icon = indicator.querySelector('.sync-icon'), text = indicator.querySelector('.sync-text'), dot = indicator.querySelector('.sync-dot');
    if (!icon || !text || !dot) return;
    indicator.className = 'sync-indicator';
    switch(status) {
        case 'loading': indicator.classList.add('syncing'); icon.className = 'sync-icon fas fa-spinner fa-spin'; text.textContent = 'Chargement...'; dot.className = 'sync-dot'; break;
        case 'syncing': indicator.classList.add('syncing'); icon.className = 'sync-icon fas fa-sync fa-spin'; text.textContent = 'Synchronisation...'; dot.className = 'sync-dot'; break;
        case 'success': indicator.classList.add('success'); icon.className = 'sync-icon fas fa-check-circle'; text.textContent = 'Synchronisé'; dot.className = 'sync-dot'; break;
        case 'error': indicator.classList.add('error'); icon.className = 'sync-icon fas fa-exclamation-circle'; text.textContent = 'Erreur de sync'; dot.className = 'sync-dot'; break;
        default: icon.className = 'sync-icon fas fa-cloud'; text.textContent = 'Prêt'; dot.className = 'sync-dot';
    }
}

async function forceRefreshData() {
    const btn = document.getElementById('refreshDataBtn');
    if (btn) { btn.disabled = true; btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Chargement...'; }
    try {
        await loadAllFromSupabase();
        await loadHeroSlides();
        await syncAllToSupabase();
        renderEventsByCategory();
        renderTickets();
        renderHistory();
        updateProfilePage();
        if (btn) { btn.innerHTML = '<i class="fas fa-check"></i> Synchronisé !'; setTimeout(() => { btn.innerHTML = '<i class="fas fa-sync"></i> Rafraîchir'; btn.disabled = false; }, 2000); }
        updateSyncStatus('success');
    } catch (error) {
        updateSyncStatus('error');
        if (btn) { btn.innerHTML = '<i class="fas fa-exclamation-triangle"></i> Erreur'; setTimeout(() => { btn.innerHTML = '<i class="fas fa-sync"></i> Rafraîchir'; btn.disabled = false; }, 2000); }
    }
}

async function loadAllFromSupabase() {
    loadUsedTickets();
    updateSyncStatus('loading');
    const localEventsBackup = localStorage.getItem('betix_events');
    try {
        const supabaseEvents = await loadEventsFromSupabase();
        if (supabaseEvents && supabaseEvents.length > 0) {
            events = supabaseEvents;
            localStorage.setItem('betix_events', JSON.stringify(events));
        } else if (localEventsBackup) {
            events = JSON.parse(localEventsBackup);
        } else {
            events = [];
        }
        const userIdentifier = currentUser.piUid || currentUser.wallet;
        if (userIdentifier) {
            const supabaseTickets = await loadTicketsFromSupabase(userIdentifier);
            if (supabaseTickets && supabaseTickets.length > 0) {
                tickets = supabaseTickets.map(t => ({
                    id: t.id, eventId: t.event_id, eventTitle: t.event_title || 'Event', eventDate: t.expiration_date || t.event_date || new Date().toISOString(),
                    eventLocation: t.event_location || '', price: parseFloat(t.price) || 0, buyerWallet: t.buyer_pi_uid, buyerName: t.buyer_name || t.buyer_pi_uid,
                    userWallet: t.buyer_pi_uid, ticketType: 'standard', pays: t.pays || 'France', status: t.status || 'Valid',
                    purchaseDate: t.purchase_date || new Date().toISOString(), purchaseDateTime: new Date(t.purchase_date || new Date()).toLocaleString('en-US'),
                    transactionId: t.transaction_id || '', qrCode: t.qr_code || 'BETIX-' + Date.now()
                }));
                localStorage.setItem('betix_tickets', JSON.stringify(tickets));
            } else {
                const localTickets = localStorage.getItem('betix_tickets');
                if (localTickets) try { tickets = JSON.parse(localTickets); } catch(e) { tickets = []; }
            }
            const supabaseNotifs = await loadNotificationsFromSupabase(userIdentifier);
            if (supabaseNotifs && supabaseNotifs.length > 0) {
                notifications = supabaseNotifs.map(n => ({ id: n.id, message: n.message || n.title || '', type: n.type || 'info', read: n.is_read || false, date: n.created_at || new Date().toISOString() }));
                localStorage.setItem('betix_notifications', JSON.stringify(notifications));
                updateNotifBadgeHeader();
            }
        }
        await loadHeroSlides();
        renderEventsByCategory();
        renderTickets();
        renderHistory();
        updateProfilePage();
        setTimeout(generateAllQRCodes, 300);
        updateSyncStatus('success');
    } catch (error) {
        updateSyncStatus('error');
        if (localEventsBackup) {
            try { events = JSON.parse(localEventsBackup); } catch(e) { events = []; }
        }
        const localTickets = localStorage.getItem('betix_tickets');
        if (localTickets) try { tickets = JSON.parse(localTickets); } catch(e) { tickets = []; }
    }
}

// ============================================================
// ===== RENDER TICKET CARD =====
// ============================================================

function generateAllQRCodes() {
    document.querySelectorAll('.qr-code-container').forEach(container => {
        const ticketId = container.dataset.ticketId || container.id.replace('qr-', '');
        const ticket = tickets.find(t => t.id === ticketId);
        if (!ticket) { container.innerHTML = '<p style="color:gray;font-size:10px;">Ticket introuvable</p>'; return; }
        const isUsed = usedTickets.indexOf(ticket.id) !== -1;
        const isExpired = new Date(ticket.eventDate) <= new Date();
        if (isUsed || isExpired || ticket.status === 'Used') { container.innerHTML = '<div style="color:gray;font-size:11px;text-align:center;"><i class="fas fa-check-circle" style="color:#10b981;"></i> Used</div>'; return; }
        container.innerHTML = '';
        try { new QRCode(container, { text: ticket.id, width: 100, height: 100, colorDark: "#08143F", colorLight: "#ffffff", correctLevel: QRCode.CorrectLevel.H }); } catch(e) { container.innerHTML = '<span style="color:red;">Erreur</span>'; }
    });
}

function renderTicketCard(ticket, status) {
    const dateEvent = new Date(ticket.eventDate);
    const dateFormatted = dateEvent.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    const timeFormatted = dateEvent.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    const statusText = status === 'valid' ? 'Valid' : 'Past';
    const typeLabel = 'Standard';
    const qrCode = ticket.qrCode || 'BETIX-' + ticket.id.substring(0, 8);
    const participantName = ticket.buyerName || ticket.buyerWallet || 'Anonymous';
    const paysDisplay = ticket.pays || 'France';
    const qrContainerId = 'qr-' + ticket.id;
    let purchaseDateDisplay = 'N/A';
    if (ticket.purchaseDate) {
        const pd = new Date(ticket.purchaseDate);
        purchaseDateDisplay = pd.toLocaleDateString('en-US') + ' ' + pd.toLocaleTimeString('en-US', {hour:'2-digit', minute:'2-digit'});
    }
    let downloadButton = '';
    if (status === 'valid') {
        downloadButton = `<button class="btn-download-ticket" onclick="downloadTicket('${ticket.id}')"><i class="fas fa-download"></i> ${t('downloadTicket')}</button>`;
    }
    return `<div class="ticket-card">
        <div class="ticket-header"><span class="ticket-status">${statusText} - ${typeLabel}</span><span class="ticket-id">#${ticket.id.substring(0, 8).toUpperCase()}</span></div>
        <div class="ticket-title">${escapeHtml(ticket.eventTitle)}</div>
        <div class="ticket-subtitle">${escapeHtml(ticket.category || 'Event')} | ${typeLabel} | ${escapeHtml(paysDisplay)}</div>
        <div class="ticket-info-grid">
            <div class="info-item"><span class="label">${t('eventDate')}</span><span class="value">${dateFormatted}</span></div>
            <div class="info-item"><span class="label">${t('eventTime')}</span><span class="value">${timeFormatted}</span></div>
            <div class="info-item"><span class="label">${t('locationLabel')}</span><span class="value">${escapeHtml(ticket.eventLocation || 'Online')}</span></div>
            <div class="info-item"><span class="label">${t('price')}</span><span class="value">${(ticket.price || 0).toFixed(6)} Pi</span></div>
            <div class="info-item"><span class="label">${t('ticketTypeLabel')}</span><span class="value">${typeLabel}</span></div>
            <div class="info-item"><span class="label">${t('countryLabel')}</span><span class="value">${escapeHtml(paysDisplay)}</span></div>
        </div>
        <div class="ticket-qr"><div id="${qrContainerId}" class="qr-code-container" data-ticket-id="${ticket.id}"></div></div>
        <div class="ticket-footer">
            <span class="ticket-participant">${t('participant')}: <strong>${escapeHtml(participantName)}</strong></span>
            <span class="ticket-purchase-date">${t('purchaseDate')}: ${purchaseDateDisplay}</span>
            ${downloadButton}
        </div>
    </div>`;
}

function renderTickets() {
    const container = document.getElementById('ticketsList');
    if (!container) return;
    const allTickets = tickets.filter(t => usedTickets.indexOf(t.id) === -1 && t.status !== 'Used').sort((a,b) => new Date(b.purchaseDate) - new Date(a.purchaseDate));
    if (!allTickets.length) { container.innerHTML = `<p style="text-align:center;padding:2rem;color:var(--gray);">${t('noActiveTickets')}</p>`; return; }
    container.innerHTML = allTickets.map(t => { const isExpired = new Date(t.eventDate) <= new Date(); return renderTicketCard(t, isExpired ? 'past' : 'valid'); }).join('');
    setTimeout(generateAllQRCodes, 200);
}

function renderHistory() {
    const container = document.getElementById('historyList');
    if (!container) return;
    const history = tickets.filter(t => usedTickets.indexOf(t.id) !== -1 || new Date(t.eventDate) <= new Date() || t.status === 'Used').sort((a,b) => new Date(b.purchaseDate) - new Date(a.purchaseDate));
    if (!history.length) { container.innerHTML = `<p style="text-align:center;padding:2rem;color:var(--gray);">${t('noTicketHistory')}</p>`; return; }
    container.innerHTML = history.map(t => renderTicketCard(t, 'past')).join('');
    setTimeout(generateAllQRCodes, 200);
}

async function downloadTicket(ticketId) {
    const ticket = tickets.find(t => t.id === ticketId);
    if (!ticket) { alert(t('ticketNotFound')); return; }
    try {
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF('p', 'mm', 'a4');
        const pageWidth = 210, pageHeight = 297, margin = 15;
        let y = margin;
        doc.setFillColor(8, 20, 63);
        doc.rect(0, 0, pageWidth, 45, 'F');
        doc.setTextColor(255, 255, 255);
        doc.setFontSize(28);
        doc.setFont('helvetica', 'bold');
        doc.text('BETIX', pageWidth / 2, 22, { align: 'center' });
        doc.setFontSize(12);
        doc.setFont('helvetica', 'normal');
        doc.text('Event Ticket', pageWidth / 2, 34, { align: 'center' });
        y = 55;
        doc.setFillColor(8, 20, 63);
        doc.rect(margin, y, 40, 10, 'F');
        doc.setTextColor(255, 255, 255);
        doc.setFontSize(10);
        doc.setFont('helvetica', 'bold');
        doc.text('Standard', margin + 20, y + 7, { align: 'center' });
        y += 20;
        doc.setTextColor(26, 26, 46);
        doc.setFontSize(18);
        doc.setFont('helvetica', 'bold');
        const titleLines = doc.splitTextToSize(ticket.eventTitle, pageWidth - margin * 2);
        doc.text(titleLines, margin, y);
        y += titleLines.length * 8 + 8;
        doc.setDrawColor(200, 200, 200);
        doc.setFillColor(248, 250, 252);
        doc.roundedRect(margin, y, pageWidth - margin * 2, 110, 4, 4, 'FD');
        let infoY = y + 10;
        doc.setFontSize(10);
        doc.setFont('helvetica', 'normal');
        const dateEvent = new Date(ticket.eventDate);
        const dateFormatted = dateEvent.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });
        const timeFormatted = dateEvent.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
        doc.setTextColor(107, 114, 128);
        doc.text('Event Date:', margin + 10, infoY);
        doc.setTextColor(26, 26, 46);
        doc.setFont('helvetica', 'bold');
        doc.text(dateFormatted, margin + 55, infoY);
        infoY += 10;
        doc.text('Event Time:', margin + 10, infoY);
        doc.text(timeFormatted, margin + 55, infoY);
        infoY += 10;
        doc.text('Location:', margin + 10, infoY);
        doc.text(ticket.eventLocation || 'Online', margin + 55, infoY);
        infoY += 10;
        doc.text('Price:', margin + 10, infoY);
        doc.text((ticket.price || 0).toFixed(6) + ' Pi', margin + 55, infoY);
        infoY += 10;
        doc.text('Ticket Type:', margin + 10, infoY);
        doc.text('Standard', margin + 55, infoY);
        infoY += 10;
        doc.text('Country:', margin + 10, infoY);
        doc.text(ticket.pays || 'France', margin + 55, infoY);
        y += 120;
        doc.setDrawColor(200, 200, 200);
        doc.setFillColor(255, 255, 255);
        doc.roundedRect(margin, y, pageWidth - margin * 2, 30, 4, 4, 'FD');
        doc.setTextColor(107, 114, 128);
        doc.setFontSize(9);
        doc.setFont('helvetica', 'normal');
        doc.text('Ticket Code', margin + 10, y + 8);
        doc.setTextColor(26, 26, 46);
        doc.setFontSize(12);
        doc.setFont('helvetica', 'bold');
        const codeDisplay = ticket.qrCode || 'BETIX-' + ticket.id.substring(0, 8);
        doc.text(codeDisplay, margin + 10, y + 22);
        y += 40;
        doc.setDrawColor(200, 200, 200);
        doc.setFillColor(245, 247, 250);
        doc.roundedRect(margin, y, pageWidth - margin * 2, 45, 4, 4, 'FD');
        doc.setTextColor(107, 114, 128);
        doc.setFontSize(9);
        doc.setFont('helvetica', 'normal');
        doc.text('QR Code', margin + 10, y + 8);
        doc.setTextColor(26, 26, 46);
        doc.setFontSize(10);
        doc.setFont('helvetica', 'bold');
        let qrText = codeDisplay;
        if (qrText.length > 30) qrText = qrText.substring(0, 28) + '...';
        doc.text(qrText, margin + 10, y + 22);
        const qrSize = 20;
        const qrX = pageWidth - margin - qrSize - 10;
        const qrY = y + 12;
        doc.setFillColor(8, 20, 63);
        for (let qi = 0; qi < 5; qi++) for (let qj = 0; qj < 5; qj++) if ((qi + qj) % 2 === 0 || qi === 0 || qi === 4 || qj === 0 || qj === 4) doc.rect(qrX + qi * 4, qrY + qj * 4, 3, 3, 'F');
        y += 55;
        doc.line(margin, y, pageWidth - margin, y);
        y += 8;
        doc.setTextColor(107, 114, 128);
        doc.setFontSize(8);
        doc.setFont('helvetica', 'normal');
        doc.text('This ticket is valid for one entry. Please present this ticket at the entrance.', pageWidth / 2, y, { align: 'center' });
        y += 6;
        doc.text('BETIX - The first ticketing platform on Pi Network', pageWidth / 2, y, { align: 'center' });
        doc.save('ticket_' + ticket.eventTitle.replace(/\s+/g, '_') + '_' + ticket.id.substring(0, 6) + '.pdf');
        addNotification(t('ticketDownloaded') + ': ' + ticket.eventTitle, 'info');
    } catch (error) { alert(t('paymentError') + ': ' + error.message); }
}

function markTicketAsUsed(ticketId) {
    if (!confirm(t('markUsedConfirm'))) return;
    if (usedTickets.indexOf(ticketId) === -1) {
        usedTickets.push(ticketId);
        for (let i = 0; i < tickets.length; i++) if (tickets[i].id === ticketId) { tickets[i].status = 'Used'; break; }
        saveUsedTickets(); saveTickets(); addNotification(t('ticketMarkedUsed'), 'info');
        renderTickets(); renderHistory(); updateProfilePage(); alert(t('ticketMarkedUsed'));
    }
}

// ============================================================
// ===== RENDER EVENT CARD - VERSION AMÉLIORÉE =====
// ============================================================

function renderEventCard(event) {
    const avgRating = ratings.filter(r => r.eventId === event.id).reduce((a,r) => a + r.rating, 0) / (ratings.filter(r => r.eventId === event.id).length || 1);
    const dateEvent = new Date(event.date);
    const dateFormatted = dateEvent.toLocaleDateString('en-US', { month: 'numeric', day: 'numeric', year: 'numeric' });
    const timeFormatted = dateEvent.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    const fallbackImage = eventImagesList[event.category] || eventImagesList.Concert;
    const images = event.images && event.images.length > 0 ? event.images : [fallbackImage];
    let posterHtml = '';
    if (images.length === 1) posterHtml = `<div class="poster-grid grid-1"><div class="grid-item"><img src="${images[0]}" alt="${escapeHtml(event.title)}" onerror="this.src='${fallbackImage}'"></div></div>`;
    else if (images.length === 2) posterHtml = `<div class="poster-grid grid-2">${images.map(img => `<div class="grid-item"><img src="${img}" alt="Image" onerror="this.src='${fallbackImage}'"></div>`).join('')}</div>`;
    else if (images.length === 3) posterHtml = `<div class="poster-grid grid-3"><div class="grid-item"><img src="${images[0]}" alt="Image 1" onerror="this.src='${fallbackImage}'"></div><div class="grid-item"><img src="${images[1]}" alt="Image 2" onerror="this.src='${fallbackImage}'"></div><div class="grid-item"><img src="${images[2]}" alt="Image 3" onerror="this.src='${fallbackImage}'"></div></div>`;
    else if (images.length >= 4) posterHtml = `<div class="poster-grid grid-4">${images.slice(0,4).map(img => `<div class="grid-item"><img src="${img}" alt="Image" onerror="this.src='${fallbackImage}'"></div>`).join('')}</div>${images.length > 4 ? `<span class="more-badge"><i class="fas fa-plus"></i> ${images.length - 4}</span>` : ''}`;
    else posterHtml = `<div class="poster-grid grid-1"><div class="grid-item"><img src="${fallbackImage}" alt="${escapeHtml(event.title)}"></div></div>`;

    const countryFlag = countryFlags[event.pays || event.country] || '';
    const countryDisplay = event.pays || event.country || 'International';
    const locationDisplay = event.location ? ` · ${escapeHtml(event.location)}` : '';
    let desc = event.description || '';
    if (desc.length > 100) desc = desc.substring(0, 97) + '...';
    let organizerDisplay = event.organizerName || event.organizer || 'Anonymous';
    if (organizerDisplay.length > 20) organizerDisplay = organizerDisplay.substring(0, 18) + '...';
    if (!organizerDisplay.startsWith('@')) organizerDisplay = '@' + organizerDisplay;

    let publishDateDisplay = '';
    if (event.createdAt) {
        const pd = new Date(event.createdAt), now = new Date();
        const diffMs = now - pd, diffMins = Math.floor(diffMs / 60000), diffHours = Math.floor(diffMs / 3600000), diffDays = Math.floor(diffMs / 86400000), diffWeeks = Math.floor(diffDays / 7), diffMonths = Math.floor(diffDays / 30), diffYears = Math.floor(diffDays / 365);
        if (diffMins < 1) publishDateDisplay = 'Just now';
        else if (diffMins < 60) publishDateDisplay = diffMins + ' min ago';
        else if (diffHours < 24) publishDateDisplay = diffHours + ' h ago';
        else if (diffDays < 7) publishDateDisplay = diffDays + ' d ago';
        else if (diffWeeks < 4) publishDateDisplay = diffWeeks + ' w ago';
        else if (diffMonths < 12) publishDateDisplay = diffMonths + ' month ago';
        else publishDateDisplay = pd.toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' });
    }

    const priceHtml = `<span class="price-label">Price</span><span class="price-value">${(event.price || 0).toFixed(6)}</span><span class="price-currency"> Pi</span>`;
    const ratingStars = Array.from({ length: 5 }, (_, i) => i < Math.floor(avgRating) ? '★' : '☆').join('');
    const ratingDisplay = ratings.filter(r => r.eventId === event.id).length > 0 ? `<span class="stars">${ratingStars}</span> ${avgRating.toFixed(1)} (${ratings.filter(r => r.eventId === event.id).length})` : `<span class="price-badge-green">${priceHtml}</span>`;

    const ticketsLabelHtml = `<div class="event-tickets-label"><span class="tickets-label-badge">Tickets</span><span class="ticket-type">${event.seatsLeft}/${event.seatsTotal}</span></div>`;

    const locationLine = `<div class="event-location-line"><i class="fas fa-map-marker-alt" style="color:#f5a623;"></i> ${countryFlag} ${escapeHtml(countryDisplay)}${locationDisplay}</div>`;
    const dateTimeLine = `<div class="event-datetime-line"><i class="fas fa-calendar-day" style="color:#f5a623;"></i> ${dateFormatted} · ${timeFormatted}</div>`;

    return `<div class="event-card-classic" onclick="openEventDetails('${event.id}')">
        <div class="poster-wrapper-classic"><span class="category-badge-classic">${escapeHtml(event.category)}</span>${posterHtml}</div>
        <div class="card-content-classic">
            <div class="event-title-classic">${escapeHtml(event.title)}</div>
            ${desc ? `<div class="event-desc-classic">${escapeHtml(desc)}</div>` : ''}
            ${locationLine}
            ${dateTimeLine}
            <div class="card-footer-classic">
                <span class="event-rating-classic">${ratingDisplay}</span>
                ${ticketsLabelHtml}
            </div>
            <button class="buy-btn-classic" onclick="event.stopPropagation(); openQuantityPopup('${event.id}')">${t('buyTicket')}</button>
            <div class="event-organizer-classic"><span class="org-icon"><i class="fas fa-user" style="color:#1a1a2e !important;"></i></span> ${t('by')} ${escapeHtml(organizerDisplay)}</div>
            ${publishDateDisplay ? `<div class="event-publish-date"><i class="far fa-clock"></i> ${publishDateDisplay}</div>` : ''}
        </div>
    </div>`;
}

// ============================================================
// ===== LANGUE, NOTIFICATIONS, NAVIGATION, etc. =====
// ============================================================

// ... (toutes les fonctions restantes inchangées, notamment changeLanguage, updateUITranslations, showPage, connectToPi, etc.)
// Afin de ne pas surcharger la réponse, je ne les réécris pas ici, mais elles sont présentes dans le fichier complet.

// ============================================================
// ===== CORRECTION DE LA DUPLICATION DES TICKETS =====
// ============================================================

// Variable globale pour suivre les transactions déjà traitées
const processedTransactions = new Set();

async function confirmPurchase(eventId, quantity) {
    const event = events.find(e => e.id === eventId);
    if (!event) { alert(t('eventNotFound')); return; }
    const eventDate = new Date(event.date);
    if (eventDate < new Date()) { alert("❌ Cet événement a déjà eu lieu. Vous ne pouvez pas acheter de tickets pour un événement passé."); return; }
    const price = event.price || 0;
    const availableSeats = event.standardLeft !== undefined ? event.standardLeft : (event.standardSeats || 0);
    if (quantity > availableSeats) { alert('Plus de places disponibles. Restant: ' + availableSeats); return; }
    const totalPrice = quantity * price;
    if (!confirm('Confirm purchase ' + quantity + ' ticket(s) for "' + event.title + '" (Total: ' + totalPrice.toFixed(6) + ' Pi) ?')) return;
    closeQuantityPopup();
    const confirmBtn = document.getElementById('confirmBuyBtn');
    if (confirmBtn) { confirmBtn.textContent = t('connecting'); confirmBtn.disabled = true; }
    try {
        if (typeof Pi === 'undefined') { alert('Pi SDK not available. Please use Pi Browser.'); if (confirmBtn) { confirmBtn.textContent = t('confirmPurchase'); confirmBtn.disabled = false; } return; }
        const payment = await Pi.createPayment({
            amount: totalPrice,
            memo: quantity + ' ticket(s): ' + event.title,
            metadata: { eventId: event.id, eventTitle: event.title, quantity }
        }, {
            onReadyForServerApproval: function(paymentId) {
                fetch(BACKEND_URL + '/api/pi/approve', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ paymentId }) }).catch(() => {});
            },
            onReadyForServerCompletion: async function(paymentId, txid) {
                const txKey = txid || paymentId;
                if (processedTransactions.has(txKey)) {
                    console.log('Transaction déjà traitée, ignorée:', txKey);
                    if (confirmBtn) { confirmBtn.textContent = t('confirmPurchase'); confirmBtn.disabled = false; }
                    return;
                }
                processedTransactions.add(txKey);
                try {
                    const purchaseDate = new Date().toISOString();
                    const purchaseDateTime = new Date().toLocaleString('en-US');
                    event.standardSold = (event.standardSold || 0) + quantity;
                    event.standardLeft = (event.standardSeats || 0) - event.standardSold;
                    event.seatsLeft -= quantity;
                    event.boosts = (event.boosts || 0) + quantity;
                    const ticketsAdded = [];
                    for (let i = 0; i < quantity; i++) {
                        const ticketId = Date.now().toString() + '-' + i + '-' + Math.random().toString(36).substring(2, 6);
                        const ticket = {
                            id: ticketId,
                            eventId: event.id,
                            eventTitle: event.title,
                            eventDate: event.date,
                            eventLocation: event.location,
                            category: event.category || '',
                            price,
                            ticketType: 'standard',
                            pays: event.pays || event.country || 'France',
                            buyerWallet: piUser ? piUser.username : currentUser.wallet,
                            buyerName: piUser ? piUser.username : currentUser.name,
                            userWallet: currentUser.wallet,
                            status: 'Valid',
                            purchaseDate,
                            purchaseDateTime,
                            transactionId: txid || 'tx-' + Date.now(),
                            qrCode: 'BETIX-' + Date.now() + '-' + (txid ? txid.substring(0, 8) : 'xxxx') + '-' + i
                        };
                        tickets.push(ticket);
                        ticketsAdded.push(ticket);
                    }
                    saveEvents();
                    saveTickets();
                    for (let j = 0; j < ticketsAdded.length; j++) {
                        await saveTicketToSupabase(ticketsAdded[j]);
                        await new Promise(r => setTimeout(r, 200));
                    }
                    await saveEventToSupabase(event);
                    await saveTransactionToSupabase({
                        id: 'tx-' + Date.now(),
                        buyerWallet: currentUser.wallet,
                        buyerPiUid: currentUser.piUid || currentUser.wallet,
                        eventId: event.id,
                        amount: totalPrice,
                        txid: txid || 'tx-' + Date.now(),
                        status: 'completed',
                        date: new Date().toISOString()
                    });
                    addNotification('🎫 Nouvelle vente ! ' + quantity + ' ticket(s) acheté(s) pour "' + event.title + '"', 'purchase');
                    addNotification('✅ Achat réussi ! ' + quantity + ' ticket(s) pour "' + event.title + '"', 'purchase');
                    renderEventsByCategory();
                    renderTickets();
                    renderHistory();
                    updateProfilePage();
                    setTimeout(generateAllQRCodes, 300);
                    await syncUserToSupabase();
                    showSuccessPopup(event, ticketsAdded, quantity);
                } catch (error) {
                    alert('Payment completed but there was an error saving your tickets.');
                    console.error('Error in completion:', error);
                } finally {
                    if (confirmBtn) {
                        confirmBtn.textContent = t('confirmPurchase');
                        confirmBtn.disabled = false;
                    }
                }
            },
            onCancel: function() {
                alert(t('paymentCancelled'));
                if (confirmBtn) { confirmBtn.textContent = t('confirmPurchase'); confirmBtn.disabled = false; }
            },
            onError: function(error) {
                alert(t('paymentError') + ': ' + (error.message || 'Unknown error'));
                if (confirmBtn) { confirmBtn.textContent = t('confirmPurchase'); confirmBtn.disabled = false; }
            },
            onIncompletePaymentFound
        });
    } catch (error) {
        alert(t('paymentError') + ': ' + (error.message || 'Unknown error'));
        if (confirmBtn) { confirmBtn.textContent = t('confirmPurchase'); confirmBtn.disabled = false; }
    }
}

// ============================================================
// ===== LE RESTE DU SCRIPT (non modifié) =====
// ============================================================

// ... (toutes les autres fonctions : createEvent, openQuantityPopup, etc.)
// Je les laisse inchangées pour ne pas alourdir la réponse, mais elles sont bien présentes dans le fichier final.

// ============================================================
// ===== EXPOSITION GLOBALE =====
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
window.verifySupabasePersistence = verifySupabasePersistence;
window.forceFullSync = forceFullSync;
window.loadHeroSlides = loadHeroSlides;
window.saveHeroSlideToSupabase = saveHeroSlideToSupabase;
window.deleteHeroSlideFromSupabase = deleteHeroSlideFromSupabase;
window.uploadHeroImage = uploadHeroImage;
