/**
 * SPA Router - Maneja la navegación entre vistas
 */
class SPARouter {
    constructor() {
        this.routes = {
            'home': {
                path: 'src/frontend/views/home.html',
                title: 'ZonaUTP - Marketplace UTP'
            },
            'favorites': {
                path: 'src/frontend/views/favorites.html',
                title: 'ZonaUTP - Favoritos'
            },
            'sell': {
                path: 'src/frontend/views/sell.html',
                title: 'ZonaUTP - Vender Producto'
            },
            'messages': {
                path: 'src/frontend/views/messages.html',
                title: 'ZonaUTP - Mensajes'
            },
            'profile': {
                path: 'src/frontend/views/profile.html',
                title: 'ZonaUTP - Mi Perfil'
            },
            'my-products': {
                path: 'src/frontend/views/my-products.html',
                title: 'ZonaUTP - Mis Productos'
            },
            'my-purchases': {
                path: 'src/frontend/views/my-purchases.html',
                title: 'ZonaUTP - Mis Compras'
            },
            'settings': {
                path: 'src/frontend/views/settings.html',
                title: 'ZonaUTP - Configuración'
            }
        };
        
        this.currentRoute = 'home';
        this.init();
    }

    init() {
        // Cargar componentes fijos
        this.loadComponent('src/frontend/components/header.html', 'header-container');
        this.loadComponent('src/frontend/components/footer.html', 'footer-container');
        this.loadComponent('src/frontend/components/quick-actions.html', 'quick-actions-container');
        
        // Configurar navegación
        this.setupNavigation();
        
        // Cargar ruta inicial
        this.loadRoute(this.getInitialRoute());
        
        // Manejar cambios de URL
        window.addEventListener('popstate', () => {
            this.loadRoute(this.getCurrentRouteFromURL());
        });
    }

    async loadComponent(path, containerId) {
        try {
            const response = await fetch(path);
            const html = await response.text();
            const container = document.getElementById(containerId);
            if (container) {
                container.innerHTML = html;
                
                // Reinicializar JavaScript del marketplace después de cargar header
                if (containerId === 'header-container') {
                    setTimeout(() => {
                        this.reinitializeMarketplaceJS();
                        this.initializeMobileMenu();
                    }, 150);
                }
            }
        } catch (error) {
            console.error(`Error cargando componente ${path}:`, error);
        }
    }

    async loadRoute(routeName) {
        const route = this.routes[routeName];
        if (!route) {
            console.error(`Ruta no encontrada: ${routeName}`);
            return;
        }

        try {
            // Mostrar loading
            this.showLoading();
            
            // Cargar vista
            const response = await fetch(route.path);
            const html = await response.text();
            
            // Actualizar contenido
            const mainContainer = document.getElementById('main-container');
            if (mainContainer) {
                mainContainer.innerHTML = `<div class="view active">${html}</div>`;
            }
            
            // Actualizar título
            document.title = route.title;
            
            // Actualizar navegación activa
            this.updateActiveNavigation(routeName);
            
            // Actualizar URL
            this.updateURL(routeName);
            
            // Guardar ruta actual
            this.currentRoute = routeName;
            
            // Ocultar loading
            this.hideLoading();
            
            // Scroll al top
            window.scrollTo(0, 0);
            
            // Ejecutar callbacks específicos de la vista
            this.executeViewCallbacks(routeName);
            
        } catch (error) {
            console.error(`Error cargando ruta ${routeName}:`, error);
            this.hideLoading();
        }
    }

    setupNavigation() {
        // Delegar eventos para navegación
        document.addEventListener('click', (e) => {
            const link = e.target.closest('[data-route]');
            if (link) {
                e.preventDefault();
                const route = link.getAttribute('data-route');
                this.loadRoute(route);
            }
        });

        // Configurar menú móvil después de que se cargue el header
        setTimeout(() => {
            this.initializeMobileMenu();
        }, 200);
    }

    initializeMobileMenu() {
        const mobileToggle = document.getElementById('mobileToggle');
        const navMenu = document.getElementById('navMenu');
        
        if (mobileToggle && navMenu) {
            // Remover listeners anteriores para evitar duplicados
            mobileToggle.replaceWith(mobileToggle.cloneNode(true));
            const newMobileToggle = document.getElementById('mobileToggle');
            
            newMobileToggle.addEventListener('click', (e) => {
                e.stopPropagation();
                navMenu.classList.toggle('active');
                newMobileToggle.classList.toggle('active');
            });
            
            // Close mobile menu when clicking on nav links
            navMenu.addEventListener('click', (e) => {
                const navLink = e.target.closest('.nav-link');
                if (navLink) {
                    navMenu.classList.remove('active');
                    newMobileToggle.classList.remove('active');
                }
            });
            
            // Close mobile menu when clicking outside
            document.addEventListener('click', (e) => {
                if (!navMenu.contains(e.target) && !newMobileToggle.contains(e.target)) {
                    navMenu.classList.remove('active');
                    newMobileToggle.classList.remove('active');
                }
            });
            
            // Close mobile menu on window resize
            window.addEventListener('resize', () => {
                if (window.innerWidth > 768) {
                    navMenu.classList.remove('active');
                    newMobileToggle.classList.remove('active');
                }
            });
        }
    }

    updateActiveNavigation(routeName) {
        // Actualizar navegación principal
        setTimeout(() => {
            const navLinks = document.querySelectorAll('.nav-link');
            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('data-route') === routeName) {
                    link.classList.add('active');
                }
            });
        }, 100);
    }

    updateURL(routeName) {
        const url = routeName === 'home' ? '/' : `/${routeName}`;
        window.history.pushState({ route: routeName }, '', `#${routeName}`);
    }

    getCurrentRouteFromURL() {
        const hash = window.location.hash.slice(1);
        return hash || 'home';
    }

    getInitialRoute() {
        return this.getCurrentRouteFromURL();
    }

    showLoading() {
        const mainContainer = document.getElementById('main-container');
        if (mainContainer) {
            mainContainer.classList.add('loading');
        }
    }

    hideLoading() {
        const mainContainer = document.getElementById('main-container');
        if (mainContainer) {
            mainContainer.classList.remove('loading');
        }
    }

    executeViewCallbacks(routeName) {
        // Ejecutar código específico para cada vista
        setTimeout(() => {
            switch (routeName) {
                case 'home':
                    // Re-inicializar funcionalidad del marketplace
                    if (window.utplaceMarketplace) {
                        window.utplaceMarketplace.renderProducts();
                        this.bindProductEvents();
                    }
                    break;
                case 'favorites':
                    this.loadFavorites();
                    break;
                case 'messages':
                    this.initializeChat();
                    break;
                case 'sell':
                    this.initializeSellForm();
                    break;
                case 'profile':
                    this.loadUserProfile();
                    break;
                case 'my-products':
                    this.bindMyProductsEvents();
                    break;
                case 'my-purchases':
                    this.bindMyPurchasesEvents();
                    break;
                case 'settings':
                    this.bindSettingsEvents();
                    break;
            }
        }, 100);
    }

    bindProductEvents() {
        // Eventos para productos en la vista home
        const productCards = document.querySelectorAll('.product-card');
        productCards.forEach(card => {
            const favoriteBtn = card.querySelector('.favorite-btn');
            if (favoriteBtn) {
                favoriteBtn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    this.toggleFavorite(card);
                });
            }
        });

        // Eventos para filtros y ordenamiento
        const filterBtns = document.querySelectorAll('.filter-btn');
        filterBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                if (window.utplaceMarketplace) {
                    const filter = btn.getAttribute('data-filter');
                    window.utplaceMarketplace.applyFilter(filter);
                }
            });
        });
    }

    bindMyProductsEvents() {
        // Eventos para la gestión de productos del usuario
        const editBtns = document.querySelectorAll('.edit-product-btn');
        const deleteBtns = document.querySelectorAll('.delete-product-btn');
        
        editBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const productId = btn.getAttribute('data-product-id');
                this.editProduct(productId);
            });
        });

        deleteBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const productId = btn.getAttribute('data-product-id');
                this.deleteProduct(productId);
            });
        });
    }

    bindMyPurchasesEvents() {
        // Eventos para el historial de compras
        const reviewBtns = document.querySelectorAll('.review-btn');
        const contactBtns = document.querySelectorAll('.contact-seller-btn');
        
        reviewBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const purchaseId = btn.getAttribute('data-purchase-id');
                this.openReviewModal(purchaseId);
            });
        });

        contactBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const sellerId = btn.getAttribute('data-seller-id');
                this.loadRoute('messages'); // Ir a mensajes con el vendedor
            });
        });
    }

    bindSettingsEvents() {
        // Eventos para la configuración
        const toggles = document.querySelectorAll('.toggle input');
        const saveBtn = document.querySelector('.btn-primary');
        
        toggles.forEach(toggle => {
            toggle.addEventListener('change', (e) => {
                this.saveSettingChange(toggle.name, toggle.checked);
            });
        });

        if (saveBtn) {
            saveBtn.addEventListener('click', () => {
                this.saveAllSettings();
            });
        }
    }

    toggleFavorite(productCard) {
        const favoriteBtn = productCard.querySelector('.favorite-btn');
        if (favoriteBtn) {
            favoriteBtn.classList.toggle('active');
            // Aquí se guardaría en localStorage o se enviaría al backend
        }
    }

    editProduct(productId) {
    // Redirigir a formulario de edición
    this.loadRoute('sell'); // Cargar formulario con datos del producto
    }

    deleteProduct(productId) {
        if (confirm('¿Estás seguro de que quieres eliminar este producto?')) {
            // Aquí se eliminaría del backend
        }
    }

    saveSettingChange(setting, value) {
    // Guardar cambio de configuración
    localStorage.setItem(`utplace-setting-${setting}`, value);
    }

    saveAllSettings() {
        if (window.utplaceMarketplace) {
            window.utplaceMarketplace.showToast(
                'Configuración guardada',
                'Tus preferencias han sido actualizadas',
                'success'
            );
        }
    }

    loadFavorites() {
        // Mostrar loading
        setTimeout(() => {
            const loadingState = document.getElementById('favoritesLoading');
            const emptyState = document.getElementById('emptyFavorites');
            const withProductsState = document.getElementById('favoritesWithProducts');
            const favoriteCount = document.getElementById('favoriteCount');
            
            if (loadingState) loadingState.style.display = 'flex';
            if (emptyState) emptyState.style.display = 'none';
            if (withProductsState) withProductsState.style.display = 'none';
            
            // Simular carga de datos
            setTimeout(() => {
                if (loadingState) loadingState.style.display = 'none';
                
                // Obtener favoritos del localStorage
                const favorites = JSON.parse(localStorage.getItem('utplace-favorites') || '[]');
                
                // Actualizar contador
                if (favoriteCount) {
                    favoriteCount.textContent = `${favorites.length} ${favorites.length === 1 ? 'producto' : 'productos'}`;
                }
                
                if (favorites.length === 0) {
                    if (emptyState) emptyState.style.display = 'block';
                } else {
                    if (withProductsState) withProductsState.style.display = 'block';
                    this.renderFavoriteProducts(favorites);
                    this.updateFilterCounts(favorites);
                }
            }, 800);
        }, 100);
    }

    updateFilterCounts(favorites) {
        // Actualizar contadores de filtros
        const allTab = document.querySelector('[data-filter="all"] .tab-count');
        const availableTab = document.querySelector('[data-filter="available"] .tab-count');
        const priceDropTab = document.querySelector('[data-filter="price-drop"] .tab-count');
        
        if (allTab) allTab.textContent = favorites.length;
        if (availableTab) availableTab.textContent = favorites.filter(f => f.available !== false).length;
        if (priceDropTab) priceDropTab.textContent = favorites.filter(f => f.priceDrop).length || '0';
    }

    renderFavoriteProducts(favorites) {
        // Implementar renderizado de productos favoritos
        const grid = document.getElementById('favoritesProductsGrid');
        if (!grid) return;
        
        // Crear HTML para productos favoritos
        const productsHTML = favorites.map(product => `
            <div class="product-card favorite-product" data-product-id="${product.id}">
                <div class="product-image">
                    <img src="${product.image || 'src/frontend/images/placeholder.jpg'}" alt="${product.title}">
                    <div class="product-badges">
                        ${product.featured ? '<span class="badge badge-featured">Destacado</span>' : ''}
                        ${product.priceDrop ? '<span class="badge badge-price-drop">Bajó de precio</span>' : ''}
                        ${!product.available ? '<span class="badge badge-unavailable">No disponible</span>' : ''}
                    </div>
                    <button class="favorite-btn active" data-product-id="${product.id}">
                        <i class="fas fa-heart"></i>
                    </button>
                </div>
                <div class="product-info">
                    <h3 class="product-title">${product.title}</h3>
                    <p class="product-description">${product.description}</p>
                    <div class="product-meta">
                        <div class="product-price">
                            ${product.oldPrice ? `<span class="old-price">$${product.oldPrice}</span>` : ''}
                            <span class="current-price">$${product.price}</span>
                        </div>
                        <div class="product-rating">
                            <i class="fas fa-star"></i>
                            <span>${product.rating || '4.8'}</span>
                        </div>
                    </div>
                    <div class="product-seller">
                        <img src="${product.sellerAvatar || 'src/frontend/images/default-avatar.png'}" alt="${product.sellerName}">
                        <span>${product.sellerName}</span>
                    </div>
                    <div class="product-actions">
                        <button class="btn btn-primary btn-sm contact-seller-btn" data-seller-id="${product.sellerId}">
                            <i class="fas fa-message"></i>
                            Contactar
                        </button>
                        <button class="btn btn-outline btn-sm view-product-btn" data-product-id="${product.id}">
                            <i class="fas fa-eye"></i>
                            Ver detalles
                        </button>
                    </div>
                </div>
                <div class="product-favorite-date">
                    <i class="fas fa-clock"></i>
                    <span>Agregado ${this.formatDate(product.favoriteDate)}</span>
                </div>
            </div>
        `).join('');
        
        grid.innerHTML = productsHTML;
        
    // Bind events para productos
    this.bindFavoriteProductEvents();
    }

    bindFavoriteProductEvents() {
        // Eventos para productos favoritos
        const favoriteButtons = document.querySelectorAll('.favorite-btn');
        const contactButtons = document.querySelectorAll('.contact-seller-btn');
        const viewButtons = document.querySelectorAll('.view-product-btn');
        
        favoriteButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                this.removeFavorite(btn.getAttribute('data-product-id'));
            });
        });
        
        contactButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                const sellerId = btn.getAttribute('data-seller-id');
                this.contactSeller(sellerId);
            });
        });
        
        viewButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                const productId = btn.getAttribute('data-product-id');
                this.viewProductDetails(productId);
            });
        });
        
        // Eventos para filtros
        const filterTabs = document.querySelectorAll('.filter-tab');
        filterTabs.forEach(tab => {
            tab.addEventListener('click', () => {
                const filter = tab.getAttribute('data-filter');
                this.filterFavorites(filter);
            });
        });
    }

    removeFavorite(productId) {
        if (confirm('¿Quitar este producto de favoritos?')) {
            let favorites = JSON.parse(localStorage.getItem('utplace-favorites') || '[]');
            favorites = favorites.filter(f => f.id !== productId);
            localStorage.setItem('utplace-favorites', JSON.stringify(favorites));
            
            // Recargar vista
            this.loadFavorites();
            
            if (window.utplaceMarketplace) {
                window.utplaceMarketplace.showToast(
                    'Producto removido',
                    'El producto ha sido quitado de tus favoritos',
                    'success'
                );
            }
        }
    }

    contactSeller(sellerId) {
    // Ir a mensajes con el vendedor
    this.loadRoute('messages');
    }

    viewProductDetails(productId) {
    // Ver detalles del producto
    // Aquí se abriría modal de detalles o se iría a página del producto
    }

    filterFavorites(filter) {
        // Actualizar tab activo
        document.querySelectorAll('.filter-tab').forEach(tab => {
            tab.classList.remove('active');
        });
        document.querySelector(`[data-filter="${filter}"]`).classList.add('active');
        
        // Filtrar productos
        const products = document.querySelectorAll('.favorite-product');
        products.forEach(product => {
            let show = true;
            
            switch(filter) {
                case 'available':
                    show = !product.querySelector('.badge-unavailable');
                    break;
                case 'price-drop':
                    show = product.querySelector('.badge-price-drop');
                    break;
                case 'all':
                default:
                    show = true;
            }
            
            product.style.display = show ? 'block' : 'none';
        });
    }

    formatDate(dateString) {
        if (!dateString) return 'hace un momento';
        
        const date = new Date(dateString);
        const now = new Date();
        const diffTime = Math.abs(now - date);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        
        if (diffDays === 1) return 'ayer';
        if (diffDays < 7) return `hace ${diffDays} días`;
        if (diffDays < 30) return `hace ${Math.ceil(diffDays / 7)} semanas`;
        return date.toLocaleDateString();
    }

    initializeChat() {
        // Inicializar funcionalidad de chat
        setTimeout(() => {
            // Aquí se inicializaría WebSocket o polling para mensajes en tiempo real
        }, 100);
    }

    initializeSellForm() {
        // Inicializar formulario de venta
        setTimeout(() => {
            const sellForm = document.getElementById('sellForm');
            if (sellForm) {
                sellForm.addEventListener('submit', (e) => {
                    e.preventDefault();
                    this.handleSellSubmit(e);
                });
            }

            // Initialize all sell form features
            this.initializeCharCounters();
            this.initializeFileUpload();
            this.initializePriceHelper();
            this.bindSellFormEvents();
        }, 100);
    }

    initializeCharCounters() {
        // Character counters for inputs
        const titleInput = document.querySelector('input[maxlength="100"]');
        const descriptionTextarea = document.querySelector('textarea[maxlength="1000"]');

        if (titleInput) {
            const counter = titleInput.parentElement.querySelector('.char-counter');
            titleInput.addEventListener('input', () => {
                const length = titleInput.value.length;
                if (counter) counter.textContent = `${length}/100`;
            });
        }

        if (descriptionTextarea) {
            const counter = descriptionTextarea.parentElement.querySelector('.char-counter');
            descriptionTextarea.addEventListener('input', () => {
                const length = descriptionTextarea.value.length;
                if (counter) counter.textContent = `${length}/1000`;
            });
        }
    }

    initializeFileUpload() {
        const fileInput = document.getElementById('productImages');
        const uploadArea = document.querySelector('.file-upload-area');
        const previewGrid = document.getElementById('imagePreviewGrid');

        if (!fileInput || !uploadArea) return;

        // Click to upload
        uploadArea.addEventListener('click', (e) => {
            if (e.target.classList.contains('upload-link')) {
                fileInput.click();
            }
        });

        // Drag and drop
        uploadArea.addEventListener('dragover', (e) => {
            e.preventDefault();
            uploadArea.style.borderColor = 'var(--primary)';
            uploadArea.style.background = 'var(--primary-light)';
        });

        uploadArea.addEventListener('dragleave', (e) => {
            e.preventDefault();
            uploadArea.style.borderColor = 'var(--gray-300)';
            uploadArea.style.background = 'var(--gray-50)';
        });

        uploadArea.addEventListener('drop', (e) => {
            e.preventDefault();
            uploadArea.style.borderColor = 'var(--gray-300)';
            uploadArea.style.background = 'var(--gray-50)';
            
            const files = Array.from(e.dataTransfer.files);
            this.handleFileSelection(files);
        });

        // File input change
        fileInput.addEventListener('change', (e) => {
            const files = Array.from(e.target.files);
            this.handleFileSelection(files);
        });
    }

    handleFileSelection(files) {
        const previewGrid = document.getElementById('imagePreviewGrid');
        if (!previewGrid) return;

        // Limit to 5 images
        const selectedFiles = files.slice(0, 5);
        
        // Clear previous previews
        previewGrid.innerHTML = '';
        
        if (selectedFiles.length > 0) {
            previewGrid.style.display = 'grid';
            
            selectedFiles.forEach((file, index) => {
                if (file.type.startsWith('image/')) {
                    const reader = new FileReader();
                    reader.onload = (e) => {
                        const previewItem = document.createElement('div');
                        previewItem.className = 'preview-item';
                        previewItem.innerHTML = `
                            <img src="${e.target.result}" alt="Preview ${index + 1}" class="preview-image">
                            <button type="button" class="preview-remove" onclick="this.parentElement.remove()">
                                <i class="fas fa-times"></i>
                            </button>
                        `;
                        previewGrid.appendChild(previewItem);
                    };
                    reader.readAsDataURL(file);
                }
            });
        } else {
            previewGrid.style.display = 'none';
        }
    }

    initializePriceHelper() {
        const priceInput = document.querySelector('.price-input');
        const marketPriceBtn = document.querySelector('[data-action="market-price"]');

        if (marketPriceBtn) {
            marketPriceBtn.addEventListener('click', () => {
                // Simulate market price suggestion
                const suggestions = [299, 399, 499, 599, 799];
                const randomPrice = suggestions[Math.floor(Math.random() * suggestions.length)];
                
                if (priceInput) {
                    priceInput.value = randomPrice;
                    this.showToast('Precio sugerido', `Precio de mercado: $${randomPrice}`, 'info');
                }
            });
        }
    }

    bindSellFormEvents() {
        // Save draft functionality
        const saveDraftBtn = document.getElementById('saveDraft');
        if (saveDraftBtn) {
            saveDraftBtn.addEventListener('click', () => {
                this.saveDraft();
            });
        }

        // Cancel form
        const cancelBtn = document.getElementById('cancelForm');
        if (cancelBtn) {
            cancelBtn.addEventListener('click', () => {
                if (confirm('¿Seguro que quieres cancelar? Se perderán los cambios no guardados.')) {
                    this.loadRoute('home');
                }
            });
        }

        // Preview product
        const previewBtn = document.getElementById('previewProduct');
        if (previewBtn) {
            previewBtn.addEventListener('click', () => {
                this.showProductPreview();
            });
        }

        // Condition cards
        const conditionCards = document.querySelectorAll('.condition-card');
        conditionCards.forEach(card => {
            card.addEventListener('click', () => {
                const input = card.querySelector('input[type="radio"]');
                if (input) {
                    input.checked = true;
                    // Trigger change event for progress tracking
                    input.dispatchEvent(new Event('change'));
                }
            });
        });
    }

    saveDraft() {
        const formData = this.getFormData();
        localStorage.setItem('utplace-sell-draft', JSON.stringify({
            ...formData,
            savedAt: new Date().toISOString()
        }));
        
        this.showToast('Borrador guardado', 'Tu borrador se ha guardado correctamente', 'success');
    }

    showProductPreview() {
        const formData = this.getFormData();
        
        // Create preview modal content
        const previewHTML = `
            <div class="product-preview-modal">
                <div class="preview-header">
                    <h3>Vista previa del producto</h3>
                    <button type="button" class="close-preview">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                <div class="preview-content">
                    <div class="preview-product-card">
                        <div class="preview-images">
                            <div class="preview-main-image">
                                <i class="fas fa-image"></i>
                                <span>Imagen principal</span>
                            </div>
                        </div>
                        <div class="preview-info">
                            <h4>${formData.title || 'Título del producto'}</h4>
                            <p class="preview-price">$${formData.price || '0.00'}</p>
                            <p class="preview-condition">${this.getConditionLabel(formData.condition)}</p>
                            <p class="preview-location">${this.getLocationLabel(formData.location)}</p>
                            <div class="preview-description">
                                <p>${formData.description || 'Sin descripción'}</p>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="preview-actions">
                    <button type="button" class="btn btn-secondary close-preview">Cerrar</button>
                    <button type="button" class="btn btn-primary" onclick="document.getElementById('sellForm').requestSubmit()">Publicar ahora</button>
                </div>
            </div>
        `;

    // Show modal (this would need modal implementation)
    this.showToast('Vista previa', 'Funcionalidad de vista previa activada', 'info');
    }

    getFormData() {
        const form = document.getElementById('sellForm');
        if (!form) return {};

        return {
            title: form.querySelector('input[placeholder*="iPhone"]')?.value || '',
            category: form.querySelector('select')?.value || '',
            price: form.querySelector('.price-input')?.value || '',
            description: form.querySelector('textarea')?.value || '',
            location: form.querySelectorAll('select')[1]?.value || '',
            condition: form.querySelector('input[name="condition"]:checked')?.value || '',
            negotiable: form.querySelector('input[name="negotiable"]')?.checked || false,
            urgent: form.querySelector('input[name="urgent"]')?.checked || false,
            delivery: form.querySelector('input[name="delivery"]')?.checked || false
        };
    }

    getConditionLabel(condition) {
        const labels = {
            'new': 'Nuevo',
            'like-new': 'Como nuevo',
            'good': 'Buen estado',
            'fair': 'Estado regular'
        };
        return labels[condition] || 'No especificado';
    }

    getLocationLabel(location) {
        const labels = {
            'campus-central': 'Campus Central - Ciudad de Panamá',
            'campus-azuero': 'Campus Azuero - Los Santos',
            'campus-chiriqui': 'Campus Chiriquí - David',
            'campus-colon': 'Campus Colón - Colón',
            'campus-veraguas': 'Campus Veraguas - Santiago'
        };
        return labels[location] || 'Ubicación no especificada';
    }

    showToast(title, message, type = 'info') {
    // Simple toast notification
    // Create toast element
        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        toast.innerHTML = `
            <div class="toast-content">
                <strong>${title}</strong>
                <p>${message}</p>
            </div>
        `;
        
        document.body.appendChild(toast);
        
        // Auto remove after 3 seconds
        setTimeout(() => {
            toast.remove();
        }, 3000);
    }

    handleSellSubmit(e) {
        // Manejar envío del formulario de venta
        // Aquí se enviarían los datos al backend
        
        // Mostrar mensaje de éxito y redirigir
        if (window.utplaceMarketplace) {
            window.utplaceMarketplace.showToast(
                'Producto publicado',
                'Tu producto ha sido publicado exitosamente',
                'success'
            );
        }
        
        // Redirigir a home después de un delay
        setTimeout(() => {
            this.loadRoute('home');
        }, 2000);
    }

    loadUserProfile() {
        // Cargar datos del perfil de usuario
        setTimeout(() => {
            // Aquí se cargarían los datos del usuario desde localStorage o API
        }, 100);
    }

    // Método público para navegar programáticamente
    navigateTo(routeName) {
        this.loadRoute(routeName);
    }

    // Método para obtener la ruta actual
    getCurrentRoute() {
        return this.currentRoute;
    }

    // Reinicializar JavaScript del marketplace
    reinitializeMarketplaceJS() {
        // Reinicializar eventos del header después de que se carga dinámicamente
        if (window.utplaceMarketplace) {
            this.bindHeaderEvents();
            this.bindQuickActionsEvents();
        }
    }

    bindHeaderEvents() {
        // Search functionality
        const searchInput = document.getElementById('searchInput');
        const searchBtn = document.getElementById('searchBtn');
        
        if (searchInput) {
            searchInput.addEventListener('input', this.debounce(this.handleSearch.bind(this), 300));
            searchInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    e.preventDefault();
                    this.handleSearch();
                }
            });
        }
        
        if (searchBtn) {
            searchBtn.addEventListener('click', this.handleSearch.bind(this));
        }

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
        }

        // Messages button
        const messagesBtn = document.getElementById('messagesBtn');
        if (messagesBtn) {
            messagesBtn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                const messagesModal = document.getElementById('headerMessagesModal');
                const overlay = document.getElementById('messagesOverlay');
                if (messagesModal && overlay) {
                    messagesModal.classList.add('active');
                    overlay.classList.add('active');
                }
            });
        }

        // User dropdown
        const userBtn = document.getElementById('userBtn');
        const userDropdown = document.getElementById('userDropdown');
        
        if (userBtn && userDropdown) {
            userBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                userDropdown.classList.toggle('active');
            });
            
            document.addEventListener('click', (e) => {
                if (!userDropdown.contains(e.target) && !userBtn.contains(e.target)) {
                    userDropdown.classList.remove('active');
                }
            });
        }

        // Notifications dropdown
        const notificationsBtn = document.getElementById('notificationsBtn');
        const notificationsDropdown = document.getElementById('notificationsDropdown');
        
        if (notificationsBtn && notificationsDropdown) {
            notificationsBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                notificationsDropdown.classList.toggle('active');
            });

            document.addEventListener('click', () => {
                notificationsDropdown.classList.remove('active');
            });
        }
    }

    bindQuickActionsEvents() {
        // Quick Actions events
        setTimeout(() => {
            const quickActions = document.querySelectorAll('.quick-action');
            quickActions.forEach(action => {
                action.addEventListener('click', (e) => {
                    const route = action.getAttribute('data-route');
                    if (route) {
                        this.loadRoute(route);
                    }
                });
            });
        }, 100);
    }

    handleSearch() {
        const searchInput = document.getElementById('searchInput');
        if (searchInput && window.utplaceMarketplace) {
            const query = searchInput.value.trim();
            if (query) {
                window.utplaceMarketplace.searchProducts(query);
                // Asegurar que estamos en la vista home para mostrar resultados
                if (this.currentRoute !== 'home') {
                    this.loadRoute('home');
                }
            }
        }
    }

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
}

// Inicializar router cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    window.spaRouter = new SPARouter();
});
