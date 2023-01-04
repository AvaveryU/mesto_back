import { Router } from 'express';
import { getUsers, createUser, getUser, refreshUser, refreshAvatar } from '../controllers/user';

const router = Router();

router.get('/', getUsers);
router.post('/', createUser);
router.get('/:userId', getUser);
router.patch('/me', refreshUser);
router.patch('/me/avatar', refreshAvatar);

export default router;
