import actions from '../actions/actions';
import filters from '../filters/filters';

const filter = (
  state = filters.SHOW_ALL,
  action = {}
) => {
  switch (action.type) {
    case actions.SET_FILTER:
      return action.filter;
    default:
      return state;
  }
};

const todos = (
  state = [],
  action = {}
) => {
  switch (action.type) {
    case actions.ADD_TODO:
      return [
        ...state,
        todo(undefined, action)
      ];
    case actions.TOGGLE_TODO:
      return state.map(t => todo(t, action));
    default:
      return state;
  }
};

const todo = (
  state,
  action
) => {
  switch (action.type) {
    case actions.ADD_TODO:
      return {
        id: action.id,
        text: action.text,
        completed: false
      };
    case actions.TOGGLE_TODO:
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

export { todos, filter };