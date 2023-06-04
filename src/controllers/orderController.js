const {get,getAll,create,finish} = require('../services/orderService');

async function getOrder(req,h) {
    const merchantUsername = req.params.username;
    const orderId = req.params.id;
    try {
        const result = await get(merchantUsername,orderId);
    if (result) {
        const response = h.response({
            status:"succes",
            data:{...result},
        })
        response.code(200);
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


async function getAllOrders(req,h) {
    const merchantUsername =  req.params.username;
    try {
        const result = await getAll(merchantUsername);
    if (result) {
        const response = h.response({
            status: 'succes',
            data:result
        })
        response.code(200);
        return response;
    }
    const response  = h.response({
        status:"fail"
    })
    response.code(404)
    return response;
} catch (error) {
    console.log(error);
    const response  = h.response({
        status:"something wrong"
    })
    response.code(403)
    return response;
    }
}

async function finishOrder(req,h) {
    const merchantUsername = req.params.username;
    const userId = req.params.id;
    try {
        const result = await finish(merchantUsername,userId);
    if (result) {
        const response = h.response()
        response.code(204)
        return response;
    }
    const response = h.response();
    response.code(400)
    return response;
} catch (error) {
    console.log(error);
    const response = h.response({
        status:"something wrong"
    });
    response.code(403)
    return response;
    }
}

async function createOrder(req,h) {
    const merchantId = req.params.id;
    const body = req.payload;
    try {
    const result = await create(merchantId,body);
    console.log(result);
    if (result) {
        const response = h.response({
            status:"created",
            data:{...result}
        })
        response.code(201)
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


module.exports={getOrder,getAllOrders,finishOrder,createOrder}