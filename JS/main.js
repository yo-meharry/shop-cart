import {
  cart,
  loadCart,
  addToCart,
  removeFromCart,
  increaseQty,
  decreaseQty,
  renderCart,
  updateBadge,
} from "./cart.js";

let selectedCat = "all";
let currentPage = 1;
let products;
let categories;

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

    const inCart = cart.find((item) => item.id === product.id);
    btn.textContent = inCart ? `${inCart.quantity} in cart` : "Add to Cart";

    btn.addEventListener("click", () => {
      addToCart(product);
      renderProducts();
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

document.getElementById("cartItems").addEventListener("click", function (e) {
  const btn = e.target.closest("button");
  if (!btn) return;

  const id = Number(btn.dataset.id);
  const isInc = btn.classList.contains("inc");
  const isDec = btn.classList.contains("dec");
  const isDel = btn.classList.contains("del-btn");

  if (isInc) {
    increaseQty(id);
    renderProducts();
  } else if (isDec) {
    decreaseQty(id);
    renderProducts();
  } else if (isDel) {
    removeFromCart(id);
    renderProducts();
  }
});
