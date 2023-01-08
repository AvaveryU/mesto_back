import { celebrate, Joi } from 'celebrate';
import { validationEmail, validationLink } from '../utils/constants';

export const validationCreateUser = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email({ minDomainSegments: 2 }).pattern(validationEmail),
    password: Joi.string().required(),
    name: Joi.string().min(2).max(30),
    avatar: Joi.string().pattern(validationLink),
    about: Joi.string().min(2).max(30),
  }),
});

export const validationLogin = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email({ minDomainSegments: 2 }).pattern(validationEmail),
    password: Joi.string().required(),
  }),
});

export const validationRefreshAvavtar = celebrate({
  // eslint object-curly-newline: ["error", "never"]
  body: Joi.object().keys({ // eslint object-curly-newline: ["error", "never"]
    avatar: Joi.string().pattern(validationLink),
  }),
});

export const validationRefreshUserInfo = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
  }),
});

export const validationUserId = celebrate({ // eslint object-curly-newline: ["error", "never"]
  body: Joi.object().keys({ userId: Joi.string().required() }),
});
