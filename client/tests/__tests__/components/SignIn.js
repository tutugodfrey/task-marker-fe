import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import SignIn from '../../../components/Signin.jsx';
import { testUsers } from '../../../../helpers/index.js'

// let wrapper;
let username;
let password;
let submitBtn;

const wrapper = mount(<BrowserRouter><SignIn /></BrowserRouter>);
describe('Signin Page', () => {
  describe('Component Test', () => {
    let signinPage =  wrapper.find('#signin-page')

    test('Should render the Signin page', () => {
      expect(signinPage.props().id).toBe('signin-page');
      expect(signinPage.children().length).toBe(2);
      expect(signinPage.children().at(0).name()).toBe('div');
      expect(signinPage.children().at(0).props().className).toBe('back-link_div');
      expect(signinPage.children().at(1).name()).toBe('div');
      expect(signinPage.children().at(1).props().className).toBe('sign-in');
    });

    test('Should find the back link', () => {
      const backLink = signinPage.find('.back-link_div');
      expect(backLink.name()).toBe('div');
      expect(backLink.children().at(0).name()).toBe('Link');
      expect(backLink.children().childAt(0).name()).toBe('a');
      expect(backLink.children().childAt(0).props().children).toEqual(expect.stringContaining('Back'));
    });

    test('Should correctly render header', () => {
      const signupHeader = wrapper.find('h3');
      expect(signupHeader.children().at(0).text()).toBe('Sign In')
    });

    test('Should render Sign In Form', () => {
      const signinComp = signinPage.find('.sign-in');
      expect(signinComp.name()).toBe('div');
      expect(signinComp.children().length).toBe(3);
      expect(signinComp.children().at(0).name()).toBe('div');
      expect(signinComp.children().at(1).name()).toBe('form');
      expect(signinComp.children().at(2).name()).toBe('div');
    });

    test('Should correctly render form', () => {
      const signinForm = signinPage.find('form');
      expect(signinForm.children().length).toBe(3);
      expect(signinForm.children().at(0).find('input').prop('type')).toBe('text');
      expect(signinForm.children().at(0).find('input').prop('name')).toBe('username');

      expect(signinForm.children().at(1).find('input').prop('type')).toBe('password');
      expect(signinForm.children().at(1).find('input').prop('name')).toBe('password');

      expect(signinForm.children().at(2).find('input').prop('type')).toBe('submit');
      expect(signinForm.children().at(2).find('input').prop('id')).toBe('submitLogin');
      expect(signinForm.children().at(2).find('input').prop('value')).toBe('Sign In');
    });

    test('Should render link to Sign Up page', () => {
      const signinComp = signinPage.find('.sign-in');
      expect(signinComp.children().at(2).children().at(0).name()).toBe('p');
      expect(signinComp.children().at(2).children().at(0).childAt(0).text()).toBe('I don\'t have an account?');
      expect(signinComp.children().at(2).children().at(0).childAt(1).text()).toBe('Sign Up');
    })
  });


  describe('Unsuccessful Signin', () => {
    let inputs;
    let links
    beforeAll(() => {
      inputs = wrapper.find('input');
      links = wrapper.find('Link');
    });

    beforeEach(async () => {
      const signup = async function() {
        username = inputs.at(0);
        password = inputs.at(1);
        submitBtn = inputs.at(2);
        username.simulate('change', {
          preventDefault: () => {},
          target: {
            name: 'username',
            value: 'John',
          }
        });
  
        password.simulate('change', {
          preventDefault: () => {},
          target: {
            name: 'password',
            value: 'Aa!12345',
          }
        });
  
        submitBtn.simulate('click', {
          preventDefault: () => {},
        });
      }
      signup()
    });

    fetch.mockResponseOnce(JSON.stringify({ message: 'user not found' }))

    test('should render console modal component', (done) => { 
      setTimeout(() => {
        wrapper.update();  // Update the wrapper
        let consoleModal = wrapper.find('#console-modal');
        expect(consoleModal.length).toBe(1);
        expect(consoleModal.find('p').props().children).toBe('Unsuccessful login! Please check your username and password');
        expect(consoleModal.find('button').length).toBe(1);

        // Close console modal
        consoleModal.find('button').simulate('click');
        wrapper.update()
        consoleModal = wrapper.find('#console-modal');
        expect(consoleModal.length).toBe(0);
        done()
      });
    });

    const user = { ...testUsers.user2 };
    user.token = 'somerandomstringfortoken'
    fetch.mockResponseOnce(JSON.stringify({
      ...user
     }));
    test('should successfully signin use', (done) => {
      setTimeout(() => {
        const consoleModal = wrapper.find('ConsoleModal');
        expect(consoleModal.length).toBe(0);
        expect(localStorage.getItem('token')).toBe(user.token);
        wrapper.update();
        done();
      })
    });
  });
});
