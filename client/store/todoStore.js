import { observable, action, computed } from 'mobx';

class TodoStore {
  @observable todos = [];

  constructor(rootStore) {
    this.rootStore = rootStore
  }

  @action setTodo = todos => {
    return this.todos = [ ...todos ];
  };

  @action addTodo = todo => {
    this.todos = [ ...this.todos, todo ];
  };

  @action updateTodo = updatedTodo => {
    this.todos.filter((todo, index )=> {
      if (todo.id === updatedTodo.id) {
        return this.todos[index] = updatedTodo;
      }
    });

    this.todos = [ ...this.todos ]
  };

  @action deleteTodo = (id) => {
    this.todos.filter((todo, index )=> {
      if (todo.id === id) {
        this.todos.splice(index, 1)
        return this.todos;
      }
    });
  };

  @computed get getTodos() {
    this.todos.map(todo => {
      const keys = Object.keys(todo);
      return keys.map(key => ({
        [key]: todo[key]
        })
      );
    });
    return this.todos;
  };
}

export default TodoStore;
