let cart = [];

function showCategory(category) {
    // Hide all categories
    document.querySelectorAll('.category').forEach(cat => cat.style.display = 'none');
    // Show the selected category
    document.getElementById(category).style.display = 'block';
}

function addToCart(category) {
    let product;
    let quantity;

    // Check which category the user is adding from and get the selected product and quantity
    if (category === 'appetizers') {
        product = document.getElementById('appetizer-select').value;
        quantity = document.getElementById('appetizer-qty').value;
    } else if (category === 'burgers') {
        product = document.getElementById('burger-select').value;
        quantity = document.getElementById('burger-qty').value;
    }
    // Add similar logic for other categories like sides, shakes

    // Add the item to the cart
    cart.push({ product, quantity });

    // Display the updated cart
    updateCart();
}

function updateCart() {
    let cartList = document.getElementById('cart');
    cartList.innerHTML = '';
    cart.forEach(item => {
        let listItem = document.createElement('li');
        listItem.textContent = `${item.quantity} x ${item.product}`;
        cartList.appendChild(listItem);
    });
}

function submitOrder() {
    // Here we will make the API call to AWS
    fetch('https://your-api-endpoint/order', {
        method: 'POST',
        body: JSON.stringify({ cart }),
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(response => response.json())
    .then(data => alert('Order submitted!'))
    .catch(error => console.error('Error:', error));
}
