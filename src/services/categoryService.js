const sequelize = require('../config/mysql');
const {nanoid} = require('nanoid');
const { payloadCheck } = require('../utils/payloadcheck');
function castQuertResult(result) {
    let temp = [];
    
    for (let i = 0; i < result.length; i++) {
        const element = result[i];
        temp.push(
            {id,name,description,price,merchant_id,stock} = element
        ) 
    }
    const results = {
        category: result[0].category,
        product : temp
       }
    return results
}

 async function getAll(merchantId) {
    if (!merchantId) {
        return false;
    }
    const query = `
    SELECT 
    category.name AS 'category',
    product.*
FROM 
    product 
JOIN 
    category ON product.category_id = category.id
WHERE 
    category.merchant_id = '${merchantId}';
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
    return false
 }

 async function get(merchantId,categoryId) {
    if (!merchantId,!categoryId) {
        return false;
    }

    const query=`
    SELECT 
    category.name as 'category',
       product.*
     FROM 
    product JOIN category ON product.category_id = category.id
    WHERE category.merchant_id = "${merchantId}" AND category.id ="${categoryId}";
    `;

    const [result,metadata] = await sequelize.query(query)
    if (result.length > 0) {
        return castQuertResult(result)
    }
    return false;

 }
 async function edit(merchantId,categoryId,body) {
    if (!merchantId || !categoryId || !body) {
        return false;}

        const {name=""} = body;
        if (!name) {
            return false;
        }

        const query = `
        UPDATE category SET name="${name}" WHERE id="${categoryId}";
        `

        const [result,metadata] = await sequelize.query(query)

        if (result.affectedRows > 0) {
            return true
        }

        return false;
    
 }

 async function create(merchantId,body) {
    if (!merchantId||!body) {
        return false;
    }
    const id = nanoid()
    const {name=""} = body;
    if (!name) {
        return false
    }
    const query =   `
    INSERT INTO category (id,name,merchant_id) VALUES ("${id}","${name}","${merchantId}") ;
    `
    
    try {
        const [result,metadata] = await sequelize.query(query)
        if (result == 0) {
            return {id:id,name:name}
        }
    
    } catch (error) {
        return false;
    }

    return false
 }

 async function remove(merchantId,categoryId) {
    if (!merchantId || !categoryId) {
        return false;
    }
    const [result,metadat] = await sequelize.query(`DELETE FROM category WHERE merchant_id="${merchantId}" AND id="${categoryId}"`)

    if (result.affectedRows > 0) {
        return true;
    }
    return false;
 }

    async function addProduct(merchantId,categoryId,body) {
        const {productId=""} = body;
        if (!merchantId || !categoryId || !productId) {
            return false;
        }

        const [result,metadata] = await sequelize.query(`UPDATE product SET category_id="${categoryId}" WHERE merchant_id="${merchantId}" AND id="${productId}"`)
        if (result.affectedRows > 0) {
            return true
        }
        return false;
    }

module.exports = {getAll,get,edit,create,remove,addProduct};