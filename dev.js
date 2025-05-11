
const concurrently = require('concurrently');
const path = require('path');

// Run the backend and frontend concurrently
concurrently([
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
  killOthers: ['failure', 'success'],
  restartTries: 3,
  restartDelay: 1000
}).then(
  () => console.log('All processes exited with success'),
  (err) => console.error('Error occurred:', err)
);
