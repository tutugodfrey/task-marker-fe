import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { observer } from 'mobx-react';
import store from '../store/index.js';
import ConsoleModal from './ConsoleModal.jsx';
import { request } from '../helpers/index.js';
import{ ROUTES } from '../constants/index.js';

const { 
  SIGN_IN,
  TASKS,
  BASE_ROUTE,
} = ROUTES;

const Signup = () => {
  const navigate = useNavigate()
  const [ state, setState ] = useState({
    ...state,
    consoleMessage: '',
    createdUser: {},
    user: {
      name: '',
      email: '',
      username: '',
      password: '',
      confirmPassword: ''
    },
  });
  const { consoleMessage } = state;
  store.consoleMessage.setMessage(consoleMessage);

  let disabled;
  const {
    name,
    email,
    username,
    password,
    confirmPassword
  } = state.user;

  // Disable Signup Button until all fields are filled
  !name ||
  !email ||
  !username ||
  !password ||
  !confirmPassword ? disabled = true : disabled = false;

  const handleChange = (event) => {
    const { name, value } = event.target;
    setState({
      ...state,
      user: {
        ...state.user,
        [name]: value
      }
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const { user } = state
    let allFieldPass = true;
    for(let field in user) {
      if (!user[field]) {
        allFieldPass = false;
        setState({
          ...state,
          consoleMessage: `Missing required field ${field}`,
        })
        store.consoleMessage.setMessage(state.consoleMessage);
        return null;
      };
    };

    if (user.password !== user.confirmPassword) {
      allFieldPass = false;
      setState({
        ...state,
        consoleMessage: 'Please enter matching passwords'
      });
      store.consoleMessage.setMessage(state.consoleMessage)
    }
    if (allFieldPass) {
      const createdUser =  await request('/users/signup', 'POST', user);
      if (createdUser.message) {
        let errorMessage = createdUser.message;
        if (errorMessage.indexOf('unique') >= 0) {
          errorMessage = 'User with detail you provide already exist'
        }
        setState({
          ...state,
          consoleMessage: errorMessage,
        });
        store.consoleMessage.setMessage(state.consoleMessage)
        return null;
      }
      localStorage.setItem('token', createdUser.token)
      store.userStore.setUser(createdUser)  
      navigate(TASKS)
    };
  };

  const resetConsole = () => {
    setState({
      ...state,
      consoleMessage: '',
    });
  };

  return (
    <div id="signup-page">
      <div className="back-link_div">
        <Link to={BASE_ROUTE}>&laquo; Back</Link>
      </div>
      <div className="sign-up">
        {consoleMessage &&  <ConsoleModal resetConsole={resetConsole} /> }
        <div>
          <h3>Sign Up</h3>
        </div>
        <form>
          <div>
            <div className="form-group">
              <div><label>Name</label>
                <span className="requiredFields">*</span>
              </div>
              <div>
                <input
                  type="text"
                  name="name"
                  placeholder="Full Name"
                  onChange={handleChange}
                />
              </div>
            </div>
            <div className="form-group">
              <div><label>Email</label>
                <span className="requiredFields">*</span>
              </div>
              <div>
                <input 
                  type="text"
                  name="email"
                  placeholder="Email"
                  onChange={handleChange}
                />
              </div>
            </div>
            <div className="form-group">
              <div><label>Username</label>
                <span className="requiredFields">*</span>
              </div>
              <div>
                <input
                  type="text"
                  name="username"
                  placeholder="Username"
                  onChange={handleChange}
                />
              </div>
            </div>
            <div className="form-group">
              <div><label>password</label>
                <span className="requiredFields">*</span>
              </div>
              <div>
                <input
                  type="password"
                  name="password"
                  placeholder="Password"
                  onChange={handleChange}
                />
              </div>
            </div>
            <div className="form-group">
              <div><label>Confirm Password</label>
                <span className="requiredFields">*</span>
              </div>
              <div>
                <input
                  type="password"
                  name="confirmPassword"
                  placeholder="Confirm"
                  onChange={handleChange}
                />
              </div>
            </div>
            <div>
            <div className="form-group">
              <div>
                <input
                  type="submit"
                  name="signup"
                  value="Sign Up"
                  id="submit-btn"
                  disabled={disabled}
                  onClick={handleSubmit}
                />
              </div>
            </div>
            </div>
          </div>
        </form>
        <div>
          <p>I already have an account? 
            <Link to={SIGN_IN}>Sign In</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default observer(Signup);
