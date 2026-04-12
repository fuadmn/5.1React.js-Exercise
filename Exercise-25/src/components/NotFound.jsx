import React from 'react'
import { useParams } from 'react-router'

const NotFound = () => {

    const error = useParams();

  return (
    <div>
      <h1>Error</h1>
      <p>{error}</p>
    </div>
  )
}

export default NotFound
