class ErrorHandler extends Error {
    constructor(message, statusCode) {
        super(message);
        this.statusCode = statusCode;

        // Ensure the stack trace includes the correct source
        Error.captureStackTrace(this, this.constructor);
    }
}

module.exports = ErrorHandler;
