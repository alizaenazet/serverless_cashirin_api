const {getAll,get,create, remove,edit,reStock} = require('../services/productService');
const catchError = require('../utils/catchError');


async function getProducts(req,h) {
    const merchantUsername = req.params.username
    try {
        const result = await getAll(merchantUsername);
        const response = h.response({
            status:"succes",
            data:result
        })
        response.code(200)
        return response;
} catch (error) {
console.log(error);    
    return catchError(error)
    }
}


async function getProduct(req,h) {
    const merchantId = req.params.username;
    const productId = req.params.productId;
    try {
        const result = await get(merchantId,productId);
        const response = h.response({
            status:"succes",
            data: result[0]
        })
        response.code(202)
        return response;
} catch (error) {
    console.log(error);
    return catchError(error)
    }
}

async function createProduct(req,h) {
    const merchantId = req.params.id;
    const body = req.payload;
    try {
        const result = await create(merchantId,body)
        const response = h.response({
            status:"created",
            data:{...result}
        })
        response.code(201)
        return response
} catch (error) {
    console.log(error);
    return catchError(error)
    }
}


async function  deleteProduct(req,h) {
    const merchantId = req.params.id;
    const productId = req.params.productId;
    try {
        const result = await remove(merchantId,productId)
            const response = h.response({
            })
            response.code(204);
            return response;
    } catch (error) {
            console.log(error);        
        return catchError(error)
    }
}

async function editProduct(req,h) {
    const merchantId = req.params.id;
    const productId = req.params.productId;
    const body = req.payload;
    try {
        const result = await edit(merchantId,productId,body);
        if (result) {
            const response = h.response({
                status: "succes",
                data:{...result}
            })
            response.code(202)
            return response;
        }
        const response = h.response({
            status: "fail"
        })
        response.code(400)
        return response;
        
    } catch (error) {
            console.log(error);        
        return catchError(error)
    }
}

async function updateProductStock(req,h) {
    const merchantId = req.params.id;
    const productid = req.params.productId;
    const body = req.payload
    try {
        const result = await reStock(merchantId,productid,body);
        const response = h.response({
            status:"accepted",
            data:{...result}
        })
        response.code(202)
        return response;
} catch (error) {
    console.log(error);
    return catchError(error)
    }
}

module.exports = {getProducts,getProduct,createProduct,deleteProduct,editProduct,updateProductStock}