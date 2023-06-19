const { celebrate, Joi } = require('celebrate');
const users = require('express').Router();
const {
  getAllUsers,
  getUserById,
  editUser,
  editAvatar,
  getUserInfo,
} = require('../controllers/users');

users.get('/users', getAllUsers);

users.get('/users/me', getUserInfo);

users.get('/users/:userId', celebrate({
  params: Joi.object().keys({
    userId: Joi.string().length(24).hex().required(),
  }),
}), getUserById);

users.patch('/users/me', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
  }),
}), editUser);

users.patch('/users/me/avatar', celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().uri().pattern(/^https?:\/\/(?:www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b(?:[-a-zA-Z0-9()@:%_+.~#?&/=]*)$/),
  }),
}), editAvatar);

module.exports = users;
