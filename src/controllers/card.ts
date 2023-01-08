import { NextFunction, Request, Response } from 'express';
import { ERROR_ACCESS_CLOSED, ERROR_NOT_FOUND, ERROR_SERVER, ERROR_UNCORRECT_DATA, SUCCESS_REQUEST } from '../utils/constants';
import Card from '../models/card';

export const getCards = (_req: Request, res: Response, next: NextFunction) => {
  Card.find({})
    .then((cards) => res.status(SUCCESS_REQUEST).send({ cards }))
    .catch(() => next(res.status(ERROR_SERVER).send({ message: 'Произошла ошибка при получении данных о карточках' })));
};

export const createCard = (req: Request, res: Response, next: NextFunction) => {
  const { name, link } = req.body;
  const userId = req.user._id;
  return Card.create({ name, link, owner: userId })
    .then((card) => res.status(SUCCESS_REQUEST).send({ card }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(res.status(ERROR_UNCORRECT_DATA).send({ message: 'Произошла ошибка при создании карточки' }));
      } else next(res.status(ERROR_SERVER).send({ message: 'Произошла ошибка на сервере при создании карточки' }));
    });
};

export const removeCard = (req: Request, res: Response, next: NextFunction) => {
  const userId = req.user._id;
  const { cardId } = req.params;
  Card.findById(cardId)
    .then((cardInformation) => {
      if (!cardInformation) {
        next(res.status(ERROR_NOT_FOUND).send({ message: 'Не найдена удаляемая карточка' }));
      } else if (cardInformation?.owner.toString() !== userId) {
        next(res.status(ERROR_ACCESS_CLOSED).send({ message: 'Отказано в удалении чужой карточки' }));
      } else Card.findByIdAndDelete(cardId);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(res.status(ERROR_UNCORRECT_DATA).send({ message: 'Передан невалидный id карточки' }));
      } else next(res.status(ERROR_SERVER).send({ message: 'Произошла ошибка при поиске карточки' }));
    });
};

export const addLike = async (req: Request, res: Response, next: NextFunction) => {
  const userId = req.user._id;
  const { cardId } = req.params;
  return Card.findByIdAndUpdate(
    cardId,
    { $addToSet: { likes: userId } },
    { new: true, runValidators: true },
  )
    .then((cardInformation) => {
      if (!cardInformation) {
        next(res.status(ERROR_NOT_FOUND).send({ message: 'Карточка не найдена' }));
      } else res.status(SUCCESS_REQUEST).send({ cardInformation });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(ERROR_UNCORRECT_DATA).send({ message: 'Переданы невалидные данные карточки' });
      } else next(res.status(ERROR_SERVER).send('Произошла ошибка на сервере при добавлении лайка'));
    });
};

export const removeLike = (req: Request, res: Response, next: NextFunction) => {
  const userId = req.user._id;
  const { cardId } = req.params;
  Card.findByIdAndUpdate(
    cardId,
    { $pull: { likes: userId } },
    { new: true, runValidators: true },
  )
    .then((cardInformation) => {
      if (!cardInformation) {
        next(res.status(ERROR_NOT_FOUND).send({ message: 'Карточка не найдена' }));
      } else res.status(SUCCESS_REQUEST).send({ cardInformation });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(res.status(ERROR_UNCORRECT_DATA).send({ message: 'Переданы невалидные данные карточки' }));
      } else next(res.status(ERROR_SERVER).send('Произошла ошибка на сервере при удалении лайка'));
    });
};
