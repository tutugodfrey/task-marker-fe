import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import Todo from '../../../components/Todo';
import { testTodos, testUsers } from '../../../../helpers/index.js';
import store from '../../../store';
import { act } from 'react-dom/test-utils';



const { user1 } = testUsers;
const { todo1, todo2 } = testTodos;
todo1.id = 1;
const todos = [todo1];
let wrapper;
let wrapper2

let count = 0

// this is needed to suppress warning
// Warning: An update to Todo inside a test was not wrapped in act(...)
// GitHub Issue: https://github.com/enzymejs/enzyme/issues/2073
const waitForComponentToPaint = async (wrapper) => {
  await act(async () => {
    await new Promise(resolve => setTimeout(resolve, 0));
    // Below is really not needed.
    // wrapper.update();
  });
};

describe('Todo test', () => {
  describe('Top level div', () => {
    fetch.mockResponseOnce(JSON.stringify([]))
    beforeAll(() => {
      wrapper = mount(<Todo />);
      waitForComponentToPaint(wrapper);
    });

    test('should have id todos-container', () => {
      // console.log(wrapper.type())
      // setTimeout(() => {
        expect(wrapper.name()).toBe('Memo(Todo)');
        expect(wrapper.childAt(0).name()).toBe('div');
        expect(wrapper.childAt(0).props().id).toEqual('todos-container');
        expect(wrapper.childAt(0).at(0).children().length).toBe(2);
        // done()
      // })
    });

    test('should render the todo form', () => {
      expect(wrapper.childAt(0).children().at(0).name()).toBe('div');
      expect(wrapper.childAt(0).children().at(0).props().id).toBe('todo-form_control');

      const formElement = wrapper.childAt(0).children().at(0).find('form')
      expect(formElement.children().length).toBe(7);

      expect(formElement.children().at(0).childAt(0).name()).toBe('h3');
      expect(formElement.children().at(0).childAt(0).text()).toBe('Add a Task to Complete');

      // Title
      expect(formElement.children().at(1).name()).toBe('div');
      expect(formElement.children().at(1).prop('className')).toBe('form-group');
      expect(formElement.children().at(1).childAt(0).name()).toBe('label');
      expect(formElement.children().at(1).childAt(0).text()).toBe('Add Title');
      expect(formElement.children().at(1).find('input').prop('name')).toBe('title');
      expect(formElement.children().at(1).find('input').prop('type')).toBe('text');

      // Description
      expect(formElement.children().at(2).name()).toBe('div');
      expect(formElement.children().at(2).prop('className')).toBe('form-group');
      expect(formElement.children().at(2).childAt(0).name()).toBe('label');
      expect(formElement.children().at(2).childAt(0).text()).toBe('Add Description');
      expect(formElement.children().at(2).find('input').prop('name')).toBe('description');
      expect(formElement.children().at(2).find('input').prop('type')).toBe('text');

      // Links div
      expect(formElement.children().at(4).name()).toBe('div');
      expect(formElement.children().at(4).prop('className')).toBe('form-group');
      expect(formElement.children().at(4).childAt(0).name()).toBe('fieldset');
      expect(formElement.children().at(4).childAt(0).children().at(0).name()).toBe('legend');
      expect(formElement.children().at(4).childAt(0).children().at(0).text()).toBe('Add related links');
      expect(formElement.children().at(4).childAt(0).children().at(1).name()).toBe('input');
      expect(formElement.children().at(4).childAt(0).children().at(2).name()).toBe('label');
      expect(formElement.children().at(4).childAt(0).children().at(3).name()).toBe('br');
      expect(formElement.children().at(4).childAt(0).children().at(4).name()).toBe('input');
      expect(formElement.children().at(4).childAt(0).children().at(5).name()).toBe('button');
      expect(formElement.children().at(4).childAt(0).children().at(5).text()).toBe('Add link');

      // Deadline button
      expect(formElement.children().at(5).name()).toBe('div');
      expect(formElement.children().at(5).prop('className')).toBe('form-group');
      expect(formElement.children().at(5).childAt(0).prop('id')).toBe('add-deadline-btn');

      // Save button
      expect(formElement.children().at(6).name()).toBe('div');
      expect(formElement.children().at(6).prop('className')).toBe('form-group');
      expect(formElement.children().at(6).childAt(0).name()).toBe('button');
    });

    test('Should render the todos container', () => {
      expect(wrapper.childAt(0).children().at(1).name()).toBe('div');
      expect(wrapper.childAt(0).children().at(1).props().id).toBe('todos-content_div');
      expect(wrapper.childAt(0).children().at(1).find('h3').text()).toBe('No Todos! Start adding your tasks');
    });
  });

  describe('Test Todos behaviours', () => {
    fetch.resetMocks()
    fetch.mockResponseOnce(JSON.stringify([ todo1 ]))
    beforeAll(() => {
        wrapper = mount(<Todo />);
    });

    test('Todo form should not be displayed', (done) => {
      setTimeout(() => {
        wrapper.update();
        expect(wrapper.childAt(0).children().at(0).name()).toBe('div');
        expect(wrapper.childAt(0).children().at(0).prop('id')).toBe('todo-form_control');
        expect(wrapper.childAt(0).children().at(0).find('form').length).toBe(0);
        done();
      });
    });

    test('There should be "Add Task" botton', () => {
      expect(wrapper.childAt(0).children().at(0).children().childAt(0).name()).toBe('button');
      expect(wrapper.childAt(0).children().at(0).children().childAt(0).text()).toBe('Add Task');
    });

    test('Should contain todos', () => {
      expect(wrapper.childAt(0).children().at(1).children().at(0).text()).toBe('Your Todos');
      expect(wrapper.childAt(0).children().at(1).children().at(0).name()).toBe('h3');

      expect(wrapper.childAt(0).children().at(1).children().at(1).name()).toBe('ul');
      expect(wrapper.childAt(0).children().at(1).children().at(1).children().length).toBe(1);
    });

    test('Should toggle the todo form', () => {
      // open the todo form
      wrapper.childAt(0).find('#toggle-todoform_button').simulate('click');
      wrapper.update();
      expect(wrapper.childAt(0).children().at(0).find('form').length).toBe(1);

      // Close the form
      wrapper.childAt(0).find('#toggle-todoform_button').simulate('click');
      wrapper.update();
      expect(wrapper.childAt(0).children().at(0).find('form').length).toBe(0);
    });

    todo2.id = 2
    test('Todo items should be successfully added', (done) => {
      fetch.resetMocks();
      fetch.mockResponseOnce(JSON.stringify(todo2));
      
      wrapper.update();
      wrapper.childAt(0).children().at(0).children().childAt(0).simulate('click');

      const formElement = wrapper.childAt(0).children().at(0).find('form')
      formElement.find('#title').simulate('change', {
        preventDefault: () => {},
        target: {
          name: 'title',
          value: todo2.title
        },
      });

      formElement.find('#description').simulate('change', {
        preventDefault: () => {},
        target: {
          name: 'description',
          value: todo2.description,
        }
      });
      formElement.find("#save-button").simulate('click');
      waitForComponentToPaint(wrapper)
      wrapper.mount()

      setTimeout(() => {
        wrapper.mount();
        expect(wrapper.find('#console-modal').length).toBe(1);
        expect(wrapper.find('#console-modal').find('p').text()).toBe('Task Saved!');
        wrapper.find('#console-modal').find('button').simulate('click');
        expect(wrapper.find('#console-modal').length).toBe(0);

        wrapper.update()
        expect(wrapper.find('#toggle-todoform_button').length).toBe(1);
        expect(wrapper.find('#toggle-todoform_button').text()).toBe('Close Form');
        wrapper.find('#toggle-todoform_button').simulate('click');
        expect(wrapper.find('#toggle-todoform_button').text()).toBe('Add Task');
        wrapper.update();
        // 2 todos saved so far
        expect(wrapper.find('ul').children().length).toBe(2);

        done();
      });
    }, 3000);
  });



  // describe('Edit mode on', () => {
  //   let editBtn;
  //   let inputs;
  //   let links;
    // beforeAll(() => {
      // console.log(wrapper.html())
      // wrapper.update();
      // console.log(wrapper.find('#todos-content_div').find('ul').childAt(0).html())
      // console.log(wrapper.find('#todos-content_div').find('ul').childAt(0).find('button').find({children: "Show"}).html())
      // wrapper.find('#todos-content_div').find('ul').childAt(0).find('button').find({children: "Show"}).simulate('click')

      // wrapper.find('#todos-content_div').find('ul').childAt(0).find('button').find({children: "Show"}).simulate('click')
      // editBtn = wrapper.find('.edit-todo');
      // editBtn.simulate('click');
      // inputs = wrapper.find('input');
      // links = wrapper.find('span');
    // });


    // test('should render previous title', () => {
    //   const title = inputs.at(0);
    //   const props = title.props();
    //   expect(props.name).toBe('title');
    //   expect(props.value).toBe(todo1.title)
    // });

    // test('should render previous description', () => {
    //   const description = inputs.at(1);
    //   const props = description.props();
    //   expect(props.name).toBe('description');
    //   expect(props.value).toBe(todo1.description);
    // });

    // test('should render previous linkText', () => {
    //   const linkText = inputs.at(2);
    //   const props = linkText.props();
    //   expect(props.name).toBe('linkText');
    //   expect(props.value).toBe('');
    // });

    // test('should render previous link url', () => {
    //   const linkUrl = inputs.at(3);
    //   const props = linkUrl.props();
    //   expect(props.name).toBe('url');
    //   expect(props.value).toBe('')
    // });

    // test('should find todo links', () => {
    //   expect(links.length).toBe(2);
    //   expect(links.at(0).childAt(0).type()).toBe('button');
    //   expect(links.at(0).childAt(1).type()).toBe('a');
    //   expect(links.at(0).childAt(1).props().href).toBe(todo1.links[0].url);
    //   expect(links.at(0).childAt(1).props().children).toBe(todo1.links[0].url)

    //   expect(links.at(1).childAt(0).type()).toBe('button');
    //   expect(links.at(1).childAt(1).type()).toBe('a');
    //   expect(links.at(1).childAt(1).props().href).toBe(todo1.links[1].url);
    //   expect(links.at(1).childAt(1).props().children).toBe(todo1.links[1].linkText);
    // });
  // });
});
