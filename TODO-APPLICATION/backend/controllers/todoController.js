const Todo = require("../models/Todo");

// Get all todos
const getTodos = async (req, res) => {
    try {
        const todos = await Todo.find({
            user: req.user.id
        }).sort({ createdAt: -1 });

        res.json(todos);

    } catch (error) {
        res.status(500).json({
            message: "Failed to get todos"
        });
    }
};

// Create todo
const createTodo = async (req, res) => {
    try {
        const {
            title,
            description,
            priority,
            dueDate
        } = req.body;

        if (!title) {
            return res.status(400).json({
                message: "Title is required"
            });
        }

        const todo = await Todo.create({
            title,
            description,
            priority,
            dueDate: dueDate || null,
            user: req.user.id
        });

        res.status(201).json(todo);

    } catch (error) {
        res.status(500).json({
            message: "Failed to create todo",
            error: error.message
        });
    }
};

// Update todo
const updateTodo = async (req, res) => {
    try {
        const todo = await Todo.findOne({
            _id: req.params.id,
            user: req.user.id
        });

        if (!todo) {
            return res.status(404).json({
                message: "Todo not found"
            });
        }

        const {
            title,
            description,
            priority,
            dueDate,
            completed
        } = req.body;

        todo.title = title ?? todo.title;
        todo.description = description ?? todo.description;
        todo.priority = priority ?? todo.priority;
        todo.dueDate = dueDate ?? todo.dueDate;
        todo.completed = completed ?? todo.completed;

        await todo.save();

        res.json(todo);

    } catch (error) {
        res.status(500).json({
            message: "Failed to update todo"
        });
    }
};

// Delete todo
const deleteTodo = async (req, res) => {
    try {
        const todo = await Todo.findOneAndDelete({
            _id: req.params.id,
            user: req.user.id
        });

        if (!todo) {
            return res.status(404).json({
                message: "Todo not found"
            });
        }

        res.json({
            message: "Todo deleted successfully"
        });

    } catch (error) {
        res.status(500).json({
            message: "Failed to delete todo"
        });
    }
};

module.exports = {
    getTodos,
    createTodo,
    updateTodo,
    deleteTodo
};