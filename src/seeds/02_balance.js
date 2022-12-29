const moment = require('moment');

exports.seed = async (knex) => {
  await knex('users').insert([
    { id: 10100, name: 'User #3', email: 'user3@email.com', passwd: '$2a$10$GgYg.0xckhf9sLMSTgqbR.0bfZ.LactTl6Sl1ZXaSGYtPaLU57wqG' },
    { id: 10101, name: 'User #5', email: 'user4@email.com', passwd: '$2a$10$GgYg.0xckhf9sLMSTgqbR.0bfZ.LactTl6Sl1ZXaSGYtPaLU57wqG' },
    { id: 10102, name: 'User #5', email: 'user5@email.com', passwd: '$2a$10$GgYg.0xckhf9sLMSTgqbR.0bfZ.LactTl6Sl1ZXaSGYtPaLU57wqG' },
  ]);
  await knex('accounts').insert([
    { id: 10100, name: 'Acc Saldo Principal', user_id: 10100 },
    { id: 10101, name: 'Acc Saldo Secundario', user_id: 10100 },
    { id: 10102, name: 'Acc Alternativa 1', user_id: 10101 },
    { id: 10103, name: 'Acc Alternativa 2', user_id: 10101 },
    { id: 10104, name: 'Acc Geral Principal', user_id: 10102 },
    { id: 10105, name: 'Acc Geral Secundario', user_id: 10102 },
  ]);
  await knex('transfers').insert([
    { id: 10100, description: 'transfer #3', user_id: 10102, acc_ori_id: 10105, acc_des_id: 10104, ammount: 256, date: new Date() },
    { id: 10101, description: 'transfer #4', user_id: 10101, acc_ori_id: 10102, acc_des_id: 10103, ammount: 512, date: new Date() },
  ]);
  await knex('transactions').insert([
    { description: '2', date: new Date(), ammount: 2, type: 'I', acc_id: 10104, status: true },
    { description: '2', date: new Date(), ammount: 4, type: 'I', acc_id: 10102, status: true },
    { description: '2', date: new Date(), ammount: 8, type: 'I', acc_id: 10105, status: true },
    { description: '2', date: new Date(), ammount: 16, type: 'I', acc_id: 10104, status: false },
    { description: '2', date: moment().subtract({ days: 5 }), ammount: 32, type: 'I', acc_id: 10104, status: true },
    { description: '2', date: moment().add({ days: 5 }), ammount: 64, type: 'I', acc_id: 10104, status: true },
    { description: '2', date: new Date(), ammount: -128, type: 'O', acc_id: 10104, status: true },
    { description: '2', date: new Date(), ammount: 256, type: 'I', acc_id: 10104, status: true },
    { description: '2', date: new Date(), ammount: -256, type: 'O', acc_id: 10105, status: true },
    { description: '2', date: new Date(), ammount: 512, type: 'I', acc_id: 10102, status: true },
    { description: '2', date: new Date(), ammount: -512, type: 'O', acc_id: 10103, status: true },
  ]);
};
