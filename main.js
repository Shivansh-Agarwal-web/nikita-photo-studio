document.addEventListener('DOMContentLoaded', function() {
    
    // --- 1. SHARED LOGIC: MOBILE HAMBURGER MENU ---
    const hamburger = document.getElementById('hamburger-menu');
    const navMenu = document.getElementById('nav-menu');
    if (hamburger && navMenu) {
        hamburger.addEventListener('click', () => {
            navMenu.classList.toggle('active');
        });
    }

    // --- 2. UNIVERSAL MASONRY & LIGHTBOX INITIALIZER ---
    function initializeMasonryGrid(gridSelector) {
        const grid = document.querySelector(gridSelector);
        if (!grid) return null;

        const msnry = new Masonry(grid, {
            itemSelector: '.grid-item',
            columnWidth: '.grid-sizer',
            gutter: 15,
            percentPosition: true
        });

        imagesLoaded(grid).on('progress', function(instance, image) {
            image.img.closest('.grid-item').classList.add('is-loaded');
            msnry.layout();
        });

        const lightbox = new SimpleLightbox(`${gridSelector} .grid-item a`, {});
        
        return { msnry, lightbox };
    }

    // --- 3. GALLERY PAGE LOGIC ---
    if (document.querySelector('.gallery-page')) {
        // (All the existing gallery page logic remains here)
    }

    // --- 4. TESTIMONIALS & FEATURED PAGE LOGIC ---
    function setupSimpleGrid(gridClass, imgPrefix, count) {
        // (All the existing simple grid logic remains here)
    }
    setupSimpleGrid('.testimonials-grid', 'testimonials', 10);
    setupSimpleGrid('.featured-grid', 'featured', 14);

    // --- 5. NEW CONTACT FORM LOGIC ---
    if (document.getElementById('booking-form')) {
        const bookingForm = document.getElementById('booking-form');
        const shootTypeSelect = document.getElementById('shoot-type');
        const dateInput = document.getElementById('preferred-date');
        const destinationGroup = document.querySelector('.destination-wedding-group');

        // Set minimum date for date picker to today
        const today = new Date().toISOString().split('T')[0];
        if (dateInput) {
            dateInput.setAttribute('min', today);
        }

        const services = [
            "Wedding", "Pre Wedding", "Bridal", "Engagement", "Sangeet",
            "Reception", "Baby Shower", "Thread Ceremony", "Pre Birthday",
            "Birthday Party", "Maternity", "Corporates", "Family & Group",
            "Events & Parties", "Drone Services", "Other"
        ];

        // Populate dropdown
        if (shootTypeSelect) {
            services.forEach(service => {
                const option = document.createElement('option');
                option.value = service;
                option.textContent = service;
                shootTypeSelect.appendChild(option);
            });
        }
        
        // Conditional logic for "Destination Wedding" field
        shootTypeSelect.addEventListener('change', function() {
            if (this.value === 'Wedding') {
                destinationGroup.classList.remove('hidden');
            } else {
                destinationGroup.classList.add('hidden');
            }
        });

        // Form submission to WhatsApp
        bookingForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            if (!bookingForm.checkValidity()) {
                bookingForm.reportValidity();
                return;
            }

            const formData = new FormData(bookingForm);
            const data = Object.fromEntries(formData.entries());
            
            let message = `*New Booking Request*\n\n`;
            message += `*Name:* ${data.firstName} ${data.lastName}\n`;
            message += `*Email:* ${data.email}\n`;
            message += `*Phone:* ${data.phone}\n`;
            message += `*Shoot Type:* ${data.shootType}\n`;
            message += `*Preferred Date:* ${data.preferredDate}\n`;
            message += `*Event Location:* ${data.location}\n`;
            message += `*Number of Guests:* ${data.guests}\n`;
            if (data.shootType === 'Wedding') {
                message += `*Destination Wedding?:* ${data.destination}\n`;
            }
            message += `*Heard About Us Via:* ${data.referral}\n`;

            if (data.vision) {
                message += `*Vision:* ${data.vision}\n`;
            }

            const studioPhoneNumber = "917066880499";
            const whatsappUrl = `https://wa.me/${studioPhoneNumber}?text=${encodeURIComponent(message)}`;
            
            window.open(whatsappUrl, '_blank');
        });
    }
});
