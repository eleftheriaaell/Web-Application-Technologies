import React, {useEffect,useState} from 'react';
import {Formik, Form, Field, ErrorMessage} from 'formik';
import * as Yup from 'yup';
import axios from "axios";
import {useNavigate} from "react-router-dom";

function CreatePost() {
    const [records, setrecords] = useState([]);
    const [photo, setPhoto] = useState("");
    
    const initialValues = {
        Name: "",
        Buy_Price: "",
        First_Bid: "",
        Number_of_Bids: "",
        Location: "",
        Country: "",
        Started: "",
        Ends: "",
        Seller: "",
        Rating_Seller: "",
        Description: "",
    };

    const uploadImage = async (e) => {                          
        const file = e.target.files[0];
        const base64 = await convertBase64(file);
        setPhoto(base64);
      };
    
      const convertBase64 = (file) => {                          
        return new Promise((resolve, reject) => {
          const fileReader = new FileReader();
          fileReader.readAsDataURL(file);
    
          fileReader.onload = () => {
            resolve(fileReader.result);
          };
    
          fileReader.onerror = (error) => {
            reject(error);
          };
        });
      };

    let navigate = useNavigate();

    useEffect(() => {
        if(!localStorage.getItem("accessToken")){
            navigate("/login");
        }
        axios.get("http://localhost:3001/posts/last").then((response) => {
            setrecords(response.data);
        });
    }, [navigate]);

    const validationSchema = Yup.object().shape({
        Name: Yup.string().required(),
        Buy_Price: Yup.string().required(),
        First_Bid: Yup.string().required(),
        Started: Yup.string().required(),
        Ends: Yup.string().required(),
        Description: Yup.string().required(),
    });
    
    const onSubmit = (data) => {
        const selected = document.querySelectorAll('#category option:checked');
        const values = Array.from(selected).map(el => el.value);
        axios.post("http://localhost:3001/posts", {data, photo}, {headers: {accessToken: localStorage.getItem("accessToken")},
        }).then(() => {
           
            let i = records.length;
            alert(i)
            let id = 1;
            if(i !== 0){
                id = records[i-1].id + 1;
            }
          
            values.forEach(element => {
                axios.post("http://localhost:3001/category", {Category_name: element, PostId: id,},
                     {headers: {accessToken: localStorage.getItem("accessToken")},});
            });

        }); 
        
        navigate("/managementpage");
    };


    return (
        <div className="createPostPage">
            <Formik 
                initialValues={initialValues} 
                onSubmit={onSubmit} 
                validationSchema={validationSchema}>
                <Form className="formContainer">
                    <label>Name: </label>
                    <ErrorMessage name="Name" component="span" />
                    <Field
                        autoComplete="off"
                        id="inputCreatePost"
                        name="Name"
                        placeholder="(Ex. Name...)"
                    />
                    <label>Category: </label>
                    <select id="category" multiple="multiple">
                        <option value="denim">Denim</option>
                        <option value="shoes">Shoes</option>
                        <option value="makeup">Make Up</option>
                    </select>
                    <label>Buy_Price:</label>
                    <ErrorMessage name="Buy_Price" component="span" />
                    <Field
                        autoComplete="off"
                        id="inputCreatePost"
                        name="Buy_Price"
                        placeholder="(Ex. $500...)"
                    />
                    <label>First_Bid:</label>
                    <ErrorMessage name="First_Bid" component="span" />
                    <Field
                        autoComplete="off"
                        id="inputCreatePost"
                        name="First_Bid"
                        placeholder="(Ex. $20...)"
                    />
                    <label>Location:</label>
                    <ErrorMessage name="Location" component="span" />
                    <Field
                        autoComplete="off"
                        id="inputCreatePost"
                        name="Location"
                        placeholder="(Ex. Athens...)"
                    />
                    <label>Country:</label>
                    <ErrorMessage name="Country" component="span" />
                    <Field
                        autoComplete="off"
                        id="inputCreatePost"
                        name="Country"
                        placeholder="(Ex. Greece...)"
                    />
                    <label>Started:</label>
                    <ErrorMessage name="Started" component="span" />
                    <Field
                        autoComplete="off"
                        id="inputCreatePost"
                        type="datetime-local"
                        name="Started"
                        placeholder="(Ex. 10:00pm...)"
                    />
                    <label>Ends:</label>
                    <ErrorMessage name="Ends" component="span" />
                    <Field
                        autoComplete="off"
                        id="inputCreatePost"
                        type="datetime-local"
                        name="Ends"
                        placeholder="(Ex. 12:00pm...)"
                    />
                    <label>Description:</label>
                    <ErrorMessage name="Description" component="span" />
                    <Field
                        autoComplete="off"
                        id="inputCreatePost"
                        name="Description"
                        placeholder="(Ex. A whole red apple...)"
                    />
                    <input type="file" onChange={(e) => {uploadImage(e)}} />
                    <button type="submit">Submit Post</button>
                </Form>
            </Formik>
        </div>
    );
}

export default CreatePost
