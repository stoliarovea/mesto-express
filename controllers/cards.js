const Card = require('../models/card');

const getAllCards = (req, res) => {
  Card.find({})
    .then(cards => res.send(cards))
    .catch(err => res.status(500).send({ message: err }));
};

const createCard = (req, res) => {
  const owner = req.user._id;
  const { name, link } = req.body;
  Card.create({ name, link, owner })
    .then(card => res.send(card))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(400).send({ message: `${Object.values(err.errors).map(e => e.message).join(', ')}` });
      }
      else {
        return res.status(500).send({ message: err });
      }
    });
};

const deleteCard = (req, res) => {
  Card.findByIdAndRemove(req.params.cardId)
    .orFail(() => { throw new Error('NotFound'); })
    .then(card => res.send(card))
    .catch((err) => {
      if (err.message === 'NotFound') {
        return res.status(404).send({ message: 'Not Found' });
      }
      else {
        return res.status(500).send({ message: err });
      }
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

const dislikeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true }
  )
    .orFail(() => { throw new Error('NotFound'); })
    .then(card => res.send(card))
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

module.exports = { getAllCards, createCard, deleteCard, likeCard, dislikeCard };