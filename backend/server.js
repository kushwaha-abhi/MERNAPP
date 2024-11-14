const app= require("./app");
const dotenv= require('dotenv');
const connectdatabase= require('./Config/database');
const { connect } = require("http2");

dotenv.config({path:"backend/Config/config.env"});
connectdatabase();
app.listen(process.env.PORT, (req,res)=>{
    console.log(`server si working on http://localhost:${process.env.PORT}`);
})