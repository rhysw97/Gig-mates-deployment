const express = require("express")
const router = express.Router()
const path = require('path')
const multer = require('multer');
const { request } = require("http");

const storage = multer.diskStorage({
    destination: './public/uploads',
    filename: (req, file, cb) => {
      const ext = path.extname(file.originalname);
      cb(null, `${Date.now()}${ext}`);
    },
  });

router.post('/edit', multer({ storage }).single('file'), (request, response) => {
  console.log('request', request.body)
  const data = {
    username: request.session.username,
    name: request.body.name,
    about: request.body.bio,
    genres: request.body.genres.split(','),
    artists: request.body.artists.split(',')
  }

  console.log('data', data)
  request.app.locals.user.updateProfile(data)
})

router.post('/editWithFile', multer({ storage }).single('file'), (request, response) => {
  console.log(request.body)
  const data = {
    username: request.session.username,
    name: request.body.name,
    about: request.body.bio,
    profilePicture: request.file.filename,
    genres: request.body.genres.split(','),
    artists: request.body.artists.split(',')
  }

  console.log('data', data)
  request.app.locals.user.updateProfile(data)
})

router.post('/remove-genre', (request, response) => {
  removeGenre()
})

async function removeGenre() {
  const data = await request.app.locals.user.findOne({usename: request.session.username})

  console.log(data)
}
  
  // Start the server.

//route for getting current users profile data 
router.get('/get-profile', (request, response) => {
  if(request.query.username) {
    request.app.locals.user.getProfileData(request.query.username, response)
  } else {
    request.app.locals.user.getProfileData(request.session.username, response)
  }

})

router.post('/update-password', (request, response) => {
  console.log(request.body.password)
  request.app.locals.user.updatePassword(request.session.username, request.body.password)

})

//route for getting a users profile picture (contains url param for name)
router.get('/profile-pic', async (request, response) => {
  await request.app.locals.user.getProfilePicture(request.session.username, response) 
}), 

router.post('/user-pic', async(request, response) => {
  await request.app.locals.user.getProfilePicture(request.body.username, response) 
})

module.exports = router