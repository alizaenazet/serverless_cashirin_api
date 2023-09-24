const sequelize = require('../config/mysql');
const {nanoid} = require('nanoid');
const { payloadCheck, payloadCheckProperties } = require('../utils/payloadcheck');
const  Boom  = require('@hapi/boom');
const {sqlInfoToObj} = require('../utils/sqlInfoConvert.JS');

function castQuertResult(result) {
    let temp = [];
   if (result.length > 1) {
    for (let i = 0; i < result.length; i++) {
        const element = result[i];
        temp.push(
            {id,name,description,price,merchant_id,stock} = element
        ) 
    }
   }
    const results = {
        category: result[0].category,
        id: result[0].category_id,
        product : temp
       }
    return results
}

 async function getAll(merchantId) {
    if (!merchantId) throw Boom.badRequest("merchantId must be included")
    const query = `
    SELECT 
    category.name AS 'category',
    category.id AS 'category_id',
    product.id,
    product.name,
    product.description,
    product.price,
    product.merchant_id,
    product.stock
    FROM 
    category
    LEFT JOIN 
    product ON product.category_id = category.id
        AND product.merchant_id = category.merchant_id
    WHERE 
    category.merchant_id =  '${merchantId}';
            `

    const [result,metada] = await sequelize.query(query)
    let categories = [];
    if (result.length > 0) {
        let categoryName = result[0].category;
        let tempObj = []
        for (let i = 0; i < result.length; i++) {
            const element = result[i];
            if (categoryName == element.category ) {
                tempObj.push(element);
                if (i == (result.length - 1)) {
                    categories.push(castQuertResult(tempObj));
                }
            }else{
                categoryName = element.category;
                if (tempObj.length > 0) {
                    categories.push(castQuertResult(tempObj));
                }
                tempObj = [];
                i--;
            }
        }

        return categories
    }
    throw Boom.badRequest("merchant not found / category not available")
 }

 async function get(merchantId,categoryId) {
    if (!merchantId,!categoryId)  throw Boom.badRequest("merchantId must be included");

    const query=`
    SELECT 
    category.name AS 'category',
    category.id AS 'category_id',
    product.id,
    product.name,
    product.description,
    product.price,
    product.merchant_id,
    product.stock
     FROM 
    product JOIN category ON product.category_id = category.id
    WHERE category.merchant_id = "${merchantId}" AND category.id ="${categoryId}";
    `;

    const [result,metadata] = await sequelize.query(query)
    if (result.length > 0) {
        return castQuertResult(result)
    }
    throw Boom.badRequest("merchant not found / category not available")
 }

 async function edit(merchantId,categoryId,body) {
    if (!merchantId || !categoryId) throw Boom.badRequest("params must be included")
        const {name} = payloadCheckProperties(body,["name"],"property must be included");

        const query = `
        UPDATE category SET name="${name}" WHERE id="${categoryId}";
        `
        const [result,metadata] = await sequelize.query(query)
        const sqlInfo = sqlInfoToObj(result.info)
        if (sqlInfo.changed > 0) {
            return true
        }
        if (sqlInfo.rowsMatched > 0) {
            throw Boom.badRequest("nothing change")
        }
        throw Boom.badRequest("merchant not found / category not available")
 }

 async function create(merchantId,body) {
    if (!merchantId) throw Boom.badRequest("params must be included");
    const id = nanoid()
    const {name} = payloadCheckProperties(body,["name"],"property must be included");

    const isAvailable = await sequelize.query(`SELECT name FROM category WHERE merchant_id='${merchantId}' AND name='${name}'`)
    console.log(isAvailable);
    if (isAvailable.length > 0) {
        throw Boom.badRequest("Name alredy used")
    }
    const query =   `
    INSERT INTO category (id,name,merchant_id) VALUES ("${id}","${name}","${merchantId}") ;
    `
        const [result,metadata] = await sequelize.query(query)
        if (result == 0) {
            return {id:id,name:name}
        }
        throw Boom.badRequest("merchant invalid merchant")
 }

 async function remove(merchantId,categoryId) {
    if (!merchantId || !categoryId) throw Boom.badRequest("merchant & category `id` must be included")
    const [result,metadat] = await sequelize.query(`DELETE FROM category WHERE merchant_id="${merchantId}" AND id="${categoryId}"`)
    if (result.affectedRows > 0) {
        return true;
    }
    throw Boom.badRequest("invalid merchant / category `id` ")
 }

    async function addProduct(merchantId,categoryId,body) {
        if (!merchantId || !categoryId)  throw Boom.badRequest("params must be included");
        const {productId} = payloadCheckProperties(body,["productId"],"must be included");
        const [result,metadata] = await sequelize.query(`UPDATE product SET category_id="${categoryId}" WHERE merchant_id="${merchantId}" AND id="${productId}"`)
        if (result.affectedRows > 0) {
            return true
        }
    throw Boom.badRequest("invalid merchant / category `id` ")

    }

module.exports = {getAll,get,edit,create,remove,addProduct};