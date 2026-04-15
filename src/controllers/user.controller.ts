import userService from '../services/user.service';
import { AuthRequest } from '../types/authRequest';
import { Response, NextFunction } from 'express';
import { hashPassword } from '../utils/hash';
import { generateToken } from '../utils/jwt';

class UserController {
  getUsers = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const { skip, limit, page } = this.getPagination(req.query);
      let query: any = {};
      const { users, total } = await userService.getUsers(query, skip, limit);
      res.status(200).json({
        success: true,
        message: 'Users retrieved successfully',
        data: users,
        meta: {
          total,
          page,
          limit,
          totalPages: Math.ceil(total / limit),
        },
      });
    } catch (error) {
      res.status(500).json({ message: 'Server error' });
    }
  };

  async createUser(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { name, email, password, interests } = req.body;

      // check required fields
      if (!name || !email || !password) {
        return res.status(400).json({ message: 'Missing required fields' });
      }

      // check existing user
      const existingUser = await userService.findUserByEmail(email);
      if (existingUser) {
        return res.status(400).json({
          success: false,
          message: 'User already exists',
        });
      }

      // hash password
      const hashedPassword = await hashPassword(password);

      // create user
      const user = await userService.createUser(
        name,
        email,
        hashedPassword,
        interests,
      );

      const token = generateToken(user);

      return res.status(201).json({
        success: true,
        message: 'User registered successfully',
        data: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          interests: user.interests,
        },
      });
    } catch (error) {
      res.status(500).json({ message: 'Server error' });
    }
  }

  async updateUser(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const { name, role, interests } = req.body;

      // check existing user
      const user = await userService.findUserById(id as string);
      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'User not found',
        });
      }

      //  Prevent email/password updates here (security rule)
      if (req.body.email || req.body.password) {
        return res.status(400).json({
          message: 'Email and password cannot be updated via this endpoint',
        });
      }

      // Update allowed fields only
      if (name !== undefined) user.name = name;
      if (role !== undefined) user.role = role;
      if (interests !== undefined) user.interests = interests;

      const updatedUser = await userService.updateUser(id as string, user);

      return res.status(200).json({
        success: true,
        message: 'User updated successfully',
        data: updatedUser,
      });
    } catch (error) {
      res.status(500).json({ message: 'Server error' });
    }
  }

  async deleteUser(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;

      //  Prevent admin from deleting themselves (important)
      if (req.user && req.user.id === id) {
        return res.status(400).json({
          message: 'You cannot delete your own account',
        });
      }

      // check existing user
      const user = await userService.findUserById(id as string);
      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'User not found',
        });
      }

      await userService.deleteUser(id as string);

      return res.status(200).json({
        success: true,
        message: 'User deleted successfully',
      });
    } catch (error) {
      res.status(500).json({ message: 'Server error' });
    }
  }

  async groupByInterests(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const groups = await userService.groupByInterests();
      return res.status(200).json({
        success: true,
        message: 'Users grouped by interests retrieved successfully',
        data: groups,
      });
    } catch (error) {
      res.status(500).json({ message: 'Server error' });
    }
  }

  async getUserNotes(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;

      // check existing user
      const user = await userService.findUserById(id as string);
      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'User not found',
        });
      }

      const notes = await userService.getUserNotes(id as string);
      console.log('Retrieved notes:', notes); // Debug log

      return res.status(200).json({
        success: true,
        message: 'User notes retrieved successfully',
        data: notes,
      });
    } catch (error) {
      res.status(500).json({ message: 'Server error' });
    }
  }

  // helper
  getPagination = (query: any) => {
    const page = Number(query.page) || 1;
    const limit = Number(query.limit) || 10;

    const safePage = Math.max(page, 1);
    const safeLimit = Math.min(limit, 50);

    const skip = (safePage - 1) * safeLimit;

    return { page: safePage, limit: safeLimit, skip };
  };
}

export default new UserController();
