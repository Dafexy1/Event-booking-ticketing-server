"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.initializeBookingModel = exports.Booking = void 0;
const sequelize_1 = require("sequelize");
const eventSchema_1 = require("./eventSchema");
class Booking extends sequelize_1.Model {
}
exports.Booking = Booking;
const initializeBookingModel = (sequelize) => {
    Booking.init({
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
        ticketsBooked: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: false,
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
        modelName: 'Booking',
        tableName: 'bookings',
    });
    // Setting up the association
    Booking.belongsTo(eventSchema_1.Event, {
        foreignKey: 'eventId',
        onDelete: 'CASCADE',
    });
};
exports.initializeBookingModel = initializeBookingModel;
