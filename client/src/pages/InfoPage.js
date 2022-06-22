import React, {useEffect, useState} from 'react';
import {useParams} from "react-router-dom";
import axios from "axios";

function InfoPage() {
    let{ id } = useParams();
    const [listOfInfo, setListOfInfo] = useState([]);   

    useEffect(() => {
        axios.get(`http://localhost:3001/admin/${id}`).then((response) => {
            setListOfInfo(response.data);
        });
    }, [id]);

    const confirm = (id) => {
      let confirmation = "confirmed";
      axios.put("http://localhost:3001/auth/confirm", {confirmation: confirmation, id: id}, { 
          headers: {accessToken: localStorage.getItem("accessToken")},
      },
      );
      setListOfInfo({...listOfInfo, confirmation: confirmation});
    }

    return (
      <div className="loginContainer">
        <h3>Username:</h3>
        {listOfInfo.username}
        <h3>Name:</h3>
        {listOfInfo.name}
        <h3>Surname:</h3>
        {listOfInfo.surname}
        <h3>Email:</h3>
        {listOfInfo.email}
        <h3>Phone Number:</h3>
        {listOfInfo.phone_number}
        <h3>Address:</h3>
        {listOfInfo.address}
        <h3>City:</h3>
        {listOfInfo.city}
        <h3>Country:</h3>
        {listOfInfo.country}
        <h3>Postal Code:</h3>
        {listOfInfo.postal_code}
        <h3>Tax Identification Number:</h3>
        {listOfInfo.afm}
        <h3>confirmation:
        <button onClick={() => {confirm(listOfInfo.id)}}>{listOfInfo.confirmation}</button>
        </h3>
      </div>
      
      
      );
}

export default InfoPage;