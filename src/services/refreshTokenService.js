const { refreshTokenFb } = require("../config/firebaseAdmin")
const { generateAccesToken, generateRefreshToken } = require("../utils/jwtUtils")

async function refresh(token) {
    const newToken = await refreshTokenFb(token)
    return tokens = {
        token: newToken
        }
}

module.exports = refresh