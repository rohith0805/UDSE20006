const token = localStorage.getItem("token");

if (!token) {
    window.location.href = "login.html";
}

const todoForm =
    document.getElementById("todoForm");

const todoList =
    document.getElementById("todoList");

const filter =
    document.getElementById("filter");

const logoutBtn =
    document.getElementById("logoutBtn");

let todos = [];

// Get todos
async function loadTodos() {

    try {

        const response = await fetch(
            "/api/todos",
            {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        );

        if (!response.ok) {

            localStorage.removeItem("token");

            window.location.href =
                "login.html";

            return;
        }

        todos = await response.json();

        displayTodos();

    } catch (error) {

        console.error(error);

    }
}

// Display todos
function displayTodos() {

    todoList.innerHTML = "";

    const selectedFilter =
        filter.value;

    let filteredTodos = todos;

    if (selectedFilter === "pending") {

        filteredTodos =
            todos.filter(todo => !todo.completed);

    }

    if (selectedFilter === "completed") {

        filteredTodos =
            todos.filter(todo => todo.completed);

    }

    if (filteredTodos.length === 0) {

        todoList.innerHTML =
            "<p>No tasks found.</p>";

        return;
    }

    filteredTodos.forEach(todo => {

        const div =
            document.createElement("div");

        div.className = "todo";

        div.innerHTML = `

            <div>

                <h3 class="${todo.completed ? "completed" : ""}">
                    ${escapeHTML(todo.title)}
                </h3>

                <p>
                    ${escapeHTML(todo.description || "")}
                </p>

                <small>
                    Priority: ${todo.priority}
                </small>

                ${
                    todo.dueDate
                        ? `<small> | Due: ${new Date(todo.dueDate).toLocaleDateString()}</small>`
                        : ""
                }

            </div>

            <div class="todo-buttons">

                <button
                    onclick="toggleTodo('${todo._id}', ${todo.completed})">
                    ${todo.completed ? "Undo" : "Complete"}
                </button>

                <button
                    onclick="deleteTodo('${todo._id}')">
                    Delete
                </button>

            </div>

        `;

        todoList.appendChild(div);

    });
}

// Add todo
todoForm.addEventListener(
    "submit",
    async (event) => {

        event.preventDefault();

        const title =
            document.getElementById("title").value;

        const description =
            document.getElementById("description").value;

        const priority =
            document.getElementById("priority").value;

        const dueDate =
            document.getElementById("dueDate").value;

        try {

            const response = await fetch(
                "/api/todos",
                {
                    method: "POST",

                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`
                    },

                    body: JSON.stringify({
                        title,
                        description,
                        priority,
                        dueDate
                    })
                }
            );

            const data =
                await response.json();

            if (!response.ok) {

                alert(data.message);

                return;
            }

            todoForm.reset();

            await loadTodos();

        } catch (error) {

            alert("Unable to add task.");

        }

    }
);

// Complete / Undo
async function toggleTodo(id, completed) {

    try {

        await fetch(
            `/api/todos/${id}`,
            {
                method: "PUT",

                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },

                body: JSON.stringify({
                    completed: !completed
                })
            }
        );

        await loadTodos();

    } catch (error) {

        alert("Unable to update task.");

    }
}

// Delete
async function deleteTodo(id) {

    const confirmDelete =
        confirm("Delete this task?");

    if (!confirmDelete) {
        return;
    }

    try {

        await fetch(
            `/api/todos/${id}`,
            {
                method: "DELETE",

                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        );

        await loadTodos();

    } catch (error) {

        alert("Unable to delete task.");

    }
}

// Filter
filter.addEventListener(
    "change",
    displayTodos
);

// Logout
logoutBtn.addEventListener(
    "click",
    () => {

        localStorage.removeItem("token");

        localStorage.removeItem("user");

        window.location.href =
            "login.html";

    }
);

// Basic HTML escaping
function escapeHTML(value) {

    return String(value)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");

}

loadTodos();