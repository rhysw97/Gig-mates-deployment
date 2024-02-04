
import React, {useContext, useEffect, useState} from "react";
import Login from "../../components/Login/login";
import { LOGGEDIN } from "../../data/contexts";
import ProfilePage from "../Profile/profile-page";

//contains landing page that user will start on
export default function LandingPage() {
    const {loggedInContext} = useContext(LOGGEDIN)
    const backgroundImage = 'https://images.pexels.com/photos/1105666/pexels-photo-1105666.jpeg'
    const [view, setView] = useState()

    useEffect(() => {
        if(loggedInContext) {
            setView(() => <ProfilePage></ProfilePage>)
        } 
        
        else {
            setView(() => <Login></Login>)
        }
    }, [loggedInContext])

    return(
        <div className="flex flex-col">
            <div className="w-[100%]" styles={{background: `url(${backgroundImage})`}}>
                {view}
            </div>
        </div>
    )
}