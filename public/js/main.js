// Global variables
let classes = [];

// DOM Content Loaded
document.addEventListener('DOMContentLoaded', function() {
    loadClasses();
});

// Load classes from API
async function loadClasses() {
    try {
        const response = await fetch('/api/classes');
        classes = await response.json();
        displayClasses(classes);
    } catch (error) {
        console.error('Error loading classes:', error);
        displayError('Failed to load classes');
    }
}

// Display classes in grid
function displayClasses(classesData) {
    const grid = document.getElementById('classesGrid');
    
    if (!classesData || classesData.length === 0) {
        grid.innerHTML = '<p>No classes available at the moment.</p>';
        return;
    }

    grid.innerHTML = classesData.map(yogaClass => `
        <div class="class-card">
            <h3>${yogaClass.name}</h3>
            <div class="class-info">
                <p><strong>Instructor:</strong> ${yogaClass.instructor}</p>
                <p><strong>Schedule:</strong> ${yogaClass.schedule}</p>
                <p><strong>Duration:</strong> ${yogaClass.duration} minutes</p>
                <p><strong>Capacity:</strong> ${yogaClass.enrolled}/${yogaClass.capacity}</p>
            </div>
            <p class="class-description">${yogaClass.description}</p>
            <button class="cta-button" onclick="bookClass('${yogaClass.id}')" 
                    ${yogaClass.enrolled >= yogaClass.capacity ? 'disabled' : ''}>
                ${yogaClass.enrolled >= yogaClass.capacity ? 'Full' : 'Book Now'}
            </button>
        </div>
    `).join('');
}

// Book a class
async function bookClass(classId) {
    try {
        const response = await fetch('/api/bookings', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                classId: classId,
                customerName: prompt('Enter your name:'),
                customerEmail: prompt('Enter your email:')
            })
        });

        if (response.ok) {
            alert('Class booked successfully!');
            loadClasses(); // Refresh the classes
        } else {
            throw new Error('Booking failed');
        }
    } catch (error) {
        console.error('Error booking class:', error);
        alert('Failed to book class. Please try again.');
    }
}

// Display error message
function displayError(message) {
    const grid = document.getElementById('classesGrid');
    grid.innerHTML = `<div class="error-message">${message}</div>`;
}
