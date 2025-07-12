import expressAsyncHandler from "express-async-handler";
import jwt from "jsonwebtoken";

const validateToken = expressAsyncHandler(async (req, res, next) => {
    let token;
    let authHeader = req.headers.authorization || req.headers.Authorization;

    if (authHeader && authHeader.startsWith("Bearer ")) {
        token = authHeader.split(" ")[1];

        if (!token) {
            res.status(401);
            throw new Error("Token not found.");
        }

        jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
            if (err) {
                res.status(401);
                throw new Error("User is not authorized.");
            }
            req.user = decoded.user; // Make sure your token was signed with { user: { id: ... } }
            next();
        });
    } else {
        res.status(401);
        throw new Error("Authorization header missing or invalid.");
    }
});

export default validateToken;
