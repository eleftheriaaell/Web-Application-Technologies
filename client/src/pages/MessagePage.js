import React from 'react';
import {Formik, Form, Field, ErrorMessage} from 'formik';
import * as Yup from 'yup';
import axios from "axios";
import {useNavigate} from "react-router-dom";
import {useEffect, useState, useContext} from "react";
import {AuthContext} from "../helpers/AuthContext";


function MessagePage() {
   
    const {authState} = useContext(AuthContext); 
    const [listOfInbox, setListOfInbox] = useState([]);
    

    const initialValues = {
        message: "",
        senderName: "",
        receiverName: "",
    };

    let navigate = useNavigate();

    useEffect(() => {
        let receiverName = authState.username;
       
        axios.get(`http://localhost:3001/inbox/${receiverName}`).then((response) => {
           setListOfInbox(response.data); 
           for(let i = 0; i < listOfInbox.length; i++){
                if(listOfInbox[i].Seen === "NO"){
                    alert("You have a new message!")
                    let Seen = "YES";
                    axios.put("http://localhost:3001/inbox/notification",{Seen}, { 
                        headers: {accessToken: localStorage.getItem("accessToken")},
                    });
                }
            }
        });
     

    }, [listOfInbox]);

   
    

    const validationSchema = Yup.object().shape({
        message: Yup.string().required(),
        receiverName: Yup.string().required(),
    });
    
    const onSubmit = (data) => {
        
        let username = data.receiverName;
        axios.get(`http://localhost:3001/auth/check2/${username}`).then((response)=>{
                
                if(response.data === null){
                    alert("User doesn't exist!")
                    navigate("/messagepage")  
                }else{
                    axios.post("http://localhost:3001/sent/", data, {headers: {accessToken: localStorage.getItem("accessToken")},
                    }).then(() => {});
                
                    axios.post("http://localhost:3001/inbox/", data, {headers: {accessToken: localStorage.getItem("accessToken")},
                    }).then(() => {
                        alert("Message succesfully sent!")
                        document.getElementById("myform").reset();
                        navigate("/messagepage");
                    });
                } 
        });
        
        
    };
    
    return (
        <div className="createMessagePage">
            <div className="messageContainer">
                <button onClick={() => {navigate("/inboxpage")}}>Inbox</button>
                <button onClick={() => {navigate("/sentpage")}}>Sent</button>
            </div>
            <Formik 
                initialValues={initialValues} 
                onSubmit={onSubmit} 
                validationSchema={validationSchema}>
                <Form id="myform" className="formContainer">
                    <label>Receiver: </label>
                    <ErrorMessage name="receiverName" component="span" />
                    <Field
                        autoComplete="off"
                        id="inputCreatePost"
                        name="receiverName"
                        placeholder="(Ex. Leonard...)"
                    />
                    <label>Message: </label>
                    <ErrorMessage name="message" component="span" />
                    <Field
                        autoComplete="off"
                        id="inputCreatePost"
                        name="message"
                        placeholder="(Ex. Hello...)"
                    />
                    <button type="submit">Send Message</button>
                </Form>
            </Formik>
        </div>
        
    );
}

export default MessagePage
