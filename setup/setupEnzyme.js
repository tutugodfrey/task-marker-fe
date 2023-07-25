import { configure, shallow, render, mount } from 'enzyme';
 import { enableFetchMocks } from 'jest-fetch-mock';
import Adapter from '@cfaester/enzyme-adapter-react-18';

import util from 'util';

enableFetchMocks();
Object.defineProperty(global, 'TextEncoder', {
  value: util.TextEncoder,
});
configure({ adapter: new Adapter });
global.shallow = shallow;
global.render = render;
global.mount = mount;

