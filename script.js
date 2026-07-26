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

const BACKEND_URL = "https://betix-backend.onrender.com";

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

const translations = {
    en: {
        appName: 'Betix', home: 'Home', myEvents: 'My Events', profile: 'Profile', settings: 'Settings',
        myTickets: 'My Tickets', ticketHistory: 'Ticket History', faq: 'FAQ', administration: 'Administration',
        followUs: 'Follow us', notifications: 'Notifications', noNotifications: 'No notifications',
        connectPi: 'Connect Pi', disconnect: 'Disconnect', chooseLanguage: 'Choose Language:',
        selectLanguage: 'Select language', guest: 'Guest', notConnected: 'Not connected',
        connecting: 'Connecting...', welcome: 'Welcome', memberSince: 'Member since',
        ratings: 'ratings', points: 'points', myEventsCount: 'My Events', myTicketsCount: 'My Tickets',
        history: 'History', rated: 'Rated', viewAll: 'View all', createEvent: 'Create Event',
        searchEvent: 'Search event...', chooseCountry: 'Choose Country:',
        upcomingEvents: 'Upcoming Events', joinCommunity: 'Join the community and live unique experiences',
        noEvents: 'No events found', buyTicket: 'Buy Ticket', ticketsAvailable: 'tickets available',
        back: 'Back', title: 'Title', category: 'Category', country: 'Country', dateTime: 'Date & Time',
        duration: 'Duration', location: 'Location', description: 'Description', conditions: 'Conditions',
        totalSeats: 'Total Seats', ticketTypes: 'Ticket Types',
        enableAtLeastOne: 'Enable at least one ticket type and set its price',
        standard: 'Standard', price: 'Price', active: 'Active', inactive: 'Inactive',
        photos: 'Photos', imagesRequired: '2 images required', dropImage: 'Drop your image here',
        orClick: 'or click to browse', compressed: 'Compressed',
        imagesAutoCompressed: 'Images automatically compressed to WebP format for better performance',
        publishEvent: 'Publish Event', confirmPublication: 'Confirm Publication',
        reviewInfo: 'Please review all information before publishing your event',
        cancel: 'Cancel', publishing: 'Publishing...',
        eventPublished: 'Event has been successfully published!',
        editEvent: 'Edit Event', modifyFields: 'Modify the fields below to update your event',
        saveChanges: 'Save Changes', chooseQuantity: 'Choose quantity',
        maximumTickets: 'Maximum tickets available', total: 'Total',
        confirmPurchase: 'Confirm purchase', purchaseSuccessful: 'Purchase successful!',
        ticketsAdded: 'ticket(s) added successfully.', event: 'Event', type: 'Type',
        quantity: 'Quantity', code: 'Code', ok: 'OK',
        pendingPaymentFound: 'Pending Payment Found',
        pendingPaymentMessage: 'You already have a pending payment on this app. You can either cancel the pending payment and try again, or wait for it to complete.',
        ignore: 'Ignore', cancelAndRetry: 'Cancel & Retry',
        paymentError: 'Payment error',
        pendingPaymentError: 'A pending payment was found. Please complete or cancel the previous payment in your Pi wallet, then try again.',
        paymentCancelled: 'Payment cancelled',
        noSeatsAvailable: 'No seats available for this event',
        pleaseConnect: 'Please connect your Pi account first',
        authenticationFailed: 'Authentication failed. Please try again.',
        connectionError: 'Connection error',
        sessionExpired: 'Session expired due to inactivity. Please reconnect.',
        disconnected: 'You are disconnected',
        eventNotFound: 'Event not found', ticketNotFound: 'Ticket not found',
        downloadTicket: 'Download ticket', ticketDownloaded: 'Ticket downloaded',
        markUsed: 'Mark as used',
        markUsedConfirm: 'Mark this ticket as used? This action cannot be undone.',
        ticketMarkedUsed: 'Ticket marked as used successfully!',
        noActiveTickets: 'No active tickets', noTicketHistory: 'No ticket history',
        clearData: 'Clear my data', clearDataConfirm: 'Delete all your data?',
        darkMode: 'Dark mode', all: 'All', concert: 'Concert', sport: 'Sport',
        conference: 'Conference', training: 'Training', cinema: 'Cinema',
        festival: 'Festival', theatre: 'Theatre', dance: 'Dance',
        exhibition: 'Exhibition', gala: 'Gala', seminar: 'Seminar',
        formation: 'Formation', fullDescription: 'Full description',
        information: 'Information', organizer: 'Organizer', createdOn: 'Created on',
        seatsLeft: 'Seats left', rating: 'Rating', notYetRated: 'Not yet rated',
        noReviews: 'No reviews yet', noConditions: 'No conditions specified',
        by: 'By', new: 'New', soldOut: 'Sold Out', ended: 'Ended',
        tickets: 'tickets', views: 'views',
        footerTitleInfo: 'Info', footerTitleBetix: 'Betix', footerTitlePartners: 'Partners',
        footerTermsSale: 'Terms of sale', footerTermsUse: 'Terms of use',
        footerPrivacy: 'Privacy policy', footerAccessibility: 'Accessibility statement',
        footerPrivacyChoices: 'Privacy choices', footerFanGuide: 'Fan ticket guide',
        footerLegal: 'Legal notices', footerCookies: 'Cookie preferences',
        footerAbout: 'About us', footerContact: 'Contact us', footerFeedback: 'Your feedback',
        footerHelp: 'Help', footerJoinCommunity: 'Join the Betix community',
        footerPiNetwork: 'Pi Network', footerSecure: 'Secure',
        footerRights: 'All rights reserved.',
        footerBuiltOn: 'Built on Pi Network | Secured by Blockchain',
        footerSlogan: 'The first decentralized ticketing platform on Pi Network',
        footerDesc: 'Secure platform to buy and sell event tickets with Pi payment.'
    },
    fr: {
        appName: 'Betix', home: 'Accueil', myEvents: 'Mes Événements', profile: 'Profil',
        settings: 'Paramètres', myTickets: 'Mes Tickets', ticketHistory: 'Historique des Tickets',
        faq: 'FAQ', administration: 'Administration', followUs: 'Suivez-nous',
        notifications: 'Notifications', noNotifications: 'Aucune notification',
        connectPi: 'Connecter Pi', disconnect: 'Déconnecter',
        chooseLanguage: 'Choisir la langue :', selectLanguage: 'Sélectionner la langue',
        guest: 'Invité', notConnected: 'Non connecté', connecting: 'Connexion...',
        welcome: 'Bienvenue', memberSince: 'Membre depuis', ratings: 'avis',
        points: 'points', myEventsCount: 'Mes Événements', myTicketsCount: 'Mes Tickets',
        history: 'Historique', rated: 'Évalués', viewAll: 'Voir tout',
        createEvent: 'Créer un Événement', searchEvent: 'Rechercher un événement...',
        chooseCountry: 'Choisir le pays :', upcomingEvents: 'Événements à Venir',
        joinCommunity: 'Rejoignez la communauté et vivez des expériences uniques',
        noEvents: 'Aucun événement trouvé', buyTicket: 'Acheter un Ticket',
        ticketsAvailable: 'tickets disponibles', back: 'Retour',
        title: 'Titre', category: 'Catégorie', country: 'Pays',
        dateTime: 'Date et Heure', duration: 'Durée', location: 'Lieu',
        description: 'Description', conditions: 'Conditions', totalSeats: 'Places Totales',
        ticketTypes: 'Types de Billets',
        enableAtLeastOne: 'Activez au moins un type de billet et définissez son prix',
        standard: 'Standard', price: 'Prix', active: 'Actif', inactive: 'Inactif',
        photos: 'Photos', imagesRequired: '2 images requises',
        dropImage: 'Déposez votre image ici', orClick: 'ou cliquez pour parcourir',
        compressed: 'Compressée',
        imagesAutoCompressed: 'Images automatiquement compressées au format WebP pour de meilleures performances',
        publishEvent: 'Publier l\'Événement', confirmPublication: 'Confirmer la Publication',
        reviewInfo: 'Veuillez vérifier toutes les informations avant de publier votre événement',
        cancel: 'Annuler', publishing: 'Publication...',
        eventPublished: 'L\'événement a été publié avec succès !',
        editEvent: 'Modifier l\'Événement',
        modifyFields: 'Modifiez les champs ci-dessous pour mettre à jour votre événement',
        saveChanges: 'Enregistrer les Modifications',
        chooseQuantity: 'Choisir la quantité', maximumTickets: 'Maximum de tickets disponibles',
        total: 'Total', confirmPurchase: 'Confirmer l\'achat',
        purchaseSuccessful: 'Achat réussi !',
        ticketsAdded: 'ticket(s) ajouté(s) avec succès.',
        event: 'Événement', type: 'Type', quantity: 'Quantité', code: 'Code', ok: 'OK',
        pendingPaymentFound: 'Paiement en Attente Trouvé',
        pendingPaymentMessage: 'Vous avez déjà un paiement en attente sur cette application. Vous pouvez annuler le paiement en attente et réessayer, ou attendre qu\'il se termine.',
        ignore: 'Ignorer', cancelAndRetry: 'Annuler et Réessayer',
        paymentError: 'Erreur de paiement',
        pendingPaymentError: 'Un paiement en attente a été trouvé. Veuillez compléter ou annuler le paiement précédent dans votre portefeuille Pi, puis réessayer.',
        paymentCancelled: 'Paiement annulé',
        noSeatsAvailable: 'Aucune place disponible pour cet événement',
        pleaseConnect: 'Veuillez d\'abord connecter votre compte Pi',
        authenticationFailed: 'Échec de l\'authentification. Veuillez réessayer.',
        connectionError: 'Erreur de connexion',
        sessionExpired: 'Session expirée en raison d\'inactivité. Veuillez vous reconnecter.',
        disconnected: 'Vous êtes déconnecté',
        eventNotFound: 'Événement non trouvé', ticketNotFound: 'Ticket non trouvé',
        downloadTicket: 'Télécharger le ticket', ticketDownloaded: 'Ticket téléchargé',
        markUsed: 'Marquer comme utilisé',
        markUsedConfirm: 'Marquer ce ticket comme utilisé ? Cette action est irréversible.',
        ticketMarkedUsed: 'Ticket marqué comme utilisé avec succès !',
        noActiveTickets: 'Aucun ticket actif', noTicketHistory: 'Aucun historique de tickets',
        clearData: 'Effacer mes données', clearDataConfirm: 'Supprimer toutes vos données ?',
        darkMode: 'Mode sombre', all: 'Tous',
        concert: 'Concert', sport: 'Sport', conference: 'Conférence',
        training: 'Formation', cinema: 'Cinéma', festival: 'Festival',
        theatre: 'Théâtre', dance: 'Danse', exhibition: 'Exposition',
        gala: 'Gala', seminar: 'Séminaire', formation: 'Formation',
        fullDescription: 'Description complète', information: 'Informations',
        organizer: 'Organisateur', createdOn: 'Créé le',
        seatsLeft: 'Places restantes', rating: 'Évaluation',
        notYetRated: 'Pas encore évalué', noReviews: 'Aucun avis pour le moment',
        noConditions: 'Aucune condition spécifiée', by: 'Par',
        new: 'Nouveau', soldOut: 'Complet', ended: 'Terminé',
        tickets: 'tickets', views: 'vues',
        footerTitleInfo: 'Infos', footerTitleBetix: 'Betix', footerTitlePartners: 'Partenaires',
        footerTermsSale: 'Conditions de vente', footerTermsUse: 'Conditions d\'utilisation',
        footerPrivacy: 'Politique de confidentialité',
        footerAccessibility: 'Déclaration d\'accessibilité',
        footerPrivacyChoices: 'Choix de confidentialité',
        footerFanGuide: 'Guide du billet fan',
        footerLegal: 'Mentions légales', footerCookies: 'Préférences de cookies',
        footerAbout: 'À propos de nous', footerContact: 'Contactez-nous',
        footerFeedback: 'Votre avis', footerHelp: 'Aide',
        footerJoinCommunity: 'Rejoignez la communauté Betix',
        footerPiNetwork: 'Réseau Pi', footerSecure: 'Sécurisé',
        footerRights: 'Tous droits réservés.',
        footerBuiltOn: 'Construit sur Pi Network | Sécurisé par Blockchain',
        footerSlogan: 'La première plateforme de billetterie décentralisée sur Pi Network',
        footerDesc: 'Plateforme sécurisée pour acheter et vendre des billets avec paiement en Pi.'
    },
    pt: {
        appName: 'Betix', home: 'Início', myEvents: 'Meus Eventos', profile: 'Perfil',
        settings: 'Configurações', myTickets: 'Meus Ingressos',
        ticketHistory: 'Histórico de Ingressos', faq: 'FAQ', administration: 'Administração',
        followUs: 'Siga-nos', notifications: 'Notificações',
        noNotifications: 'Sem notificações', connectPi: 'Conectar Pi',
        disconnect: 'Desconectar', chooseLanguage: 'Escolha o idioma:',
        selectLanguage: 'Selecione o idioma', guest: 'Convidado',
        notConnected: 'Não conectado', connecting: 'Conectando...',
        welcome: 'Bem-vindo', memberSince: 'Membro desde',
        ratings: 'avaliações', points: 'pontos',
        myEventsCount: 'Meus Eventos', myTicketsCount: 'Meus Ingressos',
        history: 'Histórico', rated: 'Avaliados', viewAll: 'Ver tudo',
        createEvent: 'Criar Evento', searchEvent: 'Pesquisar evento...',
        chooseCountry: 'Escolha o país:', upcomingEvents: 'Próximos Eventos',
        joinCommunity: 'Junte-se à comunidade e viva experiências únicas',
        noEvents: 'Nenhum evento encontrado', buyTicket: 'Comprar Ingresso',
        ticketsAvailable: 'ingressos disponíveis', back: 'Voltar',
        title: 'Título', category: 'Categoria', country: 'País',
        dateTime: 'Data e Hora', duration: 'Duração', location: 'Local',
        description: 'Descrição', conditions: 'Condições',
        totalSeats: 'Total de Lugares', ticketTypes: 'Tipos de Ingressos',
        enableAtLeastOne: 'Ative pelo menos um tipo de ingresso e defina seu preço',
        standard: 'Padrão', price: 'Preço', active: 'Ativo', inactive: 'Inativo',
        photos: 'Fotos', imagesRequired: '2 imagens obrigatórias',
        dropImage: 'Solte sua imagem aqui', orClick: 'ou clique para procurar',
        compressed: 'Comprimida',
        imagesAutoCompressed: 'Imagens automaticamente comprimidas para formato WebP para melhor desempenho',
        publishEvent: 'Publicar Evento', confirmPublication: 'Confirmar Publicação',
        reviewInfo: 'Revise todas as informações antes de publicar seu evento',
        cancel: 'Cancelar', publishing: 'Publicando...',
        eventPublished: 'Evento publicado com sucesso!',
        editEvent: 'Editar Evento',
        modifyFields: 'Modifique os campos abaixo para atualizar seu evento',
        saveChanges: 'Salvar Alterações',
        chooseQuantity: 'Escolha a quantidade',
        maximumTickets: 'Máximo de ingressos disponíveis',
        total: 'Total', confirmPurchase: 'Confirmar compra',
        purchaseSuccessful: 'Compra bem-sucedida!',
        ticketsAdded: 'ingresso(s) adicionado(s) com sucesso.',
        event: 'Evento', type: 'Tipo', quantity: 'Quantidade', code: 'Código', ok: 'OK',
        pendingPaymentFound: 'Pagamento Pendente Encontrado',
        pendingPaymentMessage: 'Você já tem um pagamento pendente neste aplicativo. Você pode cancelar o pagamento pendente e tentar novamente, ou aguardar sua conclusão.',
        ignore: 'Ignorar', cancelAndRetry: 'Cancelar e Tentar Novamente',
        paymentError: 'Erro de pagamento',
        pendingPaymentError: 'Foi encontrado um pagamento pendente. Por favor, complete ou cancele o pagamento anterior em sua carteira Pi e tente novamente.',
        paymentCancelled: 'Pagamento cancelado',
        noSeatsAvailable: 'Nenhum lugar disponível para este evento',
        pleaseConnect: 'Por favor, conecte sua conta Pi primeiro',
        authenticationFailed: 'Falha na autenticação. Por favor, tente novamente.',
        connectionError: 'Erro de conexão',
        sessionExpired: 'Sessão expirada devido à inatividade. Por favor, reconecte-se.',
        disconnected: 'Você está desconectado',
        eventNotFound: 'Evento não encontrado', ticketNotFound: 'Ingresso não encontrado',
        downloadTicket: 'Baixar ingresso', ticketDownloaded: 'Ingresso baixado',
        markUsed: 'Marcar como usado',
        markUsedConfirm: 'Marcar este ingresso como usado? Esta ação não pode ser desfeita.',
        ticketMarkedUsed: 'Ingresso marcado como usado com sucesso!',
        noActiveTickets: 'Nenhum ingresso ativo', noTicketHistory: 'Nenhum histórico de ingressos',
        clearData: 'Limpar meus dados', clearDataConfirm: 'Excluir todos os seus dados?',
        darkMode: 'Modo escuro', all: 'Todos',
        concert: 'Concerto', sport: 'Esporte', conference: 'Conferência',
        training: 'Treinamento', cinema: 'Cinema', festival: 'Festival',
        theatre: 'Teatro', dance: 'Dança', exhibition: 'Exposição',
        gala: 'Gala', seminar: 'Seminário', formation: 'Formação',
        fullDescription: 'Descrição completa', information: 'Informações',
        organizer: 'Organizador', createdOn: 'Criado em',
        seatsLeft: 'Lugares restantes', rating: 'Avaliação',
        notYetRated: 'Ainda não avaliado', noReviews: 'Nenhuma avaliação ainda',
        noConditions: 'Nenhuma condição especificada', by: 'Por',
        new: 'Novo', soldOut: 'Esgotado', ended: 'Finalizado',
        tickets: 'ingressos', views: 'visualizações',
        footerTitleInfo: 'Informações', footerTitleBetix: 'Betix',
        footerTitlePartners: 'Parceiros',
        footerTermsSale: 'Termos de venda', footerTermsUse: 'Termos de uso',
        footerPrivacy: 'Política de privacidade',
        footerAccessibility: 'Declaração de acessibilidade',
        footerPrivacyChoices: 'Escolhas de privacidade',
        footerFanGuide: 'Guia do ingresso fã',
        footerLegal: 'Avisos legais', footerCookies: 'Preferências de cookies',
        footerAbout: 'Sobre nós', footerContact: 'Contate-nos',
        footerFeedback: 'Seu feedback', footerHelp: 'Ajuda',
        footerJoinCommunity: 'Junte-se à comunidade Betix',
        footerPiNetwork: 'Rede Pi', footerSecure: 'Seguro',
        footerRights: 'Todos os direitos reservados.',
        footerBuiltOn: 'Construído na Pi Network | Seguro por Blockchain',
        footerSlogan: 'A primeira plataforma de bilheteria descentralizada na Pi Network',
        footerDesc: 'Plataforma segura para comprar e vender ingressos com pagamento em Pi.'
    },
    es: {
        appName: 'Betix', home: 'Inicio', myEvents: 'Mis Eventos', profile: 'Perfil',
        settings: 'Configuración', myTickets: 'Mis Entradas',
        ticketHistory: 'Historial de Entradas', faq: 'FAQ', administration: 'Administración',
        followUs: 'Síguenos', notifications: 'Notificaciones',
        noNotifications: 'Sin notificaciones', connectPi: 'Conectar Pi',
        disconnect: 'Desconectar', chooseLanguage: 'Elige el idioma:',
        selectLanguage: 'Selecciona el idioma', guest: 'Invitado',
        notConnected: 'No conectado', connecting: 'Conectando...',
        welcome: 'Bienvenido', memberSince: 'Miembro desde',
        ratings: 'valoraciones', points: 'puntos',
        myEventsCount: 'Mis Eventos', myTicketsCount: 'Mis Entradas',
        history: 'Historial', rated: 'Valorados', viewAll: 'Ver todo',
        createEvent: 'Crear Evento', searchEvent: 'Buscar evento...',
        chooseCountry: 'Elige el país:', upcomingEvents: 'Próximos Eventos',
        joinCommunity: 'Únete a la comunidad y vive experiencias únicas',
        noEvents: 'No se encontraron eventos', buyTicket: 'Comprar Entrada',
        ticketsAvailable: 'entradas disponibles', back: 'Volver',
        title: 'Título', category: 'Categoría', country: 'País',
        dateTime: 'Fecha y Hora', duration: 'Duración', location: 'Ubicación',
        description: 'Descripción', conditions: 'Condiciones',
        totalSeats: 'Total de Asientos', ticketTypes: 'Tipos de Entradas',
        enableAtLeastOne: 'Habilita al menos un tipo de entrada y establece su precio',
        standard: 'Estándar', price: 'Precio', active: 'Activo', inactive: 'Inactivo',
        photos: 'Fotos', imagesRequired: '2 imágenes requeridas',
        dropImage: 'Suelta tu imagen aquí', orClick: 'o haz clic para buscar',
        compressed: 'Comprimida',
        imagesAutoCompressed: 'Imágenes comprimidas automáticamente a formato WebP para mejor rendimiento',
        publishEvent: 'Publicar Evento', confirmPublication: 'Confirmar Publicación',
        reviewInfo: 'Revisa toda la información antes de publicar tu evento',
        cancel: 'Cancelar', publishing: 'Publicando...',
        eventPublished: '¡Evento publicado con éxito!',
        editEvent: 'Editar Evento',
        modifyFields: 'Modifica los campos a continuación para actualizar tu evento',
        saveChanges: 'Guardar Cambios',
        chooseQuantity: 'Elige la cantidad',
        maximumTickets: 'Máximo de entradas disponibles',
        total: 'Total', confirmPurchase: 'Confirmar compra',
        purchaseSuccessful: '¡Compra exitosa!',
        ticketsAdded: 'entrada(s) añadida(s) con éxito.',
        event: 'Evento', type: 'Tipo', quantity: 'Cantidad', code: 'Código', ok: 'OK',
        pendingPaymentFound: 'Pago Pendiente Encontrado',
        pendingPaymentMessage: 'Ya tienes un pago pendiente en esta aplicación. Puedes cancelar el pago pendiente e intentarlo de nuevo, o esperar a que se complete.',
        ignore: 'Ignorar', cancelAndRetry: 'Cancelar y Reintentar',
        paymentError: 'Error de pago',
        pendingPaymentError: 'Se encontró un pago pendiente. Por favor, completa o cancela el pago anterior en tu cartera Pi y vuelve a intentarlo.',
        paymentCancelled: 'Pago cancelado',
        noSeatsAvailable: 'No hay asientos disponibles para este evento',
        pleaseConnect: 'Por favor, conecta tu cuenta Pi primero',
        authenticationFailed: 'Error de autenticación. Por favor, inténtalo de nuevo.',
        connectionError: 'Error de conexión',
        sessionExpired: 'Sesión expirada por inactividad. Por favor, reconéctate.',
        disconnected: 'Estás desconectado',
        eventNotFound: 'Evento no encontrado', ticketNotFound: 'Entrada no encontrada',
        downloadTicket: 'Descargar entrada', ticketDownloaded: 'Entrada descargada',
        markUsed: 'Marcar como usado',
        markUsedConfirm: '¿Marcar esta entrada como usada? Esta acción no se puede deshacer.',
        ticketMarkedUsed: '¡Entrada marcada como usada con éxito!',
        noActiveTickets: 'No hay entradas activas', noTicketHistory: 'No hay historial de entradas',
        clearData: 'Borrar mis datos', clearDataConfirm: '¿Eliminar todos tus datos?',
        darkMode: 'Modo oscuro', all: 'Todos',
        concert: 'Concierto', sport: 'Deporte', conference: 'Conferencia',
        training: 'Entrenamiento', cinema: 'Cine', festival: 'Festival',
        theatre: 'Teatro', dance: 'Baile', exhibition: 'Exposición',
        gala: 'Gala', seminar: 'Seminario', formation: 'Formación',
        fullDescription: 'Descripción completa', information: 'Información',
        organizer: 'Organizador', createdOn: 'Creado el',
        seatsLeft: 'Asientos restantes', rating: 'Valoración',
        notYetRated: 'Aún no valorado', noReviews: 'Aún no hay reseñas',
        noConditions: 'No se especificaron condiciones', by: 'Por',
        new: 'Nuevo', soldOut: 'Agotado', ended: 'Finalizado',
        tickets: 'entradas', views: 'vistas',
        footerTitleInfo: 'Información', footerTitleBetix: 'Betix',
        footerTitlePartners: 'Socios',
        footerTermsSale: 'Términos de venta', footerTermsUse: 'Términos de uso',
        footerPrivacy: 'Política de privacidad',
        footerAccessibility: 'Declaración de accesibilidad',
        footerPrivacyChoices: 'Opciones de privacidad',
        footerFanGuide: 'Guía del ticket fan',
        footerLegal: 'Avisos legales', footerCookies: 'Preferencias de cookies',
        footerAbout: 'Sobre nosotros', footerContact: 'Contáctanos',
        footerFeedback: 'Tu opinión', footerHelp: 'Ayuda',
        footerJoinCommunity: 'Únete a la comunidad Betix',
        footerPiNetwork: 'Red Pi', footerSecure: 'Seguro',
        footerRights: 'Todos los derechos reservados.',
        footerBuiltOn: 'Construido en Pi Network | Asegurado por Blockchain',
        footerSlogan: 'La primera plataforma de boletos descentralizada en Pi Network',
        footerDesc: 'Plataforma segura para comprar y vender boletos con pago en Pi.'
    },
    zh: {
        appName: 'Betix', home: '首页', myEvents: '我的活动', profile: '个人资料',
        settings: '设置', myTickets: '我的门票', ticketHistory: '门票历史',
        faq: '常见问题', administration: '管理', followUs: '关注我们',
        notifications: '通知', noNotifications: '没有通知',
        connectPi: '连接Pi', disconnect: '断开连接',
        chooseLanguage: '选择语言：', selectLanguage: '选择语言',
        guest: '访客', notConnected: '未连接', connecting: '连接中...',
        welcome: '欢迎', memberSince: '会员自', ratings: '评价',
        points: '积分', myEventsCount: '我的活动', myTicketsCount: '我的门票',
        history: '历史', rated: '已评价', viewAll: '查看全部',
        createEvent: '创建活动', searchEvent: '搜索活动...',
        chooseCountry: '选择国家：', upcomingEvents: '即将举行的活动',
        joinCommunity: '加入社区，体验独特的生活',
        noEvents: '未找到活动', buyTicket: '购买门票',
        ticketsAvailable: '可用门票', back: '返回',
        title: '标题', category: '类别', country: '国家',
        dateTime: '日期和时间', duration: '持续时间', location: '地点',
        description: '描述', conditions: '条件', totalSeats: '总座位数',
        ticketTypes: '门票类型',
        enableAtLeastOne: '至少启用一种门票类型并设置价格',
        standard: '标准', price: '价格', active: '活跃', inactive: '非活跃',
        photos: '照片', imagesRequired: '需要2张图片',
        dropImage: '将图片拖放到此处', orClick: '或点击浏览',
        compressed: '已压缩',
        imagesAutoCompressed: '图片自动压缩为WebP格式以提高性能',
        publishEvent: '发布活动', confirmPublication: '确认发布',
        reviewInfo: '请发布前检查所有信息',
        cancel: '取消', publishing: '发布中...',
        eventPublished: '活动发布成功！',
        editEvent: '编辑活动',
        modifyFields: '修改以下字段以更新您的活动',
        saveChanges: '保存更改',
        chooseQuantity: '选择数量', maximumTickets: '最大可用门票数',
        total: '总计', confirmPurchase: '确认购买',
        purchaseSuccessful: '购买成功！',
        ticketsAdded: '门票添加成功。',
        event: '活动', type: '类型', quantity: '数量', code: '代码', ok: '确定',
        pendingPaymentFound: '发现待处理付款',
        pendingPaymentMessage: '您在此应用中已有待处理付款。您可以取消待处理付款并重试，或等待其完成。',
        ignore: '忽略', cancelAndRetry: '取消并重试',
        paymentError: '付款错误',
        pendingPaymentError: '发现待处理付款。请完成或取消Pi钱包中的先前付款，然后重试。',
        paymentCancelled: '付款已取消',
        noSeatsAvailable: '此活动没有可用座位',
        pleaseConnect: '请先连接您的Pi账户',
        authenticationFailed: '身份验证失败。请重试。',
        connectionError: '连接错误',
        sessionExpired: '会话因不活动而过期。请重新连接。',
        disconnected: '您已断开连接',
        eventNotFound: '未找到活动', ticketNotFound: '未找到门票',
        downloadTicket: '下载门票', ticketDownloaded: '门票已下载',
        markUsed: '标记为已使用',
        markUsedConfirm: '将此门票标记为已使用？此操作不可撤销。',
        ticketMarkedUsed: '门票已成功标记为已使用！',
        noActiveTickets: '没有有效门票', noTicketHistory: '没有门票历史',
        clearData: '清除我的数据', clearDataConfirm: '删除所有数据？',
        darkMode: '暗色模式', all: '全部',
        concert: '音乐会', sport: '体育', conference: '会议',
        training: '培训', cinema: '电影院', festival: '节日',
        theatre: '剧院', dance: '舞蹈', exhibition: '展览',
        gala: '晚会', seminar: '研讨会', formation: '培训',
        fullDescription: '完整描述', information: '信息',
        organizer: '组织者', createdOn: '创建于',
        seatsLeft: '剩余座位', rating: '评分',
        notYetRated: '尚未评分', noReviews: '暂无评论',
        noConditions: '未指定条件', by: '由',
        new: '新', soldOut: '已售罄', ended: '已结束',
        tickets: '门票', views: '浏览',
        footerTitleInfo: '信息', footerTitleBetix: 'Betix',
        footerTitlePartners: '合作伙伴',
        footerTermsSale: '销售条款', footerTermsUse: '使用条款',
        footerPrivacy: '隐私政策',
        footerAccessibility: '无障碍声明',
        footerPrivacyChoices: '隐私选择',
        footerFanGuide: '粉丝门票指南',
        footerLegal: '法律声明', footerCookies: 'Cookie偏好设置',
        footerAbout: '关于我们', footerContact: '联系我们',
        footerFeedback: '您的反馈', footerHelp: '帮助',
        footerJoinCommunity: '加入Betix社区',
        footerPiNetwork: 'Pi网络', footerSecure: '安全',
        footerRights: '版权所有。',
        footerBuiltOn: '基于Pi网络构建 | 区块链保障安全',
        footerSlogan: 'Pi Network上第一个去中心化票务平台',
        footerDesc: '安全的平台，用于购买和出售Pi支付的门票。'
    }
};

let currentLang = 'en';
function getTranslation(key) {
    let lang = currentLang || 'en';
    if (translations[lang] && translations[lang][key] !== undefined) return translations[lang][key];
    if (translations.en && translations.en[key] !== undefined) return translations.en[key];
    return key;
}
function t(key) { return getTranslation(key); }

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

function escapeHtml(str) { if (!str) return ''; return str.replace(/[&<>]/g, m => { if (m === '&') return '&amp;'; if (m === '<') return '&lt;'; if (m === '>') return '&gt;'; return m; }); }
function formatDate(dateStr) { const d = new Date(dateStr); return !isNaN(d.getTime()) ? d.toLocaleDateString('en-US') : 'Date to be defined'; }
function formatDateTime(dateStr) { const d = new Date(dateStr); return !isNaN(d.getTime()) ? d.toLocaleString('en-US') : 'Unknown date'; }

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

function mergeArraysById(localArray, supabaseArray) {
    const merged = [...localArray];
    for (const item of supabaseArray) {
        if (!merged.some(l => l.id === item.id)) {
            merged.push(item);
        }
    }
    return merged;
}

async function loadAllFromSupabase() {
    loadUsedTickets();
    updateSyncStatus('loading');
    const localEvents = JSON.parse(localStorage.getItem('betix_events') || '[]');
    const localTickets = JSON.parse(localStorage.getItem('betix_tickets') || '[]');
    try {
        const supabaseEvents = await loadEventsFromSupabase();
        const userIdentifier = currentUser.piUid || currentUser.wallet;
        let supabaseTickets = [];
        if (userIdentifier) {
            supabaseTickets = await loadTicketsFromSupabase(userIdentifier);
        }
        events = mergeArraysById(localEvents, supabaseEvents);
        localStorage.setItem('betix_events', JSON.stringify(events));
        tickets = mergeArraysById(localTickets, supabaseTickets);
        localStorage.setItem('betix_tickets', JSON.stringify(tickets));
        for (const e of events) {
            if (!supabaseEvents.some(se => se.id === e.id)) {
                await saveEventToSupabase(e);
                await new Promise(r => setTimeout(r, 100));
            }
        }
        for (const t of tickets) {
            if (!supabaseTickets.some(st => st.id === t.id)) {
                await saveTicketToSupabase(t);
                await new Promise(r => setTimeout(r, 100));
            }
        }
        const localNotifs = JSON.parse(localStorage.getItem('betix_notifications') || '[]');
        let supabaseNotifs = [];
        if (userIdentifier) {
            supabaseNotifs = await loadNotificationsFromSupabase(userIdentifier);
        }
        notifications = mergeArraysById(localNotifs, supabaseNotifs);
        localStorage.setItem('betix_notifications', JSON.stringify(notifications));
        updateSyncStatus('success');
    } catch (error) {
        console.error('Erreur lors du chargement depuis Supabase :', error);
        updateSyncStatus('error');
        events = localEvents;
        tickets = localTickets;
        localStorage.setItem('betix_events', JSON.stringify(events));
        localStorage.setItem('betix_tickets', JSON.stringify(tickets));
    }
    renderEventsByCategory();
    renderTickets();
    renderHistory();
    updateProfilePage();
    setTimeout(generateAllQRCodes, 300);
}

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

const processingTransactions = new Set();

async function confirmPurchase(eventId, quantity) {
    const event = events.find(e => e.id === eventId);
    if (!event) { alert(t('eventNotFound')); return; }
    const eventDate = new Date(event.date);
    if (eventDate < new Date()) {
        alert("❌ Cet événement a déjà eu lieu. Vous ne pouvez pas acheter de tickets pour un événement passé.");
        return;
    }
    const price = event.price || 0;
    const availableSeats = event.standardLeft !== undefined ? event.standardLeft : (event.standardSeats || 0);
    if (quantity > availableSeats) {
        alert('Plus de places disponibles. Restant: ' + availableSeats);
        return;
    }
    const totalPrice = quantity * price;
    if (!confirm('Confirm purchase ' + quantity + ' ticket(s) for "' + event.title + '" (Total: ' + totalPrice.toFixed(6) + ' Pi) ?')) return;
    closeQuantityPopup();
    const confirmBtn = document.getElementById('confirmBuyBtn');
    if (confirmBtn) { confirmBtn.textContent = t('connecting'); confirmBtn.disabled = true; }
    try {
        if (typeof Pi === 'undefined') {
            alert('Pi SDK not available. Please use Pi Browser.');
            if (confirmBtn) { confirmBtn.textContent = t('confirmPurchase'); confirmBtn.disabled = false; }
            return;
        }
        const payment = await Pi.createPayment({
            amount: totalPrice,
            memo: quantity + ' ticket(s): ' + event.title,
            metadata: { eventId: event.id, eventTitle: event.title, quantity }
        }, {
            onReadyForServerApproval: function(paymentId) {
                fetch(BACKEND_URL + '/api/pi/approve', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ paymentId })
                }).catch(() => {});
            },
            onReadyForServerCompletion: async function(paymentId, txid) {
                if (processingTransactions.has(txid)) {
                    console.log('Transaction déjà en cours :', txid);
                    return;
                }
                processingTransactions.add(txid);
                try {
                    const existingTickets = tickets.filter(t => t.transactionId === txid);
                    if (existingTickets.length > 0) {
                        alert('✅ Cette transaction a déjà été traitée. Vos tickets sont disponibles dans "My Tickets".');
                        showPage('tickets');
                        processingTransactions.delete(txid);
                        if (confirmBtn) { confirmBtn.textContent = t('confirmPurchase'); confirmBtn.disabled = false; }
                        return;
                    }
                    const userIdentifier = currentUser.piUid || currentUser.wallet;
                    if (userIdentifier) {
                        const supabaseTickets = await loadTicketsFromSupabase(userIdentifier);
                        const existingInSupabase = supabaseTickets.filter(t => t.transaction_id === txid);
                        if (existingInSupabase.length > 0) {
                            tickets = mergeArraysById(tickets, supabaseTickets);
                            localStorage.setItem('betix_tickets', JSON.stringify(tickets));
                            alert('✅ Cette transaction a déjà été traitée. Vos tickets sont disponibles dans "My Tickets".');
                            renderTickets();
                            renderHistory();
                            showPage('tickets');
                            processingTransactions.delete(txid);
                            if (confirmBtn) { confirmBtn.textContent = t('confirmPurchase'); confirmBtn.disabled = false; }
                            return;
                        }
                    }
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
                    processingTransactions.delete(txid);
                } catch (error) {
                    console.error('Erreur lors de la finalisation du paiement :', error);
                    alert('Le paiement a été effectué mais une erreur est survenue lors de l\'enregistrement des tickets. Veuillez contacter le support.');
                    processingTransactions.delete(txid);
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

function renderEventCard(event) {
    const avgRating = ratings.filter(r => r.eventId === event.id).reduce((a,r) => a + r.rating, 0) / (ratings.filter(r => r.eventId === event.id).length || 1);
    const dateEvent = new Date(event.date);
    const dateFormatted = dateEvent.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
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

    const ratingStars = Array.from({ length: 5 }, (_, i) => i < Math.floor(avgRating) ? '★' : '☆').join('');
    const ratingDisplay = ratings.filter(r => r.eventId === event.id).length > 0 ? `<span class="stars">${ratingStars}</span> ${avgRating.toFixed(1)} (${ratings.filter(r => r.eventId === event.id).length})` : '';

    const ticketsLabelHtml = `<div class="event-tickets-label"><span class="tickets-label-badge">Tickets</span><span class="ticket-type">${event.seatsLeft}/${event.seatsTotal}</span></div>`;

    const priceRightHtml = `<div class="event-price-right">
        <span class="price-label-badge">Price</span>
        <span class="price-amount-green">${(event.price || 0).toFixed(6)}</span>
        <span class="price-currency-gray">Pi</span>
    </div>`;

    let durationDisplay = '';
    if (event.durationValue && event.durationUnit) {
        const unitLabels = {
            hours: event.durationValue === 1 ? 'Hour' : 'Hours',
            days: event.durationValue === 1 ? 'Day' : 'Days',
            weeks: event.durationValue === 1 ? 'Week' : 'Weeks',
            months: event.durationValue === 1 ? 'Month' : 'Months',
            years: event.durationValue === 1 ? 'Year' : 'Years'
        };
        durationDisplay = `${event.durationValue} ${unitLabels[event.durationUnit] || event.durationUnit}`;
    }

    const infoBoxHtml = `
        <div class="event-info-box">
            <div class="event-location-line"><i class="fas fa-map-marker-alt" style="color:#f5a623;"></i> ${countryFlag} ${escapeHtml(countryDisplay)}${locationDisplay}</div>
            <div class="event-datetime-line"><i class="fas fa-calendar-day" style="color:#f5a623;"></i> ${dateFormatted} · <i class="fas fa-clock" style="color:#f5a623;"></i> ${timeFormatted}${durationDisplay ? ` · <i class="fas fa-hourglass-half" style="color:#f5a623;"></i> ${durationDisplay}` : ''}</div>
        </div>
    `;

    return `<div class="event-card-classic" onclick="openEventDetails('${event.id}')">
        <div class="poster-wrapper-classic"><span class="category-badge-classic">${escapeHtml(event.category)}</span>${posterHtml}</div>
        <div class="card-content-classic">
            <div class="event-title-large">${escapeHtml(event.title)}</div>
            ${desc ? `<div class="event-description-full">${escapeHtml(desc)}</div>` : ''}
            ${infoBoxHtml}
            <div class="event-meta-row">
                ${ratingDisplay ? `<div class="event-rating-classic">${ratingDisplay}</div>` : ''}
            </div>
            <div class="event-tickets-price-row">
                ${ticketsLabelHtml}
                ${priceRightHtml}
            </div>
            <button class="buy-btn-classic" onclick="event.stopPropagation(); openQuantityPopup('${event.id}')">${t('buyTicket')}</button>
            <div class="event-organizer-classic"><span class="org-icon"><i class="fas fa-user"></i></span> ${t('by')} ${escapeHtml(organizerDisplay)}</div>
            ${publishDateDisplay ? `<div class="event-publish-date"><i class="far fa-clock"></i> ${publishDateDisplay}</div>` : ''}
        </div>
    </div>`;
}

function openEventDetails(eventId) {
    const event = events.find(e => e.id === eventId);
    if (!event) { alert(t('eventNotFound')); return; }
    const modal = document.getElementById('eventDetailModal');
    const content = document.getElementById('eventDetailContent');
    const currentPage = pageHistory[pageHistory.length - 1] || 'home';
    if (currentPage !== 'eventDetail') pageHistory.push('eventDetail');

    const dateEvent = new Date(event.date);
    const dateFormatted = dateEvent.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    const timeFormatted = dateEvent.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    const countryFlag = countryFlags[event.pays || event.country] || '';
    const countryDisplay = event.pays || event.country || 'International';
    const priceDisplay = event.ticketTypes?.standard?.enabled ? 'Standard: ' + (event.ticketTypes.standard.price || 0).toFixed(6) + ' Pi' : (event.price || 0).toFixed(6) + ' Pi';
    const fallbackImage = eventImagesList[event.category] || 'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?w=600&h=400&fit=crop';
    const images = event.images && event.images.length > 0 ? event.images : [fallbackImage];
    let carouselHtml = '';
    if (images.length > 0) {
        const trackId = 'carousel-track-' + event.id;
        const dotsId = 'carousel-dots-' + event.id;
        carouselHtml = `<div class="event-detail-image-carousel" id="carousel-${event.id}"><div class="carousel-track" id="${trackId}">`;
        images.forEach(img => carouselHtml += `<div class="carousel-slide"><img src="${img}" alt="Image" onerror="this.src='${fallbackImage}'"></div>`);
        carouselHtml += '</div>';
        if (images.length > 1) {
            carouselHtml += `<button class="carousel-btn prev" onclick="carouselPrev('${event.id}')">‹</button><button class="carousel-btn next" onclick="carouselNext('${event.id}')">›</button>`;
            carouselHtml += `<div class="carousel-counter"><i class="fas fa-image"></i><span id="carousel-current-${event.id}">1</span>/${images.length}</div>`;
            carouselHtml += `<div class="carousel-dots" id="${dotsId}">`;
            for (let d = 0; d < images.length; d++) carouselHtml += `<button class="cdot${d === 0 ? ' active' : ''}" onclick="carouselGoTo('${event.id}', ${d})"></button>`;
            carouselHtml += '</div>';
        }
        carouselHtml += '</div>';
    }

    let conditionsHtml = event.conditions ? (event.conditions.split('\n').filter(l => l.trim()).length ? `<ul>${event.conditions.split('\n').filter(l => l.trim()).map(l => `<li>${escapeHtml(l.trim())}</li>`).join('')}</ul>` : `<p style="color: var(--gray); font-size: 0.85rem;">${escapeHtml(event.conditions)}</p>`) : `<p style="color: var(--gray); font-size: 0.85rem;">${t('noConditions')}</p>`;

    const eventRatings = ratings.filter(r => r.eventId === event.id);
    let reviewsHtml = eventRatings.length ? eventRatings.map(r => {
        const stars = Array.from({ length: 5 }, (_, i) => i < r.rating ? '★' : '☆').join('');
        return `<div class="review-item-simple"><div class="review-header"><span class="review-user">${escapeHtml(r.userName || r.userWallet)}</span><span class="review-stars">${stars}</span></div>${r.comment ? `<div class="review-text">"${escapeHtml(r.comment)}"</div>` : ''}<div class="review-date">${new Date(r.date).toLocaleDateString('en-US')}</div></div>`;
    }).join('') : `<p style="color: var(--gray); font-size: 0.85rem;">${t('noReviews')}</p>`;

    const avgRating = eventRatings.length ? eventRatings.reduce((a,r) => a + r.rating, 0) / eventRatings.length : 0;
    const ratingStars = Array.from({ length: 5 }, (_, i) => i < Math.floor(avgRating) ? '★' : '☆').join('');
    const ratingDisplay = eventRatings.length > 0 ? ratingStars + ' ' + avgRating.toFixed(1) + ' (' + eventRatings.length + ' ' + t('reviews') + ')' : t('notYetRated');

    let organizerDisplay = event.organizerName || event.organizer || 'Unknown';
    if (!organizerDisplay.startsWith('@')) organizerDisplay = '@' + organizerDisplay;

    let durationDisplay = '';
    if (event.durationValue && event.durationUnit) {
        const unitLabels = {
            hours: event.durationValue === 1 ? 'Hour' : 'Hours',
            days: event.durationValue === 1 ? 'Day' : 'Days',
            weeks: event.durationValue === 1 ? 'Week' : 'Weeks',
            months: event.durationValue === 1 ? 'Month' : 'Months',
            years: event.durationValue === 1 ? 'Year' : 'Years'
        };
        durationDisplay = event.durationValue + ' ' + (unitLabels[event.durationUnit] || event.durationUnit);
    }

    content.innerHTML = `
        <div class="event-detail-header-simple">
            <button class="back-btn-detail" onclick="closeEventDetailModalAndGoBack()" title="${t('back')}"><i class="fas fa-arrow-left"></i></button>
            <span class="detail-title-header">${escapeHtml(event.title)}</span>
            <span class="detail-category-tag-simple">${escapeHtml(event.category)}</span>
            <button class="modal-close-detail" onclick="closeEventDetailModalAndGoBack()" title="${t('close')}"><i class="fas fa-times"></i></button>
        </div>
        <div class="event-detail-body-simple">
            ${carouselHtml}

            <div class="event-detail-description">
                <h4>${t('fullDescription')}</h4>
                <p>${event.description || 'No description'}</p>
            </div>

            <div class="event-detail-info-box">
                <div class="event-location-line"><i class="fas fa-map-marker-alt" style="color:#f5a623;"></i> ${countryFlag} ${escapeHtml(countryDisplay)}${event.location ? ` · ${escapeHtml(event.location)}` : ''}</div>
                <div class="event-datetime-line"><i class="fas fa-calendar-day" style="color:#f5a623;"></i> ${dateFormatted} · <i class="fas fa-clock" style="color:#f5a623;"></i> ${timeFormatted}${durationDisplay ? ` · <i class="fas fa-hourglass-half" style="color:#f5a623;"></i> ${durationDisplay}` : ''}</div>
            </div>

            <div class="event-detail-price-seats-simple">
                <span class="price-simple">${priceDisplay}</span>
                <span class="seats-simple"><i class="fas fa-users"></i> ${event.seatsLeft}/${event.seatsTotal} ${t('tickets')}</span>
            </div>

            <div class="event-detail-conditions">
                <h4>${t('conditions')}</h4>
                ${conditionsHtml}
            </div>

            <div class="event-detail-meta">
                <h4>${t('information')}</h4>
                <div class="meta-grid">
                    <div class="meta-item"><span class="meta-label">${t('organizer')}</span><span class="meta-value">${escapeHtml(organizerDisplay)}</span></div>
                    <div class="meta-item"><span class="meta-label">${t('createdOn')}</span><span class="meta-value">${new Date(event.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span></div>
                    <div class="meta-item"><span class="meta-label">${t('seatsLeft')}</span><span class="meta-value">${event.seatsLeft}/${event.seatsTotal}</span></div>
                    <div class="meta-item"><span class="meta-label">${t('rating')}</span><span class="meta-value">${ratingDisplay}</span></div>
                </div>
            </div>

            <div class="event-detail-reviews">
                <h4>${t('reviews')}</h4>
                ${reviewsHtml}
            </div>
        </div>

        <div class="event-detail-footer-simple">
            <button class="btn-buy-simple" id="detailBuyBtnSimple"><i class="fas fa-ticket-alt"></i> ${t('buyTicket')}</button>
        </div>
    `;

    document.getElementById('detailBuyBtnSimple').onclick = function() {
        closeEventDetailModalAndGoBack();
        setTimeout(() => openQuantityPopup(event.id), 300);
    };

    modal.classList.add('show');
    modal.style.display = 'flex';
    document.body.style.overflow = 'hidden';
    setTimeout(() => { const body = document.querySelector('.event-detail-body-simple'); if (body) body.scrollTop = 0; }, 100);

    if (images.length > 1) {
        window._carousels = window._carousels || {};
        window._carousels[event.id] = { currentIndex: 0, totalSlides: images.length, trackId: 'carousel-track-' + event.id, dotsId: 'carousel-dots-' + event.id, eventId: event.id };
        const counter = document.getElementById('carousel-current-' + event.id);
        if (counter) counter.textContent = '1';
    }
}

function closeEventDetailModalAndGoBack() {
    const modal = document.getElementById('eventDetailModal');
    if (modal) { modal.classList.remove('show'); modal.style.display = 'none'; document.body.style.overflow = ''; }
    if (window._carousels) { for (let key in window._carousels) delete window._carousels[key]; }
    setTimeout(() => {
        if (pageHistory.length > 1) { pageHistory.pop(); showPage(pageHistory[pageHistory.length - 1] || 'home'); } else showPage('home');
    }, 50);
}

function closeEventDetailModal() {
    const modal = document.getElementById('eventDetailModal');
    if (modal) { modal.classList.remove('show'); modal.style.display = 'none'; document.body.style.overflow = ''; }
    if (window._carousels) { for (let key in window._carousels) delete window._carousels[key]; }
}

function carouselGoTo(eventId, index) {
    const carousel = window._carousels && window._carousels[eventId];
    if (!carousel) return;
    const track = document.getElementById(carousel.trackId);
    if (!track) return;
    const total = carousel.totalSlides;
    if (index < 0) index = total - 1;
    if (index >= total) index = 0;
    carousel.currentIndex = index;
    track.style.transform = 'translateX(' + (-index * 100) + '%)';
    document.querySelectorAll('#' + carousel.dotsId + ' .cdot').forEach((dot, i) => dot.classList.toggle('active', i === index));
    const counter = document.getElementById('carousel-current-' + eventId);
    if (counter) counter.textContent = index + 1;
}

function carouselPrev(eventId) {
    const carousel = window._carousels && window._carousels[eventId];
    if (!carousel) return;
    carouselGoTo(eventId, carousel.currentIndex - 1);
}
function carouselNext(eventId) {
    const carousel = window._carousels && window._carousels[eventId];
    if (!carousel) return;
    carouselGoTo(eventId, carousel.currentIndex + 1);
}

function openGallery(eventId, startIndex) {
    const event = events.find(e => e.id === eventId);
    if (!event) return;
    const images = event.images && event.images.length ? event.images : [eventImagesList[event.category]];
    let currentIndex = startIndex || 0;
    let modal = document.getElementById('fullGalleryModal');
    if (!modal) {
        modal = document.createElement('div');
        modal.id = 'fullGalleryModal';
        modal.className = 'gallery-modal';
        modal.innerHTML = '<span class="gallery-close">&times;</span><img id="galleryCurrentImage" src=""><div class="gallery-nav"><button id="galleryPrev">' + t('back') + '</button><button id="galleryNext">' + t('viewAll') + '</button></div>';
        document.body.appendChild(modal);
        document.querySelector('#fullGalleryModal .gallery-close').onclick = function() { document.getElementById('fullGalleryModal').classList.remove('show'); };
    }
    const imgElement = document.getElementById('galleryCurrentImage');
    const prevBtn = document.getElementById('galleryPrev');
    const nextBtn = document.getElementById('galleryNext');
    function updateImage(index) { if (index < 0) index = images.length - 1; if (index >= images.length) index = 0; currentIndex = index; imgElement.src = images[currentIndex]; }
    updateImage(currentIndex);
    prevBtn.onclick = function() { updateImage(currentIndex - 1); };
    nextBtn.onclick = function() { updateImage(currentIndex + 1); };
    modal.classList.add('show');
}

function initFilters() {
    const cats = ['All', 'Concert', 'Sport', 'Conference', 'Training', 'Cinema', 'Festival', 'Theatre', 'Dance', 'Exhibition', 'Gala', 'Seminar', 'Formation'];
    const container = document.getElementById('filtersContainer');
    if (!container) return;
    container.innerHTML = cats.map(c => `<div class="filter-chip ${c === currentFilter ? 'active' : ''}" data-category="${c}">${c === 'All' ? t('all') : c}</div>`).join('');
    document.querySelectorAll('.filter-chip').forEach(chip => chip.addEventListener('click', function() { currentFilter = this.dataset.category; initFilters(); renderEventsByCategory(); }));
}

function trackUserConnection() {
    if (!currentUser.wallet) return;
    let existing = connectedUsers.find(u => u.wallet === currentUser.wallet);
    const userData = { name: currentUser.name, wallet: currentUser.wallet, ticketCount: tickets.length, lastSeen: new Date().toLocaleString(), loyaltyPoints: currentUser.loyaltyPoints || 0, memberSince: currentUser.memberSince || '2026' };
    if (!existing) connectedUsers.push(userData);
    else { Object.assign(existing, userData); }
    localStorage.setItem('betix_connected_users', JSON.stringify(connectedUsers));
    syncUserToSupabase();
}

async function verifySupabasePersistence() {
    try {
        const supabaseEvents = await loadEventsFromSupabase();
        const piUid = currentUser.piUid || currentUser.wallet;
        const supabaseTickets = piUid ? await loadTicketsFromSupabase(piUid) : [];
        const supabaseNotifs = piUid ? await loadNotificationsFromSupabase(piUid) : [];
        alert(`Vérification terminée. Événements: ${supabaseEvents.length}, Tickets: ${supabaseTickets.length}, Notifications: ${supabaseNotifs.length}`);
        return { events: supabaseEvents.length, tickets: supabaseTickets.length, notifications: supabaseNotifs.length, memoryEvents: events.length, memoryTickets: tickets.length };
    } catch (error) { alert('Erreur: ' + error.message); return null; }
}

async function forceFullSync() {
    try {
        await syncEventsToSupabase();
        await syncTicketsToSupabase();
        await syncNotificationsToSupabase();
        await syncUserToSupabase();
        alert('Synchronisation complète terminée !');
        return true;
    } catch (error) { alert('Erreur: ' + error.message); return false; }
}

window.verifySupabasePersistence = verifySupabasePersistence;
window.forceFullSync = forceFullSync;

function clearAllData() { if (confirm(t('clearDataConfirm'))) { localStorage.clear(); location.reload(); } }
function toggleDarkMode(e) { if (e.target.checked) { document.body.classList.add('dark-mode'); localStorage.setItem('darkMode', 'true'); } else { document.body.classList.remove('dark-mode'); localStorage.setItem('darkMode', 'false'); } }

function showLegal(type) {
    const modal = document.getElementById('legalModal');
    const content = document.getElementById('modalContent');
    const closeBtn = document.getElementById('legalModalClose');
    const texts = {
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

function initChat() {
    const widget = document.getElementById('chatWidget');
    const btn = document.getElementById('chatFloatBtn');
    const close = document.getElementById('chatCloseBtn');
    const send = document.getElementById('chatSendBtn');
    const input = document.getElementById('chatInput');
    const msgs = document.getElementById('chatMessages');
    if (!widget) return;
    function load() {
        if (!msgs) return;
        msgs.innerHTML = '';
        if (!chatMessages || chatMessages.length === 0) {
            const empty = document.createElement('div');
            empty.className = 'chat-message support';
            empty.innerHTML = '<div class="message-bubble">Hello! How can we help you today?</div>';
            msgs.appendChild(empty);
            return;
        }
        chatMessages.forEach(m => addMessage(m));
    }
    function addMessage(m) {
        if (!msgs) return;
        const d = document.createElement('div');
        d.className = 'chat-message ' + (m.isUser ? 'user' : 'support');
        d.innerHTML = `<div class="message-bubble">${escapeHtml(m.text)}</div><span class="message-time">${m.time}</span>`;
        msgs.appendChild(d);
        msgs.scrollTop = msgs.scrollHeight;
    }
    if (btn) btn.addEventListener('click', function() { widget.classList.toggle('open'); });
    if (close) close.addEventListener('click', function() { widget.classList.remove('open'); });
    function sendMsg() {
        const msg = input.value.trim();
        if (!msg) return;
        const newMsg = { id: Date.now(), text: msg, sender: currentUser.wallet || currentUser.name, isUser: true, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), timestamp: new Date().toISOString() };
        chatMessages.push(newMsg);
        saveChatMessages();
        addMessage(newMsg);
        input.value = '';
        setTimeout(() => {
            let resp = "Thank you! Quick response by email: betixservices@gmail.com";
            if (msg.toLowerCase().includes('ticket')) resp = "Your tickets are in the 'My Tickets' section.";
            else if (msg.toLowerCase().includes('payment')) resp = "Payments are secured via Pi Network.";
            const auto = { id: Date.now() + 1, text: resp, sender: 'Betix Support', isUser: false, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), timestamp: new Date().toISOString() };
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
    const modal = document.getElementById('legalModal'), content = document.getElementById('modalContent'), close = document.querySelector('#legalModal .modal-close');
    if (close) close.onclick = function() { modal.classList.remove('show'); };
    window.onclick = function(e) { if (e.target === modal) modal.classList.remove('show'); };
}

function initHeroSlider() {
    const slidesContainer = document.getElementById('heroSlides');
    if (!slidesContainer) return;
    slidesContainer.innerHTML = '';
    heroSlides.forEach((slide, index) => {
        const div = document.createElement('div');
        div.className = 'hero-slide' + (index === 0 ? ' active' : '');
        div.innerHTML = `<div class="hero-slide-bg" style="background-image: url('${slide.image}');"></div><div class="hero-slide-content"><div class="hero-badge">${slide.badge || 'Event'}</div><h2>${slide.title}</h2><p>${slide.description || ''}</p></div>`;
        slidesContainer.appendChild(div);
    });
    const dotsContainer = document.getElementById('heroDots');
    if (dotsContainer) {
        dotsContainer.innerHTML = '';
        heroSlides.forEach((slide, i) => {
            const dot = document.createElement('button');
            dot.className = 'dot' + (i === 0 ? ' active' : '');
            dot.setAttribute('data-index', i);
            dot.addEventListener('click', function() { const idx = parseInt(this.getAttribute('data-index')); stopAutoPlay(); goToSlide(idx); setTimeout(startAutoPlay, 3000); });
            dotsContainer.appendChild(dot);
        });
    }
    const slides = document.querySelectorAll('.hero-slide');
    const dots = document.querySelectorAll('.hero-dots .dot');
    const prevBtn = document.getElementById('heroPrev');
    const nextBtn = document.getElementById('heroNext');
    let currentIndex = 0;
    const totalSlides = heroSlides.length;
    let autoPlayInterval = null;
    let isTransitioning = false;
    function goToSlide(index) {
        if (isTransitioning || totalSlides === 0) return;
        isTransitioning = true;
        if (index < 0) index = totalSlides - 1;
        if (index >= totalSlides) index = 0;
        currentIndex = index;
        slidesContainer.style.transition = 'transform 0.7s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
        slidesContainer.style.transform = 'translateX(' + (-currentIndex * 100) + '%)';
        slides.forEach((slide, i) => {
            slide.classList.remove('active');
            if (i === currentIndex) {
                slide.classList.add('active');
                const bg = slide.querySelector('.hero-slide-bg');
                if (bg) { bg.style.transition = 'none'; bg.style.transform = 'scale(1.05)'; setTimeout(() => { bg.style.transition = 'transform 8s ease'; bg.style.transform = 'scale(1)'; }, 50); }
            }
        });
        dots.forEach((dot, i) => dot.classList.toggle('active', i === currentIndex));
        setTimeout(() => { isTransitioning = false; }, 750);
    }
    function nextSlide() { if (totalSlides > 0) goToSlide(currentIndex + 1); }
    function prevSlide() { if (totalSlides > 0) goToSlide(currentIndex - 1); }
    function startAutoPlay() {
        stopAutoPlay();
        if (totalSlides > 1) autoPlayInterval = setInterval(() => { if (!isTransitioning) nextSlide(); }, 4000);
    }
    function stopAutoPlay() { if (autoPlayInterval) { clearInterval(autoPlayInterval); autoPlayInterval = null; } }
    if (prevBtn) prevBtn.onclick = function() { stopAutoPlay(); prevSlide(); setTimeout(startAutoPlay, 3000); };
    if (nextBtn) nextBtn.onclick = function() { stopAutoPlay(); nextSlide(); setTimeout(startAutoPlay, 3000); };
    const hero = document.querySelector('.hero');
    if (hero) { hero.onmouseenter = stopAutoPlay; hero.onmouseleave = startAutoPlay; }
    startAutoPlay();
}

function filterByCountry(country) { currentCountryFilter = country; renderEventsByCategory(); }

function handleLogoClick() {
    logoClickCount++;
    if (logoClickCount >= 5) {
        const password = prompt('Enter administrator password:');
        if (password === adminPassword || password === 'Betix@2026#') {
            localStorage.setItem('betix_admin_password', password);
            adminPassword = password;
            const adminBtn = document.getElementById('adminMenuItem');
            if (adminBtn) { adminBtn.style.display = 'block'; adminBtn.style.background = 'linear-gradient(135deg, #1a1a2e, #08143F)'; adminBtn.style.color = 'white'; }
            addAdminLog('Admin authentication', 'Login via logo');
            alert('Administrator access activated!');
            logoClickCount = 0;
        } else if (password !== null) { alert('Incorrect password'); logoClickCount = 0; } else { logoClickCount = 0; }
    }
}

function updateUserInfo() {
    document.getElementById('sidebarName') && (document.getElementById('sidebarName').textContent = currentUser.name || t('guest'));
    document.getElementById('sidebarWallet') && (document.getElementById('sidebarWallet').textContent = currentUser.wallet ? 'Connected' : t('notConnected'));
    document.getElementById('sidebarAvatarText') && (document.getElementById('sidebarAvatarText').textContent = (currentUser.name || 'U')[0].toUpperCase());
    document.getElementById('profileNameDisplay') && (document.getElementById('profileNameDisplay').textContent = currentUser.name || t('guest'));
    document.getElementById('profileWalletDisplay') && (document.getElementById('profileWalletDisplay').textContent = currentUser.wallet || t('notConnected'));
    document.getElementById('memberSince') && (document.getElementById('memberSince').textContent = currentUser.memberSince || '2026');
    updateConnectButtons();
    updateSidebarNotifBadge();
    updateUITranslations();
    updateScanButtonVisibility();
}

function updateProfilePage() {
    const myEvents = events.filter(e => e.organizer === currentUser.wallet || e.organizerName === currentUser.name);
    const userTickets = tickets.filter(t => t.userWallet === currentUser.wallet || t.buyerWallet === currentUser.wallet);
    const userRatings = ratings.filter(r => r.userWallet === currentUser.wallet || r.userWallet === currentUser.name);
    document.getElementById('myEventsCount') && (document.getElementById('myEventsCount').textContent = myEvents.length);
    document.getElementById('ticketCount') && (document.getElementById('ticketCount').textContent = userTickets.length);
    document.getElementById('historyCount') && (document.getElementById('historyCount').textContent = tickets.filter(t => (usedTickets.indexOf(t.id) !== -1 || new Date(t.eventDate) <= new Date()) && (t.userWallet === currentUser.wallet || t.buyerWallet === currentUser.wallet)).length);
    document.getElementById('ratedCount') && (document.getElementById('ratedCount').textContent = userRatings.length);
    document.getElementById('profileRatingDisplay') && (document.getElementById('profileRatingDisplay').textContent = userRatings.length);
    document.getElementById('profileLoyaltyDisplay') && (document.getElementById('profileLoyaltyDisplay').textContent = currentUser.loyaltyPoints || 0);
    document.getElementById('profileNameDisplay') && (document.getElementById('profileNameDisplay').textContent = currentUser.name || t('guest'));
    document.getElementById('profileWalletDisplay') && (document.getElementById('profileWalletDisplay').textContent = currentUser.wallet || t('notConnected'));
    document.getElementById('memberSince') && (document.getElementById('memberSince').textContent = currentUser.memberSince || '2026');
    updateScanButtonVisibility();
}

function userHasPublishedEvents() {
    if (!currentUser.wallet && !currentUser.piUid) return false;
    const userId = currentUser.piUid || currentUser.wallet;
    return events.some(e => e.organizer === userId || e.organizerPiUid === userId || e.organizerName === currentUser.name);
}

function updateScanButtonVisibility() {
    const scanBtn = document.getElementById('scanMenuItem');
    if (!scanBtn) return;
    scanBtn.style.display = userHasPublishedEvents() ? 'block' : 'none';
}

// ============================================================
// ADMIN FUNCTIONS (intégrales)
// ============================================================
function initAdmin() {
    const adminItem = document.getElementById('adminMenuItem');
    if (!adminItem) return;
    const logo = document.querySelector('.logo');
    let clicks = 0;
    if (logo) logo.addEventListener('click', function() {
        clicks++;
        if (clicks === 5) {
            const pwd = prompt('Admin code:');
            if (pwd === adminPassword || pwd === 'Betix@2026#') {
                localStorage.setItem('betix_admin_password', pwd);
                adminPassword = pwd;
                adminItem.style.display = 'block';
                adminItem.style.background = 'linear-gradient(135deg, #1a1a2e, #08143F)';
                adminItem.style.color = 'white';
                addAdminLog('Admin authentication', 'Login via logo');
                alert('Admin activated');
            }
            clicks = 0;
        }
        setTimeout(() => { clicks = 0; }, 2000);
    });
    if (localStorage.getItem('betix_admin_password') === adminPassword || localStorage.getItem('betix_admin_password') === 'Betix@2026#') {
        adminItem.style.display = 'block';
        adminItem.style.background = 'linear-gradient(135deg, #1a1a2e, #08143F)';
        adminItem.style.color = 'white';
    }
}

function addAdminLog(action, details) {
    const log = { id: Date.now(), timestamp: new Date().toISOString(), date: new Date().toLocaleString('en-US'), user: currentUser.wallet || 'Local Admin', action, details: details || '' };
    adminLogs.unshift(log);
    if (adminLogs.length > 500) adminLogs = adminLogs.slice(0, 500);
    localStorage.setItem('betix_admin_logs', JSON.stringify(adminLogs));
    renderAdminLogs();
}

function renderAdminLogs() {
    const container = document.getElementById('adminLogsList');
    if (!container) return;
    if (adminLogs.length === 0) { container.innerHTML = '<p style="text-align:center;padding:20px;color:var(--gray);">No logs available</p>'; return; }
    container.innerHTML = adminLogs.map(log =>
        `<div class="admin-log-item"><div><span class="log-user">${escapeHtml(log.user)}</span> <span class="log-action">${escapeHtml(log.action)}</span>${log.details ? ' <span style="color:var(--gray);font-size:0.8rem;">' + escapeHtml(log.details) + '</span>' : ''}</div><span class="log-time">${escapeHtml(log.date)}</span></div>`
    ).join('');
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
    localStorage.setItem('betix_admin_last_login', new Date().toLocaleString('en-US'));
    const loginCount = parseInt(localStorage.getItem('betix_admin_login_count') || 0) + 1;
    localStorage.setItem('betix_admin_login_count', loginCount);
    adminSessionTimer = 1800;
    updateAdminTimerDisplay();
    if (adminTimerInterval) clearInterval(adminTimerInterval);
    adminTimerInterval = setInterval(() => {
        adminSessionTimer--;
        updateAdminTimerDisplay();
        if (adminSessionTimer <= 0) { clearInterval(adminTimerInterval); adminTimerInterval = null; adminLogout(); }
    }, 1000);
    document.addEventListener('click', resetAdminTimer);
    document.addEventListener('keydown', resetAdminTimer);
    document.addEventListener('scroll', resetAdminTimer);
}

function resetAdminTimer() { if (adminTimerInterval) { adminSessionTimer = 1800; updateAdminTimerDisplay(); } }

function updateAdminTimerDisplay() {
    const display = document.getElementById('adminSessionTimer');
    if (display) {
        const minutes = Math.floor(adminSessionTimer / 60);
        const seconds = adminSessionTimer % 60;
        display.textContent = String(minutes).padStart(2, '0') + ':' + String(seconds).padStart(2, '0');
        display.style.color = adminSessionTimer < 300 ? '#ef4444' : adminSessionTimer < 600 ? '#f59e0b' : '#f5a623';
    }
}

function adminLogout() {
    if (adminTimerInterval) { clearInterval(adminTimerInterval); adminTimerInterval = null; }
    document.removeEventListener('click', resetAdminTimer);
    document.removeEventListener('keydown', resetAdminTimer);
    document.removeEventListener('scroll', resetAdminTimer);
    addAdminLog('Admin logout', 'Session ended');
    localStorage.removeItem('betix_admin_password');
    const adminBtn = document.getElementById('adminMenuItem');
    if (adminBtn) adminBtn.style.display = 'none';
    alert('Admin session ended');
    showPage('home');
}

function adminChangePassword() {
    const newPassword = document.getElementById('adminNewPassword').value;
    const confirmPassword = document.getElementById('adminConfirmPassword').value;
    const message = document.getElementById('adminPasswordMessage');
    if (!newPassword || newPassword.length < 6) { message.textContent = 'Password must be at least 6 characters'; message.style.color = '#ef4444'; return; }
    if (newPassword !== confirmPassword) { message.textContent = 'Passwords do not match'; message.style.color = '#ef4444'; return; }
    adminPassword = newPassword;
    localStorage.setItem('betix_admin_password', newPassword);
    message.textContent = 'Password changed successfully!';
    message.style.color = '#10b981';
    document.getElementById('adminNewPassword').value = '';
    document.getElementById('adminConfirmPassword').value = '';
    addAdminLog('Password changed', 'Admin password was updated');
    setTimeout(() => { message.textContent = ''; }, 3000);
}

function loadAdminPage() {
    const storedPassword = localStorage.getItem('betix_admin_password');
    if (storedPassword !== adminPassword && storedPassword !== 'Betix@2026#') { alert('Access denied. Please authenticate via 5 clicks on the logo.'); showPage('home'); return; }
    if (storedPassword && storedPassword !== adminPassword) adminPassword = storedPassword;
    document.getElementById('adminUserCount').innerText = connectedUsers.length || 1;
    document.getElementById('adminTicketCount').innerText = tickets.length;
    document.getElementById('adminEventCount').innerText = events.length;
    document.getElementById('adminLastLogin').textContent = localStorage.getItem('betix_admin_last_login') || 'Never';
    document.getElementById('adminLoginCount').textContent = localStorage.getItem('betix_admin_login_count') || 0;
    document.getElementById('adminCurrentPasswordDisplay').textContent = '••••••••';
    renderAdminEvents(); renderAdminSlides(); renderAdminUsers(); renderAdminLogs();
    initAdminTabs();
    if (!adminTimerInterval) startAdminSession();
    const userSearch = document.getElementById('adminUserSearch');
    if (userSearch) userSearch.addEventListener('input', function() { filterAdminUsers(this.value); });
}

function filterAdminUsers(query) {
    const container = document.getElementById('adminUsersList');
    if (!container) return;
    const rows = container.querySelectorAll('tr');
    const search = query.toLowerCase().trim();
    rows.forEach((row, index) => {
        if (index === 0) return;
        if (search === '' || row.textContent.toLowerCase().includes(search)) row.style.display = '';
        else row.style.display = 'none';
    });
}

function renderAdminUsers() {
    const container = document.getElementById('adminUsersList');
    if (!container) return;
    let html = '<table><tr><th>User</th><th>Pi Account</th><th>Tickets</th><th>Average Rating</th><th>Last Seen</th></tr>';
    const userRatings = ratings.filter(r => r.userWallet === (currentUser.wallet || currentUser.name));
    const avgRating = userRatings.length ? userRatings.reduce((a,r) => a + r.rating, 0) / userRatings.length : 0;
    html += `<tr><td>${escapeHtml(currentUser.name)} <span style="color:#f5a623;font-size:0.7rem;">(you)</span></td><td>${currentUser.wallet || 'Not connected'}</td><td>${tickets.length}</td><td>${avgRating > 0 ? avgRating.toFixed(1) + '/5' : '-'}</td><td>Active</td></tr>`;
    connectedUsers.forEach(u => {
        if (u.wallet !== currentUser.wallet) {
            const uRatings = ratings.filter(r => r.userWallet === u.wallet);
            const uAvg = uRatings.length ? uRatings.reduce((a,r) => a + r.rating, 0) / uRatings.length : 0;
            html += `<tr><td>${escapeHtml(u.name)}</td><td>${u.wallet || 'Not connected'}</td><td>${u.ticketCount || 0}</td><td>${uAvg > 0 ? uAvg.toFixed(1) + '/5' : '-'}</td><td>${u.lastSeen || 'Unknown'}</td></tr>`;
        }
    });
    html += '</table>';
    container.innerHTML = html;
}

function renderAdminEvents() {
    const container = document.getElementById('adminEventsList');
    if (!container) return;
    if (events.length === 0) { container.innerHTML = '<p style="color: var(--gray); text-align:center; padding:20px;">No events created</p>'; return; }
    container.innerHTML = events.map(e => {
        const typesDisplay = 'Standard: ' + (e.ticketTypes?.standard?.price || 0).toFixed(6) + ' Pi';
        return `<div class="admin-event-item"><div class="event-info"><strong>${escapeHtml(e.title)}</strong><small>${e.category} | ${e.pays || e.country || 'France'} | ${e.seatsLeft}/${e.seatsTotal} tickets | ${new Date(e.date).toLocaleDateString('en-US')}</small><small>Ticket Types: ${typesDisplay}</small><small>Organizer: ${escapeHtml(e.organizerName || e.organizer)}</small></div><div class="event-actions"><button class="admin-delete-btn" onclick="adminDeleteEvent('${e.id}')">Cancel</button></div></div>`;
    }).join('');
}

function adminDeleteEvent(id) {
    if (confirm('Delete this event?')) {
        events = events.filter(e => e.id !== id);
        saveEvents();
        deleteEventFromSupabase(id);
        renderAdminEvents(); renderEventsByCategory();
        document.getElementById('adminEventCount').innerText = events.length;
        addAdminLog('Event deleted', 'ID: ' + id);
        alert('Event deleted');
    }
}

function adminDeleteAllEvents() {
    if (confirm('Delete ALL events? This action is irreversible.')) {
        events = [];
        saveEvents();
        renderAdminEvents(); renderEventsByCategory();
        document.getElementById('adminEventCount').innerText = 0;
        addAdminLog('All events deleted', 'Mass deletion');
        alert('All events have been deleted');
    }
}

function renderAdminSlides() {
    const container = document.getElementById('adminSlidesList');
    if (!container) return;
    if (heroSlides.length === 0) { container.innerHTML = '<p style="color: var(--gray); text-align:center; padding:20px;">No images in carousel</p>'; return; }
    container.innerHTML = heroSlides.map((slide, index) =>
        `<div class="admin-slide-item"><img src="${slide.image}" class="slide-preview" onerror="this.style.display='none'"><div class="slide-info"><h4>${escapeHtml(slide.title)}</h4><p>${slide.badge || 'Uncategorized'} • ${slide.description || ''}</p></div><div class="slide-actions"><button class="edit-btn" onclick="adminEditSlide(${index})">Edit</button><button class="delete-btn" onclick="adminDeleteSlide(${index})">Cancel</button></div></div>`
    ).join('');
}

function adminShowSlideForm(index) {
    const container = document.getElementById('adminSlideFormContainer');
    const title = document.getElementById('adminSlideFormTitle');
    const imageInput = document.getElementById('adminSlideImageInput');
    const preview = document.getElementById('adminSlidePreview');
    const uploadBox = document.getElementById('adminUploadBox');
    preview.style.display = 'none'; preview.src = ''; uploadBox.classList.remove('has-image'); imageInput.value = '';
    container.style.display = 'block';
    if (index >= 0 && index < heroSlides.length) {
        title.textContent = 'Edit carousel image';
        document.getElementById('adminSlideBadge').value = heroSlides[index].badge || '';
        document.getElementById('adminSlideTitle').value = heroSlides[index].title || '';
        document.getElementById('adminSlideDesc').value = heroSlides[index].description || '';
        document.getElementById('adminEditSlideIndex').value = index;
        if (heroSlides[index].image) { preview.src = heroSlides[index].image; preview.style.display = 'block'; uploadBox.classList.add('has-image'); }
    } else {
        title.textContent = 'Add carousel image';
        document.getElementById('adminSlideBadge').value = '';
        document.getElementById('adminSlideTitle').value = '';
        document.getElementById('adminSlideDesc').value = '';
        document.getElementById('adminEditSlideIndex').value = '-1';
    }
    container.scrollIntoView({ behavior: 'smooth' });
}

async function adminSaveSlide() {
    const imageInput = document.getElementById('adminSlideImageInput');
    const badgeInput = document.getElementById('adminSlideBadge');
    const titleInput = document.getElementById('adminSlideTitle');
    const descInput = document.getElementById('adminSlideDesc');
    const editIndex = document.getElementById('adminEditSlideIndex');
    const badge = badgeInput.value.trim();
    const title = titleInput.value.trim();
    const description = descInput.value.trim();
    if (!title) { alert('Please enter a title'); return; }
    let imageData = null;
    if (imageInput.files && imageInput.files[0]) {
        const file = imageInput.files[0];
        if (!file.type.startsWith('image/')) { alert('Please select an image'); return; }
        if (file.size > 5 * 1024 * 1024) { alert('Image is too large (max 5MB)'); return; }
        const compressedData = await compressImage(file);
        const url = await uploadHeroImage(compressedData, title.replace(/\s+/g, '_'));
        if (!url) { alert('Error uploading image'); return; }
        imageData = url;
    } else {
        const index = parseInt(editIndex.value);
        if (index >= 0 && index < heroSlides.length) imageData = heroSlides[index].image;
        else { alert('Please select an image'); return; }
    }
    const slideData = { image: imageData, badge, title, description };
    const indexToSave = parseInt(editIndex.value);
    if (indexToSave >= 0 && indexToSave < heroSlides.length) slideData.id = heroSlides[indexToSave].id;
    const saved = await saveHeroSlideToSupabase(slideData, indexToSave);
    if (!saved) { alert('Error saving slide (see console for details)'); return; }
    await loadHeroSlides();
    adminCancelSlideForm();
    alert('Slide saved successfully!');
}

async function adminDeleteSlide(index) {
    if (!confirm('Delete this carousel image?')) return;
    const slide = heroSlides[index];
    if (!slide) return;
    const deleted = await deleteHeroSlideFromSupabase(slide.id);
    if (!deleted) { alert('Error deleting slide'); return; }
    await loadHeroSlides();
    addAdminLog('Slide deleted', 'Title: ' + slide.title);
}

function adminEditSlide(index) { adminShowSlideForm(index); }
function adminCancelSlideForm() {
    document.getElementById('adminSlideFormContainer').style.display = 'none';
    document.getElementById('adminEditSlideIndex').value = '-1';
    document.getElementById('adminSlideImageInput').value = '';
    document.getElementById('adminSlidePreview').style.display = 'none';
    document.getElementById('adminSlidePreview').src = '';
    document.getElementById('adminUploadBox').classList.remove('has-image');
}

function initAdminTabs() {
    const tabs = document.querySelectorAll('.admin-tab');
    const contents = { events: document.getElementById('adminTabEvents'), slides: document.getElementById('adminTabSlides'), users: document.getElementById('adminTabUsers'), logs: document.getElementById('adminTabLogs'), settings: document.getElementById('adminTabSettings') };
    tabs.forEach(tab => {
        tab.addEventListener('click', function() {
            tabs.forEach(t => t.classList.remove('active'));
            this.classList.add('active');
            for (let key in contents) if (contents[key]) contents[key].classList.remove('active');
            if (contents[this.dataset.tab]) contents[this.dataset.tab].classList.add('active');
        });
    });
}

function renderMyEvents() {
    const container = document.getElementById('myEventsList');
    if (!container) return;
    const myEvents = events.filter(e => e.organizer === currentUser.wallet || e.organizerName === currentUser.name);
    if (myEvents.length === 0) {
        container.innerHTML = `<div style="text-align:center;padding:3rem;color:var(--gray);background:#f9fafb;border-radius:16px;border:1px solid #e5e7eb;"><i class="fas fa-calendar-plus" style="font-size:2.5rem;color:var(--primary);margin-bottom:12px;display:block;"></i><p style="font-size:1rem;font-weight:500;margin-bottom:4px;">${t('noEvents')}</p><p style="font-size:0.85rem;">${t('createEvent')}</p></div>`;
        return;
    }
    container.innerHTML = myEvents.map(e => renderMyEventCardModern(e)).join('');
    updateScanButtonVisibility();
}

function renderMyEventCardModern(event) {
    const dateEvent = new Date(event.date);
    const dateFormatted = dateEvent.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    const timeFormatted = dateEvent.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    const fallbackImage = eventImagesList[event.category] || 'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?w=600&h=400&fit=crop';
    const imageUrl = event.coverImage || (event.images && event.images[0]) || fallbackImage;
    const ticketSold = tickets.filter(t => t.eventId === event.id).length;
    let statusBadge = '', statusClass = '';
    if (event.seatsLeft <= 0) { statusBadge = t('soldOut'); statusClass = 'sold-out'; }
    else if (new Date(event.date) < new Date()) { statusBadge = t('ended'); statusClass = 'ended'; }
    else { statusBadge = t('new'); statusClass = ''; }
    const countryFlag = countryFlags[event.pays || event.country] || '';
    const countryDisplay = event.pays || event.country || 'International';
    let durationDisplay = '';
    if (event.durationValue && event.durationUnit) {
        const unitLabels = { hours: 'Hour', days: 'Day', weeks: 'Week', months: 'Month', years: 'Year' };
        durationDisplay = event.durationValue + ' ' + (unitLabels[event.durationUnit] || event.durationUnit);
    }
    const typesDisplay = event.ticketTypes?.standard?.enabled ? 'Standard: ' + (event.ticketTypes.standard.price || 0).toFixed(6) + ' Pi' : 'No ticket types';
    return `<div class="my-event-card-modern"><div class="event-image-wrapper"><img src="${imageUrl}" class="event-image" alt="${escapeHtml(event.title)}" onerror="this.src='${fallbackImage}'"><span class="event-status-badge-modern ${statusClass}">${statusBadge}</span></div><div class="event-body-modern"><div class="event-title-modern">${escapeHtml(event.title)}</div><div class="event-details-modern">
        <div class="detail-item-modern"><i class="fas fa-calendar-day"></i> <span class="detail-label">${t('eventDate')}</span> <span class="detail-value">${dateFormatted}</span></div>
        <div class="detail-item-modern"><i class="fas fa-clock"></i> <span class="detail-label">${t('eventTime')}</span> <span class="detail-value">${timeFormatted}</span></div>
        <div class="detail-item-modern"><i class="fas fa-map-marker-alt"></i> <span class="detail-label">${t('locationLabel')}</span> <span class="detail-value">${escapeHtml(event.location || 'Online')}</span></div>
        <div class="detail-item-modern"><span style="font-size:1rem;">${countryFlag}</span> <span class="detail-label">${t('countryLabel')}</span> <span class="detail-value">${escapeHtml(countryDisplay)}</span></div>
        <div class="detail-item-modern"><i class="fas fa-ticket-alt"></i> <span class="detail-label">${t('tickets')} Sold</span> <span class="detail-value">${ticketSold}</span></div>
        <div class="detail-item-modern"><i class="fas fa-users"></i> <span class="detail-label">${t('seatsLeft')}</span> <span class="detail-value">${event.seatsLeft}/${event.seatsTotal}</span></div>
        ${durationDisplay ? `<div class="detail-item-modern" style="grid-column:1/2;"><i class="fas fa-hourglass-half"></i> <span class="detail-label">${t('duration')}</span> <span class="detail-value">${durationDisplay}</span></div>` : ''}
        <div class="detail-item-modern" style="grid-column:${durationDisplay ? '2' : '1'}/-1;"><i class="fas fa-tags"></i> <span class="detail-label">${t('ticketTypes')}</span> <span class="detail-value" style="font-size:0.7rem;">${escapeHtml(typesDisplay)}</span></div>
    </div><div class="event-footer-modern"><div class="event-stats-modern"><span><i class="fas fa-eye"></i> ${event.boosts || 0} ${t('views')}</span><span><i class="fas fa-calendar-plus"></i> ${new Date(event.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span></div><div class="event-actions-modern"><button class="btn-edit-modern" onclick="event.stopPropagation(); openEditEventModal('${event.id}')"><i class="fas fa-pen"></i> ${t('editEvent')}</button></div></div></div></div>`;
}

function renderEventsByCategory() {
    const container = document.getElementById('eventsByCategory');
    if (!container) return;
    const filtered = events.filter(e => {
        const matchCategory = currentFilter === 'All' || e.category === currentFilter;
        const matchCountry = currentCountryFilter === 'All' || (e.pays || e.country) === currentCountryFilter;
        const matchSearch = e.title.toLowerCase().includes(searchQuery) || (e.location && e.location.toLowerCase().includes(searchQuery));
        return matchCategory && matchCountry && matchSearch;
    });
    if (filtered.length === 0) { container.innerHTML = `<p style="text-align:center;padding:2rem;color:var(--gray);">${t('noEvents')}</p>`; return; }
    const cats = ['Concert', 'Sport', 'Conference', 'Training', 'Cinema', 'Festival', 'Theatre', 'Dance', 'Exhibition', 'Gala', 'Seminar', 'Formation'];
    let html = '';
    if (currentFilter !== 'All') {
        html = '<div class="category-section"><div class="events-grid-centered">';
        filtered.forEach(e => html += renderEventCard(e));
        html += '</div></div>';
    } else {
        cats.forEach(cat => {
            const catEvents = filtered.filter(e => e.category === cat);
            if (catEvents.length) {
                html += `<div class="category-section"><div class="category-header">${cat}</div><div class="events-grid-centered">`;
                catEvents.forEach(e => html += renderEventCard(e));
                html += '</div></div>';
            }
        });
    }
    container.innerHTML = html;
}

// ============================================================
// QUANTITY POPUP & PURCHASE FLOW
// ============================================================
function openQuantityPopup(eventId) {
    const event = events.find(e => e.id === eventId);
    if (!event) { alert(t('eventNotFound')); return; }
    if (!piUser && !currentUser.wallet) { alert(t('pleaseConnect')); connectToPi(); return; }
    const standardLeft = event.standardLeft !== undefined ? event.standardLeft : (event.standardSeats || 0);
    if (standardLeft <= 0) { alert('Tous les billets sont épuisés pour cet événement'); return; }
    selectedEventForPurchase = event;
    const popup = document.getElementById('quantityPopup');
    const titleEl = document.getElementById('quantityEventTitle');
    const infoEl = document.getElementById('quantityEventInfo');
    const maxInfo = document.getElementById('maxQuantityInfo');
    const quantityInput = document.getElementById('ticketQuantity');
    const totalDisplay = document.getElementById('totalPriceDisplay');
    if (titleEl) titleEl.textContent = event.title;
    if (infoEl) {
        const dateEvent = new Date(event.date);
        infoEl.textContent = dateEvent.toLocaleDateString('en-US') + ' at ' + dateEvent.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }) + ' | ' + event.location;
    }
    if (quantityInput) { quantityInput.value = 1; quantityInput.min = 1; updateMaxQuantity(); }
    if (maxInfo) maxInfo.textContent = 'Maximum: ' + standardLeft + ' ticket(s) disponible(s)';
    updateTicketTotal();
    popup.classList.add('show');
}

function updateMaxQuantity() {
    const quantityInput = document.getElementById('ticketQuantity');
    const maxInfo = document.getElementById('maxQuantityInfo');
    if (!selectedEventForPurchase) return;
    const maxSeats = selectedEventForPurchase.standardLeft !== undefined ? selectedEventForPurchase.standardLeft : (selectedEventForPurchase.standardSeats || 0);
    const maxAllowed = Math.min(maxSeats, 10);
    if (quantityInput) { quantityInput.max = maxAllowed; if (parseInt(quantityInput.value) > maxAllowed) quantityInput.value = maxAllowed; }
    if (maxInfo) maxInfo.textContent = 'Maximum: ' + maxAllowed + ' ticket(s) disponible(s)';
    updateTicketTotal();
}

function updateTicketTotal() {
    const input = document.getElementById('ticketQuantity');
    const totalDisplay = document.getElementById('totalPriceDisplay');
    if (!input || !totalDisplay || !selectedEventForPurchase) return;
    const qty = parseInt(input.value) || 1;
    const price = selectedEventForPurchase.price || 0;
    totalDisplay.textContent = (qty * price).toFixed(6) + ' Pi';
}

function closeQuantityPopup() { document.getElementById('quantityPopup').classList.remove('show'); selectedEventForPurchase = null; }
function updateQuantity(delta) {
    const input = document.getElementById('ticketQuantity');
    if (!input) return;
    let val = parseInt(input.value) || 1;
    const maxVal = parseInt(input.max) || 10;
    val = Math.min(Math.max(val + delta, 1), maxVal);
    input.value = val;
    updateTicketTotal();
}

async function confirmPurchaseFromPopup() {
    if (!selectedEventForPurchase) { alert('No event selected'); return; }
    const quantityInput = document.getElementById('ticketQuantity');
    const quantity = parseInt(quantityInput.value) || 1;
    if (quantity < 1) { alert('Please select at least 1 ticket'); return; }
    const availableSeats = selectedEventForPurchase.standardLeft !== undefined ? selectedEventForPurchase.standardLeft : (selectedEventForPurchase.standardSeats || 0);
    if (quantity > availableSeats) { alert('Plus de places disponibles. Restant: ' + availableSeats); return; }
    if (quantity > 10) { alert('Maximum 10 tickets per purchase'); return; }
    await confirmPurchase(selectedEventForPurchase.id, quantity);
}

function showSuccessPopup(event, ticketsList, quantity) {
    const popup = document.getElementById('successPopup');
    const title = document.getElementById('successTitle');
    const message = document.getElementById('successMessage');
    const info = document.getElementById('successTicketInfo');
    const viewBtn = document.getElementById('viewTicketBtn');
    const eventNameEl = document.getElementById('successEventName');
    const closeBtn = document.getElementById('closeSuccessBtn');
    if (!popup || popup.classList.contains('show')) return;
    const qty = quantity || ticketsList.length;
    const ticket = ticketsList[0] || {};
    const price = event.price || 0;
    const totalPrice = qty * price;
    if (title) title.textContent = t('purchaseSuccessful');
    if (eventNameEl) eventNameEl.textContent = event.title || 'Blockchain Africa';
    if (message) message.innerHTML = 'Thank you for purchasing your ticket for <strong>' + escapeHtml(event.title || 'Blockchain Africa') + '</strong>';
    const dateEvent = new Date(event.date);
    const dateFormatted = dateEvent.toLocaleDateString('en-US');
    const timeFormatted = dateEvent.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    const codeDisplay = ticket.qrCode || ticket.id || 'N/A';
    const paysDisplay = event.pays || event.country || 'France';
    const countryFlag = countryFlags[paysDisplay] || '';
    const countryDisplay = countryFlag + ' ' + paysDisplay;
    if (info) {
        info.innerHTML =
            `<div class="ticket-line"><span class="ticket-label">${t('event')}</span><span class="ticket-value">${escapeHtml(event.title)}</span></div>
            <div class="ticket-line"><span class="ticket-label">${t('type')}</span><span class="ticket-value">Standard</span></div>
            <div class="ticket-line"><span class="ticket-label">${t('eventDate')}</span><span class="ticket-value">${dateFormatted} at ${timeFormatted}</span></div>
            <div class="ticket-line"><span class="ticket-label">${t('locationLabel')}</span><span class="ticket-value">${escapeHtml(event.location || 'Online')}</span></div>
            <div class="ticket-line"><span class="ticket-label">${t('countryLabel')}</span><span class="ticket-value">${countryDisplay}</span></div>
            <div class="ticket-line"><span class="ticket-label">${t('quantity')}</span><span class="ticket-value">${qty}</span></div>
            <div class="ticket-line"><span class="ticket-label">${t('total')}</span><span class="ticket-value">${totalPrice.toFixed(6)} Pi</span></div>
            <div class="ticket-line"><span class="ticket-label">${t('code')}</span><span class="ticket-value" style="font-size:0.7rem;font-family:monospace;">${escapeHtml(codeDisplay)}</span></div>`;
    }
    if (viewBtn) { viewBtn.onclick = function(e) { e.preventDefault(); closeSuccessPopup(); showPage('tickets'); }; viewBtn.style.display = 'inline-block'; }
    if (closeBtn) { closeBtn.onclick = function(e) { e.preventDefault(); closeSuccessPopup(); }; }
    popup.style.display = 'flex';
    popup.classList.add('show');
}

function closeSuccessPopup() {
    const popup = document.getElementById('successPopup');
    if (popup) { popup.classList.remove('show'); popup.style.display = 'none'; }
    const info = document.getElementById('successTicketInfo');
    if (info) info.innerHTML = '';
    localStorage.removeItem('betix_success_popup_shown');
}

async function createEvent(e) {
    e.preventDefault();
    const publishBtn = document.getElementById('publishEventBtn');
    if (publishBtn.classList.contains('loading')) return;
    if (!currentUser.wallet) { alert(t('pleaseConnect')); return; }
    const title = document.getElementById('eventTitle').value.trim();
    const category = document.getElementById('eventCategory').value;
    const pays = document.getElementById('eventCountry').value;
    const date = document.getElementById('eventDate').value;
    const location = document.getElementById('eventLocation').value.trim();
    const description = document.getElementById('eventDescription').value.trim();
    const conditions = document.getElementById('eventConditions').value.trim();
    const seatsTotal = parseInt(document.getElementById('eventSeats').value) || 0;
    const durationValue = document.getElementById('eventDurationValue').value;
    const durationUnit = document.getElementById('eventDurationUnit').value;
    const durationValueNum = durationValue ? parseInt(durationValue) : null;
    if (!title) { alert(t('title') + ' ' + t('required')); return; }
    if (!date) { alert(t('dateTime') + ' ' + t('required')); return; }
    if (!location) { alert(t('location') + ' ' + t('required')); return; }
    if (seatsTotal < 1) { alert('Au moins un billet doit être disponible'); return; }
    if (!conditions) { alert(t('conditions') + ' ' + t('required')); return; }
    const images = getUploadedImages();
    if (images.length < 1) { alert(t('imagesRequired')); return; }
    publishBtn.classList.add('loading');
    publishBtn.disabled = true;
    try {
        const newEvent = {
            id: Date.now().toString(),
            title, category, pays, country: pays, date, location,
            description: description || '',
            conditions,
            price: 0.0003,
            seatsTotal,
            seatsLeft: seatsTotal,
            standardSeats: seatsTotal,
            standardSold: 0,
            standardLeft: seatsTotal,
            images,
            coverImage: images[0],
            organizer: currentUser.wallet,
            organizerPiUid: currentUser.piUid || currentUser.wallet,
            organizerName: currentUser.name,
            createdAt: new Date().toISOString(),
            boosts: 0,
            durationValue: durationValueNum,
            durationUnit,
            ticketTypes: { standard: { enabled: true, price: 0.0003 } }
        };
        openPublishConfirm(newEvent);
    } catch (error) { alert(t('paymentError') + ': ' + error.message); publishBtn.classList.remove('loading'); publishBtn.disabled = false; }
}

function openPublishConfirm(eventData) {
    pendingEventData = eventData;
    document.getElementById('confirmTitle').textContent = eventData.title || 'Untitled';
    document.getElementById('confirmCategory').textContent = eventData.category || 'Uncategorized';
    document.getElementById('confirmCountry').textContent = eventData.pays || eventData.country || 'Not specified';
    document.getElementById('confirmDate').textContent = new Date(eventData.date).toLocaleDateString('en-US') + ' at ' + new Date(eventData.date).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    document.getElementById('confirmLocation').textContent = eventData.location || 'Online';
    document.getElementById('confirmPrice').textContent = eventData.price + ' Pi';
    document.getElementById('confirmSeats').textContent = eventData.seatsTotal || 0;
    document.getElementById('confirmOrganizer').textContent = currentUser.name || currentUser.wallet || 'Unknown';
    document.getElementById('confirmDescription').textContent = eventData.description || 'No description';
    document.getElementById('confirmConditions').textContent = eventData.conditions || 'No conditions specified';
    const confirmTicketTypes = document.getElementById('confirmTicketTypes');
    if (confirmTicketTypes) confirmTicketTypes.textContent = 'Standard: ' + (eventData.price || 0).toFixed(6) + ' Pi';
    const confirmDuration = document.getElementById('confirmDuration');
    if (confirmDuration) {
        if (eventData.durationValue && eventData.durationUnit) {
            const unitLabels = { hours: 'Hour', days: 'Day', weeks: 'Week', months: 'Month', years: 'Year' };
            confirmDuration.textContent = eventData.durationValue + ' ' + (unitLabels[eventData.durationUnit] || eventData.durationUnit);
            confirmDuration.style.display = 'block';
        } else { confirmDuration.style.display = 'none'; }
    }
    const confirmImages = document.getElementById('confirmImages');
    if (confirmImages) {
        confirmImages.innerHTML = '';
        if (eventData.images && eventData.images.length > 0) {
            eventData.images.forEach(img => {
                const imgEl = document.createElement('img');
                imgEl.src = img; imgEl.alt = 'Event image'; imgEl.style.objectFit = 'contain'; imgEl.style.width = '70px'; imgEl.style.height = '70px'; imgEl.style.background = '#1a1a2e';
                confirmImages.appendChild(imgEl);
            });
        }
    }
    document.getElementById('publishConfirmPopup').classList.add('show');
}

function closePublishConfirmPopup() {
    document.getElementById('publishConfirmPopup').classList.remove('show');
    const publishBtn = document.getElementById('publishEventBtn');
    if (publishBtn) { publishBtn.classList.remove('loading'); publishBtn.disabled = false; }
    pendingEventData = null;
}

async function confirmPublishEvent() {
    if (!pendingEventData) { alert('Event not found'); return; }
    const publishBtn = document.getElementById('publishEventBtn');
    const confirmBtn = document.getElementById('confirmPublishBtn');
    if (confirmBtn) { confirmBtn.classList.add('loading'); confirmBtn.disabled = true; confirmBtn.textContent = t('publishing'); }
    try {
        const newEvent = pendingEventData;
        const uploadedUrls = [];
        if (newEvent.images && newEvent.images.length > 0) {
            for (let i = 0; i < newEvent.images.length; i++) {
                const url = await uploadEventImage(newEvent.id, newEvent.images[i], i);
                uploadedUrls.push(url || newEvent.images[i]);
            }
        }
        newEvent.images = uploadedUrls;
        newEvent.coverImage = uploadedUrls.length > 0 ? uploadedUrls[0] : '';
        newEvent.organizerPiUid = currentUser.piUid || currentUser.wallet;
        newEvent.organizerName = currentUser.name;
        events.push(newEvent);
        saveEvents();
        await saveEventToSupabase(newEvent);
        await syncUserToSupabase();
        document.getElementById('eventForm').reset();
        for (let i = 0; i < 2; i++) removeImageModern(i);
        uploadedImages = {};
        addNotification(t('eventPublished') + ' "' + newEvent.title + '"', 'event');
        closePublishConfirmPopup();
        document.getElementById('publishConfirmPopup').classList.remove('show');
        renderEventsByCategory();
        updateProfilePage();
        if (publishBtn) { publishBtn.classList.remove('loading'); publishBtn.disabled = false; }
        if (confirmBtn) { confirmBtn.classList.remove('loading'); confirmBtn.disabled = false; confirmBtn.textContent = t('publishEvent'); }
        alert(t('eventPublished'));
        showPage('home');
    } catch (error) { alert(t('paymentError') + ': ' + error.message); if (confirmBtn) { confirmBtn.classList.remove('loading'); confirmBtn.disabled = false; confirmBtn.textContent = t('publishEvent'); } if (publishBtn) { publishBtn.classList.remove('loading'); publishBtn.disabled = false; } }
}

function compressImage(file) {
    return new Promise((resolve, reject) => {
        if (!file || !file.type.startsWith('image/')) { reject(new Error('Not an image')); return; }
        const reader = new FileReader();
        reader.onload = function(ev) {
            const img = new Image();
            img.onload = function() {
                let width = img.width, height = img.height;
                const maxWidth = 1200, maxHeight = 1200;
                if (width > maxWidth || height > maxHeight) {
                    const ratio = Math.min(maxWidth / width, maxHeight / height);
                    width = Math.round(width * ratio); height = Math.round(height * ratio);
                }
                const canvas = document.createElement('canvas');
                canvas.width = width; canvas.height = height;
                const ctx = canvas.getContext('2d');
                ctx.imageSmoothingEnabled = true; ctx.imageSmoothingQuality = 'high';
                ctx.drawImage(img, 0, 0, width, height);
                let format = 'image/webp';
                const testCanvas = document.createElement('canvas');
                testCanvas.width = 1; testCanvas.height = 1;
                if (!testCanvas.toDataURL('image/webp').includes('image/webp')) format = 'image/jpeg';
                resolve(canvas.toDataURL(format, 0.7));
            };
            img.onerror = function() { reject(new Error('Failed to load image')); };
            img.src = ev.target.result;
        };
        reader.onerror = function() { reject(new Error('Failed to read file')); };
        reader.readAsDataURL(file);
    });
}

async function handleImageUploadModern(file, index) {
    if (!file) return;
    if (!file.type.startsWith('image/')) { alert('Please select an image'); return; }
    if (file.size > 10 * 1024 * 1024) { alert('Image is too large (max 10MB)'); return; }
    const box = document.getElementById('uploadBox' + (index + 1));
    const progress = document.getElementById('progress' + (index + 1));
    const progressFill = document.getElementById('progressFill' + (index + 1));
    const progressText = document.getElementById('progressText' + (index + 1));
    const previewContainer = document.getElementById('previewContainer' + index);
    const previewImage = document.getElementById('previewImage' + index);
    progress.style.display = 'block';
    progressFill.style.width = '0%';
    progressText.textContent = '0%';
    box.classList.add('compress');
    try {
        let interval = setInterval(() => {
            let cur = parseInt(progressFill.style.width) || 0;
            if (cur < 90) { let nw = cur + Math.random() * 15; if (nw > 90) nw = 90; progressFill.style.width = nw + '%'; progressText.textContent = Math.round(nw) + '%'; }
        }, 200);
        const compressedData = await compressImage(file);
        clearInterval(interval);
        progressFill.style.width = '100%';
        progressText.textContent = '100%';
        setTimeout(() => {
            progress.style.display = 'none';
            progressFill.style.width = '0%';
            previewImage.src = compressedData;
            previewContainer.style.display = 'block';
            box.classList.add('has-image');
            box.classList.remove('compress');
            uploadedImages[index] = compressedData;
        }, 300);
    } catch (error) { alert('Error compressing image. Please try with a smaller image.'); progress.style.display = 'none'; box.classList.remove('compress'); }
}

function removeImageModern(index) {
    const box = document.getElementById('uploadBox' + (index + 1));
    const previewContainer = document.getElementById('previewContainer' + index);
    const previewImage = document.getElementById('previewImage' + index);
    const input = document.getElementById('imageInput' + index);
    previewContainer.style.display = 'none';
    previewImage.src = '#';
    box.classList.remove('has-image');
    box.classList.remove('compress');
    input.value = '';
    delete uploadedImages[index];
}

function getUploadedImages() {
    const images = [];
    for (let key in uploadedImages) if (uploadedImages.hasOwnProperty(key)) images.push(uploadedImages[key]);
    return images;
}

function openEditEventModal(eventId) {
    const event = events.find(e => e.id === eventId);
    if (!event) { alert(t('eventNotFound')); return; }
    if (event.organizer !== currentUser.wallet && event.organizerName !== currentUser.name) { alert('You are not the organizer of this event'); return; }
    editingEventId = eventId;
    document.getElementById('editEventDescription').value = event.description || '';
    document.getElementById('editEventLocation').value = event.location || '';
    document.getElementById('editEventConditions').value = event.conditions || '';
    document.getElementById('editEventDurationValue').value = event.durationValue || '';
    document.getElementById('editEventDurationUnit').value = event.durationUnit || 'hours';
    document.getElementById('editEventSeats').value = event.seatsTotal || 0;
    document.getElementById('editEventModal').classList.add('show');
}

function closeEditEventModal() { document.getElementById('editEventModal').classList.remove('show'); editingEventId = null; }

async function saveEventEdits() {
    if (!editingEventId) return;
    const event = events.find(e => e.id === editingEventId);
    if (!event) { alert(t('eventNotFound')); return; }
    const description = document.getElementById('editEventDescription').value.trim();
    const location = document.getElementById('editEventLocation').value.trim();
    const conditions = document.getElementById('editEventConditions').value.trim();
    const durationValue = document.getElementById('editEventDurationValue').value;
    const durationUnit = document.getElementById('editEventDurationUnit').value;
    const seatsTotal = parseInt(document.getElementById('editEventSeats').value) || 0;
    if (seatsTotal < 1) { alert('Au moins un billet doit être disponible'); return; }
    const ticketsSold = tickets.filter(t => t.eventId === editingEventId).length;
    if (seatsTotal < ticketsSold) { alert('Vous ne pouvez pas réduire le nombre de places en dessous des ' + ticketsSold + ' déjà vendues'); return; }
    const updates = {
        description, location, conditions,
        seatsTotal,
        seatsLeft: seatsTotal - ticketsSold,
        durationValue: durationValue ? parseInt(durationValue) : null,
        durationUnit: durationUnit || null,
        standardSeats: seatsTotal,
        standardLeft: seatsTotal - ticketsSold,
        standardSold: ticketsSold
    };
    Object.assign(event, updates);
    saveEvents();
    await updateEventInSupabase(editingEventId, {
        description: updates.description, location: updates.location, conditions: updates.conditions,
        max_tickets: updates.seatsTotal, duration_value: updates.durationValue, duration_unit: updates.durationUnit,
        standard_seats: updates.standardSeats, standard_sold: updates.standardSold
    });
    addNotification(t('editEvent') + ' "' + event.title + '"', 'event');
    closeEditEventModal();
    renderEventsByCategory();
    renderMyEvents();
    alert(t('eventPublished'));
}

function renderMyRatings() {
    const container = document.getElementById('myRatingsList');
    if (!container) return;
    const myRatings = ratings.filter(r => r.userWallet === (currentUser.wallet || currentUser.name));
    if (!myRatings.length) { container.innerHTML = '<p style="text-align:center;padding:2rem;">' + t('noReviews') + '</p>'; return; }
    container.innerHTML = myRatings.map(r => {
        const stars = Array.from({ length: 5 }, (_, i) => i < r.rating ? '★' : '☆').join('');
        return `<div class="ticket-card"><h3>${escapeHtml(r.eventTitle)}</h3><div>${t('rating')}: ${r.rating}/5 ${stars}</div>${r.comment ? `<p>"${escapeHtml(r.comment)}"</p>` : ''}<small>${new Date(r.date).toLocaleDateString()}</small></div>`;
    }).join('');
}

function setupTicketTypesUI() { /* no-op */ }

function initCountrySelectors() {
    const filterSelect = document.getElementById('countrySelect');
    if (filterSelect) {
        filterSelect.innerHTML = '';
        countriesList.forEach(country => {
            const flag = countryFlags[country] || '';
            const option = document.createElement('option');
            option.value = country;
            option.textContent = flag + ' ' + country;
            if (country === currentCountryFilter) option.selected = true;
            filterSelect.appendChild(option);
        });
    }
    const eventSelect = document.getElementById('eventCountry');
    if (eventSelect) {
        eventSelect.innerHTML = '';
        countriesList.forEach(country => {
            if (country === 'All') return;
            const flag = countryFlags[country] || '';
            const option = document.createElement('option');
            option.value = country;
            option.textContent = flag + ' ' + country;
            if (country === 'France') option.selected = true;
            eventSelect.appendChild(option);
        });
    }
}

function changeLanguage(lang) {
    currentLang = lang;
    localStorage.setItem('betix_language', lang);
    const settingsSelect = document.getElementById('settingsLangSelect');
    if (settingsSelect) settingsSelect.value = lang;
    updateUITranslations();
    const googleSelect = document.querySelector('.goog-te-combo');
    if (googleSelect) { googleSelect.value = lang; googleSelect.dispatchEvent(new Event('change')); }
    setTimeout(() => { const retry = document.querySelector('.goog-te-combo'); if (retry && retry.value !== lang) { retry.value = lang; retry.dispatchEvent(new Event('change')); } }, 1000);
}

function updateUITranslations() {
    const sidebarItems = document.querySelectorAll('.sidebar-item[data-page]');
    const pageMap = { home: t('home'), myevents: t('myEvents'), profile: t('profile'), settings: t('settings'), tickets: t('myTickets'), history: t('ticketHistory'), faq: t('faq'), admin: t('administration'), scan: 'Scan Ticket' };
    sidebarItems.forEach(item => {
        const page = item.dataset.page;
        if (pageMap[page]) {
            const icon = item.querySelector('i');
            item.innerHTML = '';
            if (icon) item.appendChild(icon);
            item.appendChild(document.createTextNode(' ' + pageMap[page]));
        }
    });
    document.getElementById('sidebarName') && (document.getElementById('sidebarName').textContent = currentUser.name || t('guest'));
    document.getElementById('sidebarWallet') && (document.getElementById('sidebarWallet').textContent = currentUser.wallet ? 'Connected' : t('notConnected'));
    document.getElementById('sidebarWalletBtn') && (document.getElementById('sidebarWalletBtn').textContent = currentUser.wallet ? t('disconnect') : t('connectPi'));
    const socialTitle = document.querySelector('.sidebar-social-title');
    if (socialTitle) socialTitle.textContent = t('followUs');
    const heroTitle = document.querySelector('.hero-text h1');
    if (heroTitle) heroTitle.textContent = "The first ticketing platform powered by Pi Network";
    const heroDesc = document.querySelector('.hero-text p');
    if (heroDesc) heroDesc.textContent = "Discover and book unique experiences. Pay with your Pi crypto.";
    const searchInput = document.getElementById('searchInput');
    if (searchInput) searchInput.placeholder = t('searchEvent');
    const countryLabel = document.querySelector('.filter-country-select label');
    if (countryLabel) countryLabel.innerHTML = '<i class="fas fa-globe-africa"></i> ' + t('chooseCountry');
    const eventsTitle = document.querySelector('.events-title');
    if (eventsTitle) eventsTitle.textContent = t('upcomingEvents');
    const eventsSub = document.querySelector('.events-sub');
    if (eventsSub) eventsSub.textContent = t('joinCommunity');
    document.querySelector('#navHome span') && (document.querySelector('#navHome span').textContent = t('home'));
    document.querySelector('#navCreate span') && (document.querySelector('#navCreate span').textContent = 'Create');
    document.querySelector('#navMenu span') && (document.querySelector('#navMenu span').textContent = 'Menu');
    const backLabel = document.querySelector('.back-btn .back-btn-label');
    if (backLabel) backLabel.textContent = t('back');
    const footerTitles = document.querySelectorAll('.footer-col h4');
    if (footerTitles.length >= 3) {
        footerTitles[0].textContent = t('footerTitleInfo');
        footerTitles[1].textContent = t('footerTitleBetix');
        footerTitles[2].textContent = t('footerTitlePartners');
    }
    const footerLinks = document.querySelectorAll('.footer-col ul li a');
    const footerLinkTexts = [
        t('footerTermsSale'), t('footerTermsUse'), t('footerPrivacy'), t('footerAccessibility'),
        t('footerPrivacyChoices'), t('footerFanGuide'), t('footerLegal'), t('footerCookies'),
        t('footerAbout'), t('footerContact'), t('footerFeedback'), t('footerHelp'),
        t('footerJoinCommunity'), t('footerPiNetwork'), t('footerSecure')
    ];
    footerLinks.forEach((link, index) => { if (index < footerLinkTexts.length) link.textContent = footerLinkTexts[index]; });
    const footerSlogan = document.querySelector('.footer-slogan');
    if (footerSlogan) footerSlogan.textContent = t('footerSlogan');
    const footerDesc = document.querySelector('.footer-desc');
    if (footerDesc) footerDesc.textContent = t('footerDesc');
    const footerRights = document.querySelectorAll('.footer-bottom span');
    if (footerRights.length >= 1) footerRights[0].textContent = '© 2026 Betix. ' + t('footerRights');
    if (footerRights.length >= 2) footerRights[footerRights.length - 1].textContent = t('footerBuiltOn');
}

function detectLanguage() {
    let savedLang = localStorage.getItem('betix_language') || 'en';
    const urlParams = new URLSearchParams(window.location.search);
    const urlLang = urlParams.get('lang');
    if (urlLang) { localStorage.setItem('betix_language', urlLang); savedLang = urlLang; }
    currentLang = savedLang;
    const nativeSelect = document.getElementById('nativeLangSelect');
    if (nativeSelect) { nativeSelect.value = savedLang; nativeSelect.style.display = 'none'; }
    const settingsSelect = document.getElementById('settingsLangSelect');
    if (settingsSelect) settingsSelect.value = savedLang;
    setTimeout(() => { const googleSelect = document.querySelector('.goog-te-combo'); if (googleSelect && googleSelect.value !== savedLang) { googleSelect.value = savedLang; googleSelect.dispatchEvent(new Event('change')); } }, 1500);
    setTimeout(() => updateUITranslations(), 500);
    return savedLang;
}

function syncSettingsLanguageSelector() {
    const settingsSelect = document.getElementById('settingsLangSelect');
    if (settingsSelect) {
        settingsSelect.value = currentLang;
        settingsSelect.addEventListener('change', function() { changeLanguage(this.value); });
    }
}

function renderNotificationsPage() {
    const container = document.getElementById('notificationsList');
    if (!container) return;
    if (!notifications || notifications.length === 0) { container.innerHTML = `<div class="notification-empty"><i class="fas fa-bell-slash"></i> ${t('noNotifications')}</div>`; return; }
    let html = '';
    for (let i = 0; i < notifications.length; i++) {
        const notif = notifications[i];
        const time = new Date(notif.date);
        const timeStr = time.toLocaleDateString('en-US') + ' ' + time.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
        const unreadClass = notif.read ? '' : 'unread';
        const icon = notif.type === 'purchase' ? 'fa-shopping-cart' : notif.type === 'event' ? 'fa-calendar-plus' : 'fa-info-circle';
        html += `<div class="notification-item ${unreadClass}"><div class="notif-icon"><i class="fas ${icon}"></i></div><div class="notif-content"><div class="notif-msg">${escapeHtml(notif.message)}</div><div class="notif-time">${timeStr}</div></div></div>`;
        notifications[i].read = true;
    }
    container.innerHTML = html;
    saveNotifications();
    updateNotifBadgeHeader();
}

function updateNotifBadgeHeader() {
    const badge = document.getElementById('notifBadgeHeader');
    if (!badge) return;
    const unread = notifications.filter(n => !n.read).length;
    if (unread > 0) { badge.textContent = unread; badge.style.display = 'flex'; } else { badge.style.display = 'none'; }
    updateSidebarNotifBadge();
}

function updateSidebarNotifBadge() {
    const badge = document.getElementById('sidebarNotifBadge');
    if (!badge) return;
    const unread = notifications.filter(n => !n.read).length;
    if (unread > 0) { badge.textContent = unread; badge.classList.remove('hidden'); } else { badge.classList.add('hidden'); }
}

function addNotification(message, type) {
    const notif = { id: Date.now().toString(), message, type: type || 'info', read: false, date: new Date().toISOString() };
    notifications.unshift(notif);
    if (notifications.length > 100) notifications = notifications.slice(0, 100);
    saveNotifications();
    updateNotifBadgeHeader();
}

function goToMyEvents() { showPage('myevents'); }
function goToTickets() { showPage('tickets'); }
function goToHistory() { showPage('history'); }
function goToRatings() { showPage('ratings'); }

function calculateLoyaltyPoints() {
    let points = 0;
    for (let i = 0; i < ratings.length; i++) if (ratings[i].userWallet === (currentUser.wallet || currentUser.name)) points += ratings[i].rating;
    currentUser.loyaltyPoints = points;
    saveUser();
    return points;
}

function updateActivity() { lastActivity = Date.now(); localStorage.setItem('betix_last_activity', lastActivity); }
function isSessionExpired() { return (Date.now() - parseInt(localStorage.getItem('betix_last_activity') || 0)) > 2592000000; }

function disconnectPi() {
    if (confirm(t('disconnect') + '?')) {
        currentUser = { name: 'Guest', wallet: null, piUid: null, memberSince: '2026', loyaltyPoints: 0 };
        piUser = null;
        saveUser();
        localStorage.removeItem('betix_last_activity');
        localStorage.removeItem('betix_pending_payment');
        updateUserInfo(); updateProfilePage(); renderEventsByCategory(); renderTickets(); renderHistory(); updateConnectButtons(); closeSidebar();
        alert(t('disconnected'));
    }
}
function logout() { disconnectPi(); }
function startSessionMonitor() { setInterval(() => { if (currentUser.wallet && isSessionExpired()) { disconnectPi(); alert(t('sessionExpired')); } }, 300000); }
function bindActivityListeners() { ['click','scroll','keydown','touchstart'].forEach(e => document.addEventListener(e, updateActivity)); }

function showPage(pageName) {
    updateActivity();
    const pages = ['homePage','createPage','ticketsPage','historyPage','profilePage','settingsPage','ratingsPage','adminPage','slidesPage','myeventsPage','notificationsPage'];
    pages.forEach(id => { const el = document.getElementById(id); if (el) { el.style.display = 'none'; el.classList.add('hidden-page'); } });
    let displayPage = pageName;
    if (pageName === 'home') { document.getElementById('homePage').style.display = 'block'; renderEventsByCategory(); displayPage = 'home'; }
    else { const target = document.getElementById(pageName + 'Page'); if (target) { target.style.display = 'block'; target.classList.remove('hidden-page'); } displayPage = pageName; }
    if (pageHistory[pageHistory.length - 1] !== displayPage) pageHistory.push(displayPage);
    const backBtn = document.getElementById('backBtn');
    if (backBtn) {
        if (displayPage === 'home') { backBtn.classList.add('hidden'); backBtn.style.display = 'none'; }
        else { backBtn.classList.remove('hidden'); backBtn.style.display = 'flex'; }
    }
    if (pageName === 'tickets') renderTickets();
    if (pageName === 'history') renderHistory();
    if (pageName === 'profile') updateProfilePage();
    if (pageName === 'ratings') renderMyRatings();
    if (pageName === 'admin') loadAdminPage();
    if (pageName === 'myevents') renderMyEvents();
    if (pageName === 'notifications') renderNotificationsPage();
    closeSidebar();
    window.scrollTo(0, 0);
}

function goBack() {
    const detailModal = document.getElementById('eventDetailModal');
    if (detailModal && detailModal.classList.contains('show')) { closeEventDetailModalAndGoBack(); return; }
    if (pageHistory.length > 1) { pageHistory.pop(); showPage(pageHistory[pageHistory.length - 1] || 'home'); } else showPage('home');
}

function closeSidebar() { document.getElementById('sidebar').classList.remove('open'); document.getElementById('overlay').classList.remove('active'); document.body.style.overflow = ''; }
function openSidebar() { document.getElementById('sidebar').classList.add('open'); document.getElementById('overlay').classList.add('active'); document.body.style.overflow = 'hidden'; }

function updateConnectButtons() {
    const sidebarBtn = document.getElementById('sidebarWalletBtn');
    if (sidebarBtn) {
        if (currentUser.wallet) {
            sidebarBtn.textContent = t('disconnect');
            sidebarBtn.classList.add('disconnect');
            sidebarBtn.classList.remove('loading');
            sidebarBtn.onclick = function() { disconnectPi(); };
            sidebarBtn.disabled = false;
        } else {
            sidebarBtn.textContent = t('connectPi');
            sidebarBtn.classList.remove('disconnect');
            sidebarBtn.classList.remove('loading');
            sidebarBtn.onclick = function() { connectToPi(); };
            sidebarBtn.disabled = false;
        }
    }
    const profilePageBtn = document.getElementById('profileConnectBtnPage');
    if (profilePageBtn) {
        if (currentUser.wallet) { profilePageBtn.textContent = t('disconnect'); profilePageBtn.onclick = function() { disconnectPi(); }; }
        else { profilePageBtn.textContent = t('connectPi'); profilePageBtn.onclick = function() { connectToPi(); }; }
    }
}

async function connectToPi() {
    showConnectSpinner();
    try {
        if (!piSDKReady) {
            const ready = await ensurePiSDKReady();
            if (!ready) { hideConnectSpinner(); alert("Pi Network SDK not available. Please make sure you are using the Pi Browser."); return; }
        }
        if (typeof Pi === 'undefined') {
            hideConnectSpinner();
            if (confirm("Pi Browser not detected. Use demo mode?")) {
                currentUser.wallet = 'demo_user'; currentUser.piUid = 'demo_user'; currentUser.name = 'Demo User'; currentUser.memberSince = '2026'; currentUser.loyaltyPoints = 0;
                saveUser(); await syncUserToSupabase(); updateActivity(); updateUserInfo(); updateProfilePage(); trackUserConnection(); renderEventsByCategory(); updateConnectButtons(); await loadAllFromSupabase();
                currentFilter = 'All';
                currentCountryFilter = 'All';
                initFilters();
                renderEventsByCategory();
                alert('Pi account connected (demo mode)! Welcome Demo User'); closeSidebar(); return;
            }
            alert("Please open this page in Pi Browser"); return;
        }
        const scopes = ['username', 'payments'];
        const auth = await Pi.authenticate(scopes, onIncompletePaymentFound);
        if (auth && auth.user) {
            piUser = auth.user;
            currentUser.wallet = piUser.username;
            currentUser.piUid = piUser.username;
            currentUser.name = piUser.username;
            if (!currentUser.loyaltyPoints) currentUser.loyaltyPoints = 0;
            saveUser(); await syncUserToSupabase(); updateActivity(); updateUserInfo(); updateProfilePage(); trackUserConnection(); renderEventsByCategory(); updateConnectButtons(); await loadAllFromSupabase();
            currentFilter = 'All';
            currentCountryFilter = 'All';
            initFilters();
            renderEventsByCategory();
            alert('Pi account connected! Welcome ' + piUser.username); closeSidebar();
        } else { hideConnectSpinner(); alert(t('authenticationFailed')); }
    } catch (error) { hideConnectSpinner(); alert(t('connectionError') + ': ' + (error.message || "Please try again")); }
    finally { hideConnectSpinner(); }
}

function showConnectSpinner() {
    const btn = document.getElementById('sidebarWalletBtn');
    if (btn) { btn.textContent = t('connecting'); btn.disabled = true; btn.classList.add('loading'); }
}
function hideConnectSpinner() {
    const btn = document.getElementById('sidebarWalletBtn');
    if (btn) { btn.disabled = false; btn.classList.remove('loading'); updateConnectButtons(); }
}
