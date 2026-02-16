// doubleCounterReducer.js
export const initialState = {
  counterA: 0,
  counterB: 0,
};

export function doubleCounterReducer(state, action) {
  switch (action.type) {
    case 'INCREMENT_A':
      return { ...state, counterA: state.counterA + 1 };
    case 'DECREMENT_A':
      return {
        ...state,
        counterA: state.counterA > 0 ? state.counterA - 1 : 0,
      };
    case 'INCREMENT_B':
      return { ...state, counterB: state.counterB + 1 };
    case 'DECREMENT_B':
      return {
        ...state,
        counterB: state.counterB > 0 ? state.counterB - 1 : 0,
      };
    case 'RESET_ALL':
      return initialState;
    default:
      return state;
  }
}