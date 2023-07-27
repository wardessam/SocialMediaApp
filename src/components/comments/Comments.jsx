import { useContext, useState } from "react";
import "./comments.scss";
import { AuthContext } from "../../context/authContext";
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
const Comments = ({postId}) => {
  const { currentUser } = useContext(AuthContext);
  const [comment,setComment] = useState(null)
  const[accesToken,setAccesToken]= useState(JSON.parse(localStorage.getItem("user"))?.accessToken||null)
  const options = {
    headers: {
      Authorization: 'Bearer '+accesToken,
    },
  }
  const { isLoading, error, data } = useQuery(["comments"], () =>
    makeRequest.get(`/posts/`+postId+'?_comments=true',options).then((res) => {
      return res.data.comments;
    })
  );
  const handleClick = e =>{
    e.preventDefault();
    mutation.mutate({ body: comment });
    setComment("")
  }
  const queryClient = useQueryClient();
  const mutation = useMutation((newComment)=>{
   return makeRequest.post("/posts/"+postId+'/comment',newComment,options)
  },
    {onSuccess: async () => {
      queryClient.invalidateQueries(["comments"]);
    }
  })
  return (
    <div className="comments">
      <div className="write">
        <img src={currentUser.profilePic} alt="" />
        <input type="text" placeholder="write a comment" 
        onChange={(e)=>setComment(e.target.value)} value={comment}/>
        <button onClick={handleClick}>Send</button>
      </div>
      {data?.map((comment) => (
        <div className="comment">
          <img src={comment.author.avatar} alt="" />
          <div className="info">
            <span>{comment.author.name}</span>
            <p>{comment.body}</p>
          </div>
          <span className="date">{moment(comment.created).fromNow()}</span>
        </div>
      ))}
    </div>
  );
};

export default Comments;
