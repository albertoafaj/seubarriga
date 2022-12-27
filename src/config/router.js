const express = require('express');

module.exports = (app) => {
  app.use('/auth', app.routes.auth);
  const protectRouter = express.Router();
  protectRouter.use('/users', app.routes.users);
  protectRouter.use('/accounts', app.routes.accounts);
  protectRouter.use('/transactions', app.routes.transactions);
  protectRouter.use('/transfers', app.routes.transfers);
  app.use('/v1', app.config.passport.authenticate(), protectRouter);
};
