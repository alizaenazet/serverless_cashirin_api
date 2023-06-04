const {getAll,get,create, remove,edit,reStock} = require('../services/productService');


async function getProducts(req,h) {
    const merchantId = req.params.id
    try {
        const result = await getAll(merchantId);
    if (result) {
        const response = h.response({
            status:"succes",
            data:result
        })
        response.code(200)
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
        status:"something wrong"
    })
    response.code(403)
    return response;
    }
}


async function getProduct(req,h) {
    const merchantId = req.params.Id;
    const productId = req.params.productId;
    try {
        const result = await get(merchantId,productId);
        console.log(result);
    if (result) {
        const response = h.response({
            status:"succes",
            data: result[0]
        })
        response.code(202)
        return response;
    }
    const response = h.response({
        status:"fail"
    })
    response.code(404)
    return response;
    
} catch (error) {
    console.log(error);
    const response = h.response({
        status:"something wrong"
    })
    response.code(403)
    return response;
    
    }
}

async function createProduct(req,h) {
    const merchantId = req.params.id;
    const body = req.payload;
    try {
        const result = await create(merchantId,body)
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
        status:"something wrong",
    })
    response.code(403)
    return response
    }
    
}
async function  deleteProduct(req,h) {
    const merchantId = req.params.id;
    const productId = req.params.productId;
    try {
        const result = await remove(merchantId,productId)
        if (result) {
            const response = h.response({
            })
            response.code(204);
            return response;
        }
        const response = h.response({
        })
        response.code(400);
        return response;
        
    } catch (error) {
            console.log(error);        
        const response = h.response({
        status:"something wrong"
        })
        response.code(403);
        return response;
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
        const response = h.response({
            status: "something wrong"
        })
        response.code(403)
        return response;
    }
}

async function updateProductStock(req,h) {
    const merchantId = req.params.id;
    const productid = req.params.productId;
    const body = req.payload
    try {
        const result = await reStock(merchantId,productid,body);
    if (result) {
        const response = h.response({
            status:"accepted",
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
        status:"something wrong"
    })
    response.code(403)
    return response;
    
    }
}

module.exports = {getProducts,getProduct,createProduct,deleteProduct,editProduct,updateProductStock}