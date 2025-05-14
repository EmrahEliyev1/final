document.addEventListener('DOMContentLoaded', function() {
    // Sepet verilerini localStorage'dan al
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    const cartContainer = document.getElementById('cart-container');
    const totalPriceElement = document.getElementById('total-price');
    const checkoutBtn = document.getElementById('checkout-btn');

    // Sepeti render etme fonksiyonu
    function renderCart() {
        if (cart.length === 0) {
            cartContainer.innerHTML = `
                <div class="empty-cart">
                    <i class="fas fa-shopping-cart"></i>
                    <h3>Səbətiniz boşdur</h3>
                    <p>Alış-verişə davam etmək üçün <a href="product.html">məhsullar</a> səhifəsinə keçid edin.</p>
                </div>
            `;
            document.getElementById('cart-total').style.display = 'none';
            return;
        }

        document.getElementById('cart-total').style.display = 'flex';
        
        let tableHTML = `
            <table >
                <thead>
                    <tr>
                        <th>Məhsul</th>
                        <th>Qiymət</th>
                        <th>Miqdar</th>
                        <th>Ümumi</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
        `;

        let totalPrice = 0;

        cart.forEach(item => {
            const itemTotal = item.price * item.quantity;
            totalPrice += itemTotal;

            tableHTML += `
                <tr>
                    <td>
                        <div>
                            <img src="${item.thumbnail}" alt="${item.title}">
                            <p>${item.title}</p>
                        </div>
                    </td>
                    <td>$${item.price.toFixed(2)}</td>
                    <td>
                        <div class="quantity-control">
                            <button class="decrease-btn" data-id="${item.id}">-</button>
                            <input type="number" value="${item.quantity}" min="1" class="quantity-input" data-id="${item.id}">
                            <button class="increase-btn" data-id="${item.id}">+</button>
                        </div>
                    </td>
                    <td>$${itemTotal.toFixed(2)}</td>
                    <td><button class="remove-btn" data-id="${item.id}"><i class="fas fa-trash"></i></button></td>
                </tr>
            `;
        });

        tableHTML += `
                </tbody>
            </table>
        `;

        cartContainer.innerHTML = tableHTML;
        totalPriceElement.textContent = `$${totalPrice.toFixed(2)}`;

        // Event listener'ları ekle
        document.querySelectorAll('.decrease-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                const productId = parseInt(this.getAttribute('data-id'));
                updateQuantity(productId, -1);
            });
        });

        document.querySelectorAll('.increase-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                const productId = parseInt(this.getAttribute('data-id'));
                updateQuantity(productId, 1);
            });
        });

        document.querySelectorAll('.quantity-input').forEach(input => {
            input.addEventListener('change', function() {
                const productId = parseInt(this.getAttribute('data-id'));
                const newQuantity = parseInt(this.value);
                
                if (newQuantity < 1) {
                    this.value = 1;
                    return;
                }
                
                updateQuantity(productId, newQuantity, true);
            });
        });

        document.querySelectorAll('.remove-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                const productId = parseInt(this.getAttribute('data-id'));
                removeFromCart(productId);
            });
        });
    }

    // Miktarı güncelleme fonksiyonu
    function updateQuantity(productId, change, isDirectValue = false) {
        const itemIndex = cart.findIndex(item => item.id === productId);
        
        if (itemIndex !== -1) {
            if (isDirectValue) {
                cart[itemIndex].quantity = change;
            } else {
                cart[itemIndex].quantity += change;
            }
            
            // Eğer miktar 1'den küçükse ürünü sepetten kaldır
            if (cart[itemIndex].quantity < 1) {
                cart.splice(itemIndex, 1);
            }
            
            // Sepeti güncelle
            localStorage.setItem('cart', JSON.stringify(cart));
            renderCart();
        }
    }

    // Sepetten ürün kaldırma fonksiyonu
    function removeFromCart(productId) {
        cart = cart.filter(item => item.id !== productId);
        localStorage.setItem('cart', JSON.stringify(cart));
        renderCart();
    }

    // Ödeme butonu event listener
    checkoutBtn.addEventListener('click', function() {
        if (cart.length === 0) {
            alert('Səbətiniz boşdur!');
            return;
        }
        
        // Burada ödeme işlemleri yapılabilir
        alert('Ödəniş uğurla tamamlandı! Sifarişiniz hazırlanır.');
        
        // Sepeti temizle
        cart = [];
        localStorage.setItem('cart', JSON.stringify(cart));
        renderCart();
    });

    // İlk render
    renderCart();
});