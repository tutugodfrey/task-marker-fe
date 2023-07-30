import React, { useState, useEffect } from 'react';
import TodoForm from './TodoForm.jsx';
import Calendar from './Calendar.jsx';
import Navigation from './Navigation.jsx';
import { observer, } from 'mobx-react';
import { request } from '../helpers/index.js';
import store from '../store/index.js';

const Todo = (props) => {
  const [ state, setState ] = useState({
      link: {
        url: '',
        linkText: '',
      },
      todos: store.todoStore.getTodos,
      completeTodo: {
        completed: false,
      },
      showTodoForm: false,
      editMode: false,
      todoToEdit: {
        openCalendarEditInMode: false,
      },
    });

  const { todos, showTodoForm, todoToEdit, editMode, completeTodo } = state;
  const editingTodo = editMode ? 'editing' : '';

  useEffect(() => {
    async function fetchData() {
      if (!todos.length) {
        const fetchedTodos = await request('/todos', 'GET');
        if (!fetchedTodos.message) {
          store.todoStore.setTodo(fetchedTodos);
        }
        setState({
          ...state,
          todos: store.todoStore.getTodos
        });
      }
    }
    fetchData();
  }, [])

  const toggleCompleted = async (event, todoIndex) => {
    const todo = todos[todoIndex];
    todo.completed = event.target.checked
    setState({
      ...state,
      todos: [ ...state.todos ]
    });

    setTimeout (async () => {
      const updatedTodo = await request(
        `/todos/${todo.id}`,
        'PUT',
        {
          completed: todos[todoIndex].completed,
        },
      );
      store.todoStore.updateTodo(updatedTodo);
    }, 1000)
  }

  const toggleTodoDisplay = (event, todoIndex) => {
    const { id } = event.target;
    event.target.textContent === "Show" ?
      event.target.textContent = 'Hide' :
      event.target.textContent = 'Show';

    const todoDiv = document.getElementById(`${id}-main`);
    if (todoDiv.classList.contains('hide-item')) {
      todoDiv.classList.replace('hide-item', 'show-item')
    }  else if (todoDiv.classList.contains('show-item')) {
      todoDiv.classList.replace('show-item', 'hide-item')
    }

    const miniTodoDiv = document.getElementById(`${id}-mini`);
    if (miniTodoDiv.classList.contains('visible')) {
      miniTodoDiv.classList.replace('visible', 'hidden')
    }  else if (miniTodoDiv.classList.contains('hidden')) {
      miniTodoDiv.classList.replace('hidden', 'visible')
    }
  }

  const toggleTodoForm = (event) => {
    setState({
      ...state,
      showTodoForm: !state.showTodoForm,
    })
  }

  const toggleEditMode = (event=null, todo=null) => {
    event && event.preventDefault();
    setState({
      ...state,
      editMode: !state.editMode,
      todoToEdit: {
        ...todo,
      }
    });
  }

  const handleAddChange = (event) => {
    const { name, value } = event.target;
    setState({
      ...state,
      todoToEdit: {
        ...state.todoToEdit,
        [name]: value,
      }
    })
  }

  const handleEnterLink = (event) => {
    const { name, value } = event.target;
    setState({
      ...state,
      link: {
        ...state.link,
        [name]: value,
      }
    });
  }

  const handleAddLink = (event) => {
    event.preventDefault();
    setState({
      ...state,
      todoToEdit: {
        ...state.todoToEdit,
        links: [...state.todoToEdit.links, state.link],
      },
      link: {
        linkText: '',
        url: '',
      },
    });
  }

  const removeLink = (event, index) => {
    event.preventDefault();
    state.todoToEdit.links.splice(index, 1);
    setState({
      ...state,
      todoToEdit: {
        ...state.todoToEdit,
        links: [...state.todoToEdit.links],
      },
    });
  }

  const updateTodo = async (event) => {
    const { id } = event.target;
    const todoId = parseInt(id.split('-')[2], 10);
    const { todoToEdit } = state;
    delete todoToEdit.openCalendarEditInMode;
    const updatedTodo =
    await request(`/todos/${todoId}`, 'PUT',
      state.todoToEdit);
    toggleEditMode();
    store.todoStore.updateTodo(updatedTodo);
  }

  const handleDeleteTodo = async (event) => {
    const { id } = event.target;
    const todoId = parseInt(id.split('-')[2], 10);
    const deleteResponse =
    await request(`/todos/${todoId}`, 'DELETE');
    if (deleteResponse.message) {
      store.todoStore.deleteTodo(todoId);
      setState({
        ...state,
        todos: store.todoStore.getTodos,
      })
    }
  }

  const formatDate = (timestamp) => {
    if (!timestamp) return null
    let date = new Date(timestamp).toString().split(' ');
    return `${date[0]} ${date[1]} ${date[2]}, ${date[3]} `
  }

  const setTimestamp = (timestamp) => {
    setState({
      ...state,
      todoToEdit: {
        ...state.todoToEdit,
        deadline: timestamp,
      },
    });
  };

  const toggleEditModeCalendar = (event, todo) => {
    event.preventDefault();
    setState({
      ...state,
      todoToEdit: {
        ...todo,
        openCalendarEditInMode: !todo.openCalendarEditInMode,
      }
    })
  }

  // Re-render the todos after creating a new todo
  const updateTodoList = (todo) => {
    store.todoStore.addTodo(todo);
    setState({
      ...state,
      todos: store.todoStore.getTodos
    });
  };

  return (
    <div>
      <Navigation />
      <div id="todos-container">
        <div id="todo-form_control">
          <div id="toggle-todo-form_div">
            {todos.length ? (
              <button
                id='toggle-todoform_button'
                onClick={toggleTodoForm}
              >
                {showTodoForm ? 'Close Form': 'Add Task'}
              </button>
            ) : null}
          </div>
          { (!todos.length || showTodoForm) && <TodoForm updateTodoList={updateTodoList} /> }
        </div>
        <div id="todos-content_div">
          <h3>{ todos.length ? 'Your Todos' : 'No Todos! Start adding your tasks' }</h3>
          <ul>
          {todos && todos.map((mainTodo, todoIndex) => {
            let editing;
            let todo;
            if (editMode && todoToEdit.id === mainTodo.id) {
              editing = true,
              todo = todoToEdit
            } else {
              editing = false;
              todo = mainTodo
            }
            return (
              <div className="todo" key={todo.id}>
                <div className="todo-bar">
                  <div
                    id={`toggle-todo-${todo.id}-mini`}
                    className="visible mini-todo-content"
                  >
                    <div className="todo-bar_title">{todo.title}</div>
                    <div>
                      {todo.completed &&
                        <input
                          id={`todo-${todo.id}`}
                          type="checkbox"
                          checked={todo.completed}
                          onChange={event => toggleCompleted(event, todoIndex)}
                        />
                      }
                    </div>
                  </div>
                  <div>
                    <button
                      id={`toggle-todo-${todo.id}`}
                      onClick={(event) => toggleTodoDisplay(event, todoIndex)}
                    >Show</button>
                  </div>
                </div>
                <div id={`toggle-todo-${todo.id}-main`} className={'hide-item todos'}>
                  <li key={todo.id}>
                    <div>
                      <div>
                      {editing ?
                        <div id={editingTodo}>
                          <label className="item-label">Title: </label>
                          <input
                            value={todo.title}
                            name="title"
                            onChange={handleAddChange}
                          />
                        </div>
                          : <h3>{todo.title}</h3>
                        }
                      </div>
                      <div>
                      { editing ?
                        <div>
                          <label className="item-label">Description: </label>
                          <input
                            name="description"
                            value={todo.description}
                            onChange={handleAddChange}
                          />
                        </div>
                          : <p>{todo.description}</p>
                        }
                      </div>
                      <div id="links-div" className={editingTodo}>
                        <strong className="item-label">{todo.links && todo.links.length ? 'Links' : null}</strong>
                        <div>{todo.links && todo.links.length && todo.links.map((link, index)=> {
                          return (
                            <span key={index}>
                              {editing && <button
                                onClick={event => removeLink(event, index)}
                              >x</button>}
                              <a href={link.url}
                                target="_blank"
                                rel="noopener noreferrer"
                              >{link.linkText || link.url}
                              </a><br />
                            </span>
                          );
                        }) || null}
                        </div>
                      </div>

                      <div id="deadline">
                        {
                        todo.deadline? <div>
                            <strong>Target date</strong>
                            <div>{formatDate(todo.deadline)}</div>
                          </div> : null
                        }
                        <div>
                          <div id="edit-deadline">
                            {editing?
                              <button onClick={event => toggleEditModeCalendar(event, todo)}>
                                {todo.openCalendarEditInMode? 'Close Calendar' :
                                  todo.deadline ? 'Chagne deadline' : 'Add deadline' }
                              </button> : null }
                          </div>
                        </div>
                      </div>

                      { todo.openCalendarEditInMode? <Calendar timestamp={todo.deadline} getTimeStamp={setTimestamp} /> : null }
                      <div id="check-complete">
                      <input
                        id={`todo-${todo.id}`}
                        type="checkbox"
                        checked={todo.completed}
                        onChange={event => toggleCompleted(event, todoIndex)}
                      />
                      <label htmlFor={`todo-${todo.id}`}> Completed</label>
                      </div>
                      <div>{ editMode &&
                        <fieldset>
                          <legend>
                            Add related links
                          </legend>
                          <input
                            type="text"
                            id="link-text"
                            name="linkText"
                            placeholder='Description'
                            value={state.link.linkText}
                            onChange={handleEnterLink}
                          />
                          <label htmlFor="description"> Link text</label><br />
                          <input
                            type="text"
                            id="link-url"
                            name="url"
                            placeholder='link'
                            value={state.link.url}
                            onChange={handleEnterLink}
                          />
                          <button
                            id="update-links"
                            onClick={handleAddLink}
                          >Add link</button>
                        </fieldset>}
                      </div>
                      <button
                        type="button"
                        className="edit-todo main-action"
                        id={`edit-todo-${todo.id}`}
                        onClick={event => toggleEditMode(event, todo)}
                      >
                        {editing ? "Cancel" : "Edit"}
                      </button>
                      {editing &&
                        <button
                          type="button"
                          className="save-todo-update main-action"
                          id={`edit-todo-${todo.id}`}
                          onClick={updateTodo}
                        >Save</button>
                      }
                      <button
                        type="button"
                        className="delete-todo main-action"
                        id={`edit-todo-${todo.id}`}
                        onClick={handleDeleteTodo}
                      >Delete</button>
                    </div>
                  </li>
                </div>
              </div>
            )})
          }
          </ul>
        </div>
      </div>
    </div>
  );
};

export default observer(Todo);
