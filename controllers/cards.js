const Card = require('../models/card');
const NotFoundError = require('../errors/not-found-error');
const Forbidden = require('../errors/forbidden');
const BadRequest = require('../errors/bad-request');

const getAllCards = (req, res, next) => {
  Card.find({})
    .then((cards) => {
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
  Card.create({
    name: req.body.name,
    link: req.body.link,
    owner: req.user._id,
  })
    .then((card) => res.send(card))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequest('Invalid data'));
      } else {
        next(err);
      }
    });
};

const deleteCard = (req, res, next) => {
  Card.findById(req.params.cardId)
    .orFail(() => {
      throw new NotFoundError('Not found');
    })
    .then((card) => {
      if (req.user._id !== card.owner.toString()) {
        throw new Forbidden('Forbidden');
      }
      Card.findByIdAndRemove(req.params.cardId)
        .orFail(() => {
          throw new NotFoundError('Not found');
        })
        .then((deletedCard) => {
          res.send(deletedCard);
        })
        .catch(next);
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
      next(err);
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
      next(err);
    });
};

module.exports = {
  getAllCards, createCard, deleteCard, likeCard, dislikeCard,
};
