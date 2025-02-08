"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.initializeUserModel = exports.User = void 0;
const sequelize_1 = require("sequelize");
class User extends sequelize_1.Model {
}
exports.User = User;
const initializeUserModel = (sequelize) => {
    User.init({
        id: {
            type: sequelize_1.DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        email: {
            type: sequelize_1.DataTypes.STRING,
            allowNull: false,
            unique: true, // Ensure no duplicate emails
            validate: {
                isEmail: true, // Validates email format
            },
        },
        ticketsPurchased: {
            type: sequelize_1.DataTypes.ARRAY(sequelize_1.DataTypes.STRING),
            allowNull: false,
            defaultValue: [],
        },
        ticketStatus: {
            type: sequelize_1.DataTypes.JSON,
            allowNull: false,
            defaultValue: {},
        },
        createdAt: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: false,
            defaultValue: sequelize_1.Sequelize.literal('NOW()'),
        },
        updatedAt: {
            type: sequelize_1.DataTypes.DATE,
            allowNull: false,
            defaultValue: sequelize_1.Sequelize.literal('NOW()'),
        },
    }, {
        sequelize,
        modelName: 'User',
        tableName: 'users',
    });
    return User;
};
exports.initializeUserModel = initializeUserModel;
