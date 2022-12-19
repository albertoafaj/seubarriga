const ValidationError = require('../erros/ValidationError');

module.exports = (app) => {
  const find = (userId, filter = {}) => app.db('transactions')
    .join('accounts', 'accounts.id', 'acc_id')
    .where(filter)
    .andWhere('accounts.user_id', '=', userId)
    .select();
  const findOne = (filter) => app.db('transactions')
    .where(filter)
    .first();
  const save = (obj) => {
    if (!obj.description) throw new ValidationError('Descrição é um atributo obrigatório');
    if (!obj.ammount) throw new ValidationError('Valor é um atributo obrigatório');
    if (!obj.date) throw new ValidationError('Data é um atributo obrigatório');
    if (!obj.acc_id) throw new ValidationError('Conta é um atributo obrigatório');
    if (!obj.type) throw new ValidationError('Tipo é um atributo obrigatório');
    if (obj.type !== 'I' && obj.type !== 'O') throw new ValidationError('Tipo invalido, valores válidos "I" Entradas / "O" Saídas');
    const transaction = obj;
    if ((transaction.type === 'I' && transaction.ammount < 0) || (transaction.type === 'O' && transaction.ammount > 0)) {
      transaction.ammount *= -1;
    }
    return app.db('transactions').insert(transaction, '*');
  };
  const update = (param, body) => app.db('transactions')
    .where(param)
    .update({ ...body }, '*');
  const remove = (id) => app.db('transactions')
    .where(id)
    .del();
  return { find, save, findOne, update, remove };
};
