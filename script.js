function openPublishConfirm(eventData) {
    pendingEventData = eventData;
    
    // Vérifier que tous les éléments existent avant de les modifier
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
    
    // Vérifier que tous les éléments existent
    if (!confirmTitle || !confirmCategory || !confirmCountry || !confirmDate || 
        !confirmLocation || !confirmPrice || !confirmSeats || !confirmOrganizer || 
        !confirmDescription || !confirmConditions || !confirmImages) {
        console.error('Some confirmation elements are missing from the DOM');
        alert('An error occurred: missing confirmation elements. Please try again.');
        return;
    }
    
    confirmTitle.textContent = eventData.title || 'Untitled';
    confirmCategory.textContent = eventData.category || 'Uncategorized';
    confirmCountry.textContent = eventData.country || 'Not specified';
    
    var dateEvent = new Date(eventData.date);
    confirmDate.textContent = dateEvent.toLocaleDateString('en-US') + ' at ' + dateEvent.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    confirmLocation.textContent = eventData.location || 'Online';
    confirmPrice.textContent = eventData.price + ' Pi';
    confirmSeats.textContent = eventData.seatsTotal || 0;
    confirmOrganizer.textContent = currentUser.name || currentUser.wallet || 'Unknown';
    confirmDescription.textContent = eventData.description || 'No description';
    confirmConditions.textContent = eventData.conditions || 'No conditions specified';
    
    // Ticket Types
    if (confirmTicketTypes) {
        var types = [];
        if (eventData.ticketTypes?.standard?.enabled) {
            types.push('Standard: ' + eventData.ticketTypes.standard.price + ' Pi');
        }
        if (eventData.ticketTypes?.vip?.enabled) {
            types.push('VIP: ' + eventData.ticketTypes.vip.price + ' Pi');
        }
        confirmTicketTypes.textContent = types.join(' | ') || 'Not specified';
    }
    
    // Duration
    if (confirmDuration) {
        if (eventData.durationValue && eventData.durationUnit) {
            confirmDuration.textContent = eventData.durationValue + ' ' + eventData.durationUnit;
            confirmDuration.style.display = 'block';
        } else {
            confirmDuration.style.display = 'none';
        }
    }
    
    // Images
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