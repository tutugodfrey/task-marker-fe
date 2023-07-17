import React, { useState } from 'react';
import { observer } from 'mobx-react';
import { useNavigate, Link } from 'react-router-dom';
import { request } from '../helpers/index.js';
import store from '../store/index.js';
import ConsoleModal from './ConsoleModal.jsx';
import{ ROUTES } from '../constants/index.js';

const { 
  SIGN_UP,
  DASHBOARD,
  BASE_ROUTE,
} = ROUTES;

const SignIn = () => {
  const navigate = useNavigate()
  const [ state, setState ] = useState({
    consoleMessage: '',
    user: {
      username: '',
      password: '',
    }
  });

  let disableSubmit;
  const { password, username } = state.user;
  const { consoleMessage } = state;
  !password || !username ? disableSubmit = true : disableSubmit = false;

  const handleChange = (event) => {
    const { name, value } = event.target;
    setState({
      ...state,
      user: {
        ...state.user,
        [name]: value
      }
    });
  }

  const onSignIn = async (event) => {
    event.preventDefault();
    let allFieldPass = true;
    for(let field in state.user) {
      if (!state.user[field]) {
        allFieldPass = false;
      }
    }

    if (allFieldPass) {
      const createdUser =  await request('/users/signin', 'POST', state.user);
      if (createdUser.message) {
        const { message } = createdUser;
        let errorMessage = message;
        if (message === 'user not found') {
          errorMessage =
            'Unsuccessful login! Please check your username and password'
        }
        setState({
          ...state,
          consoleMessage: errorMessage,
        });
        store.consoleMessage.setMessage(errorMessage);
        return null;
      }
      localStorage.setItem('token', createdUser.token);
      store.userStore.setUser(createdUser);
      navigate(DASHBOARD);
    }
  }

  const resetConsole = () => {
    setState({
      ...state,
      consoleMessage: '',
    });
  };

  return (
    <div id="signin-page">
      <div className="back-link_div">
        <Link to={BASE_ROUTE}>&laquo; Back</Link>
      </div>
      <div className="sign-in">
      { consoleMessage && <ConsoleModal resetConsole={resetConsole} /> }   
        <div>
          <h3>Sign In</h3>
        </div>
        <form>
          <div>
            <div className="form-group">
              <div><label>Username</label>
                <span className="requiredFields">*</span>
              </div>
              <input
                type="text"
                name="username"
                value={state.user.username}
                onChange={handleChange}
              />
            </div>
          </div>
          <div className="form-group">
            <div><label>Password</label>
              <span className="requiredFields">*</span>
            </div>
            <div>
              <input 
                type="password"
                name="password"
                value={state.user.password}
                onChange={handleChange}
                />
            </div>
          </div>
          <div className="form-group">
            <div>
              <input
                type="submit"
                id="submitLogin"
                onClick={onSignIn}
                disabled={disableSubmit}
                value="Sign In"
              />
            </div>
          </div>
        </form>
        <div>
          <p>I don't have an account?
            <Link to={SIGN_UP}>Sign Up</Link></p>
        </div>
      </div>
    </div>
  )
}

export default observer(SignIn);
