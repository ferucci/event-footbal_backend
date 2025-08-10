export default () => ({
  server: {
    port: parseInt(String(process.env.PORT), 10) || 3003,
  },
  database: {
    type: process.env.DB_TYPE || 'postgres',
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(String(process.env.DB_PORT)) || 5432,
    user: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    name: process.env.DB_NAME,
  },
  jwt: {
    secret: process.env.JWT_SECRET || 'super_secret'
  },
});
