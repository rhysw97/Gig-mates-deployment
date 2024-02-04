import React, {useState, useRef, useEffect} from 'react';
import { FaTrash } from 'react-icons/fa';

//function to allow user to add tags to a list
function Tags(props) {
  const [tags, setTags] = useState([])
  const inputRef = useRef(null)
  
  useEffect(()=> {
    console.log(props.taglist)
    async function addCurrentTags() {
      await setTags(() => {
        const updatedTags = props.taglist
        return updatedTags
      })
    }

    addCurrentTags()
  },[])

  //checks whether the user has already added the tag
  const doesTagExist = tag => !tags.includes(tag)?true : false

  //function to remove a tag if user clicks on the x button
  function removeTag(tag) {

    setTags(currentValues => {
      return currentValues.filter(tagToCheck => tagToCheck !== tag) //returns a new array with all the tags that aren't equal to the one passed into function
    })
    
    props.callback(() => tags)
  }
  
  function addTag() {
    const inputValue = inputRef.current.value
    
    if(doesTagExist(inputValue)) {
      setTags(currentTags => [...currentTags, inputValue])
      inputRef.current.value = ''
      
    
      props.callback(currentTags => [...currentTags, inputValue])
    }

    else {
      alert('Tag already exists')
    }
  }

  return (
    <div className="w-[100%] flex flex-col">
      <div className=' border-green-500 border-2 rounded-t-lg w-full'>
        <p className='bg-green-500 text-center text-2xl py-2 px-2'>{props.title}</p>
        <ul className='flex flex-col gap-2 min-h-[400px] max-h-[400px] overflow-y-scroll p-2' >
          {tags.map((tag, i) =>{ return <li key={i} className='flex justify-between items-center bg-gray-500 h-[100px] rounded-r-full pl-2' >
            <p className='bg-gray-500 w-[100%] py-2 rounded-r-full text-wrap'>{tag}</p>
            <div className=' flex items-center justify-center hover:text-green-800 pr-3 hover:cursor-pointer' onClick={()=>{
              removeTag(tag)
            }}>
              <p className='self-center'><FaTrash></FaTrash></p>
            </div>
          </li>})}
        </ul>
      </div>
      <div className='flex self-end w-[100%]'>
        <input className='text-black py-2 pl-2 rounded-bl-lg w-full' type="text" ref={inputRef}></input>
        <p className='bg-green-500 p-2 rounded-br-lg hover:bg-green-700 cursor-pointer shadow-md w-[30%] md:w-[25%] text-center' onClick={addTag}>add</p>
      </div>
    </div>
  );
}

export default Tags;
