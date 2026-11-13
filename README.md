# 🛒 Shop Cart

A simple shopping cart web app built with **vanilla JavaScript (ES modules)**, HTML and CSS. Products are fetched live from the [Fake Store API](https://fakestoreapi.com/), and the cart is saved in the browser so it stays even after a page refresh.

No frameworks, no build step, no dependencies.

## Features

- **Live product data** fetched from the Fake Store API
- **Category sidebar** to filter products (All, men's clothing, jewelery, electronics, women's clothing)
- **Pagination**: 6 products per page with Previous / Next buttons and "Page X of Y" info
- **Slide-in cart panel** with:
  - Add to cart / increase / decrease quantity
  - Remove item (🗑)
  - Auto-removal when quantity drops to 0
  - Live total price
- **Cart badge** in the navbar showing total item count
- **"N in cart"** label on the product button when an item is already in the cart
- **Persistent cart** using `localStorage`
- Overlay-based sidebar and cart panel with smooth slide transitions

## Tech Stack

| Part      | Tech                                                |
| --------- | --------------------------------------------------- |
| Structure | HTML5                                               |
| Styling   | CSS3 (Flexbox, Grid, transitions)                   |
| Logic     | JavaScript (ES6+ modules, async/await, Fetch API)   |
| Data      | [Fake Store API](https://fakestoreapi.com/products) |
| Storage   | Browser `localStorage`                              |

## Project Structure

```
shop-cart/
├── index.html      # Page layout (navbar, sidebar, product grid, cart panel)
├── style.css       # All styling
└── JS/
    ├── main.js     # Fetching products, categories, pagination, UI events
    └── cart.js     # Cart state + add/remove/quantity logic, localStorage, rendering
```

### How it works

- `main.js` fetches the products, builds the category menu, renders the current page of products, and wires up the sidebar/cart open-close events.
- `cart.js` owns the cart state (`cart` array) and exports helpers: `addToCart`, `removeFromCart`, `increaseQty`, `decreaseQty`, `renderCart`, `updateBadge`, `loadCart`, `saveCart`.
- Every cart change saves to `localStorage`, updates the badge, and re-renders the cart panel.

## Getting Started

1. Clone the repo
   ```bash
   git clone https://github.com/yo-meharry/shop-cart.git
   cd shop-cart
   ```
2. Run it with a local server. The project uses ES modules, so opening `index.html` directly (`file://`) will not work.
   - **VS Code:** install the _Live Server_ extension → right-click `index.html` → _Open with Live Server_
   - **Or with Python:**
     ```bash
     python -m http.server 8000
     ```
     then open `http://localhost:8000`
3. An internet connection is needed, since products and images load from the Fake Store API.

## What I Learned

- Splitting code into ES modules with `import` / `export`
- Fetching and rendering API data with `async/await`
- Handling events on dynamically created elements (event delegation on the cart items)
- Keeping UI in sync with state (cart ↔ badge ↔ product buttons ↔ total)
- Persisting data with `localStorage`
- Building slide-in panels and overlays with CSS transforms

## Author

**Harry** ([@yo-meharry](https://github.com/yo-meharry))
