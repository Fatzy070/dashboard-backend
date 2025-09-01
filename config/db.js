const mongoose = require('mongoose')

const connectDB = async(req , res) => {
    try {
        const db = await mongoose.connect(process.env.MONGO_URL)
        console.log('connected to mongodb successfully')
    } catch (error) {
        console.error('cannot connect to mongodb')
        process.exit(1)
    }
}


module.exports = connectDB