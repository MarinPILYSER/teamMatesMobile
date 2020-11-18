//SCHEMA POUR LES FICHES TACTIQUES

const mongoose = require('mongoose');

const imagesSchema = mongoose.Schema({
   url : String
})


const fichesSchema = mongoose.Schema({
    name: String,
    type: String,
    images: [imagesSchema],
    team: {type: mongoose.Schema.Types.ObjectId, ref: 'teams'},
})


const fichesModel = mongoose.model('fiches', fichesSchema)


module.exports = fichesModel;