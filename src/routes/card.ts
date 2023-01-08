import { Router } from 'express';
import validationPostCard from '../middlewares/celebrateErrorsCard';
import { getCards, createCard, removeCard, addLike, removeLike } from '../controllers/card';

const router = Router();

router.get('/', getCards);
router.post('/', validationPostCard, createCard);
router.delete('/:cardId', removeCard);
router.put('/:cardId/likes', addLike);
router.delete('/:cardId/likes', removeLike);

export default router;
