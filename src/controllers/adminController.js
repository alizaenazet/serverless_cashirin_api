const {register,login,remove,edit,get} = require('../services/adminService');
const catchError = require('../utils/catchError');

async function adminRegister(req,h) {
    const merchantUsername = req.params.username
    const body = req.payload;
    try {
        const result = await register(merchantUsername,body)
        const response = h.response({
            status:"created",
            data:{...result}
        })
        response.code(200)
        return response
} catch (error) {
    console.log(error);
  return  catchError(error)    
    }

}

async function loginAdmin(req,h) {
    const merchantUsername = req.params.username;
    const body = req.payload;
    const result = await login(merchantUsername,body);
    try {
            const response = h.response({
                status:"accepted",
                data:{...result}
            })
            response.code(201)
            return response
    } catch (error) {
        console.log(error);
      return  catchError(error)
    }
    
}

async function adminDelete(req,h) {
    const params = req.params;
    await remove(params);
    try {
            const response = h.response();
            response.code(204)
            return response
    } catch (error) {
        console.log(error);
        return catchError(error)
    }
}

async function adminEdit(req,h) {
     const params = req.params;
     const body = req.payload
    try {
        const result = await edit(params,body)
           const response = h.response({
               status:"succes",
               data:{...result}
           })
           response.code(202)
           return response;
    } catch (error) {
        console.log(error);
        return catchError(error)
    }

}


async function getAdmin(req,h) {
    const params = req.params

    try {
        const result = await get(params)
        const response = h.response({
            status:"accepted",
            data:{...result}
        })
        response.code(202)
        return response

} catch (error) {
    console.log(error);
    return catchError(error)
    }
}

module.exports = {adminRegister,loginAdmin,adminDelete,adminEdit,getAdmin}