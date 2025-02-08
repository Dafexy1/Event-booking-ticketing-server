import { DataTypes, Model, Sequelize } from 'sequelize';




// my definition for the Event model class
export class Event extends Model {
  public id!: number; // Unique identifier for the event
  public name!: string; // this the event name
  public totalTickets!: number; 
  public availableTickets!: number; 
  public ticketStatus!: string;
  public readonly createdAt!: Date; 
  public readonly updatedAt!: Date; 
}

// this function when called will now initialize the Event model
export const initializeEventModel = (sequelize: Sequelize): typeof Event => {
  Event.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: { msg: 'Event name cannot be empty.', }, },

      },

      totalTickets: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          min: {
            args: [1], msg: 'Total tickets must be at least 1.',  }, },

      },
      
      availableTickets: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          min: {
            args: [0], msg: 'Available tickets cannot be negative.', },
          isAvailableLessThanOrEqualTotal(value: number) {
            if (value > (this as any).totalTickets) {
              throw new Error('Available tickets cannot exceed total tickets.');
            }
          },
        },
      },
    ticketStatus: {
      type: DataTypes.ENUM('open', 'cancelled', 'booked', 'on-hold', 'reassigned'),
      allowNull: false,
      defaultValue: 'open',
      validate: {
        isIn: {
          args: [['open', 'cancelled', 'booked', 'on-hold', 'reassigned']],
          msg: 'Invalid ticket status.',
        },
      },
    },
  },
    {
      sequelize,
      modelName: 'Event',
      tableName: 'events',
      timestamps: true, 
    }
  );

  return Event;
};
