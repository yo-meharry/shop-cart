let selectedCat = "all";
let currentPage = 1;

let cart = [];
const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");
const pageInfo = document.getElementById("pageInfo");

let menuBtn = document.querySelector("#menu-toggle");

let menuSidebar = document.getElementById("menuSidebar");
const overlay = document.querySelector("#menuOverlay");

menuBtn.addEventListener("click", function () {
  menuSidebar.classList.add("open");
  overlay.classList.toggle("show");
});

overlay.addEventListener("click", function () {
  menuSidebar.classList.remove("open");
  overlay.classList.remove("show");
});

let products;
let categories;
async function fetchProducts() {
  try {
    const url = "https://fakestoreapi.com/products";
    const response = await fetch(url);
    products = await response.json();
    categories = [...new Set(products.map((p) => p.category))];
  } catch (error) {
    console.error("Error fetching products:", error);
  }
}

function renderCategories() {
  let menuCategories = document.getElementById("menuCategories");
  menuCategories.innerHTML = "";
  const allBtn = document.createElement("div");
  allBtn.classList.add("menu-category");
  allBtn.textContent = "All";
  allBtn.addEventListener("click", () => {
    selectedCat = "all";
    currentPage = 1;
    renderProducts();
  });
  menuCategories.appendChild(allBtn);
  categories.forEach((category) => {
    let categoryElement = document.createElement("div");
    categoryElement.classList.add("menu-category");
    categoryElement.textContent = category.toUpperCase();

    menuCategories.appendChild(categoryElement);
    categoryElement.addEventListener("click", function () {
      selectedCat = category;
      currentPage = 1;
      renderProducts();
    });
  });
}

function renderProducts() {
  let grid = document.getElementById("productGrid");
  grid.innerHTML = "";

  const filtered = getFilteredProducts();
  const startIndex = (currentPage - 1) * 6;
  const endIndex = startIndex + 6;
  const visibleProducts = filtered.slice(startIndex, endIndex);

  visibleProducts.forEach((product) => {
    let card = document.createElement("div");
    card.classList.add("product-card");
    card.innerHTML = `
      <img src="${product.image}" alt="${product.title}" />
      <h3>${product.title.slice(0, 40)}...</h3>
      <p>$${product.price}</p>
      <button class="add-to-cart-btn">Add to Cart</button>
    `;
    grid.appendChild(card);

    const btn = card.querySelector(".add-to-cart-btn");
    btn.addEventListener("click", () => {
      addToCart(product);
    });
  });

  const totalPages = Math.ceil(filtered.length / 6);
  pageInfo.textContent = `Page ${currentPage} of ${totalPages}`;

  prevBtn.disabled = currentPage === 1;
  nextBtn.disabled = currentPage === totalPages;
}

nextBtn.addEventListener("click", function () {
  const totalPages = Math.ceil(getFilteredProducts().length / 6);
  if (currentPage < totalPages) {
    currentPage++;
    renderProducts();
  }
});

prevBtn.addEventListener("click", function () {
  if (currentPage > 1) {
    currentPage--;
    renderProducts();
  }
});

function getFilteredProducts() {
  if (selectedCat === "all") {
    return products;
  } else {
    return products.filter((product) => product.category === selectedCat);
  }
}

function saveCart() {
  localStorage.setItem("cart", JSON.stringify(cart));
}

function loadCart() {
  const cartData = localStorage.getItem("cart");
  if (cartData) {
    cart = JSON.parse(cartData);
  }
}

function updateBadge() {
  const total = cart.reduce((sum, item) => sum + item.quantity, 0);
  document.getElementById("cart-badge").textContent = total;
}

function addToCart(product) {
  const existing = cart.find((item) => item.id === product.id);
  if (existing) {
    existing.quantity++;
  } else {
    cart.push({ ...product, quantity: 1 });
  }
  saveCart();
  updateBadge();
  renderProducts();
  renderCart();
}

async function init() {
  loadCart();
  await fetchProducts();
  renderCategories();
  renderProducts();
  updateBadge();
  renderCart();
}

init();

const cartToggle = document.getElementById("cart-toggle");
const cartPanel = document.getElementById("cartPanel");
const cartOverlay = document.getElementById("cartOverlay");
const closeCartBtn = document.getElementById("closeCart");

cartToggle.addEventListener("click", () => {
  cartPanel.classList.toggle("open");
  cartOverlay.classList.toggle("show");
  renderCart();
});

closeCartBtn.addEventListener("click", () => {
  cartPanel.classList.remove("open");
  cartOverlay.classList.remove("show");
});

cartOverlay.addEventListener("click", () => {
  cartPanel.classList.remove("open");
  cartOverlay.classList.remove("show");
});

function renderCart() {
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
