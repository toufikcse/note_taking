import { Request, Response, NextFunction } from 'express';
import dotenv from 'dotenv';
import userService from '../services/user.service';
import { comparePassword, hashPassword } from '../utils/hash';
import { generateToken } from '../utils/jwt';

dotenv.config();

class AuthController {
  async register(req: Request, res: Response, next: NextFunction) {
    const { name, email, password, interests } = req.body;
    try {
      // Validation
      if (!name || !email || !password) {
        return res.status(400).json({
          message: 'Email and password are required',
        });
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
          email: user.email,
          role: user.role,
          token,
        },
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: 'Registration failed',
        error: error.message,
      });
    }
  }

  async login(req: Request, res: Response, next: NextFunction) {
    const { email, password } = req.body;
    try {
      // Validation
      if (!email || !password) {
        return res.status(400).json({
          message: 'Email and password are required',
        });
      }

      // find user
      const user = await userService.findUserByEmail(email);
      if (!user) {
        return res.status(400).json({
          success: false,
          message: 'Invalid email or password',
        });
      }
      // compare password
      const isMatch = await comparePassword(password, user.password);
      if (!isMatch) {
        return res.status(401).json({
          success: false,
          message: 'Invalid credentials',
        });
      }

      // generate token
      const token = generateToken(user);

      return res.status(200).json({
        success: true,
        message: 'User logged in successfully',
        token,
        user: {
          id: user.id,
          email: user.email,
          role: user.role,
        },
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: 'Login failed',
        error: error.message,
      });
    }
  }
}

export default new AuthController();
