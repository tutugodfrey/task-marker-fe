import webdriver from 'selenium-webdriver';

const { By, until } = webdriver
export default {
  // consoleModal: By.css('#console-modal'),
  consoleModal: By.xpath('//div//div[@id="console-modal"]'),
  closeConsoleModalBtn: By.css('#console-modal button'),
  backLink: By.css('div.back-link_div a'),
  // Landing page selectors
  landingPage: {
    header: By.css('#app-description h1'),
    story: By.css('#story'),
    signin: By.css('#signin a'),
    signup: By.css('#signup a'),
    username: By.css('#login-inline input[name=username]'),
    password: By.css('#login-inline input[name=password]'),
    loginBtn: By.css('#login-inline input[type=submit]'),
  },
  signupPage: {
    name: By.xpath('//div/input[@type="text" and @name="name"]'),
    username: By.xpath('//div/input[@type="text" and @name="username"]'),
    email: By.xpath('//div/input[@type="text" and @name="email"]'),
    password1: By.xpath('//div/input[@type="password" and @name="password"]'),
    password2: By.xpath('//div/input[@type="password" and @name="confirmPassword"]'),
    signUpBtn: By.xpath('//div/input[@type="submit" and @name="signup"]'),
  },
  signinPage: {
    signinFormHeader: By.css('div.sign-in h3'),
    username: By.css('div.sign-in input[name="username"]'),
    password: By.css('div.sign-in input[name="password"]'),
    siginBtn: By.css('#submitLogin'),
  },
  tasks: {
    navBar: By.css('#nav-bar'),
    homeLink: By.css('#home a'),
    profileLink: By.css('#profile a'),
    logoutLink: By.css('#logout a'),
    tasksLink: By.css('#tasks a'),
    taskFormHeader: By.css('div#todo-form_container h3'),
    taskContentHeader: By.css('div#todos-content_div h3'),
  },
  taskForm: {
    titleInput: By.css('div#todo-form_container #title'),
    descriptionInput: By.css('div#todo-form_container #description'),
    linkDescriptionInput: By.css('#link-text'),
    linkUrlInput: By.css('#link-url'),
    addLinkBtn: By.css('#update-links'),
    toggleTaskFormBtn: By.css('#toggle-todoform_button'),
    addDeadlineBtn: By.css('#todos-container form #add-deadline-btn button'),
    moveYearBackwardBtn: By.css('#todos-container form #month-year > div:nth-child(1) button:nth-of-type(1)'),
    moveYearForwardBtn: By.css('#todos-container form #month-year > div:nth-child(1) button:nth-of-type(2)'),
    moveMonthBackwardBtn: By.css('#todos-container form #month-year > div:nth-child(2) button:nth-of-type(1)'),
    moveMonthForwardBtn: By.css('#todos-container form #month-year > div:nth-child(2) button:nth-of-type(2)'),
    daySelector: (week, day) => {
      return By.css(`#days > div:nth-child(${week}) > div > :nth-child(${day}) button`);
    },
    saveTaskBtn: By.css('div#todo-form_container div.form-group > button#save-button'),
  },
  tasksContainer: {
    createdTodoTitle: By.css('div.todo-bar div[id*="toggle-todo-1-mini"] .todo-bar_title'),
    toggleTaskDisplayBtn: By.css('div.todo-bar button[id*="todo-1"]'),
  },
  taskExpandedCard: {
    taskTitle: By.css('div#toggle-todo-1-main div h3'),
    taskDescription: By.css('div#toggle-todo-1-main div p'),
    taskDeadline: (num) => {
      return By.css(`#toggle-todo-${num}-main #deadline div div`)
    },
    completedCheckbox: By.css('div#toggle-todo-1-main input[type="checkbox"]'),
    editLink: By.css('#edit-todo-1'),
    deleteLink: By.css('#delete-todo-1'),
  
  },
  profile: {
    profileHeader: By.css('div#profile-header_div h3'),
    profileDetails: By.css('div.profile-details'),
    emailKey: By.css('div.profile-details:nth-child(3) strong'),
    emailValue: By.css('div.profile-details:nth-child(3) span'),
    usernameKey: By.css('div.profile-details:nth-child(4) strong'),
    usernameValue: By.css('div.profile-details:nth-child(4) span'),
    editProfileBtn: By.css('#edit-profile-btn_div button'),
    editProfileInputName: By.css('div#edit-profile input[name="name"]'),
    editProfileInputEmail: By.css('div#edit-profile input[name="email"]'),
    saveEditBtn: By.css('#save-edit'),
    cancelEditBtn: By.css('#cancel-edit'),
    changeProfilePhotoBtn: By.css('#change-profile-photo'),
    fileInputField: By.css('input[name=profile-photo]'),
    uploadBtn: By.css('button[class=show]'),
    profileImgSuccessModal: By.css('#profile-photo-save-success'),
  }
}
