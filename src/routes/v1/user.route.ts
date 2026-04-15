import express from 'express';
import authMiddleware from '../../middlewares/auth.middleware';
import permit from '../../middlewares/role.middleware';
import userController from '../../controllers/user.controller';

const router = express.Router();

router.get('/users', authMiddleware, permit('admin'), userController.getUsers);
router.post(
  '/users',
  authMiddleware,
  permit('admin'),
  userController.createUser,
);
router.put(
  '/users/:id',
  authMiddleware,
  permit('admin'),
  userController.updateUser,
);
router.delete(
  '/users/:id',
  authMiddleware,
  permit('admin'),
  userController.deleteUser,
);
router.get(
  '/users/group-by-interests',
  authMiddleware,
  permit('admin'),
  userController.groupByInterests,
);
router.get(
  '/users/:id/notes',
  authMiddleware,
  permit('user', 'admin'),
  userController.getUserNotes,
);

export default router;
