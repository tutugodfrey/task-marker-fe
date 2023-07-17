import { observable, action, computed } from 'mobx';

class ConsoleMessage {
  @observable consoleMessage = '';

  constructor(rootStore) {
    this.rootStore = rootStore
  }

  @action setMessage = message => {
    this.consoleMessage = message;
    return this.consoleMessage;
  };

  @action updateMessage = (message) => {
    return this.consoleMessage = message
  }

  @computed get getMessage() {
    return this.consoleMessage
  }
}

export default ConsoleMessage;
