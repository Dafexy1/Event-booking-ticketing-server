import { Model, DataTypes, Sequelize } from 'sequelize';

export class User extends Model {
  public id!: number;
  public email!: string; 
  public ticketsPurchased!: string[]; // Array to store ticket IDs or event IDs
  public ticketStatus!: Record<string, string>; 
  public createdAt!: Date;
  public updatedAt!: Date;
}

export const initializeUserModel = (sequelize: Sequelize): typeof User => {
  User.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true, // Ensure no duplicate emails
        validate: {
          isEmail: true, // Validates email format
        },
    },
    ticketsPurchased: {
            type: DataTypes.ARRAY(DataTypes.STRING), 
            allowNull: false,
            defaultValue: [], 
          },
         ticketStatus: {
            type: DataTypes.JSON, 
            allowNull: false,
            defaultValue: {}, 
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
      modelName: 'User',
      tableName: 'users',
    }
  );
    return User;
};
