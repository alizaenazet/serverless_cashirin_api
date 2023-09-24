

const Boom  = require('@hapi/boom');
const { generateTokenFb } = require('../config/firebaseAdmin');
const sequelize = require('../config/mysql');
const {nanoid} = require('nanoid');
const { payloadCheckProperties } = require('../utils/payloadcheck');

async function getUser(username) {
    const [result,metadata] = await sequelize.query(`SELECT * FROM account WHERE username="${username}" AND role_name="user"`)
    if (result.length > 0) {
        return result
    }
    return false
}

async function login(merchant,body) {
if (!merchant||!body) throw Boom.badRequest("Merchant username/body not included")

const {username,password} = body;
const [result,metadata] = await sequelize.query(`SELECT * FROM account WHERE merchant_username="${merchant}" AND username="${username}" AND password="${password}" AND role_name="user"`)
if (result.length > 0) {
  const token = await generateTokenFb(result[0].id,"user")
    return{
      user:{
        ...result[0]
      },
        token
    }
}
throw Boom.badRequest("username/password not valid")
}

async function singup(merchant,body) {
    if (!merchant || !body) throw Boom.badRequest("Merchant username/body not included");
    const {username,password,firstname,lastname,date_of_birth,gender,phone} = payloadCheckProperties(body,["username","password","firstname","lastname","date_of_birth","gender","phone"],"registration required :");
    const isAvailable = await getUser(username); // buat cek apakah sudah ada atau belum 
    if (isAvailable) throw Boom.badRequest("user alredy exist")
    const id = nanoid();
    const query = 
    `INSERT INTO account (id,username,first_name,last_name,password,birthdate,phone,gender_type,role_name,merchant_username)
     VALUES ("${id}","${username}","${firstname}","${lastname}","${password}","${date_of_birth}","${phone}","${gender}","user","${merchant}")`
    const [result,metadata] = await sequelize.query(query)
    if (result == 0) {
        return {
            id : id,
            username : username,
            firstname : firstname,
            lastname : lastname,
            role: "user"
        }
    }
    throw Boom.notImplemented("register failed")
}

async function remove(merchantUsername,userId) {
    if (!merchantUsername || !userId) throw Boom.badRequest("Merchant username/body not included");
    const [result,metadata] = await sequelize.query(`DELETE FROM account WHERE merchant_username="${merchantUsername}" AND id="${userId}" AND role_name="user"`)
    if (result.affectedRows > 0) {
        return true
    }
    throw Boom.badImplementation("remove failed")
}

// 
async function edit(merchantUsername, userId, body) {
    if (!merchantUsername || !userId || !body) throw Boom.badRequest("merchant username/userId/Body not included");
  
    const fields = ["first_name", "last_name", "username", "password", "birthdate", "phone", "gender_type", "merchant_username"];
    const temp = Object.keys(body);
    const isValid = temp.every(field => fields.includes(field));
  
    if (!isValid) throw Boom.badRequest("body properties unvalid");
  
    let updateQuery = "UPDATE account SET ";
    let fieldsQuery = "";
    let conditionQuery = ` WHERE merchant_username = "${merchantUsername}" AND id = "${userId}" AND role_name="user" `;
  
    for (const [prop, value] of Object.entries(body)) {
      fieldsQuery = fieldsQuery + ` ${prop}="${value}"`;
      if(Object.keys(body).indexOf(prop) !== Object.keys(body).length -1){
        fieldsQuery = fieldsQuery + ","
      }
    }
  if (!fieldsQuery) throw Boom.badRequest("no properties edit");
    
  const query = updateQuery + fieldsQuery + conditionQuery;
    const [result, metadata] = await sequelize.query(query);
    if (result !== 0 && metadata && metadata.affectedRows > 0) {
      return { userId, ...body };
    }
  
    throw Boom.badRequest("nothing change")
  }

  async function get(merchantUsername,userId) {
    if (!merchantUsername || !userId) throw Boom.badRequest("Merchant username/userId not included");
    const [result,metadata] = await sequelize.query(`SELECT * FROM account WHERE id="${userId}" AND merchant_username="${merchantUsername}" AND role_name="user" `)
    if (result.length > 0) {
        return {...result[0]}
    }
    throw Boom.badRequest("user not found");
  }  

module.exports = {login,singup,remove,edit,get}