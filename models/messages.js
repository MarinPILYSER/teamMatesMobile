//SCHEMA POUR MESSAGES 

const mongoose = require('mongoose');


const messageSchema = mongoose.Schema({

    author: String,
    message: String,
    date_of_message: Date,
    token_author: String,
    picture_Url: String,
    team: {type: mongoose.Schema.Types.ObjectId, ref: 'teams'}
    
})


const messagesModel = mongoose.model('messages', messageSchema)


module.exports = messagesModel;