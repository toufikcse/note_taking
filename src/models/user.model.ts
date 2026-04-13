import mongoose, { Schema } from 'mongoose';
import { IUser } from '../types/user.interface';

const UserSchema = new Schema<IUser>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true, // creates a MongoDB index on { email: 1 }
      lowercase: true,
      trim: true,
    },

    password: {
      type: String,
      required: true,
      select: false, // 🔒 hide by default
    },

    role: {
      type: String,
      enum: ['user', 'admin'],
      default: 'user',
    },

    interests: {
      type: [String],
      default: [],
    },
  },
  { timestamps: true },
);

// ✅ REQUIRED indexes only
UserSchema.index({ interests: 1 }); // aggregation

export default mongoose.model<IUser>('User', UserSchema);
