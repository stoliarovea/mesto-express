const users = require('express').Router();
const {
  getAllUsers, getUserById, createUser, editUser, editAvatar,
} = require('../controllers/users');

users.get('/users', getAllUsers);
users.get('/users/:userId', getUserById);
users.post('/users', createUser);
users.patch('/users/me', editUser);
users.patch('/users/me/avatar', editAvatar);

module.exports = users;
