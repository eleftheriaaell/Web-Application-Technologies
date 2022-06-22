import React, {useEffect, useState, useContext, useRef} from 'react';
import {useParams, useNavigate} from "react-router-dom";
import axios from "axios";
import {AuthContext} from "../helpers/AuthContext";
import {Formik, Form, Field, ErrorMessage} from 'formik';
import * as Yup from 'yup';

import mapboxgl from '!mapbox-gl'; // eslint-disable-line import/no-webpack-loader-syntax

mapboxgl.accessToken = "pk.eyJ1Ijoic3R5bGlhbm9zMTIzNCIsImEiOiJjbDN6emV1c3cwNHZ6M2tyMm1pb2Qzd3FlIn0.A47pvLKgjwILC1XTvCwckA";

function Post() {
    let{ id } = useParams();
    const [postObject, setPostObject] = useState({});
    const [bids, setBids] = useState([]);
    const [listOfCategories, setListOfCategories] = useState([]);
    const {authState} = useContext(AuthContext); 
    
    const initialValues = {
        Location: "",
        Country: "",
        Amount: "",
    };

    const mapContainer = useRef(null);
    const map = useRef(null);
    const [lng, setLng] = useState(23.727539);
    const [lat, setLat] = useState(37.983810);
    const [zoom, setZoom] = useState(8);

    let navigate = useNavigate();

    useEffect(() => {
        axios.get(`http://localhost:3001/posts/byId/${id}`).then((response) => {
            setPostObject(response.data);
        });

        axios.get(`http://localhost:3001/bids/${id}`).then((response) => {
            setBids(response.data);
        });
       
        axios.get(`http://localhost:3001/category/${id}`).then((response) => {
            setListOfCategories(response.data);
        });

        if (map.current) return; 
            map.current = new mapboxgl.Map({
            container: mapContainer.current,
            style: 'mapbox://styles/mapbox/streets-v11',
            center: [lng, lat],
            zoom: zoom
        });

        if (!map.current) return; 
        map.current.on('move', () => {
            setLng(map.current.getCenter().lng.toFixed(4));
            setLat(map.current.getCenter().lat.toFixed(4));
            setZoom(map.current.getZoom().toFixed(2));
        });
       
    }, [id]);

    const validationSchema = Yup.object().shape({
        Location: Yup.string().required(),
        Country: Yup.string().required(),
        Amount: Yup.string().required(),
    });
  
    const onSubmit = (data) => {
        let current = new Date();
        let start = new Date(String(postObject.Started));
        let end = new Date(String(postObject.Ends));
        
        let amount = Number(data.Amount);
        let currently = Number(postObject.Currently);

        let conf = prompt("Are you sure you want to bid? (Yes/No):");
        if(conf === "Yes"){
            if( amount > currently){
                if((current.getTime() > start.getTime())){
                    if((current.getTime() < end.getTime())){
                        axios.post("http://localhost:3001/bids", {data, Time: current, PostId: id},{ headers: {accessToken: localStorage.getItem("accessToken"),},})
                        .then((response) => {
                            
                            if(response.data.error){
                                console.log(response.data.error)
                            }else{
                                const bidsToAdd = {Amount: data.Amount, Location: data.Location, Country: data.Country, Time: response.data.Time, Rating_Bidder: response.data.Rating_Bidder, Bidder: response.data.Bidder, PostId: id}
                                setBids([...bids, bidsToAdd]);    
                                document.getElementById("myform").reset();
                                
                                
                                const count = bids.length + 1;
                                const Number_of_Bids = String(count);
                                axios.put("http://localhost:3001/posts/count", {Number_of_Bids: Number_of_Bids, id: id}, { 
                                    headers: {accessToken: localStorage.getItem("accessToken")},},);
                                
                                let Currently = data.Amount;
                                axios.put("http://localhost:3001/posts/currently", {Currently: Currently, id: id}, { 
                                headers: {accessToken: localStorage.getItem("accessToken")},});
                                
                                let Bidded = "YES";
                                let PostId = String(id)
                                alert(Bidded)
                                axios.put("http://localhost:3001/action/bidded", {Bidded: Bidded, PostId: PostId}, { 
                                headers: {accessToken: localStorage.getItem("accessToken")},});

                                setPostObject({...postObject, Number_of_Bids: Number_of_Bids});
                                setPostObject({...postObject, Currently: Currently});
                            }
                        });
                    }else{
                        alert("You're off time limits for bidding!")
                        document.getElementById("myform").reset();
                    }
                }else{
                    alert("You're off time limits for bidding!")
                    document.getElementById("myform").reset();
                }
            }else{
                alert("You bidded less than the current highest bid!")
            }
        }
    }

    const deletePost = (id) => {
        let current = new Date();
        let start = new Date(String(postObject.Started));
        
        if(current.getTime() < start.getTime()){
            axios.delete(`http://localhost:3001/posts/${id}`, { headers: {accessToken: localStorage.getItem("accessToken")},
            }).then(() => {
                    navigate("/homepage");
                })
        }else{
            alert("You're off time limits for auction deleting!");
        }
    };

    const editPost = (option) => {
        let current = new Date();
        let start = new Date(String(postObject.Started));
        
        if(current.getTime() < start.getTime()){
            if (option === "name"){
                let newName = prompt("Enter new name:");
                axios.put("http://localhost:3001/posts/name", {newName: newName, id: id}, { 
                    headers: {accessToken: localStorage.getItem("accessToken")},
                }
            );

            setPostObject({...postObject, Name:newName});
            }
            if(option === "location"){
                let newLocation = prompt("Enter new location:");
                axios.put("http://localhost:3001/posts/location", {newLocation: newLocation, id: id}, { 
                    headers: {accessToken: localStorage.getItem("accessToken")},
                }
            );
            setPostObject({...postObject, Location:newLocation});
            }
            if(option === "country"){
                let newCountry = prompt("Enter new country:");
                axios.put("http://localhost:3001/posts/country", {newCountry: newCountry, id: id}, { 
                    headers: {accessToken: localStorage.getItem("accessToken")},
                }
            );
            setPostObject({...postObject, Country:newCountry});
            }
            if(option === "description"){
                let newDescription = prompt("Enter new description:");
                axios.put("http://localhost:3001/posts/description", {newDescription: newDescription, id: id}, { 
                    headers: {accessToken: localStorage.getItem("accessToken")},
                }
            );
            setPostObject({...postObject, Description:newDescription});
            }
            if(option === "buyprice"){
                let newBuyPrice = prompt("Enter new Buy price:");
                axios.put("http://localhost:3001/posts/buyprice", {newBuyPrice: newBuyPrice, id: id}, { 
                    headers: {accessToken: localStorage.getItem("accessToken")},
                }
            );
            setPostObject({...postObject, Buy_Price:newBuyPrice});
            }
            if(option === "firstbid"){
                let newFirstBid = prompt("Enter new First Bid:");
                axios.put("http://localhost:3001/posts/firstbid", {newFirstBidt: newFirstBid, id: id}, { 
                    headers: {accessToken: localStorage.getItem("accessToken")},
                }
            );
            setPostObject({...postObject, First_Bid:newFirstBid});
            }
            if(option === "started"){
                let newStarted = prompt("Enter new started:");
                axios.put("http://localhost:3001/posts/started", {newStarted: newStarted, id: id}, { 
                    headers: {accessToken: localStorage.getItem("accessToken")},
                }
            );
            setPostObject({...postObject, Started:newStarted});
            }
            if(option === "ends"){
                let newEnds = prompt("Enter new ends:");
                axios.put("http://localhost:3001/posts/postText", {newEnds: newEnds, id: id}, { 
                    headers: {accessToken: localStorage.getItem("accessToken")},
                }
            );
            setPostObject({...postObject, Ends:newEnds});
            }
        }else{
            alert("You're off time limits for auction editing!");
        }
    }

    return (
        <div className="postPage">
            <div className='leftSide'>
                <div className='post' id='individual'>

                    <div className='title'
                    onClick={() => {
                        if(authState.username === postObject.Seller){
                            editPost("name");
                        }
                    }}>{postObject.Name}</div>

                    { postObject.Photo &&
                    <div className='body'>
                    <img
                        className="profilePic"
                            src={postObject.Photo}
                            alt={""}
                            width="200"
                            height="200"
                    />
                    </div>
                    }

                    <div className='body'onClick={() => {
                        if(authState.username === postObject.Seller){
                            editPost("location");
                        }
                        }}>Location: {postObject.Location}</div>
                    
                    <div className='body'onClick={() => {
                        if(authState.username === postObject.Seller){
                            editPost("country");
                        }
                        }}>Country: {postObject.Country}</div>
                    
                    <div className='body'onClick={() => {
                        if(authState.username === postObject.Seller){
                            editPost("description");
                        }
                        }}>Description: {postObject.Description}</div> 

                    <div className='body'>Currently: {postObject.Currently}</div> 

                        <div className='body'>Categories:</div>
                        <div>
                            {listOfCategories.map((value, key) =>{
                                return(
                                    <ul>
                                    <li className='body'>{value.Category_name}</li>
                                    </ul>
                                );
                            })}
                        </div>
                    
                    <div className='body'onClick={() => {
                        if(authState.username === postObject.Seller){
                            editPost("buyprice");
                        }
                        }}>Buy_Price: {postObject.Buy_Price}</div>
                    
                    <div className='body'onClick={() => {
                        if(authState.username === postObject.Seller){
                            editPost("firstbid");
                        }
                        }}>First_Bid: {postObject.First_Bid}</div>
                    
                    <div className='body'>Number_of_Bids: {postObject.Number_of_Bids}</div>
                    
                    <div className='body'onClick={() => {
                        if(authState.username === postObject.Seller){
                            editPost("started");
                        }
                        }}>Started: {postObject.Started}</div>
                    
                    <div className='body'onClick={() => {
                        if(authState.username === postObject.Seller){
                            editPost("ends");
                        }
                        }}>Ends: {postObject.Ends}</div>
                        
                    <div className='footer'>{postObject.Seller}{" "}{postObject.Rating_Seller} 
                    <div className='buttons'>
                    {authState.username === postObject.Seller && <button onClick={() => deletePost(postObject.id)}>Delete Post</button>}
                    </div>
                    </div>
                </div>
                <div>
                Longitude: {lng} | Latitude: {lat} | Zoom: {zoom}
                </div>
                <div ref={mapContainer} className="map-container"/>
            </div>
             <div className='rightSide'>
             <div className='addComment'>
                <Formik 
                initialValues={initialValues} 
                onSubmit={onSubmit} 
                validationSchema={validationSchema}>
                <Form  id="myform" className="addCommentContainer">
                    <label>Location: </label>
                    <ErrorMessage name="Location" component="span" />
                    <Field
                        autoComplete="off"
                        id="inputCreatePost"
                        name="Location"
                        placeholder="(Ex. New York...)"
                    />
                    <label>Country:</label>
                    <ErrorMessage name="Country" component="span" />
                    <Field
                        autoComplete="off"
                        id="inputCreatePost"
                        name="Country"
                        placeholder="(Ex. USA...)"
                    />
                    <label>Amount:</label>
                    <ErrorMessage name="Amount" component="span" />
                    <Field
                        autoComplete="off"
                        id="inputCreatePost"
                        name="Amount"
                        placeholder="(Ex. $20...)"
                    />
                    <button type="submit">Submit Offer</button>
                </Form>
            </Formik>
            </div> 
                <div className='listOfComments'>
                    <div className='formContainerComment'><h2>BIDS</h2></div>
                    {bids.map((value) =>{
                    return(
                    <div className='formContainerComment'>
                        <div><h4>Amount: {value.Amount}</h4></div>
                        <div>Location: {value.Location}</div>
                        <div>Country: {value.Country}</div>
                        <div>Time: {value.Time}</div>
                        <div>Rating_Bidder: {value.Rating_Bidder}</div>
                        <div><h4>Bidder: {value.Bidder}</h4></div>
                    </div>
                    );        
                })}    
                </div>
            </div> 
        </div>
    );
}

export default Post;