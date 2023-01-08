import express from 'express';
import mongoose from 'mongoose';
import { errors } from 'celebrate';
import usersRouter from './routes/user';
import cardsRouter from './routes/card';
import errorRoutes from './utils/errorRoutes';
import { createUser, login } from './controllers/user';
import AuthMiddleware from './middlewares/auth';
import { requestLogger, errorLogger } from './middlewares/logger';
import setError from './middlewares/errors';
import { validationLogin, validationCreateUser } from './middlewares/celebrateErrorsUser';

const { PORT = 3000 } = process.env;
const app = express();

app.use(express.json());
app.use(express.urlencoded());

mongoose.connect('mongodb://localhost:27017/mestodb');

app.use(requestLogger); // логер запросов

// роуты, не требующие авторизации
app.post('/signup', validationCreateUser, createUser);
app.post('/signin', validationLogin, login);

app.use(AuthMiddleware); // авторизация

// роуты, которым авторизация нужна
app.use('/users', usersRouter);
app.use('/cards', cardsRouter);

app.use(errorRoutes); // обработка ошибочных роутов

app.use(errorLogger); // логер ошибок
app.use(errors()); // обработчик ошибок celebrate
app.use(setError); // централизованный обработчик ошибок

app.listen(PORT);
