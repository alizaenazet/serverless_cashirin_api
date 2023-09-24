const {get,getAll,paymentNotificationsHandle,create,finish} = require('../services/orderService');
const catchError = require('../utils/catchError');

async function getOrder(req,h) {
    const params = req.params;
    try {
        const result = await get(params);
        const response = h.response({
            status:"succes",
            data:{...result},
        })
        response.code(202);
        return response;
} catch (error) {
    console.log(error);
    return catchError(error)
    }

}


async function getAllOrders(req,h) {
    const merchantUsername =  req.params.username;
    try {
        const result = await getAll(merchantUsername);
        const response = h.response({
            status: 'succes',
            data:result
        })
        response.code(200);
        return response;
} catch (error) {
    console.log(error);
    return catchError(error);
    }
}

async function finishOrder(req,h) {
    const params = req.params;
try{
    await finish(params);
        const response = h.response()
        response.code(204)
        return response;
} catch (error) {
    console.log(error);
    return catchError(error)
}
}

async function createOrder(req,h) {
    const merchantId = req.params.id;
    const body = req.payload;
    try {
    const result = await create(merchantId,body);
        const response = h.response({
            status:"created",
            data:{...result}
        })
        response.code(201)
        return response;
} catch (error) {
    console.log(error);
    return catchError(error)
    }
    
}

async function paymentNotifications(req,h) {
    const body = req.payload;
    try {
        const result = await paymentNotificationsHandle(body);
    const response = h.response()
    response.code(204);
    return response;
    } catch (error) {
        console.log(error);
        return catchError(error)
    }
}


module.exports={getOrder,getAllOrders,finishOrder,createOrder,paymentNotifications}