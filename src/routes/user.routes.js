import express from 'express';
import {
  fetchAllUsers,
  fetchUserById,
  updateUserById,
  deleteUserById,
} from '#controllers/user.controller.js';
import { authenticateToken, requireRole } from '#middleware/auth.middleware.js';

const userRouter = express.Router();

// GET /users - Get all users (admin only)
userRouter.get('/', authenticateToken, fetchAllUsers);

// GET /users/:id - Get user by ID (authenticated users only)
userRouter.get('/:id', authenticateToken, fetchUserById);

// PUT /users/:id - Update user by ID (authenticated users can update own profile, admin can update any)
userRouter.put('/:id', authenticateToken, updateUserById);

// DELETE /users/:id - Delete user by ID (admin only)
userRouter.delete(
  '/:id',
  authenticateToken,
  requireRole(['admin']),
  deleteUserById
);

export default userRouter;
