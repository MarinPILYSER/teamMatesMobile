const fs = require('fs');
var uniqid = require('uniqid');
var express = require('express');
var router = express.Router();
var SHA256 = require("crypto-js/sha256");
var encBase64 = require("crypto-js/enc-base64");
var uid2 = require('uid2');

//connexion a cloudinary :
var cloudinary = require('cloudinary').v2;

cloudinary.config({
  cloud_name: 'teammates',
  api_key: '974396766891333',
  api_secret: 'zlQIF3UTA2Y0jYx9PcB-9_lBR5o'
});

// tous les schémas :
var userModel = require('../models/users')
var teamModel = require('../models/teams')

router.post('/sign-up', async function (req, res, next) {

  var error = []
  var result = false
  var saveUser = {}
  var userInfos = {}
  var ajd = new Date

  const data = await userModel.findOne({
    email: req.body.email
  })

  if (data != null) {
    error.push('email identique : utilisateur déjà enregistré')
  }

  if (req.body.name == ''
    || req.body.firstName == ''
    || req.body.email == ''
    || req.body.password == ''
    || req.body.date_of_birth == ''
  ) {
    error.push('Veuillez remplir tous les champs')
  }

  var salt = uid2(32);
  if (error.length == 0) {

    // Création Nouvel Utilisateur

    var newUser = new userModel({
      admin: req.body.admin,
      name: req.body.name,
      firstname: req.body.firstname,
      date_of_birth: req.body.date_of_birth,
      email: req.body.email,
      password: SHA256(req.body.password + salt).toString(encBase64),
      salt: salt,
      token: uid2(32),
      registration_date: ajd,
      picture_Url: 'https://res.cloudinary.com/teammates/image/upload/v1603712223/Assets%20TeamMates/avatar-inconnu_d0i5cx.jpg',
    })

    save = await newUser.save()

    if (save) {
      result = true
      saveUser = save

      // Infos pour REDUX
      userInfos = {
        admin: saveUser.admin,
        name: saveUser.name,
        firstname: saveUser.firstname,
        email: saveUser.email,
        date_of_birth: saveUser.date_of_birth,
        token: saveUser.token,
        picture_Url: 'https://res.cloudinary.com/teammates/image/upload/v1603712223/Assets%20TeamMates/avatar-inconnu_d0i5cx.jpg',
        team: ''
      }
    } else {
      error.push("Problème lors de l'enregistrement, veuillez réessayer")
    }
  }

  res.json({ result, error, userInfos })
})

router.post('/sign-in', async function (req, res, next) {

  var result = false
  var error = []
  var userInfos = {}
  var teamInfos = {}

  if (req.body.email == ''
    || req.body.password == ''
  ) {
    error.push('Veuillez remplir tous les champs')
  }

  if (error.length == 0) {

    // Recupération Profil
    var user = await userModel.findOne({
      email: req.body.email
    });

    if (user != null) {

      // Mot de passe
      var hash = SHA256(req.body.password + user.salt).toString(encBase64);
      if (hash === user.password) {
        result = true
      } else {
        error.push('Mot de passe incorrect')
      }

      //Recherche de la team

      const team = await teamModel.findById(user.team)


      // Infos pour REDUX
      userInfos = {
        admin: user.admin,
        name: user.name,
        firstname: user.firstname,
        email: user.email,
        date_of_birth: user.date_of_birth,
        token: user.token,
        picture_Url: user.picture_Url,
        team: user.team
      }
      teamInfos = {
        teamID: team._id,
        teamName: team.name_of_team,
        teamCode: team.team_code
    }
    } else {
      error.push("Problème d'identification, veuillez vérifier votre email et réessayer")
    }
  }

  res.json({ result, error, userInfos, teamInfos})
})

router.post('/updateUser', async function (req, res, next) {
  var error = []
  var result = false

  var userInfos = JSON.parse(req.body.userinfos)

  const user = await userModel.findOne(
    { token: userInfos.token }
  )

  if (user === null) {
    error.push("Problème d'identification, veuillez réessayer")
  }

  if (userInfos.name == ''
    || userInfos.firstname == ''
    || userInfos.email == ''
    || userInfos.password == ''
    || userInfos.date_of_birth == ''
  ) {
    error.push('Veuillez remplir tous les champs')
  } 

  var hash = SHA256(userInfos.password + user.salt).toString(encBase64);

  if (error.length === 0) {
    if (hash === user.password) {

      // Cloudinary
      var resultCloudinaryUrl = user.picture_Url
      if (req.files.avatar != undefined) {
        var imagePath = './tmp/' + uniqid() + '.jpg';
        var resultCopy = await req.files.avatar.mv(imagePath);
        if (!resultCopy) {
          resultCloudinary = await cloudinary.uploader.upload(imagePath);
          resultCloudinaryUrl=resultCloudinary.url
        } else {
          error.push("Problème de téléchargement de l'image")
        }
        fs.unlinkSync(imagePath);
      }

      // MAJ User
      const updateUser = await userModel.updateOne(
        { token: userInfos.token },
        {
          name: userInfos.name,
          firstname: userInfos.firstname,
          email: userInfos.email,
          date_of_birth: userInfos.date_of_birth,
          picture_Url: resultCloudinaryUrl
        }
      )

      // MAJ infos pour REDUX
      if (updateUser) {
        result = true;
        userInfos = {
          admin: user.admin,
          name: userInfos.name,
          firstname: userInfos.firstname,
          email: userInfos.email,
          date_of_birth: userInfos.date_of_birth,
          token: userInfos.token,
          team : user.team,
          picture_Url: resultCloudinaryUrl
        }
      } else { error.push('Erreur de mise à jour') }

    } else {
      error.push('Mot de passe incorrect')
    }
  }
  
  res.json({ result, error, userInfos })
})

// router.get('/perfUser', async function (req, res, next) {

//   var error = []
//   var result = false
 
//   res.json({result, error})
// })



module.exports = router
