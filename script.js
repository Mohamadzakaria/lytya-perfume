const PERFUMES_DATA = [
    {
        id: 1,
        title: "Lytya Signature Perfume",
        notes: "Girlhood in a bottle ✨",
        img: "images/lytya-perfume.jpeg",
        badge: "Our Scent",
        sizes: [
            { size: "50ml", price: 18.00 },
            { size: "100ml", price: 23.00 }
        ]
    },
    {
        id: 2,
        title: "Glow Tanning Oil",
        notes: "Golden glow & deep hydration ☀️",
        img: "images/tanning-oil.jpeg",
        badge: "Summer Essential",
        sizes: [
            { size: "60ml", price: 18.00 }
        ]
    },
    {
        id: 3,
        title: "Lytya Body Oil",
        notes: "Glow • Nourish • Soften ✨ A luxury perfumed body oil for ultimate softness and deep hydration.",
        img: "images/body-oil.jpeg",
        sizes: [
            { size: "60ml", price: 15.00 },
            { size: "100ml", price: 18.00 }
        ]
    },
    {
        id: 4,
        title: "Lytya Loofah Soap",
        notes: "Natural Exfoliation • Radiant Skin 🌸 Gently exfoliates and deeply cleanses your skin.",
        img: "images/loofah-soap.jpeg",
        sizes: [
            { size: "Standard", price: 8.00 }
        ]
    },
    {
        id: 5,
        title: "Lytya Body Splash",
        notes: "Fresh • Floral • Invigorating ⚡ A refreshing body mist with a captivating floral scent.",
        img: "images/body-splash.jpeg",
        sizes: [
            { size: "60ml", price: 15.00 },
            { size: "100ml", price: 18.00 }
        ]
    }
];


function renderProducts() {
    const productsContainer = document.getElementById('products-container');
    if(!productsContainer) return;
    productsContainer.innerHTML = ''; 

    PERFUMES_DATA.forEach(perfume => {
        const badgeHTML = perfume.badge ? `<span class="badge">${perfume.badge}</span>` : '';
        
        
        let optionsHTML = '';
        perfume.sizes.forEach((s, index) => {
            optionsHTML += `<option value="${s.size}" data-price="${s.price}">${s.size} - $${s.price.toFixed(2)}</option>`;
        });
        
        const productHTML = `
            <div class="product-card" id="product-${perfume.id}">
                <div class="product-image-container">
                    <img src="${perfume.img}" alt="${perfume.title}" class="product-img">
                    ${badgeHTML}
                    <button class="quick-add-btn" data-id="${perfume.id}" data-title="${perfume.title}" data-img="${perfume.img}">Quick Add +</button>
                </div>
                <div class="product-info">
                    <h3>${perfume.title}</h3>
                    <p class="product-notes">${perfume.notes}</p>
                    
                    <!-- إضافة قائمة اختيار الحجم -->
                    <div class="size-selector-container">
                        <label>Size: </label>
                        <select class="size-select" onchange="updateProductPriceDisplay(${perfume.id}, this)">
                            ${optionsHTML}
                        </select>
                    </div>

                    <!-- عرض السعر الافتراضي للحجم الأول -->
                    <p class="product-price">$${perfume.sizes[0].price.toFixed(2)}</p>
                </div>
            </div>
        `;
        productsContainer.insertAdjacentHTML('beforeend', productHTML);
    });
}


window.updateProductPriceDisplay = function(id, selectElement) {
    const selectedOption = selectElement.options[selectElement.selectedIndex];
    const newPrice = parseFloat(selectedOption.getAttribute('data-price'));
    const productCard = document.getElementById(`product-${id}`);
    if (productCard) {
        productCard.querySelector('.product-price').innerText = `$${newPrice.toFixed(2)}`;
    }
}

renderProducts();


const cartIcon = document.querySelector('.cart-icon');
const sideCart = document.getElementById('side-cart');
const cartOverlay = document.getElementById('cart-overlay');
const closeCartBtn = document.getElementById('close-cart-btn');
const cartItemsContainer = document.getElementById('cart-items-container');
const cartTotalPrice = document.getElementById('cart-total-price');

const checkoutBtn = document.querySelector('.checkout-btn');
const checkoutModal = document.getElementById('checkout-modal');
const closeCheckoutBtn = document.getElementById('close-checkout-btn');
const checkoutTotalDisplay = document.getElementById('checkout-total-display');

const mobileMenuBtn = document.getElementById('mobile-menu-btn');
const navMenu = document.getElementById('nav-menu');

let cart = [];

mobileMenuBtn.addEventListener('click', () => {
    navMenu.classList.toggle('mobile-active');
    mobileMenuBtn.innerHTML = navMenu.classList.contains('mobile-active') ? `<i class="fas fa-times"></i>` : `<i class="fas fa-bars"></i>`;
});

document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
        navMenu.classList.remove('mobile-active');
        mobileMenuBtn.innerHTML = `<i class="fas fa-bars"></i>`;
    });
});

function openCart() {
    sideCart.classList.add('active');
    cartOverlay.classList.add('active');
}

function closeCart() {
    sideCart.classList.remove('active');
    if(!checkoutModal.classList.contains('active')) {
        cartOverlay.classList.remove('active');
    }
}

function openCheckout() {
    if (cart.length === 0) {
        alert("Your cart is empty!");
        return;
    }
    closeCart(); 
    let total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    checkoutTotalDisplay.innerText = `$${total.toFixed(2)}`;
    checkoutModal.classList.add('active');
    cartOverlay.classList.add('active'); 
}

function closeCheckout() {
    checkoutModal.classList.remove('active');
    cartOverlay.classList.remove('active');
}

cartIcon.addEventListener('click', openCart);
closeCartBtn.addEventListener('click', closeCart);
checkoutBtn.addEventListener('click', openCheckout);
closeCheckoutBtn.addEventListener('click', closeCheckout);

cartOverlay.addEventListener('click', () => {
    closeCart();
    closeCheckout();
});


document.getElementById('products-container').addEventListener('click', (e) => {
    if (e.target.classList.contains('quick-add-btn')) {
        const id = e.target.getAttribute('data-id');
        const title = e.target.getAttribute('data-title');
        const imgSrc = e.target.getAttribute('data-img');

        const productCard = document.getElementById(`product-${id}`);
        const sizeSelect = productCard.querySelector('.size-select');
        const selectedSize = sizeSelect.value;
        const selectedPrice = parseFloat(sizeSelect.options[sizeSelect.selectedIndex].getAttribute('data-price'));

        addToCart(title, selectedPrice, selectedSize, imgSrc);
        openCart();
    }
});

function addToCart(title, price, size, imgSrc) {
    const existingItem = cart.find(item => item.title === title && item.size === size);
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({ title, price, size, imgSrc, quantity: 1 });
    }
    updateCartUI();
}

function updateCartUI() {
    cartItemsContainer.innerHTML = '';
    if (cart.length === 0) {
        cartItemsContainer.innerHTML = '<p class="empty-msg">Your cart is currently empty.</p>';
        cartIcon.innerHTML = `<i class="fas fa-shopping-bag"></i> Cart (0)`;
        cartTotalPrice.innerText = '$0.00';
        return;
    }

    let total = 0;
    let totalItems = 0;

    cart.forEach(item => {
        total += item.price * item.quantity;
        totalItems += item.quantity;
        const cartItemHTML = `
            <div class="cart-item" style="display: flex; align-items: center; margin-bottom: 20px; gap: 15px; border-bottom: 1px solid #f9f6f0; padding-bottom: 15px;">
                <img src="${item.imgSrc}" style="width: 60px; height: 75px; object-fit: cover;">
                <div style="flex: 1;">
                    <h4 style="margin: 0 0 3px 0; font-family: 'Playfair Display', serif; font-size: 16px; color: #4a3838;">${item.title} (${item.size})</h4>
                    <p style="margin: 0; font-size: 14px; color: #8c7676;">$${item.price.toFixed(2)} x ${item.quantity}</p>
                </div>
                <button class="remove-item-btn" onclick="removeFromCart('${item.title}', '${item.size}')" style="background: none; border: none; color: #e2a4a4; cursor: pointer; font-size: 18px;">&times;</button>
            </div>
        `;
        cartItemsContainer.insertAdjacentHTML('beforeend', cartItemHTML);
    });

    cartTotalPrice.innerText = `$${total.toFixed(2)}`;
    cartIcon.innerHTML = `<i class="fas fa-shopping-bag"></i> Cart (${totalItems})`;
}

window.removeFromCart = function(title, size) {
    cart = cart.filter(item => !(item.title === title && item.size === size));
    updateCartUI();
};



// ==========================================
// 3. نظام إرسال الطلبات مباشرة إلى الواتساب
// ==========================================

// ⚠️ ضعي رقم الواتساب الخاص بالعمل هنا (مع رمز الدولة بدون أصفار أو علامة +)
// مثال لرمز لبنان: 96170000000
const WHATSAPP_NUMBER = "96181572240"; 

const checkoutForm = document.getElementById('checkout-form');
if (checkoutForm) {
    checkoutForm.addEventListener('submit', (e) => {
        e.preventDefault();

        // 1. جمع بيانات العميل
        const name = document.getElementById('customer-name').value;
        const phone = document.getElementById('customer-phone').value;
        const address = document.getElementById('customer-address').value;

        // 2. تجهيز قائمة المنتجات من السلة وتنسيقها
        let itemsText = "";
        cart.forEach((item, index) => {
            itemsText += `${index + 1}.  *${item.title}*\n`;
            itemsText += `     Size: ${item.size}\n`;
            itemsText += `     Qty: ${item.quantity}\n`;
            itemsText += `     Price: $${(item.price * item.quantity).toFixed(2)}\n\n`;
        });

        // 3. حساب المجموع الإجمالي
        const totalAmount = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0).toFixed(2);

        // 4. صياغة نص الرسالة الاحترافية بالكامل
        const message = 
` *New Order - Lytya Perfume* 

 *Customer Details:*
--------------------------
• *Name:* ${name}
• *Phone:* ${phone}
• *Address:* ${address}

 *Order Items:*
--------------------------
${itemsText} *Total Amount:* $${totalAmount}
--------------------------
Thank you for shopping with Lytya! `;

        // 5. ترميز النص ليقبله رابط المتصفح (URL Encoding)
        const encodedMessage = encodeURIComponent(message);

        // 6. إنشاء رابط الواتساب (يعمل على الكمبيوتر والهاتف)
        const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodedMessage}`;

        // 7. فتح الواتساب في تبويب جديد وتفريغ السلة
        window.open(whatsappUrl, '_blank');

        // تفريغ السلة وإغلاق نافذة الدفع في الموقع
        cart = [];
        updateCartUI();
        closeCheckout();
    });
}
