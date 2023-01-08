import { NextFunction, Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { SUCCESS_REQUEST, ERROR_UNCORRECT_DATA, ERROR_NOT_FOUND, ERROR_SERVER, SECRET_KEY } from '../utils/constants';
import User from '../models/user';

export const login = (req: Request, res: Response, next: NextFunction) => {
  const { email, password } = req.body;
  User.findUserByCredentials(email, password)
    .then((user) => {
      // аутентификация успешна
      const token = jwt.sign({ _id: user._id }, SECRET_KEY, { expiresIn: '7d' }); // токен будет просрочен через 7 дней после создания
      res.send({ token });
    })
    .catch(next);
};

export const getCurrentUser = (req: Request, res: Response, next: NextFunction) => {
  const id = req.user._id;
  return User.findById(id)
    .then((user) => {
      if (!user) {
        next(res.status(ERROR_NOT_FOUND).send({ message: 'Пользователь не найден' }));
      } else res.status(SUCCESS_REQUEST).send(user);
    })
    .catch(next);
};

export const getUsers = (_req: Request, res: Response, next: NextFunction) => {
  User.find({})
    .then((users) => res.send(users))
    .catch(() => {
      next(res.status(ERROR_SERVER).send({ message: 'На сервере произошла ошибка' }));
    });
};

export const createUser = (req: Request, res: Response, next: NextFunction) => {
  const { name, about, avatar, email, password } = req.body;
  User.findOne({ email })
    .then((user) => {
      if (user) {
        next(res.send({ message: 'Пользователь с таким email уже существует' }));
      } else {
        bcrypt.hash(password, 10)
          .then((hash) => User.create({ name, about, avatar, email, password: hash }))
          .then((userInfo) => res.send(userInfo))
          .catch((err) => {
            if (err.name === 'ValidationError') {
              next(res.status(ERROR_UNCORRECT_DATA).send({ message: 'Неверный формат данных при создании пользователя' }));
            } else next(res.status(ERROR_SERVER).send({ message: 'На сервере произошла ошибка' }));
          });
      }
    });
};

export const getUser = (req: Request, res: Response, next: NextFunction) => {
  const id = req.params.userId;
  User.findById(id)
    .then((userInformation) => {
      if (!userInformation) {
        next(res.status(ERROR_NOT_FOUND).send({ message: 'Пользователь не найден' }));
      } else res.status(SUCCESS_REQUEST).send(userInformation);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(res.status(ERROR_UNCORRECT_DATA).send({ message: 'Переданы невалидные данные для получения данных о пользователе' }));
      } else next(res.status(ERROR_SERVER).send({ message: 'На сервере произошла ошибка' }));
    });
};

export const refreshUser = async (req: Request, res: Response, next: NextFunction) => {
  const { name, about } = req.body;
  const id = req.user._id;
  User.findByIdAndUpdate(
    id,
    { name, about },
    { new: true, runValidators: true },
  )
    .then((userInformation) => res.status(SUCCESS_REQUEST).send(userInformation))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(res.status(ERROR_UNCORRECT_DATA).send({ message: 'Переданы невалидные данные при обновлении данных пользователя' }));
      } else next(res.status(ERROR_SERVER).send({ message: 'На сервере произошла ошибка' }));
    });
};

export const refreshAvatar = (req: Request, res: Response, next: NextFunction) => {
  const { avatar } = req.body;
  const id = req.user._id;
  User.findByIdAndUpdate(
    id,
    { avatar },
    { new: true, runValidators: true },
  )
    .then((infoAvatar) => res.status(SUCCESS_REQUEST).send(infoAvatar))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(res.status(ERROR_UNCORRECT_DATA).send({ message: 'Переданы невалидные данные при обновлении аватара пользователя' }));
      } else next(res.status(ERROR_SERVER).send({ message: 'На сервере произошла ошибка' }));
    });
};
