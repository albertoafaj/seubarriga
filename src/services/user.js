const bcrypt = require('bcrypt-nodejs');
const ValidationError = require('../erros/ValidationError');

module.exports = (app) => {
  function findAll() {
    return app.db('users').select(['id', 'name', 'email']);
  }

  function findOne(filter = {}) {
    return app.db('users').where(filter).select().first();
  }

  const getPasswdHash = (passwd) => {
    const salt = bcrypt.genSaltSync(10);
    return bcrypt.hashSync(passwd, salt);
  };

  const save = async (user) => {
    const userData = user;
    if (!userData.name) throw new ValidationError('Nome é um atributo obrigatório');
    if (!userData.email) throw new ValidationError('Email é um atributo obrigatório');
    if (!userData.passwd) throw new ValidationError('Senha é um atributo obrigatório');
    const userDb = await findOne({ email: userData.email });
    if (userDb) throw new ValidationError('Ja existe um usuário com esse email');
    userData.passwd = getPasswdHash(userData.passwd);
    return app.db('users').insert(userData, ['id', 'name', 'email']);
  };

  return { findAll, save, findOne };
};
