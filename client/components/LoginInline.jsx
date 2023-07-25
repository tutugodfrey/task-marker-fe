import React, { useState } from 'react';
import { observer } from 'mobx-react';
import { useNavigate } from 'react-router-dom';
import { request, closeConsole } from '../helpers/index.js';
import ConsoleModal from './ConsoleModal.jsx';
import{ ROUTES } from '../constants/index.js';
import store from '../store/index.js'

const { DASHBOARD } = ROUTES;

const LoginInline = observer(() => {
  const navigate = useNavigate()
  const [ state, setState ] = useState({
    consoleMessage: '',
    user: {
      username: '',
      password: '',
    }
  });

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
    const { user } = state;
    let allFieldPass = true;
    for(let field in user) {
      if (!user[field]) {
        allFieldPass = false;
      }
    }
    if (allFieldPass) {
      const createdUser =  await request('/users/signin', 'POST', user);
      console.log('Message', createdUser);
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
        })
        store.consoleMessage.setMessage(errorMessage);
        console.log(createdUser.message)
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

  let disableSubmit
  const { password, username } = state.user;
  const { consoleMessage } = state;
  !password || !username ? disableSubmit = true : disableSubmit = false;
  return (
    <div id="login-inline">
      { consoleMessage && <ConsoleModal resetConsole={resetConsole} /> }
      <form>
        <div id="form-group_container">
          <div className="form-group">
            <input
              type="text"
              name="username"
              value={username}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <input 
              type="password"
              name="password"
              value={password}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <input
              type="submit"
              onClick={onSignIn}
              disabled={disableSubmit}
              value="Sign In"
            />
          </div>
        </div>
      </form>
    </div>
  );
});

export default LoginInline;
