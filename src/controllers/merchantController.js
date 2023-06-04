const {
    getMerchant,
    login,
    register,
    editProfile,
    getProfileAccount,
    uploadLogo,
    uploadBaner} = require('../services/merchantServices');
const uploadFile = require('../utils/fileUpload');
const {payloadCheck} = require('../utils/payloadcheck');

async function merchantLogin(req, h) {

    const username = req.params.username;
    let password = await payloadCheck(req.payload);
    const result = await login(username, password.password);
    const isSucces = result;
    if (!isSucces) {
        const response = h.response({
            status: "rejected"
        })
        response.code(401);
        return response
    }

    const response = h.response({
        status: "succes",
        items: {
            ...result
        }
    });
    response.code(202);
    return response;

}

async function merchantRegister(req, h) {
    const {
        username,
        password,
        merchant_name
    } = await payloadCheck(req.payload);
    const result = await register(username, password, merchant_name);
    const isSucces = result;
    console.log(isSucces);
    if (!isSucces) {
        const response = h.response({
            status: "validation failed"
        })
        response.code(422)
        return response;
    }

    const response = h.response({
        status: "created",
        items: {
            ...result
        }
    })
    response.code(201);

    return response;
}

async function merchantUploadLogo(req, h) {
    const username = req.params.username;
    const isAvailable = getMerchant(username);
    if (isAvailable) {
        try {
            const responseFile = await uploadFile(req.payload.file);
            const url =  { fileUrl: responseFile.Location };
            uploadLogo(username,url.fileUrl)
            const response = h.response({
                status:"uploaded",
                "logo_url":url.fileUrl,
            })
            response.code(201)
            return response;
    
          } catch (err) {
            const response = h.response({
                "status":"fail"
            })
            response.code(422);
            return response
        }
    }
    const response = h.response({
        "status":"Merchant not found"
    })
    response.code(422);
    return response
  };

  async function merchantUploadBaner(req,h) {
    const username = req.params.username;
    const isAvailable = getMerchant(username)
    if (isAvailable) {
        try {
            const responseFile = await uploadFile(req.payload.file);
            const url = {fileUrl : responseFile.Location};
             await uploadBaner(username,url.fileUrl);
            const response = h.response({
                status:"uploaded",
                baner_url:url.fileUrl
            })
            response.code(201)
            return response;
        } catch (error) {
            const response = h.response({
                status:"fail",
            })
            response.code(422);
            return response;
        }
    }
    const response = h.response({
        status:"merchant not found",
    })
    response.code(422);
    return response;
    
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
    
            const response = h.response({
                status:"Not Merchant found"
            })
            response.code(422)
            return response
            
        } catch (error) {
            const response = h.response({
                status:"error",
                message:"make sure send request path/body"
            })
            response.code(400)
            return response
        }


  }

  async function editMerchantProfile(req,h) {
    const merchantName = req.params.username;
    const body = req.payload;
    try {
        const result = await editProfile(merchantName,body);
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
        response.code(422)
        return response    
    } catch (error) {
        console.log(error);
        const response = h.response({
            status:"some thing wrong"
        })
        response.code(400)
        return response
    }
    
  }
  

module.exports = {
    merchantLogin,
    merchantRegister,
    merchantUploadLogo,
    getMerchantProfileAccount,
    merchantUploadBaner,
    editMerchantProfile
};
