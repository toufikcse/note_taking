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
      select: false,
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

// Indexes
UserSchema.index({ interests: 1 }); // aggregation
// UserSchema.index({ email: 1 });
// UserSchema.index({ role: 1 }); // admin filtering, only if you filter by role frequently

export default mongoose.model<IUser>('User', UserSchema);
