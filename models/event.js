//SCHEMA POUR LES EVENTS 

const mongoose = require('mongoose');


const eventsSchema = mongoose.Schema({
    category: String,
    date_of_event: Date,
    lieu: String,
    adversaire: String,
    recurrence: Boolean,
    commentaires: String,
    score_local: Number,
    score_adversaire: Number,
    team: {type: mongoose.Schema.Types.ObjectId, ref: 'teams'},
    members: [{type: mongoose.Schema.Types.ObjectId, ref: 'users'}]
})


const eventsModel = mongoose.model('events', eventsSchema)


module.exports = eventsModel;