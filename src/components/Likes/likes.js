import {useContext, useEffect, useState} from "react";
import { postRequest } from "../../utils/server-queries.ts";
import LikedBy from "./likedBy";
import { USERNAME } from "../../data/contexts.js";

export default function Likes(props) {
    const {usernameContext, setUsernameContext} = useContext(USERNAME);
    const [likedBy, setLikedBy] = useState(props.post.likedBy)
    const [likes, setLikes] = useState(props.post.likes)
    const [likeMessage, setLikeMessage] = useState('Like')

    useEffect( () => {
        if(usernameContext) {
            if(likedBy.includes(usernameContext)) {
                setLikeMessage('Unlike')
            } else {
                setLikeMessage('Like')
            }
        }
    }, [])
    
    //function to handle if user clicks the licked button
    const handleLikes = async () => {
        
        //checks if user has already liked the parent post
        if(likedBy.includes(usernameContext)) {
            //remove user from likedBy and remove like
            setLikes(currentLikes => currentLikes - 1)
            postRequest('posts/unLikePost', {postId: props.post.id})
            setLikedBy(() => likedBy.filter(user => user !== usernameContext))
            setLikeMessage('Like') //sets the message on screen to like to indicate to user that they can like the post
        } else {
            //add user to likedBy state and add like
            setLikes(currentLikes => currentLikes + 1)
            postRequest('posts/likePost', {postId: props.post.id})
            setLikedBy(currentLikedBy => [...currentLikedBy, usernameContext])
            setLikeMessage('Unlike') //sets message on button to unlike to indicate to user clicking the button will unlike the parent post
        }

        console.log(likedBy)
    }

    return(
        <div>
            <div className='flex w-full justify-between gap-2'>
                <div className="flex gap-1 button-green w-[100%] justify-center" onClick={handleLikes}>
                    <p>{likeMessage}</p>
                    <p className="">{likes}</p>
                </div>
                <LikedBy  className="button-green" likedBy={likedBy}/>
            </div>
        </div>
    )
}