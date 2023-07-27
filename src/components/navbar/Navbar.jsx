import "./navbar.scss";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import DarkModeOutlinedIcon from "@mui/icons-material/DarkModeOutlined";
import WbSunnyOutlinedIcon from "@mui/icons-material/WbSunnyOutlined";
import GridViewOutlinedIcon from "@mui/icons-material/GridViewOutlined";
import NotificationsOutlinedIcon from "@mui/icons-material/NotificationsOutlined";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import PersonOutlinedIcon from "@mui/icons-material/PersonOutlined";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import { Link } from "react-router-dom";
import { useContext } from "react";
import { DarkModeContext } from "../../context/darkModeContext";
import { AuthContext } from "../../context/authContext";
import LogoutIcon from '@mui/icons-material/Logout';
import { useNavigate } from "react-router-dom";
const Navbar = () => {
  const { toggle, darkMode } = useContext(DarkModeContext);
  const { currentUser } = useContext(AuthContext);
  const nav = useNavigate();
 function logout(){
   localStorage.clear();
   alert("Logged Out Successfully");
   nav("/login");
 }
 function openProfile(){
  nav("/profile/"+currentUser?.name,{state:{name:currentUser.name}});
 }
 function openHome(){
  nav("/");
 }
  return (

    <div className="navbar">
      <div className="left">
        <Link to="/" style={{ textDecoration: "none" }}>
          <span>Rania Social Media App</span>
        </Link>
        <HomeOutlinedIcon onClick={openHome}/>
        {darkMode ? (
          <WbSunnyOutlinedIcon onClick={toggle} />
        ) : (
          <DarkModeOutlinedIcon onClick={toggle} />
        )}
        <GridViewOutlinedIcon />
        <div className="search">
          <SearchOutlinedIcon />
          <input type="text" placeholder="Search..." />
        </div>
      </div>
      <div className="right">
        <PersonOutlinedIcon />
        <LogoutIcon  onClick={logout}/>
        <div className="user">
          <img
            src={currentUser.avatar}
            alt=""
          />
          <span onClick={openProfile}>{currentUser.name}</span>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
