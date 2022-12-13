const ValidationError = require('../erros/ValidationError');

module.exports = (app) => {
  function findAll(filter = {}) {
    return app.db('users').where(filter).select();
  }

  const save = async (user) => {
    if (!user.name) throw new ValidationError('Nome é um atributo obrigatório');
    if (!user.email) throw new ValidationError('Email é um atributo obrigatório');
    if (!user.passwd) throw new ValidationError('Senha é um atributo obrigatório');
    const userDb = await findAll({ email: user.email });
    if (userDb && userDb.length > 0) throw new ValidationError('Ja existe um usuário com esse email');
    return app.db('users').insert(user, '*');
  };

  return { findAll, save };
};
