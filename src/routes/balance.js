const express = require('express');

module.exports = (app) => {
  const router = express.Router();
  router.get('/', async (req, res, next) => {
    try {
      const result = await app.services.balance.getBalance(req.user.id);
      return res.status(200).json(result);
    } catch (error) {
      return next(error);
    }
  });
  return router;
};
