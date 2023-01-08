import { NextFunction, Response, Request } from 'express';
import jwt from 'jsonwebtoken';
import { ObjectId } from 'mongoose';
import { ERROR_AUTH } from '../utils/constants';

const AuthMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const { authorization } = req.headers; // авторизационный заголовок
  if (!authorization || !authorization.startsWith('Bearer ')) {
    return res.status(ERROR_AUTH).send({ message: 'Необходима авторизация' });
  }
  const token = authorization.replace('Bearer ', ''); // извлечене токена, запишется только JWT
  let payload;
  try {
    payload = jwt.verify(token, 'some-secret-key'); // верификация токена
  } catch (err) {
    return res.status(ERROR_AUTH).send({ message: 'Ошибка авторизации' });
  }
  req.user = payload as { _id: ObjectId }; // запись payload в объект запроса
  return next();
};

export default AuthMiddleware;
