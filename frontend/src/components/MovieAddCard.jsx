import React, { Component } from 'react';
import { Card, Button, Form,Col} from 'react-bootstrap';
import {  Redirect,Link } from 'react-router-dom';

import { Formik } from 'formik';
import * as yup from 'yup';

import { addMovieRequest } from './../dataProvider'


const schema = yup.object({
    movieName: yup.string().required(),
    genre: yup.string().required(),
    screen: yup.number().required(),
    length: yup.number().required(),
});




class MovieCard extends Component {
    state ={
        redirect:false
    }
    render() {
       
        if (this.state.redirct)
        {
            return <Redirect to= "/screen"/>
        }
        return (
            <Card >
                <Card.Img variant="top" src={require("../images/joker.jpg")} />
                <Card.Body>
                    <Formik
                        validationSchema={schema}
                        onSubmit={(data) => this.submitNewMovie(data)}
                        initialValues={
                            {
                                movieName: "",
                                genre: "",
                                screen:"",
                                length:""
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
                                        <Form.Group controlId="formGridMovieName">
                                            <Form.Label>Movie Name</Form.Label>
                                            <Form.Control
                                                type="text"
                                                name="movieName"
                                                value={values.movieName}
                                                onChange={handleChange}
                                                isvalid={touched.movieName && !errors.movieName}
                                                placeholder="Movie Name" />
                                        </Form.Group>

                                        <Form.Group as={Col} controlId="formGridGenre">
                                            <Form.Label>genre</Form.Label>
                                            <Form.Control type="text" placeholder="Genre"
                                                name="genre"
                                                value={values.genre}
                                                onChange={handleChange}
                                                isValid={touched.genre && !errors.genre} />
                                        </Form.Group>

                                        <Form.Group as={Col} controlId="formGridScreen">
                                            <Form.Label>screen</Form.Label>
                                            <Form.Control type="text" placeholder="screen"
                                                name="screen"
                                                value={values.screen}
                                                onChange={handleChange}
                                                isValid={touched.screen && !errors.screen} />
                                        </Form.Group>

                                        <Form.Group as={Col} controlId="formGridLength">
                                            <Form.Label>lenght</Form.Label>
                                            <Form.Control type="text" placeholder="Length"
                                                name="length"
                                                value={values.length}
                                                onChange={handleChange}
                                                isValid={touched.length && !errors.length} />
                                        </Form.Group>
                                    </Form.Row>



                                    <Button variant="primary" type="submit">
                                        Add
                            </Button>
                                </Form>
                            )}
                    </Formik>
                </Card.Body>
            </Card>
        );
    }

    screen()
    {
       this.setState({redirct:true}) ;
    }


    submitNewMovie(data) {

        let { movieName, genre,screen,length } = data


        const success = (response => {
            this.props.success()
        })

        const postData = () => { addMovieRequest(movieName, genre, screen, length , success) }

        postData()
    }

}
export default MovieCard;
