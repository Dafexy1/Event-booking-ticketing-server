"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.initializeEventModel = exports.Event = void 0;
const sequelize_1 = require("sequelize");
// my definition for the Event model class
class Event extends sequelize_1.Model {
}
exports.Event = Event;
// this function when called will now initialize the Event model
const initializeEventModel = (sequelize) => {
    Event.init({
        id: {
            type: sequelize_1.DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
            allowNull: false,
        },
        name: {
            type: sequelize_1.DataTypes.STRING,
            allowNull: false,
            validate: {
                notEmpty: { msg: 'Event name cannot be empty.', },
            },
        },
        totalTickets: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: false,
            validate: {
                min: {
                    args: [1], msg: 'Total tickets must be at least 1.',
                },
            },
        },
        availableTickets: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: false,
            validate: {
                min: {
                    args: [0], msg: 'Available tickets cannot be negative.',
                },
                isAvailableLessThanOrEqualTotal(value) {
                    if (value > this.totalTickets) {
                        throw new Error('Available tickets cannot exceed total tickets.');
                    }
                },
            },
        },
        ticketStatus: {
            type: sequelize_1.DataTypes.ENUM('open', 'cancelled', 'booked', 'on-hold', 'reassigned'),
            allowNull: false,
            defaultValue: 'open',
            validate: {
                isIn: {
                    args: [['open', 'cancelled', 'booked', 'on-hold', 'reassigned']],
                    msg: 'Invalid ticket status.',
                },
            },
        },
    }, {
        sequelize,
        modelName: 'Event',
        tableName: 'events',
        timestamps: true,
    });
    return Event;
};
exports.initializeEventModel = initializeEventModel;
