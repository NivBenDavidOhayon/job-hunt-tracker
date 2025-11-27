import { useEffect, useState } from 'react';
import axios from 'axios';

function App() {
  const [apiMessage, setApiMessage] = useState('');

  useEffect(() => {
    axios.get('http://localhost:4000/')
      .then(res => setApiMessage(res.data.message))
      .catch(err => console.error(err));
  }, []);

  return (
    <div style={{ padding: '2rem', fontFamily: 'sans-serif' }}>
      <h1>Job Hunt Tracker</h1>
      <p>Backend says: {apiMessage || 'Loading...'}</p>
    </div>
  );
}

export default App;
