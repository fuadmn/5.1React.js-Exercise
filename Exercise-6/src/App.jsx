

import { useEffect, useState } from "react";

function App(){


  const [name,setName] = useState("");
  const [greeding,setGreeding] = useState("hello,");

  useEffect(() =>{
   if(!name){  
     document.title = 'Welcome!';
   }else{
     document.title = `${greeding}, ${name}`;
   }
  },[name,greeding]);

  return(
    <div>
      <h3>Enter Your Name:</h3>
      <input type="text" value={name} onChange={(e) => setName(e.target.value)}/>
      <h3>Choose a Greeding</h3>
      <input type="text" value={greeding} onChange={(e) => setGreeding(e.target.value)}/>
    </div>
  )
}

export default App;