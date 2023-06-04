


const sequelize = require('../config/mysql');
const {nanoid} = require('nanoid');
const { getCurrentTime, getCurrentDate } = require('../utils/dateTime');


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

async function get(merchantUsername,orderId) {
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
    return false;
}


async function getAll(merchantUsername) {
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
    return false;

}

async function finish(merchantUsername,orderId) {
    
    const [result,metadata] = await sequelize.query(`UPDATE invoice SET status_type_code="finish" WHERE order_id="${orderId}" AND  status_type_code != "finish"`)

    if (result.affectedRows > 0) {
        return true
    }
    return false;
}
    
async function create(merchantId,body) {
    let isSucces = false
    if(!body) return false;
    const {no_meja,atas_nama,orders,payment,total,note} = body; //TypeError: body is not iterable
    const time = getCurrentTime();
    const date = getCurrentDate();
    const orderId = nanoid();
    
    const invoiceId = nanoid();
    const isFirst = await sequelize.query(`SELECT * FROM transaction  WHERE merchant_id="${merchantId}"  ORDER BY date DESC LIMIT 1`)
    

    const currentDateOrder = isFirst[0].length > 0 ?  isFirst[0][0].date : false;


    // return false
    if (currentDateOrder != date) {

        const createTransaction = await sequelize.query(`INSERT INTO transaction (date, start_time, merchant_id) VALUES ('${date}', '${date} ${time}', '${merchantId}')`);
    }

    const insertOrderQuery = 
    `INSERT INTO order_table (id,customer_name,customer_table_number,time,total,transaction_date,merchant_id,note) 
    VALUES ("${orderId}","${atas_nama}","${no_meja}","${time}","${total}","${date}","${merchantId}","${note}")`
    const createOrder = await sequelize.query(insertOrderQuery)
    if (createOrder) {
        const insertInvoiceQuery = `
        INSERT INTO invoice (invoice_id,payment_type_code,order_id,status_type_code) VALUES ("${invoiceId}","${payment}","${orderId}","Process")
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
    }
    
    return {orderId,invoiceId}

}

module.exports = {get, getAll,finish,create}