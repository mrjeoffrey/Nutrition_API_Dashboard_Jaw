
import axios from 'axios';
import { toast } from 'sonner';
import { useAuth } from '@/context/AuthContext';

export const initializeDatabase = async () => {
  try {
    // We won't check for foods here anymore as it's handled by the backend seed script
    console.log('Database initialization is handled on the backend');
  } catch (error) {
    console.error('Error initializing food database:', error);
  }
};
