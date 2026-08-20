document.addEventListener(
    "DOMContentLoaded",
    () => {

        const form =
            document.getElementById(
                "checkoutForm"
            );


        if (!form) {
            return;
        }


        const cart =
            JSON.parse(
                localStorage.getItem(
                    "cart"
                )
            ) || [];


        if (cart.length === 0) {

            window.location.href =
                "/cart";

            return;
        }


        let total = 0;


        cart.forEach(item => {

            total +=
                item.price *
                item.quantity;
        });


        const totalElement =
            document.getElementById(
                "checkoutTotal"
            );


        if (totalElement) {

            totalElement.textContent =
                total;
        }


        form.addEventListener(
            "submit",
            async event => {

                event.preventDefault();


                const address =
                    document.getElementById(
                        "address"
                    ).value.trim();


                const phone =
                    document.getElementById(
                        "phone"
                    ).value.trim();


                const message =
                    document.getElementById(
                        "checkoutMessage"
                    );


                if (!address) {

                    message.textContent =
                        "Please enter your delivery address.";

                    return;
                }


                if (!/^[0-9]{10}$/.test(phone)) {

                    message.textContent =
                        "Please enter a valid 10-digit phone number.";

                    return;
                }


                try {

                    const response =
                        await fetch(
                            "/orders",
                            {

                                method:
                                    "POST",

                                headers: {
                                    "Content-Type":
                                        "application/json"
                                },

                                body:
                                    JSON.stringify(
                                        {
                                            items:
                                                cart,

                                            address:
                                                address,

                                            phone:
                                                phone
                                        }
                                    )
                            }
                        );


                    const data =
                        await response.json();


                    if (
                        response.status === 401
                    ) {

                        window.location.href =
                            "/auth/login";

                        return;
                    }


                    if (!response.ok) {

                        throw new Error(
                            data.message ||
                            "Order failed"
                        );
                    }


                    localStorage.removeItem(
                        "cart"
                    );


                    alert(
                        "Order placed successfully!"
                    );


                    window.location.href =
                        "/orders";


                } catch (error) {

                    message.textContent =
                        error.message;

                }

            }
        );
    }
);