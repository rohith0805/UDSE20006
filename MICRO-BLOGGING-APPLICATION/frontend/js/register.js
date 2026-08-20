const registerForm =
    document.getElementById(
        "registerForm"
    );

registerForm.addEventListener(
    "submit",
    async (event) => {

        event.preventDefault();

        const name =
            document.getElementById(
                "name"
            ).value;

        const username =
            document.getElementById(
                "username"
            ).value;

        const email =
            document.getElementById(
                "email"
            ).value;

        const password =
            document.getElementById(
                "password"
            ).value;

        const message =
            document.getElementById(
                "message"
            );

        try {

            const response =
                await fetch(
                    "/api/auth/register",
                    {
                        method: "POST",

                        headers: {
                            "Content-Type":
                                "application/json"
                        },

                        body: JSON.stringify({
                            name,
                            username,
                            email,
                            password
                        })
                    }
                );

            const data =
                await response.json();

            if (!response.ok) {

                message.textContent =
                    data.message;

                return;
            }

            localStorage.setItem(
                "token",
                data.token
            );

            localStorage.setItem(
                "user",
                JSON.stringify(
                    data.user
                )
            );

            window.location.href =
                "home.html";

        } catch (error) {

            message.textContent =
                "Server connection failed.";

        }

    }
);