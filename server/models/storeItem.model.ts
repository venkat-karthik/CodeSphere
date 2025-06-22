import { Schema, model, Document } from 'mongoose';

export interface IStoreItem extends Document {
  title: string;
  description: string;
  price: number;
  type: 'pdf' | 'template' | 'notes';
  filePath: string; // Path to the downloadable content
}

const storeItemSchema = new Schema<IStoreItem>({
  title: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  type: { type: String, enum: ['pdf', 'template', 'notes'], required: true },
  filePath: { type: String, required: true }
});

export const StoreItem = model<IStoreItem>('StoreItem', storeItemSchema); 