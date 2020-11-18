//SCHEMA POUR LES ACTUS 

const mongoose = require('mongoose');

const actuSchema = mongoose.Schema({
    contenu: String,
    media_url: String,
    date_actu: Date,
    mediaType: String,
    team: {type: mongoose.Schema.Types.ObjectId, ref: 'teams'}
})


const actuModel = mongoose.model('actus', actuSchema)


module.exports = actuModel;