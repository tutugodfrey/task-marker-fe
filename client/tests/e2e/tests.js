import chaiAsPromised from 'chai-as-promised';
import chai from 'chai';
import dotenv from 'dotenv-safe';
import { Base } from './pageObjects/index.js';
import { testUsers } from '../../../helpers/index.js';
import {
  landingPage,
  signupPage,
  signinPage,
  dashboard,
  profilePage,
} from './pageObjects/index.js';

dotenv.config();
const { expect } = chai;
chai.use(chaiAsPromised)
const { user1, editUser1 } = testUsers;
const base = Base();
let landing;
let { WEB_URL } = process.env;
WEB_URL = WEB_URL || 'http://localhost:3000'
describe('Integration testing', () => {
    before(async (done) => {
      base.visit(WEB_URL);
      base.driver.manage().window().maximize(100);
      base.driver.sleep(4000);
      done()
    });

    after(async (done) => {
      base.driver.sleep(6000);
      base.quit();
      done()
    }, 40000);

    it('shoulld tests something', async () => {
      landing = await landingPage.pageElements();
      expect(landing.signin).to.eventually.equal('Sign In')
      expect(landing.signup).to.eventually.equal('Sign Up');
      expect(landing.story).to.eventually.equal('Task marker let you keep track of your goals for the day');
      expect(landing.header).to.eventually.equal('Don\'t leave any task uncompleted!');
      return expect(landing.submitBtnText).to.eventually.equal('Sign In');
    }).timeout(10000);

    it('should attempt to signin', async () => {
      await signinPage.inLineSignin('username', 'Aa!12345');
      const consoleModalText = await base.checkConsoleModal();
      await base.closeConsoleModal();
      return expect(consoleModalText).to.equal('Unsuccessful login! Please check your username and password');
    }).timeout(10000);

    it('should go to signup page', () => {
      return signupPage.signUp();
    }).timeout(10000);

    it('should test dashboard', async () => {      
      const dashboardPage = await dashboard.scanningPage();
      await base.driver.sleep(300)
      expect(dashboardPage.homeLink).to.equal('Home');
      expect(dashboardPage.tasksLink).to.equal('Tasks');
      expect(dashboardPage.profileLink).to.equal('Profile');
      expect(dashboardPage.logoutLink).to.equal('Log Out');
      expect(dashboardPage.formHeader).to.equal('Add a Task to Complete');
      expect(dashboardPage.contentHeader).to.equal('No Todos! Start adding your tasks');
      const createTask = await dashboard.createTask();
      await base.driver.sleep(300)
      expect(1).to.equal(1)
      expect(createTask.contentHeader).to.equal('Your Todos');
      expect(createTask.taskTitle).to.equal('todo1 title');
    }).timeout(10000);

    it('should check todo expanded card', async () => {
      const taskContentCard = await dashboard.taskContentCard();
      const deadline = taskContentCard.deadline.split(' ');
      expect(taskContentCard.taskTitle).to.equal('todo1 title');

      // Test to create task pick a deadline one year ahead of current year.
      expect(parseInt(deadline[3], 10)).to.equal(parseInt(new Date().toString().split(' ')[3], 10)+1)
      expect(taskContentCard.completed).to.eql('true');
      return expect(taskContentCard.taskDescription).to.equal('todo1 description');
    }).timeout(10000);

    it('should test profile page', async () => {
      const profile = await profilePage.navToProfile();
      expect(profile.name).to.equal(user1.name);
      expect(profile.username).to.equal(user1.username);
      expect(profile.email).to.equal(user1.email);
    }).timeout(10000);;

    it('should edit user profile and cancel', async () => {
      const editProfile = await profilePage.editProfileAndCancel();
      expect(editProfile.editBtnName).to.equal('Edit');
      expect(editProfile.cancelBtnName).to.equal('Cancel');
    });

    it('should edit user profile and save', async () => {
      const editProfile = await profilePage.editProfileAndSave();
      await base.driver.sleep(100);
      const profile = await profilePage.navToProfile();
      await base.driver.sleep(100);
      expect(editProfile.saveBtnName).to.equal('Save');
      await base.driver.sleep(1000);
      expect(profile.name).to.equal(editUser1.name);
      expect(profile.username).to.equal(user1.username);
      expect(profile.email).to.equal(editUser1.email);
      const res = await profilePage.changeProfilePhoto();
      expect(res).to.equal(null);
      await base.driver.sleep(1000);
    }).timeout(10000);

    it('should logout user', () => {
      return dashboard.logOut();
    });

    it('should log user in', async () => {
      const signin = await signinPage.signin();
      expect(signin.signinFormHeader).to.equal('Sign In');
    });

    it('should logout user', async () => {
      await base.waitUntilPageLoad('/dashboard');
      await dashboard.logOut();
      return base.back();
    });

    it('should signin using inline login', async () => {
      await base.waitUntilHomePageLoad()
      return signinPage.inLineSignin(user1.username, user1.password);
    });
});
