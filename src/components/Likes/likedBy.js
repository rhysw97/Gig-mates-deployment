import { useState, useEffect } from "react"
import Modal from "../UI/modal/modal"
import { postRequest } from "../../utils/server-queries.ts";
export default function LikedBy(props) {
    const [modalActive, setModalActive] = useState(false); //state to indicate if the modal showing list of people who liked the post is active or not
    const [likedBy, setLikedBy] = useState([])
    useEffect(() => {
        console.log('likes', props.likedBy)
        getUserPictures(props.likedBy)
    }, [props.likedBy])

    const getUserPictures = async (usersArray) => {
        const users = []

        for(const user of usersArray) {
            const response = await postRequest('/profile/user-pic', {username: user})
            users.push({
                username: user,
                profilePicture: response.picture
            })
        }
        setLikedBy(users)
    }
    //maps the names of users in the likedBy array passed down by parent and then stores it in list of users
        const listOfUsers = <div className="w-[100%] flex gap-3 justify-center mt-5">
            {likedBy.map((user, index) => {
                return (
                    <div key={index} className="flex flex-col sm:flex-row items-center bg-green-500 gap-5 px-5 py-4 w-[90%] rounded-2xl">
                        <img className="w-[100px] h-[100px] bg-black rounded-full" src={`https://gig-matesd.onrender.com/images/${user.profilePicture}`}/>
                        <p className="text-3xl">{user.username}</p>
                       
                    </div>
                )
            })}
    </div>
    return(
        <div className=" w-[100%] button-green">
            <p className="" onClick={() => setModalActive(true)}>LikedBy</p>
            <Modal show={modalActive} close={()=> setModalActive(false)} content={listOfUsers} title={"Liked By"}/>
        </div>
    )
}