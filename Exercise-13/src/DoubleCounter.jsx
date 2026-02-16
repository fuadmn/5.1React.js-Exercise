


// DoubleCounter.jsx
import React, { useReducer } from 'react';
import { doubleCounterReducer, initialState } from './doubleCounterReducer';

const DoubleCounter = () => {
  const [state, dispatch] = useReducer(doubleCounterReducer, initialState);

  return (
    <div>
      <h2>Double Counter</h2>

      {/* Counter A */}
      <div>
        <h3>Counter A: {state.counterA}</h3>
        <button onClick={() => dispatch({ type: 'DECREMENT_A' })} disabled={state.counterA === 0}>
          - A
        </button>
        <button onClick={() => dispatch({ type: 'INCREMENT_A' })}>+ A</button>
      </div>

      {/* Counter B */}
      <div>
        <h3>Counter B: {state.counterB}</h3>
        <button onClick={() => dispatch({ type: 'DECREMENT_B' })} disabled={state.counterB === 0}>
          - B
        </button>
        <button onClick={() => dispatch({ type: 'INCREMENT_B' })}>+ B</button>
      </div>

      {/* Reset both counters */}
      <div>
        <button onClick={() => dispatch({ type: 'RESET_ALL' })}>Reset Both</button>
      </div>
    </div>
  );
};

export default DoubleCounter;
