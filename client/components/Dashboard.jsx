import React from 'react';
import { Navigate } from 'react-router-dom';
import { observer } from 'mobx-react';
import Todo from './Todo.jsx';
import Navigation from './Navigation.jsx'
import { logout } from '../helpers/index.js';
import{ ROUTES } from '../constants/index.js';

const { SIGN_IN } = ROUTES;

const Dashboard = () => {
    const isLoggedIn = !!localStorage.getItem('token');
    return (
      <div>
        {!isLoggedIn && 
          <Navigate to={SIGN_IN} />
        }
        <Navigation logout={logout} />
        <Todo />
      </div>
    );
}

export default observer(Dashboard);
