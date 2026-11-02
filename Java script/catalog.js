document.addEventListener('DOMContentLoaded', () => {
    const products = [
        {
            id: 'performance-t-shirt',
            name: 'Performance T-Shirt',
            category: 'Tops',
            price: 200,
            stock: 'In stock',
            description: 'Comfortable gym shirt suitable for training.',
            images: ['images/image1pm.jpg', 'images/image1pw.jpg']
        },
        {
            id: 'gym-leggings',
            name: 'Gym Leggings',
            category: 'Bottoms',
            price: 200,
            stock: 'Low stock',
            description: 'Comfortable active wear for workouts.',
            images: ['images/image1lw.jpg', 'images/image2lw.jpg']
        },
        {
            id: 'training-shorts',
            name: 'Training Shorts',
            category: 'Bottoms',
            price: 250,
            stock: 'In stock',
            description: 'Lightweight shorts designed for active movement.',
            images: ['images/image1tsm.jpg', 'images/image2tsm.jpg']
        },
        {
            id: 'sports-bra',
            name: 'Sports Bra',
            category: 'Tops',
            price: 189,
            stock: 'In stock',
            description: 'Supportive active wear for fitness activities.',
            images: ['images/image1sbw.jpg', 'images/image2sbw.jpg']
        },
        {
            id: 'gym-hoodie',
            name: 'Gym Hoodie',
            category: 'Outerwear',
            price: 450,
            stock: 'Limited stock',
            description: 'Comfortable hoodie for warm-ups and casual wear.',
            images: ['images/image1H.jpg', 'images/image2H.jpg']
        }
    ];

    const stores = [
        { city: 'Johannesburg', address: 'Sandton City, Johannesburg' },
        { city: 'Cape Town', address: 'Claremont, Cape Town' },
        { city: 'Durban', address: 'Musgrave, Durban' }
    ];

    const productGrid = document.getElementById('product-grid');
    const searchInput = document.getElementById('product-search');
    const categoryFilter = document.getElementById('category-filter');
    const emptyState = document.getElementById('empty-state');
    const modal = document.getElementById('image-modal');
    const modalImage = document.getElementById('modal-image');
    const closeModal = document.getElementById('close-modal');
    const storeList = document.getElementById('store-list');

    function renderProducts(filteredProducts) {
        if (!productGrid) {
            return;
        }

        productGrid.innerHTML = filteredProducts.map((product) => `
            <article class="product-card">
                <h3>${product.name}</h3>
                <div class="product-images">
                    <button class="product-image-button" type="button" data-product-id="${product.id}" aria-label="Open larger image for ${product.name}">
                        <img src="${product.images[0]}" alt="${product.name}">
                    </button>
                </div>
                <p>${product.description}</p>
                <div class="product-meta">
                    <span>${product.category}</span>
                    <span class="status-badge">${product.stock}</span>
                </div>
                <p class="price">Price: R${product.price}</p>
                <button class="secondary-button" type="button" data-product-id="${product.id}">View Full Image</button>
            </article>
        `).join('');

        if (emptyState) {
            emptyState.classList.toggle('hidden', filteredProducts.length > 0);
        }
    }

    function renderStores() {
        if (!storeList) {
            return;
        }

        storeList.innerHTML = stores.map((store) => `
            <article class="store-card">
                <h4>${store.city}</h4>
                <p>${store.address}</p>
            </article>
        `).join('');
    }

    function applyFilters() {
        const query = searchInput ? searchInput.value.trim().toLowerCase() : '';
        const selectedCategory = categoryFilter ? categoryFilter.value : 'All';

        const filteredProducts = products.filter((product) => {
            const matchesSearch = product.name.toLowerCase().includes(query);
            const matchesCategory = selectedCategory === 'All' || product.category === selectedCategory;
            return matchesSearch && matchesCategory;
        });

        renderProducts(filteredProducts);
    }

    if (searchInput) {
        searchInput.addEventListener('input', applyFilters);
    }

    if (categoryFilter) {
        categoryFilter.addEventListener('change', applyFilters);
    }

    function openModal(productId) {
        const product = products.find((item) => item.id === productId);
        if (!product || !modal || !modalImage) {
            return;
        }

        modalImage.src = product.images[0];
        modalImage.alt = product.name;
        modal.classList.remove('hidden');
        modal.setAttribute('aria-hidden', 'false');
    }

    function closeLightbox() {
        if (!modal) {
            return;
        }

        modal.classList.add('hidden');
        modal.setAttribute('aria-hidden', 'true');
    }

    document.addEventListener('click', (event) => {
        const button = event.target.closest('[data-product-id]');
        if (button) {
            openModal(button.dataset.productId);
        }
    });

    if (closeModal) {
        closeModal.addEventListener('click', closeLightbox);
    }

    if (modal) {
        modal.addEventListener('click', (event) => {
            if (event.target === modal) {
                closeLightbox();
            }
        });
    }

    renderProducts(products);
    renderStores();

    const enquiryForm = document.getElementById('enquiry-form');
    if (enquiryForm) {
        const nameField = document.getElementById('customer-name');
        const emailField = document.getElementById('customer-email');
        const productField = document.getElementById('enquiry-product');
        const sizeField = document.getElementById('size');
        const quantityField = document.getElementById('quantity');
        const summaryBox = document.getElementById('enquiry-summary');

        const productList = products.map((product) => `
            <option value="${product.id}">${product.name}</option>
        `).join('');

        if (productField) {
            productField.innerHTML = productList;
        }

        function setFieldError(fieldId, message) {
            const field = document.getElementById(fieldId);
            const errorNode = document.getElementById(`${fieldId}-error`);
            if (field) {
                field.setAttribute('aria-invalid', 'true');
            }
            if (errorNode) {
                errorNode.textContent = message;
            }
        }

        function clearFieldError(fieldId) {
            const field = document.getElementById(fieldId);
            const errorNode = document.getElementById(`${fieldId}-error`);
            if (field) {
                field.removeAttribute('aria-invalid');
            }
            if (errorNode) {
                errorNode.textContent = '';
            }
        }

        function updateSummary() {
            if (!summaryBox || !productField || !quantityField) {
                return;
            }

            const selectedProduct = products.find((product) => product.id === productField.value);
            const quantity = Number(quantityField.value) || 0;

            if (!selectedProduct || quantity < 1) {
                summaryBox.classList.add('hidden');
                return;
            }

            const total = selectedProduct.price * quantity;
            summaryBox.classList.remove('hidden');
            summaryBox.innerHTML = `
                <h3>Estimated order summary</h3>
                <p><strong>Item:</strong> ${selectedProduct.name}</p>
                <p><strong>Availability:</strong> ${selectedProduct.stock}</p>
                <p><strong>Price:</strong> R${selectedProduct.price} each</p>
                <p><strong>Quantity:</strong> ${quantity}</p>
                <p><strong>Estimated total:</strong> R${total}</p>
                <p>Next step: our team will confirm the exact stock and delivery details for your selected size.</p>
            `;
        }

        if (productField) {
            productField.addEventListener('change', updateSummary);
        }

        if (quantityField) {
            quantityField.addEventListener('input', updateSummary);
        }

        enquiryForm.addEventListener('submit', (event) => {
            event.preventDefault();

            let valid = true;
            const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

            const name = nameField ? nameField.value.trim() : '';
            const email = emailField ? emailField.value.trim() : '';
            const selectedProduct = productField ? productField.value : '';
            const size = sizeField ? sizeField.value : '';
            const quantity = Number(quantityField ? quantityField.value : 0);

            if (!name) {
                setFieldError('customer-name', 'Please enter your full name.');
                valid = false;
            } else {
                clearFieldError('customer-name');
            }

            if (!email || !emailPattern.test(email)) {
                setFieldError('customer-email', 'Please enter a valid email address.');
                valid = false;
            } else {
                clearFieldError('customer-email');
            }

            if (!selectedProduct) {
                setFieldError('enquiry-product', 'Please select a product.');
                valid = false;
            } else {
                clearFieldError('enquiry-product');
            }

            if (!size) {
                setFieldError('size', 'Please choose a size.');
                valid = false;
            } else {
                clearFieldError('size');
            }

            if (!quantity || quantity < 1) {
                setFieldError('quantity', 'Please enter a quantity of at least 1.');
                valid = false;
            } else {
                clearFieldError('quantity');
            }

            if (!valid) {
                return;
            }

            const chosenProduct = products.find((product) => product.id === selectedProduct);
            const total = chosenProduct ? chosenProduct.price * quantity : 0;

            if (summaryBox) {
                summaryBox.classList.remove('hidden');
                summaryBox.innerHTML = `
                    <h3>Request submitted successfully</h3>
                    <p><strong>Name:</strong> ${name}</p>
                    <p><strong>Product:</strong> ${chosenProduct ? chosenProduct.name : 'Selected item'}</p>
                    <p><strong>Size:</strong> ${size}</p>
                    <p><strong>Quantity:</strong> ${quantity}</p>
                    <p><strong>Estimated total:</strong> R${total}</p>
                    <p>Our team will contact you soon with stock confirmation and the next steps.</p>
                `;
            }

            enquiryForm.reset();
            if (productField) {
                productField.innerHTML = productList;
            }
        });
    }

    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        const messageBox = document.getElementById('contact-message-output');

        contactForm.addEventListener('submit', (event) => {
            event.preventDefault();

            const fullName = document.getElementById('contact-name');
            const email = document.getElementById('contact-email');
            const subject = document.getElementById('contact-subject');
            const message = document.getElementById('contact-message');
            const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

            let valid = true;

            const clearError = (fieldId) => {
                const field = document.getElementById(fieldId);
                const error = document.getElementById(`${fieldId}-error`);
                if (field) field.removeAttribute('aria-invalid');
                if (error) error.textContent = '';
            };

            const showError = (fieldId, text) => {
                const field = document.getElementById(fieldId);
                const error = document.getElementById(`${fieldId}-error`);
                if (field) field.setAttribute('aria-invalid', 'true');
                if (error) error.textContent = text;
                valid = false;
            };

            if (!fullName || !fullName.value.trim()) {
                showError('contact-name', 'Please enter your full name.');
            } else {
                clearError('contact-name');
            }

            if (!email || !email.value.trim() || !emailPattern.test(email.value.trim())) {
                showError('contact-email', 'Please enter a valid email address.');
            } else {
                clearError('contact-email');
            }

            if (!subject || !subject.value) {
                showError('contact-subject', 'Please choose a message type.');
            } else {
                clearError('contact-subject');
            }

            if (!message || !message.value.trim()) {
                showError('contact-message', 'Please write a message before sending.');
            } else {
                clearError('contact-message');
            }

            if (!valid) {
                return;
            }

            const mailtoMessage = `Name: ${fullName.value.trim()}\nEmail: ${email.value.trim()}\nSubject: ${subject.value}\n\n${message.value.trim()}`;
            const mailtoLink = `mailto:info@shadifitflex.co.za?subject=${encodeURIComponent(subject.value)}&body=${encodeURIComponent(mailtoMessage)}`;

            if (messageBox) {
                messageBox.textContent = 'Your email app should open now with your message ready to send.';
                messageBox.classList.remove('hidden');
            }

            window.location.href = mailtoLink;
            contactForm.reset();
        });
    }
});
