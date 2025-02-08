import dotenv from "dotenv";
dotenv.config();

const dbConfig = {
    host: process.env.PG_HOST,
    username: process.env.PG_USERNAME,
    password: process.env.PG_PASSWORD,
    database: process.env.PG_DATABASE,
    logging: process.env.DB_LOGGING === 'true' ? console.log : false,
  };
  
export default dbConfig
  