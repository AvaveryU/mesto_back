import express, { Response } from 'express';
import mongoose from 'mongoose';
import { IRequest } from './utils/interface';
import usersRouter from './routes/user';
import cardsRouter from './routes/card';
import errorRoutes from './utils/errorRoutes';

const { PORT = 3000 } = process.env;
const app = express();

app.use(express.json());
app.use(express.urlencoded());

app.use((req: IRequest, res: Response, next) => {
  req.user = { _id: '63b473e63fbcfc9e8528b242' };
  next();
});

mongoose.connect('mongodb://localhost:27017/mestodb');
app.use('/users', usersRouter);
app.use('/cards', cardsRouter);
app.use(errorRoutes);

app.listen(PORT);
