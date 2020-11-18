//SCHEMA POUR TEAMS 

const mongoose = require('mongoose');


const teamSchema = mongoose.Schema({
    name_of_team: String,
    sport: String,
    team_code: String,
    members: [{type: mongoose.Schema.Types.ObjectId, ref: 'users'}]
})


const teamModel = mongoose.model('teams', teamSchema)


module.exports = teamModel;