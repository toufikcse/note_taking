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
}

export default new NoteService();
