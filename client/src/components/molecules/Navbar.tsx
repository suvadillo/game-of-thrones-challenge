import React, { Fragment } from 'react'
import { NavLink, withRouter } from 'react-router-dom'
import { withAuthConsumer } from '../../contexts/AuthStore';
import { authService } from '../../services';

const Navbar = (props: any): JSX.Element => {

  const handleLogout = () => {
    authService.logout()
    .then(() => {
      props.onUserChanged({})
      props.history.push('/')
    })
  }

  const goBack = () => props.history.goBack();

  const { user, isAuthenticated } = props;

  return (    
    <nav className="navbar capitalize" >
      <NavLink exact activeClassName="activeLink" to="/">
        <img src="/images/game_of_thrones01.png" alt="game of thrones logo" width="150"/>  
      </NavLink>
      <ul>
      <button onClick={goBack}><i className="fas fa-arrow-left"></i></button>
        {!isAuthenticated() &&
          <Fragment>
            <li><NavLink activeClassName="activeLink" to="/signup">Register</NavLink></li>
            <li><NavLink activeClassName="activeLink" to="/login">Login</NavLink></li>
          </Fragment>
        }
        {isAuthenticated() &&
          <Fragment>
            <li><NavLink activeClassName="activeLink" to="/all-resources">Resources</NavLink></li>
            <li><NavLink activeClassName="active" to="#">{user.username}</NavLink></li>
            <li><button className="btn btn-link nav-link" onClick={handleLogout}>Logout</button></li>
          </Fragment>
        }
      </ul>
    </nav>
  )
}

export default withRouter(withAuthConsumer(Navbar));