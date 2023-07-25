import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import Signup from '../../../components/Signup.jsx';
import { testUsers } from '../../../../helpers/index.js';

const user1 = { ...testUsers.user1 };
const wrapper = mount(<BrowserRouter><Signup /></BrowserRouter>);

describe('SignUp Page', () => {
  describe('Component Test', () => {
    let signupPage = wrapper.find('#signup-page');
    test('should render the signup page', () => {
      expect(signupPage.children().length).toBe(2);
      expect(signupPage.children().at(0).name()).toBe('div');
      expect(signupPage.children().at(0).props().className).toBe('back-link_div');
      expect(signupPage.children().at(1).name()).toBe('div');
      expect(signupPage.children().at(1).props().className).toBe('sign-up');
    });

    test('Should find the back link', () => {
      const backLink = signupPage.find('.back-link_div');
      expect(backLink.children().at(0).name()).toBe('Link');
      expect(backLink.children().childAt(0).name()).toBe('a');
      expect(backLink.children().at(0).props().to).toBe('/');
      expect(backLink.children().at(0).props().children).toEqual(expect.stringContaining('Back'));
      expect(backLink.children().childAt(0).props().href).toBe('/');
      expect(backLink.children().childAt(0).props().children).toEqual(expect.stringContaining('Back'));
    });

    test('Should render the signup Form', () => {
      const signupComp = wrapper.find('.sign-up');
      expect(signupComp.name()).toBe('div');
      expect(signupComp.children().length).toBe(3);
      expect(signupComp.children().at(0).name()).toBe('div');
      expect(signupComp.children().at(1).name()).toBe('form');
      expect(signupComp.children().at(2).name()).toBe('div');
    });

    test('Should correctly render header', () => {
      const signupHeader = wrapper.find('h3');
      expect(signupHeader.children().at(0).text()).toBe('Sign Up');
    });

    test('Should correctly render form content', () => {
      const signupForm = wrapper.find('form');
      expect(signupForm.childAt(0).children().length).toBe(6);
      expect(signupForm.childAt(0).children().at(0).find('label').text()).toBe('Name');
      expect(signupForm.childAt(0).children().at(0).find('input').props().name).toBe('name');
      expect(signupForm.childAt(0).children().at(0).find('input').props().type).toBe('text');

      expect(signupForm.childAt(0).children().at(1).find('label').text()).toBe('Email');
      expect(signupForm.childAt(0).children().at(1).find('input').props().name).toBe('email');
      expect(signupForm.childAt(0).children().at(1).find('input').props().type).toBe('text');

      expect(signupForm.childAt(0).children().at(2).find('label').text()).toBe('Username');
      expect(signupForm.childAt(0).children().at(2).find('input').props().name).toBe('username');
      expect(signupForm.childAt(0).children().at(2).find('input').props().type).toBe('text');

      expect(signupForm.childAt(0).children().at(3).find('label').text()).toBe('password');
      expect(signupForm.childAt(0).children().at(3).find('input').props().name).toBe('password');
      expect(signupForm.childAt(0).children().at(3).find('input').props().type).toBe('password');

      expect(signupForm.childAt(0).children().at(4).find('label').text()).toBe('Confirm Password');
      expect(signupForm.childAt(0).children().at(4).find('input').props().name).toBe('confirmPassword');
      expect(signupForm.childAt(0).children().at(4).find('input').props().type).toBe('password');

      expect(signupForm.childAt(0).children().at(5).find('input').props().value).toBe('Sign Up');
      expect(signupForm.childAt(0).children().at(5).find('input').props().name).toBe('signup');
      expect(signupForm.childAt(0).children().at(5).find('input').props().type).toBe('submit');
    });

    test('Should contain link to Sign In page', () => {
      const linkToSignin = wrapper.find('#signup-page').childAt(1).children().last();
      expect(linkToSignin.childAt(0).name()).toBe('p')
      expect(linkToSignin.childAt(0).childAt(0).text()).toBe('I already have an account?');
      expect(linkToSignin.childAt(0).childAt(1).text()).toBe('Sign In');
    })
  });

  describe('Sign Up Behaviour Test', () => {
    beforeEach(() => {
      const inputs = wrapper.find('input');
      inputs.find({name: "name"}).simulate('change', {
        preventDefault: () => {},
        target: {
          name: 'name',
          value: user1.name,
        },
      });

      inputs.find({ name: 'email'}).simulate('change', {
        preventDefault: () => {},
        target: {
          name: 'email',
          value: user1.email,
        }
      });

      inputs.find({ name: 'username'}).simulate('change', {
        preventDefault: () => {},
        target: {
          name: 'username',
          value: user1.username,
        },
      });

      inputs.find({ name: 'password'}).simulate('change', {
        preventDefault: () => {},
        target: {
          name: 'password',
          value: user1.password,
        },
      });
    });

    fetch.resetMocks();
    fetch.mockResponseOnce(JSON.stringify({ message: 'Please enter matching passwords'}));
    test('Signup should not succeed without properly filling out all fields', (done) => {
      const inputs = wrapper.find('input');
      inputs.find({ name: 'confirmPassword'}).simulate('change', {
        preventDefault: () => {},
        target: {
          name: 'confirmPassword',
          value: 'wrongPassword'
        }
      });

      inputs.find({ name: 'signup' }).simulate('click', {
        preventDefault: () => {},
      });

      setTimeout(() => {
        wrapper.update();
        let consoleModal = wrapper.find('#console-modal');
        expect(consoleModal.length).toBe(1);
        expect(consoleModal.childAt(0).name()).toBe('button');
        expect(consoleModal.childAt(1).name()).toBe('p');
        expect(consoleModal.childAt(1).children().html()).toBe('Please enter matching passwords');

        // Close the button
        consoleModal.childAt(0).simulate('click');
        wrapper.update();
        consoleModal = wrapper.find('#console-modal');
        expect(consoleModal.length).toBe(0);
        done();
      });
    });

    const token = 'tokenonsuccessfulsignup';
    const user = { ...testUsers.user1 }
    delete user.password;
    delete user.confirmPassword;
    delete user.wrongPassword;
    user.token = token;
    fetch.resetMocks();
    fetch.mockResponseOnce(JSON.stringify({
      ...user
    }));
    test('Signup should succeed when all field are filled correctly', (done) => {
      const inputs = wrapper.find('input');
      inputs.find({ name: 'confirmPassword'}).simulate('change', {
        preventDefault: () => {},
        target: {
          name: 'confirmPassword',
          value: user1.confirmPassword
        }
      });

      inputs.find({ name: 'signup' }).simulate('click', {
        preventDefault: () => {},
      });

      setTimeout(() => {
        wrapper.update();
        let consoleModal = wrapper.find('#console-modal');
        expect(consoleModal.length).toBe(0);
        expect(localStorage.getItem('token')).toBe(token);
        done();
      });
    });
  });
});
