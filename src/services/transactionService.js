const sequelize = require('../config/mysql');
const {nanoid} = require('nanoid');
const { payloadCheck } = require('../utils/payloadcheck');

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
             return false;
            }
        const result = await getOrder(date,merchantId)
        console.log(result);
        if (result) {
            return result
        }

        return false;
     }

     async function getAll(merchantId) {
        if (!merchantId) {
            return false;
        }
        const [result,metadata] = await sequelize.query(`SELECT date FROM transaction WHERE merchant_id="${merchantId}"`)
        if (!result) {
            return false;
        }
        let transactions = [];
        for(const element of result){
            const orders = await getOrder(element.date,merchantId);
            transactions.push(orders)
        }

        if (transactions) {
            return transactions
            
        }
        
        return false;
     }


module.exports = {get,getAll};