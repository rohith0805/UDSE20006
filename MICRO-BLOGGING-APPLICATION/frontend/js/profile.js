const profileToken =
    localStorage.getItem(
        "token"
    );

if (!profileToken) {

    window.location.href =
        "login.html";
}


const storedUser =
    JSON.parse(
        localStorage.getItem(
            "user"
        )
    );


const profileUsername =
    storedUser.username;


const profileName =
    document.getElementById(
        "profileName"
    );

const usernameElement =
    document.getElementById(
        "profileUsername"
    );

const profileBio =
    document.getElementById(
        "profileBio"
    );

const followers =
    document.getElementById(
        "followers"
    );

const following =
    document.getElementById(
        "following"
    );

const avatarLetter =
    document.getElementById(
        "avatarLetter"
    );


async function loadProfile() {

    try {

        const response =
            await fetch(
                `/api/users/profile/${profileUsername}`,
                {
                    headers: {
                        Authorization:
                            `Bearer ${profileToken}`
                    }
                }
            );

        const data =
            await response.json();

        if (!response.ok) {

            alert(data.message);

            return;
        }

        profileName.textContent =
            data.name;

        usernameElement.textContent =
            `@${data.username}`;

        profileBio.textContent =
            data.bio ||
            "No bio yet.";

        followers.textContent =
            data.followers;

        following.textContent =
            data.following;

        avatarLetter.textContent =
            data.name
                .charAt(0)
                .toUpperCase();

        document.getElementById(
            "editName"
        ).value = data.name;

        document.getElementById(
            "editBio"
        ).value = data.bio || "";

    } catch (error) {

        alert(
            "Unable to load profile."
        );
    }
}


// Edit profile

document.getElementById(
    "editProfileBtn"
).addEventListener(
    "click",
    () => {

        const section =
            document.getElementById(
                "editSection"
            );

        section.style.display =
            section.style.display ===
            "none"
                ? "block"
                : "none";
    }
);


// Save profile

document.getElementById(
    "saveProfileBtn"
).addEventListener(
    "click",
    async () => {

        const name =
            document.getElementById(
                "editName"
            ).value;

        const bio =
            document.getElementById(
                "editBio"
            ).value;

        try {

            const response =
                await fetch(
                    "/api/users/profile",
                    {
                        method: "PUT",

                        headers: {
                            "Content-Type":
                                "application/json",

                            Authorization:
                                `Bearer ${profileToken}`
                        },

                        body: JSON.stringify({
                            name,
                            bio
                        })
                    }
                );

            const data =
                await response.json();

            if (!response.ok) {

                alert(
                    data.message
                );

                return;
            }

            const updatedUser =
                {
                    ...storedUser,
                    name: data.user.name
                };

            localStorage.setItem(
                "user",
                JSON.stringify(
                    updatedUser
                )
            );

            loadProfile();

            alert(
                "Profile updated successfully"
            );

        } catch (error) {

            alert(
                "Unable to update profile."
            );
        }
    }
);


// Logout

document.getElementById(
    "logoutBtn"
).addEventListener(
    "click",
    () => {

        localStorage.clear();

        window.location.href =
            "login.html";

    }
);


loadProfile();