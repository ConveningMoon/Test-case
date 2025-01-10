// src/pages/Dashboard.tsx
import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { User } from '../types';
import '../styles/pages/Dashboard.css';

const Dashboard: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await api.get('authors/');
        // Assuming the first author is the current user
        setUser(response.data[0].user);
      } catch (err) {
        console.error(err);
      }
    };
    fetchUser();
  }, []);

  return (
    <div>
      <h2>Dashboard</h2>
      {user ? (
        <div>
          <p><strong>Username:</strong> {user.username}</p>
          <p><strong>Email:</strong> {user.email}</p>
          {/* Add more user-specific info here */}
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default Dashboard;
