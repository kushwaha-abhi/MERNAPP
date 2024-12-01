const ErrorHandler= require("../utils/errorHandler")

module.exports=(err,req, res, next)=>{
    err.statusCode = err.statusCode || 500;
    err.message= err.message || "enternal server error";
 
     if(err.name==='CastError'){
        const message= `Resource not found Invalid. ${err.path}` 
        err= new ErrorHandler(message,400);
     }

// mongoose dublicate key errors

if(err.code==11000){
   err= new ErrorHandler(`dublicate ${object} entered`);
}
 
if(err.name= " JsonWebTokenError"){
    const message= `json web token error`;
    err= new ErrorHandler(message, 400);
}

    res.status(err.statusCode).json({
        success:false,
        message: err
    })
}

