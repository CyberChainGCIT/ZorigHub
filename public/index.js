let turfs = [];
let bookings = [];

async function loadTurfs() {
    try {
        const response = await fetch('http://localhost:5000/api/turfs');
        if (!response.ok) throw new Error('Failed to fetch turfs');
        turfs = await response.json();
        // console.log(turfs);
        renderTurfs(turfs);
    } catch (error) {
        console.error(error);
        turfContainer.innerHTML = `<p class="text-red-500">Unable to load turfs.</p>`;
    }
}

async function loadBookings() {
    try {
        const response = await fetch('http://localhost:5000/api/bookings');
        if (!response.ok) throw new Error('Failed to fetch bookings');
        bookings = await response.json();
        // console.log(bookings);
        renderBookings(bookings);
    } catch (error) {
        console.error(error);
        upcomingBookingsContainer.innerHTML = `<p class="text-red-500">Unable to load bookings.</p>`;
    }
}

// DOM elements
const turfContainer = document.getElementById('turf-container');
const locationFilter = document.getElementById('location-filter');
const bookingFilter = document.getElementById('booking-filter');
const upcomingBookingsContainer = document.getElementById('upcoming-bookings');
const pastBookingsContainer = document.getElementById('past-bookings');
const cancelledBookingsContainer = document.getElementById('cancelled-bookings');
const turfModal = document.getElementById('turf-modal');
const closeModal = document.getElementById('close-modal');
const bookingDate = document.getElementById('booking-date');
const timeSlots = document.getElementById('time-slots');
const confirmBooking = document.getElementById('confirm-booking');
const mobileMenuButton = document.getElementById('mobile-menu-button');
const mobileMenu = document.getElementById('mobile-menu');
const navLinks = document.querySelectorAll('.nav-link');

// Current selected turf and time slot
let selectedTurf = null;
let selectedTimeSlot = null;
let selectedStart = null;
let selectedEnd = null;

// Initialize the app
document.addEventListener('DOMContentLoaded', function () {
    // Set minimum date for booking (today)
    const today = new Date();
    const dd = String(today.getDate()).padStart(2, '0');
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const yyyy = today.getFullYear();
    const minDate = yyyy + '-' + mm + '-' + dd;
    bookingDate.min = minDate;
    bookingDate.value = minDate;

    loadTurfs().then(() => loadBookings())

    // Event listeners
    locationFilter.addEventListener('change', filterTurfs);
    bookingFilter.addEventListener('change', filterBookings);
    closeModal.addEventListener('click', closeTurfModal);
    bookingDate.addEventListener('change', generateTimeSlots);
    confirmBooking.addEventListener('click', createBooking);
    mobileMenuButton.addEventListener('click', toggleMobileMenu);

    // Navigation links
    navLinks.forEach(link => {
        link.addEventListener('click', function (e) {
            e.preventDefault();
            const page = this.getAttribute('data-page');
            showPage(page);

            // Update active state
            navLinks.forEach(l => l.classList.remove('active'));
            this.classList.add('active');

            // Close mobile menu if open
            mobileMenu.classList.add('hidden');
        });
    });
});

// Render turfs
function renderTurfs(turfsToRender) {
    turfContainer.innerHTML = '';

    turfsToRender.forEach(turf => {
        const turfCard = document.createElement('div');
        turfCard.className = 'turf-card bg-white rounded-lg shadow-md overflow-hidden';
        turfCard.innerHTML = `
                    <img src="${turf.photo}" alt="${turf.name}" class="w-full h-48 object-cover">
                    <div class="p-4">
                        <div class="flex justify-between items-start mb-2">
                            <h3 class="text-xl font-bold text-gray-800">${turf.name}</h3>
                            <span class="bg-green-100 text-green-800 text-xs font-semibold px-2.5 py-0.5 rounded flex items-center">
                                <i class="fas fa-star text-yellow-500 mr-1"></i> ${turf.averageRating}
                            </span>
                        </div>
                        <p class="text-gray-600 mb-3"><i class="fas fa-map-marker-alt text-[#0B4F6C] mr-2"></i>${formatLocation(turf.location)}</p>
                        <p class="text-gray-800 font-semibold mb-4">Price per hour: Nu.${turf.pricePerHour}</p>
                        <button class="w-full bg-[#0B4F6C] hover:bg-[#04374C] text-white font-medium py-2 px-4 rounded view-turf-btn" data-turf-id="${turf._id}">
                            View & Book
                        </button>
                    </div>
                `;
        turfContainer.appendChild(turfCard);
    });

    // Add event listeners to view buttons
    document.querySelectorAll('.view-turf-btn').forEach(button => {
        button.addEventListener('click', function () {
            const turfId = this.getAttribute('data-turf-id');
            openTurfModal(turfId);
        });
    });
}

// Filter turfs by location
function filterTurfs() {
    const location = locationFilter.value;
    if (location === 'all') {
        renderTurfs(turfs);
    } else {
        const filteredTurfs = turfs.filter(turf =>
            turf.location.split(',').pop().trim().toLowerCase() === location.toLowerCase()
        );
        renderTurfs(filteredTurfs);
    }
}

// Format location for display
function formatLocation(location) {
    const locations = {
        'bumtang': 'Bumthang',
        'chukha': 'Chukha',
        'dagana': 'Dagana',
        'gasa': 'Gasa',
        'haa': 'Haa',
        'lhuentse': 'Lhuentse',
        'mongar': 'Mongar',
        'paro': 'Paro',
        'pemagatshel': 'Pemagatshel',
        'punakha': 'Punakha',
        'samdrupjongkhar': 'Samdrup Jongkhar',
        'samtse': 'Samtse',
        'sarpang': 'Sarpang',
        'thimphu': 'Thimphu',
        'trashigang': 'Trashigang',
        'trashiyangtse': 'Trashiyangtse',
        ' Trongsa': 'Trongsa',
        'tsirang': 'Tsirang',
        'wangduephodrang': 'Wangdue Phodrang',
        'zhemgang': 'Zhemgang'
    };
    return locations[location] || location;
}

// Open turf modal
function openTurfModal(turfId) {
    selectedTurf = turfs.find(turf => turf._id === turfId);
    // console.log(selectedTurf);

    if (selectedTurf) {
        document.getElementById('modal-turf-name').textContent = selectedTurf.name;
        document.getElementById('modal-turf-image').src = selectedTurf.photo;
        document.getElementById('modal-turf-image').alt = selectedTurf.name;
        document.getElementById('modal-turf-description').textContent = selectedTurf.description;

        // Generate time slots for today
        generateTimeSlots();

        // Show modal
        turfModal.classList.remove('hidden');
        document.body.style.overflow = 'hidden';
    }
}

// Close turf modal
function closeTurfModal() {
    turfModal.classList.add('hidden');
    document.body.style.overflow = 'auto';
    selectedTurf = null;
    selectedTimeSlot = null;
}

function generateTimeSlots() {
    if (!selectedTurf) return;

    const date = bookingDate.value;
    timeSlots.innerHTML = '';
    selectedStart = null;
    selectedEnd = null;
    confirmBooking.disabled = true;

    // Build a set of booked slots for this turf on this date
    const bookingsOnDay = bookings.filter(b =>
        (typeof b.turf === 'object' ? b.turf._id : b.turf) === selectedTurf._id &&
        new Date(b.date).toISOString().slice(0, 10) === date
    );

    // Helper to check if a slot is booked
    function isSlotBooked(slotTime) {
        return bookingsOnDay.some(b => {
            // slotTime, b.startTime, b.endTime all “HH:MM”
            return slotTime >= b.startTime && slotTime < b.endTime;
        });
    }

    // Helper to update highlights after selection
    function updateSelectionHighlights() {
        document.querySelectorAll('.time-slot').forEach(slot => {
            const t = slot.dataset.time;
            slot.classList.remove('selected-range', 'start', 'end');

            if (selectedStart && selectedEnd) {
                // compute min/max
                const [sH, sM] = selectedStart.split(':').map(Number);
                const [eH, eM] = selectedEnd.split(':').map(Number);
                const startValue = sH * 60 + sM;
                const endValue = eH * 60 + eM;
                const [low, high] = startValue <= endValue
                    ? [startValue, endValue]
                    : [endValue, startValue];

                const [tH, tM] = t.split(':').map(Number);
                const tValue = tH * 60 + tM;

                if (tValue === startValue) slot.classList.add('start');
                if (tValue === endValue) slot.classList.add('end');
                if (tValue >= low && tValue <= high) slot.classList.add('selected-range');
            } else if (selectedStart) {
                if (t === selectedStart) slot.classList.add('start');
            }
        });
    }

    // Generate time slots
    for (let hour = 8; hour <= 22; hour++) {
        const time = `${hour.toString().padStart(2, '0')}:00`;
        const booked = isSlotBooked(time);

        const slot = document.createElement('div');
        slot.className = `time-slot p-2 text-center rounded border ${booked ? 'booked' : 'cursor-pointer hover:bg-blue-100'}`;
        slot.textContent = time;
        slot.dataset.time = time;

        if (!booked) {
            slot.addEventListener('click', () => {
                // If no start, pick it
                if (!selectedStart) {
                    selectedStart = time;
                }
                // If start exists but no end, pick end (and enable confirm)
                else if (!selectedEnd) {
                    selectedEnd = time;
                    confirmBooking.disabled = false;
                }
                // If both picked, reset selection
                else {
                    selectedStart = time;
                    selectedEnd = null;
                    confirmBooking.disabled = true;
                }
                updateSelectionHighlights();
            });
        }

        timeSlots.appendChild(slot);
    }
}

const jwt = document.cookie
    .split('; ')
    .find(row => row.startsWith('token='))
    ?.split('=')[1];
let userDetails;

if (!jwt) {
    console.error('No token in storage');
} else {
    // console.log(jwt);
    const payloadBase64 = jwt.split('.')[1];
    const payloadJson = atob(payloadBase64.replace(/-/g, '+').replace(/_/g, '/'));
    userDetails = JSON.parse(payloadJson);
}


// Create a new booking
function createBooking() {
    if (!selectedTurf || !bookingDate.value) return;

    const date = bookingDate.value;
    const formattedDate = new Date(date).toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
    // Create new booking
    const newBooking = {
        turf: selectedTurf._id,
        user: userDetails.id,
        date: date,
        startTime: selectedStart,
        endTime: selectedEnd,
        price: selectedTurf.pricePerHour * (parseInt(selectedEnd) - parseInt(selectedStart)),
        status: "confirmed",
    };
    console.log(newBooking);
    // Show success message
    alert(`Booking confirmed for ${selectedTurf.name} on ${formattedDate} from ${selectedStart} to ${selectedEnd}`);

    registerBooking(newBooking)

    // Update UI
    renderBookings();
    closeTurfModal();

}

async function registerBooking(booking) {
    try {
        const res = await fetch('http://localhost:5000/api/bookings', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(booking)
        });
        const data = await res.json();
        console.log('Server response:', data);
        alert(`Booking created!`);
    } catch (err) {
        console.error(err);
        alert('Failed to register bookings: ' + err.message);
    }
}

// Render bookings
function renderBookings() {
    // Clear existing bookings
    upcomingBookingsContainer.innerHTML = '';
    pastBookingsContainer.innerHTML = '';
    cancelledBookingsContainer.innerHTML = '';

    // Get today's date for comparison
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Separate upcoming and past bookings
    const upcomingBookings = bookings.filter(booking => {
        return booking.status === 'confirmed';
    });

    const cancelledBookings = bookings.filter(booking => {
        return booking.status === 'cancelled';
    });

    const pastBookings = bookings.filter(booking => {
        return booking.status === 'completed';
    });


    // Render upcoming bookings
    if (upcomingBookings.length > 0) {
        upcomingBookings.forEach(booking => {
            const bookingCard = createBookingCard(booking);
            upcomingBookingsContainer.appendChild(bookingCard);
        });
    } else {
        upcomingBookingsContainer.innerHTML = `
                    <div class="text-center py-8 text-gray-500">
                        <i class="fas fa-calendar-check text-4xl mb-2"></i>
                        <p>No upcoming bookings found</p>
                    </div>
                `;
    }

    // Render past bookings
    if (pastBookings.length > 0) {
        pastBookings.forEach(booking => {
            const bookingCard = createBookingCard(booking);
            pastBookingsContainer.appendChild(bookingCard);
        });
    } else {
        pastBookingsContainer.innerHTML = `
                    <div class="text-center py-8 text-gray-500">
                        <i class="fas fa-history text-4xl mb-2"></i>
                        <p>No past bookings found</p>
                    </div>
                `;
    }

    // Render cancelled bookings
    if (cancelledBookings.length > 0) {
        cancelledBookings.forEach(booking => {
            const bookingCard = createBookingCard(booking);
            cancelledBookingsContainer.appendChild(bookingCard);
        });
    } else {
        cancelledBookingsContainer.innerHTML = `
                    <div class="text-center py-8 text-gray-500">
                        <i class="fas fa-history text-4xl mb-2"></i>
                        <p>No cancelled bookings found</p>
                    </div>
                `;
    }
}

// Create booking card element
function createBookingCard(booking) {
    const turfDetails = turfs.find(t => t._id === booking.turf._id) || {};

    const card = document.createElement('div');
    card.className = 'booking-card p-4 hover:bg-gray-50';

    let statusBadge = '';
    if (booking.status === 'confirmed') {
        statusBadge = '<span class="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded">Confirmed</span>';
    } else if (booking.status === 'completed') {
        statusBadge = '<span class="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded">Completed</span>';
    } else if (booking.status === 'cancelled') {
        statusBadge = '<span class="bg-red-100 text-red-800 text-xs font-medium px-2.5 py-0.5 rounded">Cancelled</span>';
    }

    const formattedDate = new Date(booking.date).toLocaleDateString('en-US', {
        dateStyle: 'medium'
    });

    card.innerHTML = `
                <div class="flex items-start space-x-4">
                    <img src="${turfDetails.photo}" alt="${turfDetails.name}" class="w-20 h-20 object-cover rounded">
                    <div class="flex-1">
                        <div class="flex justify-between items-start">
                            <h3 class="font-bold text-lg">${turfDetails.name}</h3>
                            ${statusBadge}
                        </div>
                        <div class="mt-1 text-sm text-gray-600">
                            <p><i class="far fa-calendar-alt mr-2"></i>${formattedDate}</p>
                            <p><i class="far fa-clock mr-2"></i>${booking.startTime}</p>
                            <p><i class="far fa-clock mr-2"></i>${booking.endTime}</p>
                        </div>
                    </div>
                </div>
                <div class="mt-3 flex justify-between items-center">
                    <span class="font-semibold">Total Cost: Nu.${booking.price * (parseInt(booking.endTime) - parseInt(booking.startTime))}</span>
                    <div class="space-x-2">
                        ${booking.status === 'confirmed' ?
            '<button class="text-red-600 hover:text-red-800 text-sm font-medium cancel-booking-btn" data-booking-id="' + booking._id + '">Cancel</button>' : ''}
                        <button class="text-blue-600 hover:text-blue-800 text-sm font-medium view-turf-btn" data-turf-id="${booking.turfId}">View Turf</button>
                    </div>
                </div>
            `;

    // Add event listeners
    if (booking.status === 'confirmed') {
        card.querySelector('.cancel-booking-btn').addEventListener('click', function () {
            const bookingId = this.getAttribute('data-booking-id');
            cancelBooking(bookingId);
        });
    }

    card.querySelector('.view-turf-btn').addEventListener('click', function () {
        const turfId = this.getAttribute('data-turf-id');
        showPage('turfs');
        openTurfModal(turfId);
    });

    return card;
}

function filterBookings() {
    const filter = bookingFilter.value;
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    let filtered;
    switch (filter) {
        case 'all':
            filtered = bookings;
            break;

        case 'confirmed':
            filtered = bookings.filter(b => {
                const bDate = new Date(b.date);
                return bDate >= today && b.status !== 'cancelled';
            });
            break;

        case 'completed':
            filtered = bookings.filter(b => {
                const bDate = new Date(b.date);
                return bDate < today || b.status === 'completed';
            });
            break;

        case 'cancelled':
            filtered = bookings.filter(b => b.status === "cancelled");
            break;

        default:
            filtered = bookings;
    }

    console.log(filtered);
    renderBookings(filtered);
}


// Cancel booking
function cancelBooking(bookingId) {
    if (confirm('Are you sure you want to cancel this booking?')) {
        cancel(bookingId)
        // location.reload(true)
    }
}

async function cancel(id) {
    try {
        const res = await fetch(`/api/bookings/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ status: 'cancelled' })
        });

        if (!res.ok) throw new Error(`Server error: ${res.status}`);

        alert("Booking cancelled successfully");
    } catch (error) {
        console.error(error);
        alert("Something went wrong");
    }
}

// Show page
function showPage(pageId) {
    document.querySelectorAll('.page').forEach(page => {
        page.classList.remove('active');
    });
    document.getElementById(pageId).classList.add('active');

    // Close mobile menu if open
    mobileMenu.classList.add('hidden');

    // Scroll to top
    window.scrollTo(0, 0);
}

// Toggle mobile menu
function toggleMobileMenu() {
    mobileMenu.classList.toggle('hidden');
}

// Close modal when clicking outside
window.addEventListener('click', function (event) {
    if (event.target === turfModal) {
        closeTurfModal();
    }
});