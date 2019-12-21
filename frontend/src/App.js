import React from "react";
import LogIn from "./components/LogIn";
import Register from "./components/Register";
import jwt from "jsonwebtoken";

import Main from "./components/Main";

import Navigation from "./components/Navigation";

import Graph from "./components/graphicalRepresentation";

import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

import { userContext } from "./userContext";

class App extends React.Component {
    constructor(props) {
        super(props);
        let userData = jwt.decode(localStorage.getItem("accessToken"));
        this.state = {
            user: {
                name: userData ? userData.username : "",
                password: userData ? userData.password : "",
                admin: userData ? userData.isadmin : false
            }
        };
        this.setUser = this.setUser.bind(this);
    }

    componentDidMount() {
        // get and set currently logged in user to state
    }

    // Add a logout method
    setUser(name, password, admin, response = undefined) {
        this.setState({
            user: { name: name, password: password, admin: admin }
        });
        localStorage.setItem("accessToken", response?.data.accessToken);
        console.log("hhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhh");
    }

    render() {
        const value = {
            user: this.state.user,
            setUser: this.setUser
        };

        return (
            // Pass user state as value to context.Provider so it can be consumed by context.Consumer
            <userContext.Provider value={value}>
                <Router>
                    <div>
                        <header>
                            <Navigation></Navigation>
                        </header>
                        <Switch>
                            <Route exact path="/login">
                                <LogIn />
                            </Route>
                            <Route
                                exact
                                path="/screen/:screenId/:movieId/:screenTimeId"
                                component={Graph}
                            />
                            <Route exact path="/register">
                                <Register />
                            </Route>
                            <Route exact path="/*">
                                <Main />
                            </Route>
                        </Switch>
                    </div>
                </Router>
            </userContext.Provider>
        );
    }
}

export default App;
