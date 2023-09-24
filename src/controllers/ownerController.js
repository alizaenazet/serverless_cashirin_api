
const { login,register,edit } = require('../services/ownerService');
const catchError = require('../utils/catchError');

async function ownerLogin(req,h) {
    const merchantUsername = req.params.username;
    const body = req.payload;
    try {
        const result = await login(merchantUsername,body);
            const response = h.response({
                status:"accepeted",
                data:{...result}
            })
            response.code(202)
            return response;
    } catch (error) {
        console.log(error);
        return catchError(error)
    }
}

async function ownerRegister(req,h) {
    const merchantUsername = req.params.username;
    const body = req.payload;
    try {
    const result = await register(merchantUsername,body)
        const response = h.response({
            status: "created",
            data:{...result}
        })
        response.code(201)
        return response
} catch (error) {
    return catchError(error)
    }

}

async function ownerEdit(req,h) {
    const merchantUsername = req.params.username;
    const body = req.payload;
    try {
        const result = await edit(merchantUsername,body);
        const response = h.response({
            status:"accepted",
            data:{...result}
        })
        response.code(202)
        return response
} catch (error) {
    return catchError(error)
    }
}

module.exports = {ownerLogin,ownerRegister,ownerEdit};