/**
 * ZonaUTP Marketplace - Main JavaScript
 * Frontend-only functionality for marketplace
 */

class ZonaUTPMarketplace {
    constructor() {
        this.init();
        this.bindEvents();
        this.setupIntersectionObserver();
        this.products = this.getProducts();
        this.filteredProducts = [...this.products];
        this.currentView = 'grid';
        this.currentFilters = {
            category: 'all',
            price: '',
            location: '',
            sort: 'recent'
        };
    }

    init() {
        this.loadSavedPreferences();
        this.updateUI();
        this.setupTooltips();
    }

    bindEvents() {
        // Search functionality
        const searchInput = document.getElementById('searchInput');
        const searchBtn = document.getElementById('searchBtn');
        const mobileSearchInput = document.getElementById('mobileSearchInput');
        const mobileSearchBtn = document.getElementById('mobileSearchBtn');
        
        if (searchInput) {
            searchInput.addEventListener('input', this.debounce(this.handleSearch.bind(this), 300));
            searchInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    e.preventDefault();
                    this.handleSearch();
                }
            });
        }
        
        if (mobileSearchInput) {
            mobileSearchInput.addEventListener('input', this.debounce(this.handleSearch.bind(this), 300));
            mobileSearchInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    e.preventDefault();
                    this.handleSearch();
                }
            });
        }
        
        if (searchBtn) {
            searchBtn.addEventListener('click', this.handleSearch.bind(this));
        }
        
        if (mobileSearchBtn) {
            mobileSearchBtn.addEventListener('click', this.handleSearch.bind(this));
        }

        // User menu dropdown - Versión simplificada
        
        // Usar setTimeout para asegurar que el DOM esté completamente cargado
        setTimeout(() => {
            const userBtn = document.getElementById('userBtn');
            const userDropdown = document.getElementById('userDropdown');
            
            
            if (userBtn && userDropdown) {
                
                userBtn.onclick = function(e) {
                    e.preventDefault();
                    e.stopPropagation();
                    
                    const isActive = userDropdown.classList.contains('active');
                    if (isActive) {
                        userDropdown.classList.remove('active');
                    } else {
                        userDropdown.classList.add('active');
                    }
                };
                
                // Cerrar al hacer click fuera
                document.onclick = function(e) {
                    if (!userBtn.contains(e.target) && !userDropdown.contains(e.target)) {
                        userDropdown.classList.remove('active');
                    }
                };
                
            } else {
            }
        }, 100);

        // Messages button functionality
        setTimeout(() => {
            const messagesBtn = document.getElementById('messagesBtn');
            if (messagesBtn) {
                messagesBtn.addEventListener('click', (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    // Open messages modal directly
                    const headerMessagesModal = document.getElementById('headerMessagesModal');
                    const messagesOverlay = document.getElementById('messagesOverlay');
                    if (headerMessagesModal && messagesOverlay) {
                        headerMessagesModal.classList.add('active');
                        messagesOverlay.classList.add('active');
                    }
                });
            }
        }, 100);

        // Mobile menu toggle
        const mobileToggle = document.getElementById('mobileToggle');
        const navMenu = document.getElementById('navMenu');
        
        if (mobileToggle && navMenu) {
            mobileToggle.addEventListener('click', (e) => {
                e.stopPropagation();
                navMenu.classList.toggle('active');
                mobileToggle.classList.toggle('active');
            });
            
            // Close mobile menu when clicking on nav links
            navMenu.addEventListener('click', (e) => {
                const navLink = e.target.closest('.nav-link');
                if (navLink) {
                    navMenu.classList.remove('active');
                    mobileToggle.classList.remove('active');
                }
            });
            
            // Close mobile menu when clicking outside
            document.addEventListener('click', (e) => {
                if (!navMenu.contains(e.target) && !mobileToggle.contains(e.target)) {
                    navMenu.classList.remove('active');
                    mobileToggle.classList.remove('active');
                }
            });
            
            // Close mobile menu on window resize
            window.addEventListener('resize', () => {
                if (window.innerWidth > 768) {
                    navMenu.classList.remove('active');
                    mobileToggle.classList.remove('active');
                }
            });
        }

        // Category filters
        const categoryTabs = document.getElementById('categoryTabs');
        if (categoryTabs) {
            categoryTabs.addEventListener('click', (e) => {
                const tab = e.target.closest('.category-tab');
                if (tab) {
                    this.handleCategoryFilter(tab.dataset.category);
                }
            });
        }

        // Filter controls
        const priceFilter = document.getElementById('priceFilter');
        const locationFilter = document.getElementById('locationFilter');
        const sortFilter = document.getElementById('sortFilter');
        const filterReset = document.getElementById('filterReset');

        if (priceFilter) {
            priceFilter.addEventListener('change', () => {
                this.currentFilters.price = priceFilter.value;
                this.applyFilters();
            });
        }

        if (locationFilter) {
            locationFilter.addEventListener('change', () => {
                this.currentFilters.location = locationFilter.value;
                this.applyFilters();
            });
        }

        if (sortFilter) {
            sortFilter.addEventListener('change', () => {
                this.currentFilters.sort = sortFilter.value;
                this.applyFilters();
            });
        }

        if (filterReset) {
            filterReset.addEventListener('click', this.resetFilters.bind(this));
        }

        // View toggle
        const gridView = document.getElementById('gridView');
        const listView = document.getElementById('listView');
        
        if (gridView) {
            gridView.addEventListener('click', () => this.toggleView('grid'));
        }
        
        if (listView) {
            listView.addEventListener('click', () => this.toggleView('list'));
        }

        // Product interactions
        this.bindProductEvents();

        // Quick actions
        const sellBtn = document.getElementById('sellBtn');
        const chatBtn = document.getElementById('chatBtn');
        const scrollTopBtn = document.getElementById('scrollTopBtn');

        if (sellBtn) {
            sellBtn.addEventListener('click', this.handleSellAction.bind(this));
        }

        if (chatBtn) {
            chatBtn.addEventListener('click', this.handleChatAction.bind(this));
        }

        if (scrollTopBtn) {
            scrollTopBtn.addEventListener('click', this.scrollToTop.bind(this));
        }

        // Load more button
        const loadMoreBtn = document.getElementById('loadMoreBtn');
        if (loadMoreBtn) {
            loadMoreBtn.addEventListener('click', this.loadMoreProducts.bind(this));
        }

        // Scroll events
        window.addEventListener('scroll', this.debounce(this.handleScroll.bind(this), 100));
        
        // Resize events
        window.addEventListener('resize', this.debounce(this.handleResize.bind(this), 200));
    }

    bindProductEvents() {
        // Favorite buttons
        document.addEventListener('click', (e) => {
            const favoriteBtn = e.target.closest('.favorite-btn');
            if (favoriteBtn) {
                e.preventDefault();
                e.stopPropagation();
                this.toggleFavorite(favoriteBtn);
            }
        });

        // Contact buttons
        document.addEventListener('click', (e) => {
            const contactBtn = e.target.closest('.contact-btn');
            if (contactBtn) {
                e.preventDefault();
                e.stopPropagation();
                this.handleContact(contactBtn);
            }
        });

        // Product cards
        document.addEventListener('click', (e) => {
            const productCard = e.target.closest('.product-card');
            if (productCard && !e.target.closest('.favorite-btn, .contact-btn')) {
                this.handleProductClick(productCard);
            }
        });
    }

    // Search functionality
    handleSearch() {
        const searchInput = document.getElementById('searchInput');
        const mobileSearchInput = document.getElementById('mobileSearchInput');
        const query = (searchInput?.value || mobileSearchInput?.value || '').trim().toLowerCase();
        
        // Sync search inputs
        if (searchInput && mobileSearchInput) {
            if (searchInput.value !== mobileSearchInput.value) {
                if (document.activeElement === searchInput) {
                    mobileSearchInput.value = searchInput.value;
                } else if (document.activeElement === mobileSearchInput) {
                    searchInput.value = mobileSearchInput.value;
                }
            }
        }
        
        if (!query) {
            this.filteredProducts = [...this.products];
        } else {
            this.filteredProducts = this.products.filter(product => 
                product.title.toLowerCase().includes(query) ||
                product.description.toLowerCase().includes(query) ||
                product.category.toLowerCase().includes(query) ||
                product.seller.toLowerCase().includes(query)
            );
        }
        
        this.renderProducts();
        this.showToast('Búsqueda realizada', `Se encontraron ${this.filteredProducts.length} productos`, 'info');
    }

    // Category filtering
    handleCategoryFilter(category) {
        // Update active tab
        document.querySelectorAll('.category-tab').forEach(tab => {
            tab.classList.remove('active');
        });
        
        const activeTab = document.querySelector(`[data-category="${category}"]`);
        if (activeTab) {
            activeTab.classList.add('active');
        }

        this.currentFilters.category = category;
        this.applyFilters();
    }

    // Apply all filters
    applyFilters() {
        let filtered = [...this.products];

        // Category filter
        if (this.currentFilters.category !== 'all') {
            filtered = filtered.filter(product => 
                product.category === this.currentFilters.category
            );
        }

        // Price filter
        if (this.currentFilters.price) {
            filtered = this.applyPriceFilter(filtered, this.currentFilters.price);
        }

        // Location filter
        if (this.currentFilters.location) {
            filtered = filtered.filter(product => 
                product.location.toLowerCase().includes(this.currentFilters.location.toLowerCase())
            );
        }

        // Sort
        filtered = this.sortProducts(filtered, this.currentFilters.sort);

        this.filteredProducts = filtered;
        this.renderProducts();
        
        this.showToast('Filtros aplicados', `Se encontraron ${filtered.length} productos`, 'success');
    }

    applyPriceFilter(products, priceRange) {
        if (!priceRange) return products;

        return products.filter(product => {
            const price = parseFloat(product.price);
            
            switch (priceRange) {
                case '0-25':
                    return price >= 0 && price <= 25;
                case '25-50':
                    return price > 25 && price <= 50;
                case '50-100':
                    return price > 50 && price <= 100;
                case '100-200':
                    return price > 100 && price <= 200;
                case '200+':
                    return price > 200;
                default:
                    return true;
            }
        });
    }

    sortProducts(products, sortBy) {
        const sorted = [...products];
        
        switch (sortBy) {
            case 'price-low':
                return sorted.sort((a, b) => parseFloat(a.price) - parseFloat(b.price));
            case 'price-high':
                return sorted.sort((a, b) => parseFloat(b.price) - parseFloat(a.price));
            case 'popular':
                return sorted.sort((a, b) => parseFloat(b.rating) - parseFloat(a.rating));
            case 'recent':
            default:
                return sorted.sort((a, b) => new Date(b.date) - new Date(a.date));
        }
    }

    resetFilters() {
        this.currentFilters = {
            category: 'all',
            price: '',
            location: '',
            sort: 'recent'
        };

        // Reset UI elements
        document.querySelectorAll('.category-tab').forEach(tab => {
            tab.classList.remove('active');
        });
        document.querySelector('[data-category="all"]')?.classList.add('active');
        
        const priceFilter = document.getElementById('priceFilter');
        const locationFilter = document.getElementById('locationFilter');
        const sortFilter = document.getElementById('sortFilter');
        
        if (priceFilter) priceFilter.value = '';
        if (locationFilter) locationFilter.value = '';
        if (sortFilter) sortFilter.value = 'recent';

        this.filteredProducts = [...this.products];
        this.renderProducts();
        
    this.showToast('Filtros limpiados', 'Se muestran todos los productos', 'info');
    }

    // View toggle
    toggleView(view) {
        this.currentView = view;
        
        // Update buttons
        document.querySelectorAll('.view-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        
        if (view === 'grid') {
            document.getElementById('gridView')?.classList.add('active');
        } else {
            document.getElementById('listView')?.classList.add('active');
        }

        // Update grid
        const productsGrid = document.getElementById('productsGrid');
        if (productsGrid) {
            productsGrid.classList.toggle('list-view', view === 'list');
        }

        this.savePreferences();
    }

    // Product interactions
    toggleFavorite(button) {
        const icon = button.querySelector('i');
        const isFavorited = button.classList.contains('active');
        
        if (isFavorited) {
            button.classList.remove('active');
            icon.className = 'far fa-heart';
            this.showToast('Eliminado de favoritos', '', 'info');
        } else {
            button.classList.add('active');
            icon.className = 'fas fa-heart';
            this.showToast('Agregado a favoritos', '', 'success');
        }

        // Animation
        button.style.transform = 'scale(1.2)';
        setTimeout(() => {
            button.style.transform = '';
        }, 200);
    }

    handleContact(button) {
        const productCard = button.closest('.product-card');
        const productTitle = productCard?.querySelector('.product-title')?.textContent || 'Producto';
        const sellerName = productCard?.querySelector('.seller-name')?.textContent || 'Vendedor';
        
        this.showModal('Contactar vendedor', `
            <div class="modal-body">
                <p><strong>Producto:</strong> ${productTitle}</p>
                <p><strong>Vendedor:</strong> ${sellerName}</p>
                <div class="form-group">
                    <label class="form-label">Mensaje</label>
                    <textarea class="form-textarea" placeholder="Escribe tu mensaje aquí..." rows="4"></textarea>
                </div>
            </div>
        `, [
            { text: 'Cancelar', class: 'btn-secondary' },
            { text: 'Enviar mensaje', class: 'btn-primary' }
        ]);
    }

    handleProductClick(card) {
        const productTitle = card.querySelector('.product-title')?.textContent || 'Producto';
        const productPrice = card.querySelector('.product-price')?.textContent || '$0';
        const productDescription = card.querySelector('.product-description')?.textContent || '';
        const productImage = card.querySelector('.product-image img')?.src || '';
        
        this.showModal(productTitle, `
            <div class="modal-body">
                <img src="${productImage}" alt="${productTitle}" style="width: 100%; height: 200px; object-fit: cover; border-radius: 8px; margin-bottom: 16px;">
                <div style="display: flex; justify-content: space-between; margin-bottom: 16px;">
                    <span style="font-size: 24px; font-weight: 700; color: var(--primary);">${productPrice}</span>
                    <button class="btn btn-outline btn-sm">
                        <i class="far fa-heart"></i>
                        Favorito
                    </button>
                </div>
                <p style="color: var(--gray-600); line-height: 1.6;">${productDescription}</p>
                <div style="margin-top: 24px;">
                    <h4 style="margin-bottom: 12px;">Información del vendedor</h4>
                    <div style="display: flex; align-items: center; gap: 12px;">
                        <img src="src/frontend/images/avatars/user1.jpg" alt="Vendedor" style="width: 40px; height: 40px; border-radius: 50%; object-fit: cover;">
                        <div>
                            <div style="font-weight: 600;">María García</div>
                            <div style="color: var(--gray-500); font-size: 14px;">
                                <i class="fas fa-star" style="color: var(--warning);"></i>
                                4.8 (23 reseñas)
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `, [
            { text: 'Cerrar', class: 'btn-secondary' },
            { text: 'Contactar vendedor', class: 'btn-primary' }
        ]);
    }

    // Quick actions
    handleSellAction() {
        this.showModal('Vender producto', `
            <div class="modal-body">
                <div class="form-group">
                    <label class="form-label required">Título del producto</label>
                    <input type="text" class="form-input" placeholder="Ej: iPhone 13 Pro Max">
                </div>
                <div class="form-group">
                    <label class="form-label required">Precio</label>
                    <input type="number" class="form-input" placeholder="0.00" min="0" step="0.01">
                </div>
                <div class="form-group">
                    <label class="form-label required">Categoría</label>
                    <select class="form-select">
                        <option value="">Seleccionar categoría</option>
                        <option value="books">Libros</option>
                        <option value="electronics">Electrónicos</option>
                        <option value="furniture">Muebles</option>
                        <option value="services">Servicios</option>
                        <option value="clothing">Ropa</option>
                        <option value="sports">Deportes</option>
                        <option value="others">Otros</option>
                    </select>
                </div>
                <div class="form-group">
                    <label class="form-label required">Descripción</label>
                    <textarea class="form-textarea" placeholder="Describe tu producto..." rows="4"></textarea>
                </div>
                <div class="form-group">
                    <label class="form-label">Imágenes</label>
                    <div class="file-upload">
                        <input type="file" multiple accept="image/*">
                        <div class="file-upload-icon">
                            <i class="fas fa-camera"></i>
                        </div>
                        <div class="file-upload-text">
                            Arrastra imágenes aquí o haz clic para seleccionar
                        </div>
                        <div class="file-upload-hint">
                            Máximo 5 imágenes, 5MB cada una
                        </div>
                    </div>
                </div>
            </div>
        `, [
            { text: 'Cancelar', class: 'btn-secondary' },
            { text: 'Publicar producto', class: 'btn-primary' }
        ]);
    }

    handleChatAction() {
        this.showToast('Mensajes', 'Funcionalidad en desarrollo', 'info');
    }

    scrollToTop() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    }

    // Product loading
    loadMoreProducts() {
        const loadMoreBtn = document.getElementById('loadMoreBtn');
        
        if (loadMoreBtn) {
            loadMoreBtn.classList.add('btn-loading');
            
            // Simulate loading
            setTimeout(() => {
                const moreProducts = this.generateRandomProducts(6);
                this.products.push(...moreProducts);
                this.applyFilters();
                
                loadMoreBtn.classList.remove('btn-loading');
                this.showToast('Productos cargados', `${moreProducts.length} productos más`, 'success');
            }, 1500);
        }
    }

    // Scroll handling
    handleScroll() {
        const scrollTopBtn = document.getElementById('scrollTopBtn');
        const header = document.getElementById('header');
        
        if (scrollTopBtn) {
            if (window.scrollY > 300) {
                scrollTopBtn.style.opacity = '1';
                scrollTopBtn.style.visibility = 'visible';
            } else {
                scrollTopBtn.style.opacity = '0';
                scrollTopBtn.style.visibility = 'hidden';
            }
        }

        // Header shadow
        if (header) {
            if (window.scrollY > 0) {
                header.style.boxShadow = 'var(--shadow-md)';
            } else {
                header.style.boxShadow = 'none';
            }
        }
    }

    handleResize() {
        // Handle responsive behavior
        const navMenu = document.getElementById('navMenu');
        if (window.innerWidth > 768 && navMenu) {
            navMenu.classList.remove('active');
        }
    }

    // Product rendering
    renderProducts() {
        const productsGrid = document.getElementById('productsGrid');
        if (!productsGrid) return;

        if (this.filteredProducts.length === 0) {
            productsGrid.innerHTML = `
                <div style="grid-column: 1 / -1; text-align: center; padding: 60px 20px;">
                    <i class="fas fa-search" style="font-size: 48px; color: var(--gray-300); margin-bottom: 16px;"></i>
                    <h3 style="color: var(--gray-600); margin-bottom: 8px;">No se encontraron productos</h3>
                    <p style="color: var(--gray-500);">Intenta ajustar los filtros de búsqueda</p>
                </div>
            `;
            return;
        }

        productsGrid.innerHTML = this.filteredProducts.map(product => `
            <article class="product-card" data-category="${product.category}">
                <div class="product-image">
                    <img src="${product.image}" loading="lazy">
                    <button class="favorite-btn ${product.favorited ? 'active' : ''}">
                        <i class="${product.favorited ? 'fas' : 'far'} fa-heart"></i>
                    </button>
                    ${product.badge ? `<div class="product-badge ${product.badge.type || ''}">${product.badge.text}</div>` : ''}
                </div>
                <div class="product-info">
                    <h3 class="product-title">${product.title}</h3>
                    <p class="product-description">${product.description}</p>
                    <div class="product-meta">
                        <span class="product-price">$${product.price}${product.unit ? `<small>/${product.unit}</small>` : ''}</span>
                        <span class="product-location">
                            <i class="fas fa-map-marker-alt"></i>
                            ${product.location}
                        </span>
                    </div>
                    <div class="product-footer">
                        <div class="seller-info">
                            <div class="seller-avatar-placeholder">
                                <i class="fas fa-user"></i>
                            </div>
                            <span class="seller-name">${product.seller}</span>
                        </div>
                        <button class="contact-btn">
                            <i class="fas fa-comment"></i>
                            Contactar
                        </button>
                    </div>
                </div>
            </article>
        `).join('');
    }

    // Data management
    getProducts() {
        // Mock product data
        return [
            {
                id: 1,
                title: 'Cálculo Diferencial - Stewart',
                description: 'Libro en excelente estado, usado solo un semestre',
                price: '45.00',
                category: 'books',
                location: 'Campus Central',
                seller: 'María García',
                sellerAvatar: 'src/frontend/images/avatars/user1.jpg',
                image: 'src/frontend/images/products/book1.jpg',
                date: '2025-01-15',
                favorited: false,
                badge: { text: 'Nuevo', type: '' }
            },
            {
                id: 2,
                title: 'Laptop HP Pavilion 15"',
                description: 'i5, 8GB RAM, 256GB SSD, ideal para programación',
                price: '650.00',
                category: 'electronics',
                location: 'Campus Central',
                seller: 'Carlos Mendoza',
                sellerAvatar: 'src/frontend/images/avatars/user2.jpg',
                image: 'src/frontend/images/products/laptop1.jpg',
                date: '2025-01-14',
                favorited: true,
                badge: { text: 'Popular', type: 'hot' }
            },
            {
                id: 3,
                title: 'Tutorías de Matemáticas',
                description: 'Clases personalizadas de Cálculo y Álgebra',
                price: '15.00',
                unit: 'hora',
                category: 'services',
                location: 'Online/Presencial',
                seller: 'Ana Rodríguez',
                sellerAvatar: 'src/frontend/images/avatars/user3.jpg',
                image: 'src/frontend/images/products/tutoring.jpg',
                date: '2025-01-13',
                favorited: false
            },
            {
                id: 4,
                title: 'Escritorio de estudio',
                description: 'Escritorio amplio con cajones, perfecto estado',
                price: '120.00',
                category: 'furniture',
                location: 'Campus Central',
                seller: 'Luis Hernández',
                sellerAvatar: 'src/frontend/images/avatars/user4.jpg',
                image: 'src/frontend/images/products/desk1.jpg',
                date: '2025-01-12',
                favorited: false
            },
            {
                id: 5,
                title: 'iPhone 13 128GB',
                description: 'Como nuevo, con caja y accesorios originales',
                price: '780.00',
                category: 'electronics',
                location: 'Campus Chiriquí',
                seller: 'Sofía Chen',
                sellerAvatar: 'src/frontend/images/avatars/user5.jpg',
                image: 'src/frontend/images/products/phone1.jpg',
                date: '2025-01-11',
                favorited: false,
                badge: { text: 'Oferta', type: '' }
            },
            {
                id: 6,
                title: 'Clean Code - Robert Martin',
                description: 'Libro esencial para programadores, excelente estado',
                price: '35.00',
                category: 'books',
                location: 'Campus Central',
                seller: 'Diego Vargas',
                sellerAvatar: 'src/frontend/images/avatars/user6.jpg',
                image: 'src/frontend/images/products/programming-book.jpg',
                date: '2025-01-10',
                favorited: false
            }
        ];
    }

    generateRandomProducts(count) {
        const titles = [
            'Física Universitaria - Sears',
            'MacBook Air M1',
            'Silla ergonómica',
            'Clases de inglés',
            'Samsung Galaxy S23',
            'Química Orgánica - Morrison',
            'iPad Pro 11"',
            'Mesa de comedor',
            'Tutoría de programación',
            'Zapatos deportivos Nike'
        ];

        const categories = ['books', 'electronics', 'furniture', 'services', 'clothing'];
        const locations = ['Campus Central', 'Campus Azuero', 'Campus Chiriquí', 'Campus Colón'];
        const sellers = ['Juan Pérez', 'Ana López', 'Carlos Silva', 'María Torres', 'Luis Morales'];

        return Array.from({ length: count }, (_, i) => ({
            id: this.products.length + i + 1,
            title: titles[Math.floor(Math.random() * titles.length)],
            description: 'Producto en excelente estado, poco uso',
            price: (Math.random() * 500 + 10).toFixed(2),
            category: categories[Math.floor(Math.random() * categories.length)],
            location: locations[Math.floor(Math.random() * locations.length)],
            seller: sellers[Math.floor(Math.random() * sellers.length)],
            sellerAvatar: `src/frontend/images/avatars/user${Math.floor(Math.random() * 6) + 1}.jpg`,
            rating: (Math.random() * 1 + 4).toFixed(1),
            image: 'src/frontend/images/products/placeholder.jpg',
            date: new Date().toISOString().split('T')[0],
            favorited: Math.random() > 0.8
        }));
    }

    // UI utilities
    showModal(title, content, buttons = []) {
        const modal = document.createElement('div');
        modal.className = 'modal-overlay';
        modal.innerHTML = `
            <div class="modal">
                <div class="modal-header">
                    <h3 class="modal-title">${title}</h3>
                    <button class="modal-close">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                ${content}
                ${buttons.length > 0 ? `
                    <div class="modal-footer">
                        ${buttons.map(btn => `
                            <button class="btn ${btn.class || 'btn-primary'}">${btn.text}</button>
                        `).join('')}
                    </div>
                ` : ''}
            </div>
        `;

        document.body.appendChild(modal);
        
        // Show modal
        setTimeout(() => modal.classList.add('active'), 10);

        // Close handlers
        const closeModal = () => {
            modal.classList.remove('active');
            setTimeout(() => document.body.removeChild(modal), 300);
        };

        modal.querySelector('.modal-close').addEventListener('click', closeModal);
        modal.addEventListener('click', (e) => {
            if (e.target === modal) closeModal();
        });

        // Button handlers
        modal.querySelectorAll('.modal-footer .btn').forEach((btn, index) => {
            btn.addEventListener('click', () => {
                if (buttons[index]?.action) {
                    buttons[index].action();
                }
                closeModal();
            });
        });
    }

    showToast(title, message = '', type = 'info') {
        let container = document.querySelector('.toast-container');
        if (!container) {
            container = document.createElement('div');
            container.className = 'toast-container';
            document.body.appendChild(container);
        }

        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        
        const icons = {
            success: 'fas fa-check-circle',
            error: 'fas fa-exclamation-circle',
            warning: 'fas fa-exclamation-triangle',
            info: 'fas fa-info-circle'
        };

        toast.innerHTML = `
            <div class="toast-icon">
                <i class="${icons[type]}"></i>
            </div>
            <div class="toast-content">
                <div class="toast-title">${title}</div>
                ${message ? `<div class="toast-message">${message}</div>` : ''}
            </div>
            <button class="toast-close">
                <i class="fas fa-times"></i>
            </button>
        `;

        container.appendChild(toast);

        // Show toast
        setTimeout(() => toast.classList.add('show'), 10);

        // Auto close
        const autoClose = setTimeout(() => {
            this.closeToast(toast);
        }, 4000);

        // Manual close
        toast.querySelector('.toast-close').addEventListener('click', () => {
            clearTimeout(autoClose);
            this.closeToast(toast);
        });
    }

    closeToast(toast) {
        toast.classList.remove('show');
        setTimeout(() => {
            if (toast.parentNode) {
                toast.parentNode.removeChild(toast);
            }
        }, 300);
    }

    setupTooltips() {
        document.querySelectorAll('[title]').forEach(element => {
            const title = element.getAttribute('title');
            element.removeAttribute('title');
            
            const tooltip = document.createElement('div');
            tooltip.className = 'tooltip-content';
            tooltip.textContent = title;
            
            element.style.position = 'relative';
            element.appendChild(tooltip);
        });
    }

    setupIntersectionObserver() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.animationDelay = '0s';
                    entry.target.style.animationName = 'fadeInUp';
                }
            });
        }, { threshold: 0.1 });

        // Observe product cards as they're added
        document.addEventListener('DOMNodeInserted', (e) => {
            if (e.target.classList?.contains('product-card')) {
                observer.observe(e.target);
            }
        });
    }

    // Preferences
    loadSavedPreferences() {
        const saved = localStorage.getItem('utplace-preferences');
        if (saved) {
            const prefs = JSON.parse(saved);
            this.currentView = prefs.view || 'grid';
            this.currentFilters = { ...this.currentFilters, ...prefs.filters };
        }
    }

    savePreferences() {
        const prefs = {
            view: this.currentView,
            filters: this.currentFilters
        };
        localStorage.setItem('utplace-preferences', JSON.stringify(prefs));
    }

    updateUI() {
        // Update view
        this.toggleView(this.currentView);
        
        // Update filters
        Object.entries(this.currentFilters).forEach(([key, value]) => {
            const element = document.getElementById(`${key}Filter`);
            if (element) element.value = value;
        });
    }

    // Utility functions
    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    throttle(func, limit) {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        }
    }
}

// Initialize marketplace when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.zonautpMarketplace = new ZonaUTPMarketplace();
    
    // Initialize messages modal functionality
    initializeMessagesModal();
});

// Messages Modal Functionality
function initializeMessagesModal() {
    const headerMessagesModal = document.getElementById('headerMessagesModal');
    const individualChatModal = document.getElementById('individualChatModal');
    const messagesOverlay = document.getElementById('messagesOverlay');
    const closeHeaderMessagesModal = document.getElementById('closeHeaderMessagesModal');
    const closeIndividualChat = document.getElementById('closeIndividualChat');
    const backToMessagesList = document.getElementById('backToMessagesList');
    const messageItems = document.querySelectorAll('.message-item');
    
    // Función para cerrar todos los modales
    function closeAllModals() {
        headerMessagesModal.classList.remove('active');
        individualChatModal.classList.remove('active');
        messagesOverlay.classList.remove('active');
    }
    
    // Cerrar modal de mensajes
    if (closeHeaderMessagesModal) {
        closeHeaderMessagesModal.addEventListener('click', function() {
            closeAllModals();
        });
    }
    
    // Cerrar modal de chat individual
    if (closeIndividualChat) {
        closeIndividualChat.addEventListener('click', function() {
            closeAllModals();
        });
    }
    
    // Volver a la lista de mensajes
    if (backToMessagesList) {
        backToMessagesList.addEventListener('click', function() {
            individualChatModal.classList.remove('active');
            headerMessagesModal.classList.add('active');
        });
    }
    
    // Abrir chat individual al hacer click en un mensaje
    messageItems.forEach(item => {
        item.addEventListener('click', function() {
            const userName = this.querySelector('.user-name').textContent;
            document.getElementById('currentChatUser').textContent = userName;
            headerMessagesModal.classList.remove('active');
            individualChatModal.classList.add('active');
        });
    });
    
    // Cerrar modales al hacer click en overlay
    if (messagesOverlay) {
        messagesOverlay.addEventListener('click', function() {
            closeAllModals();
        });
    }
    
    // Cerrar modal al hacer click fuera (para que funcione como Facebook)
    document.addEventListener('click', function(e) {
        const messagesBtn = document.getElementById('messagesBtn');
        if (!headerMessagesModal.contains(e.target) && 
            !individualChatModal.contains(e.target) && 
            !messagesBtn?.contains(e.target)) {
            closeAllModals();
        }
    });
    
    // Cerrar modal con tecla ESC
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            closeAllModals();
        }
    });
}

// Add fadeInUp animation
const style = document.createElement('style');
style.textContent = `
    @keyframes fadeInUp {
        from {
            opacity: 0;
            transform: translateY(30px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
    
    .product-card {
        animation: fadeInUp 0.6s ease forwards;
        animation-fill-mode: both;
    }
`;
document.head.appendChild(style);
