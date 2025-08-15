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

        // Initialize Masonry
        const msnry = new Masonry(grid, {
            itemSelector: '.grid-item',
            columnWidth: '.grid-sizer',
            gutter: 15,
            percentPosition: true
        });

        // Use imagesLoaded to layout after images are loaded & trigger fade-in
        imagesLoaded(grid).on('progress', function(instance, image) {
            // Un-hide and animate item when its image is loaded
            image.img.closest('.grid-item').classList.add('is-loaded');
            msnry.layout();
        });

        // Initialize Lightbox
        const lightbox = new SimpleLightbox(`${gridSelector} .grid-item a`, {
            /* options */
        });
        
        return { msnry, lightbox };
    }

    // --- 3. PAGE-SPECIFIC LOGIC ---
    
    // --- GALLERY PAGE LOGIC ---
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

        const gridContainer = document.querySelector('.gallery-grid-container');
        const categorySelect = document.getElementById('category-select');
        const categoryTitle = document.getElementById('category-title');
        const categoryDesc = document.getElementById('category-description');
        const videoSection = document.getElementById('video-section');
        let msnry, lightbox;

        function populateGrid(categoryKey) {
            // Clear existing content
            gridContainer.innerHTML = '<div class="grid-sizer"></div>'; // Keep sizer
            const category = galleryData[categoryKey];
            if (!category) return;

            // Generate and append new image elements
            const fragment = document.createDocumentFragment();
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
                img.onerror = function() { this.parentElement.parentElement.style.display = 'none'; }; // Hide if image fails to load

                link.appendChild(img);
                gridItem.appendChild(link);
                fragment.appendChild(gridItem);
            }
            gridContainer.appendChild(fragment);

            // Update sidebar info
            categoryTitle.textContent = category.name;
            categoryDesc.textContent = category.description;
            
            // Update videos
            videoSection.innerHTML = '';
            if (category.videos && category.videos.length > 0) {
                category.videos.forEach(videoId => {
                    const videoWrapper = document.createElement('div');
                    videoWrapper.className = 'video-wrapper';
                    videoWrapper.innerHTML = `<iframe src="https://www.youtube.com/embed/${videoId}" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>`;
                    videoSection.appendChild(videoWrapper);
                });
            }

            // Re-initialize Masonry and Lightbox
            if (msnry) msnry.destroy();
            if (lightbox) lightbox.destroy();

            const instances = initializeMasonryGrid('.gallery-grid-container');
            msnry = instances.msnry;
            lightbox = instances.lightbox;
        }

        // Populate dropdown and set up event listener
        Object.keys(galleryData).forEach(key => {
            const option = document.createElement('option');
            option.value = key;
            option.textContent = galleryData[key].name;
            categorySelect.appendChild(option);
        });

        categorySelect.addEventListener('change', (e) => {
            populateGrid(e.target.value);
        });

        // Initial load
        populateGrid('pre-wedding');
    }


    // --- TESTIMONIALS PAGE LOGIC ---
    if (document.querySelector('.testimonials-grid')) {
        const grid = document.querySelector('.testimonials-grid');
        const imageCount = 10;
        const fragment = document.createDocumentFragment();
        for (let i = 1; i <= imageCount; i++) {
            const imgNum = i.toString().padStart(2, '0');
            const imgPath = `images/testimonials-${imgNum}.jpg`;
            
            const item = document.createElement('div');
            item.className = 'grid-item';
            item.innerHTML = `<a href="${imgPath}"><img src="${imgPath}" alt="Testimonial ${i}" loading="lazy" onerror="this.parentElement.parentElement.style.display = 'none';"></a>`;
            fragment.appendChild(item);
        }
        grid.appendChild(fragment);
        initializeMasonryGrid('.testimonials-grid');
    }


    // --- FEATURED PAGE LOGIC ---
    if (document.querySelector('.featured-grid')) {
        const grid = document.querySelector('.featured-grid');
        const imageCount = 14;
        const fragment = document.createDocumentFragment();
        for (let i = 1; i <= imageCount; i++) {
            const imgNum = i.toString().padStart(2, '0');
            const imgPath = `images/featured-${imgNum}.jpg`;

            const item = document.createElement('div');
            item.className = 'grid-item';
            item.innerHTML = `<a href="${imgPath}"><img src="${imgPath}" alt="Featured clipping ${i}" loading="lazy" onerror="this.parentElement.parentElement.style.display = 'none';"></a>`;
            fragment.appendChild(item);
        }
        grid.appendChild(fragment);
        initializeMasonryGrid('.featured-grid');
    }

});
