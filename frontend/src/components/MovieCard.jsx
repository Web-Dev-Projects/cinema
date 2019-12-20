
import React, { Component } from 'react';
import { Card, Button, NavDropdown,Form,Col} from 'react-bootstrap';
import {  Redirect,Link } from 'react-router-dom';

import { addScreening } from './../dataProvider'

import { Formik } from 'formik';
import * as yup from 'yup';



const schema = yup.object({
    date: yup.string().required(),
    time: yup.string().required(),

});





class MovieCard extends Component {
    state ={
        redirect:false
    }
    render() {

        let addScreening;
        let screnningList;
        if (this.props.admin)
        {
            screnningList=   
            this.props.screenings.map(time =>
                                <NavDropdown.Item as="a"> {time.screengingtime}</NavDropdown.Item>
                            )
            addScreening =
                <Formik
                    validationSchema={schema}
                onSubmit={(data) => this.addScreeningTimeToFilm(data)}
                    initialValues={
                        {
                            date: "",
                            time: "",
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
                <Form noValidate onSubmit={handleSubmit} className="m-5 w-70 mx-auto">
                            <Form.Group as={Col} controlId="formGridDate">
                                <Form.Label>Date</Form.Label>
                                <Form.Control type="date"
                                    name="date"
                                    value={values.date}
                                    onChange={handleChange}
                                    isValid={touched.date && !errors.date} >
                                    </Form.Control>
                                    
                            </Form.Group>

                            <Form.Group as={Col} controlId="formGridtime">
                                <Form.Label>Time</Form.Label>
                                <Form.Control type="time"
                                    name="time"
                                    value={values.time}
                                    onChange={handleChange}
                                    isValid={touched.time && !errors.time} >
                                </Form.Control>

                            </Form.Group>

                            <Button variant="primary" type="submit">
                                AddScreening
                            </Button>
            </Form>
                    )}
                </Formik>
        }
        else
        {
            addScreening = <React.Fragment/>
            screnningList =
                this.props.screenings.map(time =>

                <Link to={'/screen/' + this.props.screen + "/" + this.props.id + "/" + time._id} replace>
                        <NavDropdown.Item as="a"> {time.screengingtime}</NavDropdown.Item>
                    </Link>
                )
        }
       
        if (this.state.redirct)
        {
            return <Redirect to= "/screen"/>
        }
        return (
            <Card >
                <Card.Img variant="top" src={require("../images/"+this.props.path)} />
                <Card.Body>
                    <Card.Title>{this.props.name}</Card.Title>
                    <Card.Text>Genre</Card.Text>
                    <Card.Text>
                        {
                            this.props.genre
                        }
                    </Card.Text>
                    <Card.Text>screen</Card.Text>
                    <Card.Text>
                        {
                            this.props.screen
                        }
                    </Card.Text>
                    <Card.Text>Length</Card.Text>

                    <Card.Text>
                        {
                            this.props.length
                        }
                    </Card.Text>
                    <NavDropdown title="Screening" id="basic-nav-dropdown">
                        {screnningList}
                    </NavDropdown>     
                    {addScreening}           
                    </Card.Body>
            </Card>
        );
    }

    screen()
    {
       this.setState({redirct:true}) ;
    }

    addScreeningTimeToFilm = (data) =>
    {
        let { date ,time} = data

        console.log(date,time)

        let year = Number(date.slice(0, 4))
        let month = Number(date.slice(5, 7))-1
        let day = Number(date.slice(8, 10)) 
        let hour = Number(time.slice(0, 2))
        let minute = Number(time.slice(3, 5))



        const dateTime = new Date(year,month,day,hour,minute, 0, 0)

        console.log(dateTime)


        addScreening(this.props.id,dateTime,this.props.success)


        //assume login
    }

}
export default MovieCard;
