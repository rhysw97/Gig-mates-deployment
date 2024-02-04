const {createEvent, getEvents} = require('./../components/events')
const express = require("express")
const router = express.Router()

//event route to add a new event to data base
router.post('/', (request, response) => {
    const data = request.body //stores data sent by client in data variable

    //stores the data in data in newEvent object
    const newEvent  = {
        artist: data.artist,
        genre: data.genre,
        location: data.location,
        date: data.date,
        time: data.time,
        eventPicture: data.eventPicture
    };
    //passes newEvent data to into create event to add it to database
    createEvent(newEvent)
    //sends object back to client indicating event has been added to the database
    response.send({created: true})

})

//get route to get the events from database and seerve them to user
router.get('/getEvents', (request, response) => {
    getAllEvents(response) //calls the function passing in the response to get all events from database and sends them to the client
})

async function getAllEvents(response) {
    //waits for database to getEvents and then stores the result in events list
    const eventsList = await getEvents()
    response.send(eventsList) //sends events to client
}

module.exports = router //exports all routes so they can be inmported into another file