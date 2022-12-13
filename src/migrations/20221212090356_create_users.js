exports.up = (knex) => knex.schema.createTable('users', (t) => {
  t.increments('id').primary();
  t.string('name').notNull();
  t.string('email').notNull().unique();
  t.string('passwd').notNull();
});

// eslint-disable-next-line arrow-body-style
exports.down = (knex) => {
  return knex.schema.dropTable('users');
};
