const { default: mongoose } = require('mongoose');
const User = require('../models/user');

STATUS_CODES = {
  BAD_REQUEST: 400,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500
}

const getAllUsers = (req, res) => {
  User.find({})
    .then(users => res.send(users))
    .catch(err => res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).send({ message: err }));
};

const getUserById = (req, res) => {
  User.findById(req.params.userId)
    .orFail(() => { throw new Error('NotFound'); })
    .then(user => res.send(user))
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

const createUser = (req, res) => {
  const { name, about, avatar } = req.body;
  User.create({ name, about, avatar })
    .then(user => res.send(user))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(STATUS_CODES.BAD_REQUEST).send({ message: `${Object.values(err.errors).map(e => e.message).join(', ')}` });
      }
      return res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).send({ message: err });
    });
};

const editUser = (req, res) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    { name, about },
    { new: true, runValidators: true, upsert: false }
  )
    .orFail(() => { throw new Error('NotFound'); })
    .then(user => res.send(user))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(STATUS_CODES.BAD_REQUEST).send({ message: `${Object.values(err.errors).map(e => e.message).join(', ')}` });
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
    { new: true, runValidators: true, upsert: false }
  )
    .orFail(() => { throw new Error('NotFound'); })
    .then(user => res.send(user))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(STATUS_CODES.BAD_REQUEST).send({ message: `${Object.values(err.errors).map(e => e.message).join(', ')}` });
      }
      if (err.message === 'NotFound') {
        return res.status(STATUS_CODES.NOT_FOUND).send({ message: 'Not Found' });
      }
      return res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).send({ message: err });
    });
};

module.exports = { getAllUsers, getUserById, createUser, editUser, editAvatar };