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

    // --- 3. GALLERY PAGE LOGIC (REWRITTEN) ---
    if (document.querySelector('.gallery-page')) {
        const galleryData = {
            'pre-wedding': { name: "Pre Wedding", count: 38, description: "Moments of love and laughter captured before the big day, celebrating the journey of togetherness.", videos: ['P6vbwJ4ulcM', 'yaFO681MnxE'] },
            'wedding': { name: "Wedding", count: 35, description: "Capturing the magic of your special day, from the grandest moments to the smallest, heartfelt details.", videos: ['T4S_5pTm-L4', 'vn6UY9T7Oxc'] },
            'bridal': { name: "Bridal", count: 24, description: "Elegant and timeless portraits that celebrate the beauty and grace of the bride.", videos: [] },
            'engagement': { name: "Engagement", count: 15, description: "The promise of a lifetime, captured in a moment of pure joy and anticipation.", videos: ['wz3AL_zhle8'] },
            'mehendi': { name: "Mehendi", count: 11, description: "Vibrant and colorful captures of the intricate art and joyful traditions of the Mehendi ceremony.", videos: [] },
            'reception': { name: "Reception", count: 13, description: "The grand celebration with family and friends, filled with dance, laughter, and unforgettable moments.", videos: [] },
            'baby-shower': { name: "Baby Shower", count: 13, description: "Celebrating the upcoming arrival with warmth, love, and cherished memories.", videos: [] },
            'thread-ceremony': { name: "Thread Ceremony", count: 25, description: "Documenting the sacred traditions and family blessings of this significant rite of passage.", videos: ['DoE0atag32E'] },
            'pre-birthday': { name: "Pre Birthday", count: 21, description: "A fun and creative photoshoot to build excitement and celebrate the year that has passed.", videos: ['24Hy6JDvVmg'] },
            'birthday': { name: "Birthday", count: 24, description: "From cake smashes to milestone celebrations, we capture the pure fun and happiness of birthdays.", videos: [] },
            'maternity': { name: "Maternity", count: 13, description: "A graceful and intimate photoshoot celebrating the beautiful journey of pregnancy and motherhood.", videos: [] }
        };

        // Get all necessary elements from the page
        const gridContainer = document.querySelector('.gallery-grid-container');
        const categorySelect = document.getElementById('category-select');
        const categoryTitle = document.getElementById('category-title');
        const categoryDescription = document.getElementById('category-description');
        const pageVideoSection = document.getElementById('page-video-section');
        const videoSectionTitle = document.getElementById('video-section-title');
        const videoGrid = document.getElementById('video-grid');
        
        let msnry, lightbox;

        function updateGallery(categoryKey) {
            const category = galleryData[categoryKey];
            if (!category) return;

            // 1. Update Sidebar Info
            categoryTitle.textContent = category.name;
            categoryDescription.textContent = category.description;
            
            // 2. Populate Image Grid
            gridContainer.innerHTML = '<div class="grid-sizer"></div>'; // Clear old images
            const imageFragment = document.createDocumentFragment();
            for (let i = 1; i <= category.count; i++) {
                const imgNum = i.toString().padStart(2, '0');
                const imgPath = `images/${categoryKey}-${imgNum}.jpg`;
                
                const gridItem = document.createElement('div');
                gridItem.className = 'grid-item';
                
                const link = document.createElement('a');
                link.href = imgPath;

                const img = document.createElement('img');
                img.src = imgPath;
                img.alt = `${category.name} photo ${i}`;
                img.loading = 'lazy';
                img.onerror = function() { this.parentElement.parentElement.style.display = 'none'; };

                link.appendChild(img);
                gridItem.appendChild(link);
                imageFragment.appendChild(gridItem);
            }
            gridContainer.appendChild(imageFragment);

            // 3. Populate the NEW Separate Video Section
            videoGrid.innerHTML = ''; // Clear old videos
            if (category.videos && category.videos.length > 0) {
                videoSectionTitle.textContent = `Our ${category.name} Video Collection`;
                
                category.videos.forEach(videoId => {
                    const videoWrapper = document.createElement('div');
                    videoWrapper.className = 'video-wrapper';
                    videoWrapper.innerHTML = `<iframe src="https://www.youtube.com/embed/${videoId}" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>`;
                    videoGrid.appendChild(videoWrapper);
                });

                pageVideoSection.classList.add('visible'); // Show the entire section
            } else {
                pageVideoSection.classList.remove('visible'); // Hide section if no videos
            }

            // 4. Re-initialize Masonry and Lightbox
            if (msnry) msnry.destroy();
            if (lightbox) lightbox.destroy();
            const instances = initializeMasonryGrid('.gallery-grid-container');
            msnry = instances.msnry;
            lightbox = instances.lightbox;
        }

        // Setup dropdown and initial load
        Object.keys(galleryData).forEach(key => {
            const option = document.createElement('option');
            option.value = key;
            option.textContent = galleryData[key].name;
            categorySelect.appendChild(option);
        });

        categorySelect.addEventListener('change', (e) => updateGallery(e.target.value));
        
        // Load the first category on page start
        updateGallery('pre-wedding');
    }

    // --- TESTIMONIALS & FEATURED PAGE LOGIC ---
    function setupSimpleGrid(gridClass, imgPrefix, count) {
        if (document.querySelector(gridClass)) {
            const grid = document.querySelector(gridClass);
            const fragment = document.createDocumentFragment();
            for (let i = 1; i <= count; i++) {
                const imgNum = i.toString().padStart(2, '0');
                const imgPath = `images/${imgPrefix}-${imgNum}.jpg`;
                
                const item = document.createElement('div');
                item.className = 'grid-item';
                item.innerHTML = `<a href="${imgPath}"><img src="${imgPath}" alt="${imgPrefix} ${i}" loading="lazy" onerror="this.parentElement.parentElement.style.display = 'none';"></a>`;
                fragment.appendChild(item);
            }
            grid.appendChild(fragment);
            initializeMasonryGrid(gridClass);
        }
    }
    setupSimpleGrid('.testimonials-grid', 'testimonials', 10);
    setupSimpleGrid('.featured-grid', 'featured', 14);
    
    // --- NEW CONTACT FORM LOGIC ---
    if (document.getElementById('booking-form')) {
        const bookingForm = document.getElementById('booking-form');
        const shootTypeSelect = document.getElementById('shoot-type');
        const dateInput = document.getElementById('preferred-date');
        const destinationGroup = document.querySelector('.destination-wedding-group');

        // Set minimum date for date picker to today
        if (dateInput) {
            const today = new Date().toISOString().split('T')[0];
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
            // Add a placeholder option first
            const placeholder = document.createElement('option');
            placeholder.value = "";
            placeholder.textContent = "Select a service...";
            placeholder.disabled = true;
            placeholder.selected = true;
            shootTypeSelect.appendChild(placeholder);

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
