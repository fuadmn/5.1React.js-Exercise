import React, { useState } from 'react'

const App = () => {

  const [isChecked,setIsChecked] = useState(false);
  const[selectOption,setSelectOption] = useState()

  const [formData,setFormData] = useState({
    username: "",
    email: "",
    password: ""
  })

  const handleSubmit = (event) => {
    event.preventDefault()

    console.log(formData)
    console.log(isChecked)
    console.log(selectOption)
  }
  

  const handleChange = (e) => {
   const {name,value} = e.target 
   setFormData((prevData) => ({...prevData, [name] : value}))

   setIsChecked(e.target.checked)
  }

  return (
    
    <>
    <div className=" h-screen w-screen flex justify-center items-center bg-[#00009179]">
        <form onSubmit={handleSubmit} className='flex flex-col h-100 w-100 bg-gray-100 p-5 rounded-2xl gap-5 inset-shadow-sm inset-shadow-gray-900'>
          <input type="text" name='username'placeholder='Enter Name' value={formData.username} onChange={handleChange} className='border 1px block h-10 rounded-xl pl-5 outline-none'/>
          <input type="text" name='email'placeholder='Enter Email' value={formData.email} onChange={handleChange} className='border 1px block h-10 rounded-xl pl-5 outline-none'/>
          <input type="text" name='password' placeholder='Enter password' value={formData.password} onChange={handleChange} className='border 1px block h-10 rounded-xl pl-5 text-black outline-none'/>
          <input type="checkbox" checked={isChecked} onChange={handleChange} className=' h-5 w-5 font-bold'/>
          <select className='border 1px block h-10 rounded-xl text-xl' value={selectOption} onChange={(e) => setSelectOption(e.target.value)} >
            <option value="somalia" c>Select County</option>
            <option value="somalia">Somalia</option>
            <option value="Kenya">Kenya</option>
            <option value="Kenya">Ethiopia</option>
            <option value="Kenya">Djibouti</option>
            <option value="Kenya">South Sudan</option>
            <option value="Kenya">Sudan</option>
            <option value="Kenya">Uganda</option>
          </select>
          <button type='submit' className='bg-blue-800 rounded-xl h-10 text-white font-bold text-xl'>Submit</button>
        </form>
    </div>
     </>
  
  )
}

export default App
