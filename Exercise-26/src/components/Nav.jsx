import React from 'react'
import { NavLink } from 'react-router'

const Nav = () => {
  return (
    <div className="h-16 shadow-lg text-gray-900">
        <header className="flex justify-around p-4 text-center">
          <h1 className="text-2xl font-bold text-red-500">My App</h1>
     <nav className='flex justify-center gap-6 py-4 '>
        <NavLink className={({isActive}) => isActive ? 'font-bold underline text-red-700' : undefined } to="/" >Home</NavLink>
        <NavLink className={({isActive}) => isActive ? 'font-bold underline text-red-700' : undefined } to="/recipes" >Recipes</NavLink>
        <NavLink className={({isActive}) => isActive ? 'font-bold underline text-red-700' : undefined } to="/categories" >Categories</NavLink>
      </nav>
     </header>
    </div>
  )
}

export default Nav
