import { model, Schema } from 'mongoose';

export interface ICard {
  name: string; // имя карточки
  link: string; // ссылка на картинку
  owner: Schema.Types.ObjectId; // ссылка на модель автора карточки
  likes: [Schema.Types.ObjectId]; // список лайкнувших пост пользователей
  createdAt: Date; // дата создания
}

const cardSchema = new Schema<ICard>({
  name: {
    type: String,
    minlength: 2,
    maxlength: 30,
    required: true,
  },
  link: {
    type: String,
    required: true,
  },
  owner: {
    type: Schema.Types.ObjectId,
    ref: 'user',
    required: true,
  },
  likes: [{
    type: Schema.Types.ObjectId,
    ref: 'user',
    default: [],
  }],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default model<ICard>('card', cardSchema);
