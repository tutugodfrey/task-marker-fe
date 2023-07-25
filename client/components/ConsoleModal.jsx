import React, { useState, useEffect } from 'react';
import { observer } from 'mobx-react';
import store from '../store/index.js';

const ConsoleModal = observer((props) => {
  const { resetConsole } = props;
  const [ state, setState ] = useState({
    message: ''
  });

  function closeConsole (event) {
    store.consoleMessage.updateMessage('');
    setState({
      ...state,
      message: '',
    });
    resetConsole();
  };

  useEffect(() => {
    function setit() {
      setState({
        ...state,
        message: store.consoleMessage.getMessage,
      });
    }
    setit()
  }, []);

  return (
    <div>
      {
        state.message && (
          <div id="console-modal">
            <button onClick={closeConsole}>x</button>
            <p>{state.message}</p>
          </div>
        )
      }
    </div>
  );
});

export default ConsoleModal;

