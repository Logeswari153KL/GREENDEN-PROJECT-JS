// product.js
// Renders products, search, and cart system with persistence
// Also includes a robust sidenav handler so menu works correctly on this page.

// ------- Product data (12 products) -------
const PRODUCTS = [
  { id: 'p1', title: 'Monstera Deliciosa', price: 2500, img: './images/5.jpg' },
  { id: 'p2', title: 'Spider Plant', price: 800, img: './images/6.jpg' },
  { id: 'p3', title: 'Aloe Vera', price: 450, img: './images/7.jpg' },
  { id: 'p4', title: 'Peace Lily', price: 1200, img: './images/8.jpg' },
  { id: 'p5', title: 'Jade Plant', price: 700, img: './images/9.jpg' },
  { id: 'p6', title: 'Snake Plant', price: 950, img: './images/10.jpg' },
  { id: 'p7', title: 'Fiddle Leaf Fig', price: 3500, img: './images/11.jpg' },
  { id: 'p8', title: 'Areca Palm', price: 1500, img: './images/12.jpg' },
  { id: 'p9', title: 'Calathea', price: 1100, img: './images/13.jpg' },
  { id: 'p10', title: 'Rubber Plant', price: 1800, img: './images/14.jpg' },
  { id: 'p11', title: 'ZZ Plant', price: 1400, img: './images/15.jpg' },
  { id: 'p12', title: 'Philodendron', price: 900, img: './images/16.jpg' }
];

// ------- Helpers -------
function formatINR(amount) {
  return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(amount);
}

function getCart() {
  return JSON.parse(localStorage.getItem('greenden_cart') || '[]');
}
function saveCart(cart) {
  // Persist cart
  localStorage.setItem('greenden_cart', JSON.stringify(cart));
  // No manual StorageEvent dispatch required; other tabs will receive native "storage".
  // If you need to trigger same-tab handlers, call a local update function directly.
}

// ------- Sidenav (same behaviour as index.js) -------
(function initSidenav() {
  const menuicon = document.getElementById('menuicon');
  const sidenav = document.getElementById('sidenav');
  const closenav = document.getElementById('closenav');
  if (!sidenav) return;

  if (!sidenav.classList.contains('translate-x-full') && !sidenav.classList.contains('translate-x-0')) {
    sidenav.classList.add('translate-x-full');
  }

  function openMenu() {
    sidenav.classList.remove('translate-x-full');
    sidenav.classList.add('translate-x-0');
    document.body.style.overflow = 'hidden';
  }
  function closeMenu() {
    sidenav.classList.add('translate-x-full');
    sidenav.classList.remove('translate-x-0');
    document.body.style.overflow = '';
  }

  if (menuicon) {
    menuicon.addEventListener('click', (e) => { e.preventDefault(); openMenu(); }, { passive: false });
    menuicon.addEventListener('touchstart', (e) => { e.preventDefault(); openMenu(); }, { passive: false });
  }
  if (closenav) {
    closenav.addEventListener('click', (e) => { e.preventDefault(); closeMenu(); });
    closenav.addEventListener('touchstart', (e) => { e.preventDefault(); closeMenu(); }, { passive: false });
  }

  document.addEventListener('click', (e) => {
    if (!sidenav.classList.contains('translate-x-full')) {
      if (!sidenav.contains(e.target) && e.target !== menuicon && !menuicon.contains(e.target)) {
        closeMenu();
      }
    }
  });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeMenu(); });
  window.addEventListener('resize', () => { if (window.innerWidth >= 768) closeMenu(); });

  // nav links close and navigate
  const navLinks = sidenav.querySelectorAll('.nav-link');
  navLinks.forEach(a => {
    a.addEventListener('click', (ev) => {
      ev.preventDefault();
      const href = a.getAttribute('href');
      closeMenu();
      setTimeout(() => { window.location.href = href; }, 160);
    });
    a.addEventListener('touchstart', (ev) => {
      ev.preventDefault();
      const href = a.getAttribute('href');
      closeMenu();
      setTimeout(() => { window.location.href = href; }, 160);
    }, { passive: false });
  });
})();

// ------- Render products to DOM -------
const productContainer = document.getElementById('product-container');
const bestSellersContainer = document.getElementById('best-sellers');

function createProductCard(p) {
  // keep markup compact and mobile-friendly (1 column on phone)
  const card = document.createElement('div');
  card.className = 'bg-white p-4 rounded-xl shadow hover:shadow-2xl transition transform hover:-translate-y-1 flex flex-col';
  card.innerHTML = `
    <img src="${p.img}" alt="${p.title}" class="w-full h-40 sm:h-44 md:h-40 object-cover rounded-lg mb-3 shadow-lg">
    <h3 class="font-medium">${p.title}</h3>
    <p class="mt-1 font-semibold">${formatINR(p.price)}</p>
    <div class="mt-3 flex gap-2">
      <button data-id="${p.id}" class="addCartBtn flex-1 bg-green-700 text-white py-2 rounded hover:bg-green-800 transition">Add to Cart</button>
      <button data-id="${p.id}" class="buyNowBtn flex-1 border border-green-700 py-2 rounded hover:bg-green-50 transition">Buy Now</button>
    </div>
  `;
  return card;
}

function renderProducts(list) {
  if (!productContainer) return;
  productContainer.innerHTML = '';
  list.forEach(p => productContainer.appendChild(createProductCard(p)));

  // attach listeners
  document.querySelectorAll('.addCartBtn').forEach(btn => {
    btn.addEventListener('click', () => addToCart(btn.dataset.id, 1));
  });
  document.querySelectorAll('.buyNowBtn').forEach(btn => {
    btn.addEventListener('click', () => buyNow(btn.dataset.id));
  });
}

// render best sellers (first 4)
function renderBestSellers() {
  if (!bestSellersContainer) return;
  bestSellersContainer.innerHTML = '';
  const sellers = PRODUCTS.slice(0, 4);
  sellers.forEach(p => {
    const box = document.createElement('div');
    box.className = 'bg-white p-4 rounded-xl text-center shadow hover:shadow-2xl transition transform hover:-translate-y-1';
    box.innerHTML = `
      <img src="${p.img}" alt="${p.title}" class="w-full h-36 object-cover rounded-lg mb-3 shadow-lg">
      <h4 class="font-medium">${p.title}</h4>
      <p class="mt-1 font-semibold">${formatINR(p.price)}</p>
    `;
    bestSellersContainer.appendChild(box);
  });
}

// initial render
renderProducts(PRODUCTS);
renderBestSellers();

// ------- Search with debounce -------
const search = document.getElementById('search');
let debounce;
if (search) {
  search.addEventListener('input', (e) => {
    clearTimeout(debounce);
    debounce = setTimeout(() => {
      const q = e.target.value.trim().toLowerCase();
      const filtered = PRODUCTS.filter(p => p.title.toLowerCase().includes(q));
      // if search cleared, show all
      renderProducts(filtered.length ? filtered : PRODUCTS);
    }, 200);
  });
}

// ------- Cart UI elements -------
const openCartBtn = document.getElementById('openCartBtn');
const cartOverlay = document.getElementById('cartOverlay');
const closeCart = document.getElementById('closeCart');
const cartList = document.getElementById('cartList');
const cartSubtotal = document.getElementById('cartSubtotal');
const continueShopping = document.getElementById('continueShopping');
const checkoutBtn = document.getElementById('checkoutBtn');
const cartCountTop = document.getElementById('cartCountTop');

// open/close cart panel
if (openCartBtn) openCartBtn.addEventListener('click', showCart);
if (closeCart) closeCart.addEventListener('click', hideCart);
if (continueShopping) continueShopping.addEventListener('click', hideCart);
if (cartOverlay) {
  cartOverlay.addEventListener('click', (e) => {
    if (e.target === cartOverlay) hideCart();
  });
}

// ------- Cart logic -------
function addToCart(productId, qty = 1) {
  const product = PRODUCTS.find(p => p.id === productId);
  if (!product) return;
  const cart = getCart();
  const existing = cart.find(i => i.id === productId);
  if (existing) existing.qty += qty;
  else cart.push({ id: productId, title: product.title, price: product.price, qty });

  saveCart(cart);
  renderCart(); // update UI
  // update top count immediately
  if (cartCountTop) cartCountTop.textContent = cart.reduce((s, i) => s + i.qty, 0);
  // also dispatch a small custom event for same-tab listeners
  window.dispatchEvent(new Event('greenden_cart_updated'));
  alert(`${product.title} added to cart`);
}

function buyNow(productId) {
  const product = PRODUCTS.find(p => p.id === productId);
  if (!product) return;
  const cart = [{ id: productId, title: product.title, price: product.price, qty: 1 }];
  saveCart(cart);
  renderCart();
  showCart();
  // simulate going to checkout (demo)
  setTimeout(() => checkout(), 400);
}

function removeFromCart(productId) {
  const cart = getCart().filter(i => i.id !== productId);
  saveCart(cart);
  renderCart();
  if (cartCountTop) cartCountTop.textContent = cart.reduce((s, i) => s + i.qty, 0);
  window.dispatchEvent(new Event('greenden_cart_updated'));
}

function updateQty(productId, qty) {
  const cart = getCart();
  const item = cart.find(i => i.id === productId);
  if (!item) return;
  item.qty = qty < 1 ? 1 : qty;
  saveCart(cart);
  renderCart();
  if (cartCountTop) cartCountTop.textContent = cart.reduce((s, i) => s + i.qty, 0);
  window.dispatchEvent(new Event('greenden_cart_updated'));
}

function clearCart() {
  saveCart([]);
  renderCart();
  if (cartCountTop) cartCountTop.textContent = '0';
  window.dispatchEvent(new Event('greenden_cart_updated'));
}

// ------- Render cart panel -------
function renderCart() {
  const cart = getCart();
  if (!cartList) return;
  cartList.innerHTML = '';

  if (cart.length === 0) {
    cartList.innerHTML = `<p class="text-gray-600">Your cart is empty.</p>`;
    cartSubtotal.textContent = formatINR(0);
    if (cartCountTop) cartCountTop.textContent = '0';
    return;
  }

  let subtotal = 0;

  cart.forEach(item => {
    const row = document.createElement('div');
    row.className = 'flex items-center gap-3 border rounded p-2';

    const prod = PRODUCTS.find(p => p.id === item.id);
    const imgSrc = prod ? prod.img : './images/5.jpg';

    row.innerHTML = `
      <img src="${imgSrc}" class="w-16 h-16 object-cover rounded" alt="${item.title}">
      <div class="flex-1">
        <div class="font-medium">${item.title}</div>
        <div class="text-sm text-gray-600">${formatINR(item.price)}</div>
        <div class="mt-2 flex items-center gap-2">
          <button class="qtyMinus text-gray-600 px-2 py-1 border rounded">-</button>
          <input type="number" class="qtyInput w-14 text-center border rounded" value="${item.qty}" min="1">
          <button class="qtyPlus text-gray-600 px-2 py-1 border rounded">+</button>
        </div>
      </div>
      <div class="text-right">
        <div class="font-semibold">${formatINR(item.price * item.qty)}</div>
        <button class="removeBtn text-sm text-red-600 mt-2">Remove</button>
      </div>
    `;

    // quantity controls
    row.querySelector('.qtyMinus').addEventListener('click', () => {
      updateQty(item.id, item.qty - 1);
    });
    row.querySelector('.qtyPlus').addEventListener('click', () => {
      updateQty(item.id, item.qty + 1);
    });
    row.querySelector('.qtyInput').addEventListener('change', (e) => {
      const val = parseInt(e.target.value) || 1;
      updateQty(item.id, val);
    });

    row.querySelector('.removeBtn').addEventListener('click', () => {
      removeFromCart(item.id);
    });

    cartList.appendChild(row);

    subtotal += item.price * item.qty;
  });

  cartSubtotal.textContent = formatINR(subtotal);
  if (cartCountTop) cartCountTop.textContent = cart.reduce((s, i) => s + i.qty, 0);

  // ensure localStorage is up to date
  saveCart(cart);
}

// show/hide cart overlay
function showCart() {
  if (cartOverlay) {
    cartOverlay.classList.remove('hidden');
    renderCart();
  }
}
function hideCart() {
  if (cartOverlay) cartOverlay.classList.add('hidden');
}

// Checkout (demo)
function checkout() {
  const cart = getCart();
  if (!cart.length) {
    alert('Your cart is empty.');
    return;
  }
  let summary = 'Order summary:\n';
  cart.forEach(it => summary += `${it.title} x ${it.qty} — ${formatINR(it.price * it.qty)}\n`);
  summary += `\nSubtotal: ${formatINR(cart.reduce((s, i) => s + i.price * i.qty, 0))}`;
  alert('Checkout (demo) —\n' + summary);
  clearCart();
  hideCart();
}

// initialize UI values
(function init() {
  const cart = getCart();
  if (cartCountTop) cartCountTop.textContent = cart.reduce((s, i) => s + i.qty, 0);

  const openCartBtn = document.getElementById('openCartBtn');
  if (openCartBtn) openCartBtn.addEventListener('click', showCart);

  const closeCartBtn = document.getElementById('closeCart');
  if (closeCartBtn) closeCartBtn.addEventListener('click', hideCart);

  const checkoutButton = document.getElementById('checkoutBtn');
  if (checkoutButton) checkoutButton.addEventListener('click', checkout);
})();

// listen to storage changes (sync count between pages)
window.addEventListener('storage', (e) => {
  if (e.key === 'greenden_cart') {
    const cart = JSON.parse(e.newValue || '[]');
    const totalQty = cart.reduce((s, it) => s + it.qty, 0);
    const topCount = document.getElementById('cartCountTop');
    if (topCount) topCount.textContent = totalQty;
  }
});

// custom event usage: update mini cart in same tab (index.js listens for storage; but index.js may not be loaded on this page)
// dispatch greenden_cart_updated when cart changes
window.addEventListener('greenden_cart_updated', () => {
  const cart = getCart();
  const totalQty = cart.reduce((s, it) => s + it.qty, 0);
  const topCount = document.getElementById('cartCountTop');
  if (topCount) topCount.textContent = totalQty;
});
