const jwt = require('jsonwebtoken');
const BadRequest = require('../errors/bad-request');
const Unauthorized = require('../errors/unauthorized');
const NotFoundError = require('../errors/not-found-error');

module.exports = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    throw new Unauthorized('Unauthorized');
  }

  const token = authorization.replace('Bearer ', '');
  let payload;

  try {
    payload = jwt.verify(token, 'some-secret-key');
  } catch (err) {
    throw new Unauthorized('Unauthorized');
  }

  req.user = payload;

  next();
};
