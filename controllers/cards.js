const { default: mongoose } = require('mongoose');
const Card = require('../models/card');
const NotFoundError = require('../errors/not-found-error');
const Forbidden = require('../errors/forbidden');

const getAllCards = (req, res, next) => {
  Card.find({})
    .then((cards) => res.send(cards))
    .catch(next);
};

const createCard = (req, res, next) => {
  const { name, link, owner } = req.body;
  Card.create({ name, link, owner })
    .then((card) => res.send(card))
    .catch(next);
};

const deleteCard = (req, res, next) => {
  Card.findByIdAndRemove(req.params.cardId)
    .orFail(() => {
      throw new NotFoundError('Not found');
    })
    .then((card) => {
      if (!card) {
        throw new NotFoundError('Not found');
      }
      res.send(card);
    })
    .catch(next);
};

const likeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .orFail(() => {
      throw new NotFoundError('Not found');
    })
    .then((card) => res.send(card))
    .catch(next);
};

const dislikeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .orFail(() => {
      throw new NotFoundError('Not found');
    })
    .then((card) => res.send(card))
    .catch(next);
};

module.exports = {
  getAllCards, createCard, deleteCard, likeCard, dislikeCard,
};
