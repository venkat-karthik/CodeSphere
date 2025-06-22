import { Request, Response } from 'express';
import { User } from '../models/user.model';

// @desc    Get unlocked items for a user
// @route   GET /api/user/unlocked-items
// @access  Private
export const getUnlockedItems = async (req: Request, res: Response) => {
  // @ts-ignore
  const userId = req.user.id;

  try {
    const user = await User.findById(userId).populate('unlockedItems');
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(user.unlockedItems.map(item => item._id)); // Return an array of IDs
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
}; 