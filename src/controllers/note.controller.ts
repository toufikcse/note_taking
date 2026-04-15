import { Response, NextFunction } from 'express';
import noteService from '../services/note.service';
import { AuthRequest } from '../types/authRequest';

class NoteController {
  async createNote(req: AuthRequest, res: Response, next: NextFunction) {
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
        req.user?.id as string,
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
  getNotes = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const { skip, limit, page } = this.getPagination(req.query);

      // RBAC: filter condition
      let query: { userId?: string } = {};

      if (!req.user) {
        return res.status(401).json({ message: 'Unauthorized' });
      }

      if (req.user.role !== 'admin') {
        query.userId = req.user.id; // only own notes
      }

      const { notes, total } = await noteService.getNotes(query, skip, limit);
      res.status(200).json({
        success: true,
        data: notes,
        meta: {
          total,
          page,
          limit,
          totalPages: Math.ceil(total / limit),
        },
      });
    } catch (error) {
      res.status(500).json({ message: 'Server error' });
    }
  };
  // helper
  getPagination = (query: any) => {
    const page = Number(query.page) || 1;
    const limit = Number(query.limit) || 10;

    const safePage = Math.max(page, 1);
    const safeLimit = Math.min(limit, 50);

    const skip = (safePage - 1) * safeLimit;

    return { page: safePage, limit: safeLimit, skip };
  };
  async getNoteById(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const noteId = req.params.id;
      if (!noteId) {
        return res.status(400).json({
          success: false,
          message: 'Note ID is required',
        });
      }
      const note = await noteService.getNoteById(noteId as string);

      if (!note) {
        return res.status(404).json({
          success: false,
          message: 'Note not found',
        });
      }

      if (!req.user) {
        return res.status(401).json({ message: 'Unauthorized' });
      }

      // RBAC: check ownership for non-admins
      if (
        req.user?.role !== 'admin' &&
        note.userId.toString() !== req.user?.id
      ) {
        return res.status(403).json({
          success: false,
          message: 'Forbidden',
        });
      }

      res.status(200).json({
        success: true,
        data: note,
      });
    } catch (error) {
      res.status(500).json({ message: 'Server error' });
    }
  }
  async updateNote(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const noteId = req.params.id;
      const { title, content } = req.body;

      if (!noteId) {
        return res.status(400).json({
          success: false,
          message: 'Note ID is required',
        });
      }
      if (!req.user) {
        return res.status(401).json({ message: 'Unauthorized' });
      }

      const note = await noteService.getNoteById(noteId as string);

      if (!note) {
        return res.status(404).json({
          success: false,
          message: 'Note not found',
        });
      }

      // RBAC + ownership check
      const isOwner = note.userId.toString() === req.user.id;
      const isAdmin = req.user.role === 'admin';

      if (!isOwner && !isAdmin) {
        return res.status(403).json({ message: 'Forbidden' });
      }

      // Update fields (only allowed fields)
      if (title !== undefined) note.title = title;
      if (content !== undefined) note.content = content;

      const updatedNote = await noteService.updateNote(
        noteId as string,
        title,
        content,
      );

      res.status(200).json({
        success: true,
        message: 'Note updated successfully',
        data: updatedNote,
      });
    } catch (error) {
      res.status(500).json({ message: 'Server error' });
    }
  }

  async deleteNote(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const noteId = req.params.id;

      if (!noteId) {
        return res.status(400).json({
          success: false,
          message: 'Note ID is required',
        });
      }
      if (!req.user) {
        return res.status(401).json({ message: 'Unauthorized' });
      }

      const note = await noteService.getNoteById(noteId as string);

      if (!note) {
        return res.status(404).json({
          success: false,
          message: 'Note not found',
        });
      }

      // RBAC + ownership check
      const isOwner = note.userId.toString() === req.user.id;
      const isAdmin = req.user.role === 'admin';

      if (!isOwner && !isAdmin) {
        return res.status(403).json({ message: 'Forbidden' });
      }

      await noteService.deleteNote(noteId as string);

      res.status(200).json({
        success: true,
        message: 'Note deleted successfully',
      });
    } catch (error) {
      res.status(500).json({ message: 'Server error' });
    }
  }
}

export default new NoteController();
