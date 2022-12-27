exports.seed = async (knex) => {
  // Deletes ALL existing entries
  await knex('transactions').del();
  await knex('transfers').del();
  await knex('accounts').del();
  await knex('users').del();
  await knex('users').insert([
    { id: 99998, name: 'User #1', email: 'user1@email.com', passwd: '$2a$10$GgYg.0xckhf9sLMSTgqbR.0bfZ.LactTl6Sl1ZXaSGYtPaLU57wqG' },
    { id: 99999, name: 'User #2', email: 'user2@email.com', passwd: '$2a$10$GgYg.0xckhf9sLMSTgqbR.0bfZ.LactTl6Sl1ZXaSGYtPaLU57wqG' },
  ]);
  await knex('accounts').insert([
    { id: 99996, name: 'AccOri #1', user_id: 99998 },
    { id: 99997, name: 'AccDes #1', user_id: 99998 },
    { id: 99998, name: 'AccOri #2', user_id: 99999 },
    { id: 99999, name: 'AccDes #2', user_id: 99999 },
  ]);
  await knex('transfers').insert([
    { id: 99996, description: 'transfer #1', user_id: 99998, acc_ori_id: 99996, acc_des_id: 99997, ammount: 100, date: new Date() },
    { id: 99997, description: 'transfer #2', user_id: 99999, acc_ori_id: 99998, acc_des_id: 99999, ammount: 200, date: new Date() },
  ]);
  await knex('transactions').insert([
    { description: 'transfer from AccOri #1', date: new Date(), ammount: 100, type: 'I', acc_id: 99997, transfer_id: 99996 },
    { description: 'transfer to AccDes #1', date: new Date(), ammount: -100, type: 'O', acc_id: 99996, transfer_id: 99996 },
    { description: 'transfer from AccOri #1', date: new Date(), ammount: 100, type: 'I', acc_id: 99999, transfer_id: 99997 },
    { description: 'transfer to AccDes #1', date: new Date(), ammount: -100, type: 'O', acc_id: 99998, transfer_id: 99997 },
  ]);
};
