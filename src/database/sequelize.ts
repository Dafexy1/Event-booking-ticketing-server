 import { Sequelize } from 'sequelize';
 import dotenv from "dotenv";
 import { initializeEventModel } from '../model/schemas/eventSchema';
 import { initializeUserModel } from '../model/schemas/userSchema';
 import { initializeWaitingListModel } from '../model/schemas/waitingListSchema';
 import { initializeBookingModel } from '../model/schemas/bookingSchema';

dotenv.config();

// Initialize Sequelize instance
export const sequelize = new Sequelize(
  process.env.PG_DATABASE as string,        
  process.env.PG_USERNAME as string,        
  process.env.PG_PASSWORD as string,    
  {
    host: process.env.PG_HOST,          
    dialect: "postgres",               
    logging: process.env.DB_LOGGING === "true",
  }
);

export const connectSql = async () => {
  try {
    await sequelize.authenticate();
    console.log("PostgreSQL connected with Sequelize");

    // Initialize models
    initializeEventModel(sequelize);
    initializeUserModel(sequelize);
    initializeBookingModel(sequelize);
    initializeWaitingListModel(sequelize);

    // Sync database
    await sequelize.sync({ alter: true });
    console.log("Database synced successfully");
  } catch (error) {
    console.error("Unable to connect to PostgreSQL:", error);
  }
};





// export default connectSql;
