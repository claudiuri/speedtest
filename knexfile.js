require("dotenv/config");

module.exports = {
  client: 'pg',
  connection: { 
    connectionString: process.env.POSTGRES_CONNECTION_STRING,
    ssl: { rejectUnauthorized: false }
  },
  migrations: {
    directory: "src/migrations",
  }
};
