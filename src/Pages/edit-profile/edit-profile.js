import { getRequest} from "../../utils/server-queries.ts";
import { useState, useEffect, useRef } from "react";
import { useNavigate } from 'react-router-dom'
import Tags from '../../components/Tags/Tags.js'
import Navbar from "../../components/UI/navbar/navbar.js";
import "./edit-profile.css"

export default function EditProfile() {
    //profile inputs
    const [name, setName] = useState("");
    const [image, setImage] = useState();
    const [bio, setBio] = useState("");
    const [genres, setGenres] = useState(null);
    const [artists, setArtists] = useState(null);
    const [fileName, setFileName] = useState('No File Uploaded')
    const fileInputRef = useRef(null)
    let artistList = []
    const navigate = useNavigate()

    useEffect(() => {
        getProfileData()
        
    },[])

    async function getProfileData() {
            const response = await getRequest('profile/get-profile')
            console.log(response)
            setGenres(() => response.genres)
            setArtists(() => response.artists)
            setName(() => response.name)
            setBio(() => response.about) 
    }
   
    //handles submitting the form and sends data to backend then navigates to the users profile page so they can see the update
    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData()
       
        formData.append('name', name)
        formData.append('bio', bio)
        formData.append('genres', genres) 
        formData.append('artists', artists) 
        
        //if image exists then append image to formData
        if(image) {
            formData.append('file', image)
            //post data to editWithFile endpoint
            fetch('/profile/editWithFile', {
                method: 'POST',
                body: formData
            })
        //otherwise post data to edit endpoint
        } else {
            console.log(formData)
            fetch('/profile/edit', {
                method: 'POST',
                body: formData,
            });
        }

        navigate('/profile')
    };

    const handleChange = () => {
        const file = fileInputRef.current.files[0];
        setFileName(`Uploaded ${file.name}`)
        setImage(() => file);
    };
  
    return (
        <div>
            <Navbar />
            <div className="flex flex-col justify-center w-[100%] mx-auto" >
                <header className='flex justify-center'>
                    <h1 className='text-5xl heading'>Edit Profile</h1>
                </header>
                <div className="flex items-center flex-col ml-16">
                    <form  className="w-[100%] flex flex-col items-center" onSubmit={handleSubmit}>
                        <div className="w-[100%] flex flex-col items-center mb-5">
                            <label className="text-white text-xl">Name</label>
                            <input
                                className="input-field w-[90%]"
                                placeholder="Name"
                                name='name'
                                defaultValue={name}
                                onChange={(e) => setName(e.target.value)}
                                required
                            />
                        </div>
                        <div className="w-full flex justify-center items-center flex-col gap-1 mb-5">

                            <label className="text-white button-green w-[90%] p-3">Upload Profile Image 
                                <input
                                    className=""
                                    name='file'
                                    type="file"
                                    id="file_input"
                                    accept="image/*"
                                    ref={fileInputRef}
                                    onChange={handleChange}
                                    placeholder="Upload new profile picture"
                                />
                            </label>
                            <p className='text-white'>{fileName}</p>
                        </div>
                        <div className="flex flex-col w-[90%] items-center">
                            <label className="text-white text-xl p-3">Bio</label>
                            <textarea
                            className="border-black border-2 h-20 rounded-xl px-3 py-2 min-h-[200px] placeholder:translate-y-20 w-full"
                            placeholder="Bio"
                            name='bio'
                            type="text"
                            defaultValue={bio}
                            onChange={(e) => setBio(e.target.value)}
                            />
                        </div>

                        <div className="text-white flex flex-col lg:flex-row w-[90%] gap-10 justify-center m-5" >
                            {genres && <Tags callback={setGenres} taglist={genres} title={'Add your favourite Genres'}></Tags>}                 
                            {artists && <Tags  callback={setArtists} taglist={artists} title={'Add your favourite Artists'}></Tags>}
                            
                        </div>
                        <button className="button-green mb-5 w-[90%] py-3" type="submit" >Submit</button>
                    </form>
                </div>
            </div>
        </div>
    );
}