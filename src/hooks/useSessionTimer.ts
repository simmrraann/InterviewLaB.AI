import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export const useSessionTimer = (isActive: boolean, onStop: () => void) => {
  const navigate = useNavigate();

  useEffect(() => {
    if (isActive) {
      // Set timer for 5 minutes (300,000 milliseconds)
      const timer = setTimeout(() => {
        onStop(); // Stop the AI call
        navigate('/feedback'); // Take the user to the feedback page
      }, 300000); 

      return () => clearTimeout(timer); // Clean up if user leaves early
    }
  }, [isActive, navigate, onStop]);
};