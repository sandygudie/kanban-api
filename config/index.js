// if (process.env.NODE_ENV === "production") {
//     require("dotenv").config({ path: `.env.prod` });
//   } else {
//     require("dotenv").config({ path: ".env.local" });
//   }
require('dotenv').config({ path: '.env.local' })

const {
  MONGODB_URI,
  PORT,
  DB_HOST,
  DB_USER,
  DB_PASSWORD,
  DB_NAME,
  GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET,
  COOKIE_KEY,
  CLIENT_URL
} = process.env

module.exports = {
  MONGODB_URI,
  PORT,
  DB_HOST,
  DB_USER,
  DB_PASSWORD,
  DB_NAME,
  GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET,
  COOKIE_KEY,
  CLIENT_URL
}
