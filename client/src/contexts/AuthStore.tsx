import React, { Component } from 'react'

const CURRENT_USER_KEY = 'current-user';

type User = {
  username: string,
  password?: string
}

type AuthContextProps = {
  user: User,
  onUserChanged: Function,
  isAuthenticated: Function
}

const AuthContext = React.createContext<Partial<AuthContextProps>>({});

class AuthStore extends Component {

  state = {
    user: JSON.parse(localStorage.getItem(CURRENT_USER_KEY) || '{}')
  }

  handleUserChange = (user: User): void => {
    this.setState({ user: user });
    if (user && user.username) {
      localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(CURRENT_USER_KEY)
    }
  }

  isAuthenticated = (): boolean => {
    return this.state.user && this.state.user.username;
  }

  render() {
    return (
      <AuthContext.Provider value={{
        user: this.state.user,
        onUserChanged: this.handleUserChange,
        isAuthenticated: this.isAuthenticated
      }}>
        {this.props.children}
      </AuthContext.Provider>
    );
  }
}

const withAuthConsumer = (Component: React.ElementType) => {
  return (props: Object) => (
    <AuthContext.Consumer>
      {(storeProps: Object) => <Component {...props} {...storeProps} />}
    </AuthContext.Consumer>
  )
}

export { AuthContext, AuthStore, withAuthConsumer }