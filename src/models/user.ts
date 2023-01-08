import { model, Model, Schema, Document } from 'mongoose';
import validator from 'validator';
import bcrypt from 'bcrypt';

export interface IUser {
  name: string; // имя пользователя
  about: string; // информация о пользователе
  avatar: string; // ссылка на аватарку
  email: string;
  password: string;
}

interface IUserModel extends Model<IUser> {
  // eslint-disable-next-line no-unused-vars
  findUserByCredentials: (email: string, password: string) => Promise<Document<unknown, any, IUser>>
}

const userSchema = new Schema<IUser, IUserModel>({
  name: {
    type: String,
    minlength: 2,
    maxlength: 30,
    default: 'Жак-Ив Кусто',
  },
  about: {
    type: String,
    minlength: 2,
    maxlength: 30,
    default: 'Исследователь',
  },
  avatar: {
    type: String,
    default: 'https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png',
    validate: {
      validator: (v: string) => validator.isURL(v),
      message: 'Неправильный формат ссылки',
    },
  },
  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: (v: string) => validator.isEmail(v),
      message: 'Неправильный формат почты',
    },
  },
  password: {
    type: String,
    required: true,
    select: false, // хеш пароля пользователя не будет возвращаться из базы
  },
});

// собственный метод к сущ.схеме
userSchema.static('findUserByCredentials', function findUserByCredentials(email: string, password: string) {
  return this.findOne({ email }).select('+password') // хеш пароля пользователя будет возвращаться из базы, т.к. аутентификация
    .then((user) => {
      if (!user) {
        return Promise.reject(new Error('Неправильные почта или пароль')); // пользователь не найден — отклоняем промис
      }
      return bcrypt.compare(password, user.password).then((matched) => {
        if (!matched) {
          return Promise.reject(new Error('Неправильные почта или пароль')); // хеши не совпали — отклоняем промис
        }
        return user;
      });
    });
});

export default model<IUser, IUserModel>('user', userSchema);
