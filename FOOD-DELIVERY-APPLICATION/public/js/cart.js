let cart =
    JSON.parse(
        localStorage.getItem("cart")
    ) || [];


// ===============================
// PAGE LOAD
// ===============================

document.addEventListener(
    "DOMContentLoaded",
    () => {

        setupAddToCart();

        displayCart();

        updateCartCount();
    }
);


// ===============================
// ADD TO CART
// ===============================

function setupAddToCart() {

    const buttons =
        document.querySelectorAll(
            ".add-cart"
        );


    buttons.forEach(button => {

        button.addEventListener(
            "click",
            () => {

                const food = {

                    id:
                        button.dataset.id,

                    name:
                        button.dataset.name,

                    price:
                        Number(
                            button.dataset.price
                        ),

                    quantity: 1
                };


                const existing =
                    cart.find(
                        item =>
                            item.id === food.id
                    );


                if (existing) {

                    existing.quantity += 1;

                } else {

                    cart.push(food);
                }


                saveCart();

                updateCartCount();

                alert(
                    `${food.name} added to cart`
                );

            }
        );

    });
}


// ===============================
// SAVE CART
// ===============================

function saveCart() {

    localStorage.setItem(
        "cart",
        JSON.stringify(cart)
    );
}


// ===============================
// DISPLAY CART
// ===============================

function displayCart() {

    const container =
        document.getElementById(
            "cartItems"
        );


    const totalElement =
        document.getElementById(
            "cartTotal"
        );


    if (!container) {
        return;
    }


    container.innerHTML = "";


    if (cart.length === 0) {

        container.innerHTML = `

            <div class="empty-cart">

                <h2>
                    Your cart is empty 🛒
                </h2>

                <p>
                    Add delicious food
                    to your cart.
                </p>

                <a
                    href="/restaurants"
                    class="btn"
                >
                    Browse Restaurants
                </a>

            </div>

        `;


        if (totalElement) {

            totalElement.textContent =
                "0";
        }


        return;
    }


    let total = 0;


    cart.forEach(
        (item, index) => {

            const itemTotal =
                item.price *
                item.quantity;


            total += itemTotal;


            container.innerHTML += `

                <div class="cart-item">

                    <div>

                        <h3>
                            ${escapeHTML(
                                item.name
                            )}
                        </h3>

                        <p>
                            ₹${item.price}
                            ×
                            ${item.quantity}
                        </p>

                    </div>


                    <div>

                        <strong>
                            ₹${itemTotal}
                        </strong>

                        <button
                            class="remove-btn"
                            onclick="removeItem(${index})"
                        >
                            Remove
                        </button>

                    </div>

                </div>

            `;
        }
    );


    if (totalElement) {

        totalElement.textContent =
            total;
    }
}


// ===============================
// REMOVE
// ===============================

function removeItem(index) {

    cart.splice(
        index,
        1
    );


    saveCart();

    displayCart();

    updateCartCount();
}


// ===============================
// CART COUNT
// ===============================

function updateCartCount() {

    const cartLink =
        document.querySelector(
            ".cart-link"
        );


    if (!cartLink) {
        return;
    }


    const count =
        cart.reduce(
            (total, item) =>
                total +
                item.quantity,
            0
        );


    cartLink.textContent =
        `🛒 Cart (${count})`;
}


// ===============================
// HTML ESCAPE
// ===============================

function escapeHTML(value) {

    const div =
        document.createElement(
            "div"
        );

    div.textContent =
        value;

    return div.innerHTML;
}