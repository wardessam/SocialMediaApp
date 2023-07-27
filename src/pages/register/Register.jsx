import { Link } from "react-router-dom";
import "./register.scss";
import { useState } from "react";
import axios from "axios";
import { useNavigate } from 'react-router-dom';
const Register = () => {
  const [inputs,setInputs] = useState({
    name:"",
    email:"",
    password:"",
    avatar:"",
    banner:""
  })
  const navigate = useNavigate();
  const handleChange = e =>{
    setInputs(prev=>({...prev,[e.target.name]:e.target.value}))
  }

  function checkEmail(email){
    //The email value must be a valid stud.noroff.no or noroff.no email address.
   if(email.includes("@stud.noroff.no")|| email.includes("@noroff.no")) return true;
   return false;
  }
   function checkName(name){
    //The name value must not contain punctuation symbols apart from underscore (_).
    const regex = /^[a-zA-Z0-9_]+$/;
    return regex.test(name);
   }
   function checkPassword(password){
    //The password value must be at least 8 characters.
    const isValidLength = /^.{8,16}$/;
    return isValidLength.test(password)
   }
 const Register = async e =>{
      e.preventDefault();
      console.log(inputs)
      try{
        if(!checkName(inputs.name)){
          alert("The name value must not contain punctuation symbols apart from underscore (_)");
          return false
        }
        if(!checkEmail(inputs.email)){
          alert("The email value must be a valid stud.noroff.no or noroff.no email address.");
          return false
        }
        if(!checkPassword(inputs.password)){
          alert("The password value must be at least 8 characters.");
          return false
        }
        await axios.post('https://api.noroff.dev/api/v1/social/auth/register',inputs);
        alert("User Created Successfully!");
        navigate('/');
      }
      catch(err){

      }
  }
  return (
    <div className="register">
      <div className="card">
        <div className="left">
          <h1>Hello.</h1>
          <p>
            Welcome to our social media application.
          </p>
          <span>Do you have an account?</span>
          <Link to="/login">
          <button>Login</button>
          </Link>
        </div>
        <div className="right">
          <h1>Register</h1>
          <form>
            <input type="text" placeholder="Name" name="name" onChange={handleChange}/>
            <input type="email" placeholder="Email" name="email" onChange={handleChange}/>
            <input type="password" placeholder="Password" name="password" onChange={handleChange}/>
            <input type="text" placeholder="Avatar URL" name="avatar" onChange={handleChange} />
            <input type="text" placeholder="Banner URL" name="banner" onChange={handleChange}/>
            <button onClick={Register}>Register</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;
