import React from 'react'
import { Link } from 'react-router';

const Categories = () => {

  const categories = [
  {
    id: 'breakfast',
    name: 'Breakfast',
    description: 'Start your day right'
  },
  {
    id: 'lunch',
    name: 'Lunch',
    description: 'Midday favorites'
  },
  {
    id: 'dinner',
    name: 'Dinner',
    description: 'Evening meals'
  },
  {
    id: 'desserts',
    name: 'Desserts',
    description: 'Sweet treats'
  }
];


  return (
    <div className='mx-auto max-w-4xl mt-5  w-full shadow-sm p-5 rounded-xl'>
      <h1 className='text-2xl font-bold mb-5'>Categories</h1>

      <div className="">
        <ul>
          {
            categories.map(category => (
              <li key={category.id}>
                <div className="flex flex-col bg-gray-200 rounded-xl py-3 pl-4 mb-5"> 
                    <Link to={`/categories/${category.id}`} className='font-bold text-xl'>{category.name}</Link>
                    <Link to={`/categories/${category.id}`}>{category.description}</Link>
                  </div>
              </li>
            ))
          }
        </ul>
      </div>
    </div>
  )
}

export default Categories
