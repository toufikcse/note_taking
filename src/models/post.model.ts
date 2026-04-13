import mongoose, { Schema } from 'mongoose';
import { IPost } from '../types/post.interface';

const PostSchema = new Schema<IPost>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },

    content: {
      type: String,
      required: true,
    },
  },
  { timestamps: true },
);

// ✅ REQUIRED for aggregation lookup
PostSchema.index({ userId: 1 });

export default mongoose.model<IPost>('Post', PostSchema);
