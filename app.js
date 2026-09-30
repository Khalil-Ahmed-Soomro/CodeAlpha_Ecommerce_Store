// 12 Products Array
const defaultProducts = [
  { id: 1, name: "Wireless Headphones", category: "Electronics", price: 89.99, image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500", description: "High-fidelity Bluetooth wireless headphones with noise cancellation." },
  { id: 2, name: "Smart Fitness Watch", category: "Electronics", price: 129.50, image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500", description: "Track your heart rate, steps, and daily fitness activities." },
  { id: 3, name: "Modern Running Shoes", category: "Footwear", price: 110.00, image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500", description: "Ultra-comfortable lightweight athletic sneakers." },
  { id: 4, name: "Classic Leather Backpack", category: "Accessories", price: 75.00, image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500", description: "Durable vintage style leather backpack for everyday use." },
  { id: 5, name: "Slim Fit Cotton T-Shirt", category: "Fashion", price: 29.99, image: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=500", description: "100% breathable pure cotton everyday casual shirt." },
  { id: 6, name: "Pro Gaming Laptop", category: "Electronics", price: 1250.00, image: "https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=500", description: "High performance gaming laptop with RTX graphics." },
  { id: 7, name: "Classic Sunglasses", category: "Accessories", price: 45.00, image: "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=500", description: "Polarized UV protection retro style sunglasses." },
  { id: 8, name: "Leather Formal Shoes", category: "Footwear", price: 140.00, image: "https://images.unsplash.com/photo-1614252235316-8c857d38b5f4?w=500", description: "Premium handcrafted leather shoes for office and events." },
  { id: 9, name: "Casual Denim Jacket", category: "Fashion", price: 95.00, image: "https://images.unsplash.com/photo-1576995853123-5a10305d93c0?w=500", description: "Stylish blue denim jacket with warm inner lining." },
  { id: 10, name: "Mechanical Gaming Keyboard", category: "Electronics", price: 65.00, image: "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=500", description: "RGB backlit tactile mechanical switches keyboard." },
  { id: 11, name: "Stainless Steel Water Bottle", category: "Accessories", price: 22.00, image: "https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=500", description: "Vacuum insulated double-wall cold and hot water bottle." },
  { id: 12, name: "Canvas High-Top Sneakers", category: "Footwear", price: 68.00, image: "https://images.unsplash.com/photo-1607522370275-f14206abe5d3?w=500", description: "Trendy classic casual canvas shoes for daily wear." }
];

let rawProducts = [];
let filteredProducts = [];
let cart = [];
let currentUser = JSON.parse(localStorage.getItem('user')) || null;
let selectedCategory = 'all';

// Initialize App
document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  updateUserUI();
  fetchProducts();
});

// --- Theme Switcher Logic ---
function initTheme() {
  const savedTheme = localStorage.getItem('theme') || 'light';
  if (savedTheme === 'dark') {
    document.body.classList.add('dark-theme');
    document.getElementById('theme-btn').innerText = '☀️ Light';
  } else {
    document.body.classList.remove('dark-theme');
    document.getElementById('theme-btn').innerText = '🌙 Dark';
  }
}

function toggleTheme() {
  const isDark = document.body.classList.toggle('dark-theme');
  const themeBtn = document.getElementById('theme-btn');

  if (isDark) {
    localStorage.setItem('theme', 'dark');
    themeBtn.innerText = '☀️ Light';
    showToast('Dark Mode Enabled');
  } else {
    localStorage.setItem('theme', 'light');
    themeBtn.innerText = '🌙 Dark';
    showToast('Light Mode Enabled');
  }
}

// Update User Header Display
function updateUserUI() {
  const display = document.getElementById('user-display');
  const authBtn = document.getElementById('auth-btn-text');

  if (currentUser) {
    display.innerText = `👤 ${currentUser.name}`;
    authBtn.innerText = 'Logout';
    authBtn.onclick = logout;
  } else {
    display.innerText = 'Guest';
    authBtn.innerText = 'Login / Register';
    authBtn.onclick = toggleAuthModal;
  }
}

// Fetch products from backend or fallback
async function fetchProducts() {
  try {
    const res = await fetch('/api/products');
    if (res.ok) {
      const data = await res.json();
      rawProducts = data.length > 0 ? data : defaultProducts;
    } else {
      rawProducts = defaultProducts;
    }
  } catch (err) {
    rawProducts = defaultProducts;
  }
  applyFilters();
}

// Render Products Grid
function renderProducts(products) {
  const container = document.getElementById('product-list');
  const countTitle = document.getElementById('results-count');
  countTitle.innerText = `Showing ${products.length} Products`;
  container.innerHTML = '';

  if (products.length === 0) {
    container.innerHTML = '<p>No products match your filters.</p>';
    return;
  }

  products.forEach(p => {
    container.innerHTML += `
      <div class="product-card">
        <div>
          <img src="${p.image}" alt="${p.name}" onclick="openProductModal(${p.id})">
          <div>
            <span class="card-category">${p.category || 'General'}</span>
            <h3 class="card-title" onclick="openProductModal(${p.id})">${p.name}</h3>
            <p class="card-price">$${parseFloat(p.price).toFixed(2)}</p>
          </div>
        </div>
        <button class="add-btn" onclick="addToCart(${p.id})">Add To Cart</button>
      </div>
    `;
  });
}

// Filters & Sorting
function applyFilters() {
  const searchValue = document.getElementById('search-input').value.toLowerCase();
  const maxPrice = parseFloat(document.getElementById('price-range').value);
  const sortOption = document.getElementById('sort-select').value;

  filteredProducts = rawProducts.filter(p => {
    const matchesCategory = (selectedCategory === 'all' || p.category === selectedCategory);
    const matchesSearch = p.name.toLowerCase().includes(searchValue);
    const matchesPrice = parseFloat(p.price) <= maxPrice;
    return matchesCategory && matchesSearch && matchesPrice;
  });

  if (sortOption === 'low-high') {
    filteredProducts.sort((a, b) => a.price - b.price);
  } else if (sortOption === 'high-low') {
    filteredProducts.sort((a, b) => b.price - a.price);
  }

  renderProducts(filteredProducts);
}

function filterByCategory(category, element) {
  selectedCategory = category;
  document.querySelectorAll('.chip').forEach(c => c.classList.remove('active'));
  element.classList.add('active');
  applyFilters();
}

function updatePriceLabel(val) {
  document.getElementById('price-val').innerText = val;
}

// Product Quick View Modal
function openProductModal(id) {
  const p = rawProducts.find(item => item.id == id);
  if (!p) return;

  const modalBody = document.getElementById('modal-content');
  modalBody.innerHTML = `
    <div style="text-align:center;">
      <img src="${p.image}" style="max-height:180px; object-fit:contain; margin-bottom:10px; background:#fff; padding:5px; border-radius:8px;">
      <h2>${p.name}</h2>
      <span style="color:var(--subtext-color); font-weight:bold;">${p.category}</span>
      <p style="margin: 12px 0; font-size:0.95rem;">${p.description}</p>
      <h3 style="color:#16a34a; margin-bottom: 15px;">$${parseFloat(p.price).toFixed(2)}</h3>
      <button class="add-btn" onclick="addToCart(${p.id}); closeProductModalDirect();">Add to Cart</button>
    </div>
  `;
  document.getElementById('product-modal').style.display = 'flex';
}

function closeProductModal(e) {
  if (e.target.id === 'product-modal') {
    document.getElementById('product-modal').style.display = 'none';
  }
}
function closeProductModalDirect() {
  document.getElementById('product-modal').style.display = 'none';
}

// User Authentication
async function register() {
  const name = document.getElementById('auth-name').value;
  const email = document.getElementById('auth-email').value;
  const password = document.getElementById('auth-pass').value;

  if (!email || !password || !name) return showToast('Please enter Name, Email, and Password!');

  try {
    const res = await fetch('/api/users/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password })
    });

    const data = await res.json();
    if (res.ok) {
      showToast('Registered successfully! Now click Login.');
    } else {
      showToast(data.message || 'Registration failed.');
    }
  } catch (err) {
    currentUser = { id: Date.now(), name, email };
    localStorage.setItem('user', JSON.stringify(currentUser));
    updateUserUI();
    toggleAuthModal();
    showToast(`Welcome ${name}! (Registered offline)`);
  }
}

async function login() {
  const email = document.getElementById('auth-email').value;
  const password = document.getElementById('auth-pass').value;

  if (!email || !password) return showToast('Please enter Email & Password!');

  try {
    const res = await fetch('/api/users/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });

    const data = await res.json();
    if (res.ok) {
      currentUser = data.user;
      localStorage.setItem('user', JSON.stringify(currentUser));
      updateUserUI();
      toggleAuthModal();
      showToast(`Logged in as ${currentUser.name}`);
    } else {
      showToast(data.message || 'Login failed.');
    }
  } catch (err) {
    const nameFromEmail = email.split('@')[0];
    currentUser = { id: Date.now(), name: nameFromEmail, email };
    localStorage.setItem('user', JSON.stringify(currentUser));
    updateUserUI();
    toggleAuthModal();
    showToast(`Logged in as ${nameFromEmail}`);
  }
}

function logout() {
  currentUser = null;
  localStorage.removeItem('user');
  updateUserUI();
  showToast('Logged out successfully!');
}

function toggleAuthModal() {
  const modal = document.getElementById('auth-modal');
  modal.style.display = modal.style.display === 'flex' ? 'none' : 'flex';
}

// Cart Drawer Logic
function addToCart(id) {
  const product = rawProducts.find(p => p.id == id);
  const existing = cart.find(item => item.id == id);

  if (existing) {
    existing.qty += 1;
  } else {
    cart.push({ ...product, qty: 1 });
  }

  updateCartDrawer();
  showToast(`${product.name} added to cart!`);
}

function updateCartDrawer() {
  const itemsDiv = document.getElementById('cart-drawer-items');
  const countBadge = document.getElementById('cart-count');
  const totalDisplay = document.getElementById('cart-total-price');

  itemsDiv.innerHTML = '';
  let total = 0;
  let totalQty = 0;

  cart.forEach((item, idx) => {
    total += item.price * item.qty;
    totalQty += item.qty;
    itemsDiv.innerHTML += `
      <div style="display:flex; justify-content:space-between; margin-bottom:12px; align-items:center;">
        <div>
          <strong>${item.name}</strong><br>
          <small>$${item.price} x ${item.qty}</small>
        </div>
        <div>
          <button onclick="changeQty(${idx}, -1)" style="padding:2px 8px;">-</button>
          <button onclick="changeQty(${idx}, 1)" style="padding:2px 8px;">+</button>
        </div>
      </div>
    `;
  });

  countBadge.innerText = totalQty;
  totalDisplay.innerText = `$${total.toFixed(2)}`;
}

function changeQty(index, delta) {
  cart[index].qty += delta;
  if (cart[index].qty <= 0) cart.splice(index, 1);
  updateCartDrawer();
}

function toggleCartDrawer() {
  document.getElementById('cart-drawer').classList.toggle('open');
}

// Toast Notifications
function showToast(msg) {
  const container = document.getElementById('toast-container');
  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.innerText = msg;
  container.appendChild(toast);
  setTimeout(() => toast.remove(), 2500);
}

// Checkout Function
async function checkout() {
  if (!currentUser) {
    toggleAuthModal();
    return showToast('Please login first to place order!');
  }
  if (cart.length === 0) return showToast('Your cart is empty!');

  const address = document.getElementById('shipping-address').value;
  if (!address) return showToast('Please enter shipping address!');

  const totalAmount = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);

  try {
    await fetch('/api/orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId: currentUser.id, items: cart, totalAmount, shippingAddress: address })
    });
  } catch (e) {}

  showToast('🎉 Order Placed Successfully!');
  cart = [];
  updateCartDrawer();
  toggleCartDrawer();
}
