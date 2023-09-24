const sequelize = require('../config/mysql');
const {nanoid} = require('nanoid');
const { payloadCheck, payloadCheckProperties } = require('../utils/payloadcheck');
const  Boom  = require('@hapi/boom');


async function getAll(merchantUsername) {
    if(!merchantUsername) throw Boom.badRequest("merchant must be included")
    const query =`
    SELECT product.* 
    FROM
    product
    JOIN 
    merchant ON merchant.id = product.merchant_id
    WHERE merchant.username = '${merchantUsername}'
    ` 
    const [result,metadata] = await sequelize.query(query)
    if (result[0]) {
        return [...result]
    }
    throw Boom.badRequest("merchant not found / product not available")
}

async function get(merchantUsername,productId) {
    if (!merchantUsername || !productId) {
        throw Boom.badRequest("params must be included")
    }
    const query = `
    SELECT product.* 
    FROM
    product
    JOIN 
    merchant ON merchant.id = product.merchant_id
    WHERE product.id = '${productId}' AND merchant.username = '${merchantUsername}'
`
const result = await sequelize.query(query)
    if (result[0].length > 0) {
        return {...result[0]}
    }
    throw Boom.notFound("product not found")
}

async function create(merchantId,body) {
    if (!merchantId) throw Boom.badRequest("params must be included")
    const productId = nanoid();
    const {prdouct_name,description,price,category_id} = payloadCheck(body,["prdouct_name","description","price","category_id"],"properties must be included")
    const query = `
    INSERT INTO product (id,name,description,price,category_id,merchant_id,stock) 
    VALUES ("${productId}","${prdouct_name}","${description}","${price}","${category_id}","${merchantId}",0) 
    `
    console.log("cok");
        const [result,metadata] = await sequelize.query(query)
        .catch((error)=>{
            if (error.parent.code == "ER_NO_REFERENCED_ROW_2") {
             throw Boom.notFound("merchant not found")   
            }
        })
    if (result === 0) {
        return {product_id:productId};
    }
    throw Boom.badImplementation("create fail")
}

async function remove(merchantId,productId) {
    const [result,metadata] = await sequelize.query(`DELETE FROM product WHERE id="${productId}" AND merchant_id="${merchantId}"`)
    if (result.affectedRows > 0) {
        return true;
    }
    throw Boom.badRequest("product not available")
}

async function edit(merchantId,productId,body) {
    if (!merchantId||!productId) throw Boom.badRequest("params must be included")
    const fields = ["name", "description", "price", "category_name", "merchant_id", "stock"];
    const temp = Object.keys(body);
    const isValid = temp.every(field => fields.includes(field));
    if (!isValid) {
        throw Boom.badRequest("properties invalid")
      }
    
      let updateQuery = "UPDATE product SET ";
      let fieldsQuery = "";
      let conditionQuery = ` WHERE merchant_id="${merchantId}" AND id = "${productId}"`;
      
      for (const [prop, value] of Object.entries(body)) {
        fieldsQuery = fieldsQuery + ` ${prop}="${value}"`;
        if(Object.keys(body).indexOf(prop) !== Object.keys(body).length -1){
          fieldsQuery = fieldsQuery + ","
        }
      }
      if (!fieldsQuery) {
        throw Boom.badRequest("properties not included")
      }
      const query = updateQuery + fieldsQuery + conditionQuery;
      const [result, metadata] = await sequelize.query(query);
      if (result !== 0 && metadata && metadata.affectedRows > 0) {
        return { productId, ...body };
      }
    
    throw Boom.badRequest("nothing updated")
}

async function reStock(merchantId,productId,body) {
    if (!merchantId || !productId) throw Boom.badRequest("params must be included");
    const {stock} = payloadCheckProperties(body,["stock"],"must be included")
    const result = await sequelize.query(`UPDATE product SET stock="${stock}" WHERE merchant_id="${merchantId}" AND id="${productId}"`)
    console.log("result");
    if (result[0].affectedRows > 0) {
        return {merchantId,productId,stock}
    }
    throw Boom.badRequest("merchant/product `id` invalid")
}

module.exports = {getAll,get,create,remove, edit,reStock}