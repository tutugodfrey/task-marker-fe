import React from 'react';
// import { useNavigate } from 'react-router-dom';
import Navigation from './Navigation.jsx';
import LoginInline from './LoginInline.jsx';

const Home = () =>  {
  // function navigate(route, useNavigate) {
  //   const navigate = useNavigate();
  //   navigate(route)
  // }
  return (
    <div id="landing">
        <Navigation />
        <div id="showcase">
          <div>
          <div id="app-description">
            <h1>Don't leave any task uncompleted!</h1>
            <p id="story">Task marker let you keep track of your goals for the day</p>
          </div>
          <LoginInline />
        </div>
      </div>
    </div>
  )};


export default Home;
