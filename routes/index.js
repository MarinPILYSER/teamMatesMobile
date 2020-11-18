var uniqid = require('uniqid');
const fs = require('fs')
var express = require('express');
var router = express.Router();
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
var fichesModel = require('../models/fiches')
var actuModel = require('../models/actu')
var eventsModel = require('../models/event')

router.post('/newTeam', async function (req, res, next) {

  var error = []
  var result = false
  var teamInfos = {}

  const isTeam = await teamModel.findOne({
    name_of_team: req.body.name_of_team
  })

  if (isTeam != null) {
    error.push("nom d'equipe déjà existant")
  }

  if (req.body.name_of_team == ''
    , req.body.sport == ''
  ) {
    error.push('Veuillez remplir tous les champs')
  }

  var code = uid2(8);

  // Verification de l'unicité du code équipe
  const verifCode = await teamModel.findOne({
    team_code: code
  })

  if (verifCode != undefined) {
    error.push('erreur lors de la création du code équipe, veuillez recommencer')
  }

  if (error.length == 0) {

    // Pour récupérer user._id
    var user = await userModel.findOne(
      { token: req.body.token }
    )
    var userID = user._id

    // Création Nouvelle Team
    var newTeam = new teamModel({
      name_of_team: req.body.name_of_team,
      sport: req.body.sport,
      team_code: code,
      members: [userID]
    })
    save = await newTeam.save()

    // Insertion TeamID dans User

    var teamID = newTeam._id

    const saveUser = await userModel.updateOne(
      { token: req.body.token },
      { team: teamID }
    )

    if (save && saveUser) {
      result = true
      // Infos pour REDUX
      userInfos = {
        admin: user.admin,
        name: user.name,
        firstname: user.firstname,
        email: user.email,
        date_of_birth: user.date_of_birth,
        token: user.token,
        picture_Url: user.picture_Url,
        team: teamID
      }
      teamInfos = {
        teamID: newTeam._id,
        teamName: newTeam.name_of_team,
        teamCode: newTeam.team_code
      }
    } else {
      error.push("Problème lors de l'enregistrement, veuillez réessayer")
    }
  }

  res.json({ result, error, teamInfos, userInfos })
})

router.post('/joinTeam', async function (req, res, next) {
  var code = req.body.code
  var error = []
  var result = false
  var teamInfos = {}
  var userInfos = {}

  // Recherche du code équipe

  const team = await teamModel.findOne({
    team_code: code
  })

  if (team === null) {
    error.push('Ce code ne correspond à aucune équipe')
  }

  if (req.body.code == '') {
    error.push('Veuillez renseigner un code')
  }

  if (error.length == 0) {

    // Pour récupérer user._id
    var user = await userModel.findOne(
      { token: req.body.token }
    )
    var userID = user._id

    // Insertion TeamID dans User

    var teamID = team._id

    const saveUser = await userModel.updateOne(
      { token: req.body.token },
      { team: teamID }
    )

    // Insertion User dans Team

    team.members.push(userID)

    var newMembers = team.members

    const save = await teamModel.updateOne(
      { team_code: code },
      { members: newMembers }
    )

    if (save && saveUser) {
      result = true
      teamInfos = {
        teamID: team._id,
        teamName: team.name_of_team,
        teamCode: team.team_code
      }
      userInfos = {
        admin: user.admin,
        name: user.name,
        firstname: user.firstname,
        email: user.email,
        date_of_birth: user.date_of_birth,
        token: user.token,
        picture_Url: 'https://res.cloudinary.com/teammates/image/upload/v1603712223/Assets%20TeamMates/avatar-inconnu_d0i5cx.jpg',
        team: teamID
      }
    } else {
      error.push("Problème lors de l'enregistrement, veuillez réessayer")
    }
  }

  res.json({ result, error, teamInfos, userInfos })
})

router.post('/newActu/:idTeam', async function (req, res, next) {

  let teamID = req.params.idTeam
  let error = ""
  let result = false
  let imagePath = `./tmp/${uniqid()}.jpg`
  let cloudinaryUrl = ""
  let mediaType
  let resultCloudinary = {}
  let extension = req.body.extension

  // Enregistrement sur Cloudinary 
  // Si Media
  if (req.files) {
    let resultCopy = await req.files.media.mv(imagePath);

    if (!resultCopy) {
      // Enregistrement si video
      if (['.3g2', '.3gp', '.avi', '.flv', '.m3u8', '.ts', '.m2ts', '.mts', '.mov', '.mkv', '.mp4', '.mpeg', '.mpd', '.mxf', '.ogv', '.webm', '.wmv'].indexOf(`.${extension}`) != -1) {
        resultCloudinary = await cloudinary.uploader.upload(imagePath, { resource_type: "video" });
        cloudinaryUrl = resultCloudinary.url
        mediaType = "video"

        // Enregistrement si image
      } else if (['.ai', '.gif', '.webp', '.avif', '.bmp', '.djvu', '.ps', '.ept', '.eps', '.eps3', '.fbx', '.flif', '.gif', '.glb', '.heif', '.heic', '.ico', '.indd', '.jpg', '.jpe', '.jpeg', '.jp2', '.wdp', '.jxr', '.hdp', '.png', '.psd', '.arw', '.cr2', '.svg', '.tga', '.tif', '.tiff', '.webp'].indexOf(`.${extension}`) != -1) {
        resultCloudinary = await cloudinary.uploader.upload(imagePath);
        cloudinaryUrl = resultCloudinary.url
        mediaType = "image"
      }
      fs.unlinkSync(imagePath);
    }
  }

  // Enregistrement en base de données
  let newActu = new actuModel({
    contenu: req.body.text,
    media_url: cloudinaryUrl,
    mediaType: mediaType,
    date_actu: Date.now(),
    team: teamID
  })
  let save = await newActu.save()
  if (save) {
    result = true
  } else {
    error = "Problème lors de l'enregistrement, veuillez réessayer"
  }

  res.json({ result, error })
})

router.post('/newEvent', async function (req, res, next) {

  var error = []
  var result = false
  var idTeam = req.body.teamID

  var team = await teamModel.findById(idTeam)
  var members = team.members

  if (team != null) {

    if (req.body.eventType == '' || req.body.place == '' || req.body.date == undefined) {
      error.push('Veuillez remplir tous les champs')
    }

    if (req.body.members.length == 0 && req.body.eventType == 'Match') {
      error.push('Veuillez selectionner au moins un joueur')
    }




    if (error.length == 0) {

      if (req.body.eventType == 'Match') {
        members = JSON.parse(req.body.members)
      }

      // Création Nouvel Evenement
      var newEvent = new eventsModel({
        category: req.body.eventType,
        date_of_event: JSON.parse(req.body.date),
        lieu: req.body.place,
        adversaire: req.body.opponent,
        recurrence: req.body.recurrence,
        commentaires: req.body.comment,
        score_local: req.body.score_local,
        score_adversaire: req.body.score_adversaire,
        team: idTeam,
        members: members
      })
      save = await newEvent.save()

      if (save) {
        result = true
      } else {
        error.push("Problème lors de l'enregistrement, veuillez réessayer")
      }
    }
  } else {
    error.push("Problème de connexion à la base de données")
  }

  res.json({ result, error })
})

router.get('/getEventToUpdate/:idEvent', async function (req, res, next) {

  var error = []
  var result = false
  var idEvent = req.params.idEvent

  // Recupération event à updater
  var eventInfos = await eventsModel.findById(idEvent)

  // Récupération de la liste des titulaires
  var membersInfos = await eventsModel.findById(idEvent).populate('members').exec()

  if (eventInfos) {
    result = true
  } else {
    error.push('Problème de connection, veuillez réessayer')
  }
  res.json({ result, error, eventInfos, membersInfos })
})

router.post('/updateEvent/:idEvent', async function (req, res, next) {

  var error = []
  var result = false


  if (req.body.eventType == '' || req.body.place == '' || req.body.date == undefined) {
    error.push('Veuillez remplir tous les champs')
  }

  if (JSON.parse(req.body.titulairesList).length == 0) {
    error.push('Veuillez selectionner au moins un joueur')
  }

  if (error.length == 0) {
    // MAJ Event
    const updateEvent = await eventsModel.updateOne(
      { _id: req.params.idEvent },
      {
        members: JSON.parse(req.body.titulairesList),
        category: req.body.category,
        date_of_event: JSON.parse(req.body.date),
        lieu: req.body.lieu,
        adversaire: req.body.adversaire,
        recurrence: req.body.recurrence,
        commentaires: req.body.commentaire,
        score_local: req.body.score_local,
        score_adversaire: req.body.score_adversaire
      }
    );

    if (updateEvent) {
      result = true;
    } else {
      error.push('Erreur de mise à jour')
    }
  }



  res.json({ result, error })
})

router.post('/uploadFile/:idTeam', async function (req, res, next) {

  let teamID = req.params.idTeam
  let error = []
  let result = false
  let fileInfos = {}
  let tabUrl = [];
  let fileName = req.files.media.name;
  let extension = req.body.extension
  let imagePath = `./tmp/${uniqid()}.${extension}`;
  let resultCopy = await req.files.media.mv(imagePath);

  // Cloudinary
  let resultCloudinary = {}
  if (!resultCopy) {

    // VIDEO
    if (['.3g2', '.3gp', '.avi', '.flv', '.m3u8', '.ts', '.m2ts', '.mts', '.mov', '.mkv', '.mp4', '.mpeg', '.mpd', '.mxf', '.ogv', '.webm', '.wmv'].indexOf(`.${extension}`) != -1) {
      // VIDEOS
      resultCloudinary = await cloudinary.uploader.upload(imagePath, { resource_type: "video" });

      let url = resultCloudinary.url
      tabUrl.push(url)

      //Pour la BDD
      fileInfos = {
        name: fileName,
        type: 'video',
        images: tabUrl
      }
    } else if (extension === 'pdf') {

      // PDF
      resultCloudinary = await cloudinary.uploader.upload(imagePath);


      // Création tableau url des pages du pdf en jpg 
      //(car cloudinary ne gère pas les pdf directement, et pour un affichage plus clair en jpg directement sur l'application)

      // nombre de pages du pdf
      let pages = resultCloudinary.pages

      //url du pdf
      let url = resultCloudinary.url

      // url sans l'extension pdf
      let url2 = url.substring(0, (url.length - extension.length))

      //ajout de l'extion .jpg
      let urlJpg = url2 + 'jpg';

      //création d'un tableau d'url correspondant a celles de chaque page du pdf
      for (let i = 0; i < pages; i++) {

        // url globale splitée en un tableau de deux éléments
        let tab = urlJpg.split('/upload/');

        //ajour du numéro de la page à afficher
        let urlByPage = `${tab[0]}/upload/pg_${i + 1}/${tab[1]}`

        //Remplissage du tableau d'url avec les pages
        tabUrl.push(urlByPage);
      }
      //Pour la BDD
      fileInfos = {
        name: fileName,
        type: 'pdf',
        images: tabUrl
      }

    } else if (['.ai', '.gif', '.webp', '.avif', '.bmp', '.djvu', '.ps', '.ept', '.eps', '.eps3', '.fbx', '.flif', '.gif', '.glb', '.heif', '.heic', '.ico', '.indd', '.jpg', '.jpe', '.jpeg', '.jp2', '.wdp', '.jxr', '.hdp', '.png', '.psd', '.arw', '.cr2', '.svg', '.tga', '.tif', '.tiff', '.webp'].indexOf(`.${extension}`) != -1) {

      // IMAGES
      resultCloudinary = await cloudinary.uploader.upload(imagePath);
      tabUrl.push(resultCloudinary.url)

      //Pour la BDD
      fileInfos = {
        name: fileName,
        type: 'image',
        images: tabUrl
      }
    } else {
      error.push('format non supporté')
    }
  } else {
    error.push("Problème d'upload du document")
  }

  fs.unlinkSync(imagePath);

  if (error.length === 0 && fileInfos != {}) {

    //Mise au bon format exploitable par le front avant enregistrement en BDD
    let tabImg = fileInfos.images.map((e) => {
      let img = { url: e }
      return (img)
    })

    let newFiche = new fichesModel({
      name: fileInfos.name,
      type: fileInfos.type,
      images: tabImg,
      team: teamID
    })
    let save = await newFiche.save()
    if (save) {
      result = true
    } else {
      error.push("Problème lors de l'enregistrement, veuillez réessayer")
    }

  }
  res.json({ result, error })
})

router.get('/getFiches/:idTeam', async function (req, res, next) {

  var teamID = req.params.idTeam
  var error = []
  var result = false
  let ficheInfos = []

  if (error.length == 0) {

    // Recupération fiches
    var fiches = await fichesModel.find(
      { team: teamID }
    )

    // Infos pour REDUX
    ficheInfos = fiches.map((e) => {
      let urlImages = e.images.map((e) => e.url)
      let infos = {
        name: e.name,
        type: e.type,
        images: urlImages
      }
      return infos
    })

  } else {
    error.push("Problème de connexion à la base de données")
  }

  res.json({ result, error, ficheInfos })
})

router.get('/getActus/:idTeam/:nbActus', async function (req, res, next) {

  var teamID = req.params.idTeam
  var nbActus = Number(req.params.nbActus)
  var error = []
  var result = false

  if (error.length == 0) {

    // Recupération liste actu
    var listeActu = await actuModel.find({ team: teamID }).sort({ date_actu: -1 }).limit(nbActus).exec()

    if (listeActu) {
      result = true
    }
  }

  res.json({ result, error, listeActu })
})

router.get('/getEventsTraining/:idTeam', async function (req, res, next) {

  var teamID = req.params.idTeam
  var error = []
  var result = false
  if (error.length == 0) {

    // Recupération liste EventsteamID
    var allEvents = await eventsModel.find({ team: teamID, category: 'Entraînement' });
    if (allEvents) {
      result = true
    }
  } else {
    error.push("Problème de connexion à la base de données")
  }

  res.json({ result, error, allEvents })
})

router.get('/getEventsMatch/:idTeam', async function (req, res, next) {
  var teamID = req.params.idTeam
  var error = []
  var result = false
  if (error.length == 0) {
    // Recupération liste EventsteamID
    var allEvents = await eventsModel.find({ team: teamID, category: 'Match' })
    if (allEvents) {
      result = true
    }
  } else {
    error.push("Problème de connexion à la base de données")
  }

  // Pour récupérer le dernier Match sur le DashBoard
  var nextMatch = await eventsModel.find({ team: teamID, category: 'Match' })
  var filterMatch = nextMatch.filter(match => match.date_of_event > new Date())
  var lastMatch = filterMatch[filterMatch.length - 1]

  res.json({ result, error, allEvents, lastMatch })
})

router.get('/getEvents/:idTeam', async function (req, res, next) {

  var teamID = req.params.idTeam
  var error = []
  var result = false
  if (error.length == 0) {

    // Recupération liste EventsteamID
    var allEvents = await eventsModel.find({ team: teamID });
    if (allEvents) {
      result = true
    }
  } else {
    error.push("Problème de connexion à la base de données")
  }

  res.json({ result, error, allEvents })
})



router.get('/deleteEvent/:idEvent', async function (req, res, next) {

  var error = []
  var result = false
  var idEvent = req.params.idEvent


  // Suppression de l'event
  var eventInfos = await eventsModel.deleteOne({ "_id": idEvent })

  if (eventInfos) {
    result = true
  } else {
    error = "delete failed"
  }

  res.json({ result, error })
})

router.get('/getTeamMembers/:idTeam', async function (req, res, next) {

  var idTeam = req.params.idTeam
  var error = []
  var result = false
  var membresTeam = []


  if (error.length == 0) {

    // Recupération liste Membres
    var team = await teamModel.findById(idTeam).populate('members').exec();

    if (team != null) {
      var membres = team.members
      // Infos pour front
      membresTeam = membres.map((e) => {
        let infos = {
          id: e._id,
          admin: e.admin,
          name: e.name,
          firstname: e.firstname,
          picture_Url: e.picture_Url,
          token: e.token
        }
        return infos
      }
      )
    } else {
      error.push("Problème de connexion à la base de données")
    }
  }


  res.json({ result, error, membresTeam })
})


module.exports = router

