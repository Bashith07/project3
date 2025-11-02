// === CONTACT FORM HANDLER ===
const contactForm = document.querySelector("#contactForm");
contactForm?.addEventListener("submit", submitContact);

// === MOBILE NAV ===
const navToggle = document.getElementById('nav-toggle');
const nav = document.getElementById('nav');
navToggle?.addEventListener('click', () => nav.classList.toggle('active'));

// === PRODUCT DATA ===
const products = [
  {
    id: 1,
    name: "Yonex Nanoray Racket",
    category: "racket",
    price: 2999,
    image: "images/racket1.jpeg",
    description:
      "The Yonex Nanoray delivers lightning-fast swing speed and incredible control, perfect for players who love quick rallies and precision smashes."
  },
  {
    id: 2,
    name: "Li-Ning Turbo Racket",
    category: "racket",
    price: 2599,
    image: "images/racket2.jpeg",
    description:
      "Engineered with Turbo-X technology, this Li-Ning racket provides superior repulsion power and stability for aggressive gameplay."
  },
  {
    id: 3,
    name: "Yonex Badminton Shoes",
    category: "shoes",
    price: 3499,
    image: "images/shoe1.jpeg",
    description:
      "Built with shock-absorbing soles and breathable mesh, these Yonex shoes ensure comfort, grip, and agility during intense matches."
  },
  {
    id: 4,
    name: "Li-Ning Court Shoes",
    category: "shoes",
    price: 3299,
    image: "images/shoe2.jpeg",
    description:
      "Lightweight, flexible, and durable, the Li-Ning Court Shoes are ideal for both practice sessions and tournaments."
  },
  {
    id: 5,
    name: "Feather Shuttle Pack",
    category: "shuttle",
    price: 899,
    image: "images/cock1.jpeg",
    description:
      "High-grade feather shuttles for consistent flight and accuracy — perfect for club and professional players."
  },
  {
    id: 6,
    name: "Plastic Shuttle Pack",
    category: "shuttle",
    price: 599,
    image: "images/cock2.jpeg",
    description:
      "Durable nylon shuttles designed for long-lasting recreational and beginner play without performance loss."
  },
  {
    id: 7,
    name: "Grip Tape Set",
    category: "accessory",
    price: 299,
    image: "images/griptape.jpeg",
    description:
      "Soft, sweat-absorbent grip tape to give your racket a firm, comfortable hold — comes in multiple vibrant colors."
  },
  {
    id: 8,
    name: "Badminton Kit Bag",
    category: "accessory",
    price: 1999,
    image: "images/bag.jpeg",
    description:
      "Spacious and stylish badminton kit bag with multiple compartments for rackets, shoes, and accessories."
  }
];

let cart = JSON.parse(localStorage.getItem("cart")) || [];

// === Update Cart Count ===
function updateCartCount() {
  const cartCount = document.getElementById("cartCount");
  if (cartCount) cartCount.textContent = cart.length;
}

// === HOME PAGE ===
if (document.title.includes("Home")) {
  const productContainer = document.getElementById("productContainer");
  const searchBar = document.getElementById("searchBar");
  const categoryFilter = document.getElementById("categoryFilter");

  function displayProducts(items) {
    productContainer.innerHTML = "";
    items.forEach((p) => {
      const card = document.createElement("div");
      card.classList.add("product-card");
      card.innerHTML = `
        <img src="${p.image}" alt="${p.name}" onclick="viewProduct(${p.id})">
        <h3>${p.name}</h3>
        <p>₹${p.price}</p>
        <button onclick="addToCart(${p.id})">Add to Cart</button>
      `;
      productContainer.appendChild(card);
    });
  }

  function addToCart(id) {
    const item = products.find((p) => p.id === id);
    const exist = cart.find((c) => c.id === id);
    if (exist) {
      alert("⚠️ Item already in cart!");
    } else {
      cart.push({ ...item, quantity: 1 });
      alert("✅ Added to cart successfully!");
      localStorage.setItem("cart", JSON.stringify(cart));
    }
    updateCartCount();
  }

  function viewProduct(id) {
    const selected = products.find((p) => p.id === id);
    localStorage.setItem("selectedProduct", JSON.stringify(selected));
    window.location.href = "product.html";
  }

  searchBar.addEventListener("input", (e) => {
    const value = e.target.value.toLowerCase();
    const filtered = products.filter((p) =>
      p.name.toLowerCase().includes(value)
    );
    displayProducts(filtered);
  });

  categoryFilter.addEventListener("change", (e) => {
    const cat = e.target.value;
    if (cat === "all") displayProducts(products);
    else displayProducts(products.filter((p) => p.category === cat));
  });

  displayProducts(products);
  updateCartCount();
}

// === PRODUCT DETAILS PAGE ===
if (document.title.includes("Product Details")) {
  const productData = JSON.parse(localStorage.getItem("selectedProduct"));
  const productInfo = document.getElementById("productInfo");

  if (productData && productInfo) {
    productInfo.innerHTML = `
      <img src="${productData.image}" alt="${productData.name}" class="details-img">
      <h2>${productData.name}</h2>
      <p><strong>Price:</strong> ₹${productData.price}</p>
      <p><strong>Category:</strong> ${productData.category}</p>
      <p><strong>Ratings:</strong> ⭐⭐⭐⭐☆</p>
      <p><strong>Description:</strong> ${productData.description}</p>
      <button onclick="addToCartDetails()">Add to Cart</button>
    `;
  } else {
    productInfo.innerHTML = `<h2>Product not found!</h2>`;
  }

  window.addToCartDetails = function () {
    const exist = cart.find((c) => c.id === productData.id);
    if (exist) {
      alert("⚠️ Item already in cart!");
    } else {
      cart.push({ ...productData, quantity: 1 });
      alert("✅ Added to cart successfully!");
      localStorage.setItem("cart", JSON.stringify(cart));
    }
    updateCartCount();
  };

  updateCartCount();
}

// === CART PAGE ===
if (document.title.includes("Cart")) {
  const cartContainer = document.getElementById("cartItems");
  const cartTotal = document.getElementById("cartTotal");

  let cart = JSON.parse(localStorage.getItem("cart")) || [];

  function renderCart() {
    if (cart.length === 0) {
      cartContainer.innerHTML = "<h2>Your cart is empty 🛍️</h2>";
      cartTotal.textContent = "";
      localStorage.removeItem("cart");
      return;
    }

    cartContainer.innerHTML = "";
    cart.forEach((item, index) => {
      const div = document.createElement("div");
      div.classList.add("cart-item");
      div.innerHTML = `
        <img src="${item.image}" alt="${item.name}">
        <div style="flex:1; padding:0 15px;">
          <h3>${item.name}</h3>
          <p>₹${item.price}</p>
        </div>
        <div>
          <button onclick="decreaseQty(${index})">-</button>
          <span style="margin:0 8px;">${item.quantity}</span>
          <button onclick="increaseQty(${index})">+</button>
        </div>
        <div style="width:100px;text-align:right;">₹${item.price * item.quantity}</div>
        <button onclick="removeItem(${index})" style="background:red;margin-left:10px;">❌</button>
      `;
      cartContainer.appendChild(div);
    });

    updateTotal();
  }

  function updateTotal() {
    const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    cartTotal.textContent = `Total: ₹${total}`;
  }

  window.increaseQty = function (index) {
    cart[index].quantity++;
    renderCart();
  };

  window.decreaseQty = function (index) {
    if (cart[index].quantity > 1) cart[index].quantity--;
    else removeItem(index);
    renderCart();
  };

  window.removeItem = function (index) {
    cart.splice(index, 1);
    renderCart();
  };

  window.addEventListener("beforeunload", () => {
    localStorage.removeItem("cart");
  });

  renderCart();
}

// === CONTACT FORM ===
function submitContact(e) {
  e.preventDefault();
  alert("✅ Thank you! We will get back to you soon.");
  e.target.reset();
}

// === NAV MENU MOBILE ===
(function () {
  const navToggle = document.getElementById("nav-toggle");
  const navbar = document.querySelector(".navbar");
  const navLinks = Array.from(document.querySelectorAll(".navbar a"));

  if (!navToggle || !navbar) return;

  navToggle.addEventListener("click", () => {
    const isOpen = navbar.classList.toggle("open");
    navToggle.classList.toggle("active", isOpen);
    document.body.classList.toggle("menu-open", isOpen);
  });

  navLinks.forEach((link) => {
    link.addEventListener("click", () => {
      if (navbar.classList.contains("open")) {
        navbar.classList.remove("open");
        navToggle.classList.remove("active");
        document.body.classList.remove("menu-open");
      }
    });
  });
})();
