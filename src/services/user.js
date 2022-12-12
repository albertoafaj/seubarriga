module.exports = (app) => {
  const findAll = () => app.db('users').select();

  const save = (user) => app.db('users').insert(user, '*');

  return { findAll, save };
};
