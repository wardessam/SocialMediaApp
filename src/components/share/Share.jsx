import "./share.scss";
import Image from "../../assets/img.png";
import Map from "../../assets/map.png";
import Friend from "../../assets/friend.png";
import { useContext, useState } from "react";
import { AuthContext } from "../../context/authContext";
import {
  useQuery,
  useMutation,
  useQueryClient,
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query'
import { makeRequest } from "../../axios";
const Share = () => {
  const[accesToken,setAccesToken]= useState(JSON.parse(localStorage.getItem("user"))?.accessToken||null)
  const options = {
    headers: {
      Authorization: 'Bearer '+accesToken,
    },
  }
  const [file,setFile] = useState(null)
  const [title,setTitle] = useState(null)
  const [desc,setDesc] = useState(null)
  const [imgUrl,setImgUrl] = useState(null)
  const [tags,setTags] = useState(null)
  const {currentUser} = useContext(AuthContext)
  const handleClick = e =>{
    e.preventDefault();
    mutation.mutate({ title:title,body:desc,media:imgUrl,tags: parseTextToArray(tags) });
    setDesc("");
    setTitle("");
    setImgUrl("");
    setTags("");
  }
  const queryClient = useQueryClient();
  const mutation = useMutation((newPost)=>{
   return makeRequest.post("/posts",newPost,options)
  },
    {onSuccess: async () => {
      queryClient.invalidateQueries(["posts"]);
    }
  })
  function parseTextToArray(str){
    return str?.split(",");
  }
  return (
    <div className="share">
      <div className="container">
        <div className="top">
          <h3>Create a Post</h3>
          <div>
          <input type="text" placeholder='Title of the post' 
          onChange={(e)=>setTitle(e.target.value)} value={title}/>
          </div>
          <input type="text" placeholder={`What's on your mind ${currentUser.name}?`} 
          onChange={(e)=>setDesc(e.target.value)}  value={desc}/>
            <input type="text" placeholder={`Tags`} 
            onChange={(e)=>setTags(e.target.value)} value={tags}/>
          <input type="text" placeholder={`Img URL`} 
          onChange={(e)=>setImgUrl(e.target.value)} value={imgUrl}/>
        </div>
        <hr />
        <div className="bottom">
          <div className="left">
            <input type="file" id="file" style={{display:"none"}} onChange={(e)=>setFile(e.target.files[0])} />
            <label htmlFor="file">
              <div className="item">
                <img src={Image} alt="" />
                <span>Add Image</span>
              </div>
            </label>
            <div className="item">
              <img src={Map} alt="" />
              <span>Add Place</span>
            </div>
            <div className="item">
              <img src={Friend} alt="" />
              <span>Tag Friends</span>
            </div>
          </div>
          <div className="right">
            <button onClick={handleClick}>Share</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Share;
