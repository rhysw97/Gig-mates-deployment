import NavbarIcon from "./navbar-icon"
import NavbarIconFunction from "./navbar-icon-function"
import { useState, useEffect } from "react"
import {BsPlus, BsFillLightningFill, BsGearFill} from 'react-icons/bs'
import {FaFire, FaPoo, FaAccusoft, FaSignOutAlt, FaUser} from 'react-icons/fa'
import { LOGGEDIN, USERNAME } from "../../../data/contexts"
import { useContext } from "react"
import { getRequest, postRequest } from "../../../utils/server-queries.ts"

//adapted from fireships discord nav bar https://www.youtube.com/watch?v=pfaSUYaSgRo
export default function Navbar() {
    const {loggedInContext, setLoggedInContext} = useContext(LOGGEDIN) //sets loggedInContext to LOGGEDIN
    const {usernameContext, setUsernameContext } = useContext(USERNAME)
    const [profileIcon, setProfileIcon] = useState(<FaUser/>)
   
    //function to handle logout which is passed into NavbarIconFunction component as a prop
    function handleLogoutResponse() {
        postRequest('login/logout', {});
        setLoggedInContext(() => false)
        setUsernameContext(() => null)
    }

    return (
        <div className="navbar fixed top-0 min-h-screen w-16 pb-8
        flex flex-col justify-end sm:justify-start
        bg-gray-900 text-white shadow-lg">
            <NavbarIcon icon={profileIcon} text='Profile Page'/>
            <NavbarIcon icon={<FaFire size="20" />} path={'/post'} text='Feed' />
            <NavbarIcon icon={<BsFillLightningFill size="20" />} path={'/events'} text='Events' />
            <NavbarIcon icon={<BsPlus size="32" />} path={'/edit-profile'} text='Edit Profile'/>
            <NavbarIconFunction icon={<FaSignOutAlt size="20" />} callback={handleLogoutResponse} text='Logout'/>
        </div>
    )
}