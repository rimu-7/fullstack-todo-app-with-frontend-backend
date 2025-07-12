import bcrypt from 'bcryptjs';
import userModal from "../modal/userModal.js";
import expressAsyncHandler from "express-async-handler";
import jwt from "jsonwebtoken";

//@ user creates
//@ POST
//@ creating user with name, email, password

const userCreate = async (req, res) => {
    try {
        const {name, email, password} = req.body;

        // Check for required fields
        if (!name || !email || !password) {
            return res.status(400).send("All fields are required");
        }

        // Check if user already exists
        const userExist = await userModal.findOne({email});
        if (userExist) {
            return res.status(400).send("User already exists");
        }

        // Hash the password
        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(password, salt); // Use async hash

        // Create the user
        const user = await userModal.create({name, email, password: hash});
        if (user) {
            return res.status(201).json({_id: user.id, name: user.name, email: user.email});
        } else {
            return res.status(400).send("Invalid credentials");
        }
    } catch (error) {
        console.error(error);
        return res.status(500).send("Server error");
    }
}


//login user
const loginUser = expressAsyncHandler(async (req, res) => {

    const {email, password} = req.body;
    if (!email || !password) {
        res.status(400)
        throw new Error("All fields are required");
    }
    const user = await userModal.findOne({email})

    if (user && (await bcrypt.compare(password, user.password))) {
        const accessToken = jwt.sign({
            user: {
                name: user.name,
                email: user.email,
                id: user._id
            }
        }, process.env.JWT_SECRET, {expiresIn: "15m"})
        res.status(200).json({accessToken})
    } else {
        res.status(401)
        throw new Error("Invalid Credentials");

    }


})


// Get current user profile
// Private route (requires valid JWT)
const currentUser = expressAsyncHandler(async (req, res) => {
   res.json(req.user);
});

// Dummy logout route (not needed unless doing token blacklist)
const logoutUser = expressAsyncHandler(async (req, res) => {
    // No action server-side in stateless JWT
    res.status(200).json({ message: "Logged out successfully" });
});

export { userCreate, loginUser, currentUser, logoutUser };

