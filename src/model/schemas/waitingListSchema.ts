import { Model, DataTypes, Sequelize } from 'sequelize';
import { Event } from './eventSchema'; // Import the Event model

export class WaitingList extends Model {
  public id!: number;
  public userId!: number; // Assuming there's a Users table
  public eventId!: number; // Foreign key to Event table
  public createdAt!: Date;
  public updatedAt!: Date;
}

export const initializeWaitingListModel = (sequelize: Sequelize) => {
  WaitingList.init(
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
      modelName: 'WaitingList',
      tableName: 'waiting_lists',
    }
  );

  // Setting up the association
  WaitingList.belongsTo(Event, {
    foreignKey: 'eventId',
    onDelete: 'CASCADE',
  });
};
