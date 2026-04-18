document.addEventListener('DOMContentLoaded', () => {
    const userInfo = JSON.parse(localStorage.getItem('userInfo'));
    
    if (!userInfo || userInfo.role !== 'admin') {
        alert('Unauthorized Area. Redirecting to home.');
        window.location.href = 'index.html';
        return;
    }
    
    document.getElementById('adminGuard').style.display = 'flex';
    
    // Load initial data
    loadCategoriesDropdown();
    loadOrders();
});

function adminLogout() {
    localStorage.removeItem('userInfo');
    window.location.href = 'index.html';
}

function showSection(sectionId) {
    document.querySelectorAll('.section-panel').forEach(el => el.classList.remove('active'));
    document.querySelectorAll('.sidebar a').forEach(el => el.classList.remove('active'));
    
    document.getElementById(sectionId).classList.add('active');
    event.target.classList.add('active');
    
    if(sectionId === 'addProduct') loadCategoriesDropdown();
    if(sectionId === 'manageOrders') loadOrders();
}

async function loadCategoriesDropdown() {
    try {
        const res = await fetch('http://localhost:5000/api/categories');
        const categories = await res.json();
        const select = document.getElementById('prodCategory');
        
        let html = '<option value="">Select Category</option>';
        categories.forEach(cat => {
            html += `<option value="${cat._id}">${cat.name}</option>`;
        });
        select.innerHTML = html;
    } catch(e) {
        console.error('Error loading categories');
    }
}

async function handleAddCategory(e) {
    e.preventDefault();
    const token = JSON.parse(localStorage.getItem('userInfo')).token;
    
    const formData = new FormData();
    formData.append('name', document.getElementById('catName').value);
    formData.append('description', document.getElementById('catDesc').value);
    formData.append('categoryImage', document.getElementById('catImage').files[0]);

    try {
        const res = await fetch('http://localhost:5000/api/categories', {
            method: 'POST',
            headers: { 'Authorization': `Bearer ${token}` },
            body: formData
        });
        
        if (res.ok) {
            alert('Category Added Successfully!');
            document.getElementById('categoryForm').reset();
        } else {
            const data = await res.json();
            alert('Error: ' + data.message);
        }
    } catch (err) {
        console.error(err);
        alert('Server Error');
    }
}

async function handleAddProduct(e) {
    e.preventDefault();
    const token = JSON.parse(localStorage.getItem('userInfo')).token;
    
    const formData = new FormData();
    formData.append('category', document.getElementById('prodCategory').value);
    formData.append('name', document.getElementById('prodName').value);
    formData.append('price', document.getElementById('prodPrice').value);
    formData.append('description', document.getElementById('prodDesc').value);
    
    const files = document.getElementById('prodImages').files;
    for(let i=0; i<files.length; i++) {
        formData.append('productImages', files[i]);
    }

    try {
        const res = await fetch('http://localhost:5000/api/products', {
            method: 'POST',
            headers: { 'Authorization': `Bearer ${token}` },
            body: formData
        });
        
        if (res.ok) {
            alert('Product Added Successfully!');
            document.getElementById('productForm').reset();
        } else {
            const data = await res.json();
            alert('Error: ' + data.message);
        }
    } catch (err) {
        console.error(err);
        alert('Server Error');
    }
}

async function loadOrders() {
    const token = JSON.parse(localStorage.getItem('userInfo')).token;
    
    try {
        const res = await fetch('http://localhost:5000/api/orders', {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        const orders = await res.json();
        
        const tbody = document.getElementById('ordersTableBody');
        let html = '';
        
        orders.forEach(order => {
            let statusClass = 'status-pending';
            if(order.status === 'Shift') statusClass = 'status-shift';
            if(order.status === 'Delivered') statusClass = 'status-delivered';
            
            html += `
                <tr>
                    <td><small>${order._id}</small></td>
                    <td>${order.shippingAddress.name} <br><small>${order.shippingAddress.phone}</small></td>
                    <td>${order.shippingAddress.address}</td>
                    <td><b>₹${order.totalPrice}</b></td>
                    <td><span class="status-badge ${statusClass}">${order.status}</span></td>
                    <td>
                        <select onchange="updateOrderStatus('${order._id}', this.value)" ${order.status === 'Delivered' ? 'disabled' : ''}>
                            <option value="Pending" ${order.status === 'Pending' ? 'selected' : ''}>Pending</option>
                            <option value="Shift" ${order.status === 'Shift' ? 'selected' : ''}>Shift</option>
                            <option value="Delivered" ${order.status === 'Delivered' ? 'selected' : ''}>Delivered</option>
                        </select>
                    </td>
                </tr>
            `;
        });
        
        tbody.innerHTML = html;
        
    } catch(e) {
        console.error('Error fetching orders', e);
    }
}

async function updateOrderStatus(orderId, newStatus) {
    const token = JSON.parse(localStorage.getItem('userInfo')).token;
    
    try {
        const res = await fetch(`http://localhost:5000/api/orders/${orderId}/status`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ status: newStatus })
        });
        
        if (res.ok) {
            loadOrders(); // reload
        } else {
            alert('Failed to update status');
        }
    } catch (err) {
        console.error(err);
    }
}
