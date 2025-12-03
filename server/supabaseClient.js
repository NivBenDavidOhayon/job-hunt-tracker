// server/supabaseClient.js
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

let config;
try {
  // Optional config file fallback
  config = require('./config');
} catch (err) {
  config = {};
}

const supabaseUrl =
  process.env.SUPABASE_URL || config.SUPABASE_URL || null;

const supabaseServiceKey =
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
  process.env.SUPABASE_SERVICE_KEY ||
  config.SUPABASE_SERVICE_KEY ||
  null;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing Supabase environment variables for storage client');
}

const supabase =
  supabaseUrl && supabaseServiceKey
    ? createClient(supabaseUrl, supabaseServiceKey)
    : null;

module.exports = supabase;


