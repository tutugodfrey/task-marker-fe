import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import Navigation from '../../../components/Navigation';

describe('Navigation Component Test', () => {
  describe('Guest', () => {
    const wrapper = mount(<BrowserRouter><Navigation /></BrowserRouter>);
    test('should render signup, signin links without user authentication', () => {
      expect(wrapper.children().childAt(0).children().props().id).toBe('nav-bar');
      expect(wrapper.children().childAt(0).children().name()).toBe('div');
  
      // render signup and signin if not auth
      expect(wrapper.children().childAt(0).children().children().length).toBe(2);
  
      expect(wrapper.children().childAt(0).children().childAt(0).props().id).toBe('signin');
      expect(wrapper.children().childAt(0).children().childAt(0).find('Link').props().children).toBe('Sign In');
      expect(wrapper.children().childAt(0).children().childAt(0).find('Link').props().to).toBe('/signin');
  
      expect(wrapper.children().childAt(0).children().childAt(1).props().id).toBe('signup');
      expect(wrapper.children().childAt(0).children().childAt(1).find('Link').props().children).toBe('Sign Up');
      expect(wrapper.children().childAt(0).children().childAt(1).find('Link').props().to).toBe('/signup');
    });
  })

  describe('When use login with token in localstorage', () => {
    window.localStorage.setItem('token', 'some token string');
    const wrapper = mount(<BrowserRouter><Navigation /></BrowserRouter>);
    test('Find render n', () => {
      expect(wrapper.children().childAt(0).children().children().length).toBe(4)
      expect(wrapper.children().childAt(0).children().childAt(0).props().id).toBe('home');
      expect(wrapper.children().childAt(0).children().childAt(0).find('Link').props().children).toBe('Home');
      expect(wrapper.children().childAt(0).children().childAt(0).find('Link').props().to).toBe('/');

      expect(wrapper.children().childAt(0).children().childAt(1).props().id).toBe('tasks');
      expect(wrapper.children().childAt(0).children().childAt(1).find('Link').props().children).toBe('Tasks');
      expect(wrapper.children().childAt(0).children().childAt(1).find('Link').props().to).toBe('/tasks');

      expect(wrapper.children().childAt(0).children().childAt(2).props().id).toBe('profile');
      expect(wrapper.children().childAt(0).children().childAt(2).find('Link').props().children).toBe('Profile');
      expect(wrapper.children().childAt(0).children().childAt(2).find('Link').props().to).toBe('/profile');

      expect(wrapper.children().childAt(0).children().childAt(3).props().id).toBe('logout');
      expect(wrapper.children().childAt(0).children().childAt(3).find('a').props().children).toBe('Log Out');
    });
  });
});
