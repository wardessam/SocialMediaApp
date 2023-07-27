import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/authContext";
import "./login.scss";

const Login = () => {
  const { login } = useContext(AuthContext);
  const [inputs,setInputs] = useState({
    email:"",
    password:""
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
   function checkPassword(password){
    //The password value must be at least 8 characters.
    const isValidLength = /^.{8,16}$/;
    return isValidLength.test(password)
   }
  const handleLogin = async(e) => {
    try{
      e.preventDefault();
     await login(inputs);
     navigate('/')
    }
    catch(e){
     console.log(e)
    }
    
  };

  return (
    <div className="login">
      <div className="card">
        <div className="left">
          <h1>Hello.</h1>
          <p>
          Welcome to our social media application
          </p>
          <span>Don't you have an account?</span>
          <Link to="/register">
            <button>Register</button>
          </Link>
        </div>
        <div className="right">
          <h1>Login</h1>
          <form>
            <input type="text" placeholder="Email" name="email" onChange={handleChange} />
            <input type="password" placeholder="Password" name="password" onChange={handleChange}/>
            <button onClick={handleLogin}>Login</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
