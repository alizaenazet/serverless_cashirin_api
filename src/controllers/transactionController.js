const {get,getAll} = require('../services/transactionService');
const catchError = require('../utils/catchError');

    async function getTransaction(req,h) {
        const merchantId = req.params.id;
        const date = req.params.date
        try {
            const result = await get(merchantId,date);

            const response = h.response({
                status:"succes",
                data:{...result}
            })
            response.code(200)
            return response;    
    } catch (error) {
        console.log(error);
        return catchError(error)
        }
        
    }

    async function getTransactions(req,h) {
        const merchantId = req.params.id;
        try {
            const result = await getAll(merchantId)
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


module.exports = {getTransaction,getTransactions}