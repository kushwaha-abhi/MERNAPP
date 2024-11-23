const sendToken = (user, statusCode, res) => {
     const token = user.getJWTToken();
 
     // Parse COOKIE_EXPIRE to ensure it's a valid number
     const cookieExpireDays = parseInt(process.env.COOKIE_EXPIRE, 10);
     if (isNaN(cookieExpireDays)) {
         throw new Error("COOKIE_EXPIRE is not a valid number. Check your .env file.");
     }
 
     // Calculate the expiration date
     const expiresDate = new Date(Date.now() + cookieExpireDays * 24 * 60 * 60 * 1000);
 
     // Validate the Date object
     if (isNaN(expiresDate.getTime())) {
         throw new Error("Calculated expiration date is invalid.");
     }
 
     const options = {
         expires: expiresDate,
         httpOnly: true,
     };
 
     res.status(statusCode).cookie("token", token, options).json({
         success: true,
         user,
         token,
     });
 };
 
 module.exports = sendToken;
 