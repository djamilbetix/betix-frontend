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

console.log("Supabase initialized");

// ============================================================
// ===== COUNTRY LIST =====
// ============================================================

const countriesList = [
    'All',
    'Afghanistan', 'Algeria', 'Angola', 'Argentina', 'Australia',
    'Austria', 'Belgium', 'Benin', 'Botswana', 'Brazil',
    'Burkina Faso', 'Burundi', 'Cameroon', 'Canada', 'Cape Verde',
    'Central African Republic', 'Chad', 'China', 'Comoros',
    'Congo', 'Cote d\'Ivoire', 'Denmark', 'Djibouti', 'Egypt',
    'Equatorial Guinea', 'Eritrea', 'Eswatini', 'Ethiopia',
    'France', 'Gabon', 'Gambia', 'Germany', 'Ghana', 'Guinea',
    'Guinea-Bissau', 'India', 'Indonesia', 'Iran', 'Italy',
    'Japan', 'Kenya', 'Lesotho', 'Liberia', 'Libya',
    'Madagascar', 'Malawi', 'Mali', 'Mauritania', 'Mauritius',
    'Mexico', 'Morocco', 'Mozambique', 'Namibia', 'Niger',
    'Nigeria', 'Portugal', 'RDC', 'Russia', 'Rwanda',
    'Sao Tome', 'Senegal', 'Seychelles', 'Sierra Leone',
    'Somalia', 'South Africa', 'South Sudan', 'Spain',
    'Sudan', 'Sweden', 'Switzerland', 'Tanzania', 'Togo',
    'Tunisia', 'Turkey', 'Uganda', 'Ukraine',
    'United Kingdom', 'United States', 'Zambia', 'Zimbabwe'
];

// ============================================================
// ===== COUNTRY FLAGS =====
// ============================================================

const countryFlags = {
    'All': '',
    'Afghanistan': '🇦🇫', 'Algeria': '🇩🇿', 'Angola': '🇦🇴', 'Argentina': '🇦🇷', 'Australia': '🇦🇺',
    'Austria': '🇦🇹', 'Belgium': '🇧🇪', 'Benin': '🇧🇯', 'Botswana': '🇧🇼', 'Brazil': '🇧🇷',
    'Burkina Faso': '🇧🇫', 'Burundi': '🇧🇮', 'Cameroon': '🇨🇲', 'Canada': '🇨🇦', 'Cape Verde': '🇨🇻',
    'Central African Republic': '🇨🇫', 'Chad': '🇹🇩', 'China': '🇨🇳', 'Comoros': '🇰🇲',
    'Congo': '🇨🇬', 'Cote d\'Ivoire': '🇨🇮', 'Denmark': '🇩🇰', 'Djibouti': '🇩🇯', 'Egypt': '🇪🇬',
    'Equatorial Guinea': '🇬🇶', 'Eritrea': '🇪🇷', 'Eswatini': '🇸🇿', 'Ethiopia': '🇪🇹',
    'France': '🇫🇷', 'Gabon': '🇬🇦', 'Gambia': '🇬🇲', 'Germany': '🇩🇪', 'Ghana': '🇬🇭',
    'Guinea': '🇬🇳', 'Guinea-Bissau': '🇬🇼', 'India': '🇮🇳', 'Indonesia': '🇮🇩', 'Iran': '🇮🇷',
    'Italy': '🇮🇹', 'Japan': '🇯🇵', 'Kenya': '🇰🇪', 'Lesotho': '🇱🇸', 'Liberia': '🇱🇷',
    'Libya': '🇱🇾', 'Madagascar': '🇲🇬', 'Malawi': '🇲🇼', 'Mali': '🇲🇱', 'Mauritania': '🇲🇷',
    'Mauritius': '🇲🇺', 'Mexico': '🇲🇽', 'Morocco': '🇲🇦', 'Mozambique': '🇲🇿', 'Namibia': '🇳🇦',
    'Niger': '🇳🇪', 'Nigeria': '🇳🇬', 'Portugal': '🇵🇹', 'RDC': '🇨🇩', 'Russia': '🇷🇺',
    'Rwanda': '🇷🇼', 'Sao Tome': '🇸🇹', 'Senegal': '🇸🇳', 'Seychelles': '🇸🇨',
    'Sierra Leone': '🇸🇱', 'Somalia': '🇸🇴', 'South Africa': '🇿🇦', 'South Sudan': '🇸🇸',
    'Spain': '🇪🇸', 'Sudan': '🇸🇩', 'Sweden': '🇸🇪', 'Switzerland': '🇨🇭',
    'Tanzania': '🇹🇿', 'Togo': '🇹🇬', 'Tunisia': '🇹🇳', 'Turkey': '🇹🇷',
    'Uganda': '🇺🇬', 'Ukraine': '🇺🇦', 'United Kingdom': '🇬🇧',
    'United States': '🇺🇸', 'Zambia': '🇿🇲', 'Zimbabwe': '🇿🇼'
};

// ============================================================
// ===== PI SDK INITIALIZATION =====
// ============================================================

let piSDKReady = false;

function initPiSDK() {
    if (typeof Pi !== 'undefined') {
        try {
            Pi.init({ version: "2.0", sandbox: true });
            piSDKReady = true;
            console.log("Pi SDK initialized successfully");
            return true;
        } catch (error) {
            console.error("Pi SDK init error:", error);
            piSDKReady = false;
            return false;
        }
    }
    console.log("Pi SDK not available yet");
    return false;
}

initPiSDK();
setTimeout(function() { if (!piSDKReady) initPiSDK(); }, 500);
setTimeout(function() { if (!piSDKReady) initPiSDK(); }, 1000);
setTimeout(function() { if (!piSDKReady) initPiSDK(); }, 2000);
setTimeout(function() { if (!piSDKReady) initPiSDK(); }, 3000);
setTimeout(function() { if (!piSDKReady) initPiSDK(); }, 5000);

async function ensurePiSDKReady() {
    let attempts = 0;
    while (!piSDKReady && attempts < 15) {
        initPiSDK();
        await new Promise(resolve => setTimeout(resolve, 500));
        attempts++;
    }
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
    if (isResolving) {
        console.log("Resolution deja en cours, ignore.");
        return null;
    }

    if (resolveAttempts > 3) {
        console.log("Trop de tentatives, stop.");
        return null;
    }

    console.log("Paiement incomplet detecte:", payment);
    isResolving = true;
    resolveAttempts++;

    try {
        const response = await fetch(BACKEND_URL + '/api/pi/resolve', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ paymentId: payment.identifier })
        });
        const result = await response.json();
        console.log("Resolution:", result);

        if (result.status === 'completed' || result.status === 'cancelled') {
            setTimeout(() => window.location.reload(), 2000);
            return result;
        } else {
            console.warn("Resolution non reconnue:", result);
        }
    } catch (error) {
        console.error("Erreur lors de la resolution:", error);
    } finally {
        isResolving = false;
        setTimeout(() => { resolveAttempts = 0; }, 10000);
    }
    return null;
}

// ============================================================
// ===== TRANSLATIONS =====
// ============================================================

const translations = {
    en: {
        appName: 'Betix',
        home: 'Home',
        myEvents: 'My Events',
        profile: 'Profile',
        settings: 'Settings',
        myTickets: 'My Tickets',
        ticketHistory: 'Ticket History',
        whitepaper: 'Whitepaper',
        faq: 'FAQ',
        administration: 'Administration',
        followUs: 'Follow us',
        notifications: 'Notifications',
        noNotifications: 'No notifications',
        connectPi: 'Connect Pi',
        disconnect: 'Disconnect',
        chooseLanguage: 'Choose Language:',
        selectLanguage: 'Select language',
        guest: 'Guest',
        notConnected: 'Not connected',
        connecting: 'Connecting...',
        welcome: 'Welcome',
        memberSince: 'Member since',
        ratings: 'ratings',
        points: 'points',
        myEventsCount: 'My Events',
        myTicketsCount: 'My Tickets',
        history: 'History',
        rated: 'Rated',
        viewAll: 'View all',
        createEvent: 'Create Event',
        searchEvent: 'Search event...',
        chooseCountry: 'Choose Country:',
        upcomingEvents: 'Upcoming Events',
        joinCommunity: 'Join the community and live unique experiences',
        noEvents: 'No events found',
        buyTicket: 'Buy Ticket',
        ticketsAvailable: 'tickets available',
        back: 'Back',
        title: 'Title',
        category: 'Category',
        country: 'Country',
        dateTime: 'Date & Time',
        duration: 'Duration',
        location: 'Location',
        description: 'Description',
        conditions: 'Conditions',
        totalSeats: 'Total Seats',
        ticketTypes: 'Ticket Types',
        enableAtLeastOne: 'Enable at least one ticket type and set its price',
        standard: 'Standard',
        vip: 'VIP',
        price: 'Price',
        active: 'Active',
        inactive: 'Inactive',
        photos: 'Photos',
        imagesRequired: '2 images required',
        dropImage: 'Drop your image here',
        orClick: 'or click to browse',
        compressed: 'Compressed',
        imagesAutoCompressed: 'Images automatically compressed to WebP format for better performance',
        publishEvent: 'Publish Event',
        confirmPublication: 'Confirm Publication',
        reviewInfo: 'Please review all information before publishing your event',
        cancel: 'Cancel',
        publishing: 'Publishing...',
        eventPublished: 'Event has been successfully published!',
        editEvent: 'Edit Event',
        modifyFields: 'Modify the fields below to update your event',
        saveChanges: 'Save Changes',
        chooseQuantity: 'Choose quantity',
        maximumTickets: 'Maximum tickets available',
        total: 'Total',
        confirmPurchase: 'Confirm purchase',
        purchaseSuccessful: 'Purchase successful!',
        ticketsAdded: 'ticket(s) added successfully.',
        event: 'Event',
        type: 'Type',
        quantity: 'Quantity',
        code: 'Code',
        ok: 'OK',
        pendingPaymentFound: 'Pending Payment Found',
        pendingPaymentMessage: 'You already have a pending payment on this app. You can either cancel the pending payment and try again, or wait for it to complete.',
        ignore: 'Ignore',
        cancelAndRetry: 'Cancel & Retry',
        paymentError: 'Payment error',
        pendingPaymentError: 'A pending payment was found. Please complete or cancel the previous payment in your Pi wallet, then try again.',
        paymentCancelled: 'Payment cancelled',
        noSeatsAvailable: 'No seats available for this event',
        pleaseConnect: 'Please connect your Pi account first',
        authenticationFailed: 'Authentication failed. Please try again.',
        connectionError: 'Connection error',
        sessionExpired: 'Session expired due to inactivity. Please reconnect.',
        disconnected: 'You are disconnected',
        eventNotFound: 'Event not found',
        ticketNotFound: 'Ticket not found',
        downloadTicket: 'Download ticket',
        ticketDownloaded: 'Ticket downloaded',
        markUsed: 'Mark as used',
        markUsedConfirm: 'Mark this ticket as used? This action cannot be undone.',
        ticketMarkedUsed: 'Ticket marked as used successfully!',
        noActiveTickets: 'No active tickets',
        noTicketHistory: 'No ticket history',
        clearData: 'Clear my data',
        clearDataConfirm: 'Delete all your data?',
        darkMode: 'Dark mode',
        all: 'All',
        concert: 'Concert',
        sport: 'Sport',
        conference: 'Conference',
        training: 'Training',
        cinema: 'Cinema',
        festival: 'Festival',
        theatre: 'Theatre',
        dance: 'Dance',
        exhibition: 'Exhibition',
        gala: 'Gala',
        seminar: 'Seminar',
        fullDescription: 'Full description',
        information: 'Information',
        organizer: 'Organizer',
        createdOn: 'Created on',
        seatsLeft: 'Seats left',
        rating: 'Rating',
        notYetRated: 'Not yet rated',
        noReviews: 'No reviews yet',
        noConditions: 'No conditions specified',
        by: 'By',
        new: 'New',
        soldOut: 'Sold Out',
        ended: 'Ended',
        tickets: 'tickets',
        views: 'views',
        termsOfSale: 'Terms of sale',
        termsOfUse: 'Terms of use',
        privacyPolicy: 'Privacy policy',
        accessibilityStatement: 'Accessibility statement',
        privacyChoices: 'Privacy choices',
        fanTicketGuide: 'Fan ticket guide',
        legalNotices: 'Legal notices',
        cookiePreferences: 'Cookie preferences',
        aboutUs: 'About us',
        contactUs: 'Contact us',
        yourFeedback: 'Your feedback',
        help: 'Help',
        partners: 'Partners',
        joinCommunityFooter: 'Join the Betix community',
        piNetwork: 'Pi Network',
        secure: 'Secure',
        allRightsReserved: 'All rights reserved.',
        builtOnPi: 'Built on Pi Network | Secured by Blockchain',
        participant: 'Participant',
        ticketCode: 'Ticket Code',
        valid: 'Valid',
        pastEvent: 'Past Event',
        share: 'Share',
        eventDate: 'Event Date',
        eventTime: 'Event Time',
        locationLabel: 'Location',
        countryLabel: 'Country',
        ticketTypeLabel: 'Ticket Type',
        purchaseDate: 'Purchase Date',
        transactionId: 'Transaction ID',
        downloadTicketPDF: 'Download Ticket PDF',
        reviews: 'Reviews'
    },
    fr: {
        appName: 'Betix',
        home: 'Accueil',
        myEvents: 'Mes Événements',
        profile: 'Profil',
        settings: 'Paramètres',
        myTickets: 'Mes Tickets',
        ticketHistory: 'Historique des Tickets',
        whitepaper: 'Livre Blanc',
        faq: 'FAQ',
        administration: 'Administration',
        followUs: 'Suivez-nous',
        notifications: 'Notifications',
        noNotifications: 'Aucune notification',
        connectPi: 'Connecter Pi',
        disconnect: 'Déconnecter',
        chooseLanguage: 'Choisir la langue :',
        selectLanguage: 'Sélectionner la langue',
        guest: 'Invité',
        notConnected: 'Non connecté',
        connecting: 'Connexion...',
        welcome: 'Bienvenue',
        memberSince: 'Membre depuis',
        ratings: 'avis',
        points: 'points',
        myEventsCount: 'Mes Événements',
        myTicketsCount: 'Mes Tickets',
        history: 'Historique',
        rated: 'Évalués',
        viewAll: 'Voir tout',
        createEvent: 'Créer un Événement',
        searchEvent: 'Rechercher un événement...',
        chooseCountry: 'Choisir le pays :',
        upcomingEvents: 'Événements à Venir',
        joinCommunity: 'Rejoignez la communauté et vivez des expériences uniques',
        noEvents: 'Aucun événement trouvé',
        buyTicket: 'Acheter un Ticket',
        ticketsAvailable: 'tickets disponibles',
        back: 'Retour',
        title: 'Titre',
        category: 'Catégorie',
        country: 'Pays',
        dateTime: 'Date et Heure',
        duration: 'Durée',
        location: 'Lieu',
        description: 'Description',
        conditions: 'Conditions',
        totalSeats: 'Places Totales',
        ticketTypes: 'Types de Billets',
        enableAtLeastOne: 'Activez au moins un type de billet et définissez son prix',
        standard: 'Standard',
        vip: 'VIP',
        price: 'Prix',
        active: 'Actif',
        inactive: 'Inactif',
        photos: 'Photos',
        imagesRequired: '2 images requises',
        dropImage: 'Déposez votre image ici',
        orClick: 'ou cliquez pour parcourir',
        compressed: 'Compressée',
        imagesAutoCompressed: 'Images automatiquement compressées au format WebP pour de meilleures performances',
        publishEvent: 'Publier l\'Événement',
        confirmPublication: 'Confirmer la Publication',
        reviewInfo: 'Veuillez vérifier toutes les informations avant de publier votre événement',
        cancel: 'Annuler',
        publishing: 'Publication...',
        eventPublished: 'L\'événement a été publié avec succès !',
        editEvent: 'Modifier l\'Événement',
        modifyFields: 'Modifiez les champs ci-dessous pour mettre à jour votre événement',
        saveChanges: 'Enregistrer les Modifications',
        chooseQuantity: 'Choisir la quantité',
        maximumTickets: 'Maximum de tickets disponibles',
        total: 'Total',
        confirmPurchase: 'Confirmer l\'achat',
        purchaseSuccessful: 'Achat réussi !',
        ticketsAdded: 'ticket(s) ajouté(s) avec succès.',
        event: 'Événement',
        type: 'Type',
        quantity: 'Quantité',
        code: 'Code',
        ok: 'OK',
        pendingPaymentFound: 'Paiement en Attente Trouvé',
        pendingPaymentMessage: 'Vous avez déjà un paiement en attente sur cette application. Vous pouvez annuler le paiement en attente et réessayer, ou attendre qu\'il se termine.',
        ignore: 'Ignorer',
        cancelAndRetry: 'Annuler et Réessayer',
        paymentError: 'Erreur de paiement',
        pendingPaymentError: 'Un paiement en attente a été trouvé. Veuillez compléter ou annuler le paiement précédent dans votre portefeuille Pi, puis réessayer.',
        paymentCancelled: 'Paiement annulé',
        noSeatsAvailable: 'Aucune place disponible pour cet événement',
        pleaseConnect: 'Veuillez d\'abord connecter votre compte Pi',
        authenticationFailed: 'Échec de l\'authentification. Veuillez réessayer.',
        connectionError: 'Erreur de connexion',
        sessionExpired: 'Session expirée en raison d\'inactivité. Veuillez vous reconnecter.',
        disconnected: 'Vous êtes déconnecté',
        eventNotFound: 'Événement non trouvé',
        ticketNotFound: 'Ticket non trouvé',
        downloadTicket: 'Télécharger le ticket',
        ticketDownloaded: 'Ticket téléchargé',
        markUsed: 'Marquer comme utilisé',
        markUsedConfirm: 'Marquer ce ticket comme utilisé ? Cette action est irréversible.',
        ticketMarkedUsed: 'Ticket marqué comme utilisé avec succès !',
        noActiveTickets: 'Aucun ticket actif',
        noTicketHistory: 'Aucun historique de tickets',
        clearData: 'Effacer mes données',
        clearDataConfirm: 'Supprimer toutes vos données ?',
        darkMode: 'Mode sombre',
        all: 'Tous',
        concert: 'Concert',
        sport: 'Sport',
        conference: 'Conférence',
        training: 'Formation',
        cinema: 'Cinéma',
        festival: 'Festival',
        theatre: 'Théâtre',
        dance: 'Danse',
        exhibition: 'Exposition',
        gala: 'Gala',
        seminar: 'Séminaire',
        fullDescription: 'Description complète',
        information: 'Informations',
        organizer: 'Organisateur',
        createdOn: 'Créé le',
        seatsLeft: 'Places restantes',
        rating: 'Évaluation',
        notYetRated: 'Pas encore évalué',
        noReviews: 'Aucun avis pour le moment',
        noConditions: 'Aucune condition spécifiée',
        by: 'Par',
        new: 'Nouveau',
        soldOut: 'Complet',
        ended: 'Terminé',
        tickets: 'tickets',
        views: 'vues',
        termsOfSale: 'Conditions de vente',
        termsOfUse: 'Conditions d\'utilisation',
        privacyPolicy: 'Politique de confidentialité',
        accessibilityStatement: 'Déclaration d\'accessibilité',
        privacyChoices: 'Choix de confidentialité',
        fanTicketGuide: 'Guide du billet fan',
        legalNotices: 'Mentions légales',
        cookiePreferences: 'Préférences de cookies',
        aboutUs: 'À propos de nous',
        contactUs: 'Contactez-nous',
        yourFeedback: 'Votre avis',
        help: 'Aide',
        partners: 'Partenaires',
        joinCommunityFooter: 'Rejoignez la communauté Betix',
        piNetwork: 'Réseau Pi',
        secure: 'Sécurisé',
        allRightsReserved: 'Tous droits réservés.',
        builtOnPi: 'Construit sur Pi Network | Sécurisé par Blockchain',
        participant: 'Participant',
        ticketCode: 'Code du ticket',
        valid: 'Valide',
        pastEvent: 'Événement passé',
        share: 'Partager',
        eventDate: 'Date de l\'événement',
        eventTime: 'Heure de l\'événement',
        locationLabel: 'Lieu',
        countryLabel: 'Pays',
        ticketTypeLabel: 'Type de billet',
        purchaseDate: 'Date d\'achat',
        transactionId: 'ID de transaction',
        downloadTicketPDF: 'Télécharger le ticket PDF',
        reviews: 'Avis'
    },
    pt: {
        appName: 'Betix',
        home: 'Início',
        myEvents: 'Meus Eventos',
        profile: 'Perfil',
        settings: 'Configurações',
        myTickets: 'Meus Ingressos',
        ticketHistory: 'Histórico de Ingressos',
        whitepaper: 'Whitepaper',
        faq: 'FAQ',
        administration: 'Administração',
        followUs: 'Siga-nos',
        notifications: 'Notificações',
        noNotifications: 'Sem notificações',
        connectPi: 'Conectar Pi',
        disconnect: 'Desconectar',
        chooseLanguage: 'Escolha o idioma:',
        selectLanguage: 'Selecione o idioma',
        guest: 'Convidado',
        notConnected: 'Não conectado',
        connecting: 'Conectando...',
        welcome: 'Bem-vindo',
        memberSince: 'Membro desde',
        ratings: 'avaliações',
        points: 'pontos',
        myEventsCount: 'Meus Eventos',
        myTicketsCount: 'Meus Ingressos',
        history: 'Histórico',
        rated: 'Avaliados',
        viewAll: 'Ver tudo',
        createEvent: 'Criar Evento',
        searchEvent: 'Pesquisar evento...',
        chooseCountry: 'Escolha o país:',
        upcomingEvents: 'Próximos Eventos',
        joinCommunity: 'Junte-se à comunidade e viva experiências únicas',
        noEvents: 'Nenhum evento encontrado',
        buyTicket: 'Comprar Ingresso',
        ticketsAvailable: 'ingressos disponíveis',
        back: 'Voltar',
        title: 'Título',
        category: 'Categoria',
        country: 'País',
        dateTime: 'Data e Hora',
        duration: 'Duração',
        location: 'Local',
        description: 'Descrição',
        conditions: 'Condições',
        totalSeats: 'Total de Lugares',
        ticketTypes: 'Tipos de Ingressos',
        enableAtLeastOne: 'Ative pelo menos um tipo de ingresso e defina seu preço',
        standard: 'Padrão',
        vip: 'VIP',
        price: 'Preço',
        active: 'Ativo',
        inactive: 'Inativo',
        photos: 'Fotos',
        imagesRequired: '2 imagens obrigatórias',
        dropImage: 'Solte sua imagem aqui',
        orClick: 'ou clique para procurar',
        compressed: 'Comprimida',
        imagesAutoCompressed: 'Imagens automaticamente comprimidas para formato WebP para melhor desempenho',
        publishEvent: 'Publicar Evento',
        confirmPublication: 'Confirmar Publicação',
        reviewInfo: 'Revise todas as informações antes de publicar seu evento',
        cancel: 'Cancelar',
        publishing: 'Publicando...',
        eventPublished: 'Evento publicado com sucesso!',
        editEvent: 'Editar Evento',
        modifyFields: 'Modifique os campos abaixo para atualizar seu evento',
        saveChanges: 'Salvar Alterações',
        chooseQuantity: 'Escolha a quantidade',
        maximumTickets: 'Máximo de ingressos disponíveis',
        total: 'Total',
        confirmPurchase: 'Confirmar compra',
        purchaseSuccessful: 'Compra bem-sucedida!',
        ticketsAdded: 'ingresso(s) adicionado(s) com sucesso.',
        event: 'Evento',
        type: 'Tipo',
        quantity: 'Quantidade',
        code: 'Código',
        ok: 'OK',
        pendingPaymentFound: 'Pagamento Pendente Encontrado',
        pendingPaymentMessage: 'Você já tem um pagamento pendente neste aplicativo. Você pode cancelar o pagamento pendente e tentar novamente, ou aguardar sua conclusão.',
        ignore: 'Ignorar',
        cancelAndRetry: 'Cancelar e Tentar Novamente',
        paymentError: 'Erro de pagamento',
        pendingPaymentError: 'Foi encontrado um pagamento pendente. Por favor, complete ou cancele o pagamento anterior em sua carteira Pi e tente novamente.',
        paymentCancelled: 'Pagamento cancelado',
        noSeatsAvailable: 'Nenhum lugar disponível para este evento',
        pleaseConnect: 'Por favor, conecte sua conta Pi primeiro',
        authenticationFailed: 'Falha na autenticação. Por favor, tente novamente.',
        connectionError: 'Erro de conexão',
        sessionExpired: 'Sessão expirada devido à inatividade. Por favor, reconecte-se.',
        disconnected: 'Você está desconectado',
        eventNotFound: 'Evento não encontrado',
        ticketNotFound: 'Ingresso não encontrado',
        downloadTicket: 'Baixar ingresso',
        ticketDownloaded: 'Ingresso baixado',
        markUsed: 'Marcar como usado',
        markUsedConfirm: 'Marcar este ingresso como usado? Esta ação não pode ser desfeita.',
        ticketMarkedUsed: 'Ingresso marcado como usado com sucesso!',
        noActiveTickets: 'Nenhum ingresso ativo',
        noTicketHistory: 'Nenhum histórico de ingressos',
        clearData: 'Limpar meus dados',
        clearDataConfirm: 'Excluir todos os seus dados?',
        darkMode: 'Modo escuro',
        all: 'Todos',
        concert: 'Concerto',
        sport: 'Esporte',
        conference: 'Conferência',
        training: 'Treinamento',
        cinema: 'Cinema',
        festival: 'Festival',
        theatre: 'Teatro',
        dance: 'Dança',
        exhibition: 'Exposição',
        gala: 'Gala',
        seminar: 'Seminário',
        fullDescription: 'Descrição completa',
        information: 'Informações',
        organizer: 'Organizador',
        createdOn: 'Criado em',
        seatsLeft: 'Lugares restantes',
        rating: 'Avaliação',
        notYetRated: 'Ainda não avaliado',
        noReviews: 'Nenhuma avaliação ainda',
        noConditions: 'Nenhuma condição especificada',
        by: 'Por',
        new: 'Novo',
        soldOut: 'Esgotado',
        ended: 'Finalizado',
        tickets: 'ingressos',
        views: 'visualizações',
        termsOfSale: 'Termos de venda',
        termsOfUse: 'Termos de uso',
        privacyPolicy: 'Política de privacidade',
        accessibilityStatement: 'Declaração de acessibilidade',
        privacyChoices: 'Escolhas de privacidade',
        fanTicketGuide: 'Guia do ingresso fã',
        legalNotices: 'Avisos legais',
        cookiePreferences: 'Preferências de cookies',
        aboutUs: 'Sobre nós',
        contactUs: 'Contate-nos',
        yourFeedback: 'Seu feedback',
        help: 'Ajuda',
        partners: 'Parceiros',
        joinCommunityFooter: 'Junte-se à comunidade Betix',
        piNetwork: 'Rede Pi',
        secure: 'Seguro',
        allRightsReserved: 'Todos os direitos reservados.',
        builtOnPi: 'Construído na Pi Network | Seguro por Blockchain',
        participant: 'Participante',
        ticketCode: 'Código do ingresso',
        valid: 'Válido',
        pastEvent: 'Evento passado',
        share: 'Compartilhar',
        eventDate: 'Data do evento',
        eventTime: 'Hora do evento',
        locationLabel: 'Local',
        countryLabel: 'País',
        ticketTypeLabel: 'Tipo de ingresso',
        purchaseDate: 'Data da compra',
        transactionId: 'ID da transação',
        downloadTicketPDF: 'Baixar ingresso PDF',
        reviews: 'Avaliações'
    },
    es: {
        appName: 'Betix',
        home: 'Inicio',
        myEvents: 'Mis Eventos',
        profile: 'Perfil',
        settings: 'Configuración',
        myTickets: 'Mis Entradas',
        ticketHistory: 'Historial de Entradas',
        whitepaper: 'Libro Blanco',
        faq: 'FAQ',
        administration: 'Administración',
        followUs: 'Síguenos',
        notifications: 'Notificaciones',
        noNotifications: 'Sin notificaciones',
        connectPi: 'Conectar Pi',
        disconnect: 'Desconectar',
        chooseLanguage: 'Elige el idioma:',
        selectLanguage: 'Selecciona el idioma',
        guest: 'Invitado',
        notConnected: 'No conectado',
        connecting: 'Conectando...',
        welcome: 'Bienvenido',
        memberSince: 'Miembro desde',
        ratings: 'valoraciones',
        points: 'puntos',
        myEventsCount: 'Mis Eventos',
        myTicketsCount: 'Mis Entradas',
        history: 'Historial',
        rated: 'Valorados',
        viewAll: 'Ver todo',
        createEvent: 'Crear Evento',
        searchEvent: 'Buscar evento...',
        chooseCountry: 'Elige el país:',
        upcomingEvents: 'Próximos Eventos',
        joinCommunity: 'Únete a la comunidad y vive experiencias únicas',
        noEvents: 'No se encontraron eventos',
        buyTicket: 'Comprar Entrada',
        ticketsAvailable: 'entradas disponibles',
        back: 'Volver',
        title: 'Título',
        category: 'Categoría',
        country: 'País',
        dateTime: 'Fecha y Hora',
        duration: 'Duración',
        location: 'Ubicación',
        description: 'Descripción',
        conditions: 'Condiciones',
        totalSeats: 'Total de Asientos',
        ticketTypes: 'Tipos de Entradas',
        enableAtLeastOne: 'Habilita al menos un tipo de entrada y establece su precio',
        standard: 'Estándar',
        vip: 'VIP',
        price: 'Precio',
        active: 'Activo',
        inactive: 'Inactivo',
        photos: 'Fotos',
        imagesRequired: '2 imágenes requeridas',
        dropImage: 'Suelta tu imagen aquí',
        orClick: 'o haz clic para buscar',
        compressed: 'Comprimida',
        imagesAutoCompressed: 'Imágenes comprimidas automáticamente a formato WebP para mejor rendimiento',
        publishEvent: 'Publicar Evento',
        confirmPublication: 'Confirmar Publicación',
        reviewInfo: 'Revisa toda la información antes de publicar tu evento',
        cancel: 'Cancelar',
        publishing: 'Publicando...',
        eventPublished: '¡Evento publicado con éxito!',
        editEvent: 'Editar Evento',
        modifyFields: 'Modifica los campos a continuación para actualizar tu evento',
        saveChanges: 'Guardar Cambios',
        chooseQuantity: 'Elige la cantidad',
        maximumTickets: 'Máximo de entradas disponibles',
        total: 'Total',
        confirmPurchase: 'Confirmar compra',
        purchaseSuccessful: '¡Compra exitosa!',
        ticketsAdded: 'entrada(s) añadida(s) con éxito.',
        event: 'Evento',
        type: 'Tipo',
        quantity: 'Cantidad',
        code: 'Código',
        ok: 'OK',
        pendingPaymentFound: 'Pago Pendiente Encontrado',
        pendingPaymentMessage: 'Ya tienes un pago pendiente en esta aplicación. Puedes cancelar el pago pendiente e intentarlo de nuevo, o esperar a que se complete.',
        ignore: 'Ignorar',
        cancelAndRetry: 'Cancelar y Reintentar',
        paymentError: 'Error de pago',
        pendingPaymentError: 'Se encontró un pago pendiente. Por favor, completa o cancela el pago anterior en tu cartera Pi y vuelve a intentarlo.',
        paymentCancelled: 'Pago cancelado',
        noSeatsAvailable: 'No hay asientos disponibles para este evento',
        pleaseConnect: 'Por favor, conecta tu cuenta Pi primero',
        authenticationFailed: 'Error de autenticación. Por favor, inténtalo de nuevo.',
        connectionError: 'Error de conexión',
        sessionExpired: 'Sesión expirada por inactividad. Por favor, reconéctate.',
        disconnected: 'Estás desconectado',
        eventNotFound: 'Evento no encontrado',
        ticketNotFound: 'Entrada no encontrada',
        downloadTicket: 'Descargar entrada',
        ticketDownloaded: 'Entrada descargada',
        markUsed: 'Marcar como usado',
        markUsedConfirm: '¿Marcar esta entrada como usada? Esta acción no se puede deshacer.',
        ticketMarkedUsed: '¡Entrada marcada como usada con éxito!',
        noActiveTickets: 'No hay entradas activas',
        noTicketHistory: 'No hay historial de entradas',
        clearData: 'Borrar mis datos',
        clearDataConfirm: '¿Eliminar todos tus datos?',
        darkMode: 'Modo oscuro',
        all: 'Todos',
        concert: 'Concierto',
        sport: 'Deporte',
        conference: 'Conferencia',
        training: 'Entrenamiento',
        cinema: 'Cine',
        festival: 'Festival',
        theatre: 'Teatro',
        dance: 'Baile',
        exhibition: 'Exposición',
        gala: 'Gala',
        seminar: 'Seminario',
        fullDescription: 'Descripción completa',
        information: 'Información',
        organizer: 'Organizador',
        createdOn: 'Creado el',
        seatsLeft: 'Asientos restantes',
        rating: 'Valoración',
        notYetRated: 'Aún no valorado',
        noReviews: 'Aún no hay reseñas',
        noConditions: 'No se especificaron condiciones',
        by: 'Por',
        new: 'Nuevo',
        soldOut: 'Agotado',
        ended: 'Finalizado',
        tickets: 'entradas',
        views: 'vistas',
        termsOfSale: 'Términos de venta',
        termsOfUse: 'Términos de uso',
        privacyPolicy: 'Política de privacidad',
        accessibilityStatement: 'Declaración de accesibilidad',
        privacyChoices: 'Opciones de privacidad',
        fanTicketGuide: 'Guía del ticket fan',
        legalNotices: 'Avisos legales',
        cookiePreferences: 'Preferencias de cookies',
        aboutUs: 'Sobre nosotros',
        contactUs: 'Contáctanos',
        yourFeedback: 'Tu opinión',
        help: 'Ayuda',
        partners: 'Socios',
        joinCommunityFooter: 'Únete a la comunidad Betix',
        piNetwork: 'Red Pi',
        secure: 'Seguro',
        allRightsReserved: 'Todos los derechos reservados.',
        builtOnPi: 'Construido en Pi Network | Asegurado por Blockchain',
        participant: 'Participante',
        ticketCode: 'Código de la entrada',
        valid: 'Válido',
        pastEvent: 'Evento pasado',
        share: 'Compartir',
        eventDate: 'Fecha del evento',
        eventTime: 'Hora del evento',
        locationLabel: 'Ubicación',
        countryLabel: 'País',
        ticketTypeLabel: 'Tipo de entrada',
        purchaseDate: 'Fecha de compra',
        transactionId: 'ID de transacción',
        downloadTicketPDF: 'Descargar entrada PDF',
        reviews: 'Reseñas'
    },
    zh: {
        appName: 'Betix',
        home: '首页',
        myEvents: '我的活动',
        profile: '个人资料',
        settings: '设置',
        myTickets: '我的门票',
        ticketHistory: '门票历史',
        whitepaper: '白皮书',
        faq: '常见问题',
        administration: '管理',
        followUs: '关注我们',
        notifications: '通知',
        noNotifications: '没有通知',
        connectPi: '连接Pi',
        disconnect: '断开连接',
        chooseLanguage: '选择语言：',
        selectLanguage: '选择语言',
        guest: '访客',
        notConnected: '未连接',
        connecting: '连接中...',
        welcome: '欢迎',
        memberSince: '会员自',
        ratings: '评价',
        points: '积分',
        myEventsCount: '我的活动',
        myTicketsCount: '我的门票',
        history: '历史',
        rated: '已评价',
        viewAll: '查看全部',
        createEvent: '创建活动',
        searchEvent: '搜索活动...',
        chooseCountry: '选择国家：',
        upcomingEvents: '即将举行的活动',
        joinCommunity: '加入社区，体验独特的生活',
        noEvents: '未找到活动',
        buyTicket: '购买门票',
        ticketsAvailable: '可用门票',
        back: '返回',
        title: '标题',
        category: '类别',
        country: '国家',
        dateTime: '日期和时间',
        duration: '持续时间',
        location: '地点',
        description: '描述',
        conditions: '条件',
        totalSeats: '总座位数',
        ticketTypes: '门票类型',
        enableAtLeastOne: '至少启用一种门票类型并设置价格',
        standard: '标准',
        vip: 'VIP',
        price: '价格',
        active: '活跃',
        inactive: '非活跃',
        photos: '照片',
        imagesRequired: '需要2张图片',
        dropImage: '将图片拖放到此处',
        orClick: '或点击浏览',
        compressed: '已压缩',
        imagesAutoCompressed: '图片自动压缩为WebP格式以提高性能',
        publishEvent: '发布活动',
        confirmPublication: '确认发布',
        reviewInfo: '请发布前检查所有信息',
        cancel: '取消',
        publishing: '发布中...',
        eventPublished: '活动发布成功！',
        editEvent: '编辑活动',
        modifyFields: '修改以下字段以更新您的活动',
        saveChanges: '保存更改',
        chooseQuantity: '选择数量',
        maximumTickets: '最大可用门票数',
        total: '总计',
        confirmPurchase: '确认购买',
        purchaseSuccessful: '购买成功！',
        ticketsAdded: '门票添加成功。',
        event: '活动',
        type: '类型',
        quantity: '数量',
        code: '代码',
        ok: '确定',
        pendingPaymentFound: '发现待处理付款',
        pendingPaymentMessage: '您在此应用中已有待处理付款。您可以取消待处理付款并重试，或等待其完成。',
        ignore: '忽略',
        cancelAndRetry: '取消并重试',
        paymentError: '付款错误',
        pendingPaymentError: '发现待处理付款。请完成或取消Pi钱包中的先前付款，然后重试。',
        paymentCancelled: '付款已取消',
        noSeatsAvailable: '此活动没有可用座位',
        pleaseConnect: '请先连接您的Pi账户',
        authenticationFailed: '身份验证失败。请重试。',
        connectionError: '连接错误',
        sessionExpired: '会话因不活动而过期。请重新连接。',
        disconnected: '您已断开连接',
        eventNotFound: '未找到活动',
        ticketNotFound: '未找到门票',
        downloadTicket: '下载门票',
        ticketDownloaded: '门票已下载',
        markUsed: '标记为已使用',
        markUsedConfirm: '将此门票标记为已使用？此操作不可撤销。',
        ticketMarkedUsed: '门票已成功标记为已使用！',
        noActiveTickets: '没有有效门票',
        noTicketHistory: '没有门票历史',
        clearData: '清除我的数据',
        clearDataConfirm: '删除所有数据？',
        darkMode: '暗色模式',
        all: '全部',
        concert: '音乐会',
        sport: '体育',
        conference: '会议',
        training: '培训',
        cinema: '电影院',
        festival: '节日',
        theatre: '剧院',
        dance: '舞蹈',
        exhibition: '展览',
        gala: '晚会',
        seminar: '研讨会',
        fullDescription: '完整描述',
        information: '信息',
        organizer: '组织者',
        createdOn: '创建于',
        seatsLeft: '剩余座位',
        rating: '评分',
        notYetRated: '尚未评分',
        noReviews: '暂无评论',
        noConditions: '未指定条件',
        by: '由',
        new: '新',
        soldOut: '已售罄',
        ended: '已结束',
        tickets: '门票',
        views: '浏览',
        termsOfSale: '销售条款',
        termsOfUse: '使用条款',
        privacyPolicy: '隐私政策',
        accessibilityStatement: '无障碍声明',
        privacyChoices: '隐私选择',
        fanTicketGuide: '粉丝门票指南',
        legalNotices: '法律声明',
        cookiePreferences: 'Cookie偏好设置',
        aboutUs: '关于我们',
        contactUs: '联系我们',
        yourFeedback: '您的反馈',
        help: '帮助',
        partners: '合作伙伴',
        joinCommunityFooter: '加入Betix社区',
        piNetwork: 'Pi网络',
        secure: '安全',
        allRightsReserved: '版权所有。',
        builtOnPi: '基于Pi网络构建 | 区块链保障安全',
        participant: '参与者',
        ticketCode: '门票代码',
        valid: '有效',
        pastEvent: '过往活动',
        share: '分享',
        eventDate: '活动日期',
        eventTime: '活动时间',
        locationLabel: '地点',
        countryLabel: '国家',
        ticketTypeLabel: '门票类型',
        purchaseDate: '购买日期',
        transactionId: '交易ID',
        downloadTicketPDF: '下载门票PDF',
        reviews: '评论'
    },
    id: {
        appName: 'Betix',
        home: 'Beranda',
        myEvents: 'Acara Saya',
        profile: 'Profil',
        settings: 'Pengaturan',
        myTickets: 'Tiket Saya',
        ticketHistory: 'Riwayat Tiket',
        whitepaper: 'Whitepaper',
        faq: 'FAQ',
        administration: 'Administrasi',
        followUs: 'Ikuti kami',
        notifications: 'Notifikasi',
        noNotifications: 'Tidak ada notifikasi',
        connectPi: 'Hubungkan Pi',
        disconnect: 'Putuskan sambungan',
        chooseLanguage: 'Pilih Bahasa:',
        selectLanguage: 'Pilih bahasa',
        guest: 'Tamu',
        notConnected: 'Tidak terhubung',
        connecting: 'Menghubungkan...',
        welcome: 'Selamat datang',
        memberSince: 'Anggota sejak',
        ratings: 'peringkat',
        points: 'poin',
        myEventsCount: 'Acara Saya',
        myTicketsCount: 'Tiket Saya',
        history: 'Riwayat',
        rated: 'Dinilai',
        viewAll: 'Lihat semua',
        createEvent: 'Buat Acara',
        searchEvent: 'Cari acara...',
        chooseCountry: 'Pilih Negara:',
        upcomingEvents: 'Acara Mendatang',
        joinCommunity: 'Bergabunglah dengan komunitas dan rasakan pengalaman unik',
        noEvents: 'Tidak ada acara ditemukan',
        buyTicket: 'Beli Tiket',
        ticketsAvailable: 'tiket tersedia',
        back: 'Kembali',
        title: 'Judul',
        category: 'Kategori',
        country: 'Negara',
        dateTime: 'Tanggal & Waktu',
        duration: 'Durasi',
        location: 'Lokasi',
        description: 'Deskripsi',
        conditions: 'Syarat & Ketentuan',
        totalSeats: 'Total Kursi',
        ticketTypes: 'Jenis Tiket',
        enableAtLeastOne: 'Aktifkan setidaknya satu jenis tiket dan tetapkan harganya',
        standard: 'Standar',
        vip: 'VIP',
        price: 'Harga',
        active: 'Aktif',
        inactive: 'Tidak Aktif',
        photos: 'Foto',
        imagesRequired: '2 gambar diperlukan',
        dropImage: 'Tarik gambar Anda di sini',
        orClick: 'atau klik untuk menjelajah',
        compressed: 'Dikompres',
        imagesAutoCompressed: 'Gambar otomatis dikompres ke format WebP untuk kinerja yang lebih baik',
        publishEvent: 'Publikasikan Acara',
        confirmPublication: 'Konfirmasi Publikasi',
        reviewInfo: 'Tinjau semua informasi sebelum mempublikasikan acara Anda',
        cancel: 'Batal',
        publishing: 'Mempublikasikan...',
        eventPublished: 'Acara berhasil dipublikasikan!',
        editEvent: 'Edit Acara',
        modifyFields: 'Ubah kolom di bawah ini untuk memperbarui acara Anda',
        saveChanges: 'Simpan Perubahan',
        chooseQuantity: 'Pilih jumlah',
        maximumTickets: 'Maksimum tiket tersedia',
        total: 'Total',
        confirmPurchase: 'Konfirmasi pembelian',
        purchaseSuccessful: 'Pembelian berhasil!',
        ticketsAdded: 'tiket berhasil ditambahkan.',
        event: 'Acara',
        type: 'Tipe',
        quantity: 'Jumlah',
        code: 'Kode',
        ok: 'OK',
        pendingPaymentFound: 'Pembayaran Tertunda Ditemukan',
        pendingPaymentMessage: 'Anda sudah memiliki pembayaran tertunda di aplikasi ini. Anda dapat membatalkan pembayaran tertunda dan mencoba lagi, atau menunggu hingga selesai.',
        ignore: 'Abaikan',
        cancelAndRetry: 'Batalkan & Coba Lagi',
        paymentError: 'Kesalahan pembayaran',
        pendingPaymentError: 'Ditemukan pembayaran tertunda. Silakan selesaikan atau batalkan pembayaran sebelumnya di dompet Pi Anda, lalu coba lagi.',
        paymentCancelled: 'Pembayaran dibatalkan',
        noSeatsAvailable: 'Tidak ada kursi tersedia untuk acara ini',
        pleaseConnect: 'Silakan hubungkan akun Pi Anda terlebih dahulu',
        authenticationFailed: 'Otentikasi gagal. Silakan coba lagi.',
        connectionError: 'Kesalahan koneksi',
        sessionExpired: 'Sesi berakhir karena tidak aktif. Silakan sambungkan kembali.',
        disconnected: 'Anda terputus',
        eventNotFound: 'Acara tidak ditemukan',
        ticketNotFound: 'Tiket tidak ditemukan',
        downloadTicket: 'Unduh tiket',
        ticketDownloaded: 'Tiket diunduh',
        markUsed: 'Tandai sebagai digunakan',
        markUsedConfirm: 'Tandai tiket ini sebagai digunakan? Tindakan ini tidak dapat dibatalkan.',
        ticketMarkedUsed: 'Tiket berhasil ditandai sebagai digunakan!',
        noActiveTickets: 'Tidak ada tiket aktif',
        noTicketHistory: 'Tidak ada riwayat tiket',
        clearData: 'Hapus data saya',
        clearDataConfirm: 'Hapus semua data Anda?',
        darkMode: 'Mode gelap',
        all: 'Semua',
        concert: 'Konser',
        sport: 'Olahraga',
        conference: 'Konferensi',
        training: 'Pelatihan',
        cinema: 'Bioskop',
        festival: 'Festival',
        theatre: 'Teater',
        dance: 'Tari',
        exhibition: 'Pameran',
        gala: 'Gala',
        seminar: 'Seminar',
        fullDescription: 'Deskripsi lengkap',
        information: 'Informasi',
        organizer: 'Penyelenggara',
        createdOn: 'Dibuat pada',
        seatsLeft: 'Kursi tersisa',
        rating: 'Peringkat',
        notYetRated: 'Belum dinilai',
        noReviews: 'Belum ada ulasan',
        noConditions: 'Tidak ada syarat yang ditentukan',
        by: 'Oleh',
        new: 'Baru',
        soldOut: 'Habis',
        ended: 'Selesai',
        tickets: 'tiket',
        views: 'dilihat',
        termsOfSale: 'Syarat penjualan',
        termsOfUse: 'Syarat penggunaan',
        privacyPolicy: 'Kebijakan privasi',
        accessibilityStatement: 'Pernyataan aksesibilitas',
        privacyChoices: 'Pilihan privasi',
        fanTicketGuide: 'Panduan tiket penggemar',
        legalNotices: 'Pemberitahuan hukum',
        cookiePreferences: 'Preferensi cookie',
        aboutUs: 'Tentang kami',
        contactUs: 'Hubungi kami',
        yourFeedback: 'Masukan Anda',
        help: 'Bantuan',
        partners: 'Mitra',
        joinCommunityFooter: 'Bergabunglah dengan komunitas Betix',
        piNetwork: 'Jaringan Pi',
        secure: 'Aman',
        allRightsReserved: 'Hak cipta dilindungi.',
        builtOnPi: 'Dibangun di Pi Network | Diamankan oleh Blockchain',
        participant: 'Peserta',
        ticketCode: 'Kode tiket',
        valid: 'Berlaku',
        pastEvent: 'Acara lalu',
        share: 'Bagikan',
        eventDate: 'Tanggal acara',
        eventTime: 'Waktu acara',
        locationLabel: 'Lokasi',
        countryLabel: 'Negara',
        ticketTypeLabel: 'Jenis tiket',
        purchaseDate: 'Tanggal pembelian',
        transactionId: 'ID transaksi',
        downloadTicketPDF: 'Unduh tiket PDF',
        reviews: 'Ulasan'
    }
};

let currentLang = 'en';

function getTranslation(key) {
    var lang = currentLang || 'en';
    if (translations[lang] && translations[lang][key] !== undefined) {
        return translations[lang][key];
    }
    if (translations.en && translations.en[key] !== undefined) {
        return translations.en[key];
    }
    return key;
}

function t(key) {
    return getTranslation(key);
}

// ============================================================
// ===== GLOBAL VARIABLES =====
// ============================================================

let events = [];
let tickets = [];
let usedTickets = [];
let currentUser = { 
    name: 'Guest', 
    wallet: null, 
    piUid: null,
    memberSince: '2026', 
    loyaltyPoints: 0
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
let selectedTicketType = 'standard';
let uploadedImages = {};

let adminSessionTimer = 1800;
let adminTimerInterval = null;
let adminLogs = [];

// ============================================================
// ===== HERO SLIDES =====
// ============================================================

let heroSlides = JSON.parse(localStorage.getItem('betix_hero_slides')) || [];

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
    Seminar: 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=600&h=400&fit=crop'
};

// ============================================================
// ===== FONCTIONS UTILITAIRES =====
// ============================================================

function escapeHtml(str) { if (!str) return ''; return str.replace(/[&<>]/g, function(m) { if (m === '&') return '&amp;'; if (m === '<') return '&lt;'; if (m === '>') return '&gt;'; return m; }); }
function formatDate(dateStr) { var date = new Date(dateStr); return !isNaN(date.getTime()) ? date.toLocaleDateString('en-US') : 'Date to be defined'; }
function formatDateTime(dateStr) { var date = new Date(dateStr); return !isNaN(date.getTime()) ? date.toLocaleString('en-US') : 'Unknown date'; }

// ============================================================
// ===== SUPABASE STORAGE FUNCTIONS =====
// ============================================================

async function uploadEventImage(eventId, base64Data, index) {
    try {
        const response = await fetch(base64Data);
        const blob = await response.blob();
        
        const filePath = eventId + '/image_' + index + '_' + Date.now() + '.webp';
        
        const { data, error } = await supabaseClient.storage
            .from('events-images')
            .upload(filePath, blob, {
                contentType: blob.type,
                cacheControl: '3600',
                upsert: true
            });
        
        if (error) throw error;
        
        const { data: publicUrlData } = supabaseClient.storage
            .from('events-images')
            .getPublicUrl(filePath);
        
        return publicUrlData.publicUrl;
    } catch (error) {
        console.error('Error uploading to Supabase storage:', error);
        return null;
    }
}

// ============================================================
// ===== SUPABASE TABLE FUNCTIONS =====
// ============================================================

async function saveUserToSupabase(piUid, username, wallet, points) {
    points = points || 0;
    try {
        const now = new Date().toISOString();
        const userData = {
            pi_uid: piUid,
            username: username,
            wallet: wallet,
            points: points,
            updated_at: now,
            last_seen: now
        };
        
        const { data: existing, error: checkError } = await supabaseClient
            .from('users')
            .select('pi_uid')
            .eq('pi_uid', piUid)
            .single();
        
        if (checkError && checkError.code !== 'PGRST116') {
            throw checkError;
        }
        
        if (existing) {
            const { error } = await supabaseClient
                .from('users')
                .update(userData)
                .eq('pi_uid', piUid);
            if (error) throw error;
            console.log('User updated in Supabase:', piUid);
        } else {
            userData.created_at = now;
            const { error } = await supabaseClient
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

// ============================================================
// ===== SAVE EVENT TO SUPABASE =====
// ============================================================

async function saveEventToSupabase(eventData) {
    try {
        if (!eventData.id) {
            console.error('Event ID missing');
            return false;
        }
        
        const dbEvent = {
            id: eventData.id,
            organizer_pi_uid: eventData.organizerPiUid || eventData.organizer || currentUser.wallet || 'unknown',
            organizer_name: eventData.organizerName || eventData.organizer || currentUser.name || 'Anonymous',
            title: eventData.title || 'Untitled',
            description: eventData.description || '',
            image_url: eventData.coverImage || (eventData.images && eventData.images[0]) || '',
            location: eventData.location || '',
            pays: eventData.pays || eventData.country || 'France',
            event_date: eventData.date || new Date().toISOString(),
            category: eventData.category || '',
            ticket_price_standard: (eventData.ticketTypes && eventData.ticketTypes.standard && eventData.ticketTypes.standard.price) || eventData.price || 0,
            ticket_price_vip: (eventData.ticketTypes && eventData.ticketTypes.vip && eventData.ticketTypes.vip.price) || 0,
            ticket_standard_enabled: (eventData.ticketTypes && eventData.ticketTypes.standard && eventData.ticketTypes.standard.enabled) || false,
            ticket_vip_enabled: (eventData.ticketTypes && eventData.ticketTypes.vip && eventData.ticketTypes.vip.enabled) || false,
            max_tickets: eventData.seatsTotal || 0,
            created_at: eventData.createdAt || new Date().toISOString(),
            conditions: eventData.conditions || '',
            duration_value: eventData.durationValue || null,
            duration_unit: eventData.durationUnit || null,
            standard_seats: eventData.standardSeats || 0,
            vip_seats: eventData.vipSeats || 0,
            standard_sold: eventData.standardSold || 0,
            vip_sold: eventData.vipSold || 0
        };
        
        console.log('Saving event to Supabase:', eventData.id);
        
        const { data, error } = await supabaseClient
            .from('events')
            .upsert(dbEvent, { onConflict: 'id' });
        
        if (error) {
            console.error('Supabase error saving event:', error);
            return false;
        }
        
        console.log('Event saved to Supabase:', eventData.id);
        return true;
    } catch (error) {
        console.error('Error saving event to Supabase:', error);
        return false;
    }
}

// ============================================================
// ===== SAVE TICKET TO SUPABASE =====
// ============================================================

async function saveTicketToSupabase(ticketData) {
    try {
        console.log('saveTicketToSupabase - Ticket ID:', ticketData.id);
        
        if (!ticketData || !ticketData.id) {
            console.error('Ticket data or ID missing');
            return false;
        }
        
        var eventPays = 'France';
        var eventTitle = ticketData.eventTitle || 'Event';
        var eventLocation = ticketData.eventLocation || '';
        var eventDate = ticketData.eventDate || new Date().toISOString();
        
        if (ticketData.eventId) {
            var event = events.find(function(e) { return e.id === ticketData.eventId; });
            if (event) {
                eventPays = event.pays || event.country || 'France';
                eventTitle = event.title || eventTitle;
                eventLocation = event.location || eventLocation;
                eventDate = event.date || eventDate;
            }
        }
        
        var priceValue = parseFloat(ticketData.price) || 0;
        
        const dbTicket = {
            id: ticketData.id,
            event_id: ticketData.eventId || '',
            buyer_pi_uid: ticketData.buyerWallet || ticketData.userWallet || currentUser.wallet || 'unknown',
            buyer_name: ticketData.buyerName || ticketData.buyerWallet || currentUser.name || 'Anonymous',
            ticket_type: ticketData.ticketType || 'standard',
            price: priceValue,
            qr_code: ticketData.qrCode || 'BETIX-' + Date.now(),
            status: ticketData.status || 'Valid',
            purchase_date: ticketData.purchaseDate || new Date().toISOString(),
            expiration_date: ticketData.eventDate || new Date(Date.now() + 86400000 * 30).toISOString(),
            event_title: eventTitle,
            event_location: eventLocation,
            pays: ticketData.pays || eventPays || 'France',
            transaction_id: ticketData.transactionId || ''
        };
        
        const { data, error } = await supabaseClient
            .from('tickets')
            .upsert(dbTicket, { 
                onConflict: 'id',
                ignoreDuplicates: false 
            });
        
        if (error) {
            console.error('Supabase error:', error);
            return false;
        }
        
        console.log('Ticket saved to Supabase:', ticketData.id);
        return true;
        
    } catch (error) {
        console.error('Error saving ticket:', error);
        return false;
    }
}

// ============================================================
// ===== LOAD FUNCTIONS =====
// ============================================================

async function loadEventsFromSupabase() {
    try {
        console.log('Fetching events from Supabase...');
        
        const { data, error } = await supabaseClient
            .from('events')
            .select('*')
            .order('event_date', { ascending: true });
        
        if (error) {
            console.error('Supabase error loading events:', error);
            return [];
        }
        
        console.log('Events loaded:', data ? data.length : 0);
        return data || [];
    } catch (error) {
        console.error('Error loading events from Supabase:', error);
        return [];
    }
}

async function loadTicketsFromSupabase(piUid) {
    try {
        console.log('Fetching tickets for user:', piUid);
        
        if (!piUid) {
            console.warn('No piUid provided');
            return [];
        }
        
        const { data, error } = await supabaseClient
            .from('tickets')
            .select('*')
            .eq('buyer_pi_uid', piUid)
            .order('purchase_date', { ascending: false });
        
        if (error) {
            console.error('Supabase error loading tickets:', error);
            return [];
        }
        
        console.log('Tickets loaded:', data ? data.length : 0);
        return data || [];
    } catch (error) {
        console.error('Error loading tickets from Supabase:', error);
        return [];
    }
}

async function loadNotificationsFromSupabase(piUid) {
    try {
        const { data, error } = await supabaseClient
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

async function updateEventInSupabase(eventId, updates) {
    try {
        const { error } = await supabaseClient
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
        const { error } = await supabaseClient
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
        
        const { error } = await supabaseClient
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
        const dbNotification = {
            id: notificationData.id || Date.now().toString(),
            receiver_pi_uid: notificationData.receiverPiUid || notificationData.userWallet,
            title: notificationData.title || 'Notification',
            message: notificationData.message || '',
            is_read: notificationData.read || false,
            created_at: notificationData.date || new Date().toISOString()
        };
        
        const { error } = await supabaseClient
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

// ============================================================
// ===== FONCTIONS DE SAUVEGARDE =====
// ============================================================

function saveEvents() { 
    localStorage.setItem('betix_events', JSON.stringify(events));
    syncEventsToSupabase();
}

function saveTickets() { 
    localStorage.setItem('betix_tickets', JSON.stringify(tickets));
    saveUsedTickets();
    syncTicketsToSupabase();
}

function saveUsedTickets() { 
    localStorage.setItem('betix_used_tickets', JSON.stringify(usedTickets));
}

function loadUsedTickets() {
    var stored = localStorage.getItem('betix_used_tickets');
    if (stored) {
        try {
            usedTickets = JSON.parse(stored);
        } catch (e) {
            usedTickets = [];
        }
    } else {
        usedTickets = [];
    }
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
        currentUser.loyaltyPoints || 0
    );
}

async function syncEventsToSupabase() {
    console.log('Syncing ' + events.length + ' events to Supabase...');
    var success = 0;
    for (var i = 0; i < events.length; i++) {
        var saved = await saveEventToSupabase(events[i]);
        if (saved) success++;
    }
    console.log('Events synced:', success + '/' + events.length);
}

async function syncTicketsToSupabase() {
    console.log('Syncing ' + tickets.length + ' tickets to Supabase...');
    var success = 0;
    for (var i = 0; i < tickets.length; i++) {
        var saved = await saveTicketToSupabase(tickets[i]);
        if (saved) success++;
    }
    console.log('Tickets synced:', success + '/' + tickets.length);
}

async function syncNotificationsToSupabase() {
    for (var i = 0; i < notifications.length; i++) {
        var notif = notifications[i];
        var receiverPiUid = notif.userWallet || currentUser.wallet;
        await saveNotificationToSupabase({
            ...notif,
            receiverPiUid: receiverPiUid,
            title: notif.type === 'purchase' ? 'Ticket Purchase' : notif.type === 'event' ? 'New Event' : 'Notification'
        });
    }
}

async function syncAllToSupabase() {
    console.log('SYNC ALL TO SUPABASE');
    
    try {
        await syncUserToSupabase();
        await syncEventsToSupabase();
        await syncTicketsToSupabase();
        await syncNotificationsToSupabase();
        
        console.log('SYNC COMPLETED');
        return { events: events.length, tickets: tickets.length };
    } catch (error) {
        console.error('Error syncing all data:', error);
        return { events: 0, tickets: 0 };
    }
}

// ============================================================
// ===== LOAD ALL FROM SUPABASE =====
// ============================================================

async function loadAllFromSupabase() {
    console.log('LOAD ALL FROM SUPABASE');
    
    loadUsedTickets();
    
    try {
        console.log('Loading events...');
        var supabaseEvents = await loadEventsFromSupabase();
        if (supabaseEvents && supabaseEvents.length > 0) {
            events = supabaseEvents.map(function(e) {
                return {
                    id: e.id,
                    title: e.title,
                    category: e.category || '',
                    pays: e.pays || 'France',
                    country: e.pays || 'France',
                    date: e.event_date,
                    location: e.location || '',
                    description: e.description || '',
                    conditions: e.conditions || 'Active Pi Network wallet\nPayment in Pi (indicated amount)',
                    price: e.ticket_price_standard || 0.0003,
                    seatsTotal: e.max_tickets || 100,
                    seatsLeft: e.max_tickets || 100,
                    images: e.image_url ? [e.image_url] : [],
                    coverImage: e.image_url || '',
                    organizer: e.organizer_pi_uid || '',
                    organizerName: e.organizer_name || '',
                    organizerPiUid: e.organizer_pi_uid || '',
                    createdAt: e.created_at || new Date().toISOString(),
                    boosts: 0,
                    durationValue: e.duration_value || null,
                    durationUnit: e.duration_unit || null,
                    standardSeats: e.standard_seats || 0,
                    vipSeats: e.vip_seats || 0,
                    standardSold: e.standard_sold || 0,
                    vipSold: e.vip_sold || 0,
                    standardLeft: (e.standard_seats || 0) - (e.standard_sold || 0),
                    vipLeft: (e.vip_seats || 0) - (e.vip_sold || 0),
                    ticketTypes: {
                        standard: { enabled: e.ticket_standard_enabled || false, price: e.ticket_price_standard || 0 },
                        vip: { enabled: e.ticket_vip_enabled || false, price: e.ticket_price_vip || 0 }
                    }
                };
            });
            localStorage.setItem('betix_events', JSON.stringify(events));
            console.log('Loaded', events.length, 'events from Supabase');
        } else {
            console.log('No events in Supabase');
        }
        
        if (currentUser.piUid || currentUser.wallet) {
            var piUid = currentUser.piUid || currentUser.wallet;
            console.log('Loading tickets for user:', piUid);
            
            var supabaseTickets = await loadTicketsFromSupabase(piUid);
            
            if (supabaseTickets && supabaseTickets.length > 0) {
                tickets = supabaseTickets.map(function(t) {
                    return {
                        id: t.id,
                        eventId: t.event_id,
                        eventTitle: t.event_title || 'Event',
                        eventDate: t.expiration_date || t.event_date || new Date().toISOString(),
                        eventLocation: t.event_location || '',
                        price: parseFloat(t.price) || 0,
                        buyerWallet: t.buyer_pi_uid,
                        buyerName: t.buyer_name || t.buyer_pi_uid,
                        userWallet: t.buyer_pi_uid,
                        ticketType: t.ticket_type || 'standard',
                        pays: t.pays || 'France',
                        status: t.status || 'Valid',
                        purchaseDate: t.purchase_date || new Date().toISOString(),
                        purchaseDateTime: new Date(t.purchase_date || new Date()).toLocaleString('en-US'),
                        transactionId: t.transaction_id || '',
                        qrCode: t.qr_code || 'BETIX-' + Date.now()
                    };
                });
                
                localStorage.setItem('betix_tickets', JSON.stringify(tickets));
                console.log('Loaded', tickets.length, 'tickets from Supabase');
            } else {
                console.log('No tickets in Supabase for this user');
            }
        }
        
        if (currentUser.piUid || currentUser.wallet) {
            var piUid2 = currentUser.piUid || currentUser.wallet;
            var supabaseNotifs = await loadNotificationsFromSupabase(piUid2);
            if (supabaseNotifs && supabaseNotifs.length > 0) {
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
                console.log('Loaded', notifications.length, 'notifications from Supabase');
            }
        }
        
        renderEventsByCategory();
        renderTickets();
        renderHistory();
        updateProfilePage();
        
        setTimeout(generateAllQRCodes, 300);
        
        console.log('LOAD COMPLETED');
        
    } catch (error) {
        console.error('Error loading data from Supabase:', error);
        try {
            var localEvents = localStorage.getItem('betix_events');
            if (localEvents) events = JSON.parse(localEvents);
            var localTickets = localStorage.getItem('betix_tickets');
            if (localTickets) tickets = JSON.parse(localTickets);
            console.log('Loaded data from localStorage as fallback');
        } catch (e) {
            console.error('Fallback loading failed:', e);
        }
    }
}
// ============================================================
// ===== RENDER EVENT CARD (MODIFIÉ - PRICE BLEU + TICKETS ROUGE) =====
// ============================================================

function renderEventCard(event) {
    var avgRating = 0;
    var eventRatings = ratings.filter(function(r) { return r.eventId === event.id; });
    if (eventRatings.length > 0) { avgRating = eventRatings.reduce(function(a, r) { return a + r.rating; }, 0) / eventRatings.length; }
    
    var dateEvent = new Date(event.date);
    var dateFormatted = dateEvent.toLocaleDateString('en-US', { month: 'numeric', day: 'numeric', year: 'numeric' });
    var timeFormatted = dateEvent.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    
    var fallbackImage = eventImagesList[event.category] || eventImagesList.Concert;
    
    // ---- GESTION DES IMAGES (STYLE X/TWITTER) ----
    var images = event.images && event.images.length > 0 ? event.images : [fallbackImage];
    var imageCount = images.length;
    var posterHtml = '';
    
    if (imageCount === 1) {
        posterHtml = '<div class="poster-grid grid-1">' +
            '<div class="grid-item"><img src="' + images[0] + '" alt="' + escapeHtml(event.title) + '" onerror="this.src=\'' + fallbackImage + '\'"></div>' +
        '</div>';
    } else if (imageCount === 2) {
        posterHtml = '<div class="poster-grid grid-2">';
        for (var i = 0; i < Math.min(images.length, 2); i++) {
            posterHtml += '<div class="grid-item"><img src="' + images[i] + '" alt="Image ' + (i+1) + '" onerror="this.src=\'' + fallbackImage + '\'"></div>';
        }
        posterHtml += '</div>';
    } else if (imageCount === 3) {
        posterHtml = '<div class="poster-grid grid-3">' +
            '<div class="grid-item"><img src="' + images[0] + '" alt="Image 1" onerror="this.src=\'' + fallbackImage + '\'"></div>' +
            '<div class="grid-item"><img src="' + images[1] + '" alt="Image 2" onerror="this.src=\'' + fallbackImage + '\'"></div>' +
            '<div class="grid-item"><img src="' + images[2] + '" alt="Image 3" onerror="this.src=\'' + fallbackImage + '\'"></div>' +
        '</div>';
    } else if (imageCount >= 4) {
        posterHtml = '<div class="poster-grid grid-4">';
        for (var i = 0; i < Math.min(images.length, 4); i++) {
            posterHtml += '<div class="grid-item"><img src="' + images[i] + '" alt="Image ' + (i+1) + '" onerror="this.src=\'' + fallbackImage + '\'"></div>';
        }
        posterHtml += '</div>';
        if (imageCount > 4) {
            posterHtml += '<span class="more-badge"><i class="fas fa-plus"></i> ' + (imageCount - 4) + '</span>';
        }
    } else {
        posterHtml = '<div class="poster-grid grid-1"><div class="grid-item"><img src="' + fallbackImage + '" alt="' + escapeHtml(event.title) + '"></div></div>';
    }
    
    // ---- DRAPEAU PAYS ----
    var flagEmojis = {
        'France': '🇫🇷', 'RDC': '🇨🇩', 'Congo': '🇨🇬', 'Belgium': '🇧🇪',
        'Switzerland': '🇨🇭', 'Canada': '🇨🇦', 'Senegal': '🇸🇳', 'Cameroon': '🇨🇲',
        'Cote d\'Ivoire': '🇨🇮', 'Ivory Coast': '🇨🇮', 'Mali': '🇲🇱', 'Niger': '🇳🇪',
        'Nigeria': '🇳🇬', 'South Africa': '🇿🇦', 'Angola': '🇦🇴', 'Mozambique': '🇲🇿',
        'Kenya': '🇰🇪', 'Tanzania': '🇹🇿', 'Uganda': '🇺🇬', 'Rwanda': '🇷🇼',
        'Burundi': '🇧🇮', 'Ethiopia': '🇪🇹', 'Somalia': '🇸🇴', 'Djibouti': '🇩🇯',
        'Eritrea': '🇪🇷', 'Sudan': '🇸🇩', 'South Sudan': '🇸🇸', 'Egypt': '🇪🇬',
        'Libya': '🇱🇾', 'Tunisia': '🇹🇳', 'Algeria': '🇩🇿', 'Morocco': '🇲🇦',
        'Mauritania': '🇲🇷', 'Ghana': '🇬🇭', 'Guinea': '🇬🇳', 'Burkina Faso': '🇧🇫',
        'Benin': '🇧🇯', 'Togo': '🇹🇬', 'Liberia': '🇱🇷', 'Sierra Leone': '🇸🇱',
        'Gambia': '🇬🇲', 'Guinea-Bissau': '🇬🇼', 'Cape Verde': '🇨🇻', 'Sao Tome': '🇸🇹',
        'Gabon': '🇬🇦', 'Equatorial Guinea': '🇬🇶', 'Central African Republic': '🇨🇫',
        'Chad': '🇹🇩', 'Madagascar': '🇲🇬', 'Comoros': '🇰🇲', 'Mauritius': '🇲🇺',
        'Seychelles': '🇸🇨', 'Zambia': '🇿🇲', 'Zimbabwe': '🇿🇼', 'Botswana': '🇧🇼',
        'Namibia': '🇳🇦', 'Lesotho': '🇱🇸', 'Eswatini': '🇸🇿', 'Malawi': '🇲🇼',
        'Spain': '🇪🇸', 'Portugal': '🇵🇹', 'Germany': '🇩🇪', 'Italy': '🇮🇹',
        'United Kingdom': '🇬🇧', 'United States': '🇺🇸', 'Russia': '🇷🇺',
        'Ukraine': '🇺🇦', 'Turkey': '🇹🇷', 'Iran': '🇮🇷', 'China': '🇨🇳',
        'Japan': '🇯🇵', 'India': '🇮🇳', 'Indonesia': '🇮🇩', 'Australia': '🇦🇺',
        'Mexico': '🇲🇽', 'Argentina': '🇦🇷', 'Brazil': '🇧🇷', 'Denmark': '🇩🇰',
        'Sweden': '🇸🇪', 'Austria': '🇦🇹'
    };
    
    var countryFlag = flagEmojis[event.pays || event.country] || '';
    var countryDisplay = event.pays || event.country || 'International';
    
    var desc = event.description || '';
    if (desc.length > 100) {
        desc = desc.substring(0, 97) + '...';
    }
    
    var organizerDisplay = event.organizerName || event.organizer || 'Anonymous';
    if (organizerDisplay.length > 20) {
        organizerDisplay = organizerDisplay.substring(0, 18) + '...';
    }
    var organizerFormatted = organizerDisplay;
    if (!organizerFormatted.startsWith('@')) {
        organizerFormatted = '@' + organizerFormatted;
    }
    
    // ---- DATE DE PUBLICATION ----
    var publishDateDisplay = '';
    if (event.createdAt) {
        var pd = new Date(event.createdAt);
        var now = new Date();
        var diffMs = now - pd;
        var diffMins = Math.floor(diffMs / 60000);
        var diffHours = Math.floor(diffMs / 3600000);
        var diffDays = Math.floor(diffMs / 86400000);
        var diffWeeks = Math.floor(diffDays / 7);
        var diffMonths = Math.floor(diffDays / 30);
        var diffYears = Math.floor(diffDays / 365);
        
        if (diffMins < 1) {
            publishDateDisplay = 'Just now';
        } else if (diffMins < 60) {
            publishDateDisplay = diffMins + ' min ago';
        } else if (diffHours < 24) {
            publishDateDisplay = diffHours + ' h ago';
        } else if (diffDays < 7) {
            publishDateDisplay = diffDays + ' d ago';
        } else if (diffWeeks < 4) {
            publishDateDisplay = diffWeeks + ' w ago';
        } else if (diffMonths < 12) {
            publishDateDisplay = diffMonths + ' month ago';
        } else {
            publishDateDisplay = pd.toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' });
        }
    }
    
    // ---- BADGE PRICE - SEUL "Price" A UN FOND BLEU ----
    var hasStandard = event.ticketTypes && event.ticketTypes.standard && event.ticketTypes.standard.enabled;
    var hasVip = event.ticketTypes && event.ticketTypes.vip && event.ticketTypes.vip.enabled;
    var standardPrice = hasStandard ? event.ticketTypes.standard.price : 0;
    var vipPrice = hasVip ? event.ticketTypes.vip.price : 0;
    
    var priceBadgeClass = 'price-badge-green';
    var priceHtml = '';
    
    if (hasStandard && hasVip) {
        var minPrice = Math.min(standardPrice, vipPrice);
        var maxPrice = Math.max(standardPrice, vipPrice);
        priceHtml = '<span class="price-label">Price</span>' +
                    '<span class="price-value-range">' + minPrice.toFixed(6) + '</span>' +
                    '<span class="price-separator">–</span>' +
                    '<span class="price-value-range">' + maxPrice.toFixed(6) + '</span>' +
                    '<span class="price-currency"> Pi</span>';
        priceBadgeClass = 'price-badge-green range';
    } else if (hasStandard) {
        priceHtml = '<span class="price-label">Price</span>' +
                    '<span class="price-value">' + standardPrice.toFixed(6) + '</span>' +
                    '<span class="price-currency"> Pi</span>';
    } else if (hasVip) {
        priceHtml = '<span class="price-label">Price</span>' +
                    '<span class="price-value">' + vipPrice.toFixed(6) + '</span>' +
                    '<span class="price-currency"> Pi</span>';
    } else {
        priceHtml = '<span class="price-label">Price</span>' +
                    '<span class="price-value">' + (event.price || 0).toFixed(6) + '</span>' +
                    '<span class="price-currency"> Pi</span>';
    }
    
    // ---- RATING DISPLAY ----
    var ratingDisplay = '';
    if (eventRatings.length > 0) {
        var stars = '';
        var fullStars = Math.floor(avgRating);
        for (var i = 0; i < fullStars; i++) stars += '★';
        for (var i = fullStars; i < 5; i++) stars += '☆';
        ratingDisplay = '<span class="stars">' + stars + '</span> ' + avgRating.toFixed(1) + ' (' + eventRatings.length + ')';
    } else {
        ratingDisplay = '<span class="' + priceBadgeClass + '">' + priceHtml + '</span>';
    }
    
    // ---- TICKETS LABEL - SEUL "Tickets" A UN FOND ROUGE ----
    var ticketsLabelHtml = '';
    var stdText = '';
    var vipText = '';
    if (hasStandard) {
        var standardLeft = event.standardLeft !== undefined ? event.standardLeft : (event.standardSeats || 0);
        var standardTotal = event.standardSeats || 0;
        stdText = 'STD ' + standardLeft + '/' + standardTotal;
    }
    if (hasVip) {
        var vipLeft = event.vipLeft !== undefined ? event.vipLeft : (event.vipSeats || 0);
        var vipTotal = event.vipSeats || 0;
        vipText = 'VIP ' + vipLeft + '/' + vipTotal;
    }
    if (stdText || vipText) {
        ticketsLabelHtml = '<div class="event-tickets-label">' +
            '<span class="tickets-label-badge">Tickets</span>' +
            (stdText ? '<span class="ticket-type">' + stdText + '</span>' : '') +
            (stdText && vipText ? '<span class="ticket-sep">|</span>' : '') +
            (vipText ? '<span class="ticket-type">' + vipText + '</span>' : '') +
        '</div>';
    }
    
    // ---- DURÉE ----
    var durationText = '';
    if (event.durationValue && event.durationUnit) {
        var unitLabels = {
            'hours': 'h',
            'days': 'd',
            'weeks': 'w',
            'months': 'm',
            'years': 'y'
        };
        var unitLabel = unitLabels[event.durationUnit] || event.durationUnit;
        durationText = event.durationValue + ' ' + unitLabel;
    }
    
    // ---- PAYS + DURÉE ----
    var countryDurationHtml = '';
    if (countryFlag || durationText) {
        countryDurationHtml = '<div class="event-country-duration">';
        if (countryFlag) {
            countryDurationHtml += '<span class="country-flag">' + countryFlag + ' ' + escapeHtml(countryDisplay) + '</span>';
        }
        if (durationText) {
            if (countryFlag) countryDurationHtml += ' • ';
            countryDurationHtml += '<span class="duration-text"><i class="fas fa-hourglass-half"></i> ' + durationText + '</span>';
        }
        countryDurationHtml += '</div>';
    }
    
    return '<div class="event-card-classic" onclick="openEventDetails(\'' + event.id + '\')">' +
        '<div class="poster-wrapper-classic">' +
            '<span class="category-badge-classic">' + escapeHtml(event.category) + '</span>' +
            posterHtml +
        '</div>' +
        '<div class="card-content-classic">' +
            '<div class="event-title-classic">' + escapeHtml(event.title) + '</div>' +
            (desc ? '<div class="event-desc-classic">' + escapeHtml(desc) + '</div>' : '') +
            countryDurationHtml +
            '<div class="info-grid-classic">' +
                '<div class="info-item-classic"><i class="fas fa-calendar-day"></i> ' + dateFormatted + '</div>' +
                '<div class="info-item-classic"><i class="fas fa-map-marker-alt"></i> ' + escapeHtml(event.location || 'Online') + '</div>' +
                '<div class="info-item-classic"><i class="fas fa-clock"></i> ' + timeFormatted + '</div>' +
                '<div class="info-item-classic"><i class="fas fa-ticket-alt"></i> ' + event.seatsLeft + '/' + event.seatsTotal + '</div>' +
            '</div>' +
            '<div class="card-footer-classic">' +
                '<span class="event-rating-classic">' + ratingDisplay + '</span>' +
                ticketsLabelHtml +
            '</div>' +
            '<button class="buy-btn-classic" onclick="event.stopPropagation(); openQuantityPopup(\'' + event.id + '\')">Buy Ticket</button>' +
            '<div class="event-organizer-classic">' +
                '<span class="org-icon"><i class="fas fa-user"></i></span> By ' + escapeHtml(organizerFormatted) +
            '</div>' +
            (publishDateDisplay ? '<div class="event-publish-date"><i class="far fa-clock"></i> ' + publishDateDisplay + '</div>' : '') +
        '</div>' +
    '</div>';
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
    currentLang = lang;
    localStorage.setItem('betix_language', lang);
    
    var nativeSelect = document.getElementById('nativeLangSelect');
    if (nativeSelect) {
        nativeSelect.value = lang;
    }
    
    updateUITranslations();
    
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
}

function updateUITranslations() {
    var sidebarItems = document.querySelectorAll('.sidebar-item[data-page]');
    var pageMap = {
        'home': 'home',
        'myevents': 'myEvents',
        'profile': 'profile',
        'settings': 'settings',
        'tickets': 'myTickets',
        'history': 'ticketHistory',
        'whitepaper': 'whitepaper',
        'faq': 'faq',
        'admin': 'administration'
    };
    
    sidebarItems.forEach(function(item) {
        var page = item.dataset.page;
        if (pageMap[page]) {
            item.textContent = t(pageMap[page]);
        }
    });
    
    var sidebarName = document.getElementById('sidebarName');
    if (sidebarName) {
        sidebarName.textContent = currentUser.name || t('guest');
    }
    
    var sidebarWallet = document.getElementById('sidebarWallet');
    if (sidebarWallet) {
        sidebarWallet.textContent = currentUser.wallet ? t('notConnected') : t('notConnected');
    }
    
    var walletBtn = document.getElementById('sidebarWalletBtn');
    if (walletBtn) {
        walletBtn.textContent = currentUser.wallet ? t('disconnect') : t('connectPi');
    }
    
    var langLabel = document.querySelector('.sidebar-language-selector label');
    if (langLabel) {
        langLabel.textContent = t('chooseLanguage');
    }
    
    var socialTitle = document.querySelector('.sidebar-social-title');
    if (socialTitle) {
        socialTitle.textContent = t('followUs');
    }
    
    var heroTitle = document.querySelector('.hero-text h1');
    if (heroTitle) {
        heroTitle.textContent = "The first ticketing platform powered by Pi Network";
    }
    
    var heroDesc = document.querySelector('.hero-text p');
    if (heroDesc) {
        heroDesc.textContent = "Discover and book unique experiences. Pay with your Pi crypto.";
    }
    
    var searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.placeholder = t('searchEvent');
    }
    
    var countryLabel = document.querySelector('.filter-country-select label');
    if (countryLabel) {
        countryLabel.innerHTML = '<i class="fas fa-globe-africa"></i> ' + t('chooseCountry');
    }
    
    var eventsTitle = document.querySelector('.events-title');
    if (eventsTitle) {
        eventsTitle.textContent = t('upcomingEvents');
    }
    
    var eventsSub = document.querySelector('.events-sub');
    if (eventsSub) {
        eventsSub.textContent = t('joinCommunity');
    }
    
    var notifIcon = document.querySelector('.sidebar-notif-icon-top');
    if (notifIcon) {
        notifIcon.title = t('notifications');
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
    currentLang = savedLang;
    
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
    
    setTimeout(function() {
        updateUITranslations();
    }, 500);
    
    return savedLang;
}

// ============================================================
// ===== NOTIFICATIONS =====
// ============================================================

function renderNotificationsPage() {
    var container = document.getElementById('notificationsList');
    if (!container) return;
    if (!notifications || notifications.length === 0) {
        container.innerHTML = '<div class="notification-empty"><i class="fas fa-bell-slash"></i>' + t('noNotifications') + '</div>';
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
function isSessionExpired() { var last = parseInt(localStorage.getItem('betix_last_activity') || 0); var now = Date.now(); return (now - last) > 2592000000; }

function disconnectPi() {
    if (confirm(t('disconnect') + '?')) {
        currentUser = { name: 'Guest', wallet: null, piUid: null, memberSince: '2026', loyaltyPoints: 0 };
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
}

function logout() { disconnectPi(); }

function startSessionMonitor() { 
    setInterval(function() { 
        if (currentUser.wallet && isSessionExpired()) { 
            disconnectPi(); 
            alert(t('sessionExpired')); 
        } 
    }, 300000);
}

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

// ============================================================
// ===== SIDEBAR =====
// ============================================================

function closeSidebar() {
    var s = document.getElementById('sidebar');
    var o = document.getElementById('overlay');
    if (s) {
        s.classList.remove('open');
        document.body.style.overflow = '';
    }
    if (o) {
        o.classList.remove('active');
    }
}

function openSidebar() {
    var s = document.getElementById('sidebar');
    var o = document.getElementById('overlay');
    if (s) {
        s.classList.add('open');
        document.body.style.overflow = 'hidden';
    }
    if (o) {
        o.classList.add('active');
    }
}

// ============================================================
// ===== UPDATE CONNECT BUTTONS =====
// ============================================================

function updateConnectButtons() {
    var sidebarBtn = document.getElementById('sidebarWalletBtn');
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
    var profilePageBtn = document.getElementById('profileConnectBtnPage');
    if (profilePageBtn) {
        if (currentUser.wallet) {
            profilePageBtn.textContent = t('disconnect');
            profilePageBtn.onclick = function() { disconnectPi(); };
        } else {
            profilePageBtn.textContent = t('connectPi');
            profilePageBtn.onclick = function() { connectToPi(); };
        }
    }
}

// ============================================================
// ===== CONNEXION PI =====
// ============================================================

async function connectToPi() {
    showConnectSpinner();
    
    try {
        if (!piSDKReady) {
            var ready = await ensurePiSDKReady();
            if (!ready) {
                hideConnectSpinner();
                alert("Pi Network SDK is not available. Please make sure you are using the Pi Browser.");
                return;
            }
        }
        
        if (typeof Pi === 'undefined') {
            hideConnectSpinner();
            if (confirm("Pi Browser not detected. Use demo mode?")) {
                currentUser.wallet = 'demo_user';
                currentUser.piUid = 'demo_user';
                currentUser.name = 'Demo User';
                currentUser.memberSince = '2026';
                currentUser.loyaltyPoints = 0;
                saveUser();
                syncUserToSupabase();
                updateActivity();
                updateUserInfo();
                updateProfilePage();
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
        
        console.log("Pi SDK is ready, attempting authentication...");
        
        var scopes = ['username', 'payments'];
        var auth = await Pi.authenticate(scopes, onIncompletePaymentFound);
        
        if (auth && auth.user) {
            piUser = auth.user;
            currentUser.wallet = piUser.username;
            currentUser.piUid = piUser.username;
            currentUser.name = piUser.username;
            if (!currentUser.loyaltyPoints) currentUser.loyaltyPoints = 0;
            
            saveUser();
            await syncUserToSupabase();
            
            updateActivity();
            updateUserInfo();
            updateProfilePage();
            trackUserConnection();
            renderEventsByCategory();
            updateConnectButtons();
            
            await loadAllFromSupabase();
            
            alert('Pi account connected! Welcome ' + piUser.username);
            closeSidebar();
        } else {
            hideConnectSpinner();
            alert(t('authenticationFailed'));
        }
    } catch (error) { 
        console.error("Pi connection error:", error); 
        hideConnectSpinner();
        alert(t('connectionError') + ": " + (error.message || "Please try again")); 
    } finally {
        hideConnectSpinner();
    }
}

function showConnectSpinner() {
    var btn = document.getElementById('sidebarWalletBtn');
    if (btn) {
        btn.textContent = t('connecting');
        btn.disabled = true;
        btn.classList.add('loading');
    }
}

function hideConnectSpinner() {
    var btn = document.getElementById('sidebarWalletBtn');
    if (btn) {
        btn.disabled = false;
        btn.classList.remove('loading');
        updateConnectButtons();
    }
}

// ============================================================
// ===== TICKET TYPES UI =====
// ============================================================

function setupTicketTypesUI() {
    var standardCheckbox = document.getElementById('ticketStandardEnabled');
    var vipCheckbox = document.getElementById('ticketVipEnabled');
    var standardPriceGroup = document.getElementById('standardPriceGroup');
    var vipPriceGroup = document.getElementById('vipPriceGroup');
    var standardStatusBadge = document.getElementById('standardStatusBadge');
    var vipStatusBadge = document.getElementById('vipStatusBadge');
    
    function updateStatusBadge(checkbox, badge, activeText, inactiveText) {
        activeText = activeText || t('active');
        inactiveText = inactiveText || t('inactive');
        if (!checkbox || !badge) return;
        if (checkbox.checked) {
            badge.textContent = activeText;
            badge.className = 'type-status-badge active';
        } else {
            badge.textContent = inactiveText;
            badge.className = 'type-status-badge inactive';
        }
    }
    
    if (standardCheckbox && standardPriceGroup) {
        standardCheckbox.addEventListener('change', function() {
            if (this.checked) {
                standardPriceGroup.classList.remove('hidden');
                standardPriceGroup.style.display = 'flex';
                document.getElementById('ticketStandardPrice').required = true;
            } else {
                standardPriceGroup.classList.add('hidden');
                standardPriceGroup.style.display = 'none';
                document.getElementById('ticketStandardPrice').required = false;
                document.getElementById('ticketStandardPrice').value = '';
            }
            updateStatusBadge(standardCheckbox, standardStatusBadge);
        });
        if (standardCheckbox.checked) {
            standardPriceGroup.classList.remove('hidden');
            standardPriceGroup.style.display = 'flex';
            document.getElementById('ticketStandardPrice').required = true;
        } else {
            standardPriceGroup.classList.add('hidden');
            standardPriceGroup.style.display = 'none';
            document.getElementById('ticketStandardPrice').required = false;
        }
        updateStatusBadge(standardCheckbox, standardStatusBadge);
    }
    
    if (vipCheckbox && vipPriceGroup) {
        vipCheckbox.addEventListener('change', function() {
            if (this.checked) {
                vipPriceGroup.classList.remove('hidden');
                vipPriceGroup.style.display = 'flex';
                document.getElementById('ticketVipPrice').required = true;
            } else {
                vipPriceGroup.classList.add('hidden');
                vipPriceGroup.style.display = 'none';
                document.getElementById('ticketVipPrice').required = false;
                document.getElementById('ticketVipPrice').value = '';
            }
            updateStatusBadge(vipCheckbox, vipStatusBadge);
        });
        if (vipCheckbox.checked) {
            vipPriceGroup.classList.remove('hidden');
            vipPriceGroup.style.display = 'flex';
            document.getElementById('ticketVipPrice').required = true;
        } else {
            vipPriceGroup.classList.add('hidden');
            vipPriceGroup.style.display = 'none';
            document.getElementById('ticketVipPrice').required = false;
        }
        updateStatusBadge(vipCheckbox, vipStatusBadge);
    }
}

// ============================================================
// ===== INIT COUNTRY SELECTORS =====
// ============================================================

function initCountrySelectors() {
    var filterSelect = document.getElementById('countrySelect');
    if (filterSelect) {
        filterSelect.innerHTML = '';
        for (var i = 0; i < countriesList.length; i++) {
            var country = countriesList[i];
            var flag = countryFlags[country] || '';
            var option = document.createElement('option');
            option.value = country;
            option.textContent = flag + ' ' + country;
            if (country === currentCountryFilter) {
                option.selected = true;
            }
            filterSelect.appendChild(option);
        }
    }
    
    var eventSelect = document.getElementById('eventCountry');
    if (eventSelect) {
        eventSelect.innerHTML = '';
        for (var i = 0; i < countriesList.length; i++) {
            var country = countriesList[i];
            if (country === 'All') continue;
            var flag = countryFlags[country] || '';
            var option = document.createElement('option');
            option.value = country;
            option.textContent = flag + ' ' + country;
            if (country === 'France') {
                option.selected = true;
            }
            eventSelect.appendChild(option);
        }
    }
}

// ============================================================
// ===== QUANTITY POPUP =====
// ============================================================

function openQuantityPopup(eventId) {
    var event = events.find(function(e) { return e.id === eventId; });
    if (!event) { alert(t('eventNotFound')); return; }
    if (!piUser && !currentUser.wallet) {
        alert(t('pleaseConnect'));
        connectToPi();
        return;
    }
    
    var hasStandard = event.ticketTypes && event.ticketTypes.standard && event.ticketTypes.standard.enabled;
    var hasVip = event.ticketTypes && event.ticketTypes.vip && event.ticketTypes.vip.enabled;
    var standardLeft = event.standardLeft !== undefined ? event.standardLeft : (event.standardSeats || 0);
    var vipLeft = event.vipLeft !== undefined ? event.vipLeft : (event.vipSeats || 0);
    
    if (!hasStandard && !hasVip) {
        alert('Aucun type de billet disponible');
        return;
    }
    if (hasStandard && standardLeft <= 0 && hasVip && vipLeft <= 0) {
        alert('Tous les billets sont épuisés pour cet événement');
        return;
    }
    
    selectedEventForPurchase = event;
    
    var popup = document.getElementById('quantityPopup');
    var titleEl = document.getElementById('quantityEventTitle');
    var infoEl = document.getElementById('quantityEventInfo');
    var maxInfo = document.getElementById('maxQuantityInfo');
    var quantityInput = document.getElementById('ticketQuantity');
    var totalDisplay = document.getElementById('totalPriceDisplay');
    var ticketTypeSelect = document.getElementById('ticketTypeSelect');
    
    if (titleEl) titleEl.textContent = event.title;
    if (infoEl) {
        var dateEvent = new Date(event.date);
        infoEl.textContent = dateEvent.toLocaleDateString('en-US') + ' at ' + dateEvent.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }) + ' | ' + event.location;
    }
    
    if (ticketTypeSelect) {
        ticketTypeSelect.innerHTML = '';
        var options = [];
        if (hasStandard && standardLeft > 0) {
            options.push({ value: 'standard', label: t('standard') + ' - ' + event.ticketTypes.standard.price.toFixed(6) + ' Pi (dispo: ' + standardLeft + ')' });
        }
        if (hasVip && vipLeft > 0) {
            options.push({ value: 'vip', label: t('vip') + ' - ' + event.ticketTypes.vip.price.toFixed(6) + ' Pi (dispo: ' + vipLeft + ')' });
        }
        if (options.length === 0) {
            alert('Aucun billet disponible');
            closeQuantityPopup();
            return;
        }
        for (var i = 0; i < options.length; i++) {
            var opt = document.createElement('option');
            opt.value = options[i].value;
            opt.textContent = options[i].label;
            ticketTypeSelect.appendChild(opt);
        }
        selectedTicketType = options[0].value;
    }
    
    if (quantityInput) {
        quantityInput.value = 1;
        quantityInput.min = 1;
        updateMaxQuantity();
    }
    
    if (maxInfo) {
        maxInfo.textContent = 'Sélectionnez un type de billet ci-dessus';
    }
    
    updateTicketTotal();
    popup.classList.add('show');
}

function updateMaxQuantity() {
    var ticketTypeSelect = document.getElementById('ticketTypeSelect');
    var quantityInput = document.getElementById('ticketQuantity');
    var maxInfo = document.getElementById('maxQuantityInfo');
    
    if (!ticketTypeSelect || !quantityInput || !selectedEventForPurchase) return;
    
    var type = ticketTypeSelect.value;
    var maxSeats = 0;
    if (type === 'standard') {
        maxSeats = selectedEventForPurchase.standardLeft !== undefined ? selectedEventForPurchase.standardLeft : (selectedEventForPurchase.standardSeats || 0);
    } else if (type === 'vip') {
        maxSeats = selectedEventForPurchase.vipLeft !== undefined ? selectedEventForPurchase.vipLeft : (selectedEventForPurchase.vipSeats || 0);
    }
    
    var maxAllowed = Math.min(maxSeats, 10);
    quantityInput.max = maxAllowed;
    if (parseInt(quantityInput.value) > maxAllowed) {
        quantityInput.value = maxAllowed;
    }
    if (maxInfo) {
        maxInfo.textContent = 'Maximum: ' + maxAllowed + ' ticket(s) disponible(s)';
    }
    updateTicketTotal();
}

function updateTicketTotal() {
    var input = document.getElementById('ticketQuantity');
    var totalDisplay = document.getElementById('totalPriceDisplay');
    var ticketTypeSelect = document.getElementById('ticketTypeSelect');
    if (!input || !totalDisplay || !selectedEventForPurchase) return;
    
    var qty = parseInt(input.value) || 1;
    var type = ticketTypeSelect ? ticketTypeSelect.value : 'standard';
    var price = (selectedEventForPurchase.ticketTypes && selectedEventForPurchase.ticketTypes[type] && selectedEventForPurchase.ticketTypes[type].price) || selectedEventForPurchase.price || 0;
    var total = qty * price;
    totalDisplay.textContent = total.toFixed(6) + ' Pi';
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
    updateTicketTotal();
}

// ============================================================
// ===== CONFIRM PURCHASE =====
// ============================================================

async function confirmPurchaseFromPopup() {
    if (!selectedEventForPurchase) {
        alert('No event selected');
        return;
    }
    
    var quantityInput = document.getElementById('ticketQuantity');
    var quantity = parseInt(quantityInput.value) || 1;
    var ticketTypeSelect = document.getElementById('ticketTypeSelect');
    var ticketType = ticketTypeSelect ? ticketTypeSelect.value : 'standard';
    
    if (quantity < 1) {
        alert('Please select at least 1 ticket');
        return;
    }
    
    var availableSeats = 0;
    if (ticketType === 'standard') {
        availableSeats = selectedEventForPurchase.standardLeft !== undefined ? selectedEventForPurchase.standardLeft : (selectedEventForPurchase.standardSeats || 0);
    } else if (ticketType === 'vip') {
        availableSeats = selectedEventForPurchase.vipLeft !== undefined ? selectedEventForPurchase.vipLeft : (selectedEventForPurchase.vipSeats || 0);
    }
    
    if (quantity > availableSeats) {
        var msg = 'Plus de places disponibles pour ce type de billet.\n';
        if (selectedEventForPurchase.ticketTypes && selectedEventForPurchase.ticketTypes.standard && selectedEventForPurchase.ticketTypes.standard.enabled) {
            msg += 'STD: ' + (selectedEventForPurchase.standardLeft || 0) + ' restants\n';
        }
        if (selectedEventForPurchase.ticketTypes && selectedEventForPurchase.ticketTypes.vip && selectedEventForPurchase.ticketTypes.vip.enabled) {
            msg += 'VIP: ' + (selectedEventForPurchase.vipLeft || 0) + ' restants';
        }
        alert(msg);
        return;
    }
    
    if (quantity > 10) {
        alert('Maximum 10 tickets per purchase');
        return;
    }
    
    await confirmPurchase(selectedEventForPurchase.id, quantity, ticketType);
}

async function confirmPurchase(eventId, quantity, ticketType) {
    var event = events.find(function(e) { return e.id === eventId; });
    if (!event) { 
        alert(t('eventNotFound')); 
        return; 
    }
    
    var price = (event.ticketTypes && event.ticketTypes[ticketType] && event.ticketTypes[ticketType].price) || event.price || 0;
    
    var availableSeats = 0;
    if (ticketType === 'standard') {
        availableSeats = event.standardLeft !== undefined ? event.standardLeft : (event.standardSeats || 0);
    } else if (ticketType === 'vip') {
        availableSeats = event.vipLeft !== undefined ? event.vipLeft : (event.vipSeats || 0);
    }
    
    if (quantity > availableSeats) { 
        var msg = 'Plus de places disponibles pour ce type de billet.\n';
        if (event.ticketTypes && event.ticketTypes.standard && event.ticketTypes.standard.enabled) {
            msg += 'STD: ' + (event.standardLeft || 0) + ' restants\n';
        }
        if (event.ticketTypes && event.ticketTypes.vip && event.ticketTypes.vip.enabled) {
            msg += 'VIP: ' + (event.vipLeft || 0) + ' restants';
        }
        alert(msg);
        return; 
    }
    
    var totalPrice = quantity * price;
    var typeLabel = ticketType === 'vip' ? 'VIP' : 'Standard';
    
    if (!confirm(t('confirmPurchase') + ' ' + quantity + ' ' + typeLabel + ' ticket(s) for "' + event.title + '" (' + t('total') + ': ' + totalPrice.toFixed(6) + ' Pi) ?')) { 
        return; 
    }
    
    closeQuantityPopup();
    
    var confirmBtn = document.getElementById('confirmBuyBtn');
    if (confirmBtn) {
        confirmBtn.textContent = t('connecting');
        confirmBtn.disabled = true;
    }
    
    try {
        if (typeof Pi === 'undefined') {
            alert('Pi SDK not available. Please use Pi Browser.');
            if (confirmBtn) {
                confirmBtn.textContent = t('confirmPurchase');
                confirmBtn.disabled = false;
            }
            return;
        }
        
        var payment = await Pi.createPayment({
            amount: Number(totalPrice),
            memo: quantity + ' ' + typeLabel + ' ticket(s): ' + event.title,
            metadata: { 
                eventId: event.id, 
                eventTitle: event.title, 
                quantity: quantity, 
                ticketType: ticketType 
            }
        }, {
            onReadyForServerApproval: function(paymentId) {
                console.log('Payment ready for server approval, paymentId:', paymentId);
                fetch(BACKEND_URL + '/api/pi/approve', { 
                    method: 'POST', 
                    headers: { 'Content-Type': 'application/json' }, 
                    body: JSON.stringify({ paymentId: paymentId }) 
                }).catch(function(e) {
                    console.error('Error approving payment:', e);
                });
            },
            onReadyForServerCompletion: async function(paymentId, txid) {
                console.log('Payment completed! txid:', txid);
                
                try {
                    var ticketsAdded = [];
                    var purchaseDate = new Date().toISOString();
                    var purchaseDateTime = new Date().toLocaleString('en-US');
                    
                    if (ticketType === 'standard') {
                        event.standardSold = (event.standardSold || 0) + quantity;
                        event.standardLeft = (event.standardSeats || 0) - event.standardSold;
                    } else if (ticketType === 'vip') {
                        event.vipSold = (event.vipSold || 0) + quantity;
                        event.vipLeft = (event.vipSeats || 0) - event.vipSold;
                    }
                    event.seatsLeft -= quantity;
                    event.boosts = (event.boosts || 0) + quantity;
                    
                    for (var i = 0; i < quantity; i++) {
                        var ticketId = Date.now().toString() + '-' + i + '-' + Math.random().toString(36).substring(2, 6);
                        var ticket = {
                            id: ticketId,
                            eventId: event.id,
                            eventTitle: event.title,
                            eventDate: event.date,
                            eventLocation: event.location,
                            category: event.category || '',
                            price: price,
                            ticketType: ticketType,
                            pays: event.pays || event.country || 'France',
                            buyerWallet: piUser ? piUser.username : currentUser.wallet,
                            buyerName: piUser ? piUser.username : currentUser.name,
                            userWallet: currentUser.wallet,
                            status: 'Valid',
                            purchaseDate: purchaseDate,
                            purchaseDateTime: purchaseDateTime,
                            transactionId: txid || 'tx-' + Date.now(),
                            qrCode: 'BETIX-' + Date.now() + '-' + (txid ? txid.substring(0, 8) : 'xxxx') + '-' + i
                        };
                        tickets.push(ticket);
                        ticketsAdded.push(ticket);
                    }
                    
                    saveEvents();
                    saveTickets();
                    console.log('Local save completed -', ticketsAdded.length, 'tickets');
                    
                    console.log('Saving ' + ticketsAdded.length + ' tickets to Supabase...');
                    
                    var allSaved = true;
                    for (var j = 0; j < ticketsAdded.length; j++) {
                        var saved = await saveTicketToSupabase(ticketsAdded[j]);
                        if (!saved) {
                            allSaved = false;
                            console.error('Failed to save ticket:', ticketsAdded[j].id);
                        } else {
                            console.log('Ticket saved:', ticketsAdded[j].id);
                        }
                        await new Promise(resolve => setTimeout(resolve, 200));
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
                    
                    var organizerMessage = '🎫 Nouvelle vente ! ' + quantity + ' ' + typeLabel + ' ticket(s) acheté(s) pour "' + event.title + '"';
                    addNotification(organizerMessage, 'purchase');
                    
                    var buyerMessage = '✅ Achat réussi ! ' + quantity + ' ' + typeLabel + ' ticket(s) pour "' + event.title + '"';
                    addNotification(buyerMessage, 'purchase');
                    
                    renderEventsByCategory();
                    renderTickets();
                    renderHistory();
                    updateProfilePage();
                    
                    setTimeout(generateAllQRCodes, 300);
                    
                    await syncUserToSupabase();
                    
                    showSuccessPopup(event, ticketsAdded, quantity, ticketType);
                    
                    if (allSaved) {
                        console.log('All ' + ticketsAdded.length + ' tickets saved to Supabase!');
                    } else {
                        console.warn('Some tickets may not have been saved to Supabase');
                    }
                    
                } catch (error) {
                    console.error('Error in payment completion:', error);
                    alert('Payment completed but there was an error saving your tickets.');
                } finally {
                    if (confirmBtn) {
                        confirmBtn.textContent = t('confirmPurchase');
                        confirmBtn.disabled = false;
                    }
                }
            },
            onCancel: function() { 
                console.log('Payment cancelled by user');
                alert(t('paymentCancelled'));
                if (confirmBtn) {
                    confirmBtn.textContent = t('confirmPurchase');
                    confirmBtn.disabled = false;
                }
            },
            onError: function(error) { 
                console.error('Payment error:', error);
                alert(t('paymentError') + ': ' + (error.message || 'Unknown error'));
                if (confirmBtn) {
                    confirmBtn.textContent = t('confirmPurchase');
                    confirmBtn.disabled = false;
                }
            },
            onIncompletePaymentFound: onIncompletePaymentFound
        });
        
    } catch (error) { 
        console.error('Purchase error:', error);
        alert(t('paymentError') + ': ' + (error.message || 'Unknown error'));
        if (confirmBtn) {
            confirmBtn.textContent = t('confirmPurchase');
            confirmBtn.disabled = false;
        }
    }
}

// ============================================================
// ===== SHOW SUCCESS POPUP =====
// ============================================================

function showSuccessPopup(event, ticketsList, quantity, ticketType) {
    var popup = document.getElementById('successPopup');
    var title = document.getElementById('successTitle');
    var message = document.getElementById('successMessage');
    var info = document.getElementById('successTicketInfo');
    var viewBtn = document.getElementById('viewTicketBtn');
    var eventNameEl = document.getElementById('successEventName');
    var closeBtn = document.getElementById('closeSuccessBtn');
    
    if (!popup) return;
    
    if (popup.classList.contains('show')) {
        console.log('Popup already shown, ignoring duplicate call');
        return;
    }
    
    var qty = quantity || ticketsList.length;
    var ticket = ticketsList[0] || {};
    var typeLabel = ticketType === 'vip' ? 'VIP' : 'Standard';
    var price = (event.ticketTypes && event.ticketTypes[ticketType] && event.ticketTypes[ticketType].price) || event.price || 0;
    var totalPrice = qty * price;
    
    if (title) title.textContent = 'Achat réussi !';
    if (eventNameEl) eventNameEl.textContent = event.title || 'Blockchain Africa';
    if (message) {
        message.innerHTML = 'Merci d\'avoir acheté votre ticket pour <strong>' + escapeHtml(event.title || 'Blockchain Africa') + '</strong>';
    }
    
    var dateEvent = new Date(event.date);
    var dateFormatted = dateEvent.toLocaleDateString('fr-FR');
    var timeFormatted = dateEvent.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
    var codeDisplay = ticket.qrCode || ticket.id || 'N/A';
    
    var paysDisplay = event.pays || event.country || 'France';
    var flagEmojis = {
        'France': '🇫🇷', 'RDC': '🇨🇩', 'Congo': '🇨🇬', 'Belgium': '🇧🇪',
        'Switzerland': '🇨🇭', 'Canada': '🇨🇦', 'Senegal': '🇸🇳', 'Cameroon': '🇨🇲',
        'Cote d\'Ivoire': '🇨🇮', 'Mali': '🇲🇱', 'Niger': '🇳🇪', 'Nigeria': '🇳🇬',
        'South Africa': '🇿🇦', 'Angola': '🇦🇴', 'Mozambique': '🇲🇿',
        'Kenya': '🇰🇪', 'Tanzania': '🇹🇿', 'Uganda': '🇺🇬', 'Rwanda': '🇷🇼',
        'Ethiopia': '🇪🇹', 'Egypt': '🇪🇬', 'Morocco': '🇲🇦', 'Algeria': '🇩🇿',
        'Tunisia': '🇹🇳', 'Ghana': '🇬🇭', 'Guinea': '🇬🇳', 'Burkina Faso': '🇧🇫',
        'Benin': '🇧🇯', 'Togo': '🇹🇬', 'Liberia': '🇱🇷', 'Sierra Leone': '🇸🇱',
        'Gabon': '🇬🇦', 'Madagascar': '🇲🇬', 'Mauritius': '🇲🇺', 'Seychelles': '🇸🇨',
        'Zambia': '🇿🇲', 'Zimbabwe': '🇿🇼', 'Botswana': '🇧🇼', 'Namibia': '🇳🇦',
        'Spain': '🇪🇸', 'Portugal': '🇵🇹', 'Germany': '🇩🇪', 'Italy': '🇮🇹',
        'United Kingdom': '🇬🇧', 'United States': '🇺🇸', 'Russia': '🇷🇺',
        'Ukraine': '🇺🇦', 'Turkey': '🇹🇷', 'China': '🇨🇳', 'Japan': '🇯🇵',
        'India': '🇮🇳', 'Indonesia': '🇮🇩', 'Australia': '🇦🇺', 'Mexico': '🇲🇽',
        'Argentina': '🇦🇷', 'Brazil': '🇧🇷', 'Denmark': '🇩🇰', 'Sweden': '🇸🇪'
    };
    var countryFlag = flagEmojis[paysDisplay] || '';
    var countryDisplay = countryFlag + ' ' + paysDisplay;
    
    if (info) {
        info.innerHTML = 
            '<div class="ticket-line"><span class="ticket-label">Événement</span><span class="ticket-value">' + escapeHtml(event.title) + '</span></div>' +
            '<div class="ticket-line"><span class="ticket-label">Type</span><span class="ticket-value">' + typeLabel + '</span></div>' +
            '<div class="ticket-line"><span class="ticket-label">Date</span><span class="ticket-value">' + dateFormatted + ' à ' + timeFormatted + '</span></div>' +
            '<div class="ticket-line"><span class="ticket-label">Lieu</span><span class="ticket-value">' + escapeHtml(event.location || 'En ligne') + '</span></div>' +
            '<div class="ticket-line"><span class="ticket-label">Pays</span><span class="ticket-value">' + countryDisplay + '</span></div>' +
            '<div class="ticket-line"><span class="ticket-label">Quantité</span><span class="ticket-value">' + qty + '</span></div>' +
            '<div class="ticket-line"><span class="ticket-label">Total</span><span class="ticket-value">' + totalPrice.toFixed(6) + ' Pi</span></div>' +
            '<div class="ticket-line"><span class="ticket-label">Code</span><span class="ticket-value" style="font-size:0.7rem;font-family:monospace;">' + escapeHtml(codeDisplay) + '</span></div>';
    }
    
    if (viewBtn) {
        viewBtn.onclick = function(e) {
            e.preventDefault();
            closeSuccessPopup();
            showPage('tickets');
        };
        viewBtn.style.display = 'inline-block';
    }
    
    if (closeBtn) {
        closeBtn.onclick = function(e) {
            e.preventDefault();
            closeSuccessPopup();
        };
    }
    
    popup.style.display = 'flex';
    popup.classList.add('show');
}

function closeSuccessPopup() {
    var popup = document.getElementById('successPopup');
    if (popup) {
        popup.classList.remove('show');
        popup.style.display = 'none';
    }
    
    var info = document.getElementById('successTicketInfo');
    if (info) {
        info.innerHTML = '';
    }
    
    localStorage.removeItem('betix_success_popup_shown');
    
    console.log('Success popup closed and cleaned');
}

// ============================================================
// ===== CREATE EVENT =====
// ============================================================

async function createEvent(e) {
    e.preventDefault();
    
    var publishBtn = document.getElementById('publishEventBtn');
    
    if (publishBtn.classList.contains('loading')) {
        return;
    }
    
    if (!currentUser.wallet) { 
        alert(t('pleaseConnect')); 
        return; 
    }
    
    var title = document.getElementById('eventTitle').value.trim();
    var category = document.getElementById('eventCategory').value;
    var pays = document.getElementById('eventCountry').value;
    var date = document.getElementById('eventDate').value;
    var location = document.getElementById('eventLocation').value.trim();
    var description = document.getElementById('eventDescription').value.trim();
    var conditions = document.getElementById('eventConditions').value.trim();
    
    var standardSeats = parseInt(document.getElementById('eventStandardSeats').value) || 0;
    var vipSeats = parseInt(document.getElementById('eventVipSeats').value) || 0;
    var seatsTotal = standardSeats + vipSeats;
    
    var durationValue = document.getElementById('eventDurationValue').value;
    var durationUnit = document.getElementById('eventDurationUnit').value;
    var durationValueNum = durationValue ? parseInt(durationValue) : null;
    
    if (!title) { alert(t('title') + ' required'); return; }
    if (!date) { alert(t('dateTime') + ' required'); return; }
    if (!location) { alert(t('locationLabel') + ' required'); return; }
    if (seatsTotal < 1) { alert('Au moins un billet (Standard ou VIP) doit être disponible'); return; }
    if (!conditions) { alert(t('conditions') + ' required'); return; }
    
    var standardEnabled = document.getElementById('ticketStandardEnabled').checked;
    var vipEnabled = document.getElementById('ticketVipEnabled').checked;
    var standardPrice = parseFloat(document.getElementById('ticketStandardPrice').value);
    var vipPrice = parseFloat(document.getElementById('ticketVipPrice').value);
    
    if (standardEnabled && standardSeats <= 0) {
        alert('Le type Standard est activé mais n\'a pas de places disponibles');
        return;
    }
    if (vipEnabled && vipSeats <= 0) {
        alert('Le type VIP est activé mais n\'a pas de places disponibles');
        return;
    }
    if (!standardEnabled && !vipEnabled) {
        alert(t('enableAtLeastOne'));
        return;
    }
    
    if (standardEnabled && (!standardPrice || standardPrice <= 0)) {
        alert(t('standard') + ' ' + t('price') + ' must be greater than 0');
        return;
    }
    if (vipEnabled && (!vipPrice || vipPrice <= 0)) {
        alert(t('vip') + ' ' + t('price') + ' must be greater than 0');
        return;
    }
    
    var images = getUploadedImages();
    if (images.length < 2) { 
        alert(t('imagesRequired')); 
        return; 
    }
    
    publishBtn.classList.add('loading');
    publishBtn.disabled = true;
    
    try {
        var newEvent = {
            id: Date.now().toString(),
            title: title,
            category: category,
            pays: pays,
            country: pays,
            date: date,
            location: location,
            description: description || '',
            conditions: conditions,
            price: standardEnabled ? standardPrice : (vipEnabled ? vipPrice : 0.0003),
            seatsTotal: seatsTotal,
            seatsLeft: seatsTotal,
            standardSeats: standardSeats,
            vipSeats: vipSeats,
            standardSold: 0,
            vipSold: 0,
            standardLeft: standardSeats,
            vipLeft: vipSeats,
            images: images,
            coverImage: images[0],
            organizer: currentUser.wallet,
            organizerPiUid: currentUser.piUid || currentUser.wallet,
            organizerName: currentUser.name,
            createdAt: new Date().toISOString(),
            boosts: 0,
            durationValue: durationValueNum,
            durationUnit: durationUnit,
            ticketTypes: {
                standard: { enabled: standardEnabled, price: standardPrice || 0 },
                vip: { enabled: vipEnabled, price: vipPrice || 0 }
            }
        };
        
        openPublishConfirm(newEvent);
        
    } catch (error) {
        console.error('Error creating event:', error);
        alert(t('paymentError') + ': ' + error.message);
        publishBtn.classList.remove('loading');
        publishBtn.disabled = false;
    }
}

// ============================================================
// ===== PUBLISH CONFIRMATION =====
// ============================================================

function openPublishConfirm(eventData) {
    pendingEventData = eventData;
    
    var confirmTitle = document.getElementById('confirmTitle');
    var confirmCategory = document.getElementById('confirmCategory');
    var confirmCountry = document.getElementById('confirmCountry');
    var confirmDate = document.getElementById('confirmDate');
    var confirmLocation = document.getElementById('confirmLocation');
    var confirmPrice = document.getElementById('confirmPrice');
    var confirmSeats = document.getElementById('confirmSeats');
    var confirmOrganizer = document.getElementById('confirmOrganizer');
    var confirmDescription = document.getElementById('confirmDescription');
    var confirmConditions = document.getElementById('confirmConditions');
    var confirmTicketTypes = document.getElementById('confirmTicketTypes');
    var confirmDuration = document.getElementById('confirmDuration');
    var confirmImages = document.getElementById('confirmImages');
    
    if (!confirmTitle || !confirmCategory || !confirmCountry || !confirmDate || 
        !confirmLocation || !confirmPrice || !confirmSeats || !confirmOrganizer || 
        !confirmDescription || !confirmConditions || !confirmImages) {
        console.error('Some confirmation elements are missing from the DOM');
        alert(t('paymentError'));
        var publishBtn = document.getElementById('publishEventBtn');
        if (publishBtn) {
            publishBtn.classList.remove('loading');
            publishBtn.disabled = false;
        }
        return;
    }
    
    confirmTitle.textContent = eventData.title || 'Untitled';
    confirmCategory.textContent = eventData.category || 'Uncategorized';
    confirmCountry.textContent = eventData.pays || eventData.country || 'Not specified';
    confirmDate.textContent = new Date(eventData.date).toLocaleDateString('en-US') + ' at ' + new Date(eventData.date).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    confirmLocation.textContent = eventData.location || 'Online';
    confirmPrice.textContent = eventData.price + ' Pi';
    confirmSeats.textContent = eventData.seatsTotal || 0;
    confirmOrganizer.textContent = currentUser.name || currentUser.wallet || 'Unknown';
    confirmDescription.textContent = eventData.description || 'No description';
    confirmConditions.textContent = eventData.conditions || 'No conditions specified';
    
    if (confirmTicketTypes) {
        var types = [];
        if (eventData.ticketTypes && eventData.ticketTypes.standard && eventData.ticketTypes.standard.enabled) {
            types.push(t('standard') + ': ' + eventData.ticketTypes.standard.price.toFixed(6) + ' Pi');
        }
        if (eventData.ticketTypes && eventData.ticketTypes.vip && eventData.ticketTypes.vip.enabled) {
            types.push(t('vip') + ': ' + eventData.ticketTypes.vip.price.toFixed(6) + ' Pi');
        }
        confirmTicketTypes.textContent = types.join(' | ') || 'Not specified';
    }
    
    if (confirmDuration) {
        if (eventData.durationValue && eventData.durationUnit) {
            confirmDuration.textContent = eventData.durationValue + ' ' + eventData.durationUnit;
            confirmDuration.style.display = 'block';
        } else {
            confirmDuration.style.display = 'none';
        }
    }
    
    confirmImages.innerHTML = '';
    if (eventData.images && eventData.images.length > 0) {
        for (var i = 0; i < eventData.images.length; i++) {
            var img = document.createElement('img');
            img.src = eventData.images[i];
            img.alt = 'Event image ' + (i + 1);
            confirmImages.appendChild(img);
        }
    }
    
    document.getElementById('publishConfirmPopup').classList.add('show');
}

function closePublishConfirmPopup() {
    document.getElementById('publishConfirmPopup').classList.remove('show');
    var publishBtn = document.getElementById('publishEventBtn');
    if (publishBtn) {
        publishBtn.classList.remove('loading');
        publishBtn.disabled = false;
    }
    pendingEventData = null;
}

async function confirmPublishEvent() {
    if (!pendingEventData) {
        alert(t('eventNotFound'));
        return;
    }
    
    var publishBtn = document.getElementById('publishEventBtn');
    var confirmBtn = document.getElementById('confirmPublishBtn');
    
    if (confirmBtn) {
        confirmBtn.classList.add('loading');
        confirmBtn.disabled = true;
        confirmBtn.textContent = t('publishing');
    }
    
    try {
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
        newEvent.organizerName = currentUser.name;
        
        events.push(newEvent);
        saveEvents();
        await saveEventToSupabase(newEvent);
        await syncUserToSupabase();
        
        var form = document.getElementById('eventForm');
        if (form) form.reset();
        
        for (var i = 0; i < 2; i++) {
            removeImageModern(i);
        }
        uploadedImages = {};
        
        var standardCheckbox = document.getElementById('ticketStandardEnabled');
        var vipCheckbox = document.getElementById('ticketVipEnabled');
        if (standardCheckbox) standardCheckbox.checked = true;
        if (vipCheckbox) vipCheckbox.checked = false;
        setupTicketTypesUI();
        
        addNotification(
            t('eventPublished') + ' "' + newEvent.title + '"',
            'event'
        );
        
        closePublishConfirmPopup();
        document.getElementById('publishConfirmPopup').classList.remove('show');
        
        renderEventsByCategory();
        updateProfilePage();
        
        if (publishBtn) {
            publishBtn.classList.remove('loading');
            publishBtn.disabled = false;
        }
        if (confirmBtn) {
            confirmBtn.classList.remove('loading');
            confirmBtn.disabled = false;
            confirmBtn.textContent = t('publishEvent');
        }
        
        console.log('Event saved to Supabase:', newEvent.id);
        alert(t('eventPublished'));
        showPage('home');
        
    } catch (error) {
        console.error('Error publishing event:', error);
        alert(t('paymentError') + ': ' + error.message);
        
        if (confirmBtn) {
            confirmBtn.classList.remove('loading');
            confirmBtn.disabled = false;
            confirmBtn.textContent = t('publishEvent');
        }
        if (publishBtn) {
            publishBtn.classList.remove('loading');
            publishBtn.disabled = false;
        }
    }
}

// ============================================================
// ===== IMAGE UPLOAD =====
// ============================================================

function compressImage(file) {
    return new Promise(function(resolve, reject) {
        if (!file || !file.type.startsWith('image/')) {
            reject(new Error('Not an image'));
            return;
        }
        
        var reader = new FileReader();
        reader.onload = function(event) {
            var img = new Image();
            img.onload = function() {
                var width = img.width;
                var height = img.height;
                var maxWidth = 800;
                var maxHeight = 800;
                
                if (width > maxWidth || height > maxHeight) {
                    var ratio = Math.min(maxWidth / width, maxHeight / height);
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
                
                var format = 'image/webp';
                var testCanvas = document.createElement('canvas');
                testCanvas.width = 1;
                testCanvas.height = 1;
                var testData = testCanvas.toDataURL('image/webp');
                if (!testData || testData.indexOf('image/webp') === -1) {
                    format = 'image/jpeg';
                }
                
                var compressedDataUrl = canvas.toDataURL(format, 0.7);
                resolve(compressedDataUrl);
            };
            img.onerror = function() { reject(new Error('Failed to load image')); };
            img.src = event.target.result;
        };
        reader.onerror = function() { reject(new Error('Failed to read file')); };
        reader.readAsDataURL(file);
    });
}

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
        
        var compressedData = await compressImage(file);
        
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
// ===== MODIFIER UN EVENEMENT =====
// ============================================================

function openEditEventModal(eventId) {
    var event = events.find(function(e) { return e.id === eventId; });
    if (!event) {
        alert(t('eventNotFound'));
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
    document.getElementById('editEventDurationValue').value = event.durationValue || '';
    document.getElementById('editEventDurationUnit').value = event.durationUnit || 'hours';
    
    document.getElementById('editEventStandardSeats').value = event.standardSeats || 0;
    document.getElementById('editEventVipSeats').value = event.vipSeats || 0;
    
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
        alert(t('eventNotFound'));
        return;
    }
    
    var description = document.getElementById('editEventDescription').value.trim();
    var location = document.getElementById('editEventLocation').value.trim();
    var conditions = document.getElementById('editEventConditions').value.trim();
    var durationValue = document.getElementById('editEventDurationValue').value;
    var durationUnit = document.getElementById('editEventDurationUnit').value;
    
    var standardSeats = parseInt(document.getElementById('editEventStandardSeats').value) || 0;
    var vipSeats = parseInt(document.getElementById('editEventVipSeats').value) || 0;
    var seatsTotal = standardSeats + vipSeats;
    
    if (seatsTotal < 1) {
        alert('Au moins un billet (Standard ou VIP) doit être disponible');
        return;
    }
    
    var ticketsSoldStandard = tickets.filter(function(t) { return t.eventId === editingEventId && t.ticketType === 'standard'; }).length;
    var ticketsSoldVip = tickets.filter(function(t) { return t.eventId === editingEventId && t.ticketType === 'vip'; }).length;
    
    if (standardSeats < ticketsSoldStandard) {
        alert('Vous ne pouvez pas réduire le nombre de places Standard en dessous des ' + ticketsSoldStandard + ' déjà vendues');
        return;
    }
    if (vipSeats < ticketsSoldVip) {
        alert('Vous ne pouvez pas réduire le nombre de places VIP en dessous des ' + ticketsSoldVip + ' déjà vendues');
        return;
    }
    
    var updates = {
        description: description,
        location: location,
        conditions: conditions,
        seatsTotal: seatsTotal,
        seatsLeft: seatsTotal - (ticketsSoldStandard + ticketsSoldVip),
        durationValue: durationValue ? parseInt(durationValue) : null,
        durationUnit: durationUnit || null,
        standardSeats: standardSeats,
        vipSeats: vipSeats,
        standardLeft: standardSeats - ticketsSoldStandard,
        vipLeft: vipSeats - ticketsSoldVip,
        standardSold: ticketsSoldStandard,
        vipSold: ticketsSoldVip
    };
    
    event.description = updates.description;
    event.location = updates.location;
    event.conditions = updates.conditions;
    event.seatsTotal = updates.seatsTotal;
    event.seatsLeft = updates.seatsLeft;
    event.durationValue = updates.durationValue;
    event.durationUnit = updates.durationUnit;
    event.standardSeats = updates.standardSeats;
    event.vipSeats = updates.vipSeats;
    event.standardLeft = updates.standardLeft;
    event.vipLeft = updates.vipLeft;
    event.standardSold = updates.standardSold;
    event.vipSold = updates.vipSold;
    
    saveEvents();
    
    await updateEventInSupabase(editingEventId, {
        description: updates.description,
        location: updates.location,
        conditions: updates.conditions,
        max_tickets: updates.seatsTotal,
        duration_value: updates.durationValue,
        duration_unit: updates.durationUnit,
        standard_seats: updates.standardSeats,
        vip_seats: updates.vipSeats,
        standard_sold: updates.standardSold,
        vip_sold: updates.vipSold
    });
    
    addNotification(
        t('editEvent') + ' "' + event.title + '"',
        'event'
    );
    
    closeEditEventModal();
    renderEventsByCategory();
    renderMyEvents();
    alert(t('eventPublished'));
}

// ============================================================
// ===== TICKETS AND HISTORY =====
// ============================================================

function generateAllQRCodes() {
    console.log('Generating QR codes...');
    const containers = document.querySelectorAll('.qr-code-container');
    console.log('Found', containers.length, 'QR containers');
    
    containers.forEach(container => {
        const ticketId = container.dataset.ticketId || container.id.replace('qr-', '');
        const ticket = tickets.find(t => t.id === ticketId);
        
        if (!ticket) {
            container.innerHTML = '<p style="color:gray;font-size:10px;">Ticket introuvable</p>';
            return;
        }

        const isUsed = usedTickets.indexOf(ticket.id) !== -1;
        const isExpired = new Date(ticket.eventDate) <= new Date();
        if (isUsed || isExpired || ticket.status === 'Used') {
            container.innerHTML = '<div style="color:gray;font-size:11px;text-align:center;"><i class="fas fa-check-circle" style="color:#10b981;"></i> Utilisé</div>';
            return;
        }

        container.innerHTML = '';
        try {
            new QRCode(container, {
                text: ticket.id,
                width: 100,
                height: 100,
                colorDark: "#1a73e8",
                colorLight: "#ffffff",
                correctLevel: QRCode.CorrectLevel.H
            });
        } catch (e) {
            console.warn('Erreur génération QR pour', ticket.id, e);
            container.innerHTML = '<span style="color:red;">Erreur</span>';
        }
    });
}

function renderTicketCard(ticket, status) {
    var dateEvent = new Date(ticket.eventDate);
    var dateFormatted = dateEvent.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    var timeFormatted = dateEvent.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    
    var isVip = ticket.ticketType === 'vip';
    var statusClass = status === 'valid' ? 'valid' : 'past';
    var statusText = status === 'valid' ? t('valid') : t('pastEvent');
    var typeLabel = isVip ? t('vip') : t('standard');
    
    var vipClass = isVip ? 'ticket-vip' : '';
    var vipBadgeStyle = isVip ? 'vip-badge' : '';
    var vipHeaderStyle = isVip ? 'vip-header' : '';
    
    var qrCode = ticket.qrCode || 'BETIX-' + ticket.id.substring(0, 8);
    
    var participantName = ticket.buyerName || ticket.buyerWallet || 'Anonymous';
    if (participantName.length > 20) {
        participantName = participantName.substring(0, 18) + '...';
    }
    
    var categoryDisplay = ticket.category || 'Event';
    var paysDisplay = ticket.pays || 'France';
    
    var purchaseDateDisplay = 'Non disponible';
    if (ticket.purchaseDate) {
        var pd = new Date(ticket.purchaseDate);
        purchaseDateDisplay = pd.toLocaleDateString('fr-FR') + ' ' + pd.toLocaleTimeString('fr-FR', {hour:'2-digit', minute:'2-digit'});
    }
    
    var qrContainerId = 'qr-' + ticket.id;
    
    var downloadButton = '';
    if (status === 'valid') {
        downloadButton = '<button class="btn-download-ticket" onclick="downloadTicket(\'' + ticket.id + '\')">' +
            '<i class="fas fa-download"></i> ' + t('downloadTicket') +
        '</button>';
    }
    
    return '<div class="ticket-card-professional ' + vipClass + '">' +
        '<div class="ticket-watermark">Betix</div>' +
        '<div class="ticket-header ' + vipHeaderStyle + '">' +
            '<span class="ticket-status ' + statusClass + ' ' + vipBadgeStyle + '">' + statusText + ' - ' + typeLabel + '</span>' +
            '<span class="ticket-number">#' + ticket.id.substring(0, 8).toUpperCase() + '</span>' +
        '</div>' +
        '<div class="ticket-body">' +
            '<div class="ticket-event-title">' + escapeHtml(ticket.eventTitle) + '</div>' +
            '<div class="ticket-category ' + (isVip ? 'vip-category' : '') + '">' + escapeHtml(categoryDisplay) + '  |  ' + typeLabel + '  |  ' + escapeHtml(paysDisplay) + '</div>' +
            '<div class="ticket-grid">' +
                '<div class="ticket-col-left">' +
                    '<div class="ticket-info-row"><span class="ticket-label">' + t('eventDate') + '</span><span class="ticket-value">' + dateFormatted + '</span></div>' +
                    '<div class="ticket-info-row"><span class="ticket-label">' + t('eventTime') + '</span><span class="ticket-value">' + timeFormatted + '</span></div>' +
                    '<div class="ticket-info-row"><span class="ticket-label">' + t('locationLabel') + '</span><span class="ticket-value">' + escapeHtml(ticket.eventLocation || 'Online') + '</span></div>' +
                    '<div class="ticket-info-row"><span class="ticket-label">' + t('price') + '</span><span class="ticket-value">' + (ticket.price || 0).toFixed(6) + ' Pi</span></div>' +
                    '<div class="ticket-info-row"><span class="ticket-label">' + t('ticketTypeLabel') + '</span><span class="ticket-value">' + typeLabel + '</span></div>' +
                    '<div class="ticket-info-row"><span class="ticket-label">' + t('countryLabel') + '</span><span class="ticket-value">' + escapeHtml(paysDisplay) + '</span></div>' +
                '</div>' +
                '<div class="ticket-col-right">' +
                    '<div class="ticket-qr-box">' +
                        '<div class="ticket-qr-code">' +
                            '<div id="' + qrContainerId + '" class="qr-code-container" data-ticket-id="' + ticket.id + '"></div>' +
                        '</div>' +
                        '<div class="ticket-code">' + qrCode + '</div>' +
                    '</div>' +
                    '<div class="ticket-participant-box">' +
                        '<span class="ticket-participant-label">' + t('participant') + '</span>' +
                        '<span class="ticket-participant-name">' + escapeHtml(participantName) + '</span>' +
                    '</div>' +
                '</div>' +
            '</div>' +
            '<div class="ticket-purchase-date">' +
                '<span class="purchase-label">' + t('purchaseDate') + ' :</span> ' +
                '<span class="purchase-value">' + purchaseDateDisplay + '</span>' +
            '</div>' +
            downloadButton +
        '</div>' +
    '</div>';
}

function renderTickets() {
    var container = document.getElementById('ticketsList');
    if (!container) return;
    
    var active = tickets.filter(function(t) {
        var isUsed = usedTickets.indexOf(t.id) !== -1;
        var isExpired = new Date(t.eventDate) <= new Date();
        return !isUsed && !isExpired && t.status !== 'Used';
    });
    
    active.sort(function(a, b) { return new Date(b.purchaseDate) - new Date(a.purchaseDate); });
    
    if (!active.length) { 
        container.innerHTML = '<p style="text-align:center;padding:2rem;color:var(--gray);">' + t('noActiveTickets') + '</p>'; 
        return; 
    }
    container.innerHTML = active.map(function(t) { return renderTicketCard(t, 'valid'); }).join('');
    
    setTimeout(generateAllQRCodes, 200);
}

function renderHistory() {
    var container = document.getElementById('historyList');
    if (!container) return;
    
    var history = tickets.filter(function(t) {
        var isUsed = usedTickets.indexOf(t.id) !== -1;
        var isExpired = new Date(t.eventDate) <= new Date();
        return isUsed || isExpired || t.status === 'Used';
    });
    
    history.sort(function(a, b) { return new Date(b.purchaseDate) - new Date(a.purchaseDate); });
    
    if (!history.length) { 
        container.innerHTML = '<p style="text-align:center;padding:2rem;color:var(--gray);">' + t('noTicketHistory') + '</p>'; 
        return; 
    }
    container.innerHTML = history.map(function(t) { return renderTicketCard(t, 'past'); }).join('');
    
    setTimeout(generateAllQRCodes, 200);
}

async function downloadTicket(ticketId) {
    var ticket = tickets.find(function(t) { return t.id === ticketId; });
    if (!ticket) {
        alert(t('ticketNotFound'));
        return;
    }
    
    try {
        var { jsPDF } = window.jspdf;
        var doc = new jsPDF('p', 'mm', 'a4');
        var pageWidth = 210;
        var pageHeight = 297;
        var margin = 15;
        var y = margin;
        
        doc.setFillColor(13, 71, 161);
        doc.rect(0, 0, pageWidth, 45, 'F');
        
        doc.setTextColor(255, 255, 255);
        doc.setFontSize(28);
        doc.setFont('helvetica', 'bold');
        doc.text('BETIX', pageWidth / 2, 22, { align: 'center' });
        
        doc.setFontSize(12);
        doc.setFont('helvetica', 'normal');
        doc.text('Event Ticket', pageWidth / 2, 34, { align: 'center' });
        
        y = 55;
        
        var isVip = ticket.ticketType === 'vip';
        var typeLabel = isVip ? t('vip') : t('standard');
        
        if (isVip) {
            doc.setFillColor(212, 145, 30);
            doc.rect(margin, y, 40, 10, 'F');
            doc.setTextColor(255, 255, 255);
            doc.setFontSize(10);
            doc.setFont('helvetica', 'bold');
            doc.text('VIP', margin + 20, y + 7, { align: 'center' });
        } else {
            doc.setFillColor(13, 71, 161);
            doc.rect(margin, y, 40, 10, 'F');
            doc.setTextColor(255, 255, 255);
            doc.setFontSize(10);
            doc.setFont('helvetica', 'bold');
            doc.text('Standard', margin + 20, y + 7, { align: 'center' });
        }
        
        y += 20;
        
        doc.setTextColor(26, 26, 46);
        doc.setFontSize(18);
        doc.setFont('helvetica', 'bold');
        var titleLines = doc.splitTextToSize(ticket.eventTitle, pageWidth - margin * 2);
        doc.text(titleLines, margin, y);
        y += titleLines.length * 8 + 8;
        
        doc.setDrawColor(200, 200, 200);
        doc.setFillColor(248, 250, 252);
        doc.roundedRect(margin, y, pageWidth - margin * 2, 110, 4, 4, 'FD');
        
        var infoY = y + 10;
        doc.setFontSize(10);
        doc.setFont('helvetica', 'normal');
        
        var dateEvent = new Date(ticket.eventDate);
        var dateFormatted = dateEvent.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });
        var timeFormatted = dateEvent.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
        
        doc.setTextColor(107, 114, 128);
        doc.text(t('eventDate') + ':', margin + 10, infoY);
        doc.setTextColor(26, 26, 46);
        doc.setFont('helvetica', 'bold');
        doc.text(dateFormatted, margin + 55, infoY);
        
        infoY += 10;
        doc.setTextColor(107, 114, 128);
        doc.setFont('helvetica', 'normal');
        doc.text(t('eventTime') + ':', margin + 10, infoY);
        doc.setTextColor(26, 26, 46);
        doc.setFont('helvetica', 'bold');
        doc.text(timeFormatted, margin + 55, infoY);
        
        infoY += 10;
        doc.setTextColor(107, 114, 128);
        doc.setFont('helvetica', 'normal');
        doc.text(t('locationLabel') + ':', margin + 10, infoY);
        doc.setTextColor(26, 26, 46);
        doc.setFont('helvetica', 'bold');
        doc.text(ticket.eventLocation || 'Online', margin + 55, infoY);
        
        infoY += 10;
        doc.setTextColor(107, 114, 128);
        doc.setFont('helvetica', 'normal');
        doc.text(t('price') + ':', margin + 10, infoY);
        doc.setTextColor(26, 26, 46);
        doc.setFont('helvetica', 'bold');
        doc.text((ticket.price || 0).toFixed(6) + ' Pi', margin + 55, infoY);
        
        infoY += 10;
        doc.setTextColor(107, 114, 128);
        doc.setFont('helvetica', 'normal');
        doc.text(t('ticketTypeLabel') + ':', margin + 10, infoY);
        doc.setTextColor(26, 26, 46);
        doc.setFont('helvetica', 'bold');
        doc.text(typeLabel, margin + 55, infoY);
        
        infoY += 10;
        doc.setTextColor(107, 114, 128);
        doc.setFont('helvetica', 'normal');
        doc.text(t('countryLabel') + ':', margin + 10, infoY);
        doc.setTextColor(26, 26, 46);
        doc.setFont('helvetica', 'bold');
        doc.text(ticket.pays || 'France', margin + 55, infoY);
        
        y += 120;
        
        doc.setDrawColor(200, 200, 200);
        doc.setFillColor(255, 255, 255);
        doc.roundedRect(margin, y, pageWidth - margin * 2, 30, 4, 4, 'FD');
        
        doc.setTextColor(107, 114, 128);
        doc.setFontSize(9);
        doc.setFont('helvetica', 'normal');
        doc.text(t('ticketCode'), margin + 10, y + 8);
        
        doc.setTextColor(26, 26, 46);
        doc.setFontSize(12);
        doc.setFont('helvetica', 'bold');
        var codeDisplay = ticket.qrCode || 'BETIX-' + ticket.id.substring(0, 8);
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
        var qrText = codeDisplay;
        if (qrText.length > 30) qrText = qrText.substring(0, 28) + '...';
        doc.text(qrText, margin + 10, y + 22);
        
        var qrSize = 20;
        var qrX = pageWidth - margin - qrSize - 10;
        var qrY = y + 12;
        doc.setFillColor(13, 71, 161);
        for (var qi = 0; qi < 5; qi++) {
            for (var qj = 0; qj < 5; qj++) {
                if ((qi + qj) % 2 === 0 || qi === 0 || qi === 4 || qj === 0 || qj === 4) {
                    doc.rect(qrX + qi * 4, qrY + qj * 4, 3, 3, 'F');
                }
            }
        }
        
        y += 55;
        
        doc.setDrawColor(200, 200, 200);
        doc.line(margin, y, pageWidth - margin, y);
        y += 8;
        
        doc.setTextColor(107, 114, 128);
        doc.setFontSize(8);
        doc.setFont('helvetica', 'normal');
        doc.text('This ticket is valid for one entry. Please present this ticket at the entrance.', pageWidth / 2, y, { align: 'center' });
        y += 6;
        doc.text('BETIX - The first ticketing platform on Pi Network', pageWidth / 2, y, { align: 'center' });
        
        if (isVip) {
            doc.setDrawColor(212, 145, 30);
            doc.setLineWidth(2);
            doc.rect(margin - 2, margin - 2, pageWidth - margin * 2 + 4, pageHeight - margin * 2 + 4);
        }
        
        var fileName = 'ticket_' + ticket.eventTitle.replace(/\s+/g, '_') + '_' + ticket.id.substring(0, 6) + '.pdf';
        doc.save(fileName);
        
        addNotification(
            t('ticketDownloaded') + ': ' + ticket.eventTitle,
            'info'
        );
        
    } catch (error) {
        console.error('Error generating PDF:', error);
        alert(t('paymentError') + ': ' + error.message);
    }
}

function markTicketAsUsed(ticketId) {
    if (!confirm(t('markUsedConfirm'))) {
        return;
    }
    
    if (usedTickets.indexOf(ticketId) === -1) {
        usedTickets.push(ticketId);
        
        for (var i = 0; i < tickets.length; i++) {
            if (tickets[i].id === ticketId) {
                tickets[i].status = 'Used';
                break;
            }
        }
        
        saveUsedTickets();
        saveTickets();
        
        addNotification(
            t('ticketMarkedUsed'),
            'info'
        );
        
        renderTickets();
        renderHistory();
        updateProfilePage();
        
        alert(t('ticketMarkedUsed'));
    }
}

// ============================================================
// ===== MY RATINGS =====
// ============================================================

function renderMyRatings() {
    var container = document.getElementById('myRatingsList');
    if (!container) return;
    var myRatings = ratings.filter(function(r) { return r.userWallet === (currentUser.wallet || currentUser.name); });
    if (!myRatings.length) { container.innerHTML = '<p style="text-align:center;padding:2rem;">' + t('noReviews') + '</p>'; return; }
    container.innerHTML = myRatings.map(function(r) { var stars = ''; for (var i = 0; i < r.rating; i++) stars += '★'; for (var i = r.rating; i < 5; i++) stars += '☆'; return '<div class="ticket-card"><h3>' + escapeHtml(r.eventTitle) + '</h3><div>' + t('rating') + ': ' + r.rating + '/5 ' + stars + '</div>' + (r.comment ? '<p>"' + escapeHtml(r.comment) + '"</p>' : '') + '<small>' + new Date(r.date).toLocaleDateString() + '</small></div>'; }).join('');
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
        var types = [];
        if (e.ticketTypes && e.ticketTypes.standard && e.ticketTypes.standard.enabled) types.push(t('standard') + ': ' + e.ticketTypes.standard.price.toFixed(6) + ' Pi');
        if (e.ticketTypes && e.ticketTypes.vip && e.ticketTypes.vip.enabled) types.push(t('vip') + ': ' + e.ticketTypes.vip.price.toFixed(6) + ' Pi');
        var typesDisplay = types.join(' | ') || 'No ticket types';
        return '<div class="admin-event-item">' +
            '<div class="event-info">' +
                '<strong>' + escapeHtml(e.title) + '</strong>' +
                '<small>' + e.category + ' | ' + (e.pays || e.country || 'France') + ' | ' + e.seatsLeft + '/' + e.seatsTotal + ' ' + t('tickets') + ' | ' + new Date(e.date).toLocaleDateString('en-US') + '</small>' +
                '<small>' + t('ticketTypes') + ': ' + typesDisplay + '</small>' +
                '<small>' + t('organizer') + ': ' + escapeHtml(e.organizerName || e.organizer) + '</small>' +
            '</div>' +
            '<div class="event-actions">' +
                '<button class="admin-delete-btn" onclick="adminDeleteEvent(\'' + e.id + '\')">' + t('cancel') + '</button>' +
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
                '<button class="edit-btn" onclick="adminEditSlide(' + index + ')">' + t('editEvent') + '</button>' +
                '<button class="delete-btn" onclick="adminDeleteSlide(' + index + ')">' + t('cancel') + '</button>' +
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
    var title = heroSlides[index] ? heroSlides[index].title : 'Untitled';
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
// ===== MY EVENTS =====
// ============================================================

function renderMyEvents() {
    var container = document.getElementById('myEventsList');
    if (!container) return;
    
    var myEvents = events.filter(function(e) {
        return e.organizer === currentUser.wallet || e.organizerName === currentUser.name;
    });
    
    if (myEvents.length === 0) {
        container.innerHTML = '<div style="text-align:center;padding:3rem;color:var(--gray);background:#f9fafb;border-radius:16px;border:1px solid #e5e7eb;">' +
            '<i class="fas fa-calendar-plus" style="font-size:2.5rem;color:var(--primary);margin-bottom:12px;display:block;"></i>' +
            '<p style="font-size:1rem;font-weight:500;margin-bottom:4px;">' + t('noEvents') + '</p>' +
            '<p style="font-size:0.85rem;">' + t('createEvent') + '</p>' +
        '</div>';
        return;
    }
    
    container.innerHTML = myEvents.map(function(e) {
        return renderMyEventCardModern(e);
    }).join('');
    
    updateScanButtonVisibility();
}

function renderMyEventCardModern(event) {
    var dateEvent = new Date(event.date);
    var dateFormatted = dateEvent.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    var timeFormatted = dateEvent.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    
    var fallbackImage = eventImagesList[event.category] || 'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?w=600&h=400&fit=crop';
    var imageUrl = event.coverImage || (event.images && event.images[0]) || fallbackImage;
    
    var ticketSold = tickets.filter(function(t) { return t.eventId === event.id; }).length;
    
    var statusBadge = '';
    var statusClass = '';
    if (event.seatsLeft <= 0) {
        statusBadge = t('soldOut');
        statusClass = 'sold-out';
    } else if (new Date(event.date) < new Date()) {
        statusBadge = t('ended');
        statusClass = 'ended';
    } else {
        statusBadge = t('active');
        statusClass = '';
    }
    
    var flagEmojis = {
        'France': '🇫🇷', 'RDC': '🇨🇩', 'Congo': '🇨🇬', 'Belgium': '🇧🇪',
        'Switzerland': '🇨🇭', 'Canada': '🇨🇦', 'Senegal': '🇸🇳', 'Cameroon': '🇨🇲',
        'Cote d\'Ivoire': '🇨🇮', 'Mali': '🇲🇱', 'Niger': '🇳🇪', 'Nigeria': '🇳🇬',
        'South Africa': '🇿🇦', 'Angola': '🇦🇴', 'Mozambique': '🇲🇿',
        'Kenya': '🇰🇪', 'Tanzania': '🇹🇿', 'Uganda': '🇺🇬', 'Rwanda': '🇷🇼',
        'Ethiopia': '🇪🇹', 'Egypt': '🇪🇬', 'Morocco': '🇲🇦', 'Algeria': '🇩🇿',
        'Tunisia': '🇹🇳', 'Ghana': '🇬🇭', 'Guinea': '🇬🇳', 'Burkina Faso': '🇧🇫',
        'Benin': '🇧🇯', 'Togo': '🇹🇬', 'Liberia': '🇱🇷', 'Sierra Leone': '🇸🇱',
        'Gabon': '🇬🇦', 'Madagascar': '🇲🇬', 'Mauritius': '🇲🇺', 'Seychelles': '🇸🇨',
        'Zambia': '🇿🇲', 'Zimbabwe': '🇿🇼', 'Botswana': '🇧🇼', 'Namibia': '🇳🇦',
        'Spain': '🇪🇸', 'Portugal': '🇵🇹', 'Germany': '🇩🇪', 'Italy': '🇮🇹',
        'United Kingdom': '🇬🇧', 'United States': '🇺🇸', 'Russia': '🇷🇺',
        'Ukraine': '🇺🇦', 'Turkey': '🇹🇷', 'China': '🇨🇳', 'Japan': '🇯🇵',
        'India': '🇮🇳', 'Indonesia': '🇮🇩', 'Australia': '🇦🇺', 'Mexico': '🇲🇽',
        'Argentina': '🇦🇷', 'Brazil': '🇧🇷', 'Denmark': '🇩🇰', 'Sweden': '🇸🇪'
    };
    var countryFlag = flagEmojis[event.pays || event.country] || '';
    var countryDisplay = event.pays || event.country || 'International';
    
    var durationDisplay = '';
    if (event.durationValue && event.durationUnit) {
        durationDisplay = event.durationValue + ' ' + event.durationUnit;
    }
    
    var typesDisplay = '';
    if (event.ticketTypes && event.ticketTypes.standard && event.ticketTypes.standard.enabled) {
        typesDisplay += t('standard') + ': ' + event.ticketTypes.standard.price.toFixed(6) + ' Pi';
    }
    if (event.ticketTypes && event.ticketTypes.vip && event.ticketTypes.vip.enabled) {
        if (typesDisplay) typesDisplay += ' | ';
        typesDisplay += t('vip') + ': ' + event.ticketTypes.vip.price.toFixed(6) + ' Pi';
    }
    if (!typesDisplay) typesDisplay = 'No ticket types';
    
    return '<div class="my-event-card-modern">' +
        '<div class="event-image-wrapper">' +
            '<img src="' + imageUrl + '" class="event-image" alt="' + escapeHtml(event.title) + '" onerror="this.src=\'' + fallbackImage + '\'">' +
            '<span class="event-status-badge-modern ' + statusClass + '">' + statusBadge + '</span>' +
        '</div>' +
        '<div class="event-body-modern">' +
            '<div class="event-title-modern">' + escapeHtml(event.title) + '</div>' +
            '<div class="event-details-modern">' +
                '<div class="detail-item-modern"><i class="fas fa-calendar-day"></i> <span class="detail-label">' + t('eventDate') + '</span> <span class="detail-value">' + dateFormatted + '</span></div>' +
                '<div class="detail-item-modern"><i class="fas fa-clock"></i> <span class="detail-label">' + t('eventTime') + '</span> <span class="detail-value">' + timeFormatted + '</span></div>' +
                '<div class="detail-item-modern"><i class="fas fa-map-marker-alt"></i> <span class="detail-label">' + t('locationLabel') + '</span> <span class="detail-value">' + escapeHtml(event.location || 'Online') + '</span></div>' +
                '<div class="detail-item-modern"><span style="font-size:1rem;">' + countryFlag + '</span> <span class="detail-label">' + t('countryLabel') + '</span> <span class="detail-value">' + escapeHtml(countryDisplay) + '</span></div>' +
                '<div class="detail-item-modern"><i class="fas fa-ticket-alt"></i> <span class="detail-label">' + t('tickets') + ' ' + t('soldOut') + '</span> <span class="detail-value">' + ticketSold + '</span></div>' +
                '<div class="detail-item-modern"><i class="fas fa-users"></i> <span class="detail-label">' + t('seatsLeft') + '</span> <span class="detail-value">' + event.seatsLeft + '/' + event.seatsTotal + '</span></div>' +
                (durationDisplay ? '<div class="detail-item-modern" style="grid-column:1/2;"><i class="fas fa-hourglass-half"></i> <span class="detail-label">' + t('duration') + '</span> <span class="detail-value">' + durationDisplay + '</span></div>' : '') +
                '<div class="detail-item-modern" style="grid-column:' + (durationDisplay ? '2' : '1') + '/-1;"><i class="fas fa-tags"></i> <span class="detail-label">' + t('ticketTypes') + '</span> <span class="detail-value" style="font-size:0.7rem;">' + escapeHtml(typesDisplay) + '</span></div>' +
            '</div>' +
            '<div class="event-footer-modern">' +
                '<div class="event-stats-modern">' +
                    '<span><i class="fas fa-eye"></i> ' + (event.boosts || 0) + ' ' + t('views') + '</span>' +
                    '<span><i class="fas fa-calendar-plus"></i> ' + new Date(event.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) + '</span>' +
                '</div>' +
                '<div class="event-actions-modern">' +
                    '<button class="btn-edit-modern" onclick="event.stopPropagation(); openEditEventModal(\'' + event.id + '\')">' +
                        '<i class="fas fa-pen"></i> ' + t('editEvent') +
                    '</button>' +
                '</div>' +
            '</div>' +
        '</div>' +
    '</div>';
}

// ============================================================
// ===== RENDER EVENTS =====
// ============================================================

function renderEventsByCategory() {
    var container = document.getElementById('eventsByCategory');
    if (!container) return;
    var filtered = events.filter(function(e) { 
        var matchCategory = (currentFilter === 'All' || e.category === currentFilter);
        var matchCountry = (currentCountryFilter === 'All' || (e.pays || e.country) === currentCountryFilter);
        var matchSearch = (e.title.toLowerCase().includes(searchQuery) || (e.location && e.location.toLowerCase().includes(searchQuery)));
        return matchCategory && matchCountry && matchSearch;
    });
    if (filtered.length === 0) { 
        container.innerHTML = '<p style="text-align:center;padding:2rem;color:var(--gray);">' + t('noEvents') + '</p>'; 
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
                html += '<div class="category-section"><div class="category-header">' + t(cat.toLowerCase()) + '</div><div class="events-grid-centered">';
                catEvents.forEach(function(e) {
                    html += renderEventCard(e);
                });
                html += '</div></div>';
            }
        }
    }
    container.innerHTML = html;
}

// ============================================================
// ===== EVENT DETAILS AVEC CARROUSEL D'IMAGES =====
// ============================================================

function openEventDetails(eventId) {
    var event = events.find(function(e) { return e.id === eventId; });
    if (!event) {
        alert(t('eventNotFound'));
        return;
    }
    
    var modal = document.getElementById('eventDetailModal');
    var closeBtn = document.getElementById('eventDetailClose');
    var content = document.getElementById('eventDetailContent');
    
    var dateEvent = new Date(event.date);
    var dateFormatted = dateEvent.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    var timeFormatted = dateEvent.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    
    var flagEmojis = {
        'France': '🇫🇷', 'RDC': '🇨🇩', 'Congo': '🇨🇬', 'Belgium': '🇧🇪',
        'Switzerland': '🇨🇭', 'Canada': '🇨🇦', 'Senegal': '🇸🇳', 'Cameroon': '🇨🇲',
        'Cote d\'Ivoire': '🇨🇮', 'Mali': '🇲🇱', 'Niger': '🇳🇪', 'Nigeria': '🇳🇬',
        'South Africa': '🇿🇦', 'Angola': '🇦🇴', 'Mozambique': '🇲🇿',
        'Kenya': '🇰🇪', 'Tanzania': '🇹🇿', 'Uganda': '🇺🇬', 'Rwanda': '🇷🇼',
        'Ethiopia': '🇪🇹', 'Egypt': '🇪🇬', 'Morocco': '🇲🇦', 'Algeria': '🇩🇿',
        'Tunisia': '🇹🇳', 'Ghana': '🇬🇭', 'Guinea': '🇬🇳', 'Burkina Faso': '🇧🇫',
        'Benin': '🇧🇯', 'Togo': '🇹🇬', 'Liberia': '🇱🇷', 'Sierra Leone': '🇸🇱',
        'Gabon': '🇬🇦', 'Madagascar': '🇲🇬', 'Mauritius': '🇲🇺', 'Seychelles': '🇸🇨',
        'Zambia': '🇿🇲', 'Zimbabwe': '🇿🇼', 'Botswana': '🇧🇼', 'Namibia': '🇳🇦',
        'Spain': '🇪🇸', 'Portugal': '🇵🇹', 'Germany': '🇩🇪', 'Italy': '🇮🇹',
        'United Kingdom': '🇬🇧', 'United States': '🇺🇸', 'Russia': '🇷🇺',
        'Ukraine': '🇺🇦', 'Turkey': '🇹🇷', 'China': '🇨🇳', 'Japan': '🇯🇵',
        'India': '🇮🇳', 'Indonesia': '🇮🇩', 'Australia': '🇦🇺', 'Mexico': '🇲🇽',
        'Argentina': '🇦🇷', 'Brazil': '🇧🇷', 'Denmark': '🇩🇰', 'Sweden': '🇸🇪'
    };
    var countryFlag = flagEmojis[event.pays || event.country] || '';
    var countryDisplay = event.pays || event.country || 'International';
    
    var priceDisplay = '';
    if (event.ticketTypes && event.ticketTypes.standard && event.ticketTypes.standard.enabled) {
        priceDisplay += t('standard') + ': ' + event.ticketTypes.standard.price.toFixed(6) + ' Pi';
    }
    if (event.ticketTypes && event.ticketTypes.vip && event.ticketTypes.vip.enabled) {
        if (priceDisplay) priceDisplay += ' | ';
        priceDisplay += t('vip') + ': ' + event.ticketTypes.vip.price.toFixed(6) + ' Pi';
    }
    if (!priceDisplay) priceDisplay = (event.price || 0).toFixed(6) + ' Pi';
    
    var fallbackImage = eventImagesList[event.category] || 'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?w=600&h=400&fit=crop';
    var images = event.images && event.images.length > 0 ? event.images : [fallbackImage];
    
    // ---- CONSTRUCTION DU CARROUSEL D'IMAGES ----
    var carouselHtml = '';
    var imageCount = images.length;
    var trackId = 'carousel-track-' + event.id;
    var dotsId = 'carousel-dots-' + event.id;
    
    if (imageCount > 0) {
        carouselHtml = '<div class="event-detail-image-carousel" id="carousel-' + event.id + '">';
        carouselHtml += '<div class="carousel-track" id="' + trackId + '">';
        
        for (var i = 0; i < images.length; i++) {
            var imgSrc = images[i] || fallbackImage;
            carouselHtml += '<div class="carousel-slide"><img src="' + imgSrc + '" alt="Image ' + (i+1) + '" onerror="this.src=\'' + fallbackImage + '\'"></div>';
        }
        
        carouselHtml += '</div>';
        
        if (imageCount > 1) {
            carouselHtml += '<button class="carousel-btn prev" onclick="carouselPrev(\'' + event.id + '\')">‹</button>';
            carouselHtml += '<button class="carousel-btn next" onclick="carouselNext(\'' + event.id + '\')">›</button>';
            carouselHtml += '<div class="carousel-counter"><i class="fas fa-image"></i><span id="carousel-current-' + event.id + '">1</span>/' + imageCount + '</div>';
            carouselHtml += '<div class="carousel-dots" id="' + dotsId + '">';
            for (var d = 0; d < imageCount; d++) {
                carouselHtml += '<button class="cdot' + (d === 0 ? ' active' : '') + '" onclick="carouselGoTo(\'' + event.id + '\', ' + d + ')"></button>';
            }
            carouselHtml += '</div>';
        }
        
        carouselHtml += '</div>';
    }
    
    var conditionsHtml = '';
    if (event.conditions) {
        var conditionsList = event.conditions.split('\n').filter(function(line) { return line.trim() !== ''; });
        if (conditionsList.length > 0) {
            conditionsHtml = '<ul>';
            for (var i = 0; i < conditionsList.length; i++) {
                conditionsHtml += '<li>' + escapeHtml(conditionsList[i].trim()) + '</li>';
            }
            conditionsHtml += '</ul>';
        } else {
            conditionsHtml = '<p style="color: var(--gray); font-size: 0.85rem;">' + escapeHtml(event.conditions) + '</p>';
        }
    } else {
        conditionsHtml = '<p style="color: var(--gray); font-size: 0.85rem;">' + t('noConditions') + '</p>';
    }
    
    var eventRatings = ratings.filter(function(r) { return r.eventId === event.id; });
    var reviewsHtml = '';
    if (eventRatings.length > 0) {
        for (var i = 0; i < eventRatings.length; i++) {
            var r = eventRatings[i];
            var stars = '';
            for (var k = 0; k < r.rating; k++) stars += '★';
            for (var k = r.rating; k < 5; k++) stars += '☆';
            reviewsHtml += '<div class="review-item-simple">' +
                '<div class="review-header"><span class="review-user">' + escapeHtml(r.userName || r.userWallet) + '</span><span class="review-stars">' + stars + '</span></div>' +
                (r.comment ? '<div class="review-text">"' + escapeHtml(r.comment) + '"</div>' : '') +
                '<div class="review-date">' + new Date(r.date).toLocaleDateString('en-US') + '</div>' +
            '</div>';
        }
    } else {
        reviewsHtml = '<p style="color: var(--gray); font-size: 0.85rem;">' + t('noReviews') + '</p>';
    }
    
    var avgRating = 0;
    if (eventRatings.length > 0) {
        avgRating = eventRatings.reduce(function(a, r) { return a + r.rating; }, 0) / eventRatings.length;
    }
    var ratingStars = '';
    var fullStars = Math.floor(avgRating);
    for (var i = 0; i < fullStars; i++) ratingStars += '★';
    for (var i = fullStars; i < 5; i++) ratingStars += '☆';
    var ratingDisplay = eventRatings.length > 0 ? ratingStars + ' ' + avgRating.toFixed(1) + ' (' + eventRatings.length + ' ' + t('reviews') + ')' : t('notYetRated');
    
    var organizerDisplay = event.organizerName || event.organizer || 'Unknown';
    if (!organizerDisplay.startsWith('@')) {
        organizerDisplay = '@' + organizerDisplay;
    }
    
    content.innerHTML = 
        '<div class="event-detail-header-simple">' +
            '<button class="back-btn-detail" onclick="closeEventDetailModal()">' +
                '<i class="fas fa-arrow-left"></i>' +
            '</button>' +
            '<span class="detail-title-header">' + escapeHtml(event.title) + '</span>' +
            '<span class="detail-category-tag-simple">' + escapeHtml(event.category) + '</span>' +
        '</div>' +
        
        '<div class="event-detail-body-simple">' +
            carouselHtml +
            
            '<div class="event-detail-info-grid">' +
                '<div class="info-item"><i class="fas fa-calendar-day"></i> <span class="info-label">' + t('eventDate') + '</span> <span class="info-value">' + dateFormatted + '</span></div>' +
                '<div class="info-item"><i class="fas fa-clock"></i> <span class="info-label">' + t('eventTime') + '</span> <span class="info-value">' + timeFormatted + '</span></div>' +
                '<div class="info-item"><i class="fas fa-map-marker-alt"></i> <span class="info-label">' + t('locationLabel') + '</span> <span class="info-value">' + escapeHtml(event.location || 'Online') + '</span></div>' +
                '<div class="info-item"><i class="fas fa-flag"></i> <span class="info-label">' + t('countryLabel') + '</span> <span class="info-value">' + countryFlag + ' ' + escapeHtml(countryDisplay) + '</span></div>' +
                (event.durationValue && event.durationUnit ? '<div class="info-item full-width"><i class="fas fa-hourglass-half"></i> <span class="info-label">' + t('duration') + '</span> <span class="info-value">' + event.durationValue + ' ' + event.durationUnit + '</span></div>' : '') +
            '</div>' +
            
            '<div class="event-detail-price-seats-simple">' +
                '<span class="price-simple">' + priceDisplay + '</span>' +
                '<span class="seats-simple"><i class="fas fa-users"></i> ' + event.seatsLeft + '/' + event.seatsTotal + ' ' + t('tickets') + '</span>' +
            '</div>' +
            
            '<div class="event-detail-description">' +
                '<h4>' + t('fullDescription') + '</h4>' +
                '<p>' + (event.description || t('noConditions')) + '</p>' +
            '</div>' +
            
            '<div class="event-detail-conditions">' +
                '<h4>' + t('conditions') + '</h4>' +
                conditionsHtml +
            '</div>' +
            
            '<div class="event-detail-meta">' +
                '<h4>' + t('information') + '</h4>' +
                '<div class="meta-grid">' +
                    '<div class="meta-item"><span class="meta-label">' + t('organizer') + '</span><span class="meta-value">' + escapeHtml(organizerDisplay) + '</span></div>' +
                    '<div class="meta-item"><span class="meta-label">' + t('createdOn') + '</span><span class="meta-value">' + new Date(event.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) + '</span></div>' +
                    '<div class="meta-item"><span class="meta-label">' + t('seatsLeft') + '</span><span class="meta-value">' + event.seatsLeft + '/' + event.seatsTotal + '</span></div>' +
                    '<div class="meta-item"><span class="meta-label">' + t('rating') + '</span><span class="meta-value">' + ratingDisplay + '</span></div>' +
                '</div>' +
            '</div>' +
            
            '<div class="event-detail-reviews">' +
                '<h4>' + t('reviews') + '</h4>' +
                reviewsHtml +
            '</div>' +
        '</div>' +
        
        '<div class="event-detail-footer-simple">' +
            '<button class="btn-buy-simple" id="detailBuyBtnSimple">' +
                '<i class="fas fa-ticket-alt"></i> ' + t('buyTicket') +
            '</button>' +
        '</div>';
    
    document.getElementById('detailBuyBtnSimple').onclick = function() {
        modal.classList.remove('show');
        document.body.style.overflow = '';
        openQuantityPopup(event.id);
    };
    
    closeBtn.onclick = function() { 
        closeEventDetailModal();
    };
    
    window.onclick = function(e) { 
        if (e.target === modal) {
            closeEventDetailModal();
        }
    };
    
    modal.classList.add('show');
    document.body.style.overflow = 'hidden';
    
    if (images.length > 1) {
        var carouselData = {
            currentIndex: 0,
            totalSlides: images.length,
            trackId: trackId,
            dotsId: dotsId,
            eventId: event.id
        };
        window._carousels = window._carousels || {};
        window._carousels[event.id] = carouselData;
        
        var counter = document.getElementById('carousel-current-' + event.id);
        if (counter) counter.textContent = '1';
    }
}

// ============================================================
// ===== FONCTIONS DE NAVIGATION DU CARROUSEL =====
// ============================================================

function carouselGoTo(eventId, index) {
    var carousel = window._carousels && window._carousels[eventId];
    if (!carousel) return;
    
    var track = document.getElementById(carousel.trackId);
    if (!track) return;
    
    var total = carousel.totalSlides;
    if (index < 0) index = total - 1;
    if (index >= total) index = 0;
    carousel.currentIndex = index;
    
    var offset = -index * 100;
    track.style.transform = 'translateX(' + offset + '%)';
    
    var dots = document.querySelectorAll('#' + carousel.dotsId + ' .cdot');
    dots.forEach(function(dot, i) {
        dot.classList.toggle('active', i === index);
    });
    
    var counter = document.getElementById('carousel-current-' + eventId);
    if (counter) counter.textContent = (index + 1);
}

function carouselPrev(eventId) {
    var carousel = window._carousels && window._carousels[eventId];
    if (!carousel) return;
    carouselGoTo(eventId, carousel.currentIndex - 1);
}

function carouselNext(eventId) {
    var carousel = window._carousels && window._carousels[eventId];
    if (!carousel) return;
    carouselGoTo(eventId, carousel.currentIndex + 1);
}

function closeEventDetailModal() {
    var modal = document.getElementById('eventDetailModal');
    if (modal) {
        modal.classList.remove('show');
        document.body.style.overflow = '';
    }
    if (window._carousels) {
        for (var key in window._carousels) {
            delete window._carousels[key];
        }
    }
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
        modal.innerHTML = '<span class="gallery-close">&times;</span><img id="galleryCurrentImage" src=""><div class="gallery-nav"><button id="galleryPrev">' + t('back') + '</button><button id="galleryNext">' + t('viewAll') + '</button></div>';
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
    container.innerHTML = cats.map(function(c) { 
        var label = c === 'All' ? t('all') : t(c.toLowerCase());
        return '<div class="filter-chip ' + (c === currentFilter ? 'active' : '') + '" data-category="' + c + '">' + label + '</div>'; 
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
            loyaltyPoints: currentUser.loyaltyPoints || 0,
            memberSince: currentUser.memberSince || '2026'
        };
        if (!existing) {
            connectedUsers.push(userData);
        } else {
            existing.name = currentUser.name;
            existing.ticketCount = tickets.length;
            existing.lastSeen = new Date().toLocaleString();
            existing.loyaltyPoints = currentUser.loyaltyPoints || 0;
        }
        localStorage.setItem('betix_connected_users', JSON.stringify(connectedUsers));
        syncUserToSupabase();
    }
}

// ============================================================
// ===== VERIFY SUPABASE PERSISTENCE =====
// ============================================================

async function verifySupabasePersistence() {
    console.log('🔍 VÉRIFICATION SUPABASE - PERSISTANCE DES DONNÉES');
    console.log('==================================================');
    
    try {
        var supabaseEvents = await loadEventsFromSupabase();
        console.log('📋 Événements dans Supabase:', supabaseEvents ? supabaseEvents.length : 0);
        if (supabaseEvents && supabaseEvents.length > 0) {
            console.log('   Dernier événement:', supabaseEvents[supabaseEvents.length - 1].title);
        }
        
        if (currentUser.piUid || currentUser.wallet) {
            var piUid = currentUser.piUid || currentUser.wallet;
            var supabaseTickets = await loadTicketsFromSupabase(piUid);
            console.log('🎫 Tickets dans Supabase pour', piUid, ':', supabaseTickets ? supabaseTickets.length : 0);
            if (supabaseTickets && supabaseTickets.length > 0) {
                console.log('   Dernier ticket:', supabaseTickets[supabaseTickets.length - 1].id);
            }
        }
        
        if (currentUser.piUid || currentUser.wallet) {
            var piUid2 = currentUser.piUid || currentUser.wallet;
            var supabaseNotifs = await loadNotificationsFromSupabase(piUid2);
            console.log('🔔 Notifications dans Supabase:', supabaseNotifs ? supabaseNotifs.length : 0);
        }
        
        console.log('🔄 Synchronisation mémoire/Supabase:');
        console.log('   Événements en mémoire:', events.length);
        console.log('   Tickets en mémoire:', tickets.length);
        console.log('   Notifications en mémoire:', notifications.length);
        
        console.log('✅ VÉRIFICATION TERMINÉE');
        alert('Vérification Supabase terminée. Consultez la console pour les détails.');
        
        return {
            events: supabaseEvents ? supabaseEvents.length : 0,
            tickets: supabaseTickets ? supabaseTickets.length : 0,
            notifications: supabaseNotifs ? supabaseNotifs.length : 0,
            memoryEvents: events.length,
            memoryTickets: tickets.length
        };
        
    } catch (error) {
        console.error('❌ Erreur lors de la vérification:', error);
        alert('Erreur: ' + error.message);
        return null;
    }
}

async function forceFullSync() {
    console.log('🔄 FORCE FULL SYNC - Début');
    console.log('==================================================');
    
    try {
        console.log('   Synchronisation des événements...');
        await syncEventsToSupabase();
        
        console.log('   Synchronisation des tickets...');
        await syncTicketsToSupabase();
        
        console.log('   Synchronisation des notifications...');
        await syncNotificationsToSupabase();
        
        console.log('   Synchronisation de l\'utilisateur...');
        await syncUserToSupabase();
        
        console.log('✅ FORCE FULL SYNC - Terminé');
        console.log('   Événements:', events.length);
        console.log('   Tickets:', tickets.length);
        console.log('   Notifications:', notifications.length);
        
        alert('Synchronisation complète terminée !');
        return true;
        
    } catch (error) {
        console.error('❌ Erreur lors de la synchronisation:', error);
        alert('Erreur: ' + error.message);
        return false;
    }
}

window.verifySupabasePersistence = verifySupabasePersistence;
window.forceFullSync = forceFullSync;

// ============================================================
// ===== CLEAR DATA =====
// ============================================================

function clearAllData() { 
    if (confirm(t('clearDataConfirm'))) { 
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
        { q: "How to buy a ticket?", a: "Connect, browse events, click 'Buy Ticket' and choose the quantity and type." },
        { q: "Are payments secure?", a: "Yes, via the Pi Network and Betix's escrow system." },
        { q: "Can I get a refund?", a: "Yes in case of cancellation, postponement or fraud." },
        { q: "Where are my tickets stored?", a: "In the 'My Tickets' section of your account." }
    ],
    [
        { q: "How to create an event?", a: "Connect, click 'Create Event' and fill out the form." },
        { q: "Conditions to be an organizer?", a: "Have an active Pi Network account and comply with the terms of use." },
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
    if (!slidesContainer) {
        console.warn('Hero slides container not found');
        return;
    }
    
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
        slidesContainer.style.transition = 'transform 0.7s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
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
        }, 750);
    }

    function nextSlide() {
        if (totalSlides > 0) goToSlide(currentIndex + 1);
    }

    function prevSlide() {
        if (totalSlides > 0) goToSlide(currentIndex - 1);
    }

    function startAutoPlay() {
        stopAutoPlay();
        if (totalSlides > 1) {
            autoPlayInterval = setInterval(function() {
                if (!isTransitioning) {
                    nextSlide();
                }
            }, 4000);
            console.log('Carousel auto-play started');
        }
    }

    function stopAutoPlay() {
        if (autoPlayInterval) {
            clearInterval(autoPlayInterval);
            autoPlayInterval = null;
            console.log('Carousel auto-play stopped');
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
    console.log('Hero slider initialized with ' + totalSlides + ' slides');
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
// ===== UPDATE USER INFO =====
// ============================================================

function updateUserInfo() {
    var nameEl = document.getElementById('sidebarName');
    var walletEl = document.getElementById('sidebarWallet');
    var avatarText = document.getElementById('sidebarAvatarText');
    var profileName = document.getElementById('profileNameDisplay');
    var profileWallet = document.getElementById('profileWalletDisplay');
    var memberSince = document.getElementById('memberSince');
    
    if (nameEl) nameEl.textContent = currentUser.name || t('guest');
    if (walletEl) walletEl.textContent = currentUser.wallet ? t('notConnected') : t('notConnected');
    if (avatarText) avatarText.textContent = (currentUser.name || 'U')[0].toUpperCase();
    if (profileName) profileName.textContent = currentUser.name || t('guest');
    if (profileWallet) profileWallet.textContent = currentUser.wallet || t('notConnected');
    if (memberSince) memberSince.textContent = currentUser.memberSince || '2026';
    
    updateConnectButtons();
    updateSidebarNotifBadge();
    updateUITranslations();
    updateScanButtonVisibility();
}

function updateProfilePage() {
    var myEventsCount = document.getElementById('myEventsCount');
    var ticketCount = document.getElementById('ticketCount');
    var historyCount = document.getElementById('historyCount');
    var ratedCount = document.getElementById('ratedCount');
    var ratingDisplay = document.getElementById('profileRatingDisplay');
    var loyaltyDisplay = document.getElementById('profileLoyaltyDisplay');
    var profileName = document.getElementById('profileNameDisplay');
    var profileWallet = document.getElementById('profileWalletDisplay');
    var memberSince = document.getElementById('memberSince');
    
    var myEvents = events.filter(function(e) { return e.organizer === currentUser.wallet || e.organizerName === currentUser.name; });
    var userTickets = tickets.filter(function(t) { return t.userWallet === currentUser.wallet || t.buyerWallet === currentUser.wallet; });
    var userRatings = ratings.filter(function(r) { return r.userWallet === currentUser.wallet || r.userWallet === currentUser.name; });
    
    if (myEventsCount) myEventsCount.textContent = myEvents.length;
    if (ticketCount) ticketCount.textContent = userTickets.length;
    if (historyCount) historyCount.textContent = tickets.filter(function(t) { 
        var isUsed = usedTickets.indexOf(t.id) !== -1;
        var isExpired = new Date(t.eventDate) <= new Date();
        return (isUsed || isExpired) && (t.userWallet === currentUser.wallet || t.buyerWallet === currentUser.wallet);
    }).length;
    if (ratedCount) ratedCount.textContent = userRatings.length;
    if (ratingDisplay) ratingDisplay.textContent = userRatings.length;
    if (loyaltyDisplay) loyaltyDisplay.textContent = currentUser.loyaltyPoints || 0;
    if (profileName) profileName.textContent = currentUser.name || t('guest');
    if (profileWallet) profileWallet.textContent = currentUser.wallet || t('notConnected');
    if (memberSince) memberSince.textContent = currentUser.memberSince || '2026';
    
    updateScanButtonVisibility();
}

function userHasPublishedEvents() {
    if (!currentUser.wallet && !currentUser.piUid) return false;
    var userId = currentUser.piUid || currentUser.wallet;
    var myEvents = events.filter(function(e) {
        return e.organizer === userId || e.organizerPiUid === userId || e.organizerName === currentUser.name;
    });
    return myEvents.length > 0;
}

function updateScanButtonVisibility() {
    var scanBtn = document.getElementById('scanMenuItem');
    if (!scanBtn) return;
    if (userHasPublishedEvents()) {
        scanBtn.style.display = 'block';
    } else {
        scanBtn.style.display = 'none';
    }
}

// ============================================================
// ===== FORCE SYNC - DEBUG FUNCTIONS =====
// ============================================================

async function forceSyncTickets() {
    console.log('FORCE SYNC TICKETS');
    console.log('Tickets in memory:', tickets.length);
    
    if (tickets.length === 0) {
        alert('No tickets to sync');
        return;
    }
    
    var success = 0;
    var errors = [];
    var errorDetails = [];
    
    for (var i = 0; i < tickets.length; i++) {
        console.log('[' + (i+1) + '/' + tickets.length + '] Saving ticket:', tickets[i].id);
        
        try {
            var saved = await saveTicketToSupabase(tickets[i]);
            if (saved) {
                success++;
                console.log('   Saved successfully');
            } else {
                errors.push(tickets[i].id);
                console.log('   Failed to save');
            }
        } catch (e) {
            errors.push(tickets[i].id);
            errorDetails.push({ id: tickets[i].id, error: e.message });
            console.log('   Error:', e.message);
        }
        
        await new Promise(resolve => setTimeout(resolve, 300));
    }
    
    console.log('SYNC COMPLETED');
    console.log('   Success:', success + '/' + tickets.length);
    console.log('   Errors:', errors.length);
    if (errorDetails.length > 0) {
        console.log('   Error details:', errorDetails);
    }
    
    alert('Success ' + success + '/' + tickets.length + ' tickets synced with Supabase!' +
          (errors.length > 0 ? '\nErrors: ' + errors.length + ' tickets' : ''));
}

async function checkSupabaseData() {
    console.log('CHECKING SUPABASE DATA');
    
    try {
        var supabaseEvents = await loadEventsFromSupabase();
        console.log('Events in Supabase:', supabaseEvents ? supabaseEvents.length : 0);
        
        if (currentUser.piUid || currentUser.wallet) {
            var piUid = currentUser.piUid || currentUser.wallet;
            var supabaseTickets = await loadTicketsFromSupabase(piUid);
            console.log('Tickets in Supabase for user:', supabaseTickets ? supabaseTickets.length : 0);
            
            if (supabaseTickets && supabaseTickets.length > 0) {
                console.log('   First ticket:', supabaseTickets[0]);
                console.log('   All ticket columns:', Object.keys(supabaseTickets[0]));
            }
        }
        
        console.log('Tickets in memory:', tickets.length);
        if (tickets.length > 0) {
            console.log('   First ticket:', tickets[0]);
        }
        
        var msg = 'Check completed!\n' +
                  'Supabase events: ' + (supabaseEvents ? supabaseEvents.length : 0) + '\n' +
                  'Supabase tickets: ' + (supabaseTickets ? supabaseTickets.length : 0) + '\n' +
                  'Memory tickets: ' + tickets.length;
        
        alert(msg);
        
    } catch (error) {
        console.error('Error checking data:', error);
        alert('Error: ' + error.message);
    }
}

function showTickets() {
    console.log('TICKETS IN MEMORY');
    console.log('Total:', tickets.length);
    tickets.forEach(function(t, i) {
        console.log('  ' + (i+1) + '.', t.id, '|', t.eventTitle, '|', t.ticketType, '|', t.price, 'Pi', '|', t.pays, '|', t.status);
    });
}

async function showSupabaseTickets() {
    if (!currentUser.piUid && !currentUser.wallet) {
        alert('Please connect first');
        return;
    }
    
    var piUid = currentUser.piUid || currentUser.wallet;
    var supabaseTickets = await loadTicketsFromSupabase(piUid);
    
    console.log('TICKETS IN SUPABASE');
    console.log('Total:', supabaseTickets ? supabaseTickets.length : 0);
    if (supabaseTickets && supabaseTickets.length > 0) {
        supabaseTickets.forEach(function(t, i) {
            console.log('  ' + (i+1) + '.', t.id, '|', t.event_title, '|', t.ticket_type, '|', t.price, 'Pi', '|', t.pays, '|', t.status);
        });
    }
    
    alert('' + (supabaseTickets ? supabaseTickets.length : 0) + ' tickets found in Supabase');
}

async function reloadTicketsFromSupabase() {
    console.log('RELOAD TICKETS FROM SUPABASE');
    
    if (!currentUser.piUid && !currentUser.wallet) {
        alert('You are not connected');
        return;
    }
    
    var piUid = currentUser.piUid || currentUser.wallet;
    console.log('User:', piUid);
    
    try {
        var supabaseTickets = await loadTicketsFromSupabase(piUid);
        console.log('Tickets from Supabase:', supabaseTickets ? supabaseTickets.length : 0);
        
        if (supabaseTickets && supabaseTickets.length > 0) {
            tickets = supabaseTickets.map(function(t) {
                return {
                    id: t.id,
                    eventId: t.event_id,
                    eventTitle: t.event_title || 'Event',
                    eventDate: t.expiration_date || t.event_date || new Date().toISOString(),
                    eventLocation: t.event_location || '',
                    price: parseFloat(t.price) || 0,
                    buyerWallet: t.buyer_pi_uid,
                    buyerName: t.buyer_name || t.buyer_pi_uid,
                    userWallet: t.buyer_pi_uid,
                    ticketType: t.ticket_type || 'standard',
                    pays: t.pays || 'France',
                    status: t.status || 'Valid',
                    purchaseDate: t.purchase_date || new Date().toISOString(),
                    purchaseDateTime: new Date(t.purchase_date || new Date()).toLocaleString('en-US'),
                    transactionId: t.transaction_id || '',
                    qrCode: t.qr_code || 'BETIX-' + Date.now()
                };
            });
            
            localStorage.setItem('betix_tickets', JSON.stringify(tickets));
            
            renderTickets();
            renderHistory();
            updateProfilePage();
            
            console.log('Loaded', tickets.length, 'tickets from Supabase');
            alert('' + tickets.length + ' tickets loaded from Supabase');
        } else {
            alert('No tickets found in Supabase');
        }
    } catch (e) {
        console.error('Error:', e);
        alert('Error: ' + e.message);
    }
}

window.forceSyncTickets = forceSyncTickets;
window.checkSupabaseData = checkSupabaseData;
window.showTickets = showTickets;
window.showSupabaseTickets = showSupabaseTickets;
window.reloadTicketsFromSupabase = reloadTicketsFromSupabase;

// ============================================================
// ===== DOM CONTENT LOADED =====
// ============================================================

document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM Content Loaded - Starting application...');
    
    var successPopup = document.getElementById('successPopup');
    if (successPopup) {
        successPopup.classList.remove('show');
        successPopup.style.display = 'none';
    }
    var successInfo = document.getElementById('successTicketInfo');
    if (successInfo) {
        successInfo.innerHTML = '';
    }
    localStorage.removeItem('betix_success_popup_shown');
    
    try {
        var savedUser = localStorage.getItem('betix_user');
        if (savedUser) {
            try {
                var userData = JSON.parse(savedUser);
                if (userData.wallet || userData.piUid) {
                    currentUser = userData;
                    piUser = { username: userData.wallet || userData.piUid };
                    console.log('User restored from localStorage:', currentUser.name);
                }
            } catch (e) {
                console.warn('Failed to restore user:', e);
            }
        }
        
        var loader = document.getElementById('loader');
        var main = document.getElementById('main-content');
        
        if (loader && main) {
            console.log('Loader and main content found');
            setTimeout(function() {
                loader.style.opacity = '0';
                setTimeout(function() {
                    loader.style.display = 'none';
                    main.style.display = 'block';
                    
                    updateUserInfo();
                    updateProfilePage();
                    updateConnectButtons();
                    
                    console.log('Application loaded successfully');
                    loadAllFromSupabase();
                    
                }, 500);
            }, 800);
        } else {
            console.warn('Loader or main content not found');
        }
        
        detectLanguage();
        loadUsedTickets();
        
        if (!events || events.length === 0) { 
            events = []; 
            saveEvents(); 
        }
        
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
        setupTicketTypesUI();
        
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
        var headerRight = document.getElementById('headerRight');
        
        if (menuBtn) {
            console.log('Menu button found, adding click listeners');
            
            menuBtn.style.cssText += 'display: flex !important; align-items: center !important; justify-content: center !important; z-index: 99999 !important; position: relative !important; pointer-events: auto !important; cursor: pointer !important; opacity: 1 !important; visibility: visible !important; width: 50px !important; height: 50px !important; min-width: 50px !important; min-height: 50px !important; border-radius: 12px !important; background: rgba(255,255,255,0.25) !important; border: 2px solid rgba(255,255,255,0.15) !important; font-size: 1.5rem !important; color: white !important;';
            
            menuBtn.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                e.stopImmediatePropagation();
                console.log('Menu button clicked (direct)');
                openSidebar();
                return false;
            });
            
            if (headerRight) {
                headerRight.addEventListener('click', function(e) {
                    var target = e.target;
                    var btn = target.closest('#menuBtn');
                    if (btn) {
                        e.preventDefault();
                        e.stopPropagation();
                        console.log('Menu button clicked via header-right delegation');
                        openSidebar();
                    }
                });
            }
            
            document.addEventListener('click', function(e) {
                var target = e.target;
                var btn = target.closest('#menuBtn');
                if (btn) {
                    e.preventDefault();
                    e.stopPropagation();
                    console.log('Menu button clicked via document delegation');
                    openSidebar();
                }
            });
            
            menuBtn.addEventListener('mouseenter', function() {
                this.style.background = 'rgba(255,255,255,0.4)';
                this.style.transform = 'scale(1.05)';
            });
            menuBtn.addEventListener('mouseleave', function() {
                this.style.background = 'rgba(255,255,255,0.25)';
                this.style.transform = 'scale(1)';
            });
            
            menuBtn.style.pointerEvents = 'auto';
            menuBtn.style.cursor = 'pointer';
            
        } else {
            console.error('Menu button not found in DOM');
        }
        
        var backBtn = document.getElementById('backBtn');
        if (backBtn) {
            console.log('Back button found, adding click listener');
            
            backBtn.style.cssText += 'display: flex !important; align-items: center !important; justify-content: center !important; z-index: 99999 !important; position: relative !important; pointer-events: auto !important; cursor: pointer !important; opacity: 1 !important; visibility: visible !important;';
            
            backBtn.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                console.log('Back button clicked');
                goBack();
                return false;
            });
            
            backBtn.style.pointerEvents = 'auto';
            backBtn.style.cursor = 'pointer';
        }
        
        var closeSidebarBtn = document.getElementById('closeSidebarBtn');
        if (closeSidebarBtn) {
            closeSidebarBtn.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                console.log('Close sidebar clicked');
                closeSidebar();
            });
        }
        
        var overlay = document.getElementById('overlay');
        if (overlay) {
            overlay.addEventListener('click', function(e) {
                console.log('Overlay clicked, closing sidebar');
                closeSidebar();
            });
        }
        
        var eventForm = document.getElementById('eventForm');
        var searchInput = document.getElementById('searchInput');
        var clearDataBtn = document.getElementById('clearDataBtn');
        
        updateConnectButtons();
        
        var confirmPublishBtn = document.getElementById('confirmPublishBtn');
        if (confirmPublishBtn) {
            confirmPublishBtn.addEventListener('click', confirmPublishEvent);
        }
        
        var confirmBuyBtn = document.getElementById('confirmBuyBtn');
        if (confirmBuyBtn) {
            confirmBuyBtn.addEventListener('click', confirmPurchaseFromPopup);
        }
        
        var ticketTypeSelect = document.getElementById('ticketTypeSelect');
        if (ticketTypeSelect) {
            ticketTypeSelect.addEventListener('change', function() {
                updateMaxQuantity();
                updateTicketTotal();
            });
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
        
        if (eventForm) eventForm.addEventListener('submit', createEvent);
        if (searchInput) searchInput.addEventListener('input', function(e) { 
            searchQuery = e.target.value.toLowerCase(); 
            renderEventsByCategory(); 
        });
        if (clearDataBtn) clearDataBtn.addEventListener('click', clearAllData);
        
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
        
        setInterval(function() {
            if (currentUser.wallet) {
                saveUser();
                console.log('User session refreshed');
            }
        }, 30000);

        setTimeout(function() {
            loadAllFromSupabase();
        }, 1000);

        setInterval(function() {
            syncAllToSupabase();
        }, 30000);

        window.addEventListener('beforeunload', function() {
            syncAllToSupabase();
        });
        
        if (currentUser.wallet && isSessionExpired()) { disconnectPi(); }
        
        console.log('Betix loaded successfully!');
        console.log('Supabase connected');
        console.log('Admin: 5 clicks on logo + password Betix@2026#');
        console.log('Menu button fix applied');
        console.log('Back button fix applied');
        console.log('Hero slider auto-play enabled');
        console.log('VIP tickets appear in My Tickets');
        console.log('Download ticket feature added');
        console.log('Auto-sync to Supabase every 30 seconds');
        console.log('Price and transaction_id now saved');
        console.log('Debug functions available: forceSyncTickets(), checkSupabaseData(), showTickets(), showSupabaseTickets(), reloadTicketsFromSupabase()');
        console.log('Payment fixes applied: using same structure as working code (Js v3)');
        console.log('Hero texts restored to original: "The first ticketing platform powered by Pi Network"');
        console.log('QR Code generation integrated successfully!');
        console.log('Purchase date now displayed on tickets!');
        console.log('Professional ticket card design with watermark "Betix"');
        console.log('Scanner button only visible for event publishers!');
        console.log('Publication date (Twitter/X style) added to event cards!');
        console.log('Success popup buttons fixed: "Voir mon ticket" redirects to My Tickets page, "Fermer" closes popup');
        console.log('Success popup cleaned on page load to prevent reappearance');
        console.log('User session restored from localStorage on page load');
        console.log('User session refreshed every 30 seconds');
        console.log('Ticket seats (Standard/VIP) management added!');
        console.log('Seats display on event cards: STD: X/Y | VIP: X/Y');
        console.log('Notifications sent to organizer for each ticket purchase');
        console.log('Duration field modernized with dropdown menus');
        console.log('Price badge replaces "New" on event cards (green background, white text)!');
        console.log('Country displayed with flag on event cards!');
        console.log('Duration displayed on event cards!');
        console.log('Country + Duration on same line with separator!');
        console.log('Carousel improved with better dots, counter and progress bar!');
        console.log('Verify Supabase persistence: verifySupabasePersistence()');
        console.log('Force full sync: forceFullSync()');
        
    } catch (error) {
        console.error('Error during application startup:', error);
        var loader = document.getElementById('loader');
        var main = document.getElementById('main-content');
        if (loader && main) {
            loader.style.display = 'none';
            main.style.display = 'block';
        }
    }
});