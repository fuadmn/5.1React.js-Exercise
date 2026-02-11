import { useState }  from 'react';

function App(){

    const [button, setbutton] = useState(true);

    const toggle = () => {
      setbutton(!button);
    }
    return(
       <>
         <p>The button is : {button ? 'OFF' : 'ON'}</p>
         <button onClick={toggle}>Turn {button ? 'OFF' : 'ON'}</button>
       </>
    )
}

export default App;
   


