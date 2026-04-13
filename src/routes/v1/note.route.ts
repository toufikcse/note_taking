import express from 'express';
import noteController from '../../controllers/note.controller';
import { authMiddleware } from '../../middlewares/auth.middleware';

const router = express.Router();

router.use(authMiddleware);

router.post('/notes', noteController.createNote);

export default router;
