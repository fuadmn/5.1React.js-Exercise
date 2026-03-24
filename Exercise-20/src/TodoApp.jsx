import { useState, useReducer } from "react";

const initialState = [];

const reducer = (state, action) => {
  switch (action.type) {
    case "add":
      return [...state, action.payload];
    case "toggle":
      return state.map((todo) =>todo.id === action.payload ? { ...todo, completed: !todo.completed } : todo);
    case "delete":
      return state.filter((todo) => todo.id !== action.payload);
    default:
      return state;
  }
};

const TodoApp = () => {
  const [state, dispatcch] = useReducer(reducer, initialState);

  const [text, setText] = useState("");

  const hanleAdd = () => {

     if(text.trim()){
        const newTodo = {
            id: Date.now(),
            text,
            completed: false
        }
        dispatcch({type: "add", payload: newTodo})
        setText('');
        
     }

  }

  return (
   <div>
    <div className="bg-blue-50 h-screen w-full flex justify-center items-center">
      <div className="bg-white p-10 rounded-2xl"> 
     <h1 className="text-3xl font-bold text-center mb-3">My Todo App</h1>
     <div>
      <input className="border rounded pl-3" type="text" value={text} onChange={(e) => setText(e.target.value)} placeholder="Enter a new Todo"/>
      <button onClick={hanleAdd} className="bg-blue-500 h-8 w-15 text-white  rounded-xl ml-3">Add</button>
    </div>
    <ul>
      {
        state.map( todo => (
          <li key={todo.id} className="bg-gray-50 my-2 h-10 rounded flex justify-between p-2">
             <span style={{textDecoration: todo.completed ? 'line-through' : "none"}} onClick={() => dispatcch({type:"toggle",payload: todo.id})}>{todo.text}</span>
             <button onClick={()=> dispatcch({type:"delete",payload: todo.id})} className="text-red-900 font-bold ml-3">delete</button>
          </li>
        ))
      }
    </ul>
   </div>
 </div> 
 </div>
  )
};

export default TodoApp;
