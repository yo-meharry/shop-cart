export let cart = [];

export function saveCart() {
  localStorage.setItem("cart", JSON.stringify(cart));
}

export function loadCart() {
  const cartData = localStorage.getItem("cart");
  if (cartData) {
    cart = JSON.parse(cartData);
  }
}

export function addToCart(product) {
  const existing = cart.find((item) => item.id === product.id);
  if (existing) {
    existing.quantity++;
  } else {
    cart.push({ ...product, quantity: 1 });
  }
  saveCart();
  updateBadge();
  renderCart();
}

export function removeFromCart(id) {
  cart = cart.filter((item) => {
    return item.id !== id;
  });

  saveCart();
  updateBadge();
  renderCart();
}

export function increaseQty(id) {
  const item = cart.find((item) => item.id === id);
  if (!item) return;
  item.quantity++;
  saveCart();
  updateBadge();
  renderCart();
}

export function decreaseQty(id) {
  const item = cart.find((item) => item.id === id);
  if (!item) return;
  item.quantity--;
  if (item.quantity <= 0) {
    removeFromCart(id);
    return;
  }
  saveCart();
  updateBadge();
  renderCart();
}

export function renderCart() {
  const container = document.getElementById("cartItems");
  const totalEl = document.getElementById("cartTotal");
  container.innerHTML = "";

  if (cart.length === 0) {
    container.innerHTML = `<p class="empty-cart">Cart is Empty 🛒</p>`;
    totalEl.textContent = "$0";
    return;
  }

  let total = 0;

  cart.forEach((item) => {
    total += item.price * item.quantity;

    const div = document.createElement("div");
    div.classList.add("cart-item");
    div.innerHTML = `
      <img src="${item.image}" />
      <div class="cart-item-info">
        <h4>${item.title.slice(0, 30)}...</h4>
        <p>$${item.price} × ${item.quantity}</p>
      </div>
      <div class="cart-item-actions">
        <button class="qty-btn dec" data-id="${item.id}">−</button>
        <span>${item.quantity}</span>
        <button class="qty-btn inc" data-id="${item.id}">+</button>
        <button class="del-btn" data-id="${item.id}">🗑</button>
      </div>
    `;
    container.appendChild(div);
  });

  totalEl.textContent = `$${total.toFixed(2)}`;
}

export function updateBadge() {
  const total = cart.reduce((sum, item) => sum + item.quantity, 0);
  document.getElementById("cart-badge").textContent = total;
}
