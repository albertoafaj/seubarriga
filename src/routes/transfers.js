const express = require('express');
const WrongResourceError = require('../erros/WrongResourceError');

module.exports = (app) => {
  const router = express.Router();
  router.param('id', async (req, res, next) => {
    try {
      const result = await app.services.transfer.findOne({ id: req.params.id });
      if (result.user_id !== req.user.id) throw new WrongResourceError();
      return next();
    } catch (error) {
      return next(error);
    }
  });

  const validate = async (req, ers, next) => {
    try {
      await app.services.transfer.validate({ ...req.body, user_id: req.user.id });
      return next();
    } catch (error) {
      return next(error);
    }
  };
  router.get('/', async (req, res, next) => {
    try {
      const r = await app.services.transfer.find({ user_id: req.user.id });
      return res.status(200).json(r);
    } catch (error) {
      return next(error);
    }
  });
  router.post('/', validate, async (req, res, next) => {
    try {
      const transfer = { ...req.body, user_id: req.user.id };
      // if (req.body.user_id !== transfer.user_id) throw new WrongResourceError();
      const r = await app.services.transfer.save(transfer);
      return res.status(201).json(r);
    } catch (error) {
      return next(error);
    }
  });
  router.get('/:id', async (req, res, next) => {
    try {
      const result = await app.services.transfer.findOne({ id: req.params.id });
      return res.status(200).json(result);
    } catch (error) {
      return next(error);
    }
  });
  router.put('/:id', validate, async (req, res, next) => {
    try {
      // const transfer = { ...req.body, user_id: req.user.id };
      // if (req.body.user_id !== transfer.user_id) throw new WrongResourceError();
      const result = await app.services.transfer.update(req.params.id, req.body);
      return res.status(200).json(result);
    } catch (error) {
      return next(error);
    }
  });
  router.delete('/:id', async (req, res, next) => {
    try {
      await app.services.transfer.remove(req.params.id);
      return res.status(204).send();
    } catch (error) {
      return next(error);
    }
  });
  return router;
};
