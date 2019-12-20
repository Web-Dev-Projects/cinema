import React, { Component } from 'react';
import {  Image } from 'react-bootstrap'




class Screen extends Component {

    state = {
        reservations: [],
    }
    componentDidMount() {
        const reservations = [

            1, 0, 1,

            1, 0, 1,

            1, 0, 1,

            1, 0, 1,

            1, 0, 1,
            
            1, 0, 1,

            1, 0, 1,

            1, 0, 1,


        ];

        this.setState({
            reservations: reservations
        })
    }
    render() {
        const reservations = this.state.reservations;
        return (
            <div className="row" >
                {

                    reservations.map(movie =>
                        <div className="col-1">
                            <Image className= "m-5"src={require("../images/seat2.png")} roundedCircle />
                        </div>
                    )
                }
            </div>
        );
    }

}
export default Screen;
