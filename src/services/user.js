module.exports = (app) => {
  function findAll(filter = {}) {
    return app.db('users').where(filter).select();
  }

  const save = async (user) => {
    if (!user.name) return { error: 'Nome é um atributo obrigatório' };
    if (!user.email) return { error: 'Email é um atributo obrigatório' };
    if (!user.passwd) return { error: 'Senha é um atributo obrigatório' };
    const userDb = await findAll({ email: user.email });
    if (userDb && userDb.length > 0) return { error: 'Ja existe um usuário com esse email' };
    return app.db('users').insert(user, '*');
  };

  return { findAll, save };
};
