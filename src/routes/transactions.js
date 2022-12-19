const express = require('express');

module.exports = (app) => {
  const router = express.Router();

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
      console.log(res.json(result));

      return res.status(200).json(result);
    } catch (error) {
      return next(error);
    }
  });
  return router;
};
