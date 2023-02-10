import { Routes, Route } from "react-router-dom";
import { PostList } from "./components/pl";
import { PostProvider } from "./context/PostContext";
import { Post } from "./components/post";
import './styles.css'
import './navStyles.css'
import { NavBarMain } from "./NavBar/navBarMain";
import { Login } from "./login/Login";
import './loginStyles.css'
import { useState } from "react";
import { useUser } from "./hooks/useUser";
import { Dashboard } from "./dashboard/Dashboard";
import { Signup } from "./signup/signup";
import { RegisterPost } from "./RegisterPost/RegisterPost";
import { SignupInvester } from "./signup/signupInvester";
import M from "materialize-css";
import { DashboardInv } from "./dashboard/DashboardInvester";
import { SingleInvester } from "./components/showInv";

function App() {
  
  return (
  <div className="container">
    <NavBarMain />
    <Routes>
      <Route path="/Invester/:id" element={<SingleInvester/>}/>
      <Route path="/registerPost" element={<RegisterPost/>}/>
      <Route path="/login" element={<Login />}/>
      <Route path="/" element={<PostList />}/>
      <Route path="/signup" element={<Signup />}/>
      <Route path="/posts/:id" element={<PostProvider>
        <Post />
      </PostProvider>}/>
      <Route path="/:userID/main" element={<Dashboard />}/>
      <Route path="/investerSignUp" element={<SignupInvester/>}/>
      <Route path="/:invID/maininvester" element={<DashboardInv/>}/>  
    </Routes>
  </div>)
}

export default App;
