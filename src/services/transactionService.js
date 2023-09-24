const sequelize = require('../config/mysql');
const {nanoid} = require('nanoid');
const { payloadCheck } = require('../utils/payloadcheck');
const  Boom  = require('@hapi/boom');

    async function getOrder(date,merchantId){
        const query = `
        SELECT id,customer_name,customer_table_number,time,total,merchant_id,note
        FROM order_table WHERE transaction_date="${date}" AND merchant_id="${merchantId}"
        `
        const [result,metada] = await sequelize.query(query) 
        if (result.length > 0) {
            return {date:date,transactions:[...result]}
        }
    }

     async function get(merchantId,date) {
        if (!merchantId || !date) {
             throw Boom.badRequest("params must be included")
            }
        const result = await getOrder(date,merchantId)
        if (result) {
            return result
        }
        throw Boom.notFound("order not found")
     }

     async function getAll(merchantId) {
        if (!merchantId) throw Boom.badRequest("merchant params must be included")
        const [result,metadata] = await sequelize.query(`SELECT date FROM transaction WHERE merchant_id="${merchantId}"`)
        if (!result) {
            throw Boom.badRequest("transaction not available")
        }
        let transactions = [];
        for(const element of result){
            const orders = await getOrder(element.date,merchantId);
            transactions.push(orders)
        }

        if (transactions.length > 0) {
            return transactions
        }
        throw Boom.badRequest("invalid merchant");
     }


module.exports = {get,getAll};