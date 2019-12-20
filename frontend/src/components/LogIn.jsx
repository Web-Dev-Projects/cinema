import React, { Component } from 'react';
import { Form, Col, Button } from 'react-bootstrap'
import { Redirect } from 'react-router-dom';
import { userContext } from '../userContext';


import { Formik } from 'formik';
import * as yup from 'yup';


import {logInRequest} from './../dataProvider'


const schema = yup.object({
    userName: yup.string().required(),
    password: yup.string().required(),
});




class LogIn extends Component {

    state = {
        logedIn: false

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
                    if (this.state.newAccount) {
                        return (
                            <div>
                                <Redirect to="/register" />
                            </div>
                        )

                    }
                    return (
                        <Formik
                            validationSchema={schema}
                            onSubmit={(data) => this.submitLogin(data, setUser)}
                            initialValues={
                                {
                                    userName: "",
                                    password: "",
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
                                            <Form.Group controlId="formGridUserName">
                                                <Form.Label>User Name</Form.Label>
                                                <Form.Control
                                                    type="text"
                                                    name="userName"
                                                    value={values.userName}
                                                    onChange={handleChange}
                                                    isvalid={touched.userName && !errors.userName}
                                                    placeholder="user Name" />
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



                                        <Button variant="primary" type="submit">
                                            Submit
                            </Button>

                                        <p className="forgot-password text-left">
                                            New <a href="#" onClick={this.makeNewAccount.bind(this)}> Account</a>
                                        </p>
                                    </Form>
                                )}
                        </Formik>
                    );
                }}
            </userContext.Consumer>
        )
    }

    makeNewAccount() {
        this.setState({ newAccount: true });
    }

    submitLogin(data, setUser) {


        let { userName, password } = data
        //assume login


        const success = (response => {
            setUser(userName, password, false);
            this.setState({ logedIn: true })
        })

        const postData = () => { logInRequest(userName, password,success) }

        postData()
       
    }
}
export default LogIn;


