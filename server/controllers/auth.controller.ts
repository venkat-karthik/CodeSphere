import { Request, Response } from 'express';
import { User, IUser } from '../models/user.model';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const generateToken = (id: string) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'your_default_secret', {
    expiresIn: '30d',
  });
};

export const register = async (req: Request, res: Response) => {
  const { firstName, lastName, email, password } = req.body;

  if (!firstName || !lastName || !email || !password) {
    return res.status(400).json({ message: 'Please provide all required fields' });
  }

  try {
    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    const newUser = await User.create({
      firstName,
      lastName,
      email,
      passwordHash,
    });

    if (newUser) {
      const token = generateToken(newUser._id);
      res.status(201).json({
        token,
        user: newUser,
      });
    } else {
      res.status(400).json({ message: 'Invalid user data' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error during registration' });
  }
};

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email }).select('+passwordHash');

    if (user && (await bcrypt.compare(password, user.passwordHash))) {
      const token = generateToken(user._id);
      res.json({
        token,
        user: await User.findById(user._id), // Re-fetch without passwordHash
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error during login' });
  }
};

export const getMe = async (req: Request, res: Response) => {
  // This controller is used to get the current user's data based on their token.
  // The user ID is attached to the request object by the authMiddleware.
  // @ts-ignore
  const user = await User.findById(req.user.id);

  if (user) {
    res.json(user);
  } else {
    res.status(404).json({ message: 'User not found' });
  }
}; 