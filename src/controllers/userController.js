const {login,singup,remove,edit,get} = require('../services/userServices');

async function userLogin(req,h) {
    const merchant = req.params.username 
    const body =  req.payload;
    try {
        const result = await login(merchant,body)
        if (result) {
            const response = h.response({
                status: "accepted",
                data:{
                    ...result
                }
            })

        response.code(202)
        return response
    }
    const response = h.response({
        status:"rejected"
    })
    response.code(401)
    return response
} catch (error) {
    console.log(error);
        const response = h.response({
            status:"something wrong"
        })
        response.code(404)
        return response
    }
}

async function userSingup(req,h) {
    const merchant =  req.params.username;
    const body = req.payload;
    try {
       const result = await singup(merchant,body);
       if (result) {
        const response = h.response({
            status:"created",
            data:{...result}
        })
        response.code(201);
        return response;
    }
    const response = h.response({
        status:"fail"
    })
    response.code(400);
    return response;
    
} catch (error) {
    console.log(error);
    const response = h.response({
        status:error
    })
    response.code(501);
    return response;
   } 
}

async function userDelete(req,h) {
    const merchantUsername = req.params.username
    const userId = req.params.id;
    try {
    const result = await remove(merchantUsername,userId);
    if (result) {
        const response =  h.response({
            // no content
        })

        response.code(204)
        return response;
    }

    const response = h.response({
        status:"fail"
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

async function userEdit(req,h) {
    const merchantUsername = req.params.username;
    const userId = req.params.id;
    const body = req.payload ? req.payload : false;
    try {
        
if(body){
     const result = await edit(merchantUsername,userId,body)
    if (result) {
        const response = h.response({
            status:"succes",
            data:{...result}
        })
        response.code(202)
        return response
    }
        }
    const response = h.response({
        status:"fail"
    })
    response.code(400)
    return response
} catch (error) {
    console.log(error);
    const response = h.response({
        status:"something wrong"
    })
    response.code(403)

    }
}

async function userGet(req,h) {
    const merchantUsername = req.params.username;
    const userId = req.params.id;
    try {
        const result = await get(merchantUsername,userId)
    if (result) {
        const respons = h.response({
            "status": "accepted",
            data: {...result}
        })
        respons.code(202)
        return respons;
    }
    const respons = h.response({
        "status": "fail",
    })
    respons.code(400)
    return respons;
} catch (error) {
    console.log(error);
    const respons = h.response({
        "status": "something wrong",
    })
    respons.code(403)
    return respons;

    }
    
}

module.exports = {userLogin,userSingup,userDelete,userEdit,userGet}

