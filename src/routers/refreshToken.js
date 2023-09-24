const {refreshToken} = require('../controllers/refreshTokenController');

const route = {
                method:"POST",
                path:"/refresh/token",
                options:{
                    handler:refreshToken,
                    auth:"refreshAuth"
                    }
                }

module.exports = route;
        