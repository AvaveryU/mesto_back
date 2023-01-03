import { Request, Response } from 'express';
import { ERROR_ACCESS_CLOSED, ERROR_NOT_FOUND, ERROR_SERVER, SUCCESS_REQUEST } from '../utils/constants';
import Card from '../models/card'
import { IRequest } from 'utils/interface';

export const getCards = (req: Request, res: Response) => {
    return Card.find({})
      .then(cards => res.status(SUCCESS_REQUEST).send({ data: cards }))
      .catch(() => res.status(ERROR_SERVER).send({ message: 'Произошла ошибка при получении данных о карточках' }))
}

export const createCard = (req: IRequest, res: Response) => {
    const { name, link } = req.body;
    const userId = req.user?._id;
    return Card.create({ name, link, owner: userId })
        .then(card => res.status(SUCCESS_REQUEST).send({ data: card }))
        .catch(() => res.status(ERROR_SERVER).send({ message: 'Произошла ошибка при создании карточки' }));
}

export const removeCard = (req: IRequest, res: Response) => {
  const userId = req.user?._id;
  const cardId = req.params.cardId;
  Card.findById(cardId)
    .then((cardInformation) => {
      if (!cardInformation) {
        res.status(ERROR_NOT_FOUND).send({ message: 'Не найдена удаляемая карточка' })
      }
      if (cardInformation?.owner.toString() !== userId) {
        res.status(ERROR_ACCESS_CLOSED).send({ message: 'Отказано в удалении чужой карточки' })
      }
      return Card.findByIdAndDelete(cardId);
    })
    .catch(() => {
      res.status(ERROR_SERVER).send({ message: 'Произошла ошибка при поиске карточки' });
    });
};

export const addLike = async (req: IRequest, res: Response) => {
  const userId = req.user?._id;
  const cardId = req.params.cardId;
  return Card.findByIdAndUpdate(
    cardId,
    { $addToSet: { likes: userId }},
    { new: true, runValidators: true },
    )
    .then((cardInformation) => res.status(SUCCESS_REQUEST).send({ data: cardInformation }))
    .catch(() => res.status(ERROR_SERVER).send('Произошла ошибка на сервере при добавлении лайка'));
};

export const removeLike = (req: IRequest, res: Response) => {
  const userId = req.user?._id;
  const cardId = req.params.cardId;
  Card.findByIdAndUpdate(
    cardId,
    { $pull: { likes: userId } },
    { new: true, runValidators: true },
  )
    .then((infoAvatar) => res.status(SUCCESS_REQUEST).send({ data: infoAvatar }))
    .catch(() => res.status(ERROR_SERVER).send('Произошла ошибка на сервере при удалении лайка'));
};