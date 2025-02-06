import { Model, DataTypes, Sequelize } from 'sequelize';
import { Event } from './eventSchema'; 



export class Booking extends Model {
  public id!: number;
  public userId!: number; 
  public eventId!: number; // Foreign key to Event table
  public ticketsBooked!: number; // Number of tickets booked
  public createdAt!: Date;
  public updatedAt!: Date;
}

export const initializeBookingModel = (sequelize: Sequelize) => {
  Booking.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      eventId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: Event, // Reference to the Event table
          key: 'id',
        },
      },
      ticketsBooked: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('NOW()'),
      },
      updatedAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('NOW()'),
      },
    },
    {
      sequelize,
      modelName: 'Booking',
      tableName: 'bookings',
    }
  );

  // Setting up the association
  Booking.belongsTo(Event, {
    foreignKey: 'eventId',
    onDelete: 'CASCADE',
  });
};
