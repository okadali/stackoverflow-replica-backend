const express = require("express");
const dotenv = require("dotenv")
const connectDatabase = require('./helpers/database/connectDatabase')
const routers = require('./routers')
const customErrorHandler = require('./middlewares/errors/customErrorHandler')

// Environment Variables
dotenv.config({
  path: "./config/env/config.env"
})

// MongoDb Connections
connectDatabase();

const app = express();
const PORT = process.env.PORT;

// Express - Body Middleware
app.use(express.json())

// Routers Middleware
app.use('/api',routers)

// Error Handler
app.use(customErrorHandler)

app.listen(PORT, () => {
  console.log(`App Started on ${PORT} : ${process.env.NODE_ENV}`);
})