const express= require('express');
const app= express();
const bodyParser = require('body-parser');

const errorMiddleware= require('./middlewares/error')
app.use(express.json());
app.use(bodyParser.json());

app.use(errorMiddleware);
const product= require('./routes/productRoute')
app.use('/api/v1',product)
module.exports= app;