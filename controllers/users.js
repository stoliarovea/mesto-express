const { default: mongoose } = require('mongoose');
const User = require('../models/user');

const getAllUsers = (req, res) => {
  User.find({})
    .then(users => res.send(users))
    .catch(err => res.status(500).send({ message: err }));
};

const getUserById = (req, res) => {
  User.findById(req.params.userId)
    .orFail(() => { throw new Error('NotFound'); })
    .then(user => res.send(user))
    .catch((err) => {
      if (err instanceof mongoose.Error.CastError) {
        return res.status(400).send({ message: 'Not Found' });
      }
      if (err.message === 'NotFound') {
        return res.status(404).send({ message: 'Not Found' });
      }
      else {
        return res.status(500).send({ message: err });
      }
    });
};

const createUser = (req, res) => {
  const { name, about, avatar } = req.body;
  User.create({ name, about, avatar })
    .then(user => res.send(user))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(400).send({ message: `${Object.values(err.errors).map(e => e.message).join(', ')}` });
      }
      else {
        return res.status(500).send({ message: err });
      }
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
        return res.status(400).send({ message: `${Object.values(err.errors).map(e => e.message).join(', ')}` });
      }
      if (err.message === 'NotFound') {
        return res.status(404).send({ message: 'Not Found' });
      }
      else {
        return res.status(500).send({ message: err });
      }
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
        return res.status(400).send({ message: `${Object.values(err.errors).map(e => e.message).join(', ')}` });
      }
      if (err.message === 'NotFound') {
        return res.status(404).send({ message: 'Not Found' });
      }
      else {
        return res.status(500).send({ message: err });
      }
    });
};

module.exports = { getAllUsers, getUserById, createUser, editUser, editAvatar };