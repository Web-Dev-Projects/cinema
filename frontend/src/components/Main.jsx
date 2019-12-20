import React, { Component } from 'react';
import MovieCard from './MovieCard'

import { userContext } from '../userContext';

import MovieList from './MovieList'
import MovieListAdmin from './MovieListAdmin'

import { getAllMoviesRequest } from './../dataProvider'





class Main extends Component {

    state ={
        movies:[]
    };

    componentDidMount() {

        this.getAllMovies()
    }

    render() {

        return (
            <userContext.Consumer>
                {({ user, setUser }) => {
                    console.log(user.admin,"user admin")
                    if (user.admin==true)
                    {
                        return (<MovieListAdmin  movies={this.state.movies} success = {this.getAllMovies}/>)
                    }

                    return (<MovieList movies={this.state.movies} />)

                }}
            </userContext.Consumer>
        );
    }

    getAllMovies= () =>
    {
        const success = (response) => {
            console.log(response.data)
            this.setState({
                movies: response.data
            })

        }

        const getMovies = () => { getAllMoviesRequest(success) }

        getMovies()

      
  
    }

}
export default Main;
