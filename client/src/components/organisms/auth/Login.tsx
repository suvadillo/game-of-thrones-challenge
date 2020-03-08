import React, { useState, FormEvent, useEffect } from 'react';
import { Redirect } from 'react-router-dom';
import authService from '../../../services/auth-service';
import { withAuthConsumer } from '../../../contexts/AuthStore';

interface User {
  username: string,
  password: string
}

const Login: React.SFC = (props: any): JSX.Element => {

  const [userData, setUserData] = useState<User>({
    username:"",
    password: ""
  });

  const [errorText, setErrorText] = useState<string>('');

  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  const clearError = () => setErrorText('');  

  const writeError = (msg: string) => setErrorText(msg);

  const submitLogin = (event: FormEvent<HTMLFormElement>): void => {
    event.preventDefault();
    const { username, password } = userData;
    if (!username) {
      writeError('Username is required');
      return;
    }
    if (!password) {
      writeError('Password is required');
      return;
    }
    authService.login(username, password)
    .then(user => {
      setIsAuthenticated(true);
      props.onUserChanged(user);
      clearError();
    })
    .catch( e => {
      setErrorText(e.response.data.message);
    })
  }

  const handleChange = (event: FormEvent<HTMLInputElement>): void => {
    const { name, value } = event.currentTarget;
    setUserData( (prevState: User): User => {
      return ({
        ...prevState,
        [name]: value        
      })
    })
  }

  useEffect( () => {
    return () => {
      setIsAuthenticated(false);
      setUserData({ username:"", password: "" })
      clearError();
    };
  }, [] );

  if (isAuthenticated) {
    return (<Redirect to="/all-resources" />)
  }

  return(
    <div className="auth-container">
      <section>
        <div className="auth-form-container">
          <form onSubmit={submitLogin}>
            <input type="text" onFocus={clearError}
              name="username" placeholder="Username" value={userData.username} onChange={handleChange}/>
            <input type="password" onFocus={clearError}
              name="password" placeholder="Password" value={userData.password} onChange={handleChange}/>
            <button type="submit">Login</button>
          </form>
          <div ><p className={errorText ? 'is-visible' : 'is-hide'}>{errorText}</p></div>
        </div>
      </section>
    </div>
  )
}

export default withAuthConsumer(Login);