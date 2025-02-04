import { Sequelize } from 'sequelize';

const connectSql = async () => {
  const sqLUri = new Sequelize('postgres', 'postgres', 'MixmeDb', {
    dialect: 'postgres', 
  });

  try {
    await sqLUri.authenticate();
    console.log('📦 PostgreSQL connected with Sequelize');
  } catch (error) {
    console.error('Unable to connect to PostgreSQL:', error);
  }
};

export default connectSql;