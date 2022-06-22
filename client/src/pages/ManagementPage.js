import React from 'react';
import axios from "axios";
import {useEffect, useState, useContext} from "react";
import {useNavigate} from "react-router-dom";
import {AuthContext} from "../helpers/AuthContext";

function ManagementPage() {
    const [listOfPosts, setListOfPosts] = useState([]);
    const {authState} = useContext(AuthContext); 
    
    let navigate = useNavigate();

    useEffect(() => {
      let Seller = authState.username
      
      axios.get(`http://localhost:3001/posts/manage/${Seller}`).then((response) => {
        setListOfPosts(response.data);
      });
    }, [authState]);

    return (
        <div>
            {listOfPosts.map((value, key) =>{
                return(
                <div className='post' key = {value.id} onClick={() => {navigate(`/post/${value.id}`)}}>
                    <div className='title'>{value.Name}</div>
                    <div className='body'>Location: {value.Location}</div>
                    <div className='body'>Country: {value.Country}</div>
                    <div className='body'>Start Time: {value.Started}</div>
                    <div className='body'>End Time: {value.Ends}</div>
                    <div className='body'>Current bid: {value.Currently}</div>
                    <div className='footer'>Seller: {value.Seller}</div>
                </div>
                );        
            })}
        </div>
    )
}

export default ManagementPage
