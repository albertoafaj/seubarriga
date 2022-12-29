const app = require('express')();
const consign = require('consign');
const knex = require('knex');
const knexfile = require('../knexenvs');

console.log(`Aplication connection in: ${process.env.NODE_ENV}`);

app.db = knex(knexfile[process.env.NODE_ENV]);

consign({ cwd: 'src', verbose: false })
  .include('./config/passport.js')
  .then('./config/middlewares.js')
  .then('./services')
  .then('./routes')
  .then('./config/router.js')
  .into(app);

app.get('/', (req, res) => {
  res.status(200).send();
});

app.use((err, req, res, next) => {
  const { name, message, stack } = err;
  if (name === 'ValidationError') res.status(400).json({ error: message });
  else if (name === 'WrongResourceError') res.status(403).json({ error: message });
  else {
    console.log(message);
    res.status(500).json({ name, message, stack });
  }
  next(err);
});

// eslint-disable-next-line no-shadow

// LOGGER

/* app.db.on('query', (query) => {
  console.log({ sql: query.sql, bindings: query.bindings ? query.bindings.join(',') : '' });
})
.on('query-response', (response) => console.log(response))
.on('error', (error) => console.log(error));
 */
module.exports = app;
