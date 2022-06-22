import React  from 'react';
import {Formik, Form, Field, ErrorMessage} from 'formik';
import * as Yup from 'yup';
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Registration() {
    const initialValues = {
        username: "",
        password: "",
        password_confirmation: "",
        name: "",
        surname: "",
        email: "",
        phone_number: "",
        address: "",
        city: "",
        country: "",
        postal_code: "",
        afm: "",        
    };

    const navigate = useNavigate();

    const validationSchema = Yup.object().shape({
        username: Yup.string().min(4).max(20).required(),
        password: Yup.string().min(4).max(20).required(),
        password_confirmation: Yup.string().min(4).max(20).required(),
        name: Yup.string().min(3).max(50).required(),
        surname : Yup.string().min(3).max(50).required(),
        email: Yup.string().min(3).max(50).required(),
        phone_number: Yup.string().min(3).max(50).required(),
        address: Yup.string().min(3).max(100).required(),
        city: Yup.string().min(3).max(50).required(),
        country: Yup.string().min(3).max(50).required(),
        postal_code: Yup.string().min(3).max(50).required(),
        afm: Yup.string().min(10).max(10).required(),
    });

    
    const onSubmit = (data) => {
        const user = { 
            username: data.username,
            password: data.password,
            password_confirmation: data.password_confirmation,
            name: data.name,
            surname: data.surname,
            email: data.email,
            phone_number: data.phone_number,
            address: data.address,
            city: data.city,
            country: data.country,
            postal_code: data.postal_code,
            afm: data.afm,
        }
        if(user.password !== user.password_confirmation){
            alert("Passwords don't match!");
            navigate("/registration");
        }else{
            axios.get(`http://localhost:3001/auth/check/${data.username}`).then((response)=>{
                alert(response.data)
                if(response.data === data.username){
                    alert("Username is already used! Choose  another!")
                    navigate("/registration");
                }else{
                    axios.post("http://localhost:3001/auth/", data).then(() => {
                        navigate("/pendingpage");
                    });
                }
            });
        }
    };

    return (
        <div className="RegistrationPage">
        <Formik 
                initialValues={initialValues} 
                onSubmit={onSubmit} 
                validationSchema={validationSchema}>
                <Form className="formContainerR">
                    <label>Username: </label>
                    <ErrorMessage name="username" component="span" />
                    <Field
                        autoComplete="off"
                        id="inputRegistration"
                        name="username"
                        placeholder="Ex. Sheldon123"
                    />

                    <label>Password: </label>
                    <ErrorMessage name="password" component="span" />
                    <Field
                        autoComplete="off"
                        type="password"
                        id="inputRegistration"
                        name="password"
                        placeholder="Your Password"
                    />

                    <label>Password Confirmation: </label>
                    <ErrorMessage name="password_confirmation" component="span" />
                    <Field
                        autoComplete="off"
                        type="password"
                        id="inputRegistration"
                        name="password_confirmation"
                        placeholder="Confirm Password"
                    />

                    <label>Name: </label>
                    <ErrorMessage name="name" component="span" />
                    <Field
                        autoComplete="off"
                        id="inputRegistration"
                        name="name"
                        placeholder="Ex. Sheldon"
                    />

                    <label>Surname: </label>
                    <ErrorMessage name="surname" component="span" />
                    <Field
                        autoComplete="off"
                        id="inputRegistration"
                        name="surname"
                        placeholder="Ex. Cooper"
                    />

                    <label>Email: </label>
                    <ErrorMessage name="email" component="span" />
                    <Field
                        autoComplete="off"
                        id="inputRegistration"
                        name="email"
                        placeholder="Ex. sheldoncoop@hotmail.com"
                    />

                    <label>Phone Number: </label>
                    <ErrorMessage name="phone_number" component="span" />
                    <Field
                        autoComplete="off"
                        id="inputRegistration"
                        name="phone_number"
                        placeholder="Ex. 6946222222"
                    />
                    
                    <label>Address: </label>
                    <ErrorMessage name="address" component="span" />
                    <Field
                        autoComplete="off"
                        id="inputRegistration"
                        name="address"
                        placeholder="Ex. Papagou 46, Zografou"
                    />

                    <label>City: </label>
                    <ErrorMessage name="city" component="span" />
                    <Field
                        autoComplete="off"
                        id="inputRegistration"
                        name="city"
                        placeholder="Ex. Athens"
                    />

                    <label>Country: </label>
                    <ErrorMessage name="country" component="span" />
                    <Field
                        autoComplete="off"
                        id="inputRegistration"
                        name="country"
                        placeholder="Ex. Greece"
                    />

                    <label>Postal Code: </label>
                    <ErrorMessage name="postal_code" component="span" />
                    <Field
                        autoComplete="off"
                        id="inputRegistration"
                        name="postal_code"
                        placeholder="Ex. 15772"
                    />

                    <label>Tax Identification Number: </label>
                    <ErrorMessage name="afm" component="span" />
                    <Field
                        autoComplete="off"
                        id="inputRegistration"
                        name="afm"
                        placeholder="Ex. 1702501469"
                    />
                    
                    <button type="submit">Register</button>
                </Form>
            </Formik>
        </div>
    );
}

export default Registration;
