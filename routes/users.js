const users = require('express').Router();
const {
  getAllUsers, getUserById, editUser, editAvatar, getUserInfo,
} = require('../controllers/users');

users.get('/users', getAllUsers);
users.get('/users/me', getUserInfo);
users.get('/users/:userId', getUserById);
users.patch('/users/me', editUser);
users.patch('/users/me/avatar', editAvatar);

module.exports = users;
