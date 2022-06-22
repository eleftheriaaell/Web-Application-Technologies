import './App.css';
import React  from 'react';
import {BrowserRouter, Routes, Route, Link} from 'react-router-dom';
import WelcomePage from "./pages/WelcomePage"
import AdminPage from "./pages/AdminPage"
import Home from "./pages/Home"
import InfoPage from "./pages/InfoPage"
import PendingPage from "./pages/PendingPage"
import CreatePost from "./pages/CreatePost"
import Post from "./pages/Post"
import Login from "./pages/Login"
import Registration from "./pages/Registration"
import ManagementPage from './pages/ManagementPage';
import MessagePage from './pages/MessagePage';
import SentPage from './pages/SentPage';
import InboxPage from './pages/InboxPage';
import {AuthContext} from './helpers/AuthContext';
import {useState, useEffect} from 'react';
import axios from 'axios';

function App() {

  const [authState, setAuthState] = useState({
    username: "",
    id: 0, 
    status: false,
  });

  useEffect(() => {
    axios.get('http://localhost:3001/auth/auth', {headers: {
      accessToken: localStorage.getItem("accessToken")
    }}).then((response) => {
      if(response.data.error){
        setAuthState({...authState, status: false});
      }else{
        setAuthState({
          username: response.data.username,
          id: response.data.id, 
          status: true,
        });
      }
    });   
  }, [authState]);

  const logout = () => {
    localStorage.removeItem("accessToken");
    setAuthState({
      username: "",
      id: 0, 
      status: false,
    });
  };

  return (
    <div className='App'>
      <AuthContext.Provider value={{authState, setAuthState}}>
        <BrowserRouter>
          <div className='navbar'>
            <Link to="/">Welcome Page</Link>
            <Link to="/homepage">Home Page</Link>
            <Link to="/createpost">Create Post</Link>
            {!authState.status && (
              <>
                <Link to="/login">Login</Link>
                <Link to="/registration">Registration</Link>
              </>
            )} 
            { (authState.id === -1 && authState.status) &&(
              <>
                <Link to="/adminpage">Admin Page</Link>
              </>
            )} 
            {authState.status && (
              <>
              <Link to="/managementpage">Management Page</Link>
              <Link to="/messagepage">Messages</Link>
              </>
            )}
            <div className="loggedInContainer">
              {authState.status && <button onClick={logout}><Link to="/homepage">Logout</Link></button>}
            </div> 
          </div>
          <Routes>
            <Route path="/" element={<WelcomePage />}/>
            <Route path="/homepage" element={<Home />}/>
            <Route path="/pendingpage" element={<PendingPage />}/>
            <Route path="/adminpage" element={<AdminPage />}/>
            <Route path="/createpost" element={<CreatePost />}/>
            <Route path="/post/:id" element={<Post />}/>
            <Route path="/info/:id" element={<InfoPage />}/>
            <Route path="/registration" element={<Registration />}/>
            <Route path="/login" element={<Login />}/>
            <Route path="/managementpage" element={<ManagementPage />}/>
            <Route path="/messagepage" element={<MessagePage />}/>
            <Route path="/inboxpage" element={<InboxPage />}/>
            <Route path="/sentpage" element={<SentPage />}/>
          </Routes>
        </BrowserRouter>
      </AuthContext.Provider>
    </div>
  );
}

export default App;
