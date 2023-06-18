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
    userId: Joi.string().alphanum().length(24),
  }),
}), getUserById);

users.patch('/users/me', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
  }),
}), editUser);

users.patch('/users/me/avatar', editAvatar);

module.exports = users;
