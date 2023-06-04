const {get,getAll} = require('../services/transactionService');

    async function getTransaction(req,h) {
        const merchantId = req.params.id;
        const date = req.params.date
        try {
            const result = await get(merchantId,date);
        if (result) {
            const response = h.response({
                status:"succes",
                data:{...result}
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

    async function getTransactions(req,h) {
        const merchantId = req.params.id;
        try {
            const result = await getAll(merchantId)
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
        response.code(300)
        return response;
    } catch (error) {
        console.log(error);
        const response = h.response({
            status:"fail"
        })
        response.code(300)
        return response;
        }
    }


module.exports = {getTransaction,getTransactions}