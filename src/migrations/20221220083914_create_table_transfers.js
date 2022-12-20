exports.up = (knex, Promise) => Promise.all([
  knex.schema.createTable('transfers', (t) => {
    t.increments('id').primary();
    t.string('description').notNull();
    t.date('date').notNull();
    t.decimal('ammount', 15, 2).notNull();
    t.integer('acc_ori_id')
      .references('id')
      .inTable('accounts')
      .notNull();
    t.integer('acc_des_id')
      .references('id')
      .inTable('accounts')
      .notNull();
    t.integer('user_id')
      .references('id')
      .inTable('accounts')
      .notNull();
  }),
  knex.schema.table('transactions', (t) => {
    t.integer('transfer_id')
      .references('id')
      .inTable('transfers');
  }),
]);

exports.down = (knex, Promise) => Promise.all([
  knex.schema.table('transactions', (t) => {
    t.dropColumn('transfer_id');
  }),
  knex.schema.dropTable('transfers'),
]);
