export const Store = {
    // Sinkronisasi data JSON ke LocalStorage
    async getProducts() {
        let localProducts = JSON.parse(localStorage.getItem('all_products'));
        if (!localProducts || localProducts.length === 0) {
            try {
                const res = await fetch('./data.json'); // Gunakan ./ untuk path relatif
                localProducts = await res.json();
                localStorage.setItem('all_products', JSON.stringify(localProducts));
            } catch (e) {
                console.error("Gagal memuat data.json", e);
                localProducts = [];
            }
        }
        return localProducts;
    },

    // Sesi User
    getUser: () => JSON.parse(localStorage.getItem('session')),
    setUser: (user) => localStorage.setItem('session', JSON.stringify(user)),
    logout: () => {
        localStorage.removeItem('session');
        window.location.href = 'login.html'; // Path relatif
    },

    // Keranjang & Wishlist
    getCart: () => JSON.parse(localStorage.getItem('cart')) || [],
    saveCart: (cart) => localStorage.setItem('cart', JSON.stringify(cart)),
    
    getWishlist: () => JSON.parse(localStorage.getItem('wishlist')) || [],
    saveWishlist: (data) => localStorage.setItem('wishlist', JSON.stringify(data)),
    
    toggleWishlist: function(product) {
        let list = this.getWishlist();
        const idx = list.findIndex(i => i.id === product.id);
        if (idx === -1) {
            list.push(product);
            return { action: 'added', data: list };
        } else {
            list.splice(idx, 1);
            return { action: 'removed', data: list };
        }
    },

    // Dark Mode
    initTheme: () => {
        if (localStorage.getItem('theme') === 'dark') {
            document.documentElement.classList.add('dark');
        }
    }
};

export function showToast(msg) {
    const t = document.getElementById('toast');
    if(!t) return;
    t.innerText = msg;
    t.className = "fixed bottom-10 left-1/2 -translate-x-1/2 bg-black text-white px-8 py-4 rounded-2xl shadow-2xl z-[300] transition-all duration-500 opacity-100 translate-y-0 font-bold text-xs";
    setTimeout(() => {
        t.classList.add('opacity-0', 'translate-y-10');
    }, 2500);
}

export function showAlert(title, message, type = 'success') {
    const modal = document.createElement('div');
    modal.className = "fixed inset-0 flex items-center justify-center z-[200] p-4 bg-black/60 backdrop-blur-sm";
    modal.innerHTML = `
        <div class="bg-white dark:bg-gray-800 rounded-[40px] p-8 max-w-sm w-full text-center shadow-2xl">
            <div class="text-5xl mb-4">${type === 'success' ? '🎉' : '⚠️'}</div>
            <h3 class="text-xl font-black mb-2">${title}</h3>
            <p class="text-sm opacity-60 mb-6">${message}</p>
            <button id="close-alert" class="w-full bg-indigo-600 text-white py-4 rounded-2xl font-black uppercase text-xs">Oke</button>
        </div>
    `;
    document.body.appendChild(modal);
    document.getElementById('close-alert').onclick = () => modal.remove();
}