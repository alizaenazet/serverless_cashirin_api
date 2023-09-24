const Boom = require('@hapi/boom');
const Jwt = require('@hapi/jwt');
const {
    getMerchant,
    logout,
    deleteImage,
    uploadImage,
    login,
    register,
    editProfile,
    getProfileAccount,
    uploadLogo,
    uploadBaner} = require('../services/merchantServices');
const {newUploadFile} = require('../utils/fileUpload');
const {payloadCheck} = require('../utils/payloadcheck');
const catchError = require('../utils/catchError');
const { response } = require('@hapi/hapi/lib/auth');

async function checkMerchantAuth(username,token) {
    const user = token.credentials.user;
    const merchant = await getMerchant(username)
    if (!merchant) throw Boom.badRequest("invalid merchant username");
        if (user != merchant.owner) {
            throw Boom.unauthorized("merchant not allowed")        
        }
        return true;
}

async function merchantLogin(req, h) {
    const payload = req.payload;
    const username = req.params.username;
    try {
        const result = await login(username,payload);
    const response = h.response({
        status: "succes",
        items: {
            ...result
        }
    });
    response.code(202);
    return response;

    } catch (error) {
       return catchError(error);
    }
}

async function merchantRegister(req, h) {
    const payload = req.payload;
    try {
        const result = await register(payload);
    const response = h.response({
        status: "created",
        items: {
            ...result
        }
    })
    response.code(201);
    return response;
    } catch (error) {
        console.log(error);
        return catchError(error);
    }
}

async function merchantUploadLogo(req, h) {
    const token = req.auth;
    const {username} = req.params
    try {
        checkMerchantAuth(username,token)
            const responseFile = await newUploadFile(req.payload.file);
            const url =  responseFile;
            uploadLogo(username,url)
            const response = h.response({
                status:"uploaded",
                "logo_url":url,
            })
            response.code(201)
            return response;
          } catch (err) {
            // console.log(err);
            return catchError(err);
        }
  };

  async function merchantUploadBaner(req,h) {
      const {username} = req.params;
      const token = req.auth;
      try {
        checkMerchantAuth(username,token)
            const responseFile = await newUploadFile(req.payload.file);
             const url = responseFile
             uploadBaner(username,url);
            const response = h.response({
                status:"uploaded",
                baner_url:url
            })
            response.code(201)
            return response;
        } catch (error) {
            return catchError(error);
        }
    }
  async function getMerchantProfileAccount(req,h) {
        const username = req.params.username;
        try {
            const result = await getProfileAccount(username)
            if (result) {
                const response = h.response({
                    status:"accepted",
                    data:{
                        ...result
                    }
                }
                )
                response.code(202)
                return response;
            }
           throw Boom.badRequest("merchant not found")
            
        } catch (error) {
            return catchError(error)
        }


  }

  async function editMerchantProfile(req,h) {
    const username = req.params.username;
    const body = req.payload;
    const token = req.auth;
    try {
        await checkMerchantAuth(username,token)
        const result = await editProfile(username,body);
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

  async function logoutMerchant(req,h) {
    const token = req.auth.artifacts
    try {
        const result = await logout(token);
    const response = h.response()
    response.code(204);
    return response;
    } catch (error) {
        console.log(error);
        return catchError(error);
    }
  }
  

  async function uploadImageCollection(req,h) {
    const {username} = req.params;
    const token = req.auth;;
    try {
        checkMerchantAuth(username,token)
        const url = await newUploadFile(req.payload.file);
        await uploadImage(username,url)
        const response = h.response()
        response.code(204)
        return response;
    } catch (error) {
        return catchError(error)
    }
  }

async function deleteImageCollection(req,h) {
    const {image_url} = req.payload;
    const username = req.params.username;
    try {
        await deleteImage(username,image_url)
        const response = h.response();
        response.code(204);
        return response;
    } catch (error) {
        console.log(error);
        return catchError(error)
    }
    
}

module.exports = {
    merchantLogin,
    merchantRegister,
    merchantUploadLogo,
    getMerchantProfileAccount,
    merchantUploadBaner,
    editMerchantProfile,
    logoutMerchant,
    uploadImageCollection,
    deleteImageCollection
};
