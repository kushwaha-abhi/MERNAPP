const app= require("./app");
const dotenv= require('dotenv');
const connectdatabase= require('./Config/database');
dotenv.config({path:"backend/Config/config.env"});
connectdatabase();


const server= app.listen(process.env.PORT, (req,res)=>{
    console.log(`server is working on http://localhost:${process.env.PORT}`);
})

process.on("unhandledRejection",(err)=>{
    console.log(`error is : ${err.message}`);
    console.log("shuting down the server due to the unhandled rejection");

    server.close(()=>{
        process.exit(1);
    });
});