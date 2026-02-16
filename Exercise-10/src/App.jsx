import React, { useState, useEffect } from 'react';

const UserList = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch('https://jsonplaceholder.typicode.com/users');
        const data = await response.json();
        setUsers(data);
      } catch (error) {
        console.error('Error fetching users:', error);
      } finally {
        // Whether success or error, stop the loading state
        setLoading(false);
      }
    };

    // Trigger the fetch when the component mounts
    fetchUsers();
  }, []); // Runs only once on mount

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <div>
      <h2>List of Users</h2>
      <ul>
        {users.map((u) => (
          <li key={u.id}>{u.name}</li>
        ))}
      </ul>
    </div>
  );
};

export default UserList;
