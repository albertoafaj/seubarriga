module.exports = {
  test: {
    client: 'pg',
    version: '9.6',
    connection: {
      host: process.env.SB_HOST,
      user: process.env.SB_USER,
      password: process.env.SB_PASS,
      database: process.env.SB_DB_TEST,
    },
    migrations: { directory: 'src/migrations' },
    seeds: { directory: 'src/seeds' },
  },
  prod: {
    client: 'pg',
    version: '9.6',
    connection: {
      host: process.env.SB_HOST,
      user: process.env.SB_USER,
      password: process.env.SB_PASS,
      database: process.env.SB_DB_PROD,
    },
    migrations: { directory: 'src/migrations' },
  },
};
