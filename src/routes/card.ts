import { Router } from 'express';
import { getCards, createCard, removeCard, addLike, removeLike } from '../controllers/card';

const router = Router();

router.get('/', getCards);
router.post('/', createCard);
router.delete('/:cardId', removeCard);
router.put('/:cardId/likes', addLike);
router.delete('/:cardId/likes', removeLike);

export default router;
