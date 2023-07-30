import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './components/Home.jsx';
import Signup from './components/Signup.jsx';
import Signin from './components/Signin.jsx';
import Profile from './components/Profile.jsx';
import Todo from './components/Todo.jsx';
import NotFoundPage from './components/NotFoundPage.jsx';
import store from './store/index.js'
import { ROUTES } from './constants/index.js'

const Router = () => {
  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route path={ROUTES.BASE_ROUTE} exact element={<Home />} />
          <Route path={ROUTES.SIGN_UP} exact element={<Signup store={store} />} />
          <Route path={ROUTES.SIGN_IN} exact element={<Signin />} />
          <Route path={ROUTES.TASKS} exact element={<Todo />} />
          <Route path={ROUTES.PROFILE} exact element={<Profile />} />
          <Route path="*" element={<NotFoundPage />}/>
        </Routes>
      </BrowserRouter>
    </div>
  )
}

export default Router;
