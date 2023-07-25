import React from 'react';
import { Navigate } from 'react-router-dom';
import request, { baseUrl } from './request.js';
import { ROUTES } from '../constants/index.js'

const { SIGN_IN } = ROUTES;
// function closeConsole (event) {
//   this.setState({
//     consoleMessage: '',
//   })
// }

const logout = (event) => {
  return <Navigate to={SIGN_IN} />
}

export {
  request,
  logout,
  baseUrl,
}
