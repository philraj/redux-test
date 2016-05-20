import React from 'react';
import ReactDOM from 'react-dom';
import { createStore, combineReducers } from 'redux';
import expect from 'expect';
import deepFreeze from 'deep-freeze';

///// REDUCERS /////
const filter = (state = 'SHOW_ALL', action = {}) => {
  switch (action.type) {
    case 'SET_FILTER':
      return action.filter;
    default:
      return state;
  }
};

const todos = (state = [], action = {}) => {
  switch (action.type) {
    case 'ADD_TODO':
      return [
        ...state,
        todo(undefined, action)
      ];
    case 'TOGGLE_TODO':
      return state.map(t => todo(t, action));
    default:
      return state;
  }
};

const todo = (state, action) => {
  switch (action.type) {
    case 'ADD_TODO':
      return {
        id: action.id,
        text: action.text,
        completed: false
      };
    case 'TOGGLE_TODO':
      if (state.id === action.id) {
        return Object.assign({}, state, {
          completed: !state.completed
        });
      } else {
        return state;
      }
    default:
      return state;
  }
};

// const combineReducers = (reducers) => {
//   const keys = Object.keys(reducers);
//
//   return (state = {}, action = {}) => {
//     return keys.reduce(
//       (nextState, key) => {
//         nextState[key] = reducers[key](
//           state[key],
//           action
//         );
//         return nextState;
//       }, {}
//     );
//   }
// }

const reducer = combineReducers({ todos, filter });
const store = createStore(reducer);

let nextTodoId = 0;

const FilterLink = ({ filter, children }) => {
    return (
      <a href={'#' + filter} onClick={() => {
        store.dispatch({
          type: 'SET_FILTER',
          filter
        });
      }}>
        {children}
      </a>
    );
}

const getVisibleTodos = (todos, filter) => {
  switch (filter) {
    case 'SHOW_ALL':
      return todos;
    case 'SHOW_COMPLETED':
      return todos.filter(todo => {
        return todo.completed;
      });
    case 'SHOW_PENDING':
      return todos.filter(todo => {
        return !todo.completed;
      });
    default:
      return todos;
  }
};

class TodoApp extends React.Component {
  render() {
    let { todos, filter } = this.props;

    let visibleTodos = getVisibleTodos(todos, filter).map(todo => {
      let style = todo.completed ?
        { textDecoration: 'line-through', fontWeight: 'bold' } : {};

      return (
        <li key={todo.id} style={style} onClick={() => {
          store.dispatch({
            type: 'TOGGLE_TODO',
            id: todo.id,
          });
        }}>
          {todo.text}
        </li>
      );
    })

    return (
      <div>
        <input ref={ node => this.input = node }/>
        <button type='button' onClick={() => {
          store.dispatch({
            type: 'ADD_TODO',
            id: nextTodoId++,
            text: this.input.value
          });
          this.input.value = '';
        }}>
          Add Todo...
        </button>
        <p>
          <FilterLink filter={'SHOW_ALL'}>
            Show all
          </FilterLink>
          {' '}
          <FilterLink filter={'SHOW_COMPLETED'}>
            Show completed
          </FilterLink>
          {' '}
          <FilterLink filter={'SHOW_PENDING'}>
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
    <TodoApp {...store.getState()}/>, document.querySelector('.app'));
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
      type: 'TOGGLE_TODO',
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
