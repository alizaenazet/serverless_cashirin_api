const refresh = require('../services/refreshTokenService');
const catchError = require('../utils/catchError');


 async function refreshToken(req,h) {
    const token  = req.auth.artifacts;
    const result = await refresh(token);
    try {
        if (refresh) {
            const response = h.response({
                status:"succes",
                ...result
            })
            response.code(201)
            return response;
        }
        
        
    } catch (error) {
        return catchError(error)
    }

}

module.exports = {refreshToken}


