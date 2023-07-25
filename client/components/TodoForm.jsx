import React, { useState } from 'react';
import { observer } from 'mobx-react';
import ConsoleModal from './ConsoleModal.jsx';
import Calendar from './Calendar.jsx';
import { request } from '../helpers/index.js';
import store from '../store/index.js';

const TodoForm = (props) => {
  const { updateTodoList } = props;
  const [ state, setState ] = useState({
    consoleMessage: '',
    showCalendar: false,
    link: {
      url: '',
      linkText: '',
    },
    todoObj: {
      title: '',
      description: '',
      links: [],
      deadline: 0,
    },
  });

  let disableSubmit;
  const { consoleMessage, showCalendar, todoObj, link } = state;
  const { title, description, links } = todoObj;
  const { url, linkText } = link;
  title && description ? disableSubmit = false : disableSubmit = true;

  const handleChange = (event) => {
    const {name, value } = event.target;
    setState({
      ...state,
      todoObj: {
        ...todoObj,
        [name]: value,
      }
    });
  };

  const handleEnterLink = (event) => {
    const { name, value } = event.target;
    setState({
      ...state,
      link: {
        ...state.link,
        [name]: value,
      }
    });
  };

  const handleAddLink = (event) => {
    event.preventDefault();
    setState({
      ...state,
      todoObj: {
        ...todoObj,
        links: [ ...links, link ],
      },
      link: {
        ...state.link,
        linkText: '',
        url: '',
      },
    });
  };

  const removeLink = (event, index) => {
    event.preventDefault();
    todoObj.links.splice(index, 1);
    setState({
      ...state,
      todoObj: {
        ...state.todoObj,
        links: [...state.todoObj.links],
      },
    });
  };

  const onSaveTodo = async (event) => {
    const todo = await request('/todos', 'POST', state.todoObj);
    if (todo.message) {
      const { message } = todo;
      let errorMessage = message;
      if (message === 'duplicate entry for unique key title') {
        errorMessage = 'A todo with this title already exist';
      }
      setState({
        ...state,
        consoleMessage: errorMessage,
      });
      store.consoleMessage.setMessage(errorMessage);
      return null;
    };

    // Reset state
    setState({
      ...state,
      consoleMessage: 'Task Saved!',
      todoObj: {
      ...state.todoObj,
        title: '',
        description: '',
        links: [],
      },
      link: {
        url: '',
        linkText: '',
      },
    });
    store.consoleMessage.setMessage('Task Saved!');
    updateTodoList(todo);
  };

  const setTimestamp = (timestamp) => {
    setState({
      ...state,
      todoObj: {
        ...state.todoObj,
        deadline: timestamp,
      },
    });
  };

  const toggleCalendar = (event) => {
    event.preventDefault();
    setState({
      ...state,
      showCalendar: !state.showCalendar,
    });
  };

  const resetConsole = () => {
    setState({
      ...state,
      consoleMessage: '',
    });
  };

  return (
    <div id="todo-form_container">
      {consoleMessage && <ConsoleModal resetConsole={resetConsole} />}
      <form>
        <div className="form-header">
          <h3>Add a Task to Complete</h3>
        </div>
        <div className="form-group">
          <label htmlFor="title">Add Title</label>
          <span className="requiredFields">*</span><br />
          <input
            type="text"
            id="title"
            name="title"
            placeholder='Title'
            value={title}
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <label htmlFor="description">Add Description</label>
          <span className="requiredFields">*</span><br />
          <input
            type="text"
            id="description"
            name="description"
            placeholder='Description'
            value={description}
            onChange={handleChange}
          />
        </div>
        <div>{
          links.map((link, index) => {
            return (
              <span key={index}>
                <button 
                  onClick={event => removeLink(event, index)}
                >x
                </button>
                <a target="_blank" href={link.url}>{link.linkText || link.url}
                </a><br />
              </span>
            );
          })
        }</div>
        <div className="form-group">
          <fieldset>
            <legend>
              Add related links
            </legend>
            <input
              type="text"
              id="link-text"
              name="linkText"
              placeholder='Description'
              value={linkText}
              onChange={handleEnterLink}
            />
            <label htmlFor="description"> Link text</label><br />
            <input
              type="text"
              id="link-url"
              name="url"
              placeholder='link'
              value={url}
              onChange={handleEnterLink}
            />
            <button
              id="update-links"
              onClick={handleAddLink}
            >Add link</button>
          </fieldset>
        </div>
        <div className="form-group">
          <div id="add-deadline-btn">
            <button onClick={toggleCalendar}>
              {showCalendar? 'Hide Calendar': 'Add deadline'}
            </button>
          </div>
          { showCalendar ? <Calendar getTimeStamp={setTimestamp} /> : null }
        </div>
        
        <div className="form-group">
          <button
            type="button"
            id="save-button"
            onClick={onSaveTodo}
            disabled={disableSubmit}
          >Save</button>
        </div>
      </form>
    </div>
  );
};

export default observer(TodoForm);
