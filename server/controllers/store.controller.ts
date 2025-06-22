import { Request, Response } from 'express';
import { StoreItem } from '../models/storeItem.model';
import { User } from '../models/user.model';

// @desc    Get all store items
// @route   GET /api/store/items
// @access  Public
export const getStoreItems = async (req: Request, res: Response) => {
  try {
    const items = await StoreItem.find({});
    res.json(items);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Unlock a store item
// @route   POST /api/store/unlock
// @access  Private
export const unlockItem = async (req: Request, res: Response) => {
  const { itemId } = req.body;
  // @ts-ignore
  const userId = req.user.id;

  try {
    const item = await StoreItem.findById(itemId);
    const user = await User.findById(userId);

    if (!item || !user) {
      return res.status(404).json({ message: 'Item or user not found' });
    }

    // Check if user already unlocked the item
    if (user.unlockedItems.includes(item._id)) {
        return res.status(400).json({ message: 'Item already unlocked' });
    }

    // Check if user can afford the item
    if (user.codeCoins < item.price) {
      return res.status(400).json({ message: 'Insufficient CodeCoins' });
    }

    // Process the purchase
    user.codeCoins -= item.price;
    user.unlockedItems.push(item._id);
    await user.save();
    
    res.json({
        message: 'Item unlocked successfully',
        unlockedItemId: item._id,
        updatedUser: user,
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
}; 