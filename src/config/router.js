const express = require('express');

module.exports = (app) => {
  app.use('/auth', app.routes.auth);
  const protectRouter = express.Router();
  protectRouter.use('/users', app.routes.users);
  protectRouter.use('/accounts', app.routes.accounts);
  app.use('/v1', app.config.passport.authenticate(), protectRouter);
};
