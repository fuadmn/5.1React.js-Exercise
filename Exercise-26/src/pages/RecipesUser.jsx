import React from 'react'
import { Link, useParams } from 'react-router';

const RecipesUser = () => {

  const { id } = useParams()

    const recipe = {
    id,
    title: 'Sample Recipe',
    ingredients: [
      '2 cups flour',
      '1 cup sugar',
      '3 eggs',
      '1 cup milk'
    ],
    instructions: [
      'Mix dry ingredients',
      'Add wet ingredients',
      'Bake at 350°F for 25 minutes'
    ]
  };
  
  return (
    <div>
      <Link to="/recipe"> ← Back to Recipes</Link>
    </div>
  )
}

export default RecipesUser
