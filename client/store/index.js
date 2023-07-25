import UserStore from './userStore.js';
import TodoStore from './todoStore.js';
import ConsoleMessage from './consoleMessage.js'

class RootStore {
  constructor() {
    this.userStore = new UserStore(this)
    this.todoStore = new TodoStore(this);
    this.consoleMessage = new ConsoleMessage(this)
  }
}

const rootStore = new RootStore();

export default rootStore;
