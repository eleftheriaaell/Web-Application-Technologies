import React from 'react';
import axios from "axios";
import {useEffect, useState, useContext} from "react";
import {useNavigate} from "react-router-dom";
import {Formik, Form, Field} from 'formik';
import {AuthContext} from '../helpers/AuthContext';
import * as Yup from 'yup';

function Home() {
    const {authState} = useContext(AuthContext); 
    const [listOfPosts, setListOfPosts] = useState([]);
    const [listOfPosts2, setListOfPosts2] = useState([]);
    const [listOfCatSort, setListOfCatSort] = useState([]);
    const [recommendedPosts, setRecommendedPosts] = useState([]); 
    
    const initialValues = {
        Max_Price: "",
        Location: "",
        Country: "",
        Description: "",
    };
    const initialValues2 = {
        Description: "",
    };

    const validationSchema = Yup.object().shape({
        Max_Price: Yup.string().required(),
        Location: Yup.string().required(),
        Country: Yup.string().required(),
        Description: Yup.string().required(), 
       
    });

    const validationSchema2 = Yup.object().shape({
        Description: Yup.string().required(), 
       
    });
    
    let navigate = useNavigate();

    useEffect(() => {
        axios.get("http://localhost:3001/posts").then((response) => {
            setListOfPosts(response.data);
            setListOfPosts2(response.data);
        });

        axios.post("http://localhost:3001/category/sortby").then((response) => {
            setListOfCatSort(response.data);
        });
       
        toRecommend();
    }, []);

    const onSubmit = (data) => {
        const selected = document.querySelectorAll('#category option:checked');
        const values = Array.from(selected).map(el => el.value);
        let category = values[0];

        setListOfPosts([]);
        listOfCatSort.forEach(element => {
            if(element.Category_name === category){
                listOfPosts2.forEach(element2 => {
                    if((Number(element2.id) === Number(element.PostId)) && (Number(element2.Buy_Price) <= Number(data.Max_Price)) && (element2.Location === data.Location) && (element2.Country === data.Country)){
                        setListOfPosts((listOfPosts) => listOfPosts.concat(element2));
                    }
                }) 
            }  
        });
    };

   
    const Search = (data) =>{
        let array = data.Description.split(" ");

        setListOfPosts([]);
        listOfPosts2.forEach(element => {
            array.forEach(el => {
                if(element.Description.includes(el)){
                    setListOfPosts((listOfPosts) => listOfPosts.concat(element));
                    element.Description = "";
                }
            })               
        }) 
    };

    const toPost = (data) => {
        axios.post("http://localhost:3001/action", data, 
        { headers: {accessToken: localStorage.getItem("accessToken"),},});

        navigate(`/post/${data.id}`)
    }

    const toRecommend = () => {
        
        if(authState.status){
           
            axios.get("http://localhost:3001/posts/recommendations", 
            { headers: {accessToken: localStorage.getItem("accessToken"),},}).then((response) => {
                setRecommendedPosts(response.data);
            })
        }
        else{
            setRecommendedPosts([]);
        }
        
    }

    return (
        <div>
            <Formik 
                initialValues={initialValues} 
                onSubmit={onSubmit} 
                validationSchema={validationSchema}>
                <Form className="formContainerSort">
                    <label><h2>Category: </h2></label>
                    <select id="category" >
                        <option value=" "> </option>
                        <option value="denim">Denim</option>
                        <option value="shoes">Shoes</option>
                        <option value="makeup">Make Up</option>
                    </select>
                    <label><h2>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Max_Price:</h2></label>
                    <Field
                        autoComplete="off"
                        id="inputCreatePost"
                        name="Max_Price"
                        placeholder="(Ex. $1000...)"
                    />
                    <label><h2>Location:</h2></label>
                    <Field
                        autoComplete="off"
                        id="inputCreatePost"
                        name="Location"
                        placeholder="(Ex. Athens...)"
                    />
                    <label><h2>Country:</h2></label>
                    <Field
                        autoComplete="off"
                        id="inputCreatePost"
                        name="Country"
                        placeholder="(Ex. Greece...)"
                    />
                    <button type="submit">Submit</button>
                </Form>
            </Formik>
            <label><h2>Description:</h2></label>
            <Formik 
                onSubmit={Search} 
                initialValues={initialValues2} 
                validationSchema={validationSchema2}>
                <Form className="formContainerDesc">
                <Field
                        autoComplete="off"
                        id="inputCreatePost"
                        name="Description"
                        placeholder="(Ex. red sneakers...)"
                    />
                    <button type="submit">Search</button>
                </Form>
            </Formik>
      
            {listOfPosts.map((value, key) =>{
                return(
                <div className='post' key = {value.id} onClick={() => {toPost(value)}}>
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
            <div> <h2>Recomended Posts: </h2>
            {recommendedPosts.map((value, key) => {
                    return (
                    <div className='post' key = {value.id} onClick={() => {toPost(value)}}>
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
        </div>
    )
}

export default Home
