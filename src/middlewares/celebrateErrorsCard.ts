import { celebrate, Joi } from 'celebrate';
import { validationLink } from '../utils/constants';

const validationPostCard = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    link: Joi.string().pattern(validationLink),
  }),
});

export default validationPostCard;
