var express = require('express');
var router = express.Router();

var messagesModel = require('../models/messages')

router.get('/message/:idTeam', async function (req, res, next) {

  var idTeam = req.params.idTeam;
  var error;
  var result = false
  var messages = await messagesModel.find({team: [idTeam]})

  res.json({ result, error, messages})   

})

module.exports = router
