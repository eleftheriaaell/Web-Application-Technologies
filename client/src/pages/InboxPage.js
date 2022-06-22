import React from 'react';
import axios from "axios";
import {useEffect, useState, useContext} from "react";
import {AuthContext} from "../helpers/AuthContext";

function InboxPage() {
    const [listOfInbox, setListOfInbox] = useState([]);
    const {authState} = useContext(AuthContext); 

    useEffect(() => {
      let receiverName = authState.username
      axios.get(`http://localhost:3001/inbox/${receiverName}`).then((response) => {
        setListOfInbox(response.data);
      });
    }, []);

    const deleteMessage = (id) => {
        axios.delete(`http://localhost:3001/inbox/${id}`, { headers: {accessToken: localStorage.getItem("accessToken")},
     }).then(() => {
        setListOfInbox(listOfInbox.filter((val) => {
            return val.id !== id;
         }))
     });
    };

    return (
        <div>
            {listOfInbox.map((value, key) =>{
                return(
                <div className='message'>
                    <div className='title'><h3>From:  {value.senderName}</h3><h3>Message:</h3><h3>{value.message}</h3></div>
                    <button onClick={() => deleteMessage(value.id)}>Delete</button>
                </div>
                );        
            })}
        </div>
    )
}

export default InboxPage
