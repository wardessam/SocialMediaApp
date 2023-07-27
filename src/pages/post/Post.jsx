import "./post.scss";
import FavoriteBorderOutlinedIcon from "@mui/icons-material/FavoriteBorderOutlined";
import FavoriteOutlinedIcon from "@mui/icons-material/FavoriteOutlined";
import TextsmsOutlinedIcon from "@mui/icons-material/TextsmsOutlined";
import ShareOutlinedIcon from "@mui/icons-material/ShareOutlined";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import { Link } from "react-router-dom";
import Comments from "../../components/comments/Comments";
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
import { useLocation } from "react-router-dom";
import Stories from "../../components/stories/Stories"
import Share from "../../components/share/Share"
const Post = () => {
  const [commentOpen, setCommentOpen] = useState(false);
  const liked = true;
  const[accesToken,setAccesToken]= useState(JSON.parse(localStorage.getItem("user"))?.accessToken||null)
  const [menuOpen, setMenuOpen] = useState(false);
  const options = {
    headers: {
      Authorization: 'Bearer '+accesToken,
    },
  }
  const location = useLocation();
  const { isLoading, error, data } = useQuery(["post"], () =>
    makeRequest.get(`/posts/`+location.state.id+'?_reactions=true',options).then((res) => {
      return res.data;
    })
  );
  const queryClient = useQueryClient();
  const mutation = useMutation((symbol)=>{
   return makeRequest.put("/posts/"+location.state.id+'/react/'+symbol,{},options)
  },
    {onSuccess: async () => {
      queryClient.invalidateQueries(["post"]);
    }
  })
  const handleLike = (symbol) => {
    mutation.mutate(symbol);
  };
  const deleteMutation = useMutation(()=>{
    return makeRequest.delete("/posts/"+data.id,options)
   },
     {onSuccess: async () => {
       queryClient.invalidateQueries(["post"]);
     }
   })
  function handleDelete(){
   deleteMutation.mutate();
  }
  return (
    <> 
    <Stories/>
    <Share/>
    <div className="post">
      <div className="container">
        <div className="user">
          <div className="userInfo">
            <div className="details">
            <h3>{data?.title}</h3>
            
              <span className="date">{moment(data?.created).fromNow()}</span>
            </div>
          </div>
          <MoreHorizIcon onClick={()=>setMenuOpen(!menuOpen)}/>
          {menuOpen && <button onClick={handleDelete}>Delete Post</button>}
        </div>
        <div className="content">
          <p>{data?.body}</p>
          <img src={data?.media} alt="" />
          {data?.tags.map((t) => <span>#{t}</span>)}
        </div>
        <div className="info">
          <div className="item">
            {data?.reactions ? data?.reactions.map((p) => <span onClick={()=>handleLike(p.symbol)}>{p.count}{p.symbol}</span>): <span onClick={()=>handleLike('👍')}>0 👍</span>}
          </div>
          <div className="item" onClick={() => setCommentOpen(!commentOpen)}>
            <TextsmsOutlinedIcon />
            {data?._count.comments}
          </div>
        </div>
        {commentOpen && <Comments postId={data.id}/>}
      </div>
    </div>
    </>
  );
};

export default Post;
