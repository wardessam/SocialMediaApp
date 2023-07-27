import "./posts.scss";
import {
  useQuery,
  useMutation,
  useQueryClient,
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query'
import axios from "axios";
import { makeRequest } from "../../axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import DeleteIcon from '@mui/icons-material/Delete'
import Comments from "../comments/Comments";
import TextsmsOutlinedIcon from "@mui/icons-material/TextsmsOutlined";
import moment from 'moment';
import EditIcon from '@mui/icons-material/Edit';
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

const Posts = ({ posts }) => {
  const [accesToken, setAccesToken] = useState(JSON.parse(localStorage.getItem("user"))?.accessToken || null)
  const options = {
    headers: {
      Authorization: 'Bearer ' + accesToken,
    },
  }
  const [commentOpen, setCommentOpen] = useState(false);
  const liked = true;
  const [name, setName] = useState(JSON.parse(localStorage.getItem("user"))?.name || null)
  const [open, setOpen] = useState(false);
  const [texts, setTexts] = useState({
    title: "",
    body: "",
    tags: [],
    media: ""
  })
  const [title, setTitle] = useState(null)
  const [body, setBody] = useState(null)
  const [tags, setTags] = useState(null)
  const [media, setMedia] = useState(null)
  const handleChange = (e) => {
    setTexts((prev) => ({ ...prev, [e.target.name]: [e.target.value] }))
  }
  const handleOpen = (post) => {
    setTitle(post.title)
    setBody(post.body)
    setTags(parseTagsToText(post.tags))
    setMedia(post.media)
    setOpen(true)};
  const handleClose = () => setOpen(false);

  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const { isLoading, error, data } = useQuery(["posts"], () =>
    makeRequest.get('/posts?_reactions=true&_author=true', options).then((res) => {
      return res.data;
    })
  );
  const mutation = useMutation(({ symbol, id }) => {
    return makeRequest.put("/posts/" + id + '/react/' + symbol, {}, options)
  },
    {
      onSuccess: async () => {
        queryClient.invalidateQueries(["posts"]);
      }
    })
  const handleLike = (symbol, id) => {
    mutation.mutate({ symbol, id });
  };
  function handleClick(id) {
    navigate('/post/' + id, { state: { id } })
  }
  const deleteMutation = useMutation((id) => {

    return makeRequest.delete("/posts/" + id, options).catch((err) => {
      alert("Something went wrong");
    })

  },
    {
      onSuccess: async () => {
        queryClient.invalidateQueries(["posts"]);
      }
    })
  function handleDelete(id) {
    confirmAlert({
      title: 'Delete Post',
      message: 'Are you sure to delete this post?',
      buttons: [
        {
          label: 'Yes',
          onClick: () => {
            alert("Post deleted Successfully")
            deleteMutation.mutate(id)
          }
        },
        {
          label: 'No',
          onClick: () => alert("Post isnt deleted")
        }
      ]
    });

  }
  function parseTagsToText(tags){
    return tags.toString();
  }
  function parseTextToArray(str){
    return str?.split(",");
  }
  const updateMutation = useMutation(({id,data}) => {

    return makeRequest.put("/posts/" + id,data,options).catch((err) => {
      alert("Something went wrong");
    })

  },
    {
      onSuccess: async () => {
        queryClient.invalidateQueries(["posts"]);
      }
    })
  function handleUpdate(e,id) {
    e.preventDefault();
    const data ={
      title : title,
      body: body,
      tags : parseTextToArray(tags),
      media : media
    }
     updateMutation.mutate({id,data})
     alert("Post Updated Successfully");
     handleClose();
  }
  console.log(data)
  return <div className="posts">
    {posts?.length > 0 ? posts.map((post) => (
      <div className="post" >
        <div className="container">
          <div className="user">
            <div className="userInfo">
              <div className="details">
                <h3 onClick={() => { handleClick(post.id) }}>{post.title}</h3>
                <span className="date">{moment(post.created).fromNow()}</span>
              </div>
            </div>
            {post.author?.name == name ? (
              <>
                <EditIcon onClick={handleUpdate}>Edit Post</EditIcon>
                <DeleteIcon onClick={() => handleDelete(post.id)}>Delete Post</DeleteIcon>
              </>) : ""}
          </div>
          <div className="content">
            <p>{post.body}</p>
            <img src={post.media} alt="" />
            {post.tags.map((t) => <span>#{t}</span>)}
          </div>
          <div className="info">
            <div className="item">
              {post.reactions?.length > 0 ? post.reactions.map((p) => <span onClick={() => handleLike(p.symbol, post.id)}>{p.count}{p.symbol}</span>) : <span onClick={() => handleLike('👍', post.id)}>0 👍</span>}
            </div>
            <div className="item" onClick={() => setCommentOpen(!commentOpen)}>
              {post._count?.comments}
              <TextsmsOutlinedIcon />
            </div>
          </div>
          {commentOpen && <Comments postId={post.id} />}
        </div>
      </div>
    ))
      :
      error
        ? "Something went wrong!"
        : isLoading
          ? "loading"
          : data.map((post) => (
            <div className="post" >
              <div className="container">
                <div className="user">
                  <div className="userInfo">
                    <div className="details">
                      <h3 onClick={() => { handleClick(post.id) }}>{post.title}</h3>
                      <span className="date">{moment(post.created).fromNow()}</span>
                    </div>
                  </div>
                  {post.author.name == name ? (
                    <div>
                      <EditIcon onClick={()=>handleOpen(post)}>Edit Post</EditIcon>
                      <Modal
                        open={open}
                        onClose={handleClose}
                        aria-labelledby="modal-modal-title"
                        aria-describedby="modal-modal-description"
                      >
                        <Box sx={style}>
                          <Typography id="modal-modal-title" variant="h6" component="h2">
                            Edit Post
                          </Typography>
                         
                          <form>
                            <label>Title</label>
                            <input type="text" name="title" onChange={(e)=>setTitle(e.target.value)} value={title} />
                         
                         
                            <label>Body</label>
                            <input type="text" name="body" onChange={(e)=>setBody(e.target.value)} value={body}/>
                       
                          <label>Tags</label>
                          <input type="text" name="tags" value={tags} onChange={(e)=>setTags(e.target.value)}/>
                         
                        
                          <label>Media</label>
                          <input type="text" name="media" onChange={(e)=>setMedia(e.target.value)} value={media}/>
                         
                          <button onClick={(e)=>handleUpdate(e,post.id)}>Update</button>
                          </form>
                        
                        </Box>
                      </Modal>
                      <DeleteIcon onClick={() => handleDelete(post.id)}>Delete Post</DeleteIcon>
                    </div>
                  ) : ""}
                </div>
                <div className="content">
                  <p>{post.body}</p>
                  <img src={post.media} alt="" />
                  {post.tags.map((t) => <span>#{t}</span>)}
                </div>
                <div className="info">
                  <div className="item">
                    {post.reactions.length > 0 ? post.reactions.map((p) => <span onClick={() => handleLike(p.symbol, post.id)}>{p.count}{p.symbol}</span>) : <span onClick={() => handleLike('👍', post.id)}>0 👍</span>}
                  </div>
                  <div className="item" onClick={() => setCommentOpen(!commentOpen)}>
                    {post._count?.comments}
                    <TextsmsOutlinedIcon />
                  </div>
                </div>
                {commentOpen && <Comments postId={post.id} />}
              </div>
            </div>
          ))}
  </div>;
};

export default Posts;
