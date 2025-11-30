import { useEffect, useState } from 'react';
import axios from 'axios';

function App() {
  const [apiMessage, setApiMessage] = useState('');

  // בדיקה שהשרת רץ
  useEffect(() => {
    axios.get('http://localhost:4000/')
      .then(res => setApiMessage(res.data.message))
      .catch(err => console.error(err));
  }, []);

  // בדיקה שסופבייס עובד דרך השרת
  useEffect(() => {
    console.log('🔍 Supabase useEffect triggered - calling server API...');
    
    async function testSupabase() {
      try {
        console.log('📡 Attempting to fetch data from server API...');
        const response = await axios.get('http://localhost:4000/api/test');
        
        console.log('✅ Server API call successful!');
        console.log('📡 Supabase data from server:', response.data);
        console.log('📊 Response data:', response.data.data);
        console.log('📊 Number of records:', response.data.data?.length || 0);
      } catch (err) {
        console.error('❌ Error calling server API:', err);
        if (err.response) {
          console.error('Error response:', err.response.data);
          console.error('Error status:', err.response.status);
        } else if (err.request) {
          console.error('No response received. Is the server running?');
        } else {
          console.error('Error details:', err.message);
        }
      }
    }

    testSupabase();
  }, []);

  return (
    <div style={{ padding: '2rem', fontFamily: 'sans-serif' }}>
      <h1>Job Hunt Tracker</h1>
      <p>Backend says: {apiMessage || 'Loading...'}</p>
    </div>
  );
}

export default App;