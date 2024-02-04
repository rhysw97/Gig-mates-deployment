import React, { useEffect, useState } from "react";
import   {BlackMassImage, HamishHawkImage, QuelleChrisImage } from "./../../assets/images/image-links"  
import CreateEvent from './create-event'   
import Modal from './../../components/UI/modal/modal';        
import { getRequest } from "../../utils/server-queries.ts";
import Navbar from "../../components/UI/navbar/navbar.js";
import Event from './event.js'

export default function Events() {
    const [createEventModalActive, setCreateEventModalActive] = useState(false)
    const [events, setEvents] = useState([])

    async function getEvents() {
        const data = await getRequest('events/getEvents')
    
        setEvents(data)
    }

    useEffect(() => {
        getEvents()

    },[])

    return (
        <div className="gothic text-white">
            <Navbar />
            <header className='flex justify-center'>
                <h1 className='text-5xl heading'>Events</h1>
            </header>

            <div className="ml-16 flex flex-col max-w-[100%] flex-wrap">
                <div className="flex flex-row gap-2 flex-wrap w-[100%]">
                    {events.toReversed().map(event => {
                        return <Event key={event._id} event={event}/>
                    })}
                </div>
                <div className='h-[100px]'></div>
            </div>
            <div className=" 
                text-green-500 bg-white py-4 px-10 rounded-full shadow-lg shadow-slate-700  fixed bottom-4 right-5
                hover:bg-gray-300 hover:shadow-inner hover:bottom-3 hover:cursor-pointer hover:shadow-black
            " onClick= { () => setCreateEventModalActive(true)} ><p className="font-bold text-2xl">Create Event</p></div>
            <Modal show={createEventModalActive} close={()=> setCreateEventModalActive(false)} content={<CreateEvent setEventList={setEvents} modalActive={setCreateEventModalActive}/>} title={"Create Event"}/>
        </div>
    );
}