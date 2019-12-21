import React, { Component } from "react";
import { Nav, Navbar, NavDropdown, Button } from "react-bootstrap";
import { userContext } from "../userContext";
import { withRouter } from "react-router-dom";
import createBrowserHistory from "history/createBrowserHistory";

class Navigation extends Component {
    render() {
        return (
            <userContext.Consumer>
                {({ user, setUser }) => {
                    return (
                        <Navbar bg="light" expand="lg">
                            <Navbar.Brand href="#home">Cinema</Navbar.Brand>
                            <Navbar.Toggle aria-controls="basic-navbar-nav" />
                            <Navbar.Collapse id="basic-navbar-nav">
                                <Nav className="mr-auto">
                                    <Nav.Link href="/">Home</Nav.Link>
                                    <NavDropdown
                                        title="Dropdown"
                                        id="basic-nav-dropdown"
                                    >
                                        <NavDropdown.Item href="#action/3.1">
                                            Action
                                        </NavDropdown.Item>
                                        <NavDropdown.Item href="#action/3.2">
                                            Another action
                                        </NavDropdown.Item>
                                        <NavDropdown.Item href="#action/3.3">
                                            Something
                                        </NavDropdown.Item>
                                        <NavDropdown.Divider />
                                        <NavDropdown.Item href="#action/3.4">
                                            Separated link
                                        </NavDropdown.Item>
                                    </NavDropdown>
                                </Nav>
                            </Navbar.Collapse>
                            {user.name && (
                                <Button
                                    bsStyle="primary"
                                    onClick={e => {
                                        this.logOut(user);
                                    }}
                                >
                                    LogOut
                                </Button>
                            )}
                        </Navbar>
                    );
                }}
            </userContext.Consumer>
        );
    }

    logOut(user) {
        user.name = "";
        localStorage.removeItem("accessToken");
        createBrowserHistory({ forceRefresh: true }).push("/home");
    }
}
export default Navigation;
