// js/state.js

// Cart State Management
export const getCart = () => {
    return JSON.parse(localStorage.getItem('cart')) || [];
};

export const addToCart = (book, quantity = 1) => {
    let cart = getCart();
    const existingIndex = cart.findIndex(item => item.id === book.id);

    if (existingIndex > -1) {
        cart[existingIndex].quantity += quantity;
    } else {
        cart.push({ ...book, quantity });
    }

    localStorage.setItem('cart', JSON.stringify(cart));
};

export const removeFromCart = (bookId) => {
    let cart = getCart();
    cart = cart.filter(item => item.id !== bookId);
    localStorage.setItem('cart', JSON.stringify(cart));
};

export const clearCart = () => {
    localStorage.removeItem('cart');
};

// Auth State Management
export const saveToken = (token) => {
    localStorage.setItem('token', token);
};

export const getToken = () => {
    return localStorage.getItem('token');
};

export const logout = () => {
    localStorage.removeItem('token');
    window.location.href = '/login.html';
};