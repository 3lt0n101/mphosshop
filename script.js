const adminPhone = '27820000000';
const menuToggle = document.querySelector('.menu-toggle');
const siteNav = document.querySelector('.site-nav');
const productGrid = document.querySelector('.product-grid');
const cartList = document.querySelector('.cart-list');
const cartCount = document.getElementById('cart-count');
const cartTotal = document.getElementById('cart-total');
const customerNameInput = document.getElementById('customer-name');
const customerPhoneInput = document.getElementById('customer-phone');
const customerAddressInput = document.getElementById('customer-address');
const sendOrderButton = document.getElementById('send-order');
const whatsappLink = document.querySelector('.whatsapp-link');

const products = [
  { name: 'Glow Ritual Oil', category: 'Skincare', price: 299, tag: 'Best seller', image: 'https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?auto=format&fit=crop&w=900&q=85', imageClass: 'image-one', alt: 'Amber skincare bottle beside green leaves' },
  { name: 'Cloud Body Cream', category: 'Body care', price: 199, image: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=900&q=85', imageClass: 'image-two', alt: 'Natural cream jar on a soft beige background' },
  { name: 'Sunday Hand Wash', category: 'Everyday care', price: 349, tag: 'New', image: 'https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?auto=format&fit=crop&w=900&q=85', imageClass: 'image-three', alt: 'Minimal skincare bottles on a bright background' },
  { name: 'Botanical Cleanser', category: 'Skin prep', price: 259, tag: 'New', image: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=900&q=85', imageClass: 'image-four', alt: 'Dropper bottles and a cleanser on a soft neutral surface' },
  { name: 'Velvet Lip Balm', category: 'Lip care', price: 129, image: 'https://images.unsplash.com/photo-1515377905703-c4788e51af15?auto=format&fit=crop&w=900&q=85', imageClass: 'image-five', alt: 'Close-up of a lip balm tube in a soft cream setting' },
  { name: 'Citrus Body Scrub', category: 'Body care', price: 279, tag: 'Popular', image: 'https://images.unsplash.com/photo-1528740561666-dc2479dc08ab?auto=format&fit=crop&w=900&q=85', imageClass: 'image-six', alt: 'Natural body scrub product styled with citrus slices' }
];

const selectedProducts = [];

const formatCurrency = (amount) => `R${amount.toLocaleString('en-ZA')}`;

function renderProducts() {
  productGrid.innerHTML = products.map((product) => `
    <article class="product-card" data-product="${product.name}" tabindex="0" role="button" aria-label="Add ${product.name} to cart">
      <div class="product-image ${product.imageClass}">
        ${product.tag ? `<span class="product-tag">${product.tag}</span>` : ''}
        <img src="${product.image}" alt="${product.alt}" loading="lazy">
      </div>
      <div class="product-info">
        <div>
          <p class="product-category">${product.category}</p>
          <h3>${product.name}</h3>
        </div>
        <strong>${formatCurrency(product.price)}</strong>
      </div>
      <button class="view-button" type="button" data-product="${product.name}">Add to cart <span aria-hidden="true">&#8599;</span></button>
    </article>
  `).join('');
}

function renderCart() {
  if (!selectedProducts.length) {
    cartList.innerHTML = '<li class="cart-empty">No products selected yet.</li>';
    cartCount.textContent = '0';
    cartTotal.textContent = 'R0';
    return;
  }

  cartList.innerHTML = selectedProducts.map((item) => `
    <li class="cart-item">
      <div>
        <span>${item.name}</span>
        <small>${item.quantity} x ${formatCurrency(item.price)}</small>
      </div>
      <div class="cart-item-actions">
        <div class="quantity-control" aria-label="Adjust quantity for ${item.name}">
          <button class="qty-btn" type="button" data-action="decrease" data-product="${item.name}" aria-label="Decrease ${item.name} quantity">-</button>
          <span>${item.quantity}</span>
          <button class="qty-btn" type="button" data-action="increase" data-product="${item.name}" aria-label="Increase ${item.name} quantity">+</button>
        </div>
        <strong>${formatCurrency(item.price * item.quantity)}</strong>
      </div>
    </li>
  `).join('');

  const itemCount = selectedProducts.reduce((total, item) => total + item.quantity, 0);
  const totalPrice = selectedProducts.reduce((total, item) => total + (item.price * item.quantity), 0);

  cartCount.textContent = String(itemCount);
  cartTotal.textContent = formatCurrency(totalPrice);
}

function addToCart(productName) {
  const product = products.find((item) => item.name === productName);
  if (!product) return;

  const existingItem = selectedProducts.find((item) => item.name === productName);

  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    selectedProducts.push({ ...product, quantity: 1 });
  }

  const button = document.querySelector(`.view-button[data-product="${productName}"]`);
  if (button) {
    const originalText = button.innerHTML;
    button.classList.add('is-selected');
    button.innerHTML = 'Added to cart <span aria-hidden="true">✓</span>';
    window.setTimeout(() => {
      button.innerHTML = originalText;
      button.classList.remove('is-selected');
    }, 1200);
  }

  renderCart();
}

function updateQuantity(productName, action) {
  const item = selectedProducts.find((entry) => entry.name === productName);
  if (!item) return;

  if (action === 'increase') {
    item.quantity += 1;
  }

  if (action === 'decrease') {
    item.quantity -= 1;
  }

  if (item.quantity <= 0) {
    const itemIndex = selectedProducts.findIndex((entry) => entry.name === productName);
    selectedProducts.splice(itemIndex, 1);
  }

  renderCart();
}

function sendOrder() {
  if (!selectedProducts.length) {
    window.alert('Select at least one product before sending your order.');
    return;
  }

  const customerName = customerNameInput.value.trim();
  const customerPhone = customerPhoneInput.value.trim();
  const customerAddress = customerAddressInput.value.trim();

  if (!customerName || !customerPhone || !customerAddress) {
    window.alert('Please fill in your name, phone number, and delivery address before sending the order.');
    return;
  }

  const orderDetails = selectedProducts.map((item) => `${item.quantity} x ${item.name} - ${formatCurrency(item.price * item.quantity)}`).join('\n');
  const total = selectedProducts.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const message = `Hello Aunt Shop, I would like to place the following order:\n\nCustomer: ${customerName}\nPhone: ${customerPhone}\nAddress: ${customerAddress}\n\n${orderDetails}\n\nTotal: ${formatCurrency(total)}`;
  const whatsappUrl = `https://wa.me/${adminPhone}?text=${encodeURIComponent(message)}`;

  window.open(whatsappUrl, '_blank', 'noopener');
}

if (menuToggle) {
  menuToggle.addEventListener('click', () => {
    const isOpen = siteNav.classList.toggle('is-open');
    menuToggle.setAttribute('aria-expanded', String(isOpen));
  });
}

document.querySelectorAll('.site-nav a').forEach((link) => {
  link.addEventListener('click', () => {
    siteNav.classList.remove('is-open');
    menuToggle.setAttribute('aria-expanded', 'false');
  });
});

productGrid.addEventListener('click', (event) => {
  const productButton = event.target.closest('.view-button');
  const productCard = event.target.closest('.product-card');

  if (productButton) {
    addToCart(productButton.dataset.product);
    return;
  }

  if (productCard) {
    addToCart(productCard.dataset.product);
  }
});

cartList.addEventListener('click', (event) => {
  const quantityButton = event.target.closest('.qty-btn');

  if (!quantityButton) return;

  const { action, product } = quantityButton.dataset;
  updateQuantity(product, action);
});

productGrid.addEventListener('keydown', (event) => {
  const productCard = event.target.closest('.product-card');

  if (!productCard) return;

  if (event.key === 'Enter' || event.key === ' ') {
    event.preventDefault();
    addToCart(productCard.dataset.product);
  }
});

if (sendOrderButton) {
  sendOrderButton.addEventListener('click', sendOrder);
}

if (whatsappLink) {
  whatsappLink.href = `https://wa.me/${adminPhone}`;
}

renderProducts();
renderCart();