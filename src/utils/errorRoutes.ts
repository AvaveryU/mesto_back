import { Request, Response, NextFunction } from 'express';
import { ERROR_NOT_FOUND } from './constants';

const errorRoutes = (_req: Request, res: Response, next: NextFunction) => {
  next(res.status(ERROR_NOT_FOUND).send({ message: 'Такой страницы не существует' }));
};

export default errorRoutes;
