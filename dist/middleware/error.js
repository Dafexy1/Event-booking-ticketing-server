"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UnsupportedMediaType = exports.TooManyRequests = exports.RequestTimeoutError = exports.ProxyAuthenticationRequiredError = exports.ForbiddenError = exports.UnauthorizedError = exports.ConflictError = exports.NotFoundError = exports.BadRequestError = exports.ApplicationError = void 0;
/**
 * @class ApplicationError
 * @description base error class for application
 * @extends Error
 */
class ApplicationError extends Error {
    /**
     * @description initializes the error class
     *
     * @param {number} statusCode status code of the request
     * @param {string} message error message
     * @param {string} errors an array containing errors
     */
    constructor(statusCode, message = "an error occurred", errors) {
        super(message);
        this.statusCode = statusCode || 500;
        this.message = message;
        this.errors = errors;
    }
}
exports.ApplicationError = ApplicationError;
/**
 * @class BadRequestError
 * @description error class for bad request
 * @extends ApplicationError
 */
class BadRequestError extends ApplicationError {
    /**
     * @description initialize error class
     *
     */
    constructor(message) {
        super(400, message || "Bad request.");
    }
}
exports.BadRequestError = BadRequestError;
/**
 * @class NotFoundError
 * @description error class for not found
 * @extends ApplicationError
 */
class NotFoundError extends ApplicationError {
    /**
     * @description initialize error class
     *
     */
    constructor(message) {
        super(404, message || "Route not found.");
    }
}
exports.NotFoundError = NotFoundError;
/**
 * @class ConflictError
 * @description error class for conflicts.
 * @extends ApplicationError
 */
class ConflictError extends ApplicationError {
    /**
     * @description initialize error class
     *
     */
    constructor(message) {
        super(409, message);
    }
}
exports.ConflictError = ConflictError;
/**
 * @class UnauthorizedError
 * @description error class for unauthenticated users.
 * @extends ApplicationError
 */
class UnauthorizedError extends ApplicationError {
    /**
     * @description initialize error class
     *
     */
    constructor(message) {
        super(401, message || "You are unauthorized.");
    }
}
exports.UnauthorizedError = UnauthorizedError;
/**
 * @class UnauthorizedError
 * @description error class for unauthenticated users.
 * @extends ApplicationError
 */
class ForbiddenError extends ApplicationError {
    /**
     * @description initialize error class
     *
     */
    constructor(message) {
        super(403, message || "Access Forbidden");
    }
}
exports.ForbiddenError = ForbiddenError;
class ProxyAuthenticationRequiredError extends ApplicationError {
    /**
     * @description initialize error class
     *
     */
    constructor(message) {
        super(407, message || "Proxy Authentication Required");
    }
}
exports.ProxyAuthenticationRequiredError = ProxyAuthenticationRequiredError;
class RequestTimeoutError extends ApplicationError {
    /**
     * @description initialize error class
     *
     */
    constructor(message) {
        super(408, message || "Request Timeout");
    }
}
exports.RequestTimeoutError = RequestTimeoutError;
class TooManyRequests extends ApplicationError {
    /**
     * @description initialize error class
     *
     */
    constructor(message) {
        super(429, message || "Too Many Requests");
    }
}
exports.TooManyRequests = TooManyRequests;
class UnsupportedMediaType extends ApplicationError {
    /**
     * @description initialize error class
     *
     */
    constructor(message) {
        super(415, message || "Unsupported Media Type");
    }
}
exports.UnsupportedMediaType = UnsupportedMediaType;
