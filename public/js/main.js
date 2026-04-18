// 📍 Location Gate Logic
document.addEventListener('DOMContentLoaded', () => {
    checkLocationAccess();
});

function checkLocationAccess() {
    const hasAccess = sessionStorage.getItem('jashpurAccessGranted');
    if (hasAccess) {
        unlockWebsite();
    }
}

function verifyLocation() {
    const city = document.getElementById('cityInput').value.trim().toLowerCase();
    const pin = document.getElementById('pinInput').value.trim();
    const errorMsg = document.getElementById('locationError');

    if (city === 'jashpur' || pin === '496331') {
        sessionStorage.setItem('jashpurAccessGranted', 'true');
        unlockWebsite();
    } else {
        errorMsg.style.display = 'block';
    }
}

function unlockWebsite() {
    document.getElementById('locationGate').classList.add('hidden');
    document.getElementById('mainHeader').classList.remove('hidden');
    document.getElementById('mainContent').classList.remove('hidden');
    document.getElementById('mainFooter').classList.remove('hidden');

    // Fetch initial data
    fetchCategories();
    fetchProducts();
    updateCartIcon();
    checkAuthState();
}

// 📦 API Fetching
const API_URL = 'http://localhost:5000/api';

async function fetchCategories() {
    const grid = document.getElementById('categoryGrid');
    if(!grid) return;

    try {
        const res = await fetch(`${API_URL}/categories`);
        const categories = await res.json();
        
        let html = '';
        if(categories.length > 0) {
            categories.forEach(cat => {
                html += `
                <div class="category-card" onclick="window.location.href='index.html?category=${cat._id}'">
                    <img src="${cat.image || 'https://via.placeholder.com/100'}" alt="${cat.name}">
                    <h3>${cat.name}</h3>
                </div>`;
            });
        } else {
            // Mock categories if db is empty
            html = `
                <div class="category-card">
                    <img src="https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=100&q=80" alt="Grocery">
                    <h3>Grocery</h3>
                </div>
                <div class="category-card">
                    <img src="https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?auto=format&fit=crop&w=100&q=80" alt="Pet Food">
                    <h3>Pet Food</h3>
                </div>
                <div class="category-card">
                    <img src="https://images.unsplash.com/photo-1555252333-9f8e92e65df9?auto=format&fit=crop&w=100&q=80" alt="Child Care">
                    <h3>Child Care</h3>
                </div>
            `;
        }
        grid.innerHTML = html;
    } catch (e) {
        console.error("Error fetching categories", e);
    }
}

async function fetchProducts() {
    const grid = document.getElementById('productGrid');
    if(!grid) return;

    const urlParams = new URLSearchParams(window.location.search);
    const categoryFilter = urlParams.get('category');
    const url = categoryFilter ? `${API_URL}/products?category=${categoryFilter}` : `${API_URL}/products`;

    try {
        const res = await fetch(url);
        const products = await res.json();

        let html = '';
        if(products.length > 0) {
            products.forEach(prod => {
                const img = prod.images && prod.images.length > 0 ? prod.images[0] : 'https://via.placeholder.com/300x200';
                html += `
                <div class="product-card">
                    <img src="${img}" class="product-image" alt="${prod.name}" onclick="window.location.href='product.html?id=${prod._id}'" style="cursor:pointer;">
                    <div class="product-info">
                        <span class="product-category">${prod.category ? prod.category.name : 'General'}</span>
                        <h3 class="product-name">${prod.name}</h3>
                        <div class="product-price">₹${prod.price}</div>
                        <button class="add-to-cart-btn" onclick="addToCart('${prod._id}', '${prod.name}', ${prod.price}, '${img}')">Add to Cart</button>
                    </div>
                </div>`;
            });
        } else {
             html = `
                <div class="product-card">
                    <img src="https://images.unsplash.com/photo-1588964895597-cfccd6e2a09c?auto=format&fit=crop&w=300&q=80" class="product-image" alt="Product">
                    <div class="product-info">
                        <span class="product-category">Grocery</span>
                        <h3 class="product-name">Ashirvaad Atta 5kg</h3>
                        <div class="product-price">₹250</div>
                        <button class="add-to-cart-btn" onclick="addToCart('1', 'Ashirvaad Atta 5kg', 250, 'https://images.unsplash.com/photo-1588964895597-cfccd6e2a09c?auto=format&fit=crop&w=300&q=80')">Add to Cart</button>
                    </div>
                </div>
            `;
        }
        grid.innerHTML = html;
    } catch(e) {
         console.error("Error fetching products", e);
    }
}

// 🛒 Cart Logic (Local Storage)
function addToCart(id, name, price, image) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    const itemIndex = cart.findIndex(item => item.product === id);
    if(itemIndex > -1) {
        cart[itemIndex].qty += 1;
    } else {
        cart.push({ product: id, name, price, qty: 1, image });
    }
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartIcon();
    alert(`${name} added to cart!`);
}

function updateCartIcon() {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    const count = cart.reduce((acc, item) => acc + item.qty, 0);
    const countEl = document.getElementById('cartCount');
    if(countEl) countEl.innerText = count;
}
