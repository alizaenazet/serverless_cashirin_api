require('dotenv').config();
const Jwt = require('@hapi/jwt');
const Boom = require('@hapi/boom');
const axios = require('axios');

// const fbadmin = require('../config/firebase');

// async function generateAccesTokenFb (id,role) { 
//     const addtionalClaims = {
//     role : role
//  }
// try {
// return await fbadmin.fbAdmin.auth().createCustomToken(id,addtionalClaims);
// } catch (error) {
//     console.log();
// }
// }
async function verifyKidTokenFb(kid) {
    const response = await axios.get("https://www.googleapis.com/robot/v1/metadata/x509/securetoken@system.gserviceaccount.com")
    const data = response.data;
    const publicKid = Object.keys(data);
    if (!publicKid.includes(kid)) {
       throw Boom.unauthorized()
    }
    return true;
}


function generateAccesToken(username,role,audience) {
const token = Jwt.token.generate(
    {
        aud: audience, // peruntukan penerima token 
        iss: 'http://www.api.cashirin.com', // pembuat token
        user: username, // identitas pengguna token
        role: role
    },
    {
        key:process.env.ACCESS_TOKEN_SECRET, 
        algorithm: 'HS256' 
    },
    {
        ttlSec: 2700 // usia token berlaku dalam detik (3600=1 jam)
    }
)
return token;
}



function generateRefreshToken(username,role,audience) {
const token = Jwt.token.generate(
    {
        aud: audience, // peruntukan penerima token 
        iss: 'http://www.api.cashirin.com', // pembuat token
        user: username, // identitas pengguna token
        role: role
    },
    
    {
        key:process.env.REFRESH_TOKEN_SECRET, 
        algorithm: 'HS256' 
    },
    {
        ttlSec: 6000 // usia token berlaku dalam detik (3600=1 jam)
    }
)
return token;
}

module.exports = {generateAccesToken,generateRefreshToken,verifyKidTokenFb}
