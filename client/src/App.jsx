import { useEffect, useState } from 'react';
import axios from 'axios';
import { supabase } from './lib/supabase';  // ← זה החיבור לסופבייס

function App() {
  const [apiMessage, setApiMessage] = useState('');

  // בדיקה שהשרת רץ
  useEffect(() => {
    axios.get('http://localhost:4000/')
      .then(res => setApiMessage(res.data.message))
      .catch(err => console.error(err));
  }, []);

  // בדיקה שסופבייס עובד
  useEffect(() => {
    console.log('🔍 Supabase useEffect triggered - starting test query...');
    
    if (!supabase) {
      console.error('❌ Supabase client is not initialized. Check your .env file.');
      return;
    }
    
    async function testSupabase() {
      try {
        console.log('📡 Attempting Supabase query...');
        const { data, error } = await supabase.from('test').select('*');

        if (error) {
          console.error('❌ Supabase error:', error);
          console.error('Error details:', {
            message: error.message,
            code: error.code,
            details: error.details,
            hint: error.hint
          });
        } else {
          console.log('✅ Supabase query successful!');
          console.log('📡 Supabase response:', data);
          console.log('📊 Number of records:', data?.length || 0);
        }
      } catch (err) {
        console.error('💥 Unexpected error in Supabase query:', err);
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