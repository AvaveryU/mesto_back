import { Request, Response } from 'express';
import { IRequest } from '../utils/interface';
import { ERROR_ACCESS_CLOSED, ERROR_NOT_FOUND, ERROR_SERVER, ERROR_UNCORRECT_DATA, SUCCESS_REQUEST } from '../utils/constants';
import Card from '../models/card';

export const getCards = (req: Request, res: Response) => {
  Card.find({})
    .then((cards) => res.status(SUCCESS_REQUEST).send({ data: cards }))
    .catch(() => res.status(ERROR_SERVER).send({ message: 'Произошла ошибка при получении данных о карточках' }));
};

export const createCard = (req: IRequest, res: Response) => {
  const { name, link } = req.body;
  const userId = req.user!._id;
  return Card.create({ name, link, owner: userId })
    .then((card) => res.status(SUCCESS_REQUEST).send({ data: card }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(ERROR_UNCORRECT_DATA).send({ message: 'Произошла ошибка при создании карточки' });
      } else res.status(ERROR_SERVER).send({ message: 'Произошла ошибка на сервере при создании карточки' });
    });
};

export const removeCard = (req: IRequest, res: Response) => {
  const userId = req.user!._id;
  const { cardId } = req.params;
  Card.findById(cardId)
    .then((cardInformation) => {
      if (!cardInformation) {
        res.status(ERROR_NOT_FOUND).send({ message: 'Не найдена удаляемая карточка' });
      } else if (cardInformation?.owner.toString() !== userId) {
        res.status(ERROR_ACCESS_CLOSED).send({ message: 'Отказано в удалении чужой карточки' });
      } else Card.findByIdAndDelete(cardId);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(ERROR_UNCORRECT_DATA).send({ message: 'Передан невалидный id карточки' });
      } else res.status(ERROR_SERVER).send({ message: 'Произошла ошибка при поиске карточки' });
    });
};

export const addLike = async (req: IRequest, res: Response) => {
  const userId = req.user!._id;
  const { cardId } = req.params;
  return Card.findByIdAndUpdate(
    cardId,
    { $addToSet: { likes: userId } },
    { new: true, runValidators: true },
  )
    .then((cardInformation) => {
      if (!cardInformation) {
        res.status(ERROR_NOT_FOUND).send({ message: 'Карточка не найдена' });
      } else res.status(SUCCESS_REQUEST).send({ data: cardInformation });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(ERROR_UNCORRECT_DATA).send({ message: 'Переданы невалидные данные карточки' });
      } else res.status(ERROR_SERVER).send('Произошла ошибка на сервере при добавлении лайка');
    });
};

export const removeLike = (req: IRequest, res: Response) => {
  const userId = req.user!._id;
  const { cardId } = req.params;
  Card.findByIdAndUpdate(
    cardId,
    { $pull: { likes: userId } },
    { new: true, runValidators: true },
  )
    .then((cardInformation) => {
      if (!cardInformation) {
        res.status(ERROR_NOT_FOUND).send({ message: 'Карточка не найдена' });
      } else res.status(SUCCESS_REQUEST).send({ data: cardInformation });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(ERROR_UNCORRECT_DATA).send({ message: 'Переданы невалидные данные карточки' });
      } else res.status(ERROR_SERVER).send('Произошла ошибка на сервере при удалении лайка');
    });
};
