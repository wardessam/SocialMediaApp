import { useState } from "react"
import "./update.scss"
import {
    useQuery,
    useMutation,
    useQueryClient,
    QueryClient,
    QueryClientProvider,
  } from '@tanstack/react-query'
  import { makeRequest } from "../../axios";
const Update = ({setOpenUpdate}) =>{
    const[accesToken,setAccesToken]= useState(JSON.parse(localStorage.getItem("user"))?.accessToken||null)
    const[user,setUser]= useState(JSON.parse(localStorage.getItem("user"))||null)
    const options = {
      headers: {
        Authorization: 'Bearer '+accesToken,
      },
    }
    const[name,setName]= useState(JSON.parse(localStorage.getItem("user"))?.name||null)
    const [texts,setTexts] = useState({
        avatar:"",
        banner:""
    })
 const handleChange =(e)=>{
 setTexts((prev)=>({...prev, [e.target.name]:[e.target.value]}))
 }
 
 const handleSubmit = e =>{
    e.preventDefault();
    console.log({avatar:texts.avatar[0],banner:texts.banner[0]})
    mutation.mutate({avatar:texts.avatar[0],banner:texts.banner[0]} );
    setOpenUpdate(false)
    setUser((prev)=>({
       ...prev,
       banner: texts.banner[0],
       avatar: texts.avatar[0]
    }))
    localStorage.setItem("user",JSON.stringify(user))
  }
  const queryClient = useQueryClient();
  const { isLoading, error, data } = useQuery(["profile"], () =>
     makeRequest.get(`/profiles/`+name+'?_following=true&_followers=true&_posts=true',options).then((res) => {
      return res.data;
    })
  );
  const mutation = useMutation((userData)=>{
   return makeRequest.put("/profiles/"+name+"/media",userData,options)
  },
    {onSuccess: async () => {
      queryClient.invalidateQueries(["profile"]);
    }
  })
    return(
  <div className="update">
    Update 
    <button onClick={()=>{setOpenUpdate(false)}}>X</button>
  <form>
    <label>Avatar URL</label>
    <input type="text" name="avatar" onChange={handleChange}/>
    <label>Banner URL</label>
    <input type="text" name="banner" onChange={handleChange}/>
    <button onClick={handleSubmit}>Update</button>
  </form>
 
  </div>
    )
}
export default Update;