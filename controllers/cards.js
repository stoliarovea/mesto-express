const { default: mongoose } = require('mongoose');
const Card = require('../models/card');

STATUS_CODES = {
  BAD_REQUEST: 400,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500
}

const getAllCards = (req, res) => {
  Card.find({})
    .then(cards => res.send(cards))
    .catch(err => res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).send({ message: err }));
};

const createCard = (req, res) => {
  const owner = req.user._id;
  const { name, link } = req.body;
  Card.create({ name, link, owner })
    .then(card => res.send(card))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(STATUS_CODES.BAD_REQUEST).send({ message: `${Object.values(err.errors).map(e => e.message).join(', ')}` });
      }
      return res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).send({ message: err });
    });
};

const deleteCard = (req, res) => {
  Card.findByIdAndRemove(req.params.cardId)
    .orFail(() => { throw new Error('NotFound'); })
    .then(card => res.send(card))
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

const likeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true }
  )
    .orFail(() => { throw new Error('NotFound'); })
    .then(card => res.send(card))
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

const dislikeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true }
  )
    .orFail(() => { throw new Error('NotFound'); })
    .then(card => res.send(card))
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

module.exports = { getAllCards, createCard, deleteCard, likeCard, dislikeCard };