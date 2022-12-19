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
