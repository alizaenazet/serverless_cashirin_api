

const axios = require('axios');
const sequelize = require('../config/mysql');
const {nanoid} = require('nanoid');
const { getCurrentTime, getCurrentDate } = require('../utils/dateTime');
const Boom  = require('@hapi/boom');
const { payloadCheckProperties } = require('../utils/payloadcheck');


async function get(params) {
    const {username,id} = payloadCheckProperties(params,["username","id"],"params must be included")
    merchantUsername = username;
    orderId =id;
    const query = `
    SELECT 
    order_table.id AS no_order,
    order_table.customer_table_number AS no_meja,
    order_table.customer_name AS atas_nama,
    merchant.name AS merchant,
    order_table.note,
    order_table.transaction_date AS date,
    order_table.total,
    product.id AS product_id,
    product.name AS product_name,
    product.price AS price,
    order_product.qty AS qty,
    invoice.payment_type_code AS payment,
    invoice.status_type_code AS status


    FROM
    order_table 
    JOIN order_product ON order_table.id = order_product.order_id
    JOIN product ON order_product.product_id = product.id
    JOIN merchant ON product.merchant_id = merchant.id
    JOIN invoice ON invoice.order_id = order_table.id

    WHERE 
    order_table.id = "${orderId}" AND merchant.username = "${merchantUsername}" 
    `;

    const [result,metadata] = await sequelize.query(query) //object is not iterable (cannot read property Symbol(Symbol.iterator))
    if(result.length > 0){
        return castQuertResult(result);
    }
    throw Boom.notFound("no order available for this merchant by request")
}


async function getAll(merchantUsername) {
    if (!merchantUsername) throw Boom.badRequest("params not included")
    const query = `
    SELECT 
    order_table.id AS no_order,
    order_table.customer_table_number AS no_meja,
    order_table.customer_name AS atas_nama,
    merchant.name AS merchant,
    order_table.note,
    order_table.transaction_date AS date,
    order_table.total,
    product.id AS product_id,
    product.name AS product_name,
    product.price AS price,
    order_product.qty AS qty,
    invoice.payment_type_code AS payment,
    invoice.status_type_code AS status


    FROM
    order_table 
    JOIN order_product ON order_table.id = order_product.order_id
    JOIN product ON order_product.product_id = product.id
    JOIN merchant ON product.merchant_id = merchant.id
    JOIN invoice ON invoice.order_id = order_table.id

    WHERE 
    merchant.username = "${merchantUsername}" 
    `;
    const [result,metadata] = await sequelize.query(query);

    let orders = [];
    if (result.length > 0) {
        let tempOrderId = result[0].no_order;
        let tempObj = []
        for (let i = 0; i < result.length; i++) {
            const element = result[i];
            if (tempOrderId == element.no_order ) {
                tempObj.push(element);
                if(i == (result.length -1)){
                    orders.push(castQuertResult(tempObj));    
                }
            }else{
                tempOrderId = element.no_order;
                orders.push(castQuertResult(tempObj));
                tempObj = [];
                i--

            }
        }
        orders.push(castQuertResult(tempObj))
        return orders;    
    }
    throw Boom.notFound("no orders available for this merchant")
}

async function finish(params) {
    const {username,id} = payloadCheckProperties(params,["id","username"],"params must be included")
    const orderId = id;
    const merchantUsername = username;
    const query = `
    UPDATE invoice 
JOIN
 order_table ON order_table.id = invoice.order_id 
JOIN merchant ON merchant.id = order_table.merchant_id
SET invoice.status_type_code = 'finish'
WHERE invoice.order_id = '${orderId}' AND merchant.username = '${merchantUsername}'
    `
    const [result,metadata] = await sequelize.query(query)
    if (result.affectedRows > 0) {
        return true
    }
    throw Boom.notFound("the order not found");
}
    
async function create(merchantId,body) {
    if (!merchantId) throw Boom.badRequest("merchant ID must be included")
    const {no_meja,atas_nama,orders,total,note} = payloadCheckProperties(body,["no_meja","atas_nama","orders","total","note"],"properties must be included"); 
    const time = getCurrentTime();
    const date = getCurrentDate();
    const orderId = nanoid();
    const invoiceId = nanoid();
    const isFirst = await sequelize.query(`SELECT * FROM transaction  WHERE merchant_id="${merchantId}"  ORDER BY date DESC LIMIT 1`)
    const currentDateOrder = isFirst[0].length > 0 ?  isFirst[0][0].date : false;
    if (currentDateOrder != date) {
        const createTransaction = await sequelize.query(`INSERT INTO transaction (date, start_time, merchant_id) VALUES ('${date}', '${date} ${time}', '${merchantId}')`);
    }
    const insertOrderQuery = 
    `INSERT INTO order_table (id,customer_name,customer_table_number,time,total,transaction_date,merchant_id,note) 
    VALUES ("${orderId}","${atas_nama}","${no_meja}","${time}","${total}","${date}","${merchantId}","${note}")`
    const createOrder = await sequelize.query(insertOrderQuery)
    if (createOrder) {
        const insertInvoiceQuery = `
        INSERT INTO invoice (invoice_id,order_id,status_type_code,payment_type_code) VALUES ("${invoiceId}","${orderId}","pending","pending")
        `
        const createInvoice = await sequelize.query(insertInvoiceQuery);
        if (createInvoice) {
            orders.map(async (product) =>{
                const orderProductId = nanoid();
                const insertProductOrderQuery = `
                INSERT INTO order_product (order_product_id,order_id,product_id,qty) VALUES ("${orderProductId}","${orderId}","${product.id}","${product.qty}")
                `
                const insertOrderProuct = await sequelize.query(insertProductOrderQuery);

            })
        }
        const {token,redirect_url} = await snapTransaction(orderId,total)
        return {orderId,invoiceId,payment:{token,redirect_url}}
    }
}

async function paymentNotificationsHandle(body) {
    try {
        const{order_id,transaction_status,payment_type} = body;
        const paymentType = payment_type.replace(/[_-]/g, " ").replace(/\d/g, "");
        switch (transaction_status) {
            case "settlement":
            case "capture":
                const processQuery = `UPDATE invoice SET status_type_code="process",payment_type_code="${(paymentType.toUpperCase())}" WHERE order_id="${order_id}"`;
                await sequelize.query(processQuery)
                break;
                case "refund":
                    const refundQuery = `UPDATE invoice SET status_type_code="refund",payment_type_code="${(paymentType.toUpperCase())}" WHERE order_id="${order_id}"`;
                    await sequelize.query(refundQuery)
                    break;
                    case "panding":
                        break;
                        
                        default:
                            const cancelQuery = `UPDATE invoice SET status_type_code="cancel",payment_type_code="${(paymentType.toUpperCase())}" WHERE order_id="${order_id}"`;
                            await sequelize.query(cancelQuery)
                break;
        }
    } catch (error) {
        throw  Boom.notImplemented(error);
    }
}


async function snapTransaction(orderId,total) {
    const enabled_payments= [
        "credit_card", "mandiri_clickpay", "cimb_clicks", "bca_klikbca", "bca_klikpay", 
        "bri_epay", "echannel", "mandiri_ecash", "permata_va", "bca_va", "bni_va", 
        "other_va", "gopay", "indomaret", "alfamart", "danamon_online", "akulaku"
        ]
   try {
    const {data} = await axios.post('https://app.sandbox.midtrans.com/snap/v1/transactions', {
        "transaction_details": {
            "order_id": orderId,
            "gross_amount": total
          },
          "enabled_payments": enabled_payments
  }, {
    headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': 'Basic U0ItTWlkLXNlcnZlci1Gd1FhOVRwM3p3dVRfbUoydFd4WkpsalE6',
    }
})  
return data;
   } catch (error) {
    throw Boom.badRequest(error)
   }
    
}



function castQuertResult(result) {
    let temp = [];

    for (let i = 0; i < result.length; i++) {
        const element = result[i];
        temp.push(
            {
            id : element.product_id,
            product_name : element.product_name,
            price : element.price,
            qty : element.qty
        }
        ) 
    }
   const resultTemp = result[0];
    const order = {
        no_order : resultTemp.no_order,
        no_meja : resultTemp.no_meja,
        atas_nama : resultTemp.atas_nama,
        merchant : resultTemp.merchant,
        note : resultTemp.note,
        date : resultTemp.date,
        total : resultTemp.total,
        payment : resultTemp.payment,
        status : resultTemp.status,
        products : temp
    }
    return order
    
}

module.exports = {get, getAll,finish,create,paymentNotificationsHandle}