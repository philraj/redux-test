import React from 'react';
import ReactDOM from 'react-dom';
import { createStore, combineReducers } from 'redux';
import expect from 'expect';
import deepFreeze from 'deep-freeze';

import { todos, filter } from './reducers/reducers';
import actions from './actions/actions';
import filters from './filters/filters';

const reducer = combineReducers({ todos, filter });
const store = createStore(reducer);

let nextTodoId = 0;

const getVisibleTodos = (todos, filter) => {
  switch (filter) {
    case filters.SHOW_ALL:
      return todos;
    case filters.SHOW_COMPLETED:
      return todos.filter(todo => {
        return todo.completed;
      });
    case filters.SHOW_PENDING:
      return todos.filter(todo => {
        return !todo.completed;
      });
    default:
      return todos;
  }
};

const FilterLink = ({ filter, children }) => {
  return (
    <a href={'#' + filter} onClick={() => {
      store.dispatch({
        type: actions.SET_FILTER,
        filter
      });
    }}>
      {children}
    </a>
  );
}

class TodoApp extends React.Component {
  render() {
    let visibleTodos = getVisibleTodos(
      this.props.todos,
      this.props.filter
    ).map(todo => {
      let style = todo.completed ?
        { textDecoration: 'line-through', fontWeight: 'bold' } : {};

      return (
        <li key={todo.id} style={style} onClick={ () => {
          store.dispatch({
            type: actions.TOGGLE_TODO,
            id: todo.id,
          });
        }}>
          {todo.text}
        </li>
      );
    })

    return (
      <div>
        <form onSubmit={e => {
          e.preventDefault();
          
          store.dispatch({
            type: actions.ADD_TODO,
            id: nextTodoId++,
            text: this.input.value
          });
          this.input.value = '';
        }}>
          <input ref={ node => this.input = node }/>
          <button>
            Add Todo...
          </button>
        </form>
        <p>
          <FilterLink filter={filters.SHOW_ALL}>
            Show all
          </FilterLink>
          {' '}
          <FilterLink filter={filters.SHOW_COMPLETED}>
            Show completed
          </FilterLink>
          {' '}
          <FilterLink filter={filters.SHOW_PENDING}>
            Show pending
          </FilterLink>
        </p>
        <ul>
          {visibleTodos}
        </ul>
      </div>
    );
  }
}

const render = () => {
  ReactDOM.render(
    <TodoApp {...store.getState()} />, 
    document.querySelector('.app')
  );
}

render();
store.subscribe(render);




///// TESTING /////
const testAddTodo = () => {
  const stateBefore = [];
  const action = {
    type: 'ADD_TODO',
    id: 0,
    text: 'Testing todo reducer...'
  };
  const stateAfter = [
    {
      id: action.id,
      text: action.text,
      completed: false
    }
  ]

  deepFreeze(stateBefore);
  deepFreeze(action);

  expect(
    todos(stateBefore, action)
  ).toEqual(stateAfter);
};

const testToggleTodo = () => {
    const stateBefore = [
      {
        id: 0,
        text: 'Hello',
        completed: false
      },
      {
        id: 1,
        text: 'Goodbye',
        completed: true
      }
    ];
    const action = {
      type: actions.TOGGLE_TODO,
      id: 0,
    }
    const stateAfter = [
      {
        id: 0,
        text: 'Hello',
        completed: true
      },
      {
        id: 1,
        text: 'Goodbye',
        completed: true
      }
    ];

    deepFreeze(stateBefore);
    deepFreeze(action);

    expect(
      todos(stateBefore, action)
    ).toEqual(stateAfter);
};

// to be completed...
const testSetFilter = () => {
  const stateBefore = [
    {
      id: 0,
      text: 'Hello',
      completed: false
    }
  ]
};

testAddTodo();
testToggleTodo();
testSetFilter();

console.log('All tests passed.');
