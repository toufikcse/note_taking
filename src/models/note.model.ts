import mongoose, { Schema } from 'mongoose';
import { INote } from '../types/note.interface';

const NoteSchema = new Schema<INote>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },

    title: {
      type: String,
      required: true,
      trim: true,
    },

    content: {
      type: String,
      default: '',
    },
  },
  { timestamps: true },
);

// ✅ CRITICAL index
NoteSchema.index({ userId: 1, createdAt: -1 });

export default mongoose.model<INote>('Note', NoteSchema);
