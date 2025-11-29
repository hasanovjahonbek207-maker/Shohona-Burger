// Loading Screen
window.addEventListener('load', () => {
    const loadingScreen = document.getElementById('loadingScreen');
    setTimeout(() => {
        loadingScreen.classList.add('hidden');
    }, 1234);
});

// Theme Toggle
const themeToggle = document.getElementById('themeToggle');
const body = document.body;

themeToggle.addEventListener('click', () => {
    body.classList.toggle('dark-mode');

    if (body.classList.contains('dark-mode')) {
        themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
    } else {
        themeToggle.innerHTML = '<i class="fas fa-moon"></i>';
    }
});

// Contact Sidebar Toggle
const mobileContactBtn = document.getElementById('mobileContactBtn');
const contactSidebar = document.getElementById('contactSidebar');
const closeContact = document.getElementById('closeContact');

mobileContactBtn.addEventListener('click', () => {
    contactSidebar.classList.add('active');
});

closeContact.addEventListener('click', () => {
    contactSidebar.classList.remove('active');
});

// Close contact sidebar when clicking outside
document.addEventListener('click', (e) => {
    if (!contactSidebar.contains(e.target) &&
        !mobileContactBtn.contains(e.target) &&
        contactSidebar.classList.contains('active')) {
        contactSidebar.classList.remove('active');
    }
});

// === SAVAT TIZIMI ===
let cart = [];

// Savatni yangilash
function updateCart() {
    const cartItems = document.getElementById('cartItems');
    const totalPrice = document.getElementById('totalPrice');
    const cartCount = document.getElementById('cartCount');
    
    if (!cartItems || !totalPrice || !cartCount) return;
    
    // Agar savat bo'sh bo'lsa
    if (cart.length === 0) {
        cartItems.innerHTML = '<p style="text-align: center; color: #666; padding: 40px;">Savatingiz bo\'sh</p>';
        totalPrice.textContent = '0 so\'m';
        cartCount.textContent = '0';
        return;
    }
    
    // Savat mahsulotlarini ko'rsatish
    cartItems.innerHTML = cart.map((item, index) => `
        <div class="cart-item">
            <img src="${item.image}" alt="${item.name}" width="80" height="80">
            <div class="cart-item-details" style="flex: 1;">
                <h4>${item.name}</h4>
                <p class="cart-item-price">${item.price.toLocaleString()} so'm</p>
                <div style="display: flex; gap: 10px; align-items: center; margin-top: 8px;">
                    <button class="qty-btn" onclick="changeQuantity(${index}, -1)">-</button>
                    <span style="font-weight: bold; font-size: 16px;">${item.quantity}</span>
                    <button class="qty-btn" onclick="changeQuantity(${index}, 1)">+</button>
                </div>
            </div>
            <button class="remove-btn" onclick="removeFromCart(${index})">
                <i class="fas fa-trash"></i>
            </button>
        </div>
    `).join('');
    
    // Jami narxni hisoblash
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    totalPrice.textContent = total.toLocaleString() + ' so\'m';
    
    // Savat sonini yangilash
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCount.textContent = totalItems;
}

// Savatga qo'shish
function addToCart(name, price, image) {
    const existingItem = cart.find(item => item.name === name);
    
    if (existingItem) {
        existingItem.quantity++;
    } else {
        cart.push({
            name: name,
            price: price,
            image: image,
            quantity: 1
        });
    }
    
    updateCart();
    
    // Qo'shildi xabari
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: #10b981;
        color: white;
        padding: 15px 25px;
        border-radius: 10px;
        z-index: 10000;
        animation: slideIn 0.3s ease;
        box-shadow: 0 4px 15px rgba(16, 185, 129, 0.4);
    `;
    notification.innerHTML = `<i class="fas fa-check-circle"></i> Savatga qo'shildi!`;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 2000);
}

// Miqdorni o'zgartirish
function changeQuantity(index, change) {
    cart[index].quantity += change;
    
    if (cart[index].quantity <= 0) {
        cart.splice(index, 1);
    }
    
    updateCart();
}

// Savatdan o'chirish
function removeFromCart(index) {
    cart.splice(index, 1);
    updateCart();
}

// Savat modalni ochish/yopish
const cartBtn = document.getElementById('cartBtn');
const cartModal = document.getElementById('cartModal');
const closeCart = document.getElementById('closeCart');

if (cartBtn) {
    cartBtn.addEventListener('click', () => {
        cartModal.classList.add('active');
    });
}

if (closeCart) {
    closeCart.addEventListener('click', () => {
        cartModal.classList.remove('active');
    });
}

if (cartModal) {
    cartModal.addEventListener('click', (e) => {
        if (e.target === cartModal) {
            cartModal.classList.remove('active');
        }
    });
}

// Buyurtma berish
const checkoutBtn = document.querySelector('.checkout-btn');
if (checkoutBtn) {
    checkoutBtn.addEventListener('click', () => {
        if (cart.length === 0) {
            alert('Savatingiz bo\'sh!');
            return;
        }
        
        // Buyurtma formasini ko'rsatish
        showOrderForm();
    });
}

// Buyurtma formasini ko'rsatish
function showOrderForm() {
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    
    const formHTML = `
        <div class="order-form-overlay" id="orderFormOverlay">
            <div class="order-form-content">
                <h2>📋 Buyurtma ma'lumotlari</h2>
                <form id="orderForm">
                    <div class="form-group">
                        <label>👤 Ism va Familiya *</label>
                        <input type="text" id="customerName" required placeholder="Masalan: Alisher Aliyev">
                    </div>
                    
                    <div class="form-group">
                        <label>📱 Telefon raqam *</label>
                        <input type="tel" id="customerPhone" required placeholder="+998 90 123 45 67">
                    </div>
                    
                    <div class="form-group">
                        <label>🕐 Qaysi soatda yetkazish? *</label>
                        <input type="time" id="deliveryTime" required>
                    </div>
                    
                    <div class="order-summary">
                        <h3>📦 Buyurtma:</h3>
                        ${cart.map(item => `
                            <div class="summary-item">
                                <span>${item.name} x${item.quantity}</span>
                                <span>${(item.price * item.quantity).toLocaleString()} so'm</span>
                            </div>
                        `).join('')}
                        <div class="summary-total">
                            <strong>Jami:</strong>
                            <strong>${total.toLocaleString()} so'm</strong>
                        </div>
                    </div>
                    
                    <div class="form-buttons">
                        <button type="button" class="cancel-btn" onclick="closeOrderForm()">Bekor qilish</button>
                        <button type="submit" class="submit-btn">✅ Buyurtma berish</button>
                    </div>
                </form>
            </div>
        </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', formHTML);
    
    // Form submit
    document.getElementById('orderForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        await sendOrderToTelegram();
    });
}

// Formani yopish
function closeOrderForm() {
    const overlay = document.getElementById('orderFormOverlay');
    if (overlay) {
        overlay.remove();
    }
}

// Telegram botga yuborish
async function sendOrderToTelegram() {
    const name = document.getElementById('customerName').value;
    const phone = document.getElementById('customerPhone').value;
    const time = document.getElementById('deliveryTime').value;
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    
    const submitBtn = document.querySelector('.submit-btn');
    submitBtn.disabled = true;
    submitBtn.textContent = 'Yuborilmoqda...';
    
    try {
        const response = await fetch('send_order.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                name: name,
                phone: phone,
                time: time,
                items: cart,
                total: total
            })
        });
        
        const result = await response.json();
        
        if (result.success) {
            alert('✅ Buyurtma muvaffaqiyatli yuborildi!\n\nTez orada aloqaga chiqamiz.');
            closeOrderForm();
            cart = [];
            updateCart();
            cartModal.classList.remove('active');
        } else {
            alert('❌ Xatolik yuz berdi. Iltimos qayta urinib ko\'ring.');
        }
    } catch (error) {
        alert('❌ Tarmoq xatosi. Internetni tekshiring.');
        console.error('Error:', error);
    } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = '✅ Buyurtma berish';
    }
}

// Menu Category Filter
const sidebarMenuItems = document.querySelectorAll('.sidebar .menu-item');
const mobileMenuItems = document.querySelectorAll('.mobile-menu .menu-item');
const menuSections = document.querySelectorAll('.menu-section');

function filterMenuCategories(category) {
    menuSections.forEach(section => {
        const sectionCategory = section.getAttribute('data-category');

        if (category === 'hammasi') {
            // Show all sections
            section.classList.remove('hidden');
            setTimeout(() => {
                section.classList.add('visible');
            }, 100);
        } else {
            // Show only selected category
            if (sectionCategory === category) {
                section.classList.remove('hidden');
                setTimeout(() => {
                    section.classList.add('visible');
                }, 100);
            } else {
                section.classList.remove('visible');
                section.classList.add('hidden');
            }
        }
    });
}

// Desktop Sidebar Menu Navigation
sidebarMenuItems.forEach(item => {
    item.addEventListener('click', () => {
        const category = item.getAttribute('data-category');

        // Remove active class from all items
        sidebarMenuItems.forEach(menuItem => menuItem.classList.remove('active'));
        mobileMenuItems.forEach(menuItem => menuItem.classList.remove('active'));

        // Add active class to clicked item
        item.classList.add('active');

        // Sync with mobile menu
        mobileMenuItems.forEach(mobileItem => {
            if (mobileItem.getAttribute('data-category') === category) {
                mobileItem.classList.add('active');
            }
        });

        // Filter categories
        filterMenuCategories(category);

        // Scroll to top of menu container
        window.scrollTo({
            top: document.querySelector('.hero').offsetHeight,
            behavior: 'smooth'
        });
    });
});

// Mobile Menu Navigation
const menuCarousel = document.querySelector('.menu-carousel');

mobileMenuItems.forEach(item => {
    item.addEventListener('click', () => {
        const category = item.getAttribute('data-category');

        // Remove active class from all mobile menu items
        mobileMenuItems.forEach(menuItem => menuItem.classList.remove('active'));
        sidebarMenuItems.forEach(menuItem => menuItem.classList.remove('active'));

        // Add active class to clicked item
        item.classList.add('active');

        // Sync with desktop menu
        sidebarMenuItems.forEach(sidebarItem => {
            if (sidebarItem.getAttribute('data-category') === category) {
                sidebarItem.classList.add('active');
            }
        });

        // Filter categories
        filterMenuCategories(category);

        // Scroll to top of menu container
        window.scrollTo({
            top: document.querySelector('.hero').offsetHeight,
            behavior: 'smooth'
        });

        // Center the active item in carousel
        if (menuCarousel) {
            const itemRect = item.getBoundingClientRect();
            const carouselRect = menuCarousel.getBoundingClientRect();
            const scrollLeft = item.offsetLeft - (carouselRect.width / 2) + (itemRect.width / 2);

            menuCarousel.scrollTo({
                left: scrollLeft,
                behavior: 'smooth'
            });
        }
    });
});

// Initialize - Show all categories on load
window.addEventListener('load', () => {
    setTimeout(() => {
        filterMenuCategories('hammasi');

        // Center active item in mobile carousel
        if (window.innerWidth <= 768 && menuCarousel) {
            const activeItem = document.querySelector('.mobile-menu .menu-item.active');
            if (activeItem) {
                const itemRect = activeItem.getBoundingClientRect();
                const carouselRect = menuCarousel.getBoundingClientRect();
                const scrollLeft = activeItem.offsetLeft - (carouselRect.width / 2) + (itemRect.width / 2);

                menuCarousel.scrollTo({
                    left: scrollLeft,
                    behavior: 'smooth'
                });
            }
        }
    }, 2100);
});

// Handle window resize
let resizeTimer;
window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
        // Recalculate carousel position if on mobile
        if (window.innerWidth <= 768 && menuCarousel) {
            const activeItem = document.querySelector('.mobile-menu .menu-item.active');
            if (activeItem) {
                const itemRect = activeItem.getBoundingClientRect();
                const carouselRect = menuCarousel.getBoundingClientRect();
                const scrollLeft = activeItem.offsetLeft - (carouselRect.width / 2) + (itemRect.width / 2);

                menuCarousel.scrollTo({
                    left: scrollLeft,
                    behavior: 'smooth'
                });
            }
        }
    }, 250);
});