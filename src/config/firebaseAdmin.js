require('dotenv').config();
const Boom = require('@hapi/boom');
const { payloadCheckProperties } = require('../utils/payloadcheck');
const {signInWithCustomToken} = require('firebase/auth');
const { auth } = require('./authfb');
const Jwt = require('@hapi/jwt');
var admin = require("firebase-admin");

var serviceAccount = JSON.parse(process.env.FB_SECRET_KEY);
   admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});


async function generateTokenFb (id,role) { 
    const addtionalClaims = {
    role : role
 }
try {
 const token = await admin.auth().createCustomToken(id,addtionalClaims);
const idToken = await signInWithCustomToken(auth,token);
return idToken._tokenResponse.idToken;
} catch (error) {
    console.log(error);
}
}

async function refreshTokenFb(token) {
    try {
    const {user_id,role} = payloadCheckProperties(Jwt.token.decode(token).decoded.payload,["user_id","role"],"token tidak valid, kecacatan pada:");
      const newToken = await generateTokenFb(user_id,role);
      return newToken;
    } catch (error) {
        console.log(error);
    }
}

async function rovokeTokenFb(token) {
    const {user_id} = payloadCheckProperties(Jwt.token.decode(token).decoded.payload,["user_id"],"token tidak valid, kecacatan pada:");
    try {
        await admin.auth().revokeRefreshTokens(user_id)
    return true;
    } catch (error) {
        throw Boom.badRequest(error)
    }
}

async function verifyToken(token) {
    try {
        await admin.auth().verifyIdToken(token,true);
        return true;
    } catch (error) {
       throw Boom.badRequest(error)
    }
}

module.exports = {verifyToken,refreshTokenFb,rovokeTokenFb,generateTokenFb}