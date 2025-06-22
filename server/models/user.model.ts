import { Schema, model, Document } from 'mongoose';

export interface IUser extends Document {
  firstName: string;
  lastName: string;
  email: string;
  passwordHash: string;
  role: 'student' | 'admin';
  joinDate: Date;
  level: number;
  xp: number;
  nextLevelXP: number;
  streak: number;
  completedCourses: number;
  problemsSolved: number;
  codeCoins: number;
  unlockedItems: Schema.Types.ObjectId[];
}

const userSchema = new Schema<IUser>({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true },
  role: { type: String, enum: ['student', 'admin'], default: 'student' },
  joinDate: { type: Date, default: Date.now },
  level: { type: Number, default: 1 },
  xp: { type: Number, default: 0 },
  nextLevelXP: { type: Number, default: 100 },
  streak: { type: Number, default: 0 },
  completedCourses: { type: Number, default: 0 },
  problemsSolved: { type: Number, default: 0 },
  codeCoins: { type: Number, default: 10 },
  unlockedItems: [{ type: Schema.Types.ObjectId, ref: 'StoreItem' }]
});

// Method to remove password hash from the returned user object
userSchema.methods.toJSON = function() {
  const userObject = this.toObject();
  delete userObject.passwordHash;
  return userObject;
}

export const User = model<IUser>('User', userSchema); 