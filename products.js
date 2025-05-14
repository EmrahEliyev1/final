const productContainer = document.getElementById("product-list");
let cart = JSON.parse(localStorage.getItem("cart")) || [];

const apiURL = "https://dummyjson.com/products?limit=12";

async function loadProducts() {
  try {
    const res = await fetch(apiURL);
    const data = await res.json();

    data.products.forEach((product) => {
      const productHTML = `
        <div class="product">
          <img src="${product.thumbnail}" alt="${product.title}">
          <div class="des">
            <span>${product.brand}</span>
            <h5>${product.title}</h5>
            <div class="star">
              ${generateStarRating(product.rating)} <!-- Yıldız ratingini dinamik oluştur -->
            </div>
            <h4>$${product.price}</h4>
          </div>
          <a href="#" class="add-to-cart" data-id="${product.id}">
            <i class="fal fa-shopping-cart cart"></i>
          </a>
        </div>
      `;
      productContainer.insertAdjacentHTML("beforeend", productHTML);
    });

    document.querySelectorAll(".add-to-cart").forEach(button => {
      button.addEventListener("click", (e) => {
        e.preventDefault();
        const productId = parseInt(button.getAttribute("data-id"));
        addToCart(productId, data.products);
      });
    });

  } catch (error) {
    productContainer.innerHTML = "<p>Məhsulları yükləmək mümkün olmadı.</p>";
    console.error("Məhsul yüklənərkən xəta baş verdi:", error);
  }
}

function generateStarRating(rating) {
  let stars = "";
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;

  for (let i = 1; i <= 5; i++) {
    if (i <= fullStars) {
      stars += '<i class="fas fa-star"></i>';
    } else if (i === fullStars + 1 && hasHalfStar) {
      stars += '<i class="fas fa-star-half-alt"></i>';
    } else {
      stars += '<i class="far fa-star"></i>';
    }
  }
  return stars;
}

// Sepete ekleme fonksiyonu
function addToCart(productId, products) {
  const product = products.find(p => p.id === productId);
  
  if (!product) return;

  const existingItem = cart.find(item => item.id === productId);
  
  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    cart.push({
      id: product.id,
      title: product.title,
      price: product.price,
      thumbnail: product.thumbnail,
      quantity: 1
    });
  }

  updateCart();
  alert(`${product.title} səbətə əlavə edildi!`);
}


function updateCart() {
  localStorage.setItem("cart", JSON.stringify(cart));
  updateCartCount();
}


function updateCartCount() {
  const cartCount = document.getElementById("cart-count");
  if (cartCount) {
    const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
    cartCount.textContent = totalItems;
  }
}

document.addEventListener("DOMContentLoaded", updateCartCount);

loadProducts();



// products.js faylına əlavə ediləcək kod

document.addEventListener('DOMContentLoaded', function() {
    loadProducts();
    setupFilters();
});

function setupFilters() {
    const searchInput = document.getElementById('searchInput');
    const categoryFilter = document.getElementById('categoryFilter');
    const ratingFilter = document.getElementById('ratingFilter');
    const priceFilter = document.getElementById('priceFilter');
    
    // Bütün filter elementlərinə event listener əlavə et
    [searchInput, categoryFilter, ratingFilter, priceFilter].forEach(filter => {
        filter.addEventListener('change', applyFilters);
        if (filter === searchInput) {
            filter.addEventListener('keyup', applyFilters);
        }
    });
}

let allProducts = []; // Bütün məhsulları saxlayacaq dəyişən

async function loadProducts() {
    try {
        const res = await fetch(apiURL);
        const data = await res.json();
        allProducts = data.products; // Məhsulları saxla
        
        displayProducts(allProducts);
        
    } catch (error) {
        productContainer.innerHTML = "<p>Məhsulları yükləmək mümkün olmadı.</p>";
        console.error("Məhsul yüklənərkən xəta baş verdi:", error);
    }
}

function displayProducts(products) {
     productContainer.innerHTML = '';
    productContainer.style.gap = '20px';
    productContainer.style.justifyContent = 'flex-start';
    
   
    if (products.length === 0) {
        productContainer.innerHTML = "<p>Heç bir məhsul tapılmadı.</p>";
        return;
    }
    
    products.forEach((product) => {
        const productHTML = `
            <div class="product" data-category="${product.category.toLowerCase()}" 
                 data-rating="${product.rating}" data-price="${product.price}">
                <img src="${product.thumbnail}" alt="${product.title}">
                <div class="des">
                    <span>${product.brand}</span>
                    <h5>${product.title}</h5>
                    <div class="star">
                        ${generateStarRating(product.rating)}
                    </div>
                    <h4>$${product.price}</h4>
                </div>
                <a href="#" class="add-to-cart" data-id="${product.id}">
                    <i class="fal fa-shopping-cart cart"></i>
                </a>
            </div>
        `;
        productContainer.insertAdjacentHTML("beforeend", productHTML);
    });

    // Səbətə əlavə etmə funksiyalarını yenidən qur
    document.querySelectorAll(".add-to-cart").forEach(button => {
        button.addEventListener("click", (e) => {
            e.preventDefault();
            const productId = parseInt(button.getAttribute("data-id"));
            addToCart(productId, allProducts);
        });
    });
}

function applyFilters() {
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();
    const category = document.getElementById('categoryFilter').value.toLowerCase();
    const rating = document.getElementById('ratingFilter').value;
    const priceRange = document.getElementById('priceFilter').value;
    
    let filteredProducts = [...allProducts];
    
    // Axtarış filtri
    if (searchTerm) {
        filteredProducts = filteredProducts.filter(product => 
            product.title.toLowerCase().includes(searchTerm) || 
            product.brand.toLowerCase().includes(searchTerm) ||
            product.description.toLowerCase().includes(searchTerm)
        );
    }
    
    // Kateqoriya filtri
    if (category) {
        filteredProducts = filteredProducts.filter(product => 
            product.category.toLowerCase().includes(category)
        );
    }
    
    // Reytinq filtri
    if (rating) {
        const minRating = parseFloat(rating);
        filteredProducts = filteredProducts.filter(product => 
            product.rating >= minRating
        );
    }
    
    // Qiymət filtri
    if (priceRange) {
        const [min, max] = priceRange.split('-').map(Number);
        
        filteredProducts = filteredProducts.filter(product => {
            if (priceRange.endsWith('+')) {
                return product.price >= min;
            }
            return product.price >= min && (isNaN(max) || product.price <= max);
        });
    }
    
    displayProducts(filteredProducts);
}

