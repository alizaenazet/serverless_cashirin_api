require('dotenv').config();
const validator = require('validator');
const Jwt = require('@hapi/jwt');
const { verifyToken } = require('../config/firebaseAdmin');
const Boom  = require('@hapi/boom');
const { verifyKidTokenFb } = require('./jwtUtils');
const sequelize = require('../config/mysql');
const catchError  = require('./catchError');
const { response } = require('@hapi/hapi/lib/auth');

async function authenticateMerchantAccount(token,merchantUsername){
    const accountId = token.decoded.payload.user_id;
    const query = `SELECT * FROM account WHERE merchant_username="${merchantUsername}" AND id="${accountId}" `;
    const [result,metadata] = await sequelize.query(query);
    if (result.length < 1) throw Boom.badRequest("merchant and account not match or account not found")
    return true;
}

async function authenticateMerchantUsername(token,username) {
    const merchantId = token.decoded.payload.user_id;
        const query = `SELECT * FROM merchant WHERE id="${merchantId}" AND username="${username}" `
        const [result,metadata] = await sequelize.query(query);
        if (result.length < 1) throw Boom.badRequest("merchant and token not match")
        return true;
    
}

const refreshTokenScheme = function (server, options) {
    return {
        authenticate: async function (request, h) {
            const req = request.raw.req;
            const authorization = (req.headers.authorization);
            if (!authorization) {
                throw Boom.unauthorized("no tokens");
            }
            const token = authorization.replace('Bearer ', '');
            const tokenDecode = Jwt.token.decode(token);
            try {
               await verifyKidTokenFb(tokenDecode.decoded.header.kid);
                Jwt.token.verifyPayload(tokenDecode,{
                    aud:"cashirin-e20f3",
                    iss:"https://securetoken.google.com/cashirin-e20f3",
                    sub:false,
                    nbf:true,
                    exp:false,
                    maxAgeSec: 26400,
                    timeSkewSec: 15
                })
            } catch (error) {

               return catchError(error)
            }
            return h.authenticated({
                 credentials: { user: tokenDecode.decoded.payload.user_id },
                 artifacts: token
            });
        }
    };
};

const merchantScheme = function (server, options) {
    return {
        authenticate: async function (request, h) {
            try {
            const req = request.raw.req;
            const merchantUsername = request.params.username || false;
            const authorization = (req.headers.authorization);
            if (!authorization) throw Boom.unauthorized("no tokens");
            const token = authorization.replace('Bearer ', '');
            const tokenDecode = Jwt.token.decode(token);
            if (tokenDecode.decoded.payload.role != "merchant") throw Boom.unauthorized("invalid account type")
            if (merchantUsername) await authenticateMerchantUsername(tokenDecode,merchantUsername);
            await verifyKidTokenFb(tokenDecode.decoded.header.kid);
                Jwt.token.verifyPayload(tokenDecode,{
                    aud:"cashirin-e20f3",
                    iss:"https://securetoken.google.com/cashirin-e20f3",
                    sub:false,
                    nbf:true,
                    exp:true,
                    maxAgeSec: 3600,
                    timeSkewSec: 15
                })
                await verifyToken(token);
                return h.authenticated({ credentials: { 
                    user: tokenDecode.decoded.payload.user_id },
                    artifacts: token
                });
            } catch (error) {
                throw Boom.badRequest(error)
            }
        }
    };
};
const userScheme = function (server, options) {
    return {
        authenticate: async function (request, h) {
            try {
            const req = request.raw.req;
            const  merchantUsername = request.params.username || false;
            const authorization = (req.headers.authorization);
            if (!authorization) {
                throw Boom.unauthorized("no tokens");
            }
            const token = authorization.replace('Bearer ', '');
            const tokenDecode = Jwt.token.decode(token);
            if (tokenDecode.decoded.payload.role != "user") throw Boom.unauthorized("invalid account type")
               await verifyKidTokenFb(tokenDecode.decoded.header.kid);
                Jwt.token.verifyPayload(tokenDecode,{
                    aud:"cashirin-e20f3",
                    iss:"https://securetoken.google.com/cashirin-e20f3",
                    sub:false,
                    nbf:true,
                    exp:true,
                    maxAgeSec: 3600,
                    timeSkewSec: 15
                })
                if (merchantUsername) await authenticateMerchantAccount(tokenDecode,merchantUsername);
                await verifyToken(token);
                return h.authenticated({ credentials: { 
                    user: tokenDecode.decoded.payload.user_id },
                    artifacts: token
                });
            } catch (error) {
               throw Boom.badRequest(error)
            }
        }
    };
};

const ownerScheme = function (server, options) {
    return {
        authenticate: async function (request, h) {
            const req = request.raw.req;
            const  merchantUsername = request.params.username || false;
            const authorization = (req.headers.authorization);
            if (!authorization) {
                throw Boom.unauthorized("no tokens");
            }
            const token = authorization.replace('Bearer ', '');
            const tokenDecode = Jwt.token.decode(token);
            if (tokenDecode.decoded.payload.role != "owner") throw Boom.unauthorized("invalid account type")
            try {
               await verifyKidTokenFb(tokenDecode.decoded.header.kid);
                Jwt.token.verifyPayload(tokenDecode,{
                    aud:"cashirin-e20f3",
                    iss:"https://securetoken.google.com/cashirin-e20f3",
                    sub:false,
                    nbf:true,
                    exp:true,
                    maxAgeSec: 3600,
                    timeSkewSec: 15
                })
                if (merchantUsername) await authenticateMerchantAccount(tokenDecode,merchantUsername);
                await verifyToken(token);
            } catch (error) {
               throw Boom.badRequest(error)
            }
            return h.authenticated({ credentials: { 
                user: tokenDecode.decoded.payload.user_id },
                artifacts: token
            });
        }
    };
};


const ownerUserScheme = function (server, options) {
    return {
        authenticate: async function (request, h) {
            const req = request.raw.req;
            const  merchantUsername = request.params.username || false;
            const authorization = (req.headers.authorization);
            if (!authorization) {
                throw Boom.unauthorized("no tokens");
            }
            const token = authorization.replace('Bearer ', '');
            const tokenDecode = Jwt.token.decode(token);
            const roleAccepted = ["owner","user"]
            if (!roleAccepted.includes(tokenDecode.decoded.payload.role)) throw Boom.unauthorized("invalid account type")
            try {
               await verifyKidTokenFb(tokenDecode.decoded.header.kid);
                Jwt.token.verifyPayload(tokenDecode,{
                    aud:"cashirin-e20f3",
                    iss:"https://securetoken.google.com/cashirin-e20f3",
                    sub:false,
                    nbf:true,
                    exp:true,
                    maxAgeSec: 3600,
                    timeSkewSec: 15
                })
                if (merchantUsername) await authenticateMerchantAccount(tokenDecode,merchantUsername);
                await verifyToken(token);
            } catch (error) {
               throw Boom.badRequest(error)
            }
            return h.authenticated({ credentials: { 
                user: tokenDecode.decoded.payload.user_id },
                artifacts: token
            });
        }
    };
};

const ownerAdminScheme = function (server, options) {
    return {
        authenticate: async function (request, h) {
            const req = request.raw.req;
            const  merchantUsername = request.params.username || false;
            const authorization = (req.headers.authorization);
            if (!authorization) {
                throw Boom.unauthorized("no tokens");
            }
            const token = authorization.replace('Bearer ', '');
            const tokenDecode = Jwt.token.decode(token);
            const roleAccepted = ["owner","admin"]
            if (!roleAccepted.includes(tokenDecode.decoded.payload.role)) throw Boom.unauthorized("invalid account type")
            try {
               await verifyKidTokenFb(tokenDecode.decoded.header.kid);
                Jwt.token.verifyPayload(tokenDecode,{
                    aud:"cashirin-e20f3",
                    iss:"https://securetoken.google.com/cashirin-e20f3",
                    sub:false,
                    nbf:true,
                    exp:true,
                    maxAgeSec: 3600,
                    timeSkewSec: 15
                })
                if (merchantUsername) await authenticateMerchantAccount(tokenDecode,merchantUsername);
                await verifyToken(token);
            } catch (error) {
               throw Boom.badRequest(error)
            }
            return h.authenticated({ credentials: { 
                user: tokenDecode.decoded.payload.user_id },
                artifacts: token
            });
        }
    };
};

const allRoleScheme = function (server, options) {
    return {
        authenticate: async function (request, h) {
            const req = request.raw.req;
            const  merchantUsername = request.params.username || false;
            const authorization = (req.headers.authorization);
            if (!authorization) {
                throw Boom.unauthorized("no tokens");
            }
            const token = authorization.replace('Bearer ', '');
            const tokenDecode = Jwt.token.decode(token);
            const roleAccepted = ["owner","admin","merchant","user"]
            if (!roleAccepted.includes(tokenDecode.decoded.payload.role)) throw Boom.unauthorized("invalid account type")
            try {
               await verifyKidTokenFb(tokenDecode.decoded.header.kid);
                Jwt.token.verifyPayload(tokenDecode,{
                    aud:"cashirin-e20f3",
                    iss:"https://securetoken.google.com/cashirin-e20f3",
                    sub:false,
                    nbf:true,
                    exp:true,
                    maxAgeSec: 3600,
                    timeSkewSec: 15
                })
                if (merchantUsername) await authenticateMerchantAccount(tokenDecode,merchantUsername);
                await verifyToken(token);
            } catch (error) {
               throw Boom.badRequest(error)
            }
            return h.authenticated({ credentials: { 
                user: tokenDecode.decoded.payload.user_id },
                artifacts: token
            });
        }
    };
};




module.exports = {refreshTokenScheme,allRoleScheme,ownerAdminScheme,merchantScheme,userScheme,ownerScheme,ownerUserScheme};