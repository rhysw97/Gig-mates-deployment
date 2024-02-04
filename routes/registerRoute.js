const express = require("express")
const router = express.Router()

router.post('/', (request, response) => {
    const body = request.body
    createUser(response, request, body)
})

//function to create a user
async function createUser(response, request, data) {
    const currentUser = request.app.locals.user //stores user instance in current user
    const isInDatabase = await currentUser.addNewUser(data) //calls User's add new users method to add user data into db
    if(!isInDatabase.email && !isInDatabase.username) {
        request.session.username = data.username
    }
    console.log(isInDatabase)
    response.send(JSON.stringify(isInDatabase))
}

module.exports = router