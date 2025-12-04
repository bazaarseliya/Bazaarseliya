document.addEventListener('DOMContentLoaded', () => {
  const cartBadge = document.querySelector('.cart-badge');
  const cartDropdown = document.querySelector('.cart-dropdown');
  const cartItems = document.getElementById('cart-items');
  const cartTotal = document.getElementById('cart-total');
  const cartIcon = document.querySelector('.cart-icon');
  const continueBtn = document.getElementById('continue-order');

  let cartCount = 0;
  let totalPrice = 0;

  // ✅ Correct Price Parser
  function parsePrice(priceStr) {
    // "Rs. 999.00" -> 999.00
    const clean = priceStr.replace(/[^0-9.]/g, ''); // remove Rs., commas, etc.
    const price = parseFloat(clean);
    return isNaN(price) ? 0 : price;
  }

  function updateTotal() {
    cartTotal.innerText = `Total: Rs. ${totalPrice.toFixed(2)}`;
  }

  function updateBadge() {
    cartBadge.textContent = cartCount;
  }

  function saveCartToLocalStorage() {
    const cartArray = [];
    document.querySelectorAll('#cart-items li').forEach(li => {
      const img = li.querySelector('img').src;
      const title = li.querySelector('p').innerText;
      const price = li.querySelector('span').innerText;
      cartArray.push({ img, title, price });
    });
    localStorage.setItem('cartItems', JSON.stringify(cartArray));
    localStorage.setItem('cartTotal', totalPrice.toFixed(2));
    localStorage.setItem('cartCount', cartCount);
  }

  // ✅ Add to Cart Logic (single function)
  function addToCart(card) {
    const title = card.querySelector('h3, h1').innerText;
    const priceStr = card.querySelector('.price').innerText;
    const img = card.querySelector('img').src;
    const price = parsePrice(priceStr); // ✅ fixed here

    const li = document.createElement('li');
    li.style.display = 'flex';
    li.style.alignItems = 'center';
    li.style.marginBottom = '8px';
    li.innerHTML = `
      <img src="${img}" width="40" height="40" style="border-radius:6px; margin-right:10px;">
      <div style="flex:1;">
        <p style="margin:0; font-size:14px;">${title}</p>
        <span style="font-size:13px; color:#555;">${priceStr}</span>
      </div>
      <button class="remove-btn" style="border:none; background:none; color:red; font-weight:bold; cursor:pointer;">✕</button>
    `;

    cartItems.appendChild(li);

    // Update totals
    cartCount++;
    totalPrice += price;
    updateBadge();
    updateTotal();
    saveCartToLocalStorage();

    // Remove button
    li.querySelector('.remove-btn').addEventListener('click', () => {
      li.remove();
      cartCount--;
      totalPrice -= price;
      updateBadge();
      updateTotal();
      saveCartToLocalStorage();
    });

    // Show dropdown briefly
    cartDropdown.style.display = 'block';
    setTimeout(() => { cartDropdown.style.display = 'none'; }, 2000);
  }

  // 🛒 Handle Add to Cart Clicks
  document.querySelectorAll('.product-cart-icon').forEach(button => {
    button.addEventListener('click', (event) => {
      event.stopPropagation();
      const card = button.closest('.product-card, .product-wrapper');
      if (card) addToCart(card);
    });
  });

 // 🧺 Toggle Cart Dropdown
cartIcon.addEventListener('click', (event) => {
  event.stopPropagation(); // stop click from closing immediately
  cartDropdown.style.display = 
    (cartDropdown.style.display === 'block') ? 'none' : 'block';
});

// 🖱️ Close cart dropdown when clicking outside
document.addEventListener('click', (event) => {
  // Agar click cart icon ya dropdown ke andar nahi hua
  if (!cartDropdown.contains(event.target) && !cartIcon.contains(event.target)) {
    cartDropdown.style.display = 'none';
  }
});
  // 🔁 Load Saved Cart
  const savedCart = JSON.parse(localStorage.getItem('cartItems')) || [];
  totalPrice = parseFloat(localStorage.getItem('cartTotal')) || 0;
  cartCount = parseInt(localStorage.getItem('cartCount')) || 0;

  savedCart.forEach(item => {
    const li = document.createElement('li');
    li.style.display = 'flex';
    li.style.alignItems = 'center';
    li.style.marginBottom = '8px';
    li.innerHTML = `
      <img src="${item.img}" width="40" height="40" style="border-radius:6px; margin-right:10px;">
      <div style="flex:1;">
        <p style="margin:0; font-size:14px;">${item.title}</p>
        <span style="font-size:13px; color:#555;">${item.price}</span>
      </div>
      <button class="remove-btn" style="border:none; background:none; color:red; font-weight:bold; cursor:pointer;">✕</button>
    `;
    cartItems.appendChild(li);

    const price = parsePrice(item.price);
    li.querySelector('.remove-btn').addEventListener('click', () => {
      li.remove();
      cartCount--;
      totalPrice -= price;
      updateBadge();
      updateTotal();
      saveCartToLocalStorage();
    });
  });

  updateBadge();
  updateTotal();

  // ✅ Continue to Order
  if (continueBtn) {
    continueBtn.addEventListener('click', () => {
      if (cartCount > 0) {
        window.location.href = "checkout.html";
      } else {
        alert("Your cart is empty!");
      }
    });
  }
});
