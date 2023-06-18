const { default: mongoose } = require('mongoose');
const Card = require('../models/card');
const NotFoundError = require('../errors/not-found-error');
const Forbidden = require('../errors/forbidden');

const getAllCards = (req, res, next) => {
  Card.find({})
    .then((cards) => {
      if (!cards) {
        throw new NotFoundError('Not found');
      }
      res.send(cards);
    })
    .catch((err) => {
      if (err.name === 'NotFound') {
        next(new NotFoundError('Not found'));
      } else {
        next(err);
      }
    });
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
      if (req.user._id !== card.owner) {
        throw new Forbidden('Forbidden');
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
    .catch((err) => {
      if (err.name === 'NotFound') {
        next(new NotFoundError('Not found'));
      } else {
        next(err);
      }
    });
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
    .catch((err) => {
      if (err.name === 'NotFound') {
        next(new NotFoundError('Not found'));
      } else {
        next(err);
      }
    });
};

module.exports = {
  getAllCards, createCard, deleteCard, likeCard, dislikeCard,
};
