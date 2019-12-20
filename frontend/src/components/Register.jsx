import React, { Component } from 'react';
import { Form,Col,Button } from 'react-bootstrap'
import { Redirect } from 'react-router-dom';
import { userContext } from '../userContext';

import { Formik } from 'formik';
import * as yup from 'yup';


import { signUpRequest } from './../dataProvider'



const schema = yup.object({
    firstName: yup.string().required(),
    lastName: yup.string().required(),
    userName: yup.string().required(),
    email: yup.string().email("Invalid email").required(),
    password: yup.string().required(),
    date: yup.string().required(),

    
});




class Register extends Component {
    state = {
        logedIn: false,
    }


    render() {


        return (
            <userContext.Consumer>
                {({ user, setUser }) => {
                    if (this.state.logedIn) {
                        return (
                            <div>
                                <Redirect to="/movies" />
                            </div>
                        )

                    }
                    return (
                            <Formik
                                validationSchema={schema}
                                onSubmit={(data) => this.submitRegister(data,setUser)}
                                initialValues={
                                    {
                                    firstName: '',
                                    lastName: '',
                                    userName:"",
                                    email:"",
                                    password:"",
                                    date:""
                                    }
                                    }
                                >
                            {({
                                handleSubmit,
                                handleChange,
                                handleBlur,
                                values,
                                touched,
                                isValid,
                                errors,
                        }) => (
                                    <Form noValidate onSubmit={handleSubmit} className="m-5 w-50 mx-auto">
                            <Form.Row>
                                <pre>{JSON.stringify(values, null, 2)}</pre>

                                <Form.Group as={Col} controlId="formGridEmail">
                                    <Form.Label>Email</Form.Label>
                                    <Form.Control type="email" placeholder="Enter email"
                                                    name="email"
                                                    value={values.email}
                                                    onChange={handleChange}
                                                    isValid={touched.email && !errors.email} />
                                </Form.Group>

                                <Form.Group as={Col} controlId="formGridPassword">
                                    <Form.Label>Password</Form.Label>
                                    <Form.Control type="password" placeholder="Password"
                                                    name="password"
                                                    value={values.password}
                                                    onChange={handleChange}
                                                    isValid={touched.password && !errors.password} />
                                </Form.Group>
                            </Form.Row>

                            <Form.Group controlId="formGridUserName">
                                <Form.Label>User Name</Form.Label>
                                            <Form.Control 
                                                type="text"
                                                name="userName"
                                                value={values.userName}
                                                onChange={handleChange}
                                                isvalid={ touched.userName && !errors.userName }
                                                placeholder = "user Name" />
                            </Form.Group>

                            <Form.Row>
                            <Form.Group controlId="formGridFirstName">
                                <Form.Label>First Name</Form.Label>
                                <Form.Control 
                                    type="text"
                                    name="firstName"
                                    value={values.firstName}
                                    onChange={handleChange}
                                    isValid={touched.firstName && !errors.firstName}
                                placeholder=" First Name" />
                            </Form.Group>

                            <Form.Group controlId="formGridLastName">
                                <Form.Label>Last Name</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="lastName"
                                    value={values.lastName}
                                    onChange={handleChange}
                                    isValid={touched.lastName && !errors.lastName} 
                                    placeholder=" Last Name" />
                                </Form.Group>

                                <Form.Group as={Col} controlId="formGridDate">
                                    <Form.Label>Date</Form.Label>
                                    <Form.Control type="date"
                                                    name="date"
                                                    value={values.date}
                                                    onChange={handleChange}
                                                    isValid={touched.date && !errors.date}  />
                                </Form.Group>

                            </Form.Row>


                                <Button variant="primary"  type="submit">
                                Submit
                            </Button>
                        </Form>
                        )}
                    </Formik>
        );}}
        </userContext.Consumer>
        )
    }

    submitRegister(values,setUser) {

        //console.log("in dubmoit",values)
        //e.preventDefault();

        //const form = event.currentTarget;

        let {firstName,lastName,userName,password,email,date}=values

        const success = (response => {
            setUser(userName, password, false);
            this.setState({ logedIn: true })
        })
        //assume login
        const postData = () => { signUpRequest(userName, lastName, firstName, password, email, date, success) }

        postData()

    }

}
export default Register;
