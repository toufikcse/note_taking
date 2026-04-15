import express from 'express';
import noteController from '../../controllers/note.controller';
import authMiddleware from '../../middlewares/auth.middleware';
import permit from '../../middlewares/role.middleware';

const router = express.Router();

router.post(
  '/notes',
  authMiddleware,
  permit('user', 'admin'),
  noteController.createNote,
);
router.get(
  '/notes',
  authMiddleware,
  permit('user', 'admin'),
  noteController.getNotes,
);
router.get(
  '/notes/:id',
  authMiddleware,
  permit('user', 'admin'),
  noteController.getNoteById,
);
router.put(
  '/notes/:id',
  authMiddleware,
  permit('user', 'admin'),
  noteController.updateNote,
);
router.delete(
  '/notes/:id',
  authMiddleware,
  permit('user', 'admin'),
  noteController.deleteNote,
);

export default router;
