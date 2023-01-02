import path from 'path';
import express, { Request, Response } from 'express';
import mongoose from 'mongoose';
import { IRequest } from 'controllers/user';

const { PORT = 3000, BASE_PATH } = process.env;
const app = express();

app.use(express.json());
app.use(express.urlencoded());

mongoose.connect('mongodb://localhost:27017/mestodb');

//app.use('/users', usersRouter);
//app.use('/cards', cardsRouter);
app.use((req: IRequest, res: Response, next) => {
  req.user = {
    _id: '63b2c9cf97c52473a263f217'
  };
  next();
});


app.use(express.static(path.join(__dirname, 'public')));
app.listen(PORT, () => {
  console.log(BASE_PATH);
});