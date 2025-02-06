import { Sequelize } from 'sequelize';
import  { initializeEventModel, Event }  from './eventSchema';
import dbConfig from '../../database/dbConfig';
import { WaitingList } from './waitingListSchema';
import { initializeBookingModel, Booking } from './bookingSchema';
import { initializeWaitingListModel } from './waitingListSchema';
import { initializeUserModel, User } from './userSchema';

const sequelize = new Sequelize(dbConfig);


// Initialize models
initializeEventModel(sequelize);
initializeUserModel(sequelize); 
initializeBookingModel(sequelize);
initializeWaitingListModel(sequelize);





// Sync the database (if needed)
sequelize.sync({ alter: true }).then(() => {
    console.log('Database synced successfully');
  }).catch((error) => {
    console.error('Error syncing database:', error);
  });

export { sequelize, Event, User, Booking, WaitingList };
