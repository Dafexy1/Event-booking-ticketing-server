"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.initializeEventModel = exports.Event = void 0;
var sequelize_1 = require("sequelize");
// my definition for the Event model class
var Event = /** @class */ (function (_super) {
    __extends(Event, _super);
    function Event() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return Event;
}(sequelize_1.Model));
exports.Event = Event;
// this function when called will now initialize the Event model
var initializeEventModel = function (sequelize) {
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
                isAvailableLessThanOrEqualTotal: function (value) {
                    if (value > this.totalTickets) {
                        throw new Error('Available tickets cannot exceed total tickets.');
                    }
                },
            },
        },
    }, {
        sequelize: sequelize,
        modelName: 'Event',
        tableName: 'events',
        timestamps: true,
    });
    return Event;
};
exports.initializeEventModel = initializeEventModel;
