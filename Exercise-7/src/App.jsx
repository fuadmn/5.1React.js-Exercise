import React, { useState, useEffect } from 'react';

const MouseTracker = () => {
  const [coords, setCoords] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e) => {
      setCoords({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);

    // Cleanup
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []); // Runs once on mount

  return (
    <div>
      <p>Mouse X: {coords.x}</p>
      <p>Mouse Y: {coords.y}</p>
    </div>
  );
};

export default MouseTracker;
