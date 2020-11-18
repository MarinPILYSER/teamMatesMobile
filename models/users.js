//SCHEMA POUR USERS 

const mongoose = require('mongoose');


const userSchema = mongoose.Schema({
    admin: Boolean,
    name: String,
    firstname: String,
    date_of_birth: Date,
    email: String,
    password: String,
    salt: String,
    token: String,
    registration_date: Date,
    picture_Url : String,
    team: {type: mongoose.Schema.Types.ObjectId, ref: 'teams'}
})


const userModel = mongoose.model('users', userSchema)


module.exports = userModel;