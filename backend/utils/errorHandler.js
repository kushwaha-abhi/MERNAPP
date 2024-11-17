class ErrorHandler extends Error{
    constructor(message,statuscode){
        super(message);
        statuscode(this.statuscode);
    Error.captureStackTrace(this, this.constructor);

    }
}

module.exports= ErrorHandler