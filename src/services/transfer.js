const ValidationError = require('../erros/ValidationError');

module.exports = (app) => {
  const findOne = (filter = {}) => app.db('transfers')
    .where(filter)
    .first();
  const find = (filter = {}) => app.db('transfers')
    .where(filter)
    .select();

  const validate = async (transfer) => {
    if (!transfer.description) throw new ValidationError('Descrição é um atributo obrigatório');
    if (!transfer.ammount) throw new ValidationError('Valor é um atributo obrigatório');
    if (!transfer.date) throw new ValidationError('Data é um atributo obrigatório');
    if (!transfer.acc_ori_id) throw new ValidationError('Conta de origem é um atributo obrigatório');
    if (!transfer.acc_des_id) throw new ValidationError('Conta de destino é um atributo obrigatório');
    if (transfer.acc_ori_id === transfer.acc_des_id) throw new ValidationError('Conta de origem e destino não podem ser iguais');
    const userAccounts = await app.db('accounts').whereIn('id', [transfer.acc_des_id, transfer.acc_ori_id]);
    userAccounts.forEach((acc) => {
      if (acc.user_id !== transfer.user_id) throw new ValidationError(`A conta de numero #${acc.id} não pertence a este usuário`);
    });
  };

  const save = async (transfer) => {
    // await validate(transfer);
    const result = await app.db('transfers').insert(transfer, '*');

    const transferId = await result[0].id;
    const transactions = [
      { description: `transfer to acc #${result[0].acc_des_id}`, date: result[0].date, ammount: result[0].ammount * -1, type: 'O', acc_id: result[0].acc_des_id, transfer_id: transferId, status: true },
      { description: `transfer from acc #${result[0].acc_ori_id}`, date: result[0].date, ammount: result[0].ammount, type: 'I', acc_id: result[0].acc_ori_id, transfer_id: transferId, status: true },
    ];
    await app.db('transactions').insert(transactions);
    return result;
  };
  const update = async (id, transfer) => {
    // await validate(transfer);
    const result = await app.db('transfers')
      .where({ id })
      .update(transfer, '*');
    const transactions = [
      { description: `transfer to acc #${result[0].acc_des_id}`, date: result[0].date, ammount: result[0].ammount * -1, type: 'O', acc_id: result[0].acc_des_id, transfer_id: id, status: true },
      { description: `transfer from acc #${result[0].acc_ori_id}`, date: result[0].date, ammount: result[0].ammount, type: 'I', acc_id: result[0].acc_ori_id, transfer_id: id, status: true },
    ];
    await app.db('transactions').where({ transfer_id: id }).del();
    await app.db('transactions').insert(transactions);
    return result;
  };
  const remove = async (id) => {
    await app.db('transactions').where({ transfer_id: id }).del();
    return app.db('transfers').where({ id }).del();
  };
  return { find, findOne, save, update, validate, remove };
};
