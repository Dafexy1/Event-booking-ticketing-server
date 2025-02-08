"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.initializeWaitingListModel = exports.WaitingList = void 0;
const sequelize_1 = require("sequelize");
const eventSchema_1 = require("./eventSchema"); // Import the Event model
class WaitingList extends sequelize_1.Model {
}
exports.WaitingList = WaitingList;
const initializeWaitingListModel = (sequelize) => {
    WaitingList.init({
        id: {
            type: sequelize_1.DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        userId: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: false,
        },
        eventId: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: eventSchema_1.Event, // Reference to the Event table
                key: 'id',
            },
        },
        numberOfTickets: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 1, // Default to requesting 1 ticket if not specified
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
        modelName: 'WaitingList',
        tableName: 'waiting_lists',
    });
    // Setting up the association
    WaitingList.belongsTo(eventSchema_1.Event, {
        foreignKey: 'eventId',
        onDelete: 'CASCADE',
    });
};
exports.initializeWaitingListModel = initializeWaitingListModel;
