// ============================================================
// CONFIGURATION SUPABASE
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
// LISTES ET TRADUCTIONS (complètes)
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
// TRADUCTIONS (raccourci pour la lisibilité)
// ============================================================
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
        photos: 'Photos', imagesRequired: '1 image required', dropImage: 'Drop your image here',
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
        footerDesc: 'Secure platform to buy and sell event tickets with Pi payment.',
        eventDate: 'Event Date', eventTime: 'Event Time', locationLabel: 'Location', countryLabel: 'Country',
        ticketsSold: 'Tickets Sold', required: 'required', reviews: 'reviews', close: 'Close',
        connecting: 'Connecting...', pleaseWait: 'Please wait...', 
        demoMode: 'Pi Browser not detected. Use demo mode?',
        demoConnected: 'Pi account connected (demo mode)! Welcome Demo User',
        piConnected: 'Pi account connected! Welcome ',
        adminActivated: 'Admin activated',
        adminDenied: 'Access denied. Please authenticate via 5 clicks on the logo.',
        adminSessionEnded: 'Admin session ended',
        passwordChanged: 'Password changed successfully!',
        settingsSaved: 'Settings saved successfully!',
        errorSavingSettings: 'Error saving settings.',
        noUsers: 'No users found.',
        noEventsAdmin: 'No events created',
        noLogs: 'No logs available',
        logsCleared: 'Logs cleared',
        slideSaved: 'Slide saved successfully!',
        slideDeleted: 'Slide deleted',
        eventDeleted: 'Event deleted',
        allEventsDeleted: 'All events have been deleted',
        uploadError: 'Error uploading image',
        imageTooLarge: 'Image too large (max 5MB)',
        selectImage: 'Please select an image',
        passwordMin: 'Password must be at least 6 characters',
        passwordsDontMatch: 'Passwords do not match',
        refreshData: 'Refresh Data',
        syncing: 'Syncing...',
        syncSuccess: 'Synchronized!',
        syncError: 'Sync Error',
        ready: 'Ready',
        loading: 'Loading...',
        sessionActive: 'Session active',
        logout: 'Logout',
        changePassword: 'Change Password',
        currentPassword: 'Current password',
        lastLogin: 'Last login',
        loginCount: 'Login count',
        saveProfile: 'Save Profile',
        editProfile: 'Edit',
        verify: 'Verify',
        verified: 'Verified',
        firstName: 'First Name',
        lastName: 'Last Name',
        address: 'Address',
        email: 'Email',
        phone: 'Phone Number',
        countrySelect: 'Select your country',
        reviewYourInfo: 'Review Your Information',
        confirmSave: 'Confirm & Save',
        saving: 'Saving your information...',
        profileUpdated: 'Profile Updated Successfully!',
        profileUpdatedMsg: 'Your information has been saved and is now up to date.',
        pleaseCompleteProfile: 'Please complete your profile (email and phone) for a better experience.',
        incompleteProfile: 'Incomplete profile',
        transactionProcessed: 'Transaction processed',
        transactionProcessedMsg: 'This transaction has already been processed.<br>Your tickets are available in "My Tickets".',
        accountDebited: 'Your account will be debited in ',
        seconds: ' second(s).',
        eventEnded: 'Event ended',
        eventEndedMsg: 'This event has already taken place and is no longer available for booking.',
        viewUpcoming: 'View upcoming events',
        purchaseConfirmed: '✅ Purchase confirmed!',
        purchaseCongrats: 'Congratulations! Your purchase was successful.',
        ticketAvailable: 'Your ticket is available in your personal space. You will also receive a confirmation email.',
        backHome: 'Back to Home',
        viewMyTicket: 'View My Ticket',
        adminTitle: 'Administration',
        adminSubtitle: 'Manage your Betix platform',
        adminEvents: 'Events',
        adminTickets: 'Tickets',
        adminUsers: 'Users',
        adminSlides: 'Carousel',
        adminLogs: 'Logs',
        adminSettings: 'Settings'
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
        photos: 'Photos', imagesRequired: '1 image requise',
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
    }
};

let currentLang = 'en';
function t(key) {
    let lang = currentLang || 'en';
    if (translations[lang] && translations[lang][key] !== undefined) return translations[lang][key];
    if (translations.en && translations.en[key] !== undefined) return translations.en[key];
    return key;
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

// ============================================================
// PARAMÈTRES DE L'APPLICATION
// ============================================================
let appSettings = {
    commissionPercent: 5,
    serviceFeePercent: 2,
    piRate: 1
};

// ============================================================
// GESTION DU PROFIL LOCAL
// ============================================================
function loadLocalProfile() {
    try {
        return JSON.parse(localStorage.getItem('betix_profile') || '{}');
    } catch { return {}; }
}

function saveLocalProfile(profileData) {
    localStorage.setItem('betix_profile', JSON.stringify(profileData));
}

function mergeProfileWithCurrentUser() {
    const local = loadLocalProfile();
    const fields = ['first_name', 'last_name', 'country', 'address', 'email', 'phone_number', 'profile_completed', 'profile_reminder_shown'];
    fields.forEach(f => {
        if (local[f] !== undefined) currentUser[f] = local[f];
    });
    if (local.profile_completed) currentUser.profile_completed = true;
    saveUser();
}

// ============================================================
// VÉRIFICATIONS DE CONNEXION ET PROFIL
// ============================================================
function requireLogin() {
    if (!currentUser.wallet && !currentUser.piUid) {
        addNotification('Please connect your Pi account before performing this action.', 'warning');
        alert(t('pleaseConnect'));
        return false;
    }
    return true;
}

function requireProfileComplete() {
    const check = checkProfileComplete();
    if (!check.complete) {
        const missing = check.missing.join(', ');
        const msg = 'Please complete your profile before performing this action. Missing: ' + missing;
        addNotification(msg, 'warning');
        redirectToProfileWithMessage(msg);
        return false;
    }
    return true;
}

// ============================================================
// PI SDK
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
    const maxAttempts = 15;
    const timeout = 5000;
    const startTime = Date.now();
    while (!piSDKReady && attempts < maxAttempts && (Date.now() - startTime) < timeout) {
        initPiSDK();
        await new Promise(r => setTimeout(r, 500));
        attempts++;
    }
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
// FONCTIONS SUPABASE
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
// SAUVEGARDE UTILISATEUR DANS SUPABASE
// ============================================================
async function saveUserToSupabase(piUid, username, wallet, points) {
    points = points || 0;
    try {
        const now = new Date().toISOString();
        const userData = {
            pi_uid: piUid,
            username: username || piUid,
            wallet: wallet || piUid,
            points: points,
            first_name: currentUser.first_name || '',
            last_name: currentUser.last_name || '',
            country: currentUser.country || '',
            address: currentUser.address || '',
            email: currentUser.email || '',
            phone_number: currentUser.phone_number || '',
            profile_completed: currentUser.profile_completed || false,
            profile_reminder_shown: currentUser.profile_reminder_shown || false,
            updated_at: now,
            last_seen: now
        };
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
        console.log('✅ User saved to Supabase:', piUid);
        return true;
    } catch (error) {
        console.error('❌ saveUserToSupabase error:', error);
        return false;
    }
}

// ============================================================
// SAVE EVENT ET TICKET
// ============================================================
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
        if (error) {
            console.error('❌ Supabase error saving event:', error);
            return false;
        }
        console.log('✅ Event saved to Supabase:', eventData.id);
        return true;
    } catch (error) {
        console.error('❌ saveEventToSupabase exception:', error);
        return false;
    }
}

async function saveTicketToSupabase(ticketData) {
    try {
        if (!ticketData || !ticketData.id) return false;
        const dbTicket = {
            id: ticketData.id,
            event_id: ticketData.eventId || '',
            buyer_pi_uid: ticketData.buyerWallet || ticketData.userWallet || currentUser.wallet || 'unknown',
            buyer_name: ticketData.buyerName || ticketData.buyerWallet || currentUser.name || 'Anonymous',
            buyer_email: ticketData.buyerEmail || '',
            buyer_phone: ticketData.buyerPhone || '',
            ticket_type: 'standard',
            price: parseFloat(ticketData.price) || 0,
            qr_code: ticketData.qrCode || 'BETIX-' + Date.now(),
            status: ticketData.status || 'Valid',
            purchase_date: ticketData.purchaseDate || new Date().toISOString(),
            expiration_date: ticketData.eventDate || new Date(Date.now() + 86400000 * 30).toISOString(),
            event_title: ticketData.eventTitle || 'Event',
            event_location: ticketData.eventLocation || 'Online',
            pays: ticketData.pays || ticketData.eventPays || 'France',
            transaction_id: ticketData.transactionId || '',
            category: ticketData.category || '',
            duration_value: ticketData.durationValue || null,
            duration_unit: ticketData.durationUnit || null,
            organizer_name: ticketData.organizerName || '',
            organizer_pi_uid: ticketData.organizerPiUid || '',
            ticket_number: ticketData.ticketNumber || null,
            updated_at: new Date().toISOString()
        };
        const { error } = await supabaseClient.from('tickets').upsert(dbTicket, { onConflict: 'id', ignoreDuplicates: false });
        if (error) {
            console.error('❌ Supabase error saving ticket:', error);
            return false;
        }
        console.log('✅ Ticket saved to Supabase:', ticketData.id);
        return true;
    } catch (error) {
        console.error('❌ saveTicketToSupabase exception:', error);
        return false;
    }
}

// ============================================================
// CHARGEMENT DES TICKETS DEPUIS SUPABASE
// ============================================================
async function loadTicketsFromSupabase(piUid) {
    try {
        if (!piUid) return [];
        const { data, error } = await supabaseClient.from('tickets').select('*').eq('buyer_pi_uid', piUid).order('purchase_date', { ascending: false });
        if (error) {
            console.error('❌ Error loading tickets from Supabase:', error);
            return [];
        }
        return (data || []).map(t => ({
            id: t.id,
            eventId: t.event_id,
            eventTitle: t.event_title || 'Event',
            eventDate: t.expiration_date || t.purchase_date,
            eventLocation: t.event_location || 'Online',
            category: t.category || '',
            price: t.price || 0,
            buyerName: t.buyer_name || 'Anonymous',
            buyerEmail: t.buyer_email || '',
            buyerPhone: t.buyer_phone || '',
            purchaseDate: t.purchase_date,
            transactionId: t.transaction_id,
            qrCode: t.qr_code,
            status: t.status || 'Valid',
            durationValue: t.duration_value || null,
            durationUnit: t.duration_unit || null,
            organizerName: t.organizer_name || '',
            organizerPiUid: t.organizer_pi_uid || '',
            pays: t.pays || 'France',
            ticketNumber: t.ticket_number
        }));
    } catch (error) { console.error('❌ loadTicketsFromSupabase exception:', error); return []; }
}

// ============================================================
// CHARGEMENT DES ÉVÉNEMENTS DEPUIS SUPABASE
// ============================================================
async function loadEventsFromSupabase() {
    try {
        const { data, error } = await supabaseClient.from('events').select('*').order('event_date', { ascending: true });
        if (error) {
            console.error('❌ Error loading events from Supabase:', error);
            return [];
        }
        return (data || []).map(e => {
            let imagesArray = [];
            if (e.image_urls) {
                try {
                    const parsed = JSON.parse(e.image_urls);
                    if (Array.isArray(parsed)) {
                        imagesArray = parsed.filter(url => url && typeof url === 'string' && url.startsWith('http'));
                    }
                } catch(parseErr) {
                    console.warn('⚠️ Could not parse image_urls for event', e.id, parseErr);
                }
            }
            if (imagesArray.length === 0 && e.image_url && e.image_url.startsWith('http')) {
                imagesArray.push(e.image_url);
            }
            if (imagesArray.length === 0) {
                const fallback = eventImagesList[e.category] || 'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?w=600&h=400&fit=crop';
                imagesArray.push(fallback);
            }
            console.log(`📸 Event "${e.title}" has ${imagesArray.length} images`);
            
            const standardSeats = e.standard_seats || 0;
            const standardSold = e.standard_sold || 0;
            return {
                id: String(e.id),
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
                coverImage: imagesArray.length > 0 ? imagesArray[0] : '',
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
    } catch (error) {
        console.error('❌ loadEventsFromSupabase exception:', error);
        return [];
    }
}

// ============================================================
// SAUVEGARDE PERMANENTE
// ============================================================
function saveBackupData(eventsData, ticketsData) {
    try {
        localStorage.setItem('betix_backup_events', JSON.stringify(eventsData));
        localStorage.setItem('betix_backup_tickets', JSON.stringify(ticketsData));
        localStorage.setItem('betix_backup_timestamp', Date.now().toString());
    } catch (e) {
        console.warn("Could not save backup data:", e);
    }
}

function restoreBackupData() {
    try {
        const events = JSON.parse(localStorage.getItem('betix_backup_events') || '[]');
        const tickets = JSON.parse(localStorage.getItem('betix_backup_tickets') || '[]');
        if (events.length === 0 && tickets.length === 0) return null;
        return { events, tickets };
    } catch (e) { return null; }
}

// ============================================================
// LOAD ALL FROM SUPABASE
// ============================================================
async function loadAllFromSupabase() {
    console.log("=== LOAD ALL FROM SUPABASE ===");
    loadUsedTickets();
    updateSyncStatus('loading');
    
    let supabaseEvents = [];
    try {
        supabaseEvents = await loadEventsFromSupabase();
        console.log("Supabase events:", supabaseEvents.length);
        const localEvents = JSON.parse(localStorage.getItem('betix_events') || '[]');
        events = mergeArraysById(localEvents, supabaseEvents);
        localStorage.setItem('betix_events', JSON.stringify(events));
        saveBackupData(events, tickets);
    } catch (error) {
        console.error('❌ Error loading events from Supabase:', error);
        events = JSON.parse(localStorage.getItem('betix_events') || '[]');
    }
    
    const userIdentifier = currentUser.piUid || currentUser.wallet;
    if (userIdentifier) {
        try {
            const supabaseTickets = await loadTicketsFromSupabase(userIdentifier);
            console.log("Supabase tickets for user:", supabaseTickets.length);
            const localTickets = JSON.parse(localStorage.getItem('betix_tickets') || '[]');
            tickets = mergeArraysById(localTickets, supabaseTickets);
            localStorage.setItem('betix_tickets', JSON.stringify(tickets));
            saveBackupData(events, tickets);
        } catch (error) {
            console.error('❌ Error loading tickets from Supabase:', error);
            tickets = JSON.parse(localStorage.getItem('betix_tickets') || '[]');
        }
    } else {
        console.log("User not connected, tickets not loaded.");
        tickets = JSON.parse(localStorage.getItem('betix_tickets') || '[]');
    }
    
    const localNotifs = JSON.parse(localStorage.getItem('betix_notifications') || '[]');
    notifications = localNotifs;
    localStorage.setItem('betix_notifications', JSON.stringify(notifications));
    
    updateSyncStatus('success');
    console.log("Load completed. Events:", events.length, "Tickets:", tickets.length);
    
    renderEventsByCategory();
    renderTickets();
    renderHistory();
    updateProfilePage();
    setTimeout(() => {
        if (typeof generateAllQRCodes === 'function') generateAllQRCodes();
    }, 300);
    
    await retryPendingTickets();
}

// ============================================================
// SYNCHRONISATION
// ============================================================
function saveEvents() {
    localStorage.setItem('betix_events', JSON.stringify(events));
    saveBackupData(events, tickets);
    syncEventsToSupabase();
}

function saveTickets() {
    localStorage.setItem('betix_tickets', JSON.stringify(tickets));
    saveUsedTickets();
    saveBackupData(events, tickets);
    syncTicketsToSupabase().catch(() => {});
}

function saveUsedTickets() { localStorage.setItem('betix_used_tickets', JSON.stringify(usedTickets)); }
function loadUsedTickets() { try { usedTickets = JSON.parse(localStorage.getItem('betix_used_tickets') || '[]'); } catch(e) { usedTickets = []; } }

function saveUser() { 
    localStorage.setItem('betix_user', JSON.stringify(currentUser)); 
    const profileData = {
        first_name: currentUser.first_name || '',
        last_name: currentUser.last_name || '',
        country: currentUser.country || '',
        address: currentUser.address || '',
        email: currentUser.email || '',
        phone_number: currentUser.phone_number || '',
        profile_completed: currentUser.profile_completed || false,
        profile_reminder_shown: currentUser.profile_reminder_shown || false
    };
    saveLocalProfile(profileData);
}

function saveNotifications() { localStorage.setItem('betix_notifications', JSON.stringify(notifications)); }
function saveChatMessages() { localStorage.setItem('betix_chat_messages', JSON.stringify(chatMessages)); }
function saveRatings() { localStorage.setItem('betix_ratings', JSON.stringify(ratings)); }
function saveConnectedUsers() { localStorage.setItem('betix_connected_users', JSON.stringify(connectedUsers)); }

async function syncUserToSupabase() {
    if (!currentUser.piUid && !currentUser.wallet) {
        console.warn('No piUid or wallet, cannot sync user.');
        return;
    }
    const piUid = currentUser.piUid || currentUser.wallet;
    console.log('🔄 Syncing user to Supabase...', piUid);
    const success = await saveUserToSupabase(piUid, currentUser.name || 'User', currentUser.wallet || piUid, currentUser.loyaltyPoints || 0);
    if (success) console.log('✅ User synced successfully.');
    else console.error('❌ User sync failed.');
}

async function syncEventsToSupabase() {
    let success = 0;
    for (let i = 0; i < events.length; i++) {
        const saved = await saveEventToSupabase(events[i]);
        if (saved) success++;
        if (i % 5 === 0) await new Promise(r => setTimeout(r, 100));
    }
    console.log(`Synced ${success}/${events.length} events to Supabase.`);
}

async function syncTicketsToSupabase() {
    let success = 0;
    for (let i = 0; i < tickets.length; i++) {
        const saved = await saveTicketToSupabase(tickets[i]);
        if (saved) success++;
        if (i % 5 === 0) await new Promise(r => setTimeout(r, 100));
    }
    if (success < tickets.length) {
        const failed = tickets.slice(success);
        pendingTickets.push(...failed);
        localStorage.setItem('betix_pending_tickets', JSON.stringify(pendingTickets));
    }
    console.log(`Synced ${success}/${tickets.length} tickets to Supabase.`);
}

async function syncAllToSupabase(retryCount = 0) {
    const maxRetries = 3;
    try {
        updateSyncStatus('syncing');
        await syncUserToSupabase();
        await syncEventsToSupabase();
        await syncTicketsToSupabase();
        updateSyncStatus('success');
        return { events: events.length, tickets: tickets.length };
    } catch (error) {
        console.error('❌ syncAllToSupabase error:', error);
        if (retryCount < maxRetries) { await new Promise(r => setTimeout(r, 2000)); return syncAllToSupabase(retryCount + 1); }
        else { updateSyncStatus('error'); return { events: 0, tickets: 0, error: error.message }; }
    }
}

async function retryPendingTickets() {
    if (!pendingTickets || pendingTickets.length === 0) return;
    console.log('Retrying to save', pendingTickets.length, 'pending tickets...');
    const remaining = [];
    for (const ticket of pendingTickets) {
        const success = await saveTicketToSupabase(ticket);
        if (!success) remaining.push(ticket);
    }
    pendingTickets = remaining;
    localStorage.setItem('betix_pending_tickets', JSON.stringify(pendingTickets));
    if (pendingTickets.length === 0) console.log('All pending tickets saved successfully!');
    else console.log('Still', pendingTickets.length, 'tickets pending.');
}

function updateSyncStatus(status) {
    const indicator = document.getElementById('syncStatusIndicator');
    if (!indicator) return;
    const icon = indicator.querySelector('.sync-icon'), text = indicator.querySelector('.sync-text'), dot = indicator.querySelector('.sync-dot');
    if (!icon || !text || !dot) return;
    indicator.className = 'sync-indicator';
    switch(status) {
        case 'loading': indicator.classList.add('syncing'); icon.className = 'sync-icon fas fa-spinner fa-spin'; text.textContent = t('loading'); dot.className = 'sync-dot'; break;
        case 'syncing': indicator.classList.add('syncing'); icon.className = 'sync-icon fas fa-sync fa-spin'; text.textContent = t('syncing'); dot.className = 'sync-dot'; break;
        case 'success': indicator.classList.add('success'); icon.className = 'sync-icon fas fa-check-circle'; text.textContent = t('syncSuccess'); dot.className = 'sync-dot'; break;
        case 'error': indicator.classList.add('error'); icon.className = 'sync-icon fas fa-exclamation-circle'; text.textContent = t('syncError'); dot.className = 'sync-dot'; break;
        default: icon.className = 'sync-icon fas fa-cloud'; text.textContent = t('ready'); dot.className = 'sync-dot';
    }
}

async function forceRefreshData() {
    const btn = document.getElementById('refreshDataBtn');
    if (btn) { btn.disabled = true; btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> ' + t('loading'); }
    try {
        await loadAllFromSupabase();
        await loadHeroSlides();
        await syncAllToSupabase();
        renderEventsByCategory();
        renderTickets();
        renderHistory();
        updateProfilePage();
        if (btn) { btn.innerHTML = '<i class="fas fa-check"></i> ' + t('syncSuccess'); setTimeout(() => { btn.innerHTML = '<i class="fas fa-sync"></i> ' + t('refreshData'); btn.disabled = false; }, 2000); }
        updateSyncStatus('success');
    } catch (error) {
        updateSyncStatus('error');
        if (btn) { btn.innerHTML = '<i class="fas fa-exclamation-triangle"></i> ' + t('syncError'); setTimeout(() => { btn.innerHTML = '<i class="fas fa-sync"></i> ' + t('refreshData'); btn.disabled = false; }, 2000); }
    }
}

function mergeArraysById(localArray, supabaseArray) {
    const merged = [...localArray];
    for (const item of supabaseArray) {
        const idx = merged.findIndex(l => l.id === item.id);
        if (idx !== -1) merged[idx] = item;
        else merged.push(item);
    }
    return merged;
}

// ============================================================
// PARAMÈTRES DE L'APPLICATION
// ============================================================
async function loadAppSettings() {
    try {
        const { data, error } = await supabaseClient.from('app_settings').select('key, value');
        if (error) throw error;
        if (data && data.length) {
            data.forEach(row => {
                const key = row.key, val = row.value;
                if (key in appSettings) {
                    if (typeof appSettings[key] === 'number') appSettings[key] = parseFloat(val);
                    else if (typeof appSettings[key] === 'boolean') appSettings[key] = val === 'true' || val === true;
                    else appSettings[key] = val;
                }
            });
        }
        localStorage.setItem('betix_app_settings', JSON.stringify(appSettings));
    } catch (error) {
        console.warn('Could not load app settings from Supabase, using default/local:', error);
        const local = localStorage.getItem('betix_app_settings');
        if (local) try { Object.assign(appSettings, JSON.parse(local)); } catch(e) {}
    }
}

async function saveAppSettings(settings) {
    try {
        for (const [key, value] of Object.entries(settings)) {
            const stringValue = typeof value === 'string' ? value : String(value);
            const { error } = await supabaseClient.from('app_settings').upsert({ key, value: stringValue }, { onConflict: 'key' });
            if (error) throw error;
        }
        Object.assign(appSettings, settings);
        localStorage.setItem('betix_app_settings', JSON.stringify(appSettings));
        return true;
    } catch (error) {
        console.error('Error saving app settings:', error);
        return false;
    }
}

// ============================================================
// VÉRIFICATION DU PROFIL COMPLET
// ============================================================
function checkProfileComplete() {
    const required = ['first_name', 'last_name', 'email', 'address', 'phone_number'];
    const missing = [];
    for (let field of required) {
        if (!currentUser[field] || currentUser[field].trim() === '') missing.push(field.replace('_', ' '));
    }
    return missing.length === 0 ? { complete: true, missing: [] } : { complete: false, missing };
}

function redirectToProfileWithMessage(message) {
    alert(message);
    showPage('profile');
    const msgDiv = document.getElementById('profileSaveMessage');
    if (msgDiv) {
        msgDiv.innerHTML = `<div style="background:#fef3c7; border:1px solid #f59e0b; border-radius:12px; padding:12px; color:#92400e;">
            <i class="fas fa-exclamation-triangle"></i> ${message}
        </div>`;
        setTimeout(() => { msgDiv.innerHTML = ''; }, 8000);
    }
}

// ============================================================
// QR CODE SÉCURISÉ
// ============================================================
function generateSecureQRData(ticketId, userId, eventId) {
    return ticketId;
}

// ============================================================
// SPINNER GLOBAL
// ============================================================
function showLoader(text = 'Loading...') {
    const loader = document.getElementById('globalLoader');
    if (loader) {
        document.getElementById('loaderText').textContent = text;
        loader.style.display = 'flex';
    }
}

function hideLoader() {
    const loader = document.getElementById('globalLoader');
    if (loader) loader.style.display = 'none';
}

// ============================================================
// GÉNÉRATION DU TICKET HTML
// ============================================================
function generateTicketHTML(ticket) {
    const safeTicket = ticket || {};
    const dateEvent = new Date(safeTicket.eventDate || Date.now());
    const dateFormatted = !isNaN(dateEvent.getTime()) ? dateEvent.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'To be defined';
    const timeFormatted = !isNaN(dateEvent.getTime()) ? dateEvent.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }) : 'To be defined';
    const durationValue = safeTicket.durationValue || '';
    const durationUnit = safeTicket.durationUnit || '';
    let durationDisplay = 'N/A';
    if (durationValue && durationUnit) {
        const unitLabels = { hours: 'Hour', days: 'Day', weeks: 'Week', months: 'Month', years: 'Year' };
        durationDisplay = durationValue + ' ' + (unitLabels[durationUnit] || durationUnit);
    }
    const buyerName = (safeTicket.buyerName || 'Not provided').toUpperCase();
    let userEmail = safeTicket.buyerEmail || 'Not provided';
    if (userEmail.length > 18) userEmail = userEmail.substring(0, 16) + '…';
    const userPhone = safeTicket.buyerPhone || 'Not provided';
    const ticketIdShort = safeTicket.id ? String(safeTicket.id).substring(0, 8).toUpperCase() : '00000000';
    const price = Number(safeTicket.price || 0).toFixed(6) + ' Pi';
    const eventTitle = (safeTicket.eventTitle || 'Event').toUpperCase();
    const eventLocation = safeTicket.eventLocation || 'Online';
    const purchaseDate = safeTicket.purchaseDate ? new Date(safeTicket.purchaseDate).toLocaleDateString('en-US') : 'N/A';
    const ticketNumber = safeTicket.ticketNumber || 'N/A';

    return `
        <div class="ticket-overlay-container" id="ticket-${safeTicket.id || 'unknown'}">
            <div class="ticket-overlay-bg">
                <img src="ticket-officiel.png" alt="Official ticket" onerror="this.style.display='none'; this.parentElement.style.background='#0a1628';">
            </div>
            <div class="ticket-left line-1"><span class="ticket-value">${escapeHtml(eventTitle)}</span></div>
            <div class="ticket-left line-2"><span class="ticket-value">${escapeHtml(durationDisplay)}</span></div>
            <div class="ticket-left line-3"><span class="ticket-value">${escapeHtml(dateFormatted)}</span></div>
            <div class="ticket-left line-4"><span class="ticket-value">${escapeHtml(timeFormatted)}</span></div>
            <div class="ticket-left line-5"><span class="ticket-value">${escapeHtml(eventLocation)}</span></div>
            <div class="ticket-left line-6"><span class="ticket-value">${escapeHtml(price)}</span></div>
            <div class="ticket-right line-1"><span class="ticket-value">${escapeHtml(buyerName)}</span></div>
            <div class="ticket-right line-2"><span class="ticket-value">${escapeHtml(userEmail)}</span></div>
            <div class="ticket-right line-3"><span class="ticket-value">${escapeHtml(userPhone)}</span></div>
            <div class="ticket-right line-4"><span class="ticket-value">#${escapeHtml(ticketIdShort)}</span></div>
            <div class="ticket-right line-5"><span class="ticket-value">${escapeHtml(purchaseDate)}</span></div>
            <div class="ticket-right line-6"><span class="ticket-value">#${escapeHtml(String(ticketNumber))}</span></div>
            <div class="ticket-qr" id="qr-ticket-${safeTicket.id || 'unknown'}"></div>
            <div class="ticket-qr-id">${escapeHtml(ticketIdShort)}</div>
            <div class="ticket-qr-date">${escapeHtml(purchaseDate)}</div>
        </div>
    `;
}

function generateTicketQR(ticketId) {
    const container = document.getElementById(`qr-ticket-${ticketId}`);
    if (!container) return;
    const ticket = tickets.find(t => t.id === ticketId);
    if (!ticket) return;
    container.innerHTML = '';
    try {
        new QRCode(container, {
            text: ticket.qrCode || ticket.id,
            width: 78,
            height: 78,
            colorDark: "#0B1F5C",
            colorLight: "#ffffff",
            correctLevel: QRCode.CorrectLevel.H
        });
    } catch(e) {
        container.innerHTML = '<span style="color:red;">QR Error</span>';
    }
}

function generateAllQRCodes() {
    document.querySelectorAll('.ticket-list-item .ticket-overlay-container').forEach(container => {
        const id = container.id.replace('ticket-', '');
        if (id) generateTicketQR(id);
    });
}

// ============================================================
// RENDER TICKETS
// ============================================================
function renderTickets() {
    const container = document.getElementById('ticketsList');
    if (!container) return;
    const validTickets = tickets.filter(t => {
        const isUsed = usedTickets.indexOf(t.id) !== -1;
        const isExpired = new Date(t.eventDate) <= new Date();
        const isStatusUsed = t.status === 'Used';
        return !isUsed && !isExpired && !isStatusUsed;
    });
    const uniqueTickets = [];
    const seenIds = new Set();
    for (const t of validTickets) {
        if (!seenIds.has(t.id)) { seenIds.add(t.id); uniqueTickets.push(t); }
    }
    if (uniqueTickets.length === 0) {
        container.innerHTML = `<p style="text-align:center;padding:2rem;color:var(--gray);">${t('noActiveTickets')}</p>`;
        return;
    }
    let html = '';
    uniqueTickets.forEach(ticket => {
        html += `<div class="ticket-list-item">${generateTicketHTML(ticket)}
            <div class="ticket-actions-wrapper">
                <button class="btn-action btn-pdf" onclick="downloadTicketPDF('${ticket.id}')"><i class="fas fa-file-pdf"></i> PDF</button>
                <button class="btn-action btn-png" onclick="downloadTicketPNG('${ticket.id}')"><i class="fas fa-image"></i> PNG</button>
                <button class="btn-action btn-share" onclick="shareTicket('${ticket.id}')"><i class="fas fa-share-alt"></i> Share</button>
            </div>
        </div>`;
    });
    container.innerHTML = html;
    setTimeout(() => {
        uniqueTickets.forEach(ticket => generateTicketQR(ticket.id));
        applyStaggeredAnimation('#ticketsList .ticket-list-item');
    }, 300);
}

// ============================================================
// RENDER HISTORY
// ============================================================
function renderHistory() {
    const container = document.getElementById('historyList');
    if (!container) return;
    const historyTickets = tickets.filter(t => {
        const isUsed = usedTickets.indexOf(t.id) !== -1;
        const isExpired = new Date(t.eventDate) <= new Date();
        const isStatusUsed = t.status === 'Used';
        return isUsed || isExpired || isStatusUsed;
    });
    const uniqueHistory = [];
    const seenIds = new Set();
    for (const t of historyTickets) {
        if (!seenIds.has(t.id)) { seenIds.add(t.id); uniqueHistory.push(t); }
    }
    if (uniqueHistory.length === 0) {
        container.innerHTML = `<p style="text-align:center;padding:2rem;color:var(--gray);">${t('noTicketHistory')}</p>`;
        return;
    }
    let html = '';
    uniqueHistory.forEach(ticket => {
        html += `<div class="ticket-list-item">${generateTicketHTML(ticket)}
            <div class="ticket-actions-wrapper">
                <button class="btn-action btn-pdf" onclick="downloadTicketPDF('${ticket.id}')"><i class="fas fa-file-pdf"></i> PDF</button>
                <button class="btn-action btn-png" onclick="downloadTicketPNG('${ticket.id}')"><i class="fas fa-image"></i> PNG</button>
                <button class="btn-action btn-share" onclick="shareTicket('${ticket.id}')"><i class="fas fa-share-alt"></i> Share</button>
                <button class="btn-action btn-delete" onclick="deleteHistoryTicket('${ticket.id}')" style="background:#ef4444; color:white;"><i class="fas fa-trash"></i> Delete</button>
            </div>
        </div>`;
    });
    container.innerHTML = html;
    setTimeout(() => {
        uniqueHistory.forEach(ticket => generateTicketQR(ticket.id));
        applyStaggeredAnimation('#historyList .ticket-list-item');
    }, 300);
}

function deleteHistoryTicket(ticketId) {
    if (!confirm('Delete this ticket from history?')) return;
    tickets = tickets.filter(t => t.id !== ticketId);
    usedTickets = usedTickets.filter(id => id !== ticketId);
    saveTickets();
    saveUsedTickets();
    renderHistory();
    renderTickets();
    updateProfilePage();
    addNotification('Ticket deleted from history.', 'info');
}

// ============================================================
// EXPORT PNG ET PDF
// ============================================================
async function downloadTicketPNG(ticketId) {
    const ticketEl = document.getElementById(`ticket-${ticketId}`);
    if (!ticketEl) { alert('Ticket not found'); return; }
    showLoader('Generating PNG ticket...');
    try {
        const canvas = await html2canvas(ticketEl, {
            scale: 2.5, useCORS: true, logging: false,
            backgroundColor: '#0a1628', allowTaint: true,
            width: ticketEl.scrollWidth, height: ticketEl.scrollHeight
        });
        const link = document.createElement('a');
        link.download = `BETIX_TICKET_${ticketId.substring(0, 8)}.png`;
        link.href = canvas.toDataURL('image/png');
        link.click();
        hideLoader();
        addNotification('Ticket PNG downloaded successfully!', 'success');
    } catch (error) {
        console.error(error);
        alert('Error downloading PNG.');
        hideLoader();
    }
}

async function downloadTicketPDF(ticketId) {
    const ticketEl = document.getElementById(`ticket-${ticketId}`);
    if (!ticketEl) { alert('Ticket not found'); return; }
    showLoader('Generating PDF ticket...');
    try {
        const canvas = await html2canvas(ticketEl, {
            scale: 2.5, useCORS: true, logging: false,
            backgroundColor: '#0a1628', allowTaint: true,
            width: ticketEl.scrollWidth, height: ticketEl.scrollHeight
        });
        const imgData = canvas.toDataURL('image/png');
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF('p', 'mm', 'a4');
        const imgWidth = 210;
        const imgHeight = (canvas.height * imgWidth) / canvas.width;
        doc.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
        doc.save(`BETIX_TICKET_${ticketId.substring(0, 8)}.pdf`);
        hideLoader();
        addNotification('Ticket PDF downloaded successfully!', 'success');
    } catch (error) {
        console.error(error);
        alert('Error downloading PDF.');
        hideLoader();
    }
}

function viewTicketWithImage(ticketId) {
    const ticket = tickets.find(t => t.id === ticketId);
    if (!ticket) { alert('Ticket not found'); return; }
    const modal = document.getElementById('eventDetailModal');
    const content = document.getElementById('eventDetailContent');
    content.innerHTML = generateTicketHTML(ticket);
    modal.classList.add('show');
    modal.style.display = 'flex';
    document.body.style.overflow = 'hidden';
    setTimeout(() => generateTicketQR(ticket.id), 300);
}
function viewTicketModal(ticketId) { viewTicketWithImage(ticketId); }

function shareTicket(ticketId) {
    const ticket = tickets.find(t => t.id === ticketId);
    if (!ticket) return;
    if (navigator.share) {
        navigator.share({
            title: `Ticket for ${ticket.eventTitle}`,
            text: `My ticket for ${ticket.eventTitle} on Betix`,
            url: window.location.href + '?ticket=' + ticket.id
        }).catch(() => {});
    } else {
        const url = window.location.href + '?ticket=' + ticket.id;
        if (navigator.clipboard) {
            navigator.clipboard.writeText(url).then(() => {
                alert('Link copied to clipboard!');
            }).catch(() => {
                prompt('Copy this link:', url);
            });
        } else {
            prompt('Copy this link:', url);
        }
    }
}

// ============================================================
// RENDER EVENT CARD
// ============================================================
function renderEventCard(event) {
    const avgRating = ratings.filter(r => r.eventId === event.id).reduce((a,r) => a + r.rating, 0) / (ratings.filter(r => r.eventId === event.id).length || 1);
    const dateEvent = new Date(event.date);
    const dateFormatted = !isNaN(dateEvent.getTime()) ? dateEvent.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'Date to be defined';
    const timeFormatted = !isNaN(dateEvent.getTime()) ? dateEvent.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }) : 'Time to be defined';
    const fallbackImage = eventImagesList[event.category] || eventImagesList.Concert;
    const images = event.images && event.images.length > 0 ? event.images : [fallbackImage];
    
    let carouselHtml = `<div class="event-carousel-wrapper" id="carousel-wrapper-${event.id}">
        <div class="event-carousel" id="carousel-${event.id}">
            <div class="carousel-track" id="track-${event.id}">`;
    images.forEach((img, idx) => {
        carouselHtml += `<div class="carousel-slide" data-index="${idx}"><img src="${img}" alt="${escapeHtml(event.title)} - Image ${idx+1}" loading="lazy" onerror="this.src='${fallbackImage}'"></div>`;
    });
    carouselHtml += `</div>`;
    if (images.length > 1) {
        carouselHtml += `<div class="carousel-dots" id="dots-${event.id}">`;
        for (let i = 0; i < images.length; i++) {
            carouselHtml += `<span class="dot ${i === 0 ? 'active' : ''}" data-index="${i}"></span>`;
        }
        carouselHtml += `</div>
                         <div class="carousel-counter" id="counter-${event.id}">1/${images.length}</div>`;
    }
    carouselHtml += `</div></div>`;
    let imageCountHtml = '';
    if (images.length > 1) {
        imageCountHtml = `<div class="image-count-badge"><i class="fas fa-images"></i> ${images.length} photos</div>`;
    }

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
            <div class="event-location-line"><i class="fas fa-map-marker-alt" style="color:#F5B400;"></i> ${countryFlag} ${escapeHtml(countryDisplay)}${locationDisplay}</div>
            <div class="event-datetime-line"><i class="fas fa-calendar-day" style="color:#F5B400;"></i> ${dateFormatted} · <i class="fas fa-clock" style="color:#F5B400;"></i> ${timeFormatted}${durationDisplay ? ` · <i class="fas fa-hourglass-half" style="color:#F5B400;"></i> ${durationDisplay}` : ''}</div>
        </div>
    `;

    return `<div class="event-card-classic" data-id="${event.id}">
        <div class="poster-wrapper-classic">
            <span class="category-badge-classic">${escapeHtml(event.category)}</span>
            ${carouselHtml}
            ${imageCountHtml}
        </div>
        <div class="card-content-classic">
            <div class="event-title-large">${escapeHtml(event.title)}</div>
            <div class="event-description-full">${escapeHtml(desc)}</div>
            ${infoBoxHtml}
            <div class="event-meta-row">${ratingDisplay ? `<div class="event-rating-classic">${ratingDisplay}</div>` : ''}</div>
            <div class="event-tickets-price-row">${ticketsLabelHtml}${priceRightHtml}</div>
            <button class="buy-btn-classic" onclick="event.stopPropagation(); openQuantityPopup('${event.id}')">${t('buyTicket')}</button>
            <div class="event-organizer-classic"><span class="org-icon"><i class="fas fa-user"></i></span> ${t('by')} ${escapeHtml(organizerDisplay)}</div>
            ${publishDateDisplay ? `<div class="event-publish-date"><i class="far fa-clock"></i> ${publishDateDisplay}` : ''}
        </div>
    </div>`;
}

// ============================================================
// FONCTIONS DE MISE À JOUR DES INDICATEURS DE CARROUSEL
// ============================================================
function updateCarouselIndicators(track) {
    const wrapper = track.closest('.event-carousel-wrapper');
    if (!wrapper) return;
    const slides = track.querySelectorAll('.carousel-slide');
    const dots = wrapper.querySelectorAll('.carousel-dots .dot');
    const counter = wrapper.querySelector('.carousel-counter');
    if (slides.length === 0) return;
    const scrollLeft = track.scrollLeft;
    const slideWidth = slides[0].offsetWidth || 1;
    const activeIndex = Math.round(scrollLeft / slideWidth);
    const clampedIndex = Math.max(0, Math.min(activeIndex, slides.length - 1));
    dots.forEach((dot, i) => dot.classList.toggle('active', i === clampedIndex));
    if (counter) {
        counter.textContent = (clampedIndex + 1) + '/' + slides.length;
    }
}

function initCarouselIndicators() {
    document.querySelectorAll('.event-carousel .carousel-track').forEach(track => {
        track.removeEventListener('scroll', track._scrollHandler);
        const handler = function() {
            if (!this._rafId) {
                this._rafId = requestAnimationFrame(() => {
                    updateCarouselIndicators(this);
                    this._rafId = null;
                });
            }
        };
        track._scrollHandler = handler;
        track.addEventListener('scroll', handler);
        setTimeout(() => updateCarouselIndicators(track), 100);
    });
}

// ============================================================
// HANDLE EVENT CARD CLICK
// ============================================================
function handleEventCardClick(e) {
    const card = e.target.closest('.event-card-classic');
    if (!card) return;
    const id = card.dataset.id;
    if (id) openEventDetails(id);
}

// ============================================================
// RENDER EVENTS BY CATEGORY
// ============================================================
function renderEventsByCategory() {
    const container = document.getElementById('eventsByCategory');
    if (!container) return;
    const filtered = events.filter(e => {
        const matchCategory = currentFilter === 'All' || e.category === currentFilter;
        const matchCountry = currentCountryFilter === 'All' || (e.pays || e.country) === currentCountryFilter;
        const matchSearch = e.title.toLowerCase().includes(searchQuery) || (e.location && e.location.toLowerCase().includes(searchQuery));
        return matchCategory && matchCountry && matchSearch;
    });
    if (filtered.length === 0) {
        container.innerHTML = `<p style="text-align:center;padding:2rem;color:var(--gray);">${t('noEvents')}</p>`;
        return;
    }
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

    container.removeEventListener('click', handleEventCardClick);
    container.addEventListener('click', handleEventCardClick);

    setTimeout(() => {
        applyStaggeredAnimation('#eventsByCategory .events-grid-centered');
        initCarouselIndicators();
    }, 50);
}

// ============================================================
// OPEN EVENT DETAILS
// ============================================================
let openEventDetailsTimeout = null;

function openEventDetails(eventId) {
    const idStr = String(eventId);
    let event = events.find(e => String(e.id) === idStr);
    if (event) {
        _openEventDetails(event);
        return;
    }
    if (openEventDetailsTimeout) clearTimeout(openEventDetailsTimeout);
    openEventDetailsTimeout = setTimeout(async () => {
        try {
            const loaded = await loadEventsFromSupabase();
            if (loaded.length > 0) {
                events = loaded;
                localStorage.setItem('betix_events', JSON.stringify(events));
                renderEventsByCategory();
                const ev = events.find(e => String(e.id) === idStr);
                if (ev) _openEventDetails(ev);
                else alert(t('eventNotFound'));
            } else alert(t('eventNotFound'));
        } catch (error) {
            alert(t('eventNotFound'));
        }
        openEventDetailsTimeout = null;
    }, 300);
}

// ============================================================
// _openEventDetails (avec badges améliorés et police réduite)
// ============================================================
function _openEventDetails(event) {
    const modal = document.getElementById('eventDetailModal');
    const content = document.getElementById('eventDetailContent');
    const currentPage = pageHistory[pageHistory.length - 1] || 'home';
    if (currentPage !== 'eventDetail') pageHistory.push('eventDetail');

    const dateEvent = new Date(event.date);
    const dateFormatted = !isNaN(dateEvent.getTime()) ? dateEvent.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'Date to be defined';
    const timeFormatted = !isNaN(dateEvent.getTime()) ? dateEvent.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }) : 'Time to be defined';
    const countryFlag = countryFlags[event.pays || event.country] || '';
    const countryDisplay = event.pays || event.country || 'International';
    const fallbackImage = eventImagesList[event.category] || 'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?w=600&h=400&fit=crop';
    const images = event.images && event.images.length > 0 ? event.images : [fallbackImage];
    
    let carouselHtml = '';
    if (images.length > 0) {
        carouselHtml = `<div class="event-carousel-wrapper" id="carousel-wrapper-detail-${event.id}">
            <div class="event-carousel" id="carousel-detail-${event.id}">
                <div class="carousel-track" id="track-detail-${event.id}">`;
        images.forEach(img => {
            carouselHtml += `<div class="carousel-slide"><img src="${img}" alt="Image" onerror="this.src='${fallbackImage}'"></div>`;
        });
        carouselHtml += `</div>`;
        if (images.length > 1) {
            carouselHtml += `<div class="carousel-dots" id="dots-detail-${event.id}">`;
            for (let d = 0; d < images.length; d++) {
                carouselHtml += `<span class="dot ${d === 0 ? 'active' : ''}" data-index="${d}"></span>`;
            }
            carouselHtml += `</div>
                             <div class="carousel-counter" id="counter-detail-${event.id}">1/${images.length}</div>`;
        }
        carouselHtml += `</div></div>`;
    }

    let conditionsHtml = event.conditions ? (event.conditions.split('\n').filter(l => l.trim()).length ? `<ul>${event.conditions.split('\n').filter(l => l.trim()).map(l => `<li>${escapeHtml(l.trim())}</li>`).join('')}</ul>` : `<p>${escapeHtml(event.conditions)}</p>`) : `<p>${t('noConditions')}</p>`;

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
        <div class="event-detail-header">
            <button class="back-btn-detail" onclick="closeEventDetailModalAndGoBack()" title="${t('back')}"><i class="fas fa-arrow-left"></i></button>
            <span class="detail-title">${escapeHtml(event.title)}</span>
            <span class="detail-category">${escapeHtml(event.category)}</span>
            <button class="modal-close-detail" onclick="closeEventDetailModalAndGoBack()" title="${t('close')}"><i class="fas fa-times"></i></button>
        </div>
        ${carouselHtml}
        <div class="event-detail-body">
            ${event.description ? `<div class="event-detail-about"><p>${escapeHtml(event.description)}</p></div>` : ''}
            <div class="event-detail-grid">
                <div class="grid-item"><i class="fas fa-map-marker-alt"></i> ${countryFlag} ${escapeHtml(countryDisplay)}${event.location ? `, ${escapeHtml(event.location)}` : ''}</div>
                <div class="grid-item"><i class="fas fa-calendar-day"></i> ${dateFormatted}</div>
                <div class="grid-item"><i class="fas fa-clock"></i> ${timeFormatted}</div>
                ${durationDisplay ? `<div class="grid-item"><i class="fas fa-hourglass-half"></i> ${durationDisplay}</div>` : ''}
                <!-- Prix avec badges -->
                <div class="grid-item">
                    <span style="display:flex; align-items:center; gap:6px; flex-wrap:wrap;">
                        <span class="price-label-badge" style="background:#0B1F5C; color:white; padding:1px 8px; border-radius:12px; font-weight:700; font-size:0.6rem;">Price</span>
                        <span class="price-amount-green" style="color:#10b981; font-weight:800; font-size:0.85rem;">${(event.price || 0).toFixed(6)}</span>
                        <span class="price-currency-gray" style="color:#6b7280; font-weight:700; font-size:0.85rem;">Pi</span>
                    </span>
                </div>
                <!-- Tickets avec badges -->
                <div class="grid-item">
                    <span style="display:flex; align-items:center; gap:4px;">
                        <span class="tickets-label-badge" style="background:#ef4444; color:white; padding:1px 8px; border-radius:12px; font-weight:700; font-size:0.6rem;">Tickets</span>
                        <span style="font-weight:600; color:#1a1a2e; font-size:0.85rem;">${event.seatsLeft}/${event.seatsTotal}</span>
                    </span>
                </div>
            </div>
            ${event.conditions ? `<div class="event-detail-conditions"><h4>${t('conditions')}</h4>${conditionsHtml}</div>` : ''}
            <div class="event-detail-meta">
                <span><i class="fas fa-user"></i> ${escapeHtml(organizerDisplay)}</span>
                <span><i class="far fa-calendar-alt"></i> ${t('createdOn')} ${new Date(event.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
            </div>
        </div>
        <div class="event-detail-footer">
            <button class="detail-buy-btn" id="detailBuyBtn"><i class="fas fa-ticket-alt"></i> ${t('buyTicket')}</button>
        </div>
    `;

    document.getElementById('detailBuyBtn').onclick = function() {
        closeEventDetailModalAndGoBack();
        setTimeout(() => openQuantityPopup(event.id), 300);
    };

    modal.classList.add('show');
    modal.style.display = 'flex';
    document.body.style.overflow = 'hidden';
    setTimeout(() => { const body = document.querySelector('.event-detail-body'); if (body) body.scrollTop = 0; }, 100);

    const track = document.getElementById('track-detail-' + event.id);
    if (track) {
        track.removeEventListener('scroll', track._scrollHandler);
        const handler = function() {
            if (!this._rafId) {
                this._rafId = requestAnimationFrame(() => {
                    updateCarouselIndicators(this);
                    this._rafId = null;
                });
            }
        };
        track._scrollHandler = handler;
        track.addEventListener('scroll', handler);
        setTimeout(() => updateCarouselIndicators(track), 100);
    }
}

// ============================================================
// CLOSE DETAIL MODAL
// ============================================================
function closeEventDetailModalAndGoBack() {
    const modal = document.getElementById('eventDetailModal');
    if (modal) { modal.classList.remove('show'); modal.style.display = 'none'; document.body.style.overflow = ''; }
    setTimeout(() => {
        if (pageHistory.length > 1) { pageHistory.pop(); showPage(pageHistory[pageHistory.length - 1] || 'home'); } else showPage('home');
    }, 50);
}

// ============================================================
// HERO SLIDER
// ============================================================
function initHeroSlider() {
    const slidesContainer = document.getElementById('heroSlides');
    if (!slidesContainer) return;
    slidesContainer.innerHTML = '';
    heroSlides.forEach((slide, index) => {
        const div = document.createElement('div');
        div.className = 'hero-slide' + (index === 0 ? ' active' : '');
        div.innerHTML = `<div class="hero-slide-bg" style="background-image: url('${slide.image}');"></div>`;
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

// ============================================================
// ADMIN CAROUSEL
// ============================================================
function renderAdminSlides() {
    const container = document.getElementById('adminSlidesList');
    if (!container) return;
    if (heroSlides.length === 0) { container.innerHTML = '<p style="color: var(--gray); text-align:center; padding:20px;">No images in carousel</p>'; return; }
    container.innerHTML = heroSlides.map((slide, index) =>
        `<div class="admin-slide-item"><img src="${slide.image}" class="slide-preview" onerror="this.style.display='none'"><div class="slide-info"><h4>Image ${index+1}</h4></div><div class="slide-actions"><button class="delete-btn" onclick="adminDeleteSlide(${index})">Delete</button></div></div>`
    ).join('');
}

function adminShowSlideForm(index) {
    const container = document.getElementById('adminSlideFormContainer');
    container.style.display = 'block';
    document.getElementById('adminEditSlideIndex').value = index >= 0 ? index : -1;
    document.getElementById('adminSlideImageInput').value = '';
    document.getElementById('adminSlidePreview').style.display = 'none';
    document.getElementById('adminSlidePreview').src = '';
    document.getElementById('adminUploadBox').classList.remove('has-image');
    container.scrollIntoView({ behavior: 'smooth' });
}

async function adminSaveSlide() {
    const imageInput = document.getElementById('adminSlideImageInput');
    const editIndex = document.getElementById('adminEditSlideIndex');
    let imageData = null;
    if (imageInput.files && imageInput.files[0]) {
        const file = imageInput.files[0];
        if (!file.type.startsWith('image/')) { alert('Please select an image'); return; }
        if (file.size > 5 * 1024 * 1024) { alert('Image too large (max 5MB)'); return; }
        const compressedData = await compressImage(file);
        const url = await uploadHeroImage(compressedData, 'slide_' + Date.now());
        if (!url) { alert('Error uploading image'); return; }
        imageData = url;
    } else {
        const index = parseInt(editIndex.value);
        if (index >= 0 && index < heroSlides.length) imageData = heroSlides[index].image;
        else { alert('Please select an image'); return; }
    }
    const slideData = { image: imageData, badge: '', title: 'Slide', description: '' };
    const indexToSave = parseInt(editIndex.value);
    if (indexToSave >= 0 && indexToSave < heroSlides.length) slideData.id = heroSlides[indexToSave].id;
    const saved = await saveHeroSlideToSupabase(slideData, indexToSave);
    if (!saved) { alert('Error saving slide'); return; }
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
    addAdminLog('Slide deleted', 'Image deleted');
}

function adminCancelSlideForm() {
    document.getElementById('adminSlideFormContainer').style.display = 'none';
    document.getElementById('adminEditSlideIndex').value = '-1';
    document.getElementById('adminSlideImageInput').value = '';
    document.getElementById('adminSlidePreview').style.display = 'none';
    document.getElementById('adminSlidePreview').src = '';
    document.getElementById('adminUploadBox').classList.remove('has-image');
}

// ============================================================
// PROFIL – FORMULAIRE AVEC REVUE ET PERSISTANCE (CORRIGÉ)
// ============================================================
let profileDataForReview = {};
let isEditingProfile = false;

function populateProfileCountrySelect() {
    const select = document.getElementById('profileCountry');
    if (!select) return;
    select.innerHTML = '<option value="">Select your country</option>';
    countriesList.forEach(country => {
        if (country === 'All') return;
        const flag = countryFlags[country] || '';
        const option = document.createElement('option');
        option.value = country;
        option.textContent = flag + ' ' + country;
        select.appendChild(option);
    });
}

function populateProfileForm() {
    const firstName = document.getElementById('profileFirstName');
    const lastName = document.getElementById('profileLastName');
    const country = document.getElementById('profileCountry');
    const address = document.getElementById('profileAddress');
    const email = document.getElementById('profileEmail');
    const phone = document.getElementById('profilePhone');
    
    if (firstName) firstName.value = currentUser.first_name || '';
    if (lastName) lastName.value = currentUser.last_name || '';
    if (country) country.value = currentUser.country || '';
    if (address) address.value = currentUser.address || '';
    if (email) email.value = currentUser.email || '';
    if (phone) phone.value = currentUser.phone_number || '';
    
    // Mettre à jour les statuts de vérification
    if (currentUser.email && currentUser.email.trim()) {
        document.getElementById('emailVerificationStatus').innerHTML = '<span class="success"><i class="fas fa-check-circle"></i> Verified</span>';
        document.getElementById('verifyEmailBtn').classList.add('verified');
    } else {
        document.getElementById('emailVerificationStatus').innerHTML = '';
        document.getElementById('verifyEmailBtn').classList.remove('verified');
    }
    if (currentUser.phone_number && currentUser.phone_number.trim()) {
        document.getElementById('phoneVerificationStatus').innerHTML = '<span class="success"><i class="fas fa-check-circle"></i> Verified</span>';
        document.getElementById('verifyPhoneBtn').classList.add('verified');
    } else {
        document.getElementById('phoneVerificationStatus').innerHTML = '';
        document.getElementById('verifyPhoneBtn').classList.remove('verified');
    }

    // Mettre à jour le mode édition
    const complete = checkProfileComplete().complete;
    enableEditMode(!complete);
}

async function loadProfileData() {
    const piUid = currentUser.piUid || currentUser.wallet;
    if (!piUid) {
        console.warn('No piUid, cannot load profile data.');
        return;
    }
    console.log('🔍 Loading profile for piUid:', piUid);
    try {
        const { data, error } = await supabaseClient
            .from('users')
            .select('first_name, last_name, country, address, email, phone_number, profile_completed, profile_reminder_shown')
            .eq('pi_uid', piUid)
            .single();
        if (error) {
            if (error.code === 'PGRST116') {
                console.log('ℹ️ No profile found. It will be created on first save.');
                // Tenter de restaurer depuis le backup
                const backup = localStorage.getItem('betix_profile_backup');
                if (backup) {
                    try {
                        const backupData = JSON.parse(backup);
                        console.log('Restoring profile from backup:', backupData);
                        Object.assign(currentUser, backupData);
                        saveUser();
                        populateProfileForm();
                        updateUserInfo();
                        updateProfilePage();
                        localStorage.removeItem('betix_profile_backup');
                        enableEditMode(true);
                        return;
                    } catch(e) {}
                }
                enableEditMode(true);
                return;
            }
            throw error;
        }
        if (data) {
            console.log('✅ Profile loaded from Supabase:', data);
            const fields = ['first_name', 'last_name', 'country', 'address', 'email', 'phone_number'];
            let hasNewData = false;
            fields.forEach(f => {
                if (data[f] !== undefined && data[f] !== null && data[f].trim) {
                    const val = data[f].trim();
                    if (val) {
                        currentUser[f] = val;
                        hasNewData = true;
                    }
                }
            });
            currentUser.profile_completed = data.profile_completed === true;
            currentUser.profile_reminder_shown = data.profile_reminder_shown === true;
            
            saveUser();
            populateProfileForm();
            updateUserInfo();
            updateProfilePage();
            
            // Supprimer le backup après chargement réussi
            localStorage.removeItem('betix_profile_backup');
            
            // Activer/désactiver l'édition selon la complétude
            const complete = checkProfileComplete().complete;
            enableEditMode(!complete);
            return;
        } else {
            enableEditMode(true);
        }
    } catch (error) {
        console.error('❌ Error loading profile:', error);
        // En cas d'erreur, essayer de restaurer depuis le backup
        const backup = localStorage.getItem('betix_profile_backup');
        if (backup) {
            try {
                const backupData = JSON.parse(backup);
                console.log('Restoring from backup due to error:', backupData);
                Object.assign(currentUser, backupData);
                saveUser();
                populateProfileForm();
                updateUserInfo();
                updateProfilePage();
                localStorage.removeItem('betix_profile_backup');
                enableEditMode(true);
                return;
            } catch(e) {}
        }
        enableEditMode(true);
    }
}

function enableEditMode(edit) {
    const inputs = document.querySelectorAll('#profileForm input, #profileForm select');
    const saveBtn = document.getElementById('saveProfileBtn');
    const editBtn = document.getElementById('editProfileBtn');
    inputs.forEach(inp => inp.disabled = !edit);
    if (edit) {
        saveBtn.style.display = 'inline-block';
        editBtn.style.display = 'none';
        document.getElementById('emailVerificationStatus').innerHTML = '';
        document.getElementById('phoneVerificationStatus').innerHTML = '';
        document.querySelectorAll('.verify-btn').forEach(btn => btn.classList.remove('verified'));
    } else {
        saveBtn.style.display = 'none';
        editBtn.style.display = 'inline-block';
        if (currentUser.email && currentUser.email.trim()) {
            document.getElementById('emailVerificationStatus').innerHTML = '<span class="success"><i class="fas fa-check-circle"></i> Verified</span>';
            document.getElementById('verifyEmailBtn').classList.add('verified');
        }
        if (currentUser.phone_number && currentUser.phone_number.trim()) {
            document.getElementById('phoneVerificationStatus').innerHTML = '<span class="success"><i class="fas fa-check-circle"></i> Verified</span>';
            document.getElementById('verifyPhoneBtn').classList.add('verified');
        }
    }
}

function fillProfileReview() {
    const firstName = document.getElementById('profileFirstName').value.trim();
    const lastName = document.getElementById('profileLastName').value.trim();
    const country = document.getElementById('profileCountry').value;
    const address = document.getElementById('profileAddress').value.trim();
    const email = document.getElementById('profileEmail').value.trim();
    const phone = document.getElementById('profilePhone').value.trim();

    profileDataForReview = { firstName, lastName, country, address, email, phone };

    const content = document.getElementById('profileReviewContent');
    if (!content) return;
    content.innerHTML = `
        <div class="review-item"><span class="review-label">First Name</span><span class="review-value">${escapeHtml(firstName) || '—'}</span></div>
        <div class="review-item"><span class="review-label">Last Name</span><span class="review-value">${escapeHtml(lastName) || '—'}</span></div>
        <div class="review-item"><span class="review-label">Country</span><span class="review-value">${escapeHtml(country) || '—'}</span></div>
        <div class="review-item"><span class="review-label">Address</span><span class="review-value">${escapeHtml(address) || '—'}</span></div>
        <div class="review-item"><span class="review-label">Email</span><span class="review-value">${escapeHtml(email) || '—'}</span></div>
        <div class="review-item"><span class="review-label">Phone</span><span class="review-value">${escapeHtml(phone) || '—'}</span></div>
    `;
}

function openProfileReview() {
    const firstName = document.getElementById('profileFirstName').value.trim();
    const lastName = document.getElementById('profileLastName').value.trim();
    if (!firstName || !lastName) {
        alert('First name and last name are required.');
        return;
    }
    fillProfileReview();
    document.getElementById('profileReviewModal').classList.add('show');
    document.getElementById('profileReviewLoading').style.display = 'none';
    document.getElementById('profileReviewConfirmBtn').style.display = 'inline-block';
    document.getElementById('profileReviewEditBtn').style.display = 'inline-block';
}

function closeProfileReview() {
    document.getElementById('profileReviewModal').classList.remove('show');
}

async function confirmProfileSave() {
    const data = profileDataForReview;
    if (!data.firstName || !data.lastName) {
        alert('First name and last name are required.');
        return;
    }
    if (data.email && !data.email.includes('@')) {
        alert('Please enter a valid email address.');
        return;
    }

    document.getElementById('profileReviewConfirmBtn').style.display = 'none';
    document.getElementById('profileReviewEditBtn').style.display = 'none';
    document.getElementById('profileReviewLoading').style.display = 'block';

    await new Promise(resolve => setTimeout(resolve, 1500));

    const piUid = currentUser.piUid || currentUser.wallet;
    if (!piUid) {
        alert('Please connect your Pi account first.');
        closeProfileReview();
        return;
    }

    try {
        const updates = {
            first_name: data.firstName,
            last_name: data.lastName,
            country: data.country,
            address: data.address,
            email: data.email,
            phone_number: data.phone,
            profile_completed: true,
            profile_reminder_shown: true,
            updated_at: new Date().toISOString()
        };
        const { error } = await supabaseClient.from('users').update(updates).eq('pi_uid', piUid);
        if (error) throw error;

        Object.assign(currentUser, {
            first_name: data.firstName,
            last_name: data.lastName,
            country: data.country,
            address: data.address,
            email: data.email,
            phone_number: data.phone,
            profile_completed: true,
            profile_reminder_shown: true
        });
        saveUser();
        await loadProfileData();
        await syncUserToSupabase();

        closeProfileReview();
        const msg = document.getElementById('profileSaveMessage');
        msg.innerHTML = `
            <div style="background:#f0fdf4; border:1px solid #10b981; border-radius:12px; padding:16px; display:flex; align-items:center; gap:12px;">
                <i class="fas fa-check-circle" style="color:#10b981; font-size:1.5rem;"></i>
                <div>
                    <strong style="color:#1a1a2e;">Profile Updated Successfully!</strong>
                    <p style="margin:4px 0 0; font-size:0.85rem; color:#4b5563;">Your information has been saved and is now up to date.</p>
                </div>
            </div>
        `;
        setTimeout(() => { msg.innerHTML = ''; }, 5000);

        updateUserInfo();
        updateProfilePage();
        enableEditMode(false);
    } catch (error) {
        alert('Error saving profile: ' + error.message);
        closeProfileReview();
    }
}

function verifyEmail() {
    const email = document.getElementById('profileEmail').value.trim();
    if (!email || !email.includes('@')) {
        alert('Please enter a valid email address.');
        return;
    }
    const code = Math.floor(100000 + Math.random() * 900000);
    alert(`A verification code has been sent to ${email}.\nCode: ${code} (demo)`);
    document.getElementById('emailVerificationStatus').innerHTML = '<span class="success"><i class="fas fa-check-circle"></i> Verified</span>';
    document.getElementById('verifyEmailBtn').classList.add('verified');
}

function verifyPhone() {
    const phone = document.getElementById('profilePhone').value.trim();
    if (!phone || phone.length < 6) {
        alert('Please enter a valid phone number.');
        return;
    }
    const code = Math.floor(100000 + Math.random() * 900000);
    alert(`A verification code has been sent to ${phone}.\nCode: ${code} (demo)`);
    document.getElementById('phoneVerificationStatus').innerHTML = '<span class="success"><i class="fas fa-check-circle"></i> Verified</span>';
    document.getElementById('verifyPhoneBtn').classList.add('verified');
}

// ============================================================
// QUANTITY POPUP ET ACHAT
// ============================================================
function openQuantityPopup(eventId) {
    if (!requireLogin()) return;
    if (!requireProfileComplete()) return;
    const event = events.find(e => e.id === eventId);
    if (!event) { alert(t('eventNotFound')); return; }
    if (!piUser && !currentUser.wallet) { alert(t('pleaseConnect')); connectToPi(); return; }
    const standardLeft = event.standardLeft !== undefined ? event.standardLeft : (event.standardSeats || 0);
    if (standardLeft <= 0) { alert('All tickets are sold out for this event'); return; }
    selectedEventForPurchase = event;
    const popup = document.getElementById('quantityPopup');
    const titleEl = document.getElementById('quantityEventTitle');
    const maxInfo = document.getElementById('maxQuantityInfo');
    const quantityInput = document.getElementById('ticketQuantity');
    if (titleEl) titleEl.textContent = event.title;
    if (quantityInput) { quantityInput.value = 1; quantityInput.min = 1; quantityInput.max = Math.min(standardLeft, 10); }
    if (maxInfo) maxInfo.textContent = 'Maximum: ' + Math.min(standardLeft, 10) + ' ticket(s) available';
    updateTicketTotal();
    popup.classList.add('show');
}

function closeQuantityPopup() {
    document.getElementById('quantityPopup').classList.remove('show');
    selectedEventForPurchase = null;
}

function updateQuantity(delta) {
    const input = document.getElementById('ticketQuantity');
    if (!input) return;
    let val = parseInt(input.value) || 1;
    const maxVal = parseInt(input.max) || 10;
    val = Math.min(Math.max(val + delta, 1), maxVal);
    input.value = val;
    updateTicketTotal();
}

function updateTicketTotal() {
    const input = document.getElementById('ticketQuantity');
    const subtotalDisplay = document.getElementById('subtotalDisplay');
    const serviceFeeDisplay = document.getElementById('serviceFeeDisplay');
    const totalDisplay = document.getElementById('totalPriceDisplay');
    if (!input || !totalDisplay || !selectedEventForPurchase) return;
    const qty = parseInt(input.value) || 1;
    const price = selectedEventForPurchase.price || 0;
    const subtotal = qty * price;
    const serviceFeePercent = appSettings.serviceFeePercent || 2;
    const serviceFee = subtotal * (serviceFeePercent / 100);
    const total = subtotal + serviceFee;
    if (subtotalDisplay) subtotalDisplay.textContent = subtotal.toFixed(6) + ' Pi';
    if (serviceFeeDisplay) serviceFeeDisplay.textContent = serviceFee.toFixed(6) + ' Pi';
    if (totalDisplay) totalDisplay.textContent = total.toFixed(6) + ' Pi';
}

function confirmPurchaseFromPopup() {
    if (!selectedEventForPurchase) { alert('No event selected'); return; }
    const quantityInput = document.getElementById('ticketQuantity');
    const quantity = parseInt(quantityInput.value) || 1;
    if (quantity < 1) { alert('Please select at least 1 ticket'); return; }
    const availableSeats = selectedEventForPurchase.standardLeft !== undefined ? selectedEventForPurchase.standardLeft : (selectedEventForPurchase.standardSeats || 0);
    if (quantity > availableSeats) { alert('No seats available. Remaining: ' + availableSeats); return; }
    if (quantity > 10) { alert('Maximum 10 tickets per purchase'); return; }
    confirmPurchase(selectedEventForPurchase.id, quantity);
}

// ============================================================
// CONFIRMATION D'ACHAT
// ============================================================
const processingTransactions = new Set();
let confirmPurchaseResolve = null;

function openConfirmPurchasePopup(title, subtotal, serviceFee, total) { return Promise.resolve(false); }
function closeConfirmPurchasePopup() {}

async function confirmPurchase(eventId, quantity) {
    const event = events.find(e => e.id === eventId);
    if (!event) { alert(t('eventNotFound')); return; }
    const eventDate = new Date(event.date);
    if (eventDate < new Date()) {
        openPastEventPopup();
        return;
    }
    const price = event.price || 0;
    const availableSeats = event.standardLeft !== undefined ? event.standardLeft : (event.standardSeats || 0);
    if (quantity > availableSeats) {
        alert('No seats available. Remaining: ' + availableSeats);
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
            return;
        }
        if (!piUser || !piUser.username) {
            alert('Please connect your Pi account first with payments scope.');
            if (confirmBtn) { confirmBtn.textContent = t('confirmPurchase'); confirmBtn.disabled = false; }
            connectToPi();
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
                if (processingTransactions.has(txid)) {
                    console.log('Transaction already in progress:', txid);
                    return;
                }
                processingTransactions.add(txid);
                try {
                    const existingTickets = tickets.filter(t => t.transactionId === txid);
                    if (existingTickets.length > 0) {
                        openTransactionProcessedPopup(5);
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
                            openTransactionProcessedPopup(5);
                            renderTickets();
                            renderHistory();
                            showPage('tickets');
                            processingTransactions.delete(txid);
                            if (confirmBtn) { confirmBtn.textContent = t('confirmPurchase'); confirmBtn.disabled = false; }
                            return;
                        }
                    }
                    const purchaseDate = new Date().toISOString();
                    event.standardSold = (event.standardSold || 0) + quantity;
                    event.standardLeft = (event.standardSeats || 0) - event.standardSold;
                    event.seatsLeft -= quantity;
                    event.boosts = (event.boosts || 0) + quantity;
                    
                    const existingTicketsForEvent = tickets.filter(t => t.eventId === event.id && t.ticketNumber !== undefined);
                    const lastNumber = existingTicketsForEvent.reduce((max, t) => Math.max(max, t.ticketNumber || 0), 0);
                    let nextNumber = lastNumber + 1;
                    
                    const fullName = (currentUser.first_name || currentUser.name || 'Guest') + 
                                     (currentUser.last_name ? ' ' + currentUser.last_name : '');
                    const buyerEmail = currentUser.email || 'Not provided';
                    const buyerPhone = currentUser.phone_number || 'Not provided';
                    
                    const ticketsAdded = [];
                    for (let i = 0; i < quantity; i++) {
                        const ticketId = Date.now().toString() + '-' + i + '-' + Math.random().toString(36).substring(2, 6);
                        const qrData = ticketId;
                        const organizerName = event.organizerName || event.organizer || 'Anonymous';
                        const organizerPiUid = event.organizerPiUid || event.organizer || '';
                        const ticket = {
                            id: ticketId,
                            eventId: event.id,
                            eventTitle: event.title || 'Event',
                            eventDate: event.date || new Date().toISOString(),
                            eventLocation: event.location || 'Online',
                            category: event.category || '',
                            price: price,
                            ticketType: 'standard',
                            pays: event.pays || event.country || 'France',
                            buyerWallet: piUser ? piUser.username : currentUser.wallet,
                            buyerName: fullName || 'Anonymous',
                            buyerEmail: buyerEmail,
                            buyerPhone: buyerPhone,
                            userWallet: currentUser.wallet,
                            status: 'Valid',
                            purchaseDate: purchaseDate,
                            transactionId: txid || 'tx-' + Date.now(),
                            qrCode: qrData,
                            quantity: quantity,
                            durationValue: event.durationValue || null,
                            durationUnit: event.durationUnit || null,
                            organizerName: organizerName,
                            organizerPiUid: organizerPiUid,
                            eventPays: event.pays || event.country || 'France',
                            ticketNumber: nextNumber + i
                        };
                        tickets.push(ticket);
                        ticketsAdded.push(ticket);
                    }
                    saveEvents();
                    saveTickets();
                    for (let j = 0; j < ticketsAdded.length; j++) {
                        const saved = await saveTicketToSupabase(ticketsAdded[j]);
                        if (!saved) {
                            pendingTickets.push(ticketsAdded[j]);
                            localStorage.setItem('betix_pending_tickets', JSON.stringify(pendingTickets));
                            console.warn('Ticket', ticketsAdded[j].id, 'saved locally, will retry later.');
                        }
                        await new Promise(r => setTimeout(r, 200));
                    }
                    await saveEventToSupabase(event);
                    const commission = subtotal * (appSettings.commissionPercent / 100);
                    await saveTransactionToSupabase({
                        id: 'tx-' + Date.now(),
                        buyerWallet: currentUser.wallet,
                        buyerPiUid: currentUser.piUid || currentUser.wallet,
                        eventId: event.id,
                        amount: totalPrice,
                        txid: txid || 'tx-' + Date.now(),
                        status: 'completed',
                        date: new Date().toISOString(),
                        subtotal: subtotal,
                        serviceFee: serviceFee,
                        commission: commission
                    });
                    addNotification('New sale! ' + quantity + ' ticket(s) purchased for "' + event.title + '"', 'purchase');
                    addNotification('Purchase successful! ' + quantity + ' ticket(s) for "' + event.title + '"', 'purchase');
                    renderEventsByCategory();
                    renderTickets();
                    renderHistory();
                    updateProfilePage();
                    setTimeout(() => {
                        if (typeof generateAllQRCodes === 'function') generateAllQRCodes();
                    }, 300);
                    await syncUserToSupabase();
                    showSuccessPopup(event, ticketsAdded, quantity);
                    processingTransactions.delete(txid);
                } catch (error) {
                    console.error('Error finalizing payment:', error);
                    alert('Payment was successful but an error occurred while saving tickets. Please contact support.');
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

// ============================================================
// STAGGERED ANIMATION
// ============================================================
function applyStaggeredAnimation(containerSelector, delayIncrement = 0.06) {
    const container = document.querySelector(containerSelector);
    if (!container) return;
    const items = container.children;
    for (let i = 0; i < items.length; i++) {
        const item = items[i];
        item.classList.add('stagger-item');
        item.style.animationDelay = (i * delayIncrement) + 's';
    }
}

// ============================================================
// TOAST NOTIFICATION
// ============================================================
function showToast(title, message, type = 'success') {
    const existing = document.querySelector('.toast-notification');
    if (existing) existing.remove();
    const toast = document.createElement('div');
    toast.className = `toast-notification toast-${type}`;
    toast.innerHTML = `
        <div class="toast-icon"><i class="fas ${type === 'success' ? 'fa-check-circle' : 'fa-info-circle'}"></i></div>
        <div class="toast-content">
            <div class="toast-title">${escapeHtml(title)}</div>
            <div class="toast-message">${escapeHtml(message)}</div>
        </div>
        <button class="toast-close"><i class="fas fa-times"></i></button>
    `;
    document.body.appendChild(toast);
    toast.querySelector('.toast-close').addEventListener('click', function() { closeToast(toast); });
    requestAnimationFrame(() => { toast.classList.add('show'); });
    setTimeout(() => { closeToast(toast); }, 5000);
}

function closeToast(toast) {
    if (!toast) return;
    toast.classList.remove('show');
    setTimeout(() => toast.remove(), 400);
}

// ============================================================
// SUCCESS POPUP
// ============================================================
function showSuccessPopup(event, ticketsList, quantity) {
    const popup = document.getElementById('successPopup');
    const title = document.getElementById('successTitle');
    const message = document.getElementById('successMessage');
    const info = document.getElementById('successTicketInfo');
    const viewBtn = document.getElementById('viewTicketBtn');
    const homeBtn = document.getElementById('successHomeBtn');
    const closeBtn = document.getElementById('closeSuccessXBtn');
    if (!popup || popup.classList.contains('show')) return;

    const qty = quantity || ticketsList.length;
    const ticket = ticketsList[0] || {};
    const price = event.price || 0;
    const totalPrice = qty * price;

    title.textContent = '✅ Purchase confirmed!';
    message.textContent = `Congratulations! You have purchased ${qty} ticket(s) for "${event.title}".`;
    const subMsg = document.querySelector('.success-submessage');
    if (subMsg) subMsg.textContent = 'Your ticket is available in your personal space. You will also receive a confirmation email.';

    const dateEvent = new Date(event.date);
    const dateFormatted = !isNaN(dateEvent.getTime()) ? dateEvent.toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' }) : 'Date to be defined';
    const timeFormatted = !isNaN(dateEvent.getTime()) ? dateEvent.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }) : 'Time to be defined';
    const codeDisplay = ticket.qrCode || ticket.id || 'N/A';
    const paysDisplay = event.pays || event.country || 'France';
    const countryFlag = countryFlags[paysDisplay] || '';
    const countryDisplay = countryFlag + ' ' + paysDisplay;

    info.innerHTML = `
        <div class="ticket-line"><span class="ticket-label">Event</span><span class="ticket-value">${escapeHtml(event.title)}</span></div>
        <div class="ticket-line"><span class="ticket-label">Type</span><span class="ticket-value">Standard</span></div>
        <div class="ticket-line"><span class="ticket-label">Date</span><span class="ticket-value">${dateFormatted} at ${timeFormatted}</span></div>
        <div class="ticket-line"><span class="ticket-label">Location</span><span class="ticket-value">${escapeHtml(event.location || 'Online')}</span></div>
        <div class="ticket-line"><span class="ticket-label">Country</span><span class="ticket-value">${countryDisplay}</span></div>
        <div class="ticket-line"><span class="ticket-label">Quantity</span><span class="ticket-value">${qty}</span></div>
        <div class="ticket-line"><span class="ticket-label">Total paid</span><span class="ticket-value">${totalPrice.toFixed(6)} Pi</span></div>
        <div class="ticket-line"><span class="ticket-label">Reference</span><span class="ticket-value" style="font-size:0.7rem;font-family:monospace;">${escapeHtml(codeDisplay)}</span></div>
    `;

    closeBtn.onclick = function(e) { e.preventDefault(); closeSuccessPopup(); };
    homeBtn.onclick = function(e) {
        e.preventDefault();
        closeSuccessPopup();
        showPage('home');
        setTimeout(() => {
            const eventCards = document.querySelectorAll('.event-card-classic');
            for (let card of eventCards) {
                if (card.textContent.includes(event.title)) {
                    card.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    card.style.transition = 'box-shadow 0.3s ease, transform 0.3s ease';
                    card.style.boxShadow = '0 0 0 4px #F5B400, 0 8px 30px rgba(0,0,0,0.15)';
                    card.style.transform = 'scale(1.02)';
                    setTimeout(() => {
                        card.style.boxShadow = '';
                        card.style.transform = '';
                    }, 2000);
                    break;
                }
            }
        }, 500);
    };
    viewBtn.onclick = function(e) {
        e.preventDefault();
        closeSuccessPopup();
        showPage('tickets');
    };

    popup.style.display = 'flex';
    popup.classList.add('show');
    const eventName = event.title || 'Event';
    showToast('🎉 Purchase successful!', `You have purchased ${qty} ticket(s) for "${eventName}". Check your tickets in "My Tickets".`, 'success');
}

function closeSuccessPopup() {
    const popup = document.getElementById('successPopup');
    if (popup) {
        popup.classList.remove('show');
        popup.style.display = 'none';
    }
    const info = document.getElementById('successTicketInfo');
    if (info) info.innerHTML = '';
    localStorage.removeItem('betix_success_popup_shown');
}

// ============================================================
// CONNEXION PI (CORRIGÉE – chargement du profil avant sync)
// ============================================================
async function connectToPi() {
    showConnectSpinner();
    const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error('Connection timeout (15s)')), 15000);
    });
    try {
        await Promise.race([
            (async () => {
                if (!piSDKReady) {
                    const ready = await ensurePiSDKReady();
                    if (!ready) throw new Error('Pi SDK not available after waiting.');
                }
                if (typeof Pi === 'undefined') {
                    if (confirm(t('demoMode'))) {
                        currentUser.wallet = 'demo_user';
                        currentUser.piUid = 'demo_user';
                        currentUser.name = 'Demo User';
                        currentUser.memberSince = '2026';
                        currentUser.loyaltyPoints = 0;
                        saveUser();
                        // Charger le profil après connexion (important)
                        await loadProfileData();
                        await syncUserToSupabase();
                        updateActivity();
                        updateUserInfo();
                        updateProfilePage();
                        trackUserConnection();
                        renderEventsByCategory();
                        updateConnectButtons();
                        await loadAllFromSupabase();
                        await syncAllToSupabase();
                        currentFilter = 'All';
                        currentCountryFilter = 'All';
                        initFilters();
                        renderEventsByCategory();
                        alert(t('demoConnected'));
                        closeSidebar();
                        checkAndNotifyProfileCompletion();
                        hideConnectSpinner();
                        return;
                    }
                    throw new Error('Pi Browser required.');
                }

                const scopes = ['username', 'payments'];
                const auth = await Pi.authenticate(scopes, onIncompletePaymentFound);
                if (auth && auth.user) {
                    piUser = auth.user;
                    // Définir l'identifiant utilisateur
                    currentUser.wallet = piUser.username;
                    currentUser.piUid = piUser.username;
                    currentUser.name = piUser.username;
                    if (!currentUser.loyaltyPoints) currentUser.loyaltyPoints = 0;

                    // ⚠️ NE PAS réinitialiser les champs de profil ici
                    // Charger d'abord les données existantes depuis Supabase
                    await loadProfileData();

                    // Maintenant synchroniser l'utilisateur (avec les données chargées)
                    await syncUserToSupabase();

                    updateActivity();
                    updateUserInfo();
                    updateProfilePage();
                    trackUserConnection();
                    renderEventsByCategory();
                    updateConnectButtons();
                    await loadAllFromSupabase();
                    await syncAllToSupabase();
                    currentFilter = 'All';
                    currentCountryFilter = 'All';
                    initFilters();
                    renderEventsByCategory();
                    alert(t('piConnected') + piUser.username);
                    closeSidebar();

                    // La vérification de complétion du profil est faite par loadProfileData
                    // On la rappelle au cas où
                    checkAndNotifyProfileCompletion();
                    await retryPendingTickets();
                    hideConnectSpinner();
                    return;
                } else {
                    throw new Error(t('authenticationFailed'));
                }
            })(),
            timeoutPromise
        ]);
    } catch (error) {
        console.error('Connection error:', error);
        let errorMsg = t('connectionError') + ': ' + (error.message || "Please try again");
        if (error.message.includes('timeout')) {
            errorMsg = 'Connection timeout. Please check your internet connection and try again.';
        }
        alert(errorMsg);
        const btn = document.getElementById('sidebarWalletBtn');
        if (btn) {
            btn.textContent = t('connectPi');
            btn.disabled = false;
            btn.classList.remove('loading');
        }
    } finally {
        hideConnectSpinner();
    }
}

// ============================================================
// NOTIFICATION DE COMPLÉTION DE PROFIL
// ============================================================
function checkAndNotifyProfileCompletion() {
    if (currentUser.wallet && !currentUser.profile_completed && !currentUser.profile_reminder_shown) {
        setTimeout(() => {
            showToast(t('incompleteProfile'), t('pleaseCompleteProfile'), 'info');
            currentUser.profile_reminder_shown = true;
            saveUser();
        }, 5000);
    }
}

// ============================================================
// CRÉATION D'ÉVÉNEMENT
// ============================================================
async function createEvent(e) {
    e.preventDefault();
    if (!requireLogin()) return;
    if (!requireProfileComplete()) return;
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
    if (seatsTotal < 1) { alert('At least one ticket must be available'); return; }
    if (!conditions) { alert(t('conditions') + ' ' + t('required')); return; }
    const images = getUploadedImages();
    if (images.length < 1) { alert('At least 1 image is required (up to 3)'); return; }
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
        for (let i = 0; i < 3; i++) removeImageModern(i);
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
    if (seatsTotal < 1) { alert('At least one ticket must be available'); return; }
    const ticketsSold = tickets.filter(t => t.eventId === editingEventId).length;
    if (seatsTotal < ticketsSold) { alert('You cannot reduce the number of seats below the ' + ticketsSold + ' already sold'); return; }
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
    setTimeout(() => { applyStaggeredAnimation('#myRatingsList'); }, 50);
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
    setTimeout(() => {
        const filterSelect = document.getElementById('countrySelect');
        if (filterSelect) {
            const options = filterSelect.querySelectorAll('option');
            options.forEach((opt, i) => {
                opt.classList.add('stagger-item');
                opt.style.animationDelay = (i * 0.015) + 's';
            });
        }
        const eventSelect = document.getElementById('eventCountry');
        if (eventSelect) {
            const options = eventSelect.querySelectorAll('option');
            options.forEach((opt, i) => {
                opt.classList.add('stagger-item');
                opt.style.animationDelay = (i * 0.015) + 's';
            });
        }
    }, 50);
}

// ============================================================
// LANGUE, TRADUCTIONS ET UI
// ============================================================
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

// ============================================================
// NOTIFICATIONS
// ============================================================
function deleteNotification(id) {
    notifications = notifications.filter(n => n.id !== id);
    saveNotifications();
    renderNotificationsPage();
    updateNotifBadgeHeader();
    updateSidebarNotifBadge();
}

function clearAllNotifications() {
    if (notifications.length === 0) return;
    if (confirm('Delete all notifications?')) {
        notifications = [];
        saveNotifications();
        renderNotificationsPage();
        updateNotifBadgeHeader();
        updateSidebarNotifBadge();
        addNotification('All notifications have been cleared.', 'info');
    }
}

function renderNotificationsPage() {
    const container = document.getElementById('notificationsList');
    if (!container) return;
    if (!notifications || notifications.length === 0) {
        container.innerHTML = `
            <div class="notification-empty">
                <i class="fas fa-bell-slash"></i>
                <p style="font-size:0.95rem;">${t('noNotifications')}</p>
            </div>
        `;
        return;
    }
    let html = `
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:16px;flex-wrap:wrap;gap:8px;">
            <span style="font-size:0.85rem;color:#6b7280;">${notifications.length} notification(s)</span>
            <button class="btn-secondary" onclick="clearAllNotifications()" style="background:#ef4444;color:white;border:none;padding:4px 14px;border-radius:20px;cursor:pointer;font-size:0.75rem;">
                <i class="fas fa-trash"></i> Clear all
            </button>
        </div>
    `;
    notifications.forEach((notif) => {
        const time = new Date(notif.date);
        const timeStr = time.toLocaleDateString('en-US') + ' ' + time.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
        const unreadClass = notif.read ? '' : 'unread';
        const type = notif.type || 'info';
        const iconMap = { purchase: 'fa-shopping-cart', event: 'fa-calendar-plus', info: 'fa-info-circle', warning: 'fa-exclamation-triangle', success: 'fa-check-circle' };
        const icon = iconMap[type] || 'fa-info-circle';
        html += `
            <div class="notification-item type-${type} ${unreadClass}">
                <div class="notif-icon"><i class="fas ${icon}"></i></div>
                <div class="notif-content">
                    <div class="notif-msg">${escapeHtml(notif.message)}</div>
                    <div class="notif-time">${timeStr}</div>
                </div>
                <button class="notif-delete-btn" onclick="deleteNotification('${notif.id}')" title="Delete"><i class="fas fa-times"></i></button>
            </div>
        `;
    });
    container.innerHTML = html;
    notifications.forEach(n => n.read = true);
    saveNotifications();
    updateNotifBadgeHeader();
    updateSidebarNotifBadge();
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

// ============================================================
// NAVIGATION ET PROFIL
// ============================================================
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

// ============================================================
// DISCONNECT (avec sauvegarde du profil avant déconnexion)
// ============================================================
async function disconnectPi() {
    if (!confirm(t('disconnect') + '?')) return;
    
    // Sauvegarder le profil dans Supabase avant de déconnecter
    try {
        await syncUserToSupabase();
        console.log('✅ Profile saved to Supabase before disconnection.');
    } catch (error) {
        console.error('❌ Error saving profile before disconnection:', error);
    }

    // Sauvegarder une copie des données de profil dans localStorage (backup)
    const profileBackup = {
        first_name: currentUser.first_name || '',
        last_name: currentUser.last_name || '',
        country: currentUser.country || '',
        address: currentUser.address || '',
        email: currentUser.email || '',
        phone_number: currentUser.phone_number || '',
        profile_completed: currentUser.profile_completed || false,
        profile_reminder_shown: currentUser.profile_reminder_shown || false
    };
    localStorage.setItem('betix_profile_backup', JSON.stringify(profileBackup));

    // Réinitialiser les champs de session et de profil
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

function logout() { disconnectPi(); }
function startSessionMonitor() { setInterval(() => { if (currentUser.wallet && isSessionExpired()) { disconnectPi(); alert(t('sessionExpired')); } }, 300000); }
function bindActivityListeners() { ['click','scroll','keydown','touchstart'].forEach(e => document.addEventListener(e, updateActivity)); }

// ============================================================
// SHOW PAGE
// ============================================================
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
    if (pageName === 'profile') { 
        updateProfilePage(); 
        // Toujours recharger les données du profil si l'utilisateur est connecté
        if (currentUser.piUid || currentUser.wallet) {
            loadProfileData(); 
        } else {
            populateProfileForm();
            const complete = checkProfileComplete().complete;
            enableEditMode(!complete);
            if (currentUser.email) {
                document.getElementById('emailVerificationStatus').innerHTML = '<span class="success"><i class="fas fa-check-circle"></i> Verified</span>';
            }
            if (currentUser.phone_number) {
                document.getElementById('phoneVerificationStatus').innerHTML = '<span class="success"><i class="fas fa-check-circle"></i> Verified</span>';
            }
        }
    }
    if (pageName === 'ratings') renderMyRatings();
    if (pageName === 'admin') loadAdminPage();
    if (pageName === 'myevents') renderMyEvents();
    if (pageName === 'notifications') renderNotificationsPage();
    if (pageName === 'home' || pageName === 'myevents') {
        setTimeout(initCarouselIndicators, 300);
    }
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

// ============================================================
// UPDATE CONNECT BUTTONS
// ============================================================
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
        if (currentUser.wallet) {
            profilePageBtn.textContent = t('disconnect');
            profilePageBtn.className = 'btn-primary disconnect-btn';
            profilePageBtn.onclick = function() { disconnectPi(); };
        } else {
            profilePageBtn.textContent = t('connectPi');
            profilePageBtn.className = 'btn-primary';
            profilePageBtn.onclick = function() { connectToPi(); };
        }
    }
}

function showConnectSpinner() {
    const btn = document.getElementById('sidebarWalletBtn');
    if (btn) { btn.textContent = t('connecting'); btn.disabled = true; btn.classList.add('loading'); }
}
function hideConnectSpinner() {
    const btn = document.getElementById('sidebarWalletBtn');
    if (btn) { btn.disabled = false; btn.classList.remove('loading'); updateConnectButtons(); }
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

// ============================================================
// RENDER MY EVENTS
// ============================================================
function renderMyEvents() {
    const container = document.getElementById('myEventsList');
    if (!container) return;
    const userId = currentUser.piUid || currentUser.wallet;
    const myEvents = events.filter(e => 
        e.organizer === userId || e.organizerPiUid === userId || e.organizerName === currentUser.name
    );
    if (myEvents.length === 0) {
        container.innerHTML = `<div style="text-align:center;padding:3rem;color:var(--gray);background:#f9fafb;border-radius:16px;border:1px solid #e5e7eb;"><i class="fas fa-calendar-plus" style="font-size:2.5rem;color:var(--primary);margin-bottom:12px;display:block;"></i><p style="font-size:1rem;font-weight:500;margin-bottom:4px;">${t('noEvents')}</p><p style="font-size:0.85rem;">${t('createEvent')}</p></div>`;
        return;
    }
    container.innerHTML = myEvents.map(e => renderMyEventCardModern(e)).join('');
    updateScanButtonVisibility();
    setTimeout(() => { applyStaggeredAnimation('#myEventsList'); }, 50);
    setTimeout(initCarouselIndicators, 300);
}

function renderMyEventCardModern(event) {
    const dateEvent = new Date(event.date);
    const dateFormatted = !isNaN(dateEvent.getTime()) ? dateEvent.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'Date to be defined';
    const timeFormatted = !isNaN(dateEvent.getTime()) ? dateEvent.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }) : 'Time to be defined';
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

function initFilters() {
    const cats = ['All', 'Concert', 'Sport', 'Conference', 'Training', 'Cinema', 'Festival', 'Theatre', 'Dance', 'Exhibition', 'Gala', 'Seminar', 'Formation'];
    const container = document.getElementById('filtersContainer');
    if (!container) return;
    container.innerHTML = cats.map(c => `<div class="filter-chip ${c === currentFilter ? 'active' : ''}" data-category="${c}">${c === 'All' ? t('all') : c}</div>`).join('');
    document.querySelectorAll('.filter-chip').forEach(chip => chip.addEventListener('click', function() { currentFilter = this.dataset.category; initFilters(); renderEventsByCategory(); }));
}

function updateUserInfo() {
    const displayName = (currentUser.first_name || currentUser.name || 'Guest') + (currentUser.last_name ? ' ' + currentUser.last_name : '');
    document.getElementById('sidebarName') && (document.getElementById('sidebarName').textContent = displayName);
    document.getElementById('profileNameDisplay') && (document.getElementById('profileNameDisplay').textContent = displayName);
    document.getElementById('sidebarWallet') && (document.getElementById('sidebarWallet').textContent = currentUser.wallet ? 'Connected' : t('notConnected'));
    document.getElementById('sidebarAvatarText') && (document.getElementById('sidebarAvatarText').textContent = (displayName || 'U')[0].toUpperCase());
    document.getElementById('profileWalletDisplay') && (document.getElementById('profileWalletDisplay').textContent = currentUser.wallet || t('notConnected'));
    document.getElementById('memberSince') && (document.getElementById('memberSince').textContent = currentUser.memberSince || '2026');
    updateConnectButtons();
    updateSidebarNotifBadge();
    updateUITranslations();
    updateScanButtonVisibility();
}

function updateProfilePage() {
    const userId = currentUser.piUid || currentUser.wallet;
    const myEvents = events.filter(e => e.organizer === userId || e.organizerPiUid === userId || e.organizerName === currentUser.name);
    const userTickets = tickets.filter(t => t.userWallet === userId || t.buyerWallet === userId);
    const userRatings = ratings.filter(r => r.userWallet === userId || r.userWallet === currentUser.name);
    document.getElementById('myEventsCount') && (document.getElementById('myEventsCount').textContent = myEvents.length);
    document.getElementById('ticketCount') && (document.getElementById('ticketCount').textContent = userTickets.length);
    document.getElementById('historyCount') && (document.getElementById('historyCount').textContent = tickets.filter(t => (usedTickets.indexOf(t.id) !== -1 || new Date(t.eventDate) <= new Date()) && (t.userWallet === userId || t.buyerWallet === userId)).length);
    document.getElementById('ratedCount') && (document.getElementById('ratedCount').textContent = userRatings.length);
    document.getElementById('profileRatingDisplay') && (document.getElementById('profileRatingDisplay').textContent = userRatings.length);
    document.getElementById('profileLoyaltyDisplay') && (document.getElementById('profileLoyaltyDisplay').textContent = currentUser.loyaltyPoints || 0);
    updateUserInfo();
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
// ADMIN
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
                adminItem.style.background = 'linear-gradient(135deg, #1a1a2e, #0B1F5C)';
                adminItem.style.color = 'white';
                addAdminLog('Admin authentication', 'Login via logo');
                alert(t('adminActivated'));
            }
            clicks = 0;
        }
        setTimeout(() => { clicks = 0; }, 2000);
    });
    if (localStorage.getItem('betix_admin_password') === adminPassword || localStorage.getItem('betix_admin_password') === 'Betix@2026#') {
        adminItem.style.display = 'block';
        adminItem.style.background = 'linear-gradient(135deg, #1a1a2e, #0B1F5C)';
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
    if (adminLogs.length === 0) { container.innerHTML = '<p style="text-align:center;padding:20px;color:var(--gray);">' + t('noLogs') + '</p>'; return; }
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
        alert(t('logsCleared'));
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
        display.style.color = adminSessionTimer < 300 ? '#ef4444' : adminSessionTimer < 600 ? '#f59e0b' : '#F5B400';
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
    alert(t('adminSessionEnded'));
    showPage('home');
}

function adminChangePassword() {
    const newPassword = document.getElementById('adminNewPassword').value;
    const confirmPassword = document.getElementById('adminConfirmPassword').value;
    const message = document.getElementById('adminPasswordMessage');
    if (!newPassword || newPassword.length < 6) { message.textContent = t('passwordMin'); message.style.color = '#ef4444'; return; }
    if (newPassword !== confirmPassword) { message.textContent = t('passwordsDontMatch'); message.style.color = '#ef4444'; return; }
    adminPassword = newPassword;
    localStorage.setItem('betix_admin_password', newPassword);
    message.textContent = t('passwordChanged');
    message.style.color = '#10b981';
    document.getElementById('adminNewPassword').value = '';
    document.getElementById('adminConfirmPassword').value = '';
    addAdminLog('Password changed', 'Admin password was updated');
    setTimeout(() => { message.textContent = ''; }, 3000);
}

async function adminSaveSettings() {
    const commission = parseFloat(document.getElementById('adminCommission').value);
    const serviceFee = parseFloat(document.getElementById('adminServiceFee').value);
    const piRate = parseFloat(document.getElementById('adminPiRate').value);
    if (isNaN(commission) || commission < 0 || commission > 100) { alert('Commission must be between 0 and 100'); return; }
    if (isNaN(serviceFee) || serviceFee < 0 || serviceFee > 100) { alert('Service Fee must be between 0 and 100'); return; }
    if (isNaN(piRate) || piRate <= 0) { alert('Pi Rate must be greater than 0'); return; }
    const settings = { commissionPercent: commission, serviceFeePercent: serviceFee, piRate: piRate };
    const success = await saveAppSettings(settings);
    const msg = document.getElementById('adminSettingsMessage');
    if (success) {
        msg.textContent = t('settingsSaved');
        msg.style.color = '#10b981';
        renderEventsByCategory();
        updateProfilePage();
    } else {
        msg.textContent = t('errorSavingSettings');
        msg.style.color = '#ef4444';
    }
    setTimeout(() => { msg.textContent = ''; }, 4000);
}

// ============================================================
// ADMIN USERS – Tableau enrichi (avec toutes les colonnes)
// ============================================================
async function loadAllUsersFromSupabase() {
    try {
        const { data: users, error: usersError } = await supabaseClient.from('users').select('*').order('created_at', { ascending: false });
        if (usersError) throw usersError;
        const { data: eventsData, error: eventsError } = await supabaseClient.from('events').select('organizer_pi_uid');
        if (eventsError) throw eventsError;
        const eventCounts = {};
        eventsData.forEach(ev => {
            const uid = ev.organizer_pi_uid;
            if (uid) eventCounts[uid] = (eventCounts[uid] || 0) + 1;
        });
        return users.map(user => ({ ...user, events_created: eventCounts[user.pi_uid] || 0 }));
    } catch (error) {
        console.error('Error loading users from Supabase:', error);
        return [];
    }
}

async function renderAdminUsers() {
    const container = document.getElementById('adminUsersList');
    if (!container) return;
    const users = await loadAllUsersFromSupabase();
    allUsersCache = users;
    document.getElementById('adminUserCount').innerText = users.length;
    if (!users || users.length === 0) {
        container.innerHTML = '<p style="color: var(--gray); text-align:center; padding:20px;">' + t('noUsers') + '</p>';
        return;
    }
    let html = `
        <div style="margin-bottom: 12px; display: flex; justify-content: flex-end;">
            <button class="btn-secondary" onclick="refreshUsersList()" style="padding: 6px 16px; font-size: 0.85rem;">
                <i class="fas fa-sync"></i> Refresh
            </button>
        </div>
        <table style="width:100%; border-collapse: collapse; font-size: 0.8rem;">
            <thead>
                <tr style="background: #f3f4f6; color: #1f2937;">
                    <th style="padding: 10px 8px; text-align: left;">Name</th>
                    <th style="padding: 10px 8px; text-align: left;">Email</th>
                    <th style="padding: 10px 8px; text-align: left;">Phone</th>
                    <th style="padding: 10px 8px; text-align: left;">Address</th>
                    <th style="padding: 10px 8px; text-align: left;">Country</th>
                    <th style="padding: 10px 8px; text-align: left;">Wallet</th>
                    <th style="padding: 10px 8px; text-align: center;">Events</th>
                </tr>
            </thead>
            <tbody>
    `;
    users.forEach(user => {
        const fullName = (user.first_name ? user.first_name + ' ' : '') + (user.last_name || '') || 'User';
        const email = user.email || '—';
        const phone = user.phone_number || '—';
        const address = user.address || '—';
        const country = user.country || '—';
        const wallet = user.wallet || user.pi_uid || '—';
        const events = user.events_created || 0;

        html += `
            <tr style="border-bottom: 1px solid #e5e7eb;">
                <td style="padding: 8px 6px;">${escapeHtml(fullName)}</td>
                <td style="padding: 8px 6px;">${escapeHtml(email)}</td>
                <td style="padding: 8px 6px;">${escapeHtml(phone)}</td>
                <td style="padding: 8px 6px;">${escapeHtml(address)}</td>
                <td style="padding: 8px 6px;">${escapeHtml(country)}</td>
                <td style="padding: 8px 6px; font-family: monospace; font-size: 0.7rem;">${escapeHtml(wallet)}</td>
                <td style="padding: 8px 6px; text-align: center;">${events}</td>
            </tr>
        `;
    });
    html += `</tbody></table>`;
    container.innerHTML = html;
}

async function refreshUsersList() {
    await renderAdminUsers();
    addAdminLog('Users refreshed', 'List updated');
}

function loadAdminPage() {
    const storedPassword = localStorage.getItem('betix_admin_password');
    if (storedPassword !== adminPassword && storedPassword !== 'Betix@2026#') {
        alert(t('adminDenied'));
        showPage('home');
        return;
    }
    if (storedPassword && storedPassword !== adminPassword) adminPassword = storedPassword;
    document.getElementById('adminUserCount').innerText = allUsersCache.length || 0;
    document.getElementById('adminTicketCount').innerText = tickets.length;
    document.getElementById('adminEventCount').innerText = events.length;
    document.getElementById('adminLastLogin').textContent = localStorage.getItem('betix_admin_last_login') || 'Never';
    document.getElementById('adminLoginCount').textContent = localStorage.getItem('betix_admin_login_count') || 0;
    document.getElementById('adminCurrentPasswordDisplay').textContent = '••••••••';
    document.getElementById('adminCommission').value = appSettings.commissionPercent;
    document.getElementById('adminServiceFee').value = appSettings.serviceFeePercent;
    document.getElementById('adminPiRate').value = appSettings.piRate;
    renderAdminEvents();
    renderAdminSlides();
    renderAdminUsers();
    renderAdminLogs();
    initAdminTabs();
    if (!adminTimerInterval) startAdminSession();
    const userSearch = document.getElementById('adminUserSearch');
    if (userSearch) userSearch.addEventListener('input', function() {
        filterAdminUsers(this.value);
    });
}

function filterAdminUsers(query) {
    const container = document.getElementById('adminUsersList');
    if (!container) return;
    const rows = container.querySelectorAll('tbody tr');
    const search = query.toLowerCase().trim();
    rows.forEach(row => {
        if (search === '' || row.textContent.toLowerCase().includes(search)) {
            row.style.display = '';
        } else {
            row.style.display = 'none';
        }
    });
}

function renderAdminEvents() {
    const container = document.getElementById('adminEventsList');
    if (!container) return;
    if (events.length === 0) { container.innerHTML = '<p style="color: var(--gray); text-align:center; padding:20px;">' + t('noEventsAdmin') + '</p>'; return; }
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
        alert(t('eventDeleted'));
    }
}

function adminDeleteAllEvents() {
    if (confirm('Delete ALL events? This action is irreversible.')) {
        events = [];
        saveEvents();
        renderAdminEvents(); renderEventsByCategory();
        document.getElementById('adminEventCount').innerText = 0;
        addAdminLog('All events deleted', 'Mass deletion');
        alert(t('allEventsDeleted'));
    }
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

// ============================================================
// TRANSACTION PROCESSED ET PAST EVENT POPUPS
// ============================================================
let transactionProcessedTimer = null;
let transactionProcessedSeconds = 0;

function openTransactionProcessedPopup(seconds) {
    transactionProcessedSeconds = seconds || 5;
    document.getElementById('timerSeconds').textContent = transactionProcessedSeconds;
    document.getElementById('transactionProcessedPopup').style.display = 'flex';
    if (transactionProcessedTimer) clearInterval(transactionProcessedTimer);
    transactionProcessedTimer = setInterval(() => {
        transactionProcessedSeconds--;
        document.getElementById('timerSeconds').textContent = Math.max(0, transactionProcessedSeconds);
        if (transactionProcessedSeconds <= 0) {
            clearInterval(transactionProcessedTimer);
            transactionProcessedTimer = null;
        }
    }, 1000);
}

function closeTransactionProcessedPopup() {
    if (transactionProcessedTimer) {
        clearInterval(transactionProcessedTimer);
        transactionProcessedTimer = null;
    }
    document.getElementById('transactionProcessedPopup').style.display = 'none';
}

function openPastEventPopup() {
    const popup = document.getElementById('pastEventPopup');
    if (popup) popup.style.display = 'flex';
}

function closePastEventPopup() {
    const popup = document.getElementById('pastEventPopup');
    if (popup) popup.style.display = 'none';
}

// ============================================================
// CHAT
// ============================================================
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

function handleLogoClick() {
    logoClickCount++;
    if (logoClickCount >= 5) {
        const password = prompt('Enter administrator password:');
        if (password === adminPassword || password === 'Betix@2026#') {
            localStorage.setItem('betix_admin_password', password);
            adminPassword = password;
            const adminBtn = document.getElementById('adminMenuItem');
            if (adminBtn) { adminBtn.style.display = 'block'; adminBtn.style.background = 'linear-gradient(135deg, #1a1a2e, #0B1F5C)'; adminBtn.style.color = 'white'; }
            addAdminLog('Admin authentication', 'Login via logo');
            alert('Administrator access activated!');
            logoClickCount = 0;
        } else if (password !== null) { alert('Incorrect password'); logoClickCount = 0; } else { logoClickCount = 0; }
    }
}

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

function clearAllData() { if (confirm(t('clearDataConfirm'))) { localStorage.clear(); location.reload(); } }
function toggleDarkMode(e) { if (e.target.checked) { document.body.classList.add('dark-mode'); localStorage.setItem('darkMode', 'true'); } else { document.body.classList.remove('dark-mode'); localStorage.setItem('darkMode', 'false'); } }

// ============================================================
// INITIALISATION DE L'APPLICATION
// ============================================================
async function initApp() {
    try {
        const savedUser = localStorage.getItem('betix_user');
        if (savedUser) try { const userData = JSON.parse(savedUser); if (userData.wallet || userData.piUid) { currentUser = userData; piUser = { username: userData.wallet || userData.piUid }; } } catch(e) {}
        
        const localProfile = loadLocalProfile();
        Object.keys(localProfile).forEach(key => {
            if (localProfile[key] !== undefined) {
                currentUser[key] = localProfile[key];
            }
        });
        if (localProfile.profile_completed) currentUser.profile_completed = true;
        
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

        const backBtn = document.getElementById('backBtn');
        if (backBtn) {
            backBtn.addEventListener('click', function(e) { e.preventDefault(); e.stopPropagation(); goBack(); return false; });
            const homePage = document.getElementById('homePage');
            if (homePage && homePage.style.display !== 'none') { backBtn.classList.add('hidden'); backBtn.style.display = 'none'; } else { backBtn.classList.remove('hidden'); backBtn.style.display = 'flex'; }
        }
        document.getElementById('closeSidebarBtn') && document.getElementById('closeSidebarBtn').addEventListener('click', function(e) { e.preventDefault(); e.stopPropagation(); closeSidebar(); });
        document.getElementById('overlay') && document.getElementById('overlay').addEventListener('click', function() { closeSidebar(); });
        const eventForm = document.getElementById('eventForm');
        const searchInput = document.getElementById('searchInput');
        const clearDataBtn = document.getElementById('clearDataBtn');
        updateConnectButtons();
        document.getElementById('confirmPublishBtn') && document.getElementById('confirmPublishBtn').addEventListener('click', confirmPublishEvent);
        document.getElementById('confirmBuyBtn') && document.getElementById('confirmBuyBtn').addEventListener('click', confirmPurchaseFromPopup);
        const adminAddSlideBtn = document.getElementById('adminAddSlideBtn');
        const adminSaveSlideBtn = document.getElementById('adminSaveSlideBtn');
        const adminCancelSlideBtn = document.getElementById('adminCancelSlideBtn');
        const adminImageInput = document.getElementById('adminSlideImageInput');
        const adminUploadBox = document.getElementById('adminUploadBox');
        const adminPreview = document.getElementById('adminSlidePreview');
        if (adminAddSlideBtn) adminAddSlideBtn.addEventListener('click', function() { adminShowSlideForm(-1); });
        if (adminSaveSlideBtn) adminSaveSlideBtn.addEventListener('click', adminSaveSlide);
        if (adminCancelSlideBtn) adminCancelSlideBtn.addEventListener('click', adminCancelSlideForm);
        if (adminImageInput && adminUploadBox) {
            adminImageInput.addEventListener('change', function() {
                const file = this.files[0];
                if (file && file.type.startsWith('image/')) {
                    const reader = new FileReader();
                    reader.onload = function(e) { adminPreview.src = e.target.result; adminPreview.style.display = 'block'; adminUploadBox.classList.add('has-image'); };
                    reader.readAsDataURL(file);
                }
            });
            adminUploadBox.addEventListener('click', function(e) { if (e.target.tagName !== 'INPUT') adminImageInput.click(); });
        }
        if (eventForm) eventForm.addEventListener('submit', createEvent);
        if (searchInput) searchInput.addEventListener('input', function(e) { searchQuery = e.target.value.toLowerCase(); renderEventsByCategory(); });
        if (clearDataBtn) clearDataBtn.addEventListener('click', clearAllData);
        document.querySelectorAll('.image-input-modern').forEach(input => {
            const index = parseInt(input.dataset.index);
            input.addEventListener('change', function(e) { if (this.files && this.files[0]) handleImageUploadModern(this.files[0], index); });
            const box = document.getElementById('uploadBox' + (index + 1));
            if (box) {
                box.addEventListener('dragover', function(e) { e.preventDefault(); this.classList.add('dragover'); });
                box.addEventListener('dragleave', function(e) { e.preventDefault(); this.classList.remove('dragover'); });
                box.addEventListener('drop', function(e) {
                    e.preventDefault(); this.classList.remove('dragover');
                    const files = e.dataTransfer.files;
                    const inputFile = this.querySelector('.image-input-modern');
                    if (files && files.length > 0 && inputFile) { inputFile.files = files; inputFile.dispatchEvent(new Event('change')); }
                });
            }
        });
        document.querySelectorAll('.sidebar-item').forEach(item => item.addEventListener('click', function() { const page = this.dataset.page; if (page) showPage(page); closeSidebar(); }));
        bindActivityListeners();
        setInterval(() => { if (currentUser.wallet) { saveUser(); } }, 30000);
        setTimeout(() => syncAllToSupabase(), 2000);
        setInterval(() => { syncAllToSupabase(); retryPendingTickets(); }, 60000);
        window.addEventListener('beforeunload', () => { syncAllToSupabase(); retryPendingTickets(); });
        if (currentUser.wallet && isSessionExpired()) disconnectPi();
        document.getElementById('adminSaveSettingsBtn')?.addEventListener('click', adminSaveSettings);
        document.getElementById('confirmPurchaseFinalBtn')?.addEventListener('click', function() {
            document.getElementById('confirmPurchasePopup').style.display = 'none';
            if (confirmPurchaseResolve) {
                confirmPurchaseResolve(true);
                confirmPurchaseResolve = null;
            }
        });
        document.getElementById('transactionProcessedOkBtn')?.addEventListener('click', closeTransactionProcessedPopup);
        document.getElementById('viewUpcomingEventsBtn')?.addEventListener('click', function() {
            closePastEventPopup();
            showPage('home');
            setTimeout(() => {
                const eventsSection = document.querySelector('.events-container');
                if (eventsSection) { eventsSection.scrollIntoView({ behavior: 'smooth', block: 'start' }); }
            }, 300);
        });
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
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initApp);
} else {
    initApp();
}
