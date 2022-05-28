/* eslint-disable linebreak-style */
/* eslint-disable eol-last */
/* eslint-disable linebreak-style */
/* eslint-disable operator-linebreak */
// Build the process.env object
// eslint-disable-next-line linebreak-style

require('dotenv').config();

// eslint-disable-next-line operator-linebreak
// eslint-disable-next-line linebreak-style
// eslint-disable-next-line operator-linebreak
// eslint-disable-next-line linebreak-style
module.exports =
{
  databaseUserName: process.env.USER,
  databasePassword: process.env.PASSWORD,
  databaseName: process.env.DATABASE,
  databaseHost: process.env.HOST,
};