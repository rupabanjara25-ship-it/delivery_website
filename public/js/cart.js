document.addEventListener('DOMContentLoaded', () => {
    renderCart();

    const userInfo = JSON.parse(localStorage.getItem('userInfo'));
    if(userInfo) {
        document.getElementById('shipName').value = userInfo.name || '';
    }
});

let cartTotalAmount = 0;

function renderCart() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const list = document.getElementById('cartItemsList');
    const totalEl = document.getElementById('cartTotalValue');
    const warningEl = document.getElementById('minOrderWarning');
    const btnEl = document.getElementById('placeOrderBtn');

    if (cart.length === 0) {
        list.innerHTML = '<p>Your cart is empty.</p>';
        totalEl.innerText = '₹0';
        cartTotalAmount = 0;
        btnEl.disabled = true;
        btnEl.style.opacity = '0.5';
        warningEl.style.display = 'none';
        return;
    }

    let html = '';
    let total = 0;

    cart.forEach((item, index) => {
        total += item.price * item.qty;
        html += `
        <div class="cart-item">
            <div style="display: flex; gap: 1rem; align-items: center;">
                <img src="${item.image}" alt="${item.name}">
                <div>
                    <h3 style="font-size: 1.1rem; margin-bottom: 0.5rem;">${item.name}</h3>
                    <div style="font-weight: bold; color: var(--primary-color);">₹${item.price}</div>
                </div>
            </div>
            
            <div class="qty-controls">
                <button class="qty-btn" onclick="updateQty(${index}, -1)">-</button>
                <span style="font-weight: bold;">${item.qty}</span>
                <button class="qty-btn" onclick="updateQty(${index}, 1)">+</button>
            </div>
            
            <div style="font-weight: 800; font-size: 1.2rem;">₹${item.price * item.qty}</div>
            
            <button class="remove-btn" onclick="removeItem(${index})"><i class="fas fa-trash"></i></button>
        </div>`;
    });

    list.innerHTML = html;
    cartTotalAmount = total;
    totalEl.innerText = `₹${total}`;

    if (total < 500) {
        warningEl.style.display = 'block';
        btnEl.disabled = true;
        btnEl.style.opacity = '0.5';
    } else {
        warningEl.style.display = 'none';
        btnEl.disabled = false;
        btnEl.style.opacity = '1';
    }
}

function updateQty(index, change) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    cart[index].qty += change;
    
    if (cart[index].qty <= 0) {
        cart.splice(index, 1);
    }
    
    localStorage.setItem('cart', JSON.stringify(cart));
    renderCart();
    if(typeof updateCartIcon === 'function') updateCartIcon();
}

function removeItem(index) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    cart.splice(index, 1);
    localStorage.setItem('cart', JSON.stringify(cart));
    renderCart();
    if(typeof updateCartIcon === 'function') updateCartIcon();
}

async function placeOrder(e) {
    e.preventDefault();

    const userInfo = JSON.parse(localStorage.getItem('userInfo'));
    if (!userInfo || !userInfo.token) {
        alert('Please login to place an order.');
        window.location.href = 'index.html';
        return;
    }

    if (cartTotalAmount < 500) {
        alert('Minimum order amount is ₹500.');
        return;
    }

    const name = document.getElementById('shipName').value;
    const phone = document.getElementById('shipPhone').value;
    const address = document.getElementById('shipAddress').value;
    const cart = JSON.parse(localStorage.getItem('cart')) || [];

    const orderData = {
        products: cart,
        shippingAddress: { name, address, phone },
        totalPrice: cartTotalAmount
    };

    try {
        const res = await fetch('/api/orders', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${userInfo.token}`
            },
            body: JSON.stringify(orderData)
        });

        const data = await res.json();
        
        if (res.ok) {
            alert('Order placed successfully!');
            localStorage.removeItem('cart');
            window.location.href = 'index.html';
        } else {
            alert(data.message || 'Failed to place order');
        }
    } catch (err) {
        console.error(err);
        alert('Server Error');
    }
}
