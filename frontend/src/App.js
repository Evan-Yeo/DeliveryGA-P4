import React, { Component} from 'react';
import {
  Switch,
  BrowserRouter as Router,
  Route,
  Redirect,
} from "react-router-dom";
import logo from './logo.svg';
import './App.css';
import Home from './component/Home';
import Navigation from './component/Navigation';
import PrivateRoute from "./component/PrivateRoute";
import Register from "./component/auth/Register";
import Login from "./component/auth/Login";
import { Alert } from "react-bootstrap";

class App extends Component {

  state = {
    errorMessage: null,
    isAuth: false,
    user: null,
  };

  logout() {

  }

  render() {
    let { isAuth, user, errorMessage } = this.state;
    return (
      <Router>
        <Navigation user={user} logout={this.logout} />
        {errorMessage && <Alert className="error-message">{errorMessage}</Alert>}
        <Switch>
          <PrivateRoute exact path="/" isAuth={isAuth} component={Home} />
          <Route
            path="/register"
            exact
            render={() => <Register />}
          />
          <Route
            path="/login"
            exact
            render={() =>
              isAuth ? <Redirect to="/" /> : <Login />
            }
          />
        </Switch>
      </Router>
    );
  }
}

export default App;
