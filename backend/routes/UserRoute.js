import express from "express";
import { register, login, getUser, updateUser, logout } from "../controllers/UserController.js";
import { AuthMiddleware } from "../middleware/AuthMiddleware.js";

const router = express.Router();

router.post('/api/users/register', register)
router.post('/api/users/login', login)
router.get('/api/users', AuthMiddleware, getUser)
router.patch('/api/users/:username', AuthMiddleware, updateUser)
router.delete('/api/users/logout', AuthMiddleware, logout)

export default router;