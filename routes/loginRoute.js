const express = require("express")
const router = express.Router()

//app.use('/login', loginRoute )
router.post('/', (request, response) => {
    const body = request.body
    waitForLoginDetails(body, response, request);
});

//waits for login details and checks they have been accepted. Sends True or false back to user
async function waitForLoginDetails(data, response, request) {
    //
    const currentUser = request.app.locals.user 
    const loginData = await currentUser.checkLoginDetails(data);
    console.log(loginData)
    if(loginData.accepted) {
        request.session.username = loginData.username
        const data = {
            username: loginData.username,
            loggedin: true
        }
        console.log('data', data)

        response.send(data)
    } else {
        response.send({loggedin:false})
    }  
}

//destroys session which also removes it from database
router.post('/logout', (request, response) => {
    request.session.destroy()
})

//checks for user login details
router.get('/checkLoggedIn', (request, response) => {
    if(request.session.username) {
        console.log(request.session)
        response.send({username: request.session.username})
    } else {
        response.send({username: false})
    }
})

module.exports = router