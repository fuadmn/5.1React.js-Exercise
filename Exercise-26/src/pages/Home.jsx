import React from 'react'

const Home = () => {
  return (
    <div className='text-center mx-auto max-w-3xl mt-5'>
      <h1 className='font-bold text-4xl'>Welcome to Recipe Book</h1>
      <p className='text-xl p-2 text-gray-600 mb-5'>Discover delicious recipes and start cooking today!</p>
      <div className="md:flex md: space-x-5 space-y-5  mx-5 text-center">
        <div className=" h-40 w-full rounded-xl bg-[#fc4949] flex items-center flex-col justify-center">
          <h1 className='text-white font-extrabold text-2xl mb-1'>Browse Recipes</h1>
          <p className='text-white font-medium'>Explore our collection of delicious <br /> recipes</p>
        </div>
        <div className=" h-40 w-full rounded-xl bg-[#fc4949] flex items-center flex-col justify-center">
          <h1 className='text-white font-extrabold text-2xl mb-1'>Browse Recipes</h1>
          <p className='text-white font-medium'>Explore our collection of delicious <br /> recipes</p>
        </div>
      
       
      </div>
    </div>
  )
}

export default Home
