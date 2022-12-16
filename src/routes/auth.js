const express = require('express');
const jwt = require('jwt-simple');
const bcrypt = require('bcrypt-nodejs');
const ValidationError = require('../erros/ValidationError');

const secret = 'Segredo!';

module.exports = (app) => {
  // eslint-disable-next-line consistent-return
  const router = express.Router();
  router.post('/signin', async (req, res, next) => {
    try {
      const user = await app.services.user.findOne({ email: req.body.email });
      let payload;
      if (!user) throw new ValidationError('Usuário ou senha inválido');
      if (bcrypt.compareSync(req.body.passwd, user.passwd)) {
        payload = {
          id: user.id,
          name: user.name,
          email: user.email,
        };
      } else {
        throw new ValidationError('Usuário ou senha inválido');
      }
      const token = jwt.encode(payload, secret);
      return res.status(200).json({ token });
    } catch (error) {
      return next(error);
    }
  });
  router.post('/signup', async (req, res, next) => {
    try {
      const result = await app.services.user.save(req.body);
      return res.status(201).json(result[0]);
    } catch (error) {
      return next(error);
    }
  });

  return router;
};
