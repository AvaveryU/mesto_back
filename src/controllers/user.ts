import { Request, Response } from 'express';
import { ERROR_SERVER, SUCCESS_REQUEST, ERROR_UNCORRECT_DATA } from '../utils/constants';
import User from '../models/user'
import { IRequest } from 'utils/interface';

export const getUsers = (req: Request, res: Response) => {
    return User.find({})
      .then(users => res.status(SUCCESS_REQUEST).send({ data: users }))
      .catch(() => res.status(ERROR_SERVER).send({ message: 'Произошла ошибка при получении данных о пользователях' }))
}

export const createUser = (req: Request, res: Response) => {
    const { name, about, avatar } = req.body;
    console.log(req.body)
    return User.create({ name, about, avatar })
        .then(user => res.status(SUCCESS_REQUEST).send({ data: user }))
        .catch((err) => {
          if (err.name === 'ValidationError') {
            return res.status(ERROR_UNCORRECT_DATA).send({ message: 'Неверный формат данных при создании пользователя' });
          } else res.status(ERROR_SERVER).send({ message: 'Произошла ошибка при создании пользователя' })});
}

export const getUser = (req: Request, res: Response) => {
  User.findById(req.params.userId)
    .then((userInformation) => res.status(SUCCESS_REQUEST).send({ data: userInformation }))
    .catch(() => {
      res.status(ERROR_SERVER).send({ message: 'Произошла ошибка при поиске пользователя по указанному id' });
    });
};

export const refreshUser = async (req: IRequest, res: Response) => {
  const { name, about } = req.body;
  const id = req?.user?._id;

  return User.findByIdAndUpdate(
    id,
    { name, about },
    { new: true, runValidators: true },
    )
    .then((userInformation) => res.status(SUCCESS_REQUEST).send({data: userInformation}))
    .catch((err) => {
      console.log(err)
      res.status(ERROR_SERVER).send('Произошла ошибка на сервере')});
};

export const refreshAvatar = (req: IRequest, res: Response) => {
  const { avatar } = req.body;
  const id = req?.user?._id;

  User.findByIdAndUpdate(
    id,
    { avatar },
    { new: true, runValidators: true },
  )
    .then((infoAvatar) => res.status(SUCCESS_REQUEST).send({data: infoAvatar}))
    .catch(() => res.status(ERROR_SERVER).send('Произошла ошибка на сервере'));
};