// user gets all todos
import todoModal from "../modal/todoModal.js";
import expressAsyncHandler from "express-async-handler";


// desc gets all todos
//@route /api/todos/
//@ access private
const getTodos = expressAsyncHandler(async (req, res) => {
    const todos = await todoModal.find({user_id : req.user.id});
    res.status(200).json(todos);
})

//user create todos
//@route /api/todos/
//@ access private
const createTodo = expressAsyncHandler(async (req, res) => {
    const { title, description } = req.body;

    // Check if the required field is empty
    if (!title || !description) {
        return res.status(400).json({ message: "Required field is empty" });
    }

    // Create a new todo object
    const newTodo = await todoModal.create({
        user_id: req.user.id,
        title,
        description,
        createdAt: new Date().toISOString()
    });

    // Save the new todo to the database
    await newTodo.save();

    // ✅ Return only ONE response
    res.status(201).json({
        message: "Todo created successfully",
        todo: {
            id: newTodo._id,
            user: req.user.id,
            title: newTodo.title,
            description: newTodo.description,
            createdAt: newTodo.createdAt
        }
    });
});

// desc gets todos by id
//@route /api/todos/
//@ access private
const getTodoById = expressAsyncHandler(async (req, res) => {
    const {id} = req.params;

    // Check if the id is provided
    if (!id) {
        return res.status(400).json({message: "ID is required"}); // Changed to 400 for bad request
    }


    // Find the todo by id
    const todo = await todoModal.findById(id); // Use Mongoose's findById method

    // Check if the todo was found
    if (!todo) {
        return res.status(404).json({message: "Todo not found"});
    }
    // Return the found todo
    res.status(201).json(todo);

})

// desc update todos by id
//@route /api/todos/
//@ access private
const updateTodo = expressAsyncHandler(async (req, res) => {
    const {id} = req.params;
    const {title, description, completed} = req.body;

    // Check if the id is provided
    if (!id) {
        return res.status(400).json({message: "ID is required"});
    }

    // Find the todo by id
    const todo = await todoModal.findById(id);
    if (!todo) {
        return res.status(404).json({message: "todo not found"});  // Added return here
    }

    // Update fields if they exist in the request body
    if (title) todo.title = title;
    if (description) todo.description = description;  // Fixed typo (was 'to.description')
    if (completed !== undefined) todo.completed = completed;

    const updatedTodo = await todo.save();

    res.status(200).json(updatedTodo);
});


// desc delete todos by id
//@route /api/todos/
//@ access private
const deleteTodo = expressAsyncHandler(async (req, res) => {
    const { id } = req.params;

    // Check if the id is provided
    if (!id) {
        return res.status(400).json({ message: "ID is required" });
    }

    // Find the todo by id and delete it
    const todo = await todoModal.findByIdAndDelete(id);

    // Check if the todo was found and deleted
    if (!todo) {
        return res.status(404).json({ message: "Todo not found" });
    }

    // Return a success message
    res.status(200).json(todo);
});


export {getTodos, createTodo, getTodoById, deleteTodo, updateTodo};
