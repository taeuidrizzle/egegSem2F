import { loginUser } from '../api.js';
import { saveToken, getToken } from '../state.js';

document.addEventListener('DOMContentLoaded', () => {
    // အကောင့်ဝင်ထားပြီးသား ဖြစ်ပါက Catalog သို့ Direct ပို့မည်
    if (getToken()) {
        window.location.href = 'catalog.html';
        return;
    }

    const loginForm = document.getElementById('login-form');
    loginForm.addEventListener('submit', handleLogin);
});

async function handleLogin(e) {
    e.preventDefault();

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const errorEl = document.getElementById('error-message');
    const loginBtn = document.getElementById('login-btn');

    errorEl.innerText = '';

    try {
        loginBtn.disabled = true;
        loginBtn.innerText = 'စစ်ဆေးနေပါသည်...';

        // 1. Backend Login API သို့ တောင်းဆိုခြင်း
        const response = await loginUser({ email, password });

        // 2. ရရှိလာသော JWT Token ကို LocalStorage တွင် သိမ်းဆည်းခြင်း
        if (response.data && response.data.token) {
            saveToken(response.data.token);
            alert('အကောင့်ဝင်ရောက်ခြင်း အောင်မြင်ပါသည်။');
            
            // Catalog စာမျက်နှာသို့ ပြန်ညွှန်းမည်
            window.location.href = 'catalog.html';
        } else {
            throw new Error('Token မရရှိပါ။');
        }

    } catch (err) {
        errorEl.innerText = 'Login ဝင်၍ မရရှိပါ: ' + err.message;
    } finally {
        loginBtn.disabled = false;
        loginBtn.innerText = 'Login ဝင်မည်';
    }
}