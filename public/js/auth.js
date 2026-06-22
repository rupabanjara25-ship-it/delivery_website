let isLoginMode = true;

function checkAuthState() {
    const user = JSON.parse(localStorage.getItem('userInfo'));
    const authSection = document.getElementById('authSection');
    
    if (user) {
        if(user.role === 'admin') {
            authSection.innerHTML = `
                <div style="display: flex; gap: 10px; align-items: center;">
                    <span style="font-weight: 600; color: var(--primary-color);">Hello, Admin</span>
                    <button class="btn-primary" onclick="window.location.href='admin.html'">Dashboard</button>
                    <button class="btn-primary" style="background: #e74c3c;" onclick="logout()"><i class="fas fa-sign-out-alt"></i></button>
                </div>
            `;
        } else {
            authSection.innerHTML = `
                <div style="display: flex; gap: 10px; align-items: center;">
                    <span style="font-weight: 600; color: var(--text-dark);">Hi, ${user.name}</span>
                    <button class="btn-primary" style="background: #e74c3c; padding: 0.5rem 1rem;" onclick="logout()"><i class="fas fa-sign-out-alt"></i></button>
                </div>
            `;
        }
    } else {
         authSection.innerHTML = `<button class="btn-primary" onclick="openLoginModal()"><i class="fas fa-user"></i> <span>Login / Signup</span></button>`;
    }
}

function openLoginModal() {
    document.getElementById('authModal').classList.remove('hidden');
}

function closeLoginModal() {
    document.getElementById('authModal').classList.add('hidden');
}

// Close modal when clicking outside
window.onclick = function(event) {
  const modal = document.getElementById('authModal');
  if (event.target == modal) {
    closeLoginModal();
  }
}

function toggleAuthMode() {
    isLoginMode = !isLoginMode;
    const nameInput = document.getElementById('authName');
    const title = document.getElementById('authTitle');
    const toggleLink = document.getElementById('authToggleLink');
    const submitBtn = document.getElementById('authSubmitBtn');
    const forgotContainer = document.getElementById('forgotPasswordLinkContainer');

    if (isLoginMode) {
        nameInput.classList.add('hidden');
        title.innerText = 'Login';
        toggleLink.innerText = 'Create an account';
        submitBtn.innerText = 'Login';
        forgotContainer.style.display = 'block';
    } else {
        nameInput.classList.remove('hidden');
        nameInput.required = true;
        title.innerText = 'Sign Up';
        toggleLink.innerText = 'Already have an account? Login';
        submitBtn.innerText = 'Sign Up';
        forgotContainer.style.display = 'none';
    }
}

async function handleAuth(e) {
    e.preventDefault();
    const email = document.getElementById('authEmail').value;
    const password = document.getElementById('authPassword').value;
    const name = document.getElementById('authName').value;

    const endpoint = isLoginMode ? `${APP_CONFIG.API_URL}/auth/login` : `${APP_CONFIG.API_URL}/auth/register`;
    const payload = isLoginMode ? { email, password } : { name, email, password };

    try {
        const res = await fetch(`${endpoint}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        const data = await res.json();

        if (res.ok) {
            localStorage.setItem('userInfo', JSON.stringify(data));
            closeLoginModal();
            checkAuthState();
            
            if(data.role === 'admin') {
                window.location.href = 'admin.html';
            }
        } else {
            alert(data.message || 'Authentication failed');
        }
    } catch (err) {
        console.error(err);
        alert('Server error');
    }
}

function logout() {
    localStorage.removeItem('userInfo');
    checkAuthState();
    window.location.href = 'index.html';
}

function showForgotPassword() {
    const email = prompt("Enter your registered email address:");
    if (email) {
        fetch(`${APP_CONFIG.API_URL}/auth/forgot-password`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email })
        })
        .then(res => res.json())
        .then(data => {
            alert(data.message);
            if(data.message === 'OTP sent to email (check console)') {
                const otp = prompt("Enter the 6-digit OTP you received:");
                if(otp) {
                    const newPassword = prompt("Enter your new password:");
                    if(newPassword) {
                        fetch(`${APP_CONFIG.API_URL}/auth/reset-password`, {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ email, otp, newPassword })
                        })
                        .then(r => r.json())
                        .then(d => alert(d.message));
                    }
                }
            }
        })
        .catch(err => alert('Error sending OTP'));
    }
}
