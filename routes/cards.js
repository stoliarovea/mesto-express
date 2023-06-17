const { celebrate, Joi } = require('celebrate');
const cards = require('express').Router();
const {
  getAllCards, createCard, deleteCard, likeCard, dislikeCard,
} = require('../controllers/cards');

cards.get('/cards', getAllCards);

cards.post('/cards', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30).required(),
    link: Joi.string().required(),
  }),
}), createCard);

cards.delete('/cards/:cardId', deleteCard);

cards.put('/cards/:cardId/likes', likeCard);

cards.delete('/cards/:cardId/likes', dislikeCard);

module.exports = cards;
