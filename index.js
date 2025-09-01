const express = require('express')
const app = express()
const connectDB = require('./config/db')
const cors = require('cors')
const PORT = process.env.PORT || 3000
require('dotenv').config();



connectDB()
app.use(cors())
app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use('/', require('./routes/UserRoute'))
app.listen(PORT ,() => {
    console.log(`server is running on https://localhost:${PORT}`)
})

