import React from 'react'
import { Link } from 'react-router';

const Recipes = () => {

  // Sample recipe data
const recipes = [
  {
    id: 1,
    title: 'Classic Chocolate Cake',
    description: 'Rich and moist chocolate cake perfect for any occasion',
    category: 'desserts'
  },
  {
    id: 2,
    title: 'Spaghetti Carbonara',
    description: 'Traditional Italian pasta with creamy egg sauce',
    category: 'dinner'
  },
  {
    id: 3,
    title: 'Greek Salad',
    description: 'Fresh Mediterranean salad with feta cheese',
    category: 'lunch'
  },
  {
    id: 4,
    title: 'Breakfast Smoothie Bowl',
    description: 'Healthy and colorful breakfast bowl',
    category: 'breakfast'
  }
];
  return (
    <div className='mx-auto max-w-4xl'>
      <h1 className=' font-bold text-2xl my-3 ml-4'>All Recipes</h1>
      <div className="">
        <ul className='grid md:grid-cols-3   gap-5'>
          {
            recipes.map(box => (
              <li key={box.id}>
               <div className="flex flex-col  m-5 h-40 w-full my-5  rounded-2xl shadow-sm p-3">
                  <Link to={`/recipes/${box.id}`} className='font-bold text-xl my-2'>{box.title}</Link>
                  <Link to={`/recipes/${box.id}`} className='text-[0.9rem]'>{box.description}</Link>
                  <Link to={`/recipes/${box.id}`} className=' h-7 w-22 rounded-xl pl-3 bg-gray-200 mt-4'>{box.category}</Link>
               </div>
              </li>
            ))
          }
        </ul>
      </div>
    </div>
  )
}

export default Recipes
