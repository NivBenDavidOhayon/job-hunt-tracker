// server/prismaClient.js

require('dotenv').config();

const { PrismaClient } = require('@prisma/client');
const { PrismaPg } = require('@prisma/adapter-pg');
const { Pool } = require('pg');

// ה-connection string של Supabase שלך
const connectionString = process.env.DATABASE_URL;

// יוצרים pool ל-Postgres
const pool = new Pool({
  connectionString,
});

// יוצרים adapter לפי Prisma 7
const adapter = new PrismaPg(pool);

// זה הלקוח הסופי שמשתמש בכל הפרויקט
const prisma = new PrismaClient({
  adapter,
});

module.exports = prisma;
