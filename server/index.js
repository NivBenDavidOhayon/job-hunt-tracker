import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';
import authRoutes from './routes/auth.js';
import jobsRoutes from './routes/jobs.js';
import configData from './config.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());
app.use('/auth', authRoutes);
app.use('/jobs', jobsRoutes);

const config = configData || {};
console.log('📦 Config file loaded successfully');

console.log('🔍 Debug - Checking environment variables:');
console.log('  process.env.SUPABASE_URL:', process.env.SUPABASE_URL || 'undefined');
console.log(
  '  process.env.SUPABASE_SERVICE_ROLE_KEY:',
  process.env.SUPABASE_SERVICE_ROLE_KEY
    ? '***' + process.env.SUPABASE_SERVICE_ROLE_KEY.slice(-4)
    : 'undefined'
);
console.log(
  '  process.env.SUPABASE_SERVICE_KEY:',
  process.env.SUPABASE_SERVICE_KEY
    ? '***' + process.env.SUPABASE_SERVICE_KEY.slice(-4)
    : 'undefined'
);
console.log('  config.SUPABASE_URL:', config.SUPABASE_URL || 'undefined');
console.log(
  '  config.SUPABASE_SERVICE_KEY:',
  config.SUPABASE_SERVICE_KEY ? '***' + config.SUPABASE_SERVICE_KEY.slice(-4) : 'undefined'
);

const supabaseUrl = process.env.SUPABASE_URL || config.SUPABASE_URL;
const supabaseServiceKey =
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
  process.env.SUPABASE_SERVICE_KEY ||
  config.SUPABASE_SERVICE_KEY;

console.log('📋 Final values:');
console.log('  supabaseUrl:', supabaseUrl || 'undefined');
console.log(
  '  supabaseServiceKey:',
  supabaseServiceKey ? '***' + supabaseServiceKey.slice(-4) : 'undefined'
);

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing Supabase environment variables!');
  console.error('Required: SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY (or SUPABASE_SERVICE_KEY)');
}

const supabase = supabaseUrl && supabaseServiceKey ? createClient(supabaseUrl, supabaseServiceKey) : null;

app.get('/', (req, res) => {
  res.json({ message: 'Job Hunt Tracker API is running' });
});

app.get('/api/test', async (req, res) => {
  try {
    if (!supabase) {
      return res.status(500).json({
        error: 'Supabase client is not initialized',
        message: 'Please check your server .env file for SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY',
      });
    }

    console.log('📡 Server: Executing Supabase query...');
    const { data, error } = await supabase.from('tests').select('*');

    if (error) {
      console.error('❌ Server: Supabase error:', error);
      return res.status(500).json({
        error: 'Supabase query failed',
        details: {
          message: error.message,
          code: error.code,
          details: error.details,
          hint: error.hint,
        },
      });
    }

    console.log('✅ Server: Supabase query successful, returning data');
    res.json({
      success: true,
      data: data,
      count: data?.length || 0,
    });
  } catch (err) {
    console.error('💥 Server: Unexpected error:', err);
    res.status(500).json({
      error: 'Internal server error',
      message: err.message,
    });
  }
});

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
  if (supabase) {
    console.log('✅ Supabase client initialized');
  } else {
    console.log('⚠️  Supabase client not initialized - check your .env file');
  }
});