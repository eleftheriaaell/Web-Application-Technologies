import React from 'react';
import axios from "axios";
import {useEffect, useState, useContext} from "react";
import {AuthContext} from "../helpers/AuthContext";

function SentPage() {
    const [listOfSent, setListOfSent] = useState([]);
    const {authState} = useContext(AuthContext); 

    useEffect(() => {
      let senderName= authState.username
      axios.get(`http://localhost:3001/sent/${senderName}`).then((response) => {
        setListOfSent(response.data);
      });
    }, []);

    const deleteMessage = (id) => {
        axios.delete(`http://localhost:3001/sent/${id}`, { headers: {accessToken: localStorage.getItem("accessToken")},
     }).then(() => {
        setListOfSent(listOfSent.filter((val) => {
            return val.id !== id;
         }))
     });
    };

    return (
        <div>
            {listOfSent.map((value, key) =>{
                return(
                <div className='message'>
                    <div className='title'><h3>To:  {value.receiverName}</h3><h3>Message:</h3><h3>{value.message}</h3></div>
                    <button onClick={() => deleteMessage(value.id)}>Delete</button>
                </div>
                );        
            })}
        </div>
    )
}

export default SentPage
