import { NextFunction, Request, Response } from 'express';
import { IError } from '../utils/interface';
import { ERROR_SERVER } from '../utils/constants';

const setError = (err: IError, req: Request, res: Response, next: NextFunction) => {
  const { statusCode = 500, message } = err;
  res.status(statusCode).send({
    message: statusCode === ERROR_SERVER
      ? 'На сервере произошла ошибка'
      : message,
  });
  next();
};

export default setError;
