import React from 'react';
import { createRoot } from 'react-dom/client';
import Router from './Routes.jsx';
import store from './store/index.js';
import './styles/index.scss';

const App = () => {
  return (
    <div>
      <Router />
    </div>
  )
}

const domNode = document.getElementById('app');
const root = createRoot(domNode);
root.render(<App store={store} />)

export default App;
