import "./rightBar.scss";
import { useState } from "react";
import moment from 'moment';
import {
  useQuery,
  useMutation,
  useQueryClient,
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query'
import axios from "axios";
import { makeRequest } from "../../axios";
import Profile from "../../pages/profile/Profile";
import { Link, useNavigate, Navigate} from "react-router-dom";
const RightBar = () => {
  const [accesToken, setAccesToken] = useState(JSON.parse(localStorage.getItem("user"))?.accessToken || null)
  const options = {
    headers: {
      Authorization: 'Bearer ' + accesToken,
    },
  }
  const { isLoading, error, data } = useQuery(["profiles"], () =>
    makeRequest.get("/profiles?_following=true&__followers=true&_posts=true", options).then((res) => {
      return res.data;
    })
  );
  const navigate = useNavigate();
  function handleClick(name){
    navigate('/profile/'+name,{state:{name}})
  }
  
  return (
    <div className="rightBar">
      <div className="container">
        <div className="item">
        <span>Suggestions For You</span>
              {error
                ? "Something went wrong!"
                : isLoading
                  ? "loading"
                  : data.map((profile) =>
                    <div  className="user">
                   <div className="userInfo">
                    <img
                    src={profile.avatar}
                    alt=""
                  />
                  <p>
                    <span onClick={()=>{handleClick(profile.name)}}>{profile.name}</span> {profile.email}
                  </p>
            
                
             </div>
             <span>Posts: {profile._count.posts}</span>
             </div>
                  
                   
                  )}

          
       
       
        
      </div>
      <div className="item">
        <span>Online Friends</span>
        <div className="user">
          <div className="userInfo">
            <img
              src="https://images.pexels.com/photos/4881619/pexels-photo-4881619.jpeg?auto=compress&cs=tinysrgb&w=1600"
              alt=""
            />
            <div className="online" />
            <span>Jane Doe</span>
          </div>
        </div>
        <div className="user">
          <div className="userInfo">
            <img
              src="https://images.pexels.com/photos/4881619/pexels-photo-4881619.jpeg?auto=compress&cs=tinysrgb&w=1600"
              alt=""
            />
            <div className="online" />
            <span>Jane Doe</span>
          </div>
        </div>
        <div className="user">
          <div className="userInfo">
            <img
              src="https://images.pexels.com/photos/4881619/pexels-photo-4881619.jpeg?auto=compress&cs=tinysrgb&w=1600"
              alt=""
            />
            <div className="online" />
            <span>Jane Doe</span>
          </div>
        </div>
        <div className="user">
          <div className="userInfo">
            <img
              src="https://images.pexels.com/photos/4881619/pexels-photo-4881619.jpeg?auto=compress&cs=tinysrgb&w=1600"
              alt=""
            />
            <div className="online" />
            <span>Jane Doe</span>
          </div>
        </div>
        <div className="user">
          <div className="userInfo">
            <img
              src="https://images.pexels.com/photos/4881619/pexels-photo-4881619.jpeg?auto=compress&cs=tinysrgb&w=1600"
              alt=""
            />
            <div className="online" />
            <span>Jane Doe</span>
          </div>
        </div>
        <div className="user">
          <div className="userInfo">
            <img
              src="https://images.pexels.com/photos/4881619/pexels-photo-4881619.jpeg?auto=compress&cs=tinysrgb&w=1600"
              alt=""
            />
            <div className="online" />
            <span>Jane Doe</span>
          </div>
        </div>
        <div className="user">
          <div className="userInfo">
            <img
              src="https://images.pexels.com/photos/4881619/pexels-photo-4881619.jpeg?auto=compress&cs=tinysrgb&w=1600"
              alt=""
            />
            <div className="online" />
            <span>Jane Doe</span>
          </div>
        </div>
        <div className="user">
          <div className="userInfo">
            <img
              src="https://images.pexels.com/photos/4881619/pexels-photo-4881619.jpeg?auto=compress&cs=tinysrgb&w=1600"
              alt=""
            />
            <div className="online" />
            <span>Jane Doe</span>
          </div>
        </div>
        <div className="user">
          <div className="userInfo">
            <img
              src="https://images.pexels.com/photos/4881619/pexels-photo-4881619.jpeg?auto=compress&cs=tinysrgb&w=1600"
              alt=""
            />
            <div className="online" />
            <span>Jane Doe</span>
          </div>
        </div>
        <div className="user">
          <div className="userInfo">
            <img
              src="https://images.pexels.com/photos/4881619/pexels-photo-4881619.jpeg?auto=compress&cs=tinysrgb&w=1600"
              alt=""
            />
            <div className="online" />
            <span>Jane Doe</span>
          </div>
        </div>
        <div className="user">
          <div className="userInfo">
            <img
              src="https://images.pexels.com/photos/4881619/pexels-photo-4881619.jpeg?auto=compress&cs=tinysrgb&w=1600"
              alt=""
            />
            <div className="online" />
            <span>Jane Doe</span>
          </div>
        </div>
      </div>
    </div>
    </div >
  );
};

export default RightBar;
