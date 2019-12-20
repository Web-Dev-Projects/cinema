import axios from 'axios';

const url = 'http://localhost:8000/api/'

function logInRequest(userName, password,success)
{
    console.log(url + "users/signin")
    axios.post(url+"users/signin", {
        username: userName,
        password: password,
    })
        .then(success)
        .catch(function (error) {
            console.log(error);
        });
    


}


function signUpRequest(userName, lastName, firstName, password, email, date,success) {
    console.log()
    axios.post(url + "users/signup", {
        username: userName,
        lastname: lastName,
        firstname: firstName,
        password: password,
        email: email,
        birthdate: date,
    })
        .then(success)
        .catch(function (error) {
            console.log(error);
        });
}


function getAllMoviesRequest( success) {
    console.log(url + "movies/")
    axios.get(url + "movies/")
        .then(success)
        .catch(function (error) {
            console.log(error);
        });

}

function getScreen(screenId,success) {
    console.log(url + "screens/"+screenId)
    axios.get(url + "screens/"+screenId)
        .then(success)
        .catch(function (error) {
            console.log(error);
        });



}

function addMovieRequest(name,genre,screen,length,success) {
    console.log(url + "movies/")
    axios.post(url + "movies/", {
        name: name,
        genre: genre,
        screen: screen,
        length: length,
    })
        .then(success)
        .catch(function (error) {
            console.log(error);
        });



}

function addScreening(movieId, screenTime,success) {
    console.log(url + "movies/screenings/" + movieId, screenTime)
    axios.put(url + "movies/screenings/" + movieId, {
        screengingtime: screenTime,
    })
        .then(success)
        .catch(function (error) {
            console.log(error);
        });



}


export { logInRequest, signUpRequest, getAllMoviesRequest, addMovieRequest, addScreening, getScreen };