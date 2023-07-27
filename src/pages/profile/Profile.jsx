import "./profile.scss";
import FacebookTwoToneIcon from "@mui/icons-material/FacebookTwoTone";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import InstagramIcon from "@mui/icons-material/Instagram";
import PinterestIcon from "@mui/icons-material/Pinterest";
import TwitterIcon from "@mui/icons-material/Twitter";
import PlaceIcon from "@mui/icons-material/Place";
import LanguageIcon from "@mui/icons-material/Language";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import Posts from "../../components/posts/Posts"
import {
  useQuery,
  useMutation,
  useQueryClient,
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query'
import axios from "axios";
import { makeRequest } from "../../axios";
import moment from 'moment';
import { useState } from "react";
import { useLocation } from "react-router-dom";
import Update from "../../components/update/Update"
import EditIcon from '@mui/icons-material/Edit';

const Profile = () => {
  const[accesToken,setAccesToken]= useState(JSON.parse(localStorage.getItem("user"))?.accessToken||null)
  const[name,setName]= useState(JSON.parse(localStorage.getItem("user"))?.name||null)
  const[myfollowing,setMyFollowing]= useState(null)
  const [openUpdate,setOpenUpdate] = useState(false);
  const options = {
    headers: {
      Authorization: 'Bearer '+accesToken,
    },
  }
  const location = useLocation();
  const { isLoading, error, data } = useQuery(["profile"], () =>
     makeRequest.get(`/profiles/`+location.state.name+'?_following=true&_followers=true&_posts=true',options).then((res) => {
      return res.data;
    })
  );
  const { isLoading2, error2, data2 } = useQuery(["myprofile"], () =>
     makeRequest.get(`/profiles/`+name+'?_following=true&_followers=true&_posts=true',options).then((res) => {
      setMyFollowing(res.data.following);
      return res.data.following;
    })
  );
  const checkFollowing = () =>{
    for(let i=0;i<myfollowing?.length;i++){
      if(myfollowing[i].name === location.state.name){
        
        return true;
      }
    }
    return false;
  }
  const queryClient = useQueryClient();
  const mutation = useMutation((following)=>{
    if(following) return makeRequest.put("profiles/"+location.state.name+"/unfollow",{},options)
    else return makeRequest.put("profiles/"+location.state.name+"/follow",{},options)
  },
    {onSuccess: async () => {
      queryClient.invalidateQueries(["profile"]);
      queryClient.invalidateQueries(["myprofile"]);
    }
  })
  const handleFollow = ()=>{
  mutation.mutate(checkFollowing())
  }
  const handleUpdate = ()=>{
    setOpenUpdate(true)
  }
  
  return (
    <div className="profile">
      {error
      ? "Something went wrong!"
      : isLoading
      ? "loading"
      : 
      <>
      <div className="images">
        <img
          src={data.banner}
          alt=""
          className="cover"
        />
        <img
          src={data.avatar}
          alt=""
          className="profilePic"
        />
      </div>
      <div className="profileContainer">
        <div className="uInfo">
          <div className="left">
            <a href="http://facebook.com">
              <FacebookTwoToneIcon fontSize="large" />
            </a>
            <a href="http://facebook.com">
              <InstagramIcon fontSize="large" />
            </a>
            <a href="http://facebook.com">
              <TwitterIcon fontSize="large" />
            </a>
            <a href="http://facebook.com">
              <LinkedInIcon fontSize="large" />
            </a>
            <a href="http://facebook.com">
              <PinterestIcon fontSize="large" />
            </a>
          </div>
          <div className="center">
            <span>{data.name}</span>
            <div className="info">
             
              <div className="item">
                <LanguageIcon />
                <span>{data.email}</span>
              </div>
            </div>
            {data.name === name ?<button onClick={handleUpdate}>Update</button> : checkFollowing() ? (<button onClick={handleFollow}>Following</button>): (<button onClick={handleFollow}>Follow</button>) }
            
          </div>
          <div className="right">
          <div className="item">
                Followers: {data._count.followers}
              </div>
              <div className="item">
                Following: {data._count.following}
              </div>
          </div>
        </div>
      </div>
      
      
      </>
     }
      <Posts posts={data?.posts}/>
     {openUpdate && <Update setOpenUpdate={setOpenUpdate}/>} 
    </div>
  );
};

export default Profile;
