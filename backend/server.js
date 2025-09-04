import express from 'express';
import dotenv from "dotenv";
import cors from "cors";
import userRoutes from "./routes/userRoutes.js";
import connectDB from "./config/db.js";
import totoRoutes from "./routes/totoRoutes.js";
dotenv.config();

const app = express();
const port = process.env.PORT || 4501;

app.use(cors({
    origin: ['http://localhost:5173', 'https://todoappbyrimu.vercel.app/'],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true 
}));

app.use(express.json());
connectDB();

app.get("/", (req, res) => {
    res.send("Hello World!");
});

app.use("/api/users", userRoutes);
app.use("/api/todos", totoRoutes);

app.listen(port, () => console.log(`Server started on port ${port}`));
