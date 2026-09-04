import express from "express";
import { register , login, refreshAccessToken , getMe , logout} from "../controllers/userController.js";
import { authMiddleware } from "../middleware/auth.js";

const router = express.Router();
router.post('/register',register);
router.post('/login' , login)
router.post('/refresh', refreshAccessToken)
router.get('/me' , authMiddleware , getMe);
router.post('/logout' , logout)
export default router;