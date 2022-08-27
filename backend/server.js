const express = require('express');
const dotenv = require('dotenv').config();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const {errorHandler} = require('./middleware/errorMiddleware')
const connectDB = require('./config/db')


connectDB()
const port = process.env.PORT || 5000;  // for heroku
const app = express(); //intitalise express
//bodyparser middleware

app.use(express.urlencoded({ extended: false }));
app.use('/api/goals', require('./routes/goalRoutes'))
app.use(errorHandler)

app.listen(port, () => console.log(`Server started on the ${port}`));

// try connecting using 
// npm run server
