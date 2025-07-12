import mongoose from "mongoose";


const todoSchema = new mongoose.Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "users"
    },
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now, // Automatically set the creation date
    },
    completed: { type: Boolean, default: false },
})
const todoModal = mongoose.model("todos", todoSchema)
export default todoModal;