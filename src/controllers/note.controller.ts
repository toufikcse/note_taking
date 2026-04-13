import { Request, Response, NextFunction } from 'express';
import noteService from '../services/note.service';

class NoteController {
  async createNote(req: Request, res: Response, next: NextFunction) {
    try {
      const { title, content } = req.body;

      if (!title) {
        return res.status(400).json({
          success: false,
          message: 'Title is required',
        });
      }

      const note = await noteService.createNote(
        title,
        content,
        '69dca525679a83b0d08a8202',
      );
      res.status(201).json({
        success: true,
        data: note,
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: 'Failed to create note',
        error: error.message,
      });
    }
  }
  // helper
  getPagination = (query: any) => {
    const page = Math.max(parseInt(query.page) || 1, 1);
    const limit = Math.min(parseInt(query.limit) || 10, 50);
    const skip = (page - 1) * limit;
    return { skip, limit, page };
  };
}

export default new NoteController();
