import { useEffect, useState } from "react"
import { getRequest, postRequest } from "../../utils/server-queries.ts"
import Modal from "../../components/UI/modal/modal.js"
import Password from "../register/password.js"
import Navbar from "../../components/UI/navbar/navbar.js"

export default function ProfilePage(){
    const [profile, setProfile] = useState({})
    const [passwordModalActive, setPasswordModalActive] = useState(false)
    const [password, setPassword] = useState('')
    const [currentIsValid, setCurrentIsValid] = useState(false)
    const [genres, setGenres] = useState()
    const [artists, setArtists] = useState()
    
    //runs once on load and gets profile to update with the users data
    useEffect(() => {
        getProfile()
    
        //awaitProfile();
        
    },[])
    
    //converts array to an array of list items
    function mapArrayToList(array, arrayName) {
        console.log('array', array)
        if(array) {
            return array.map((item, index) => <li className="px-8 border-[2px] border-green-600 bg-green-600 text-white rounded-full " key={index}><p>{item}</p></li>)
        }
        return <li className="w-[100%] flex justify-center"><p>No {arrayName} added</p></li>
    }

    //pretty self explanitory function to update the users password
    async function updatePassword() {
        console.log(password)
        if(currentIsValid) {
            postRequest('/profile/update-password', {password: password})
        } else {
            alert('There was in issue with your password. Please check you have met the password critera')
        }
    }

    //gets profile data from server and handles updating the components state
    async function getProfile() { 
        const response = await getRequest('profile/get-profile')
        console.log('response', response)
        setProfile(()=> response)
        console.log('profile', profile)
        console.log(profile.genres)
        setGenres( () => mapArrayToList(response.genres, 'genres'))
        setArtists( () => mapArrayToList(response.artists, 'artists'))
    }
    if(!profile) {
        return(<div>loading</div>)
    } else {

        return (
            <div>
                <Navbar />
                <div className=" flex flex-col content-center items-center ">
                    <div className="ml-16 w-5/6 min-h-screen bg-white shadow-black shadow-lg pb-5 ">
                        <div className="flex flex-col justify-end gap-5 py-8 bg-green-500">
                            <img className="w-40 h-40 contain overflow-hidden mx-auto object-0 rounded-full" src={`https://gig-matesd.onrender.com/images/${profile.profilePicture}`}/>
                            <h1 className="w-[100%] text-6xl font-bold didact-gotic text-center text-white">{profile.username}</h1>
                            {profile.name && <h2 className="w-[100%] text-3xl font-bold didact-gotic text-center text-white">{`(${profile.name})`}</h2>}
                        </div>
                        <div className="flex justify-center">
                            <p className=" w-[50%] button-green mt-4 py-2" onClick={()=> {setPasswordModalActive(true)}}>Change Password</p>
                        </div>
                        <Modal show={passwordModalActive} close={()=> setPasswordModalActive(false)} content={
                            <div className=" h-[100%] mt-4 overflow-scroll flex flex-col justify-around items-center bg-gray-400">
                                
                                <Password setPasswordState={setPassword} setIsPasswordValid={setCurrentIsValid}/>
                                <button onClick={updatePassword} className="button-green w-[60%] my-6" type="submit">Submit</button>
                            </div>
                            
                        } title={"Change Password"}/>
                        <div className="flex flex-col w-[100%] gap-10 justify-evenly pt-5 items-center">
                            <div className="border-[1px] border-black rounded-lg p-4 w-[90%]">
                                <h2 className="w-[100%] text-center text-2xl">Bio</h2>
                            <p>{profile.about}</p>
                            </div>
                        
                            <div className="border-[1px] border-black rounded-lg p-4 w-[90%]">
                                <h2 className="w-[100%] text-center text-2xl pb-4" >Favourite Genres</h2>
                                <ul className="w-[100%] flex flex-wrap justify-center gap-5">
                                    {genres}
                                </ul>
                            </div>
                            <div className="border-[1px] border-black rounded-lg p-4 w-[90%]">
                                <h2 className="w-[100%] text-center text-2xl pb-4">Favourite Artists</h2>
                                <ul className="w-[100%] flex flex-wrap justify-center gap-5">
                                    {artists}
                                </ul>
                            </div>
                        </div>
                    
                    </div>
                </div>
            </div>
        )
    }
}