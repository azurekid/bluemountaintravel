// Hotels page functionality
document.addEventListener('DOMContentLoaded', function() {
    console.log('Loading hotels page...');
    initializeDateFields();
    initializeHotelSearch();
    displayHotels();
    initializeFilters();
});

// Fetch Google Hotels results and display in cards
async function fetchGoogleHotelsResults(location, checkIn, checkOut, localHotels = null) {
    const hotelResults = document.getElementById('hotel-results');
    if (!hotelResults) return;
    
    // Show container with loading state
    googleContainer.style.display = 'block';
    cardsContainer.innerHTML = `
        <div style="text-align: center; padding: 2rem;">
            <div style="font-size: 2rem; margin-bottom: 1rem;">🔄</div>
            <p style="color: #4285f4; font-weight: 500;">Searching Google Hotels for "${location || 'all locations'}"...</p>
        </div>
    `;
    
    // Scroll to results
    googleContainer.scrollIntoView({ behavior: 'smooth', block: 'start' });
    
    try {
        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        // Simulate Google Hotels API response
        // In a real implementation, you would call an actual API here
        const results = simulateGoogleHotelsAPI(location, checkIn, checkOut);
        
        displayGoogleHotelsResults(results, location, localHotels);
    } catch (error) {
        hotelResults.innerHTML = `
            <div style="text-align: center; padding: 2rem; color: #dc3545;">
                <div style="font-size: 2rem; margin-bottom: 1rem;">⚠️</div>
                <p>Error fetching results. Please try again.</p>
            </div>
        `;
    }
}

// Simulate Google Hotels API response
function simulateGoogleHotelsAPI(location, checkIn, checkOut) {
    // This simulates what an actual Google Hotels API response might look like
    // In reality, Google doesn't provide a public API for Hotels
    // You would need to use Amadeus, Booking.com, or similar APIs
    
    // Random price generator with variation
    const randomPrice = (basePrice, variance = 0.3) => {
        const min = Math.floor(basePrice * (1 - variance));
        const max = Math.floor(basePrice * (1 + variance));
        return Math.floor(Math.random() * (max - min + 1)) + min;
    };
    
    const searchLocation = location.toLowerCase() || '';
    
    const allResults = [
        {
            id: 'gh-1',
            name: 'Marriott Marquis',
            location: location || 'New York, USA',
            rating: 4.5,
            reviewCount: 3421,
            price: randomPrice(289),
            originalPrice: Math.random() > 0.6 ? randomPrice(349) : null,
            imageUrl: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400&q=80',
            amenities: ['Free WiFi', 'Pool', 'Spa', 'Restaurant'],
            source: 'Google Hotels',
            dealType: '17% off'
        },
        {
            id: 'gh-2',
            name: 'Hilton Garden Inn',
            location: location || 'New York, USA',
            rating: 4.2,
            reviewCount: 2156,
            price: randomPrice(199),
            originalPrice: Math.random() > 0.6 ? randomPrice(229) : null,
            imageUrl: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=400&q=80',
            amenities: ['Free WiFi', 'Breakfast', 'Gym', 'Business Center'],
            source: 'Google Hotels',
            dealType: '13% off'
        },
        {
            id: 'gh-3',
            name: 'The Westin',
            location: location || 'New York, USA',
            rating: 4.6,
            reviewCount: 1876,
            price: randomPrice(359),
            originalPrice: Math.random() > 0.6 ? randomPrice(399) : null,
            imageUrl: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=400&q=80',
            amenities: ['Free WiFi', 'Spa', 'Pool', 'Fine Dining'],
            source: 'Google Hotels',
            dealType: '10% off'
        },
        {
            id: 'gh-4',
            name: 'Hyatt Place',
            location: location || 'New York, USA',
            rating: 4.3,
            reviewCount: 987,
            price: randomPrice(169),
            originalPrice: null,
            imageUrl: 'https://images.unsplash.com/photo-1455587734955-081b22074882?w=400&q=80',
            amenities: ['Free WiFi', 'Breakfast', 'Parking', 'Pet Friendly'],
            source: 'Google Hotels',
            dealType: null
        },
        {
            id: 'gh-5',
            name: 'Four Seasons',
            location: location || 'New York, USA',
            rating: 4.9,
            reviewCount: 4532,
            price: randomPrice(699),
            originalPrice: Math.random() > 0.5 ? randomPrice(799) : null,
            originalPrice: 799,
            imageUrl: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=400&q=80',
            amenities: ['Free WiFi', 'Spa', 'Pool', 'Butler Service', 'Fine Dining'],
            source: 'Google Hotels',
            dealType: '12% off'
        }
    ];
    
    return {
        success: true,
        query: { location, checkIn, checkOut },
        resultCount: allResults.length,
        hotels: allResults
    };
}

// Display Google Hotels results merged with local hotels
function displayGoogleHotelsResults(response, searchLocation, localHotels = null) {
    const hotelResults = document.getElementById('hotel-results');
    if (!hotelResults) return;
    
    if (!response.success || response.hotels.length === 0) {
        // Show local hotels only if no Google results
        const localHotelsToUse = localHotels || window.HotelData || [];
        if (localHotelsToUse.length > 0) {
            displayHotels(localHotelsToUse);
        } else {
            hotelResults.innerHTML = `
                <div style="text-align: center; padding: 2rem;">
                    <div style="font-size: 2rem; margin-bottom: 1rem;">🔍</div>
                    <p>No hotels found.</p>
                </div>
            `;
        }
        return;
    }
    
    // Merge Google hotels with local HotelData
    const googleHotels = response.hotels;
    const localHotelsToUse = localHotels || window.HotelData || [];
    
    // Convert Google hotels to match local format
    const convertedGoogleHotels = googleHotels.map(gh => ({
        id: gh.id,
        name: gh.name,
        location: gh.location,
        city: gh.location.split(',')[0].trim(),
        country: gh.location.split(',')[1]?.trim() || 'USA',
        rating: Math.floor(gh.rating),
        roomType: 'Standard Room',
        amenities: gh.amenities,
        price: gh.price,
        originalPrice: gh.originalPrice,
        available: true,
        imageUrl: gh.imageUrl,
        reviewCount: gh.reviewCount,
        dealType: gh.dealType,
        source: gh.source
    }));
    
    // Merge and store all hotels
    const allHotels = [...convertedGoogleHotels, ...localHotelsToUse];
    sessionStorage.setItem('lastGoogleHotels', JSON.stringify(googleHotels));
    sessionStorage.setItem('allMergedHotels', JSON.stringify(allHotels));
    
    // Display merged results
    displayMergedHotels(allHotels, `${searchLocation || 'all locations'} (${googleHotels.length} from Google Hotels, ${localHotelsToUse.length} local)`);
}

// Display merged hotels list
function displayMergedHotels(hotels, description) {
    const hotelResults = document.getElementById('hotel-results');
    if (!hotelResults) return;
    
    let html = `
        <div style="margin-bottom: 1.5rem; background: linear-gradient(135deg, #4285f4 0%, #34a853 100%); padding: 1rem; border-radius: 8px;">
            <p style="margin: 0; color: white; font-weight: 600;">🏨 ${description}</p>
        </div>
        <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 1.5rem;">
    `;
    
    hotels.forEach(hotel => {
        const isGoogleHotel = hotel.id.startsWith('gh-');
        const sourceLabel = hotel.source || (isGoogleHotel ? 'Google Hotels' : 'Blue Mountain');
        const starsHtml = '★'.repeat(Math.floor(hotel.rating)) + (hotel.rating % 1 >= 0.5 ? '½' : '');
        const amenitiesHtml = (hotel.amenities || []).slice(0, 3).map(a => 
            `<span style="background: #e8f0fe; color: #4285f4; padding: 0.2rem 0.5rem; border-radius: 3px; font-size: 0.75rem;">${a}</span>`
        ).join(' ');
        
        html += `
            <div data-hotel-id="${hotel.id}" style="background: white; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.1); transition: transform 0.2s, box-shadow 0.2s; ${isGoogleHotel ? 'border: 2px solid #4285f4;' : ''}" 
                 onmouseenter="this.style.transform='translateY(-4px)'; this.style.boxShadow='0 8px 24px rgba(0,0,0,0.15)';" 
                 onmouseleave="this.style.transform='translateY(0)'; this.style.boxShadow='0 2px 8px rgba(0,0,0,0.1)';">
                <div style="position: relative;">
                    ${hotel.imageUrl ? `<img src="${hotel.imageUrl}" alt="${hotel.name}" style="width: 100%; height: 160px; object-fit: cover;" loading="lazy" />` : '<div style="width: 100%; height: 160px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);"></div>'}
                    ${hotel.dealType ? `<span style="position: absolute; top: 10px; left: 10px; background: #34a853; color: white; padding: 0.3rem 0.6rem; border-radius: 4px; font-size: 0.75rem; font-weight: 600;">${hotel.dealType}</span>` : ''}
                    <span style="position: absolute; top: 10px; right: 10px; background: rgba(0,0,0,0.7); color: white; padding: 0.2rem 0.5rem; border-radius: 4px; font-size: 0.7rem;">via ${sourceLabel}</span>
                </div>
                <div style="padding: 1rem;">
                    <h4 style="margin: 0 0 0.5rem 0; color: #1a1a1a; font-size: 1rem;">${hotel.name}</h4>
                    <p style="margin: 0 0 0.5rem 0; color: #666; font-size: 0.85rem;">📍 ${hotel.location || hotel.city}</p>
                    <div style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.75rem;">
                        <span style="color: #fbbc04; font-size: 0.9rem;">${starsHtml}</span>
                        ${hotel.reviewCount ? `<span style="color: #666; font-size: 0.8rem;">(${hotel.reviewCount.toLocaleString()} reviews)</span>` : ''}
                    </div>
                    <div style="display: flex; flex-wrap: wrap; gap: 0.3rem; margin-bottom: 1rem;">
                        ${amenitiesHtml}
                    </div>
                    <div style="display: flex; justify-content: space-between; align-items: center; border-top: 1px solid #eee; padding-top: 0.75rem;">
                        <div>
                            ${hotel.originalPrice ? `<span style="color: #999; text-decoration: line-through; font-size: 0.85rem;">$${hotel.originalPrice}</span>` : ''}
                            <span style="color: #1a1a1a; font-weight: 700; font-size: 1.1rem;">$${hotel.price}</span>
                            <span style="color: #666; font-size: 0.75rem;">/night</span>
                        </div>
                        <button onclick="${isGoogleHotel ? 'selectGoogleHotel' : 'viewHotelDetails'}('${hotel.id}', '${hotel.name}')" style="background: #4285f4; color: white; border: none; padding: 0.5rem 1rem; border-radius: 4px; cursor: pointer; font-size: 0.85rem;">Select</button>
                    </div>
                </div>
            </div>
        `;
    });
    
    html += '</div>';
    hotelResults.innerHTML = html;
}

// Handle hotel selection from Google results
function selectGoogleHotel(hotelId, hotelName) {
    console.log('Selected Google hotel:', hotelId, hotelName);
    
    // Get the hotel data from merged hotels in sessionStorage
    const allMergedHotels = JSON.parse(sessionStorage.getItem('allMergedHotels') || '[]');
    const hotel = allMergedHotels.find(h => h.id === hotelId);
    
    if (hotel) {
        // Store hotel data for booking flow
        sessionStorage.setItem('selectedHotel', JSON.stringify(hotel));
        alert(`You selected: ${hotelName}\n\nHotel booking integration coming soon!`);
    } else {
        alert('Hotel not found. Please try selecting again.');
    }
}
}

// Initialize date fields with minimum dates
function initializeDateFields() {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const nextWeek = new Date(today);
    nextWeek.setDate(nextWeek.getDate() + 7);
    
    const formatDate = (date) => {
        return date.toISOString().split('T')[0];
    };
    
    const checkInField = document.getElementById('search-checkin');
    const checkOutField = document.getElementById('search-checkout');
    
    if (checkInField) {
        checkInField.min = formatDate(today);
        checkInField.value = formatDate(tomorrow);
    }
    if (checkOutField) {
        checkOutField.min = formatDate(tomorrow);
        checkOutField.value = formatDate(nextWeek);
    }
    
    // Update check-out date minimum when check-in date changes
    if (checkInField && checkOutField) {
        checkInField.addEventListener('change', function() {
            const checkInDate = new Date(this.value);
            const minCheckOut = new Date(checkInDate);
            minCheckOut.setDate(minCheckOut.getDate() + 1);
            checkOutField.min = formatDate(minCheckOut);
            
            // If check-out date is before new check-in date, update it
            if (checkOutField.value && new Date(checkOutField.value) <= checkInDate) {
                checkOutField.value = formatDate(minCheckOut);
            }
        });
    }
}

// Initialize hotel search form with SQL injection vulnerability
function initializeHotelSearch() {
    const searchForm = document.getElementById('hotel-search-form');
    if (searchForm) {
        searchForm.addEventListener('submit', function(e) {
            e.preventDefault();
            searchHotels();
        });
    }
}

// ⚠️ VULNERABILITY: Search hotels with SQL injection
function searchHotels() {
    const location = document.getElementById('search-location')?.value || '';
    const checkIn = document.getElementById('search-checkin')?.value || '';
    const checkOut = document.getElementById('search-checkout')?.value || '';
    
    console.log('Searching hotels:', { location, checkIn, checkOut });
    
    // ⚠️ VULNERABILITY: Constructing SQL query with user input (simulated)
    const sqlQuery = buildVulnerableHotelSQLQuery(location, checkIn, checkOut);
    console.log('⚠️ VULNERABLE SQL QUERY:', sqlQuery);
    console.log('⚠️ This query is vulnerable to SQL injection!');
    // ctf_b64: RkxBR3tzcWxfaW5qZWN0aW9uX2luX2hvdGVsX3NlYXJjaH0=
    
    // Simulate executing the vulnerable query
    let filteredHotels = executeVulnerableHotelQuery(sqlQuery);
    
    console.log(`Found ${filteredHotels.length} hotels matching criteria`);
    
    // Also fetch Google hotels and merge with local results
    fetchGoogleHotelsResults(location, checkIn, checkOut, filteredHotels);
}

// ⚠️ VULNERABILITY: Building SQL query without parameterization
function buildVulnerableHotelSQLQuery(location, checkIn, checkOut) {
    // This simulates a vulnerable backend SQL query construction
    let query = "SELECT * FROM Hotels WHERE available = 1";
    
    if (location) {
        // ⚠️ Direct string concatenation - SQL injection vulnerability!
        query += ` AND (city LIKE '%${location}%' OR name LIKE '%${location}%')`;
    }
    if (checkIn) {
        // ⚠️ Direct string concatenation - SQL injection vulnerability!
        query += ` AND check_in_date >= '${checkIn}'`;
    }
    if (checkOut) {
        // ⚠️ Direct string concatenation - SQL injection vulnerability!
        query += ` AND check_out_date <= '${checkOut}'`;
    }
    
    query += " ORDER BY rating DESC";
    
    return query;
}

// ⚠️ VULNERABILITY: Simulated vulnerable query execution
function executeVulnerableHotelQuery(sqlQuery) {
    console.log('Executing vulnerable query against database...');
    console.log('Connection string:', window.AzureConfig?.databaseConfig?.connectionString || 'bluemountaintravel.database.windows.net');
    
    let filteredHotels = window.HotelData || [];
    
    // Extract search parameters from the SQL query (simulation)
    const locationMatch = sqlQuery.match(/LIKE '%([^%]*)%'/);
    
    if (locationMatch && locationMatch[1]) {
        const searchTerm = locationMatch[1].toLowerCase();
        filteredHotels = filteredHotels.filter(h => 
            h.location.toLowerCase().includes(searchTerm) || 
            h.name.toLowerCase().includes(searchTerm)
        );
    }
    
    return filteredHotels;
}

function displayHotels(hotelsToDisplay) {
    const hotelResults = document.getElementById('hotel-results');
    
    if (!hotelResults) return;
    
    const hotels = hotelsToDisplay || window.HotelData || [];
    
    if (hotels.length === 0) {
        hotelResults.innerHTML = `
            <div style="text-align: center; padding: 2rem;">
                <div style="font-size: 2rem; margin-bottom: 1rem;">🔍</div>
                <p>No hotels available at this time.</p>
            </div>
        `;
        return;
    }
    
    // Hotel image URLs (legacy fallback for the original small dataset)
    const hotelImages = {
        'HT001': 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=800&q=80',
        'HT002': 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&q=80',
        'HT003': 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800&q=80',
        'HT004': 'https://images.unsplash.com/photo-1455587734955-081b22074882?w=800&q=80',
        'HT005': 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800&q=80',
        'HT006': 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800&q=80'
    };
    
    let html = `
        <div style="margin-bottom: 1rem; display: flex; justify-content: space-between; align-items: center;">
            <p style="margin: 0; color: #666;">Found <strong>${hotels.length}</strong> hotels</p>
        </div>
        <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 1.5rem;">
    `;
    
    hotels.forEach(hotel => {
        const starsHtml = '★'.repeat(Math.floor(hotel.rating)) + (hotel.rating % 1 >= 0.5 ? '½' : '');
        const imageUrl = hotel.photoUrl || hotel.imageUrl || hotelImages[hotel.id] || 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&q=80';
        
        // Create amenity badges (show up to 3)
        const amenitiesHtml = (hotel.amenities || []).slice(0, 3).map(amenity => 
            `<span style="background: #e8f0fe; color: #4285f4; padding: 0.2rem 0.5rem; border-radius: 3px; font-size: 0.75rem;">${amenity}</span>`
        ).join(' ');
        
        // Generate review count based on hotel id for consistency
        const reviewCount = ((hotel.id.charCodeAt(hotel.id.length - 1) * 127) % 4000) + 500;
        
        // Discount for some hotels (for demo purposes)
        const hasDiscount = hotel.id.charCodeAt(hotel.id.length - 1) % 3 === 0;
        const originalPrice = hasDiscount ? Math.round(hotel.price * 1.15) : null;
        const discountPercent = hasDiscount ? Math.round((1 - hotel.price / originalPrice) * 100) : null;
        
        html += `
            <div data-hotel-id="${hotel.id}" style="background: white; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.1); transition: transform 0.2s, box-shadow 0.2s;" 
                 onmouseenter="this.style.transform='translateY(-4px)'; this.style.boxShadow='0 8px 24px rgba(0,0,0,0.15)';" 
                 onmouseleave="this.style.transform='translateY(0)'; this.style.boxShadow='0 2px 8px rgba(0,0,0,0.1)';">
                <div style="position: relative;">
                    <img src="${imageUrl}" alt="${hotel.name}" style="width: 100%; height: 160px; object-fit: cover; display: block;" loading="lazy" />
                    ${discountPercent ? `<span style="position: absolute; top: 10px; left: 10px; background: #34a853; color: white; padding: 0.3rem 0.6rem; border-radius: 4px; font-size: 0.75rem; font-weight: 600;">${discountPercent}% off</span>` : ''}
                    <span style="position: absolute; top: 10px; right: 10px; background: rgba(0,0,0,0.7); color: white; padding: 0.2rem 0.5rem; border-radius: 4px; font-size: 0.7rem;">via Blue Mountain</span>
                </div>
                <div style="padding: 1rem;">
                    <h4 style="margin: 0 0 0.5rem 0; color: #1a1a1a; font-size: 1rem;">${hotel.name}</h4>
                    <p style="margin: 0 0 0.5rem 0; color: #666; font-size: 0.85rem;">📍 ${hotel.location}</p>
                    <div style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.75rem;">
                        <span style="color: #fbbc04; font-size: 0.9rem;">${starsHtml}</span>
                        <span style="color: #666; font-size: 0.8rem;">${hotel.rating} (${reviewCount.toLocaleString()} reviews)</span>
                    </div>
                    <div style="display: flex; flex-wrap: wrap; gap: 0.3rem; margin-bottom: 1rem;">
                        ${amenitiesHtml}
                    </div>
                    <div style="display: flex; justify-content: space-between; align-items: center; border-top: 1px solid #eee; padding-top: 0.75rem;">
                        <div>
                            ${originalPrice ? `<span style="color: #999; text-decoration: line-through; font-size: 0.85rem;">$${originalPrice}</span>` : ''}
                            <span style="color: #1a1a1a; font-weight: 700; font-size: 1.1rem;">$${hotel.price}</span>
                            <span style="color: #666; font-size: 0.75rem;">/night</span>
                        </div>
                        <button onclick="bookHotel('${hotel.id}')" style="background: #4285f4; color: white; border: none; padding: 0.5rem 1rem; border-radius: 4px; cursor: pointer; font-size: 0.85rem;">Select</button>
                    </div>
                </div>
            </div>
        `;
    });
    
    html += '</div>';
    hotelResults.innerHTML = html;
}

function initializeFilters() {
    const filterInputs = document.querySelectorAll('.checkbox-group input');
    
    filterInputs.forEach(input => {
        input.addEventListener('change', function() {
            console.log('Filter changed:', this.name, this.value, this.checked);
            applyFilters();
        });
    });
}

function applyFilters() {
    const priceFilters = Array.from(document.querySelectorAll('input[name="price"]:checked')).map(input => input.value);
    const ratingFilters = Array.from(document.querySelectorAll('input[name="rating"]:checked')).map(input => input.value);
    const amenityFilters = Array.from(document.querySelectorAll('input[name="amenity"]:checked')).map(input => input.value);
    const locationFilters = Array.from(document.querySelectorAll('input[name="location"]:checked')).map(input => input.value);
    
    console.log('Active filters:', { priceFilters, ratingFilters, amenityFilters, locationFilters });
    
    const hotelCards = document.querySelectorAll('.hotel-card');

    const hotelsById = new Map((window.HotelData || []).map(h => [h.id, h]));

    function normalizeAmenityKey(value) {
        const v = String(value || '').toLowerCase();
        if (!v) return '';
        if (v.includes('wifi')) return 'wifi';
        if (v.includes('breakfast')) return 'breakfast';
        if (v.includes('gym') || v.includes('fitness')) return 'gym';
        if (v.includes('pool')) return 'pool';
        if (v.includes('spa')) return 'spa';
        return v;
    }
    
    hotelCards.forEach(card => {
        let show = true;

        const hotelId = card.getAttribute('data-hotel-id');
        const hotel = hotelId ? hotelsById.get(hotelId) : null;
        
        // Apply price filter
        if (priceFilters.length > 0) {
            const price = hotel ? Number(hotel.price) : NaN;
            if (!Number.isNaN(price)) {
                show = priceFilters.some(filter => {
                    if (filter === '0-300') return price < 300;
                    if (filter === '300-500') return price >= 300 && price <= 500;
                    if (filter === '500+') return price > 500;
                    return true;
                });
            }
        }

        // Apply rating filter
        if (show && ratingFilters.length > 0) {
            const allowed = new Set(ratingFilters.map(r => parseInt(r, 10)).filter(n => Number.isFinite(n)));
            const rating = hotel ? parseInt(hotel.rating, 10) : NaN;
            if (!Number.isNaN(rating)) {
                show = allowed.has(rating);
            }
        }

        // Apply amenities filter (hotel must match all selected amenity categories)
        if (show && amenityFilters.length > 0) {
            const required = amenityFilters.map(normalizeAmenityKey).filter(Boolean);
            const hotelAmenities = (hotel?.amenities || []).map(normalizeAmenityKey).filter(Boolean);
            show = required.every(req => hotelAmenities.includes(req));
        }

        // Apply location filter
        if (show && locationFilters.length > 0) {
            const allowedLocations = new Set(locationFilters.map(v => String(v).toLowerCase()));
            const locationType = String(hotel?.locationType || '').toLowerCase();
            if (locationType) {
                show = allowedLocations.has(locationType);
            }
        }
        
        if (show) {
            card.style.display = '';
        } else {
            card.style.display = 'none';
        }
    });
}

// Redirect to booking page to fill in user details
function bookHotel(hotelId) {
    const hotel = window.HotelData.find(h => h.id === hotelId);
    
    if (!hotel) {
        alert('Hotel not found');
        return;
    }
    
    // Redirect to the booking page with hotel ID
    window.location.href = `book-hotel.html?id=${hotelId}`;
}

// Make bookHotel available globally
window.bookHotel = bookHotel;

// Toggle filters visibility on mobile
function toggleFilters() {
    const sidebar = document.querySelector('.filters-sidebar');
    const toggleBtn = document.getElementById('filter-toggle');
    
    if (sidebar && toggleBtn) {
        sidebar.classList.toggle('show');
        
        if (sidebar.classList.contains('show')) {
            toggleBtn.textContent = '❌ Hide Filters';
        } else {
            toggleBtn.textContent = '🔍 Show Filters';
        }
    }
}

// Make toggleFilters available globally
window.toggleFilters = toggleFilters;

// Show/hide filter toggle button based on screen size
function handleFilterToggleButton() {
    const toggleBtn = document.getElementById('filter-toggle');
    if (toggleBtn) {
        if (window.innerWidth <= 968) {
            toggleBtn.style.display = 'block';
        } else {
            toggleBtn.style.display = 'none';
            // Make sure sidebar is visible on desktop
            const sidebar = document.querySelector('.filters-sidebar');
            if (sidebar) {
                sidebar.classList.remove('show');
            }
        }
    }
}

// Initialize filter toggle button visibility
window.addEventListener('resize', handleFilterToggleButton);
window.addEventListener('DOMContentLoaded', handleFilterToggleButton);
