import express from "express";
import {currentUser, loginUser, userCreate} from "../controllers/userControllers.js";
import validateToken from "../middleware/validateTokenHandler.js";

const router = express.Router()

//user creates route
router.post("/register", userCreate)
//user login route
router.post("/login", loginUser)


//current user
router.get('/current',validateToken ,currentUser);
export default router;