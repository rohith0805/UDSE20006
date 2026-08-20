const token =
    localStorage.getItem("token");

if (!token) {

    window.location.href =
        "login.html";
}


const postForm =
    document.getElementById(
        "postForm"
    );

const contentInput =
    document.getElementById(
        "content"
    );

const counter =
    document.getElementById(
        "counter"
    );

const feed =
    document.getElementById(
        "feed"
    );

const logoutBtn =
    document.getElementById(
        "logoutBtn"
    );


// Character counter

contentInput.addEventListener(
    "input",
    () => {

        counter.textContent =
            `${contentInput.value.length} / 280`;

    }
);


// Create post

postForm.addEventListener(
    "submit",
    async (event) => {

        event.preventDefault();

        const content =
            contentInput.value.trim();

        if (!content) {
            return;
        }

        try {

            const response =
                await fetch(
                    "/api/posts",
                    {
                        method: "POST",

                        headers: {
                            "Content-Type":
                                "application/json",

                            Authorization:
                                `Bearer ${token}`
                        },

                        body: JSON.stringify({
                            content
                        })
                    }
                );

            const data =
                await response.json();

            if (!response.ok) {

                alert(data.message);

                return;
            }

            contentInput.value = "";

            counter.textContent =
                "0 / 280";

            loadFeed();

        } catch (error) {

            alert(
                "Unable to create post."
            );

        }

    }
);


// Load feed

async function loadFeed() {

    try {

        const response =
            await fetch(
                "/api/posts/feed",
                {
                    headers: {
                        Authorization:
                            `Bearer ${token}`
                    }
                }
            );

        const posts =
            await response.json();

        feed.innerHTML = "";

        if (posts.length === 0) {

            feed.innerHTML = `
                <div class="empty">
                    <p>
                        No posts yet.
                        Follow people or create
                        your first post!
                    </p>
                </div>
            `;

            return;
        }

        posts.forEach(
            post => {

                const card =
                    document.createElement(
                        "article"
                    );

                const user =
                    JSON.parse(
                        localStorage.getItem(
                            "user"
                        )
                    );

                const liked =
                    post.likes.includes(
                        user.id
                    );

                card.className =
                    "post-card";

                card.innerHTML = `

                    <div class="post-header">

                        <div>

                            <strong>
                                ${escapeHTML(
                                    post.author.name
                                )}
                            </strong>

                            <span>
                                @${escapeHTML(
                                    post.author.username
                                )}
                            </span>

                        </div>

                        <small>
                            ${new Date(
                                post.createdAt
                            ).toLocaleString()}
                        </small>

                    </div>


                    <p class="post-content">
                        ${escapeHTML(
                            post.content
                        )}
                    </p>


                    <div class="post-actions">

                        <button
                            onclick="likePost('${post._id}')"
                        >
                            ${liked ? "❤️" : "♡"}
                            ${post.likes.length}
                        </button>

                        <button
                            onclick="showComments('${post._id}')"
                        >
                            💬 Comments
                        </button>

                    </div>


                    <div
                        id="comments-${post._id}"
                        class="comments"
                        style="display:none;"
                    >

                        <div
                            id="comment-list-${post._id}"
                        ></div>

                        <form
                            onsubmit="addComment(event, '${post._id}')"
                        >

                            <input
                                type="text"
                                id="comment-${post._id}"
                                placeholder="Write a comment..."
                                maxlength="200"
                                required
                            >

                            <button type="submit">
                                Comment
                            </button>

                        </form>

                    </div>
                `;

                feed.appendChild(card);

            }
        );

    } catch (error) {

        feed.innerHTML =
            "<p>Unable to load feed.</p>";

    }
}


// Like post

async function likePost(id) {

    try {

        await fetch(
            `/api/posts/${id}/like`,
            {
                method: "PUT",

                headers: {
                    Authorization:
                        `Bearer ${token}`
                }
            }
        );

        loadFeed();

    } catch (error) {

        alert(
            "Unable to like post."
        );

    }
}


// Show comments

async function showComments(postId) {

    const comments =
        document.getElementById(
            `comments-${postId}`
        );

    if (
        comments.style.display ===
        "none"
    ) {

        comments.style.display =
            "block";

        await loadComments(
            postId
        );

    } else {

        comments.style.display =
            "none";
    }
}


// Load comments

async function loadComments(
    postId
) {

    const list =
        document.getElementById(
            `comment-list-${postId}`
        );

    try {

        const response =
            await fetch(
                `/api/comments/${postId}`,
                {
                    headers: {
                        Authorization:
                            `Bearer ${token}`
                    }
                }
            );

        const comments =
            await response.json();

        list.innerHTML = "";

        comments.forEach(
            comment => {

                const div =
                    document.createElement(
                        "div"
                    );

                div.className =
                    "comment";

                div.innerHTML = `

                    <strong>
                        ${escapeHTML(
                            comment.author.username
                        )}
                    </strong>

                    <span>
                        ${escapeHTML(
                            comment.content
                        )}
                    </span>

                `;

                list.appendChild(div);

            }
        );

    } catch (error) {

        list.innerHTML =
            "<p>Unable to load comments.</p>";
    }
}


// Add comment

async function addComment(
    event,
    postId
) {

    event.preventDefault();

    const input =
        document.getElementById(
            `comment-${postId}`
        );

    const content =
        input.value.trim();

    if (!content) {
        return;
    }

    try {

        const response =
            await fetch(
                `/api/comments/${postId}`,
                {
                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/json",

                        Authorization:
                            `Bearer ${token}`
                    },

                    body: JSON.stringify({
                        content
                    })
                }
            );

        if (!response.ok) {

            const data =
                await response.json();

            alert(data.message);

            return;
        }

        input.value = "";

        loadComments(
            postId
        );

    } catch (error) {

        alert(
            "Unable to add comment."
        );

    }
}


// Logout

logoutBtn.addEventListener(
    "click",
    () => {

        localStorage.removeItem(
            "token"
        );

        localStorage.removeItem(
            "user"
        );

        window.location.href =
            "login.html";

    }
);


// Escape HTML

function escapeHTML(value) {

    return String(value)
        .replace(
            /&/g,
            "&amp;"
        )
        .replace(
            /</g,
            "&lt;"
        )
        .replace(
            />/g,
            "&gt;"
        )
        .replace(
            /"/g,
            "&quot;"
        )
        .replace(
            /'/g,
            "&#039;"
        );
}


loadFeed();