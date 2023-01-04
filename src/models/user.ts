import { model, Schema } from 'mongoose';

export interface IUser {
  name: string; // имя пользователя
  about: string; // информация о пользователе
  avatar: string; // ссылка на аватарку
}

const userSchema = new Schema<IUser>({
  name: {
    type: String,
    minlength: 2,
    maxlength: 30,
    required: true,
  },
  about: {
    type: String,
    minlength: 2,
    maxlength: 30,
    required: true,
  },
  avatar: {
    type: String,
    required: true,
  },
});

export default model<IUser>('user', userSchema);
