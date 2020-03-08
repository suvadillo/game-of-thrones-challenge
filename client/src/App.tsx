import React from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
import './styles/main.scss';
// import PrivateRoute from './guards/PrivateRoute';
import NavBar from './components/molecules/Navbar';
import Home from './components/pages/Home';
import Signup from './components/organisms/auth/Signup';
import Login from './components/organisms/auth/Login';
import AllResources from './components/pages/AllResources';
import DetailsItemResource from './components/atoms/DetailsItemResource';
// import SingleProject from './components/organisms/projects/SingleProject'
// import { NotFound } from './components/organisms/errors/Error';

export default function App() {
  return (
    <div className="main-container">
      <header>
        <NavBar />
      </header>
      <Switch>
        <Route exact path="/" component={Home} />
        <Route exact path="/signup" component={Signup} />
        <Route exact path="/login" component={Login} />
        <Route exact path="/all-resources" component={AllResources} />
        <Route exact path="/details/:typeResource/:id" component={DetailsItemResource}/>
        {/* <Route exact path="/not-found" component={NotFound} />*/}
        <Redirect to="/" /> 
      </Switch>
    </div>
  );
}
