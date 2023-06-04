const sequelize = require('../config/mysql');
const {nanoid} = require('nanoid');
const { payloadCheck } = require('../utils/payloadcheck');


async function getAll(merchantId) {
    if(!merchantId){return false}
    const [result,metadata] = await sequelize.query(`SELECT * FROM product WHERE merchant_id = "${merchantId}"`) 
    if (result.length > 0) {
        return [...result]
    }
    return false
}

async function get(merchantId,productId) {

    if (!merchantId || !productId) {
        return false;
    }
    const result = await sequelize.query(`SELECT * FROM product WHERE merchant_id="${merchantId}" AND id="${productId}"`)

    if (result.length > 0) {
        return {...result[0]}
    }
    return false;
}

async function create(merchantId,body) {
    if (!merchantId || !payloadCheck(body)) {
        return false;
    }
    const productId = nanoid();
    const {prdouct_name="",description="",price,category_id=""} = body;
    if (!prdouct_name || !price) {
        return false
    }
    const query = `
    INSERT INTO product (id,name,description,price,category_id,merchant_id,stock) 
    VALUES ("${productId}","${prdouct_name}","${description}","${price}","${category_id}","${merchantId}",0) 
    `
    const [result,metadata] = await sequelize.query(query)

    if (result === 0) {
        return {product_id:productId};
    }
    return false
    
}

async function remove(merchantId,productId) {
    
    const [result,metadata] = await sequelize.query(`DELETE FROM product WHERE id="${productId}" AND merchant_id="${merchantId}"`)

    if (result.affectedRows > 0) {
        return true;
    }
    return false
}

async function edit(merchantId,productId,body) {
    if (!merchantId||!productId || !payloadCheck(body)) {
        return false;
    }

    const fields = ["name", "description", "price", "category_name", "merchant_id", "stock"];
    const temp = Object.keys(body);
    const isValid = temp.every(field => fields.includes(field));

    if (!isValid) {
        return false;
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
        return false
      }
      const query = updateQuery + fieldsQuery + conditionQuery;
      const [result, metadata] = await sequelize.query(query);
      if (result !== 0 && metadata && metadata.affectedRows > 0) {
        return { productId, ...body };
      }
    
      return false;
  

}

async function reStock(merchantId,productId,body) {
    if (!merchantId || !productId || !body) {
        return false;
    }
    const {stock=false} = body
    if (!stock) {return false};
    const result = await sequelize.query(`UPDATE product SET stock="${stock}" WHERE merchant_id="${merchantId}" AND id="${productId}"`)
    if (result) {
        return {merchantId,productId,stock}
    }
    return false
}

module.exports = {getAll,get,create,remove, edit,reStock}