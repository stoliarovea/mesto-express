const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const BadRequest = require('../errors/bad-request');
const Unauthorized = require('../errors/unauthorized');
const NotFoundError = require('../errors/not-found-error');
const Conflict = require('../errors/conflict');

const getAllUsers = (req, res, next) => {
  User.find({})
    .then((users) => res.send(users))
    .catch(next);
};

const getUserById = (req, res, next) => {
  User.findById(req.params.userId)
    .orFail(() => {
      throw new NotFoundError('Not found');
    })
    .then((user) => {
      res.send(user);
    })
    .catch(next);
};

const getUserInfo = (req, res, next) => {
  User.findById(req.user._id)
    .orFail(() => {
      throw new NotFoundError('Not found');
    })
    .then((user) => {
      if (!user) {
        throw new NotFoundError('Not found');
      }
      res.send(user);
    })
    .catch(next);
};

const createUser = (req, res, next) => {
  const {
    email, password, name, about, avatar,
  } = req.body;
  bcrypt.hash(password, 10)
    .then((hash) => User.create({
      email, password: hash, name, about, avatar,
    }))
    .then((user) => {
      res.send(user);
    })
    .catch((err) => {
      if (err.code === 11000) {
        next(new Conflict('Email already registered'));
      }
      if (err.name === 'ValidationError') {
        next(new BadRequest('Invalid data'));
      } else {
        next(err);
      }
    });
};

const editUser = (req, res, next) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    { name, about },
    { new: true, runValidators: true, upsert: false },
  )
    .orFail(() => {
      throw new NotFoundError('Not found');
    })
    .then((user) => {
      res.send(user);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequest('Invalid data'));
      } else {
        next(err);
      }
    });
};

const editAvatar = (req, res, next) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    { avatar },
    { new: true, runValidators: true, upsert: false },
  )
    .orFail(() => {
      throw new NotFoundError('Not found');
    })
    .then((user) => {
      res.send(user);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequest('Invalid data'));
      } else {
        next(err);
      }
    });
};

const login = (req, res, next) => {
  const { email, password } = req.body;
  let user;
  User.findOne({ email }).select('+password')
    .then((userData) => {
      if (!userData) {
        return Promise.reject(new Unauthorized('Incorrect email or password'));
      }
      user = userData._id;
      return bcrypt.compare(password, userData.password);
    })
    .then((matched) => {
      if (!matched) {
        return Promise.reject(new Unauthorized('Incorrect email or password'));
      }
      const token = jwt.sign(
        { _id: user },
        'some-secret-key',
        { expiresIn: '7d' },
      );
      return res.send({ token });
    })
    .catch(next);
};

module.exports = {
  getAllUsers, getUserById, createUser, editUser, editAvatar, login, getUserInfo,
};
