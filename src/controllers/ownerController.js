
const { login,register,edit } = require('../services/ownerService');

async function ownerLogin(req,h) {
    const merchantUsername = req.params.username;
    const body = req.payload;
    const result = await login(merchantUsername,body);
    try {
        if (result) {
            const response = h.response({
                status:"accepeted",
                data:{...result}
            })
            response.code(202)
            return response;
        }
        const response = h.response({
            status:"fail"
        })
        response.code(400)
        return response;
        
    } catch (error) {
        console.log(error);
        const response = h.response({
            status:"fail"
        })
        response.code(400)
        return response;
        
    }
}

async function ownerRegister(req,h) {
    const merchantUsername = req.params.username;
    const body = req.payload;
    try {
        const result = await register(merchantUsername,body)
    if (result) {
        const response = h.response({
            status: "created",
            data:{...result}
        })
        response.code(201)
        return response
    }
    const response = h.response({
        status: "fail"
    })
    response.code(400)
    return response
} catch (error) {
    console.log(error);    
    const response = h.response({
            status: "something wrong"
        })
        response.code(403)
        return response
        
    }

}

async function ownerEdit(req,h) {
    const merchantUsername = req.params.username;
    const body = req.payload;
    try {
        const result = await edit(merchantUsername,body);
    if (result) {
        const response = h.response({
            status:"accepted",
            data:{...result}
        })
        response.code(202)
        return response
    }
    const response = h.response({
        status:"rejected"
    })
    response.code(400)
    return response
    
} catch (error) {
    console.log(error);
    const response = h.response({
        status:"something wrong"
    })
    response.code(403)
    return response
    }
}

module.exports = {ownerLogin,ownerRegister,ownerEdit};