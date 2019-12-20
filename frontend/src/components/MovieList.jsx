import React, { Component } from 'react';
import MovieCard from './MovieCard'

import { userContext } from '../userContext';







class MovieList extends Component {

 

    render() {
        const movies=this.props.movies;

        console.log("movies",movies)
        
        return (
            <userContext.Consumer>
                {({ user, setUser }) => {
                    if (typeof  movies ==="undefined")
                    {
                        return <h1>No movies</h1>
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
                                            admin={user.admin} />
                                    </div>
                                        )
                            }
                            {
                                
                            }
                            </div>
        );}}
        </userContext.Consumer>
        );
        }

}
export default MovieList;
