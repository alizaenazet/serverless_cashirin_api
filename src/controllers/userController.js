const {login,singup,remove,edit,get} = require('../services/userServices');
const catchError = require('../utils/catchError');

async function userLogin(req,h) {
    const merchant = req.params.username 
    const body =  req.payload;
    try {
        const result = await login(merchant,body)
            const response = h.response({
                status: "accepted",
                data:{
                    ...result
                }
            })
        response.code(202)
        return response
} catch (error) {
    return catchError(error)
    }
}

async function userSingup(req,h) {
    const merchant =  req.params.username;
    const body = req.payload;
    try {
       const result = await singup(merchant,body);
        const response = h.response({
            status:"created",
            data:{...result}
        })
        response.code(201);
        return response;
} catch (error) {
    return catchError(error)
   } 
}

async function userDelete(req,h) {
    const merchantUsername = req.params.username
    const userId = req.params.id;
    try {
    const result = await remove(merchantUsername,userId);
        const response =  h.response()
        response.code(204)
        return response;
} catch (error) {
        return catchError(error)
    }
}

async function userEdit(req,h) {
    const merchantUsername = req.params.username;
    const userId = req.params.id;
    try {
    const body = req.payload;
     const result = await edit(merchantUsername,userId,body)
        const response = h.response({
            status:"succes",
            data:{...result}
        })
        response.code(202)
        return response
} catch (error) {
    return catchError(error)}
}

async function userGet(req,h) {
    const merchantUsername = req.params.username;
    const userId = req.params.id;
    try {
        const result = await get(merchantUsername,userId)
        const respons = h.response({
            "status": "accepted",
            data: {...result}
        })
        respons.code(202)
        return respons;
} catch (error) {
    return catchError(error);
}
    
}

module.exports = {userLogin,userSingup,userDelete,userEdit,userGet}

