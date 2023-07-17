import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import LoginInline from '../../../components/LoginInline.jsx';

const  wrapper = mount(
  <BrowserRouter>
    <LoginInline />
  </BrowserRouter>
);

describe('LoginInline Test', () => {
  test('wrapper is a div', () => {
    expect(wrapper.childAt(0).children().childAt(0).is('div')).toBeTruthy();
    expect(wrapper.childAt(0).children().childAt(0).props().id).toBe('login-inline');
    expect(wrapper.children().childAt(0).children().childAt(0).is('form')).toBeTruthy();
    expect(wrapper.length).toBe(1);
  });

  test('should find the id of the component', () => {
    const eleId = wrapper.find('form');
    expect(eleId.childAt(0).name()).toBe('div');
    expect(eleId.childAt(0).type()).toBe('div');
    expect(eleId.childAt(0).props().id).toBe('form-group_container')
    expect(eleId.childAt(0).children().length).toBe(3);
  });

  test('should find all input fields', () => {
    const inputs = wrapper.find('input');
    expect(inputs.length).toBe(3);
    expect(inputs.at(0).props().type).toBe('text');
    expect(inputs.at(0).props().name).toBe('username');
    expect(inputs.at(1).props().type).toBe('password');
    expect(inputs.at(1).props().name).toBe('password');
    expect(inputs.at(2).props().type).toBe('submit');
    expect(inputs.at(2).props().value).toBe('Sign In')
  });
});
