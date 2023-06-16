const { default: mongoose } = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

const STATUS_CODES = {
  BAD_REQUEST: 400,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500,
};

const getAllUsers = (req, res) => {
  User.find({})
    .then((users) => res.send(users))
    .catch((err) => res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).send({ message: err }));
};

const getUserById = (req, res) => {
  User.findById(req.params.userId)
    .orFail(() => { throw new Error('NotFound'); })
    .then((user) => res.send(user))
    .catch((err) => {
      if (err instanceof mongoose.Error.CastError) {
        return res.status(STATUS_CODES.BAD_REQUEST).send({ message: 'Invalid ID' });
      }
      if (err.message === 'NotFound') {
        return res.status(STATUS_CODES.NOT_FOUND).send({ message: 'Not Found' });
      }
      return res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).send({ message: err });
    });
};

const getUserInfo = (req, res) => {
  const { user } = req.body;
  User.findOne({ user })
    .then((data) => res.send(data))
    .catch((err) => res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).send({ message: err }));
};

const createUser = (req, res) => {
  const { email, password, name, about, avatar } = req.body;
  if (validator.isEmail(email)) {
    bcrypt.hash(password, 10)
      .then((hash) => User.create({ email, password: hash, name, about, avatar }))
      .then((user) => res.send(user))
      .catch((err) => {
        if (err.name === 'ValidationError') {
          return res.status(STATUS_CODES.BAD_REQUEST).send({ message: `${Object.values(err.errors).map((e) => e.message).join(', ')}` });
        }
        return res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).send({ message: err });
      });
  } else {
    return res.status(STATUS_CODES.BAD_REQUEST).send({ message: 'Invalid Email' });
  }
};

const editUser = (req, res) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    { name, about },
    { new: true, runValidators: true, upsert: false },
  )
    .orFail(() => { throw new Error('NotFound'); })
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(STATUS_CODES.BAD_REQUEST).send({ message: `${Object.values(err.errors).map((e) => e.message).join(', ')}` });
      }
      if (err.message === 'NotFound') {
        return res.status(STATUS_CODES.NOT_FOUND).send({ message: 'Not Found' });
      }
      return res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).send({ message: err });
    });
};

const editAvatar = (req, res) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    { avatar },
    { new: true, runValidators: true, upsert: false },
  )
    .orFail(() => { throw new Error('NotFound'); })
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(STATUS_CODES.BAD_REQUEST).send({ message: `${Object.values(err.errors).map((e) => e.message).join(', ')}` });
      }
      if (err.message === 'NotFound') {
        return res.status(STATUS_CODES.NOT_FOUND).send({ message: 'Not Found' });
      }
      return res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).send({ message: err });
    });
};

const login = (req, res) => {
  const { email, password } = req.body;
  let user;
  User.findOne({ email }).select('+password')
    .then((userData) => {
      if (!userData) {
        return Promise.reject(new Error('Incorrect email or password'));
      }
      user = userData._id;
      return bcrypt.compare(password, userData.password);
    })
    .then((matched) => {
      if (!matched) {
        return Promise.reject(new Error('Incorrect email or password'));
      }
      const token = jwt.sign(
        { _id: user },
        'some-secret-key',
        { expiresIn: '7d' },
      );
      return res.send({ token });
    })
    .catch((err) => {
      res.status(401).send({ message: err.message });
    });
};

module.exports = {
  getAllUsers, getUserById, createUser, editUser, editAvatar, login, getUserInfo,
};
