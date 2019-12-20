import React, { Component } from 'react';
import MovieCard from './MovieCard'
import MovieAddCard from './MovieAddCard'

import { userContext } from '../userContext';







class MovieListAdmin extends Component {


    render() {
        const movies=this.props.movies;
        
        return (
            <userContext.Consumer>
                {({ user, setUser }) => {
                    if (typeof movies ==="undefined")
                    {
                        return (
                        <div className="row" >
                            <div className="col-3">
                                <MovieAddCard success={this.props.success} />
                            </div>

                        </div>
                        )
                    }
                    return (
                            <div className="row" >
                            {
                            console.log(user["name"])
                            }   
                            {
                            movies.map(movie =>
                                        <div className="col-3">
                                        <MovieCard path={'joker.jpg'} 
                                        name={movie["name"]} 
                                        id={movie["_id"]}
                                        genre={movie["genre"]}
                                        length={movie["length"]} 
                                        screenings={movie["screenings"]} 
                                        screen={movie["screen"]}
                                        admin={user.admin}
                                        success={this.props.success}/>
                                        </div>
                                        )
                            }
                            <div className="col-3">
                            <MovieAddCard success={this.props.success}/>
                            </div>

                            </div>
        );}}
        </userContext.Consumer>
        );
        }

}
export default MovieListAdmin;
