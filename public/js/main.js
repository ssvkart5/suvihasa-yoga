// Global state
let classes = [];

// DOM Ready
document.addEventListener('DOMContentLoaded', () => {
    loadClasses();
});

// Fetch classes from API
async function loadClasses() {
    try {
        const response = await fetch('/api/classes');
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        classes = await response.json();
        displayClasses(classes);
    } catch (error) {
        console.error('Error loading classes:', error);
        displayError('Unable to load classes. Please try again later.');
    }
}

// Render classes to grid
function displayClasses(classesData) {
    const grid = document.getElementById('classesGrid');
    if (!grid) {
        console.warn("Missing element: #classesGrid");
        return;
    }

    if (!Array.isArray(classesData) || classesData.length === 0) {
        grid.innerHTML = '<p>No classes available at the moment.</p>';
        return;
    }

    grid.innerHTML = classesData.map(yogaClass => {
        const isFull = yogaClass.enrolled >= yogaClass.capacity;
        return `
            <div class="class-card">
                <h3>${yogaClass.name}</h3>
                <div class="class-info">
                    <p><strong>Instructor:</strong> ${yogaClass.instructor}</p>
                    <p><strong>Schedule:</strong> ${yogaClass.schedule}</p>
                    <p><strong>Duration:</strong> ${yogaClass.duration} minutes</p>
                    <p><strong>Capacity:</strong> ${yogaClass.enrolled}/${yogaClass.capacity}</p>
                </div>
                <p class="class-description">${yogaClass.description}</p>
                <button class="cta-button" onclick="bookClass('${yogaClass.id}')" ${isFull ? 'disabled' : ''}>
                    ${isFull ? 'Full' : 'Book Now'}
                </button>
            </div>
        `;
    }).join('');
}

// Book a class
async function bookClass(classId) {
    const customerName = prompt('Enter your name:');
    const customerEmail = prompt('Enter your email:');

    if (!customerName || !customerEmail) {
        alert('Name and email are required to book a class.');
        return;
    }

    try {
        const response = await fetch('/api/bookings', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ classId, customerName, customerEmail })
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Booking failed');
        }

        alert('Class booked successfully!');
        loadClasses(); // Refresh class list
    } catch (error) {
        console.error('Booking error:', error);
        alert(`Booking failed: ${error.message}`);
    }
}

// Show error message
function displayError(message) {
    const grid = document.getElementById('classesGrid');
    if (!grid) {
        console.warn("Missing element: #classesGrid");
        return;
    }
    grid.innerHTML = `<div class="error-message">${message}</div>`;
}
