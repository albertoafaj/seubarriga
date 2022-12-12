module.exports = (app) => {
  const findAll = (req, res) => {
    app.db('users').select()
      .then((users) => res.status(200).json(users));
  };

  const create = async (req, res) => {
    const result = await app.db('users').insert(req.body, '*');
    res.status(201).json(result[0]);
  };

  return { findAll, create };
};
