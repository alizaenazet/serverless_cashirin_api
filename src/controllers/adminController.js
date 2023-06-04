const {register,login,remove,edit,get} = require('../services/adminService');

async function adminRegister(req,h) {
    const merchantUsername = req.params.username
    const body = req.payload;
    try {
        const result = await register(merchantUsername,body)
    if (result) {
        const response = h.response({
            status:"created",
            data:{...result}
        })
        response.code(201)
        return response
        
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

async function loginAdmin(req,h) {
    const merchantUsername = req.params.username;
    const body = req.payload;
    const result = await login(merchantUsername,body);
    try {
        if (result) {
            const response = h.response({
                status:"accepted",
                data:{...result}
            })
            response.code(201)
            return response
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

async function adminDelete(req,h) {
    const merchantUsername = req.params.username;
    const adminId = req.params.id;
    const result = await remove(merchantUsername,adminId);
    try {
        if (result) {
            const response = h.response({
            })
            response.code(204)
            return response
        }
        const response = h.response({
            message:"fail"
        })
        response.code(400)
        return response
    } catch (error) {
        console.log(error);
        const response = h.response({
            message:"something wrong"
        })
        response.code(403)
        return response
        
    }
}

async function adminEdit(req,h) {
     const merchantUsername = req.params.username;
     const adminId = req.params.id
     const body = req.payload
    try {
        const result = await edit(merchantUsername,adminId,body)
        if (result) {
           const response = h.response({
               status:"succes",
               data:{...result}
           })
           response.code(202)
           return response
       }
       const response = h.response({
           status:"fail"
       })
       response.code(400)
       return response
    } catch (error) {
        console.log(error);
        const response = h.response({
            status:"fail"
        })
        response.code(403)
        return response
    }

}


async function getAdmin(req,h) {
    const merchantUsername = req.params.username
    const adminId = req.params.id;

    try {
        const result = await get(merchantUsername,adminId)
    if (result) {
        const response = h.response({
            status:"accepted",
            data:{...result}
        })
        response.code(202)
        return response
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

module.exports = {adminRegister,loginAdmin,adminDelete,adminEdit,getAdmin}