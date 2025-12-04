// server/prismaClient.js

require('dotenv').config();

const { PrismaClient } = require('@prisma/client');
const { PrismaPg } = require('@prisma/adapter-pg');
const { Pool } = require('pg');

// חשוב: חיבור ל־Supabase Postgres מה־.env
const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  throw new Error('DATABASE_URL is not set in .env');
}

const pool = new Pool({
  connectionString,
});

// adapter לפי Prisma 7 (engine type "client")
const adapter = new PrismaPg(pool);

// 👈 זה ה־Client היחיד שצריך בכל הפרויקט
const prisma = new PrismaClient({
  adapter,
});

module.exports = prisma;
