const Boom = require('@hapi/boom');
const sequelize = require('../config/mysql');
const {nanoid} = require('nanoid');
require('dotenv').config();
const { payloadCheckProperties } = require('../utils/payloadcheck');
const { generateTokenFb, rovokeTokenFb } = require('../config/firebaseAdmin');
const {mongoClient,connectToMongoDB,closeMongoDBConnection} = require('../config/mongoDb');
const {createMerchantAccountSchema}  = require('../utils/mongoSchema');

async function deleteImage(username,url) {
    if (!username) throw Boom.badRequest("username not included");
    if (!url)  throw Boom.badRequest("url not included");
    const isAvailable = await getMerchant(username)
    if (!isAvailable) throw Boom.badRequest("merchant not available")
    await deleteImageCollectionMongoDb(username,url)
}

async function uploadImage(username,url) {
    if (!username) throw Boom.badRequest("username not included");
    const isAvailable = await getMerchant(username)
    if (!isAvailable) throw Boom.badRequest("merchant not available")
    await uploadImageCollectionMongoDb(username,url);
}

async function login(username,payload) {
    if(username == undefined || !username){ const error = Boom.badRequest("username must be required"); throw error}
    if(!payload || !payload.password){ throw Boom.badRequest("password must be required"); }
    const {password} = payload;
    const [result,metadata] = await sequelize.query(`SELECT id,name as merchant_name FROM merchant WHERE username="${username}" AND password="${password}"`)
    if (result.length > 0) {
      const merchant = result[0]
        const token = await generateTokenFb(merchant.id,"merchant")
       return {
            token:token,
            merchant
       }
    }
    throw Boom.unauthorized("username/password not valid")
}

async function register(payload) {
    const properties = ["username","password","merchant_name"] ;
    const {username,password,merchant_name} = payloadCheckProperties(payload,properties,"not required");
   const isAvailable = await getMerchant(username);

    if (isAvailable) {throw Boom.conflict("merchant username already used")}
    const id = nanoid();
    const query = `INSERT INTO merchant (id,username,password,name) VALUES ("${id}","${username}","${password}","${merchant_name}")`
    const [result,metadata] = await sequelize.query(query)
    if (result == 0) {
        createProfile(username)
        await insertMongoMerchantBasicAccount(username,merchant_name)
        return {
            id,
            merchant_name
        }
    }
    throw Boom.notImplemented("register failed")
}

async function uploadBaner(username,url) {
    if (!username) {return false}
    const query = `UPDATE merchant_profile SET baner_url = "${url}" WHERE merchant_username="${username}"`;
    const [result,metadata] = await sequelize.query(query)
    if (result.affectedRows > 0) {
        await updateBannerMerchantMongoDb(username,url)
        return true
    }
    return false;
}

async function uploadLogo(username,url) {
    if (!username) {return false}
    const queryLogo = `UPDATE merchant_profile SET logo_url = "${url}" WHERE merchant_username="${username}"`
    const [result,metadata] = await sequelize.query(queryLogo)
    if (result.affectedRows > 0) {
        await updateLogoMerchantMongoDb(username,url)
        return true
    }
    return false
}

async function createProfile(username) {
    if (!username) {
        return false;
    }
    const id = nanoid()
    const query = `INSERT INTO merchant_profile (id,merchant_username) VALUES ("${id}","${username}")`;
    const [result,metadata] = await sequelize.query(query)
    if (result==0) {
        return true
    }
    return false
}

async function getProfileAccount(username) {
    const query = `SELECT id,merchant_username,logo_url,baner_url,phone FROM merchant_profile WHERE merchant_username="${username}"`
    const [result,metadata] = await sequelize.query(query)
    if (result.length > 0) {
        return {...result[0]}
    }
    throw Boom.badRequest("merchant not found")
}

async function editProfile(username,body) {
    if (!body||!username) {
        throw Boom.badRequest("no properties provided")
    }
    const fields = ["address","phone"];
    const temp = Object.keys(body);
    const isValid = temp.every(field => fields.includes(field));
  
    if (!isValid) {
      throw Boom.badRequest("invalid properties")
    }

let updateQuery = "UPDATE merchant_profile SET ";
    let fieldsQuery = "";
    let conditionQuery = ` WHERE merchant_username = "${username}"`;
    const updateMongoProperties = {}
    for (const [prop, value] of Object.entries(body)) {
      fieldsQuery = fieldsQuery + ` ${prop}="${value}"`;
      updateMongoProperties[prop] = value;
      if(Object.keys(body).indexOf(prop) !== Object.keys(body).length -1){
        fieldsQuery = fieldsQuery + ","
      }
    }
  
    const query = updateQuery + fieldsQuery + conditionQuery;
    const [result, metadata] = await sequelize.query(query);
    if (result !== 0 && metadata && metadata.affectedRows > 0) {
        const updateMongoDb = {
            $set:updateMongoProperties
        }

            
            const clientMDB = mongoClient.db("Merchant_account_profile").collection("merchant informations");
            await clientMDB.updateOne({username:username},updateMongoDb)
            .catch((error)=>{console.log(error); throw Boom.badImplementation(error)});
      return { username, ...body };
    }
  
    throw Boom.notImplemented("nothing is updated")
}


async function logout(token) {
    try {
        await rovokeTokenFb(token)
    return true;
    } catch (error) {
        throw Boom.badRequest(error)
    }
}





async function insertMongoMerchantBasicAccount(username,name) {

    const collection = mongoClient.db("Merchant_account_profile").collection("merchant informations")
        const documentTemp = new createMerchantAccountSchema(username,name);
        const newMerchant = documentTemp.getAsSchemaObj()
        await collection.insertOne(newMerchant).catch((error) => {throw Boom.badImplementation(error.message)});
}

  async function updateLogoMerchantMongoDb(username,url) {
        const updateMongoDb = {
            $set:{logo_url:url}
        }
        const clientMDB = mongoClient.db("Merchant_account_profile").collection("merchant informations");
        await clientMDB.updateOne({username:username},updateMongoDb)
        .then((result)=>console.log(result))
            .catch((error)=>{throw Boom.badImplementation(error)});
}

async function getMerchant(username) {
    if (!username) {return null}
    const query = `
    SELECT merchant.*,
     account.id as owner
      FROM merchant 
      JOIN account 
      ON merchant.username = account.merchant_username 
      WHERE merchant.username="${username}" AND account.role_name="owner"
    `
    const [result,metadata] = await sequelize.query(query)
    if (result.length > 0) {
        return result[0]
    }
    return false
}

async function updateBannerMerchantMongoDb(username,url) {
        const updateMongoDb = {
            $set:{banner_url:url}
        }
        
        const clientMDB = mongoClient.db("Merchant_account_profile").collection("merchant informations");
        await clientMDB.updateOne({username:username},updateMongoDb)
            .catch((error)=>{throw Boom.badImplementation(error)});
}

async function deleteImageCollectionMongoDb(username,imageUrl) {
    const update = {
        $pull: {
          image_collection: imageUrl
        }
      };
        
        const clientMDB = mongoClient.db("Merchant_account_profile").collection("merchant informations");
        const {modifiedCount} = await clientMDB.updateOne({username:username},update)
        .catch((error)=>{throw Boom.badImplementation(error)})
        if (modifiedCount < 1) throw Boom.badRequest("not modified");
}

async function uploadImageCollectionMongoDb(username,imageUrl) {
    const update = {
        $push: {
          image_collection: imageUrl
        }
      };
        
        const clientMDB = mongoClient.db("Merchant_account_profile").collection("merchant informations");
        const {modifiedCount} = await clientMDB.updateOne({username:username},update)
        .catch((error)=>{throw Boom.badImplementation(error)})
        if (modifiedCount < 1) throw Boom.badRequest("not modified")
}


module.exports = {login,register,uploadBaner,editProfile,uploadLogo,getMerchant,getProfileAccount,createProfile,logout,uploadImage,deleteImage};