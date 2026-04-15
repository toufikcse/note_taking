import Note from '../models/note.model';

export class NoteService {
  async createNote(title: string, content: string, userId: string) {
    const item = await Note.create({
      title,
      content,
      userId,
    });
    return item;
  }

  async getNotes(
    query: { userId?: string },
    skip: number,
    limit: number,
  ): Promise<{ notes: any[]; total: number }> {
    const [notes, total] = await Promise.all([
      Note.find(query).skip(skip).limit(limit).sort({ createdAt: -1 }).lean(),
      Note.countDocuments(query),
    ]);
    return { notes, total };
  }

  async getNoteById(id: string) {
    const note = await Note.findById(id).lean();
    return note;
  }

  async updateNote(id: string, title: string, content: string) {
    const note = await Note.findByIdAndUpdate(
      id,
      { title, content, updatedAt: new Date() },
      { returnDocument: 'after' },
    ).lean();
    return note;
  }

  async deleteNote(id: string) {
    return await Note.findByIdAndDelete(id);
  }
}

export default new NoteService();
