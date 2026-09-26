// js/api.js
import API_BASE_URL from './config.js';

// HTTP Request များ ပြုလုပ်ရန် ဘုံ Helper Function
async function apiRequest(endpoint, method = 'GET', body = null, isFormData = false) {
    const headers = {};
    
    // Auth Token ရှိပါက Header တွင် ထည့်သွင်းမည်
    const token = localStorage.getItem('token');
    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    const options = {
        method,
        headers
    };

    if (body) {
        if (isFormData) {
            // File Upload (Payment Slip) အတွက် FormData သုံးပါက Content-Type ထည့်ရန်မလိုပါ
            options.body = body;
        } else {
            headers['Content-Type'] = 'application/json';
            options.body = JSON.stringify(body);
        }
    }

    try {
        const response = await fetch(`${API_BASE_URL}${endpoint}`, options);
        const result = await response.json();

        if (!response.ok) {
            throw new Error(result.message || 'API Request တောင်းဆိုမှု မှားယွင်းနေပါသည်');
        }

        return result;
    } catch (error) {
        console.error('API Error:', error);
        throw error;
    }
}

// ----------------------------------------------------
// Export လုပ်မည့် API Methods များ
// ----------------------------------------------------

// 1. Books API
export const getBooks = () => apiRequest('/api/books');
export const getBookById = (id) => apiRequest(`/api/books?id=${id}`);

// 2. Auth API
export const loginUser = (credentials) => apiRequest('/api/login', 'POST', credentials);
export const registerUser = (userData) => apiRequest('/api/register', 'POST', userData);

// 3. Order & Checkout API
export const createOrder = (orderData) => apiRequest('/api/orders', 'POST', orderData);
export const uploadPaymentSlip = (formData) => apiRequest('/api/orders/upload-slip', 'POST', formData, true);