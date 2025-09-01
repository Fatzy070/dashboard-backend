const mongoose = require('mongoose')
const Schema = mongoose.Schema


const UserSchema = new Schema({
    username:String,
    email:String,
    password:String,
    avatar: String
})

module.exports = mongoose.model('users' , UserSchema )