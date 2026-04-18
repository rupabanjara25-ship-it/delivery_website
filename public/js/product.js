document.addEventListener('DOMContentLoaded', () => {
    fetchProductDetails();
    updateCartIcon();
});

async function fetchProductDetails() {
    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get('id');
    const container = document.getElementById('productContainer');

    if(!productId) {
        container.innerHTML = '<h2>Product not found</h2>';
        return;
    }

    try {
        const res = await fetch(`http://localhost:5000/api/products/${productId}`);
        const product = await res.json();

        if(!product || !product.name) {
            container.innerHTML = '<h2>Product not found</h2>';
            return;
        }

        let imagesHtml = '';
        const mainImage = product.images && product.images.length > 0 ? product.images[0] : 'https://via.placeholder.com/400';
        
        if (product.images && product.images.length > 0) {
            product.images.forEach((img, idx) => {
                imagesHtml += `<img src="${img}" class="thumbnail ${idx === 0 ? 'active' : ''}" onclick="changeMainImage(this, '${img}')">`;
            });
        }

        container.innerHTML = `
            <div class="gallery">
                <img src="${mainImage}" id="mainProductImage" class="main-image" alt="${product.name}">
                <div class="thumbnails">
                    ${imagesHtml}
                </div>
            </div>
            <div class="details">
                <span class="product-category" style="color: var(--primary-color); font-weight: bold;">${product.category ? product.category.name : 'General'}</span>
                <h1>${product.name}</h1>
                <div class="price">₹${product.price}</div>
                <p>${product.description}</p>
                <div style="display: flex; gap: 15px;">
                    <button class="btn-primary" style="flex:1; padding: 1rem; font-size: 1.1rem;" onclick="addToCart('${product._id}', '${product.name}', ${product.price}, '${mainImage}')">
                        <i class="fas fa-shopping-cart"></i> Add to Cart
                    </button>
                    <button class="btn-primary" style="flex:1; padding: 1rem; font-size: 1.1rem; background: var(--secondary-color);" onclick="buyNow('${product._id}', '${product.name}', ${product.price}, '${mainImage}')">
                        <i class="fas fa-bolt"></i> Order Now
                    </button>
                </div>
            </div>
        `;
    } catch (e) {
        container.innerHTML = '<h2>Error loading product</h2>';
    }
}

function changeMainImage(element, src) {
    document.getElementById('mainProductImage').src = src;
    document.querySelectorAll('.thumbnail').forEach(el => el.classList.remove('active'));
    element.classList.add('active');
}

function buyNow(id, name, price, image) {
    addToCart(id, name, price, image);
    window.location.href = 'cart.html';
}
