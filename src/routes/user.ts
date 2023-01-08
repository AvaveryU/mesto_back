import { Router } from 'express';
import { validationRefreshAvavtar, validationRefreshUserInfo, validationUserId } from '../middlewares/celebrateErrorsUser';
import { getUsers, getUser, refreshUser, refreshAvatar, getCurrentUser } from '../controllers/user';

const router = Router();

router.get('/', getUsers);
router.get('/me', getCurrentUser);
router.get('/:userId', validationUserId, getUser);
router.patch('/me', validationRefreshUserInfo, refreshUser);
router.patch('/me/avatar', validationRefreshAvavtar, refreshAvatar);

export default router;
