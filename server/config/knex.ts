import dotenv from "dotenv";
dotenv.config();

export const knexConfig = {
  development: {
    client: "pg",
    useNullAsDefault: true,
    connection: {
      host: process.env.POSTGRES_HOST,
      port: process.env.POSTGRES_PORT,
      user: process.env.POSTGRES_USER,
      password: process.env.POSTGRES_PASSWORD,
      database: process.env.POSTGRES_DB,
    },
  },
};
