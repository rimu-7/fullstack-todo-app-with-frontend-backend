import express from 'express';
import dotenv from "dotenv";
import cors from "cors"; // Import the cors package
import userRoutes from "./routes/userRoutes.js";
import connectDB from "./config/db.js";
import totoRoutes from "./routes/totoRoutes.js";
dotenv.config();

const app = express();
const port = process.env.PORT || 4501;

// Use CORS to allow requests from localhost:4500
app.use(cors({
    origin: 'http://localhost:5173', // Allow requests from this origin
    methods: ['GET', 'POST', 'PUT', 'DELETE'], // Specify allowed methods
    credentials: true // Allow credentials if needed
}));

app.use(express.json());
connectDB();

app.get("/", (req, res) => {
    res.send("Hello World!");
});

app.use("/api/users", userRoutes);
app.use("/api/todos", totoRoutes); // Ensure the route name is correct

app.listen(port, () => console.log(`Server started on port ${port}`));
