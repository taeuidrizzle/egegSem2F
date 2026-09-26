import { getBooks } from '../api.js';
import { addToCart, getCart } from '../state.js';

document.addEventListener('DOMContentLoaded', async () => {
    updateCartCount();
    await loadBooks();
});

// Cart အရေအတွက်ကို Navbar တွင် ပြောင်းလဲပေးခြင်း
function updateCartCount() {
    const cart = getCart();
    const totalCount = cart.reduce((sum, item) => sum + item.quantity, 0);
    const cartCountEl = document.getElementById('cart-count');
    if (cartCountEl) cartCountEl.innerText = totalCount;
}

// API မှ စာအုပ်များ ခေါ်ယူ၍ Render လုပ်ခြင်း
async function loadBooks() {
    const loadingEl = document.getElementById('loading');
    const errorEl = document.getElementById('error-message');
    const bookListEl = document.getElementById('book-list');

    try {
        loadingEl.style.display = 'block';
        errorEl.innerText = '';

        // API Call
        const response = await getBooks();
        const books = response.data || [];

        if (books.length === 0) {
            bookListEl.innerHTML = '<p>စာအုပ်များ မရှိသေးပါ။</p>';
            return;
        }

        // HTML Render လုပ်ခြင်း
        bookListEl.innerHTML = books.map(book => `
            <div style="border: 1px solid #ccc; padding: 15px; width: 200px; border-radius: 8px;">
                <img src="${book.cover_image || 'https://via.placeholder.com/150'}" alt="${book.title}" style="width: 100%; height: 200px; object-fit: cover;">
                <h3>${book.title}</h3>
                <p>ရေးသူ - ${book.author || 'အမည်မသိ'}</p>
                <p><strong>${book.price} MMK</strong></p>
                
                <a href="book-detail.html?id=${book.id}">အသေးစိတ်ကြည့်ရန်</a>
                <br><br>
                <button class="add-to-cart-btn" data-id="${book.id}" data-title="${book.title}" data-price="${book.price}">
                    Cart ထဲထည့်မည်
                </button>
            </div>
        `).join('');

        // Add to Cart Event Listeners တပ်ဆင်ခြင်း
        document.querySelectorAll('.add-to-cart-btn').forEach(button => {
            button.addEventListener('click', (e) => {
                const bookData = {
                    id: e.target.dataset.id,
                    title: e.target.dataset.title,
                    price: parseFloat(e.target.dataset.price)
                };
                addToCart(bookData, 1);
                updateCartCount();
                alert(`${bookData.title} ကို Cart ထဲ ထည့်ပြီးပါပြီ။`);
            });
        });

    } catch (err) {
        errorEl.innerText = 'စာအုပ်များ ခေါ်ယူ၍ မရရှိပါ: ' + err.message;
    } finally {
        loadingEl.style.display = 'none';
    }
}