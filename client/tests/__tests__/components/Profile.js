import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import Profile from '../../../components/Profile.jsx';
import { testUsers } from '../../../../helpers/index.js';
import store from '../../../store/index.js';


const { user1 } = testUsers
const userStore = {
  setUser: jest.fn(),
  getUser: user1
};
let wrapper;
fetch.mockResponseOnce(JSON.stringify({
  ...user1
}))

store.userStore.setUser(user1)
describe('Profile component test', () => {
  beforeAll(() => {
    wrapper = mount(<BrowserRouter><Profile /></BrowserRouter>);
  });
  describe('General', () => {
    test('should find parent div', () => {
      const children = wrapper.children();
      expect(children.childAt(0).name()).toBe('Memo(Profile)');
      expect(children.childAt(0).children().childAt(0).name()).toBe('Navigation');
      expect(children.childAt(0).children().childAt(1).name()).toBe('div');
      expect(children.childAt(0).children().first().childAt(0).children().childAt(0).name()).toBe('div');
      expect(children.childAt(0).children().first().childAt(0).children().childAt(0).children().childAt(0).name()).toBe('a');
      expect(children.childAt(0).children().first().childAt(0).children().childAt(0).children().childAt(0).prop('href')).toBe('/signin');
    });

    test('should Back link', () => {
      expect(wrapper.find('.back-link_div').name()).toBe('div');
      expect(wrapper.find('.back-link_div').children().first().props().to).toEqual('/dashboard');
      expect(wrapper.find('.back-link_div').children().first().props()
        .children).toEqual(expect.stringContaining('Back'));
    });

    test('should find Navigation component', () => {
      const nav = wrapper.find('Navigation');
      expect(nav.length).toBe(1)
    });

    test('should find profile page', () => {
      const profileDiv = wrapper.find('[id="profile-page"]');
      expect(profileDiv.type()).toBe('div');
    });
  });

  describe('Edit mode off', () => {
    let profileInfo
    let childrenInfo
    beforeAll(() => {
      profileInfo = wrapper.find('[id="profile-info"]');
      childrenInfo = profileInfo.children();
    })

    test('should render all info', () => {
      expect(childrenInfo.length).toEqual(5);
    });

    test('should render profile header', () => {
      expect(childrenInfo.at(0).props().id).toBe('profile-header_div');
      expect(childrenInfo.at(0).name()).toBe('div');
      expect(childrenInfo.at(0).children().type()).toBe('h3');
      expect(childrenInfo.at(0).children().text()).toBe(user1.name);
    });

    test('should render image', () => {
      expect(childrenInfo.at(1).props().id).toBe('profile-image_div');
      expect(childrenInfo.at(1).name()).toBe('div');
      expect(childrenInfo.at(1).children().at(0).type()).toBe('img');
      expect(childrenInfo.at(1).children().at(0).props().src).toBe('/profilePhotos/default-profile.png');
      expect(childrenInfo.at(1).children().at(3).name()).toBe('button');
      expect(childrenInfo.at(1).children().at(3).props().children).toBe('Change');
      wrapper.find('#change-profile-photo').simulate('click');
      expect(wrapper.find('#profile-image_div').children().at(3).type()).toBe('input')
      expect(wrapper.find('#profile-image_div').children().at(3).props().type).toBe('file')
      expect(wrapper.find('#profile-image_div').children().at(5).type()).toBe('button')
      expect(wrapper.find('#profile-image_div').children().at(5).text()).toBe('Cancel')
    });

    test('should render email', () => {
      expect(childrenInfo.at(2).props().className).toBe('profile-details');
      expect(childrenInfo.at(2).name()).toBe('div');
      expect(childrenInfo.at(2).children().length).toBe(2);
      expect(childrenInfo.at(2).childAt(0).children().props().children).toBe('Email:');
      expect(childrenInfo.at(2).childAt(1).children().props().children).toBe(user1.email);
    });

    test('should rener username', () => {
      expect(childrenInfo.at(3).props().className).toBe('profile-details');
      expect(childrenInfo.at(3).name()).toBe('div');
      expect(childrenInfo.at(3).children().length).toBe(2);
      expect(childrenInfo.at(3).childAt(0).children().props().children).toBe('Username:');
      expect(childrenInfo.at(3).childAt(1).children().props().children).toBe(user1.username);
    });

    test('should find Edit button', () => {
      expect(childrenInfo.at(4).props().id).toBe('edit-profile-btn_div');
      expect(childrenInfo.at(4).name()).toBe('div');
      expect(childrenInfo.at(4).children().type()).toBe('button');
      expect(childrenInfo.at(4).children().props().children).toBe('Edit');
    });
  });

  describe('Edit mode on', () => {
    let editProfile;
    beforeAll(() => {
      wrapper.find('#edit-profile-btn_div').find('button').simulate('click');
      editProfile = wrapper.find('#edit-profile');
    });

    test('should find edit-profile', () => {
      expect(editProfile.name()).toBe('div');
      expect(editProfile.children().length).toBe(4);
    });

    test('should render image', () => {
      expect(editProfile.childAt(0).props().className).toBe('profile-image_div');
      expect(editProfile.childAt(0).name()).toBe('div');
      expect(editProfile.childAt(0).children().type()).toBe('img');
      expect(editProfile.childAt(0).children().props().src).toBe('/profilePhotos/default-profile.png');
    });

    test('should render name for editing', () => {
      expect(editProfile.childAt(1).props().className).toBe('input-group');
      expect(editProfile.childAt(1).children().length).toBe(2);
      expect(editProfile.childAt(1).children().at(0).type()).toBe('label');
      expect(editProfile.childAt(1).children().at(1).type()).toBe('input');
      expect(editProfile.childAt(1).children().at(1).props().name).toBe('name');
      expect(editProfile.childAt(1).children().at(1).props().type).toBe('text');
      expect(editProfile.childAt(1).children().at(1).props().value).toBe(user1.name);
    });

    test('should render email for editing', () => {
      expect(editProfile.childAt(2).props().className).toBe('input-group');
      expect(editProfile.childAt(2).children().length).toBe(2);
      expect(editProfile.childAt(2).childAt(0).type()).toBe('label');
      expect(editProfile.childAt(2).childAt(1).type()).toBe('input');
      expect(editProfile.childAt(2).childAt(1).props().name).toBe('email');
      expect(editProfile.childAt(2).childAt(1).props().type).toBe('text');
      expect(editProfile.childAt(2).childAt(1).props().value).toBe(user1.email);
    });

    test('should display Save and Cancel buttons', () => {
      expect(editProfile.childAt(3).props().id).toBe('btn-group');
      expect(editProfile.childAt(3).children().children().length).toBe(2);
      expect(editProfile.childAt(3).childAt(0).children().text()).toBe('Save');
      expect(editProfile.childAt(3).childAt(0).children().type()).toBe('button');
      expect(editProfile.childAt(3).childAt(0).children().props().id).toBe('save-edit');
      expect(editProfile.childAt(3).childAt(1).children().text()).toBe('Cancel');
      expect(editProfile.childAt(3).childAt(1).children().type()).toBe('button');
      expect(editProfile.childAt(3).childAt(1).children().props().id).toBe('cancel-edit');
    });
  });
});
