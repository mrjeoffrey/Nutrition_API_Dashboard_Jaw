import concurrently from 'concurrently';
import path from 'path';

// Run the backend and frontend concurrently
const { result } = concurrently([
  { 
    command: 'node server.js',
    name: 'backend',
    prefixColor: 'blue'
  },
  { 
    command: 'npm run dev',
    name: 'frontend',
    prefixColor: 'green'
  }
], {
  prefix: 'name',
  killOthers: ['failure'],
  restartTries: 3
});

result.catch((err) => {
  console.error('Error occurred:', err.message || err);
});
