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

    // --- 3. PAGE-SPECIFIC LOGIC ---
    if (document.querySelector('.gallery-page')) {
        const galleryData = {
            'pre-wedding': { name: "Pre Wedding", count: 38, description: "Moments of love and laughter captured before the big day.", videos: ['P6vbwJ4ulcM', 'yaFO681MnxE'] },
            'wedding': { name: "Wedding", count: 35, description: "Capturing the magic of your special day, from grand moments to small details.", videos: ['T4S_5pTm-L4', 'vn6UY9T7Oxc'] },
            'bridal': { name: "Bridal", count: 24, description: "Elegant and timeless portraits that celebrate the beauty and grace of the bride.", videos: [] },
            'engagement': { name: "Engagement", count: 15, description: "The promise of a lifetime, captured in a moment of pure joy.", videos: ['wz3AL_zhle8'] },
            'mehendi': { name: "Mehendi", count: 11, description: "Vibrant and colorful captures of the intricate art and joyful traditions.", videos: [] },
            'reception': { name: "Reception", count: 13, description: "The grand celebration with family and friends, filled with dance and laughter.", videos: [] },
            'baby-shower': { name: "Baby Shower", count: 13, description: "Celebrating the upcoming arrival with warmth, love, and cherished memories.", videos: [] },
            'thread-ceremony': { name: "Thread Ceremony", count: 25, description: "Documenting the sacred traditions and family blessings of this rite of passage.", videos: ['DoE0atag32E'] },
            'pre-birthday': { name: "Pre Birthday", count: 21, description: "A fun and creative photoshoot to build excitement for the big day.", videos: ['24Hy6JDvVmg'] },
            'birthday': { name: "Birthday", count: 24, description: "From cake smashes to milestone celebrations, we capture pure fun.", videos: [] },
            'maternity': { name: "Maternity", count: 13, description: "A graceful photoshoot celebrating the beautiful journey of pregnancy.", videos: [] }
        };

        const gridContainer = document.querySelector('.gallery-grid-container');
        const categorySelect = document.getElementById('category-select');
        const categoryTitle = document.getElementById('category-title');
        const categoryDesc = document.getElementById('category-description');
        const videoSection = document.getElementById('video-section');
        let msnry, lightbox;

        function populateGrid(categoryKey) {
            gridContainer.innerHTML = '<div class="grid-sizer"></div>';
            const category = galleryData[categoryKey];
            if (!category) return;

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
                img.onerror = function() { this.parentElement.parentElement.style.display = 'none'; };

                link.appendChild(img);
                gridItem.appendChild(link);
                fragment.appendChild(gridItem);
            }
            gridContainer.appendChild(fragment);

            categoryTitle.textContent = category.name;
            categoryDesc.textContent = category.description;
            
            // --- MODIFIED VIDEO LOGIC ---
            videoSection.innerHTML = ''; // Clear previous videos
            if (category.videos && category.videos.length > 0) {
                category.videos.forEach(videoId => {
                    const videoWrapper = document.createElement('div');
                    videoWrapper.className = 'video-wrapper';

                    const iframe = document.createElement('iframe');
                    iframe.src = `https://www.youtube.com/embed/${videoId}`;
                    iframe.frameBorder = "0";
                    iframe.allow = "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture";
                    iframe.allowFullscreen = true;

                    videoWrapper.appendChild(iframe);
                    videoSection.appendChild(videoWrapper);
                });
            }

            if (msnry) msnry.destroy();
            if (lightbox) lightbox.destroy();

            const instances = initializeMasonryGrid('.gallery-grid-container');
            msnry = instances.msnry;
            lightbox = instances.lightbox;
        }

        Object.keys(galleryData).forEach(key => {
            const option = document.createElement('option');
            option.value = key;
            option.textContent = galleryData[key].name;
            categorySelect.appendChild(option);
        });

        categorySelect.addEventListener('change', (e) => populateGrid(e.target.value));
        populateGrid('pre-wedding');
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
});
