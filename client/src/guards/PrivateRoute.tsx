import React, { Component } from 'react'
import { AuthContext } from '../contexts/AuthStore';
import { Redirect, Route } from 'react-router-dom';

// type IProps = {
//   component: any,
//   rest?: any,
//   exact?: boolean,
//   path?: string,
//   props?: Object
// }


const PrivateRoute = ({ component, ...rest }: any): any => {
  return (
    <AuthContext.Consumer>
      { value => (
        <Route {...rest} render={(props) => {
          if ( value.isAuthenticated ) {
            return (<Component {...props} />);
          }
          return <Redirect to="/" />;
        }} />
      )}
    </AuthContext.Consumer>
  );
}

export default PrivateRoute;