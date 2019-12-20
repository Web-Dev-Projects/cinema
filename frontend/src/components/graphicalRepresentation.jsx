import React, { Component } from "react";
import { useParams } from 'react-router-dom';

import {getScreen} from '../dataProvider.js';

export class GraphicalRepresentation extends Component {

    index = 1;

    state={
        AllSeats: [],
        reservedSeats: [],
        rows: 15, 
        cols: 15, 
        Myseats: []

    }
    makeSeats= () =>
    {
        // create arrays columns and rows
        let AllSeats = this.state.AllSeats

        /* Sockets */
        //----- max number of rows and columns of screen-------//
        let rows = this.state.rows
        let cols = this.state.cols
        //------------socket 3 from db---(users seats)---------//
        let reservedSeats = this.state.reservedSeats//[{ row: 1, col: 1 }, { row: 1, col: 5 }, { row: 4, col: 4 }];

        for (let i = 0; i < rows; i++) {
            AllSeats.push(new Array(cols).fill('btn-primary'));
        }


        //--------------2.setting our reserved seats-------------//
        for (let i = 0; i < reservedSeats.length; i++) {
            let resrvedRow = reservedSeats[i].row
            let resrvedCol = reservedSeats[i].col
            console.log(resrvedRow)

            console.log(resrvedCol)
            AllSeats[resrvedRow - 1][resrvedCol - 1] = 'btn-danger';

            console.log(AllSeats)
        }

        this.setState(
            {
                AllSeats: AllSeats,
                // reserved seats recieved from db
                reservedSeats: reservedSeats,
                rows: rows, // socket1 from db
                cols: cols,  // socket2 from db
            }
        )
    
    }
    // when user clicks a button we take his col and row info and reserve it in database
    Reserve(e, colIndex, RowIndex) {

    //1.---------------Check Clicked seat validation----------------//
        this.index = 1;

        let AllSeats= this.state.AllSeats;

        let Myseats = this.state.Myseats    ;    
        //1.1---------check if reserved before-------//
        if(this.state.reservedSeats.find(seat => (seat.row === RowIndex && seat.col === colIndex))){
            alert('It is reserved select anothe seact')
            return true;
        }


        //1.2---------check if seat exists in my reservation----if yes change color to primary 
        //--------------------and delete element from reservation--------------------//
        if(  Myseats.find(seat => (seat.row === RowIndex && seat.col === colIndex))){
            console.log('alreaady exists so change color to primary');
            AllSeats[RowIndex-1][colIndex-1] = 'btn-primary';
            //----Note when you delete an object do this vars can not do the job :D-----//
            let indexOfSeat = Myseats.indexOf(Myseats.find(seat =>
                 (seat.row === RowIndex && seat.col === colIndex)));

            Myseats.splice(indexOfSeat,1);
            this.setState({
                AllSeats : AllSeats
            });
            return true;
        } else {
            //---------------- seat is new to be inserted ----------------//



            Myseats.push({col : colIndex, row : RowIndex});
            AllSeats[RowIndex-1][colIndex-1] = 'btn-dark';

            //--------Allow max 5 to be booked---------//
            //----We remove the first added element-------//
 
            this.setState({
                AllSeats : AllSeats,
                Myseats : Myseats
            });
            console.log(colIndex, RowIndex)
            console.log('MySeats', this.state.Myseats)
            return true;
        }

    }

    componentDidMount ()
    {
        this.getScreenSize()
    }

    //-----------TODO---------//
    SubmitReservation(e){

    }


    render() {

        return (
            <div className='container mt-5'>
                <div className='row'>
                    <div className='col-md-6'>
                        <h4 className='badge badge-info p-2 col-md-4'>Selected seats: {this.state.Myseats.length}</h4>
                    </div>

                </div>
                <div className='row'>
                    <div className='col-md-12'>
                        <table className="table">
                            <thead></thead>
                            {/* -----convert each array element into ------- */}
                            {/* ----------map throw each element in 2d array we created--------*/}
                            <tbody>
                                {this.state.AllSeats.map((row, RowIndex) => {
                                    return (<tr key={RowIndex}>
                                        {row.map((col, ColIndex) =>
                                            // storing our seatNumber With indxes I don not understand binding
                                            <td key={ColIndex}><button onClick={(e) =>
                                                this.Reserve(e, ColIndex + 1, RowIndex + 1)}
                                                /* ------check if our seat is reserved or not----- */
                                                /* ----------TODO convert bt-danger && btn-primary into variable string */
                                                className={"btn  btn-block " + this.state.AllSeats[RowIndex][ColIndex]} 
                                                 value={this.index}>
                                                {this.index++}</button></td>
                                        )}
                                    </tr>);
                                }
                                )}
                            </tbody>

                        </table>
                        <div className='text-center mb-5'>
                            <button className='btn btn-success btn-lg' onClick={ (e) => this.SubmitReservation(e)}>Get your ticket</button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    getScreenSize = ()=>
    {
        let { screenId, movieId, screenTimeId } =this.props.match.params;

        console.log(screenId, movieId, screenTimeId)

        const Success = (response) =>
        {
            console.log(response.data[0])
            this.setState(
                {
                    rows:response.data[0].rows,
                    cols: response.data[0].columns,

                })
            this.makeSeats()
        }
        getScreen(screenId, Success)



    }
}


export default GraphicalRepresentation;

