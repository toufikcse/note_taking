import express from 'express';
import noteV1 from './v1/note.route';
import authV1 from './v1/auth.route';
import userV1 from './v1/user.route';

const router = express.Router();

router.use('/v1/auth', authV1);
router.use('/v1', noteV1);
router.use('/v1', userV1);

export default router;
