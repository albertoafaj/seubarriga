const express = require('express');
const WrongResourceError = require('../erros/WrongResourceError');

module.exports = (app) => {
  const router = express.Router();

  router.param('id', async (req, res, next) => {
    try {
      const result = await app.services.transaction.find(req.user.id, { 'transactions.id': req.params.id });
      if (result.length > 0) return next();
      throw new WrongResourceError();
    } catch (error) {
      return next(error);
    }
  });

  router.get('/', async (req, res, next) => {
    try {
      const result = await app.services.transaction.find(req.user.id);
      return res.status(200).json(result);
    } catch (error) {
      return next(error);
    }
  });

  router.post('/', async (req, res, next) => {
    try {
      const result = await app.services.transaction.save(req.body);
      return res.status(201).json(result[0]);
    } catch (error) {
      return next(error);
    }
  });

  router.get('/:id', async (req, res, next) => {
    try {
      const result = await app.services.transaction.findOne({ id: req.params.id });
      return res.status(200).json(result);
    } catch (error) {
      return next(error);
    }
  });

  router.put('/:id', async (req, res, next) => {
    try {
      const result = await app.services.transaction.update({ id: req.params.id }, req.body);
      return res.status(200).json(result);
    } catch (error) {
      return next(error);
    }
  });

  router.delete('/:id', async (req, res, next) => {
    try {
      await app.services.transaction.remove({ id: req.params.id });
      return res.status(204).send();
    } catch (error) {
      return next(error);
    }
  });
  return router;
};
