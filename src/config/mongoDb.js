
require('dotenv').config();
const { MongoClient } = require('mongodb');

// Get the URI for the cluster then set AWS_ACCESS_KEY_ID as the username in the
// URI and AWS_SECRET_ACCESS_KEY as the password, then set the appropriate auth
// options. Note that MongoClient now auto-connects so no need to store the connect()
// promise anywhere and reference it.
const mongoClient = new MongoClient(process.env.MONGODB_URI, {
  auth: {
    username: process.env.AWS_ACCESS_KEY_ID,
    password: process.env.AWS_SECRET_ACCESS_KEY
  },
  authSource: '$external',
  authMechanism: 'MONGODB-AWS'
});



async function start() {
  const databases = await mongoClient.db('admin').command({ listDatabases: 1 });
  return {
    statusCode: 200,
    databases: databases
  };
};

start().then((result)=>{console.log("sukes bolo : \n");console.log(result)})
// .catch((reason)=> console.log(reason))



module.exports = {mongoClient};