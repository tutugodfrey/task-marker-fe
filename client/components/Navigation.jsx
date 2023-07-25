import React, { Fragment } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import{ ROUTES } from '../constants/index.js';

const { 
  BASE_ROUTE,
  SIGN_UP,
  SIGN_IN,
  DASHBOARD,
  PROFILE
} = ROUTES;

const Navigation = () => {
  const navigate = useNavigate();
  const logout = () => {
    localStorage.clear();
    return navigate(SIGN_IN)
  }

  const isLoggedIn = !!localStorage.getItem('token')
  return (
    <div id="nav-bar">
      {isLoggedIn ? (
        <Fragment>
          <div id="home">
            <Link to={BASE_ROUTE}>Home</Link>
          </div>
          <div id="dashboard">
            <Link to={DASHBOARD}>Tasks</Link>
          </div>
          <div id="profile">
            <Link to={PROFILE}>Profile</Link>
          </div>
          <div id="logout">
            <a onClick={logout}>Log Out</a>
          </div>
        </Fragment>
      ) : (
        <Fragment>
          <div id="signin"><Link to={SIGN_IN}>Sign In</Link></div>
          <div id="signup"><Link to={SIGN_UP}>Sign Up</Link></div>
        </Fragment>
      )}
    </div>
  );
}

export default Navigation;
