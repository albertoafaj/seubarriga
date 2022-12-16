const express = require('express');

module.exports = (app) => {
  const router = express.Router();

  router.post('/', async (req, res, next) => {
    try {
      const result = await app.services.account.save({ ...req.body, user_id: req.user.id });
      return res.status(201).json(result[0]);
    } catch (error) {
      return next(error);
    }
  });
  router.get('/', async (req, res, next) => {
    try {
      const result = await app.services.account.findAll();
      return res.status(200).json(result);
    } catch (error) {
      return next(error);
    }
  });
  router.get('/:id', async (req, res, next) => {
    try {
      const result = await app.services.account.find({ id: req.params.id });
      return res.status(200).json(result);
    } catch (error) {
      return next(error);
    }
  });
  router.put('/:id', async (req, res, next) => {
    try {
      const result = await app.services.account.update(req.params.id, req.body);
      return res.status(200).json(result[0]);
    } catch (error) {
      return next(error);
    }
  });
  router.delete('/:id', async (req, res, next) => {
    try {
      await app.services.account.remove(req.params.id);
      return res.status(204).send();
    } catch (error) {
      return next(error);
    }
  });
  return router;
};
