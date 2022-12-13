// eslint-disable-next-line arrow-body-style
exports.up = (knex) => {
  return knex.schema.createTable('accounts', (t) => {
    t.increments('id').primary();
    t.string('name').notNull();
    t.integer('user_id')
      .references('id')
      .inTable('users')
      .notNull();
  });
};

// eslint-disable-next-line arrow-body-style
exports.down = (knex) => {
  return knex.schema.dropTable('accounts');
};
